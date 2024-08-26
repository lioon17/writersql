const mysql = require('mysql2/promise');

const dbConnection = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT || 3306,
});

async function initializeDatabase() {
    try {
        const createOrderTableQuery = `
            CREATE TABLE IF NOT EXISTS orders (
                orderId INT PRIMARY KEY AUTO_INCREMENT,
                userId INT NOT NULL,
                serviceType VARCHAR(255),
                paperType VARCHAR(255),
                subjectArea VARCHAR(255),
                topic VARCHAR(255),
                paperDetails TEXT,
                paperFormat VARCHAR(255),
                referenceCount INT,
                academicLevel VARCHAR(255),
                pageCount INT,
                spacing VARCHAR(255),
                urgency VARCHAR(255),
                additionalInstructions TEXT,
                additionalServices JSON,
                notifications JSON,
                email VARCHAR(255),
                phoneNumber VARCHAR(255),
                fullName VARCHAR(255),
                preferredContactMethod VARCHAR(255),
                totalPrice DECIMAL(10, 2),
                files JSON,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                paymentStatus ENUM('Paid', 'Not Paid') DEFAULT 'Not Paid'
            );
        `;

        await dbConnection.query(createOrderTableQuery);
        console.log('Orders table created successfully.');
    } catch (err) {
        console.error('Error creating orders table:', err);
    }
}

module.exports = { dbConnection, initializeDatabase };
