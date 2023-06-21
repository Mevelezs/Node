const bcrypt = require('bcrypt');

async function verifyPassword() {
    const myPassword = 'admin 123 .202';
    const hash = '$2b$10$niKayJ/4pfh7WZxRMZtt1Okm29U4IjfsCQp2bR97B1pYAS2r2MrsS';
    const isMatch = await bcrypt.compare(myPassword, hash);
    console.log(isMatch);
}

verifyPassword();
