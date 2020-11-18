const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    username: {
        type: String,
        required: true, 
        unique: true,
        validate(value){
            if(value.includes("@")){
                throw new Error("User name should not contain @");
            }
        }
 
    },
    email: {
        type: String, 
        required: true,
        lowercase: true, 
        trim: true, 
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid");
            }
        }
    },
    password: {
        type: String, 
        required: true,
        minlength: 7, 
    },
    tokens: [{
        token: {
            type: String, 
            required: true, 
        }
    }]
    
}, {
    timestamps : true, 
});




userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, process.env.KEY_FOR_AUTHTOKEN);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token; 
};

userSchema.statics.findByEmailAndPassword = async(email, password) =>{
    const user = await User.findOne({email});
    if(!user){
        throw Error("Unable to Find User");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw Error("Unable to find User");
    } 
    return user; 
};


userSchema.statics.findByUsernameAndPassword = async(username, password) =>{
    const user = await User.findOne({username});
    if(!user){
        throw Error("Unable to Find User");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw Error("Unable to find User");
    } 
    return user; 
};


userSchema.pre('save', async function(next){
    console.log("in preschema");

    const user = this; 
    if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password, 8);
    }
    console.log("here");
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User; 