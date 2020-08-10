const jwt = require('jsonwebtoken')
const {secret} = require('../config/app').jwt

module.exports=(req, res, next)=>{

    var token = req.headers['authorization'].split(' ')[1];
    if (!token)
        return res.status(403).send({ message: 'No token provided.' });

    jwt.verify(token, secret, function(err, decoded) {
        if (err) {

            return res.status(500).send({message: 'Failed to authenticate token.'});
        }
        else if(decoded.type !=="access"){
            return res.status(401).send({ message: 'Invalid token.' });
        }
        req.userId = decoded.userId;
        //req.userEmail = decoded.email;
        next();
    });
};