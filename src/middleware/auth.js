const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const auth = async (req,res,next) => {
    try{
        let token = req.cookies.Authorization;
        if(!token)
            return res.status(400).render('accessDenied');
        token = token.replace('Bearer ','');
        const data = jwt.verify(token,process.env.SECRET);
        const admin = await Admin.findOne({_id: data._id, 'tokens.token': token});
        if(!admin)
            return res.status(400).render('accessDenied');
        next();
    }catch(err){
        res.status(401).send(err);
    }
}

module.exports = auth;