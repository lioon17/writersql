require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');
const moment = require('moment');
const cors = require('cors');
const fs = require('fs');

const mysql = require("mysql2/promise");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const multer = require('multer');

const { dbConnection, initializeDatabase } = require('./config/db'); // Updated import
const authRoutes = require('./routes/auth')(dbConnection); // Pass dbConnection


const protect = require('./middleware/auth');
const isAdmin = require('./middleware/admin');
const Counter = require('./models/counter'); // Ensure the correct path to the Counter model

const feedbackRoutes = require('./routes/feedback');





const app = express();
const port = process.env.PORT || 3000;
const hostname = 'localhost';

// Remove duplicate Order model declaration
// const Order = mongoose.model('Order', orderSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore({}, dbConnection), // Ensure proper parentheses usage
  })
);

app.use('/api/auth', authRoutes);
app.use('/api', feedbackRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Middleware to make the session available to templates
app.use((req, res, next) => {
  res.locals.user = req.session.userId ? req.session.userId : null;
  next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


 // Adjust the path as needed



// Initialize database
initializeDatabase();


// Additional Routes
app.get('/', (req, res) => res.render('index'));
app.get('/order', protect, (req, res) => res.render('order'));
app.get('/pricing', (req, res) => res.render('pricing'));
app.get('/review', protect, (req, res) => res.render('review'));
app.get('/sample', (req, res) => res.render('sample'));
app.get('/login', (req, res) => res.render('login'));




app.get('/contact', (req, res) => res.render('contact'));


app.get("/customer", protect, async (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  try {
    // Query to fetch orders for the logged-in user
    const [orders] = await dbConnection.query(
      'SELECT * FROM orders WHERE userId = ?',
      [req.session.userId]
    );

   

    res.render("customer", { user: req.session.user, orders });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


app.get('/dashboard', protect, isAdmin, async (req, res) => {
  try {
      const [transactions] = await dbConnection.query('SELECT * FROM transactions');
      const [orders] = await dbConnection.query('SELECT * FROM orders');

      // Parse JSON string for the files field
      orders.forEach(order => {
        if (typeof order.files === 'string') {
          try {
            order.files = JSON.parse(order.files);
          } catch (e) {
            order.files = []; // Handle JSON parse error
          }
        }
      });

      res.render('dashboard', { transactions, orders });
  } catch (err) {
      console.error('Error fetching transactions or orders:', err);
      res.status(500).send('Error fetching transactions or orders');
  }
});



app.get('/paypal-client-id', (req, res) => {
  res.json({ clientId: process.env.PAYPAL_CLIENT_ID });
});


app.get('/order-summary', (req, res) => {
  res.render('order-summary', {
      paypalClientId: process.env.PAYPAL_CLIENT_ID
  });
});

 // Multer storage setup
 const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.post("/order", protect, upload.array("additionalMaterials", 12), async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const files = req.files ? req.files.map((file) => file.filename) : [];

    const orderData = {
      userId: req.session.userId,
      serviceType: req.body.serviceType,
      paperType: req.body.paperType,
      paperDetails: req.body.paperDetails || '',
      paperFormat: req.body.paperFormat || '',
      referenceCount: req.body.referenceCount || 0,
      academicLevel: req.body.academicLevel || '',
      pageCount: req.body.pageCount || 1,
      spacing: req.body.spacing || '',
      urgency: req.body.urgency || '',
      additionalInstructions: req.body.additionalInstructions || '',
      additionalServices: JSON.stringify(req.body.additionalServices || {}),
      notifications: JSON.stringify(req.body.notifications || {}),
      email: req.body.email || '',
      phoneNumber: req.body.phoneNumber || '',
      fullName: req.body.fullName || '',
      preferredContactMethod: req.body.preferredContactMethod || '',
      totalPrice: req.body.totalPrice || 0.00,
      files: JSON.stringify(files),
      paymentStatus: "Not Paid",
    };

    const insertOrderQuery = `
      INSERT INTO orders (userId, serviceType, paperType, paperDetails, paperFormat, referenceCount, academicLevel, pageCount, spacing, urgency, additionalInstructions, additionalServices, notifications, email, phoneNumber, fullName, preferredContactMethod, totalPrice, files, paymentStatus)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const result = await dbConnection.query(insertOrderQuery, Object.values(orderData));
    const newOrderId = result[0].insertId;

    res.json({ id: newOrderId });
  } catch (err) {
    console.error(err);
    res.status(400).send("Error: " + err);
  }
});



app.post('/order/payment', protect, async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const { paypalDetails, orderId } = req.body;

    if (paypalDetails && orderId) {
      // Verify the PayPal transaction
      const verifiedTransaction = await verifyPayPalTransaction(paypalDetails.id);

      if (!verifiedTransaction || verifiedTransaction.status !== 'COMPLETED') {
        return res.status(400).send('Transaction verification failed');
      }

      // Insert transaction details into the database
      const paypalTransactionQuery = `
        INSERT INTO transactions (Amount, TransactionDate, PhoneNumber, paypalDetails, ReferenceCode)
        VALUES (?, ?, ?, ?, ?);
      `;

      const values = [
        verifiedTransaction.purchase_units[0].amount.value,
        new Date(verifiedTransaction.create_time),
        verifiedTransaction.payer.email_address,
        JSON.stringify(verifiedTransaction),
        verifiedTransaction.id
      ];

      await dbConnection.query(paypalTransactionQuery, values);

      // Update the order payment status
      const updateOrderQuery = `UPDATE orders SET paymentStatus = 'Paid' WHERE orderId = ?`;
      const [result] = await dbConnection.query(updateOrderQuery, [orderId]);

      if (result.affectedRows === 0) {
        console.error(`Order with ID ${orderId} not found or payment status unchanged.`);
        return res.status(404).send('Order not found or payment status unchanged');
      }

      res.json({ message: 'Payment recorded successfully' });
    } else {
      res.status(400).send('Invalid payment details or order ID');
    }
  } catch (err) {
    console.error(err);
    res.status(400).send('Error: ' + err);
  }
});



const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');

const headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'Authorization': `Basic ${auth}`,
};

const PAYPAL_BASE_URL = process.env.PAYPAL_BASE_URL;
const tokenUrl = `${PAYPAL_BASE_URL}/v1/oauth2/token`;

async function getPayPalAccessToken() {
  try {
      const response = await axios.post(tokenUrl, 'grant_type=client_credentials', {
          headers
      });
      return response.data.access_token;
  } catch (error) {
      console.error('Error getting PayPal access token:', error.response ? error.response.data : error.message);
      throw new Error('Could not get PayPal access token');
  }
}

// Function to verify PayPal transaction
const verifyPayPalTransaction = async (transactionId) => {
  const accessToken = await getPayPalAccessToken();

  try {
      const response = await axios({
          url: `https://api-m.sandbox.paypal.com/v2/checkout/orders/${transactionId}`,
          method: 'get',
          headers: {
              'Authorization': `Bearer ${accessToken}`,
          },
      });

      return response.data; // Return the verified transaction details
  } catch (error) {
      console.error('Error verifying PayPal transaction:', error);
      throw new Error('Could not verify PayPal transaction');
  }
};





app.get('/order/:orderId', protect, async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const orderId = req.params.orderId;

    const orderQuery = `SELECT * FROM orders WHERE orderId = ? AND userId = ?`;
    const [orderRows] = await dbConnection.query(orderQuery, [orderId, req.session.userId]);

    if (orderRows.length === 0) {
      return res.status(404).send('Order not found');
    }

    const order = orderRows[0];

    // Parse JSON fields if they are stored as strings
    if (typeof order.additionalServices === 'string') {
      order.additionalServices = JSON.parse(order.additionalServices);
    }

    if (typeof order.notifications === 'string') {
      order.notifications = JSON.parse(order.notifications);
    }

    if (typeof order.files === 'string') {
      order.files = JSON.parse(order.files);
    }

    // Render the order in the view
    res.render('customer', { order });
  } catch (err) {
    console.error(err);
    res.status(400).send('Error: ' + err);
  }
});



app.get('/api/orders/:orderId', async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const [orderRows] = await dbConnection.query('SELECT * FROM orders WHERE orderId = ?', [orderId]);

    if (orderRows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orderRows[0];

    // Parse JSON fields if they are stored as strings
    if (typeof order.additionalServices === 'string') {
      order.additionalServices = JSON.parse(order.additionalServices);
    }

    if (typeof order.notifications === 'string') {
      order.notifications = JSON.parse(order.notifications);
    }

    if (typeof order.files === 'string') {
      order.files = JSON.parse(order.files);
    }

    // Send the order details as a JSON response
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.post('/submit-review', async (req, res) => {
  const { name, location, rating, review } = req.body;

  try {
    const query = `
      INSERT INTO reviews (name, location, rating, review) 
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await dbConnection.execute(query, [name, location, rating, review]);

    res.status(200).send('Review submitted successfully!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving review.');
  }
});

app.listen(port, async () => {
  try {
    // Test the connection by running a simple query
    await dbConnection.query('SELECT 1');
    console.log('MySQL connected successfully!');
    console.log(`Server is running on http://${hostname}:${port}`);
  } catch (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
});

// Global Error Handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});