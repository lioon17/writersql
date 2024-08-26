const db = require('../config/db').dbConnection; // Make sure you're importing the correct connection

const Feedback = {
    async create(feedbackData) {
        const sql = 'INSERT INTO feedbacks (orderId, feedbackText, rating, userId) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(sql, [feedbackData.orderId, feedbackData.feedbackText, feedbackData.rating, feedbackData.userId]);
        return result.insertId;
    },

    async findByUserId(userId) {
        const sql = 'SELECT * FROM feedbacks WHERE userId = ?';
        const [rows] = await db.query(sql, [userId]);
        return rows;
    },

    // Additional methods can be added as needed
};

module.exports = Feedback;
