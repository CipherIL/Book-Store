const express = require('express');
const bcrypt = require('bcryptjs');
const {adminAuth} = require('../middleware/auth');
const Admin = require('../models/admin');

const router = new express.Router();

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
        const admin = await Admin.findOne({email:adminEmail});
        if(!admin)
            return res.status(400).send("Invalid email or password");
        const passMatch = await bcrypt.compare(adminPassword,admin.password)
        if(!passMatch)
            return res.status(400).send("Invalid email or password");

        const token = await admin.generateAuthToken();
        res.cookie('adminToken',`${token}`);
        res.send();
    }
    catch(err){
        res.status(500).send(err);
    }
})

router.post('/admin/logout',adminAuth,async(req,res)=>{
    const currToken = req.cookies.adminToken;
    req.admin.tokens = req.admin.tokens.filter(token=>token.token!==currToken);
    await req.admin.save()
    res.send();
})

router.get('/admin/panel', adminAuth , async (req,res)=>{
    res.render('adminPanel');
})

router.post('/admin/new', adminAuth, async (req,res)=>{
    try{
        const admin = new Admin(req.body);
        await admin.save();
        res.status(201).send("New admin added successfuly");
    }catch(err){
        console.log(err.errors);
        if(err.code===11000)
            return res.status(400).send({
                message:'Email already in use'
            });
        if(err.errors)
            return res.status(400).send({
                message:'Invalid email or password'
            });
        res.status(500).send({
            message:"Server Error"
        });
    }
})

module.exports = router;