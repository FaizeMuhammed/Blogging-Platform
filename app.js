require('dotenv').config();
const express=require("express");
const expressLayout=require("express-ejs-layouts");
const cookieParser = require('cookie-parser');
const http=require('http');
const Message = require('../Blogging-Platform/server/models/message');
const User=require('../Blogging-Platform/server/models/user');
const ioAuth=require('../Blogging-Platform/server/middleware/ioauth');
const  { findreciverSocketId,storeOfflineMessage }=require('../Blogging-Platform/server/controller/controller')



const connectDB=require('./server/config/db');

const app=express();
// const server=http.createServer(app);
// const io=new Server(server);
const PORT=3496||process.env.PORT;
const server=app.listen(PORT,()=>{
    console.log(`server running on ${PORT} port`);
})
const io=require('socket.io')(server);


// connect to db
connectDB();




app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(cookieParser());





// Template Engines
app.use(expressLayout);     
app.set("layout",'./layouts/main');
app.set('view engine','ejs');


app.use('/',require("./server/routes/main"));

io.use(ioAuth);
io.on('connection', async (socket)=>{
    const userId = socket.user.id;
    console.log(`User connect to :${socket.id}`);
    try{
        const undeliveredMessages = await Message.find({ recipientId: userId, delivered: false });
       if (undeliveredMessages.length > 0) {
        undeliveredMessages.forEach((message) => {
            socket.emit('receiveMessage', {
                sender: message.senderId,
                message: message.message,
                timestamp: message.timestamp
            });
        })}

        await Message.updateMany(
            { recipientId: userId, delivered: false },
            { $set: { delivered: true } }
        );

        console.log('Undelivered messages sent and marked as delivered');
    
    }
    catch(error){
        console.error('Error fetching undelivered messages:', error);
    }

    socket.on('register', async (userId) => {
        
        
        try{
        await User.findByIdAndUpdate(userId, { socketId: socket.id });
        console.log(`User ${userId} registered with socket: ${socket.id}`);
        }
        catch(error){
            console.log('error:',error);
            
        }
    });

    socket.on('sendMessage',async(data)=>{
        const {message,receiverId,timestamp,userId}=data;
        
        
        const sender=userId;
        const UpdatedData={message,receiverId,timestamp,sender};

        const receiverSocketId= await findreciverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit('receiveMessage',{
                message: message,
                sender: sender ,  
                timestamp: timestamp
            })
        }
        else{
            console.log(`receiver is offline message store.....`);

             storeOfflineMessage(UpdatedData);
            
        }


    })

    socket.on('disconnect', async () => {
        console.log(`User disconnected: ${socket.id}`);
       
        try{
        
        await User.findOneAndUpdate({ socketId: socket.id }, { socketId: null });
        
        console.log(`Socket ID ${socket.id} removed from the database.`);
        }
        catch(error){
            console.log(error);
            
        }
    });
    
});

