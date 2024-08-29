// middleware/admin.js
module.exports = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next(); // user is admin, proceed to the route
    } else {
        res.status(403).send('Forbidden: You do not have permission to access this page');
    }
};
