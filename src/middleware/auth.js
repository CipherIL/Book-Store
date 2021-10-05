const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');
const User = require('../models/user');


const adminAuth = async (req,res,next) => {
    try{
        const token = req.cookies.adminToken;
        if(!token)
            return res.status(400).render('accessDenied');
        const data = jwt.verify(token,process.env.SECRET);
        const admin = await Admin.findOne({_id: data._id, 'tokens.token': token});
        if(!admin)
            return res.status(400).render('accessDenied');
        req.admin = admin;
        next();
    }catch(err){
        res.status(401).send(err);
    }
}

const userAuth = async (req,res,next) => {
    try{
        const token = req.cookies.userToken;
        if(!token) return res.status(400).send('Not Logged In!');
        const data = jwt.verify(token,process.env.SECRET);
        const user = await User.findOne({_id:data._id, 'tokens.token':token});
        if(!user) return res.status(400).send("Error");
        req.user = user;
        next();
    }
    catch(err){
        res.status(500).send("Server Error");
    }
}

module.exports = {
    adminAuth,
    userAuth
};