// Chai
const chai = require('chai');
const expect = chai.expect;
// Sinon.js
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const fs = require('fs');
const forceEmailVerificationSource = fs.readFileSync('rules/forceEmailVerification.js', 'utf8');
const testableForceEmailVerification = new Function('return ' + forceEmailVerificationSource + ';');
const forceEmailVerification = testableForceEmailVerification();

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
});