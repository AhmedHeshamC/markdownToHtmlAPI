const { expect } = require('chai');
const sinon = require('sinon');
const errorHandler = require('../../middleware/errorHandler');

describe('Error Handler Middleware', () => {
    let req, res, next, consoleError;
    
    beforeEach(() => {
        req = {};
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };
        next = sinon.spy();
        // Stub console.error to prevent cluttering test output
        consoleError = sinon.stub(console, 'error');
    });
    
    afterEach(() => {
        consoleError.restore();
    });
    
    it('should return error with status code from error object', () => {
        const error = new Error('Test error');
        error.statusCode = 400;
        
        errorHandler(error, req, res, next);
        
        expect(res.status.calledOnceWith(400)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(res.json.args[0][0]).to.deep.include({
            status: 'error',
            statusCode: 400,
            message: 'Test error'
        });
    });
    
    it('should default to 500 status code if not provided in error', () => {
        const error = new Error('Server error');
        
        errorHandler(error, req, res, next);
        
        expect(res.status.calledOnceWith(500)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(res.json.args[0][0]).to.deep.include({
            status: 'error',
            statusCode: 500,
            message: 'Server error'
        });
    });
    
    it('should default message to "Internal Server Error" if not provided', () => {
        const error = {};
        error.stack = 'Stack trace';
        
        errorHandler(error, req, res, next);
        
        expect(res.json.args[0][0].message).to.equal('Internal Server Error');
    });
});
