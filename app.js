require('dotenv').config();
const express=require("express");
const expressLayout=require("express-ejs-layouts");
const cookieParser = require('cookie-parser');
const http=require('http');
const connectDB=require('./server/config/db');
const socketHandler = require('./server/routes/socketHandler'); 

const app=express();
const PORT=3496||process.env.PORT;
const server=app.listen(PORT,()=>{
    console.log(`server running on ${PORT} port`);
})
const io=require('socket.io')(server);

connectDB();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(cookieParser());

app.use(expressLayout);     
app.set("layout",'./layouts/main');
app.set('view engine','ejs');


app.use('/',require("./server/routes/main"));

socketHandler(io);
