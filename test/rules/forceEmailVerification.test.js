// Chai
const chai = require('chai');
const expect = chai.expect;
// Sinon.js
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

class UnauthorizedError extends Error {
    constructor(...params) {
        super(...params);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UnauthorizedError);
        }

        this.name = 'UnauthorizedError';
    }
}

const fs = require('fs');
const forceEmailVerificationSource = fs.readFileSync('rules/forceEmailVerification.js', 'utf8');
const testableForceEmailVerification = new Function('UnauthorizedError', 'return ' + forceEmailVerificationSource + ';');
const forceEmailVerification = testableForceEmailVerification(UnauthorizedError);

describe('force email verification', function () {
    let user, context, callback;

    beforeEach(() => {
        user = {};
        context = {};
        callback = sinon.spy();
    });

    describe('when user email is verified', () => {
        beforeEach(() => {
            user.email_verified = true;
        });

        it('should call callback with untouched user and context', function () {
            forceEmailVerification(user, context, callback);

            expect(callback).to.have.been.calledWith(null, user, context);
        });
    });

    describe('when user email is NOT verified', () => {
        beforeEach(() => {
            user.email_verified = false;
        });

        it('should return unauthorized error to enforce user changing his password', () => {
            forceEmailVerification(user, context, callback);

            const error = callback.getCall(0).args[0];
            expect(error.name).to.eql('UnauthorizedError');
            expect(error.message).to.eql('Please verify your email before logging in.');
        });
    });
});