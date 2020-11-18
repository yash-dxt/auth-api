const express = require('express');
require('./db/mongoose'); //connects to db
const userRouter = require('./routers/user');

const app = express();

app.use(express.json());
app.get('', (req, res)=>{
    res.send('<h1>HELLO THIS IS YASH FROM THE LAPTOP</h1>');
});

app.use(userRouter);

module.exports = app; 