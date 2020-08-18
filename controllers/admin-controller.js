const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authHelper = require('../controllers/token-controller');
const mail = require('nodemailer');
const db = require("../db/index");
const config = require('../config/app')
const Admin = db.admins;
const Token = db.tokens;
const Op = db.Sequelize.Op;


const updateTokens =(userId,userEmail)=>{
    const accessToken = authHelper.generateAccessToken(userId,userEmail);
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

const deleteAdmin = (req, res) => {
    const id = req.params.id;

    Admin.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                return res.status(200).json({ success: true, message: 'Admin deleted'});
            } else {
                return res.status(404).json({ success: false, error: `Admin not found` });
            }
        })
        .catch(err => {
            return res.status(400).json({ success: false, error: err })
        });
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
            if(err.errors[0].validatorKey == "isEmail"){
                return res.status(400).json({
                    err : err.errors[0].validatorKey,
                    message: 'Please, enter your email address'});
            }
            if(err.errors[0].validatorKey == "not_unique"){
                   return res.status(400).json({
                    err : err.errors[0].validatorKey,
                    message: 'admin '+admin.email+' already exists'});
            }
            return res.status(400).json({
                err : err.errors[0].validatorKey,
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
                return  res.status(401).json({message: 'Admin'+req.body.email+' does not exist'});
            }
            else{
            const isValid = bcrypt.compareSync(password,admin.password);
            if(isValid){

                updateTokens(admin.id,admin.email).then((tokens)=> {
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
            email: req.userEmail

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
const updateAdmin = (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }
    const id = req.params.id;
    req.body.password = bcrypt.hashSync(req.body.password,10);
    Admin.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if(num==1){
                return res.status(200).json({
                    success: true,
                    message: 'Admin updated!',
                })}
            else {
                return res.status(404).json({
                    message: 'Admin not found!',
                })
            }
        })
        .catch(err => {
            return res.status(404).json({
                error : err.message,
                message: 'Admin not updated!',
            })
        });
};
const forgotPassword=(req,res)=>{
    Admin.findOne({
        where:{
            email : req.body.email
        }
    })
        .then((admin)=>
        {
            if(!admin){
                return  res.status(401).json({message: 'Admin'+req.body.email+' does not exist'});
            }
            const token = jwt.sign({userId : admin.id, userEmail : admin.email},process.env.resetPasswordKey,{expiresIn: '20m'});
            Admin.update({resetLink: token}, {
                where: { email: admin.email }
            })
                .then(num => {
                    if(num!=1){
                        return res.status(404).json({
                            message: 'Admin not found!',
                        })
                    }})
                .catch(err => {
                    return res.status(404).json({
                        error : err.message,
                        message: 'Admin not updated!',
                    })
                });
            let mailOptions = {
                from: process.env.email,
                to: req.body.email,
                subject: 'Reset your account password',
                html: '<h4><b>Reset Password</b></h4>' +
                    '<p>To reset your password, complete this form:</p>' +
                    '<a href=' + config.clientUrl + 'reset/' + token + '">' + config.clientUrl + 'reset/'  + token + '</a>' +
                    '<br><br>' +
                    '<p>--Team</p>'
            }
            let transporter = mail.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.email,
                    pass: process.env.emailPass
                }
            });
            let mailSent = transporter.sendMail(mailOptions)//sending mail to the user where he can reset password.User id and the token generated are sent as params in a link
            if (mailSent) {
                return res.json({success: true, message: 'Check your mail to reset your password.'})
            } else {
                return res.status(400).json({success:false})
            }
        })
        .catch(err=>
            res.status(500).json({message:err.message}))
}
const resetPassword=(req,res)=>{
    if (!req.body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }
    req.body.password = bcrypt.hashSync(req.body.password,10);
    Admin.update({password:req.body.password,resetLink: null}, {
        where: {
            id: req.userId,
            email: req.userEmail
        }
    })
        .then(num => {
            if(num==1){
                return res.status(200).json({
                    success: true,
                    message: 'Admin updated!',
                })}
            else {
                return res.status(404).json({
                    message: 'Admin not found!',
                })
            }
        })
        .catch(err => {
            return res.status(404).json({
                error : err.message,
                message: 'Admin not updated!',
            })
        });

}

const checkPassword=(req,res)=>{

    Admin.findOne({
        where :{
            email: req.userEmail,
            id:req.userId

        }})
        .then((user)=>{
            if (!user) return res.status(404).json({message: 'No user found'});

            const isValid = bcrypt.compareSync(req.body.password,user.password);
            if(isValid){
                return res.status(200).json({
                    success:true,
                    id : user.id
                });
                }
            else {
                return res.status(401).json({message: 'Invalid password'});
            }
})
        .catch (err=>
            res.status(500).json({message :"There was a problem finding the user."}))
}


module.exports = {
    signIn,
    getAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    checkPassword,
    checkToken,
    refreshTokens,
    resetPassword,
    forgotPassword

}

