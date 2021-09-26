const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    amountInStock:{
        type: Number,
        default: 0
    }
})

const Book = mongoose.model('Book',bookSchema);
module.exports = Book;