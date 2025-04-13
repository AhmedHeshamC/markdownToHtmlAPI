const { expect } = require('chai');
const sinon = require('sinon');
const noteController = require('../../controllers/noteController');
const { marked } = require('marked');
const pool = require('../../config/db');

describe('Note Controller', () => {
    let req, res, next, poolQueryStub;
    
    beforeEach(() => {
        // Reset request, response, and next function mocks before each test
        req = {
            params: {},
            body: {},
            file: null
        };
        
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
            send: sinon.stub().returnsThis()
        };
        
        next = sinon.spy();
        
        // Stub the database query function
        poolQueryStub = sinon.stub(pool, 'query');
    });
    
    afterEach(() => {
        // Restore all stubs after each test
        sinon.restore();
    });
    
    describe('saveNoteText', () => {
        it('should return 400 if filename is missing', async () => {
            req.body = { markdownContent: '# Test' };
            
            await noteController.saveNoteText(req, res, next);
            
            // Verify next was called with an error
            expect(next.calledOnce).to.be.true;
            expect(next.args[0][0]).to.be.an('error');
            expect(next.args[0][0].statusCode).to.equal(400);
            expect(next.args[0][0].message).to.include('Missing filename');
        });
        
        it('should return 400 if markdownContent is missing', async () => {
            req.body = { filename: 'test.md' };
            
            await noteController.saveNoteText(req, res, next);
            
            expect(next.calledOnce).to.be.true;
            expect(next.args[0][0]).to.be.an('error');
            expect(next.args[0][0].statusCode).to.equal(400);
            expect(next.args[0][0].message).to.include('Missing');
        });
        
        it('should save note successfully with valid data', async () => {
            req.body = { 
                filename: 'test.md', 
                markdownContent: '# Test Markdown' 
            };
            
            // Mock successful database query
            poolQueryStub.resolves([[{ insertId: 1 }]]);
            
            await noteController.saveNoteText(req, res, next);
            
            expect(poolQueryStub.calledOnce).to.be.true;
            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.args[0][0]).to.have.property('message').that.includes('saved successfully');
        });
        
        it('should handle database duplicate entry error', async () => {
            req.body = { 
                filename: 'duplicate.md', 
                markdownContent: '# Test' 
            };
            
            // Mock database duplicate entry error
            const dbError = new Error('Duplicate entry');
            dbError.code = 'ER_DUP_ENTRY';
            poolQueryStub.rejects(dbError);
            
            await noteController.saveNoteText(req, res, next);
            
            expect(next.calledOnce).to.be.true;
            expect(next.args[0][0].statusCode).to.equal(409);
        });
    });
    
    describe('renderNoteByFilename', () => {
        it('should render note as HTML when found', async () => {
            req.params.filename = 'test.md';
            
            // Mock database response with markdown content
            poolQueryStub.resolves([[{ markdown_content: '# Test Heading\n\nThis is a paragraph.' }]]);
            
            // Mock marked.parse function
            const markedParseStub = sinon.stub(marked, 'parse').returns('<h1>Test Heading</h1><p>This is a paragraph.</p>');
            
            await noteController.renderNoteByFilename(req, res, next);
            
            expect(poolQueryStub.calledOnce).to.be.true;
            expect(markedParseStub.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });
        
        it('should return 404 when note not found', async () => {
            req.params.filename = 'nonexistent.md';
            
            // Mock empty database response
            poolQueryStub.resolves([[]]);
            
            await noteController.renderNoteByFilename(req, res, next);
            
            expect(poolQueryStub.calledOnce).to.be.true;
            expect(next.calledOnce).to.be.true;
            expect(next.args[0][0].statusCode).to.equal(404);
            expect(next.args[0][0].message).to.include('not found');
        });
    });
});
