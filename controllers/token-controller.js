const { v4: uuid } = require('uuid');
const jwt = require('jsonwebtoken');
const {tokens} = require('../config/app').jwt;

const db = require("../db/index");
const Token = db.tokens;

const generateAccessToken =(userId,userEmail) =>{

    const payload={
        userEmail,
        userId,
        type: tokens.access.type,
    };
    const options={
        expiresIn:tokens.access.expiresIn
    }
    return jwt.sign(payload,process.env.secret,options);
};
const generateRefreshToken =() =>{

    const payload={
        id: uuid(),
        type: tokens.refresh.type,
    };
    const options={
        expiresIn:tokens.refresh.expiresIn
    }
    return {
        id: payload.id,
       token:  jwt.sign(payload,process.env.secret,options),
    }
};


const replaceDBRefreshToken= (tokenId, userId)=>
    Token.destroy({
        where:{
            userId:userId
        }
    })
        .then(()=>Token.create({tokenId,userId}))


module.exports={
    generateAccessToken,
    generateRefreshToken,
    replaceDBRefreshToken
};



