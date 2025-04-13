require('dotenv').config();

const API_KEY = process.env.API_KEY;

function authenticateKey(req, res, next) {
    const apiKey = req.headers['x-api-key']; // Or req.query.apiKey, etc.

    if (!apiKey || apiKey !== API_KEY) {
        return res.status(401).json({ message: 'Unauthorized: Invalid API Key' });
    }
    next();
}

module.exports = authenticateKey;
