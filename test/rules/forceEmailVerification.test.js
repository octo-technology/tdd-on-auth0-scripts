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

// expose require to underlying script
var subRequire = function subRequire (library) {
	var index = library.indexOf('@');
	var result = require(library.substring(0, index));
	// TODO check version is actually correct?
	return result;
}

const fs = require('fs');
const forceEmailVerificationSource = fs.readFileSync('rules/forceEmailVerification.js', 'utf8');
const testableForceEmailVerification = new Function('UnauthorizedError', 'require', 'global', 'return ' + forceEmailVerificationSource + ';');

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

            // populate configuration
            configuration = {
                myKey1: "myValue1",
                myKey2: "myValue2"
           };
        });

        it('should call callback with untouched user and context', function () {

            var global = {myGlobalKey: "myGlobalValue1"};

            var forceEmailVerification = testableForceEmailVerification(UnauthorizedError, subRequire, global);

            forceEmailVerification(user, context, callback);

            expect(callback).to.have.been.calledWith(null, user, context);
        });
    });

    describe('when user email is NOT verified', () => {
        beforeEach(() => {
            user.email_verified = false;
        });

        it('should return unauthorized error to enforce user changing his password', () => {
            var global = {myGlobalKey: "myGlobalValue2"};

            var forceEmailVerification = testableForceEmailVerification(UnauthorizedError, subRequire, global);

            forceEmailVerification(user, context, callback);

            const error = callback.getCall(0).args[0];
            expect(error.name).to.eql('UnauthorizedError');
            expect(error.message).to.eql('Please verify your email before logging in.');
        });
    });
});
