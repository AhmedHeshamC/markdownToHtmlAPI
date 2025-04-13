require('../test.config');
const express = require('express');
const helmet = require('helmet');
const noteRoutes = require('../../routes/notes');
const errorHandler = require('../../middleware/errorHandler');

function createServer() {
    const app = express();
    
    app.use(helmet());
    app.use(express.json());
    
    // API Routes
    app.use('/api/v1/notes', noteRoutes);
    
    // Default Route
    app.get('/api/v1', (req, res) => {
        res.json({ message: 'Welcome to the Markdown Notes API v1 (Test Environment)' });
    });
    
    // Catch-all for undefined routes
    app.use((req, res, next) => {
        const error = new Error('Not Found');
        error.statusCode = 404;
        next(error);
    });
    
    // Global Error Handler
    app.use(errorHandler);
    
    return app;
}

module.exports = createServer;
