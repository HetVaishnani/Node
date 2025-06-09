const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.headers['token'];
    if (!token) {
        return res.status(401).json({ msg: 'No token provided' });
    }
    let decoded = jwt.verify(token, 'Madhav');
    req.userId = decoded.id; 
    next();
}

module.exports = auth;