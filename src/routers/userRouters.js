const express = require("express");
const bcrypt = require('bcryptjs');
const {userAuth} = require('../middleware/auth');
const User = require('../models/user');
const Book = require('../models/book');

const router = new express.Router();

const mergeCarts = async (user,cart) =>{
    cart.forEach((book)=>{
        let i=0;
        for(i=0;i<user.cart.length;i++){
            if(book._id.toString() === user.cart[i]._id.toString()){
                user.cart[i].amount += book.amount;
                break;
            }
        }
        if(i===user.cart.length)
            user.cart.push(book);
    })
    await user.save();
}

router.post('/user/login', async (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    const cart = req.body.cart;
    try{
        const user = await User.findOne({email})
        if(!user)
            return res.status(400).send("Invalid email or password");
        const passMatch = await bcrypt.compare(password,user.password)
        
        if(!passMatch)
            return res.status(400).send("Invalid email or password");
        
        await mergeCarts(user,cart);
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

router.post('/user/logout',userAuth,async(req,res)=>{
    const currToken = req.cookies.userToken;
    req.user.tokens = req.user.tokens.filter(token=>token.token!==currToken);
    await req.user.save()
    res.send();
})

router.post('/user/new', async (req,res)=>{
    try{
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        const username = user.email.split('@')[0];
        res.cookie('userToken',`${token}`);
        res.cookie('username',`${username}`);
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