const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();


router.post('/users/signup',async(req,res)=>{
    const user = new User(req.body);
    console.log(user);
    try {
        console.log("In try");
        await user.save();
        console.log("Saved");
        const token = await user.generateAuthToken();
        res.status(201).send({user, token}); 
    } catch (e) {
        console.log(e);
        res.sendStatus(400);
        
    }
});


router.post('/users/login/email', async(req, res)=>{
    try {
        console.log("Email login method");
        const user = await User.findByEmailAndPassword(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch (e) {
        console.log(e);
        res.sendStatus(400);
    
    }
});


router.post('/users/login/username', async(req, res)=>{
    try {
        const user = await User.findByUsernameAndPassword(req.body.username, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch (e) {
        res.status(400).send();
        
    }
});

router.get('/users/me', auth, async(req, res)=>{
    res.send(req.user);
});

router.patch('/users/me', auth, async(req, res)=>{
    const keysInRequest = Object.keys(req.body);
    const keysInUserModel = ['name','username', 'email', 'password' ];
    
    if(keysInRequest.length > keysInUserModel.length){
            const isValidOperation = false;
            if(!isValidOperation){
                return res.status(400).send({error: "Invalid Operation"});
            }
    }else{
        const isValidOperation = keysInRequest.every((key) => keysInUserModel.includes(key));
        if(!isValidOperation){
            return res.status(400).send({error: "Invalid Operation"});
        }
    }

    try {
        keysInRequest.forEach((key) => req.user[key] = req.body[key]);
        await req.user.save();
        res.send(req.user);    
    } catch (e) {
        res.status(400).send();
    }
});

router.post('/users/logout', auth, async(req, res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
          return token.token !== req.token;  
        });
        await req.user.save();
        res.send(); 

    } catch (e) {
        res.status(500).send();
    }

});

router.post('/users/logoutAll', auth, async(req, res)=>{
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;