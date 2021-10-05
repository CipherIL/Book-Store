const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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
    dateOfBirth:{
        type: Date,
        required:true
    },
    cart:[{
        amount:{
            type: Number,
            required: true
        }
    }],
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
})

userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({_id: this._id.toString()},process.env.SECRET);
    this.tokens.push({token});
    await this.save();
    return token;
}

userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,8);
    }
    next();
})

const User = mongoose.model('User',userSchema);
module.exports = User;