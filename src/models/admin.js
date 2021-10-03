const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value))
                throw new Error("invalid email");
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
});

adminSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({_id: this._id.toString()},process.env.SECRET)
    this.tokens.push({token});
    await this.save();
    return token;
}

const Admin = mongoose.model('Admin',adminSchema);
module.exports = Admin;