const Message = require('../models/message');
const User=require('../models/user')

async function storeOfflineMessage(data) {
    const { message, receiverId, senderId, timestamp } = data;

    try {
        const newMessage = new Message({
            senderId: senderId,
            recipientId: receiverId,
            message: message,
            timestamp: timestamp,
            delivered: false
        });
        await newMessage.save();
        console.log('Message saved for offline recipient');
    } catch (error) {
        console.error('Error saving message:', error);
    }
}

async function findreciverSocketId(recipientId) {
    try {
       
        const user = await User.findById(recipientId).exec();

       
        if (user && user.socketId) {
            return user.socketId;  
        } else {
            return null;  
        }
    } catch (error) {
        console.error('Error fetching recipient socket ID:', error);
        return null;  
    }
}

module.exports = {findreciverSocketId,storeOfflineMessage };




