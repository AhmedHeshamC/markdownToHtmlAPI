const express = require('express');
const multer = require('multer');
const noteController = require('../controllers/noteController');
const authenticateKey = require('../middleware/auth'); // Import authentication middleware

const router = express.Router();

// Configure Multer for file uploads (store in memory)
const storage = multer.memoryStorage(); // Store file in memory as buffer
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size (e.g., 5MB)
    fileFilter: (req, file, cb) => {
        // Accept only markdown files
        if (file.mimetype === 'text/markdown' || file.originalname.endsWith('.md')) {
            cb(null, true);
        } else {
            cb(new Error('Only .md markdown files are allowed!'), false);
        }
    }
});

// Apply authentication middleware to all note routes
router.use(authenticateKey);

// --- API Version 1 Routes ---

// POST /api/v1/notes/upload - Upload a markdown file
router.post('/upload', upload.single('markdownFile'), noteController.uploadNoteFile);

// POST /api/v1/notes - Save markdown text
router.post('/', express.json(), noteController.saveNoteText); // Use express.json() for parsing JSON body

// GET /api/v1/notes - List all notes
router.get('/', noteController.listNotes);

// GET /api/v1/notes/:id/html - Render note by ID as HTML
router.get('/:id/html', noteController.renderNoteById);

// GET /api/v1/notes/filename/:filename/html - Render note by filename as HTML
router.get('/filename/:filename/html', noteController.renderNoteByFilename);

module.exports = router;
