const express = require('express');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

const router = new express.Router();
const Admin = require('../models/admin');

//Admin login page
router.get('/admin', async (req,res)=>{
    try{
        res.render('adminLogin',{
            title:"Admin Login"
        });
    }
    catch(err){
        res.status(500).send(err);
    }
})

router.post('/admin/login', async(req,res)=>{
    try{
        const adminEmail = req.body.email;
        const adminPassword = req.body.password;
        const admin = await Admin.findOne({email:adminEmail,password:adminPassword});
        if(!admin){
            return res.status(400).send("Invalid email or password");
        }
        const token = await admin.generateAuthToken();
        res.cookie('Authorization',`Bearer ${token}`);
        res.send();
    }
    catch(err){
        res.status(500).send(err);
    }
})

router.get('/admin/panel', auth , async (req,res)=>{
    res.render('adminPanel');
})

module.exports = router;