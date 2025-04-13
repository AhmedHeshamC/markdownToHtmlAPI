require('dotenv').config();
const express = require('express');
const helmet = require('helmet'); // Import helmet
const noteRoutes = require('./routes/notes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Global Middleware ---
app.use(helmet()); // Use helmet for basic security headers
// You might want to add CORS, Morgan here if needed
// const cors = require('cors');
// const morgan = require('morgan');
// app.use(cors());
// app.use(morgan('dev'));

// --- API Routes ---
// Versioning the API
app.use('/api/v1/notes', noteRoutes);

// --- Default Route for API root ---
app.get('/api/v1', (req, res) => {
    res.json({ message: 'Welcome to the Markdown Notes API v1' });
});

// --- Catch-all for undefined routes ---
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.statusCode = 404;
    next(error);
});

// --- Global Error Handler ---
// This should be the last middleware
app.use(errorHandler);

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
