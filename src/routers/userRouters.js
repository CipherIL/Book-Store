const express = require("express");
const jwt = require('jsonwebtoken');
const {userAuth} = require('../middleware/auth');
const User = require('../models/user');
const Book = require('../models/book');

const router = new express.Router();

router.post('/user/login', async (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    try{
        const user = await User.findOne({email,password})
        if(!user)
            return res.status(400).send("Invalid email or password");
        const token = await user.generateAuthToken();
        const username = user.email.split('@')[0];
        res.cookie('userToken',`${token}`);
        res.cookie('username',`${username}`);
        res.send("Login successful");
    }
    catch(err){
        console.log(err)
        res.status(500).send("Server Error");
    }
})

router.post('/user/new', async (req,res)=>{
    try{
        const user = new User(req.body);
        await user.save();
        console.log(user);
        res.send('user created');
    }
    catch(err){
        res.status(500).send(err);
    }
})

router.patch('/user/addToCart', userAuth , async (req,res)=>{
    try{
        const user = req.user;
        const bookID = req.body._id;
        const amount = req.body.amount;
        console.log(bookID);
        //if book already in cart
        for(let i=0;i<user.cart.length;i++){
            console.log(user.cart[i]._id.toString());
            if(user.cart[i]._id.toString() === bookID){
                user.cart[i].amount += amount;
                await user.save();
                return res.send('Books added');
            }
        }

        //if book new in  cart
        const newBook = await Book.findById(bookID);
        user.cart.push({
            _id: newBook._id,
            amount: amount
        })
        await user.save();
        res.send("Added to cart!");
    }
    catch(err){
        console.log(err)
        res.status(500).send("Server Error");
    }
})

router.get('/user/cart', userAuth, async (req,res)=>{
    res.send(req.user.cart);
})


module.exports = router