const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        trim: true
    },
    lastName:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email");
            }
        }
    },
    password:{
        type: String,
        required: true,
        minlength: 7,
        validate(value){
            const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{0,}$/;
            if(!passRegex.test(value)){
                throw new Error("Invalid Password");
            }
        }
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
})

const User = mongoose.model('User',userSchema);
module.exports = User;