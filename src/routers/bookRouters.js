const cookieParser = require("cookie-parser");
const express = require("express");
const {adminAuth} = require('../middleware/auth');
const Book = require('../models/book');
const User = require("../models/user");
const router = new express.Router();

const bookArrFromCart = async (cart) =>{
    const books = {
        books: [],
        totalPrice: 0
    };
    for(let i=0;i<cart.length;i++){
        const bookData = await Book.findById(cart[i]._id);
        books.books.push({
            bookData,
            amount:cart[i].amount,
            totalPrice: bookData.price * cart[i].amount
        })
        books.totalPrice += bookData.price * cart[i].amount;
    }
    return books;
}

router.get('/', async (req,res)=>{
    try{
        res.render('index');
    }
    catch(err){
        res.status(500).send(err);
    }
})

//Upload new book to DB
router.post('/b', async (req,res)=>{
    const book = new Book(req.body);
    try{
        await book.save();
        res.status(201).send("New Book Added successfuly");
    }catch(err){
        res.send({
            error:err.message
        })
    }
})

router.get('/b/get/booksCount', async (req,res)=>{
    try{
        const booksCount = await Book.countDocuments({});
        res.send({booksCount});

    }
    catch(err){
        res.status(500).send(err);
    }
})

router.get('/b/get/:limit/:skip', async (req,res)=>{
    try{
        const skip = parseInt(req.params.skip);
        const limit = parseInt(req.params.limit);
        const books = await Book.find().limit(limit).skip(skip);
        if(!books) return res.status(404).send("No books found");
        res.send(books);
    }
    catch(err){
        res.status(500).send(err);
    }
})

//Render search page
router.get('/b/search', async (req,res)=>{
    try{
        res.render('search',{
    })}
    catch(err){
        res.send(err);
    }
})
//Get list of books by search parameters
router.get('/b/search/get', async (req,res)=>{
    try{
        let books = [];
        if(req.query.name) books = await Book.find({name:{$regex:req.query.name,$options:'i'}});
        else books = await Book.find({author:{$regex:req.query.author,$options:'i'}});
        if(books.length===0) return res.status(404).send("No books found");
        res.send(books);
    }
    catch(err){
        res.status(500).send(err);
    }
})

router.patch('/b/edit/:bookID', adminAuth, async (req,res)=>{
    try{
        const book = await Book.findByIdAndUpdate(req.params.bookID,req.body);
        if(!book)
            return res.status(400).send("No book found");
        res.send("Book updated successfully");
    }
    catch(err){
        res.status(500).send("Server Error");
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
            bookDescription:book.description,
            price:book.price,
            amount:book.amountInStock,
            image: book.imageURL,   
            bookID:book._id
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

//Get shopping cart page
router.get('/cart', async (req,res)=>{
    let cart = [];
    if(req.cookies.cart)
        cart = JSON.parse(req.cookies.cart);
    let books = {}
    if(cart)
        books = await bookArrFromCart(cart);
    res.render('shoppingCart',{
        books:books.books, 
        totalPrice: books.totalPrice
    })
})

module.exports = router;