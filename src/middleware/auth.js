const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const User = require('../models/user');

const getCookieValue = (name,cookies) =>{
    let match = cookies.match(RegExp('(?:^|;\\s*)'+name+'=([^;]*)'));
    return match ? match[1]:null;
}

const adminAuth = async (req,res,next) => {
    try{
        const token = getCookieValue('adminToken');
        if(!token)
            return res.status(400).render('accessDenied');
        const data = jwt.verify(token,process.env.SECRET);
        const admin = await Admin.findOne({_id: data._id, 'tokens.token': token});
        if(!admin)
            return res.status(400).render('accessDenied');
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