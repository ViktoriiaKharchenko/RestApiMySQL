//const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authHelper = require('../controllers/token-controller');

const db = require("../db/index");
const Admin = db.admins;
const Token = db.tokens;
const Op = db.Sequelize.Op;


const updateTokens =(userId)=>{
    const accessToken = authHelper.generateAccessToken(userId);
    const refreshToken = authHelper.generateRefreshToken();

    return authHelper.replaceDBRefreshToken(refreshToken.id,userId)
        .then(()=>({
            accessToken,
            refreshToken: refreshToken.token
        }));
};
const refreshTokens=(req,res)=>{
    const {refreshToken }= req.body;
    let payload;
    try {
    payload = jwt.verify(refreshToken,process.env.secret);
    if (payload.type !== 'refresh'){
        res.status(400).json({message:"Invalid token"});
        return;
    }

    }catch (e){
        if (e instanceof jwt.TokenExpiredError ){
            res.status(400).json({message:"Token expired! "});
            return;
        }
        else if(e instanceof jwt.JsonWebTokenError){
            res.status(400).json({message:"Invalid token"});
            return;
        }

    }
    Token.findOne({
        where:{
            tokenId: payload.id
        }
    })
        .then((token)=>{
            if(token ===null){
                throw new Error('InvalidToken');
            }
            return updateTokens(token.userId)
        })
        .then((tokens)=>res.json(tokens))
        .catch(err=> res.status(400).json({message: err.message}))
};

const createAdmin = (req, res) => {

    if (!req.body) {
        res.status(400).json({
            success: false,
            error: 'You must provide an Admin',
        });
        return;
    }

    const admin = {
        email: req.body.email,
        password : bcrypt.hashSync(req.body.password,10)

    };

    Admin.create(admin)
        .then(() => {
            return res.status(201).json({
                success: true,
                message: 'Admin created!',
            })
        })
        .catch(err => {
            return res.status(400).json({
                err,
                message: 'Admin not created!'});
        });
};
const getAdmins =  (req, res) => {

    Admin.findAll()
        .then(data => {
            return res.status(200).json({ success: true, data: data})
        })
        .catch(err => {
            return res.status(400).json({ success: false, error: err });
        });
};



const signIn = (req,res)=>{

    const password = req.body.password;
    Admin.findOne({
        where:{
            email : req.body.email
        }
    })
        .then((admin)=>
        {
            if(!admin){
                return  res.status(401).json({massage: 'Admin does not exist'});
            }
            else{
            const isValid = bcrypt.compareSync(password,admin.password);
            if(isValid){

                updateTokens(admin.id).then((tokens)=> {
                    return res.status(201).json({
                        success: true,
                        accessToken: tokens.accessToken,
                        refreshToken: tokens.refreshToken

                    });
                })
            }
            else {
                return res.status(401).json({message: 'Invalid password'});
            }}
        })
      .catch(err=>
          res.status(500).json({message:err.message}))
};
const checkToken = (req, res) => {

    Admin.findOne({
        where :{
            id: req.userId,
        //    email: req.userEmail

        }})
        .then((user)=>{
            //user.password = null;
            if (!user) return res.status(404).send("No user found.");
            return res.status(200).json({
                id: user.id,
                email:user.email
            });
        })
        .catch (err=>
        res.status(500).send("There was a problem finding the user."))

    };


module.exports = {
    signIn,
    getAdmins,
    createAdmin,
    checkToken,
    refreshTokens

}

