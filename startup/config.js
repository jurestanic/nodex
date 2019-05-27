const config = require('config');

module.exports = function() {
    // provjeravamo postojanje env var potrebne za JWT
    if (!config.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
    }
}