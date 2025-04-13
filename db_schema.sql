CREATE DATABASE IF NOT EXISTS markdown_note_app; -- Changed database name

USE markdown_note_app; -- Changed database name

CREATE TABLE IF NOT EXISTS notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL UNIQUE,
    markdown_content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
