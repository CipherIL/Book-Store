const express = require("express");
const Book = require('../models/book');
const User = require("../models/user");
const router = new express.Router();

//Upload new book to DB
router.post('/b', async (req,res)=>{
    const book = new Book(req.body);
    try{
        await book.save();
        res.status(201).send(book);
    }catch(err){
        res.status(400).send({
            error:err.message
        })
    }
})

//Get page for single book
router.get('/b/:bookID', async (req,res)=>{
    try{
        const book = await Book.findById(req.params.bookID);
        if(!book) return res.status(404).send({
            error:"Book not found"
        })
        res.render('book',{
            bookName:book.name,
            author:book.author,
            price:book.price,
            amount:book.amountInStock
        });
    }catch(err){
        res.status(500).send(err);
    }
})

//Get data for single book (in JSON)
router.get('/b/:bookID/data', async (req,res)=>{
    try{
        const book = await Book.findById(req.params.bookID);
        if(!book) return res.status(404).send({
            error:"Book not found"
        })
        res.send(book);
    }catch(err){
        res.status(500).send(err);
    }
})


module.exports = router;