const request = require('supertest');
const { expect } = require('chai');
const createServer = require('../utils/test-server');
const { resetDatabase, seedTestData } = require('../utils/db.helper');
const fs = require('fs');
const path = require('path');

describe('Notes API Integration Tests', function() {
    this.timeout(10000); // Extending timeout for potential slow DB operations
    let app;
    const API_KEY = process.env.API_KEY;
    
    before(async () => {
        // Create server instance for testing
        app = createServer();
        // Reset and seed the test database
        await resetDatabase();
        await seedTestData();
    });
    
    describe('GET /api/v1/notes', () => {
        it('should return all notes when valid API key is provided', async () => {
            const res = await request(app)
                .get('/api/v1/notes')
                .set('x-api-key', API_KEY);
            
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.be.at.least(1);
            expect(res.body[0]).to.have.property('filename', 'test-note.md');
        });
        
        it('should return 401 when invalid API key is provided', async () => {
            const res = await request(app)
                .get('/api/v1/notes')
                .set('x-api-key', 'invalid_key');
            
            expect(res.status).to.equal(401);
        });
    });
    
    describe('POST /api/v1/notes', () => {
        it('should save a new note when valid data is provided', async () => {
            const noteData = {
                filename: 'integration-test.md',
                markdownContent: '# Integration Test\n\nThis note was created during integration testing.'
            };
            
            const res = await request(app)
                .post('/api/v1/notes')
                .set('x-api-key', API_KEY)
                .send(noteData);
            
            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('message').that.includes('saved successfully');
            expect(res.body).to.have.property('noteId');
            expect(res.body).to.have.property('filename', 'integration-test.md');
        });
        
        it('should return 400 when required data is missing', async () => {
            const res = await request(app)
                .post('/api/v1/notes')
                .set('x-api-key', API_KEY)
                .send({ filename: 'missing-content.md' });
            
            expect(res.status).to.equal(400);
        });
    });
    
    describe('GET /api/v1/notes/filename/:filename/html', () => {
        it('should render markdown as HTML correctly', async () => {
            const res = await request(app)
                .get('/api/v1/notes/filename/test-note.md/html')
                .set('x-api-key', API_KEY);
            
            expect(res.status).to.equal(200);
            // Changed from exact match to partial match using includes and regular expressions
            expect(res.text).to.match(/<h1[^>]*>Test Note<\/h1>/);
            expect(res.text).to.include('<p>This is a test note.</p>');
        });
        
        it('should return 404 for non-existent filename', async () => {
            const res = await request(app)
                .get('/api/v1/notes/filename/non-existent.md/html')
                .set('x-api-key', API_KEY);
            
            expect(res.status).to.equal(404);
        });
    });
    
    describe('POST /api/v1/notes/upload', () => {
        it('should upload a markdown file successfully', async () => {
            // Create a temporary test file
            const filePath = path.join(__dirname, 'test-upload.md');
            fs.writeFileSync(filePath, '# Upload Test\n\nThis file was uploaded during testing.');
            
            const res = await request(app)
                .post('/api/v1/notes/upload')
                .set('x-api-key', API_KEY)
                .attach('markdownFile', filePath);
            
            // Clean up
            fs.unlinkSync(filePath);
            
            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('message').that.includes('uploaded and saved successfully');
            expect(res.body).to.have.property('filename', 'test-upload.md');
        });
        
        it('should return 400 when no file is uploaded', async () => {
            const res = await request(app)
                .post('/api/v1/notes/upload')
                .set('x-api-key', API_KEY);
            
            expect(res.status).to.equal(400);
        });
    });
});
