function forceEmailVerification(user, context, callback) {
    var request = require('request@2.81.0');

    // do some kind of remote request

    if (!user.email_verified) {
        return callback(new UnauthorizedError('Please verify your email before logging in.'));
    } else {
        return callback(null, user, context);
    }

}
