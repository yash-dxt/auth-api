const app = require('./app');

const port = process.env.PORT; 
const ip= "192.168.29.230";
app.listen(port, ip, ()=>{
    console.log("Server is up on port: "); 
});


