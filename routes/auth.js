const express = require('express');
const bcrypt = require('bcryptjs');

module.exports = (db) => {
  const router = express.Router();

  // Register Route
  router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      if (rows.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );

      res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
      console.error('Registration Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Login Route
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      if (rows.length === 0) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      req.session.userId = user.id;
      req.session.user = user;

      if (user.role === 'admin') {
        res.redirect('/dashboard');
      } else {
        res.redirect('/order');
      }
    } catch (error) {
      console.error('Login Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Logout Route
  router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout Error:', err);
        return res.status(500).json({ message: 'Failed to logout' });
      }
      res.redirect('/');
    });
  });

  return router;
};
