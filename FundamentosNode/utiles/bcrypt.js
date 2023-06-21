const bcrypt = require ('bcrypt');


const password = '12345mevelezs!';
const passwordd = '12345'

bcrypt.hash(password, 10, (error, hash) =>{
    console.log(hash); 
    
    bcrypt.compare(passwordd, hash, (error, result) => {
        console.log(result);
        //console.log(error)
    })
    
});

