const { expect } = require('chai');
const sinon = require('sinon');
const authenticateKey = require('../../middleware/auth');

describe('Auth Middleware', () => {
    let req, res, next;
    
    beforeEach(() => {
        req = {
            headers: {}
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        next = sinon.spy();
    });
    
    it('should call next if valid API key is provided', () => {
        req.headers['x-api-key'] = process.env.API_KEY;
        authenticateKey(req, res, next);
        expect(next.calledOnce).to.be.true;
    });
    
    it('should return 401 if no API key is provided', () => {
        authenticateKey(req, res, next);
        expect(res.status.calledOnceWith(401)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(next.called).to.be.false;
    });
    
    it('should return 401 if invalid API key is provided', () => {
        req.headers['x-api-key'] = 'invalid_key';
        authenticateKey(req, res, next);
        expect(res.status.calledOnceWith(401)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(next.called).to.be.false;
    });
});
