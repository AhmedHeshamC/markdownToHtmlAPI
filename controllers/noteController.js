const pool = require('../config/db');
const { marked } = require('marked'); // Use named import

// Configure marked (optional)
marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function(code, lang) {
        const hljs = require('highlight.js');
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
    },
    langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false, // Be careful with this in production if input is untrusted
    smartLists: true,
    smartypants: false,
    xhtml: false
});


// Upload and save a markdown file
exports.uploadNoteFile = async (req, res, next) => {
    if (!req.file) {
        const error = new Error('No file uploaded.');
        error.statusCode = 400;
        return next(error);
    }

    const filename = req.file.originalname;
    const markdownContent = req.file.buffer.toString('utf8');

    try {
        const [result] = await pool.query(
            'INSERT INTO notes (filename, markdown_content) VALUES (?, ?) ON DUPLICATE KEY UPDATE markdown_content = VALUES(markdown_content)',
            [filename, markdownContent]
        );
        res.status(201).json({ message: 'Note uploaded and saved successfully.', noteId: result.insertId, filename: filename });
    } catch (err) {
        // Handle potential duplicate filename error if not using ON DUPLICATE KEY UPDATE
        if (err.code === 'ER_DUP_ENTRY') {
             const error = new Error(`Filename '${filename}' already exists. Use the update endpoint or choose a different name.`);
             error.statusCode = 409; // Conflict
             return next(error);
        }
        next(err); // Pass other errors to the error handler
    }
};

// Save markdown text provided in request body
exports.saveNoteText = async (req, res, next) => {
    const { filename, markdownContent } = req.body;

    if (!filename || !markdownContent) {
        const error = new Error('Missing filename or markdownContent in request body.');
        error.statusCode = 400;
        return next(error);
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO notes (filename, markdown_content) VALUES (?, ?) ON DUPLICATE KEY UPDATE markdown_content = VALUES(markdown_content)',
            [filename, markdownContent]
        );
         res.status(201).json({ message: 'Note saved successfully.', noteId: result.insertId, filename: filename });
    } catch (err) {
         if (err.code === 'ER_DUP_ENTRY') {
             const error = new Error(`Filename '${filename}' already exists. Use the update endpoint or choose a different name.`);
             error.statusCode = 409; // Conflict
             return next(error);
         }
        next(err);
    }
};

// List saved notes (filenames and IDs)
exports.listNotes = async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT id, filename, created_at FROM notes ORDER BY created_at DESC');
        res.status(200).json(rows);
    } catch (err) {
        next(err);
    }
};

// Get a specific note by ID and render it as HTML
exports.renderNoteById = async (req, res, next) => {
    const noteId = req.params.id;
    try {
        const [rows] = await pool.query('SELECT markdown_content FROM notes WHERE id = ?', [noteId]);
        if (rows.length === 0) {
            const error = new Error('Note not found.');
            error.statusCode = 404;
            return next(error);
        }
        const markdownContent = rows[0].markdown_content;
        const htmlContent = marked.parse(markdownContent); // Use marked.parse
        res.status(200).send(htmlContent); // Send HTML directly
    } catch (err) {
        next(err);
    }
};

// Get a specific note by filename and render it as HTML
exports.renderNoteByFilename = async (req, res, next) => {
    const filename = req.params.filename;
    try {
        const [rows] = await pool.query('SELECT markdown_content FROM notes WHERE filename = ?', [filename]);
        if (rows.length === 0) {
            const error = new Error('Note not found.');
            error.statusCode = 404;
            return next(error);
        }
        const markdownContent = rows[0].markdown_content;
        const htmlContent = marked.parse(markdownContent); // Use marked.parse
        res.status(200).send(htmlContent); // Send HTML directly
    } catch (err) {
        next(err);
    }
};
