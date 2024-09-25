// server/socketHandler.js
const Message = require('../models/message');
const User = require('../models/user');

const { findreciverSocketId, storeOfflineMessage } = require('../controller/controller');

module.exports = (io) => {
    io.on('connection', async (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('register', async (userId) => {
            try {
                await User.findByIdAndUpdate(userId, { socketId: socket.id });
                console.log(`User ${userId} registered with socket: ${socket.id}`);

                const undeliveredMessages = await Message.find({ recipientId: userId, delivered: false });
                if (undeliveredMessages.length > 0) {
                    undeliveredMessages.forEach((message) => {
                        socket.emit('receiveMessage', {
                            sender: message.senderId,
                            message: message.message,
                            timestamp: message.timestamp
                        });
                    });
                }

                await Message.updateMany(
                    { recipientId: userId, delivered: false },
                    { $set: { delivered: true } }
                );
                console.log('Undelivered messages sent and marked as delivered');
            } catch (error) {
                console.log('Error:', error);
            }
        });

        socket.on('sendMessage', async (data) => {
            const { message, receiverId, timestamp, userId } = data;
            const sender = userId;
            const updatedData = { message, receiverId, timestamp, sender };

            const receiverSocketId = await findreciverSocketId(receiverId);
            if (receiverSocketId) {
                
                io.to(receiverSocketId).emit('receiveMessage', {
                    message: message,
                    sender: sender,
                    timestamp: timestamp
                });
            } else {
                console.log(`Receiver is offline, message will be stored.`);
                storeOfflineMessage(updatedData);
            }
        });

        socket.on('disconnect', async () => {
            console.log(`User disconnected: ${socket.id}`);
            try {
                await User.findOneAndUpdate({ socketId: socket.id }, { socketId: null });
                console.log(`Socket ID ${socket.id} removed from the database.`);
            } catch (error) {
                console.log(error);
            }
        });
    });
};
