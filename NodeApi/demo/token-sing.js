const jwt = require('jsonwebtoken');

const secret = 'myCat';//llave
const payload = {
    sub: 1,
    role: 'customer'
}
const jwtConfig = {
    expiresIn: '1min'
}

function signToken(payload, secret, jwtConfig) {
    return jwt.sign(payload, secret, jwtConfig);
}

const token = signToken(payload, secret, jwtConfig );
console.log(token);
