// JWT Configuration
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET;
const maxAge = '3d';

function generateToken(payload, secret = SECRET_KEY, expiresIn = maxAge) {
    return jwt.sign(payload, secret, { expiresIn: expiresIn });
}


function verifyToken(token, secret) {
    return jwt.verify(token, secret)
}

module.exports = {
    generateToken,
    verifyToken
}