const jwt = require('jsonwebtoken');
const cookie = require('cookie');

const ioAuth = (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers.cookie || '');
    const token = cookies.token;  

    if (!token) {
        return next(new Error('Authentication error: No token found'));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(new Error('Authentication error: Invalid token'));
        }

       
        socket.user = { id: decoded.id, username: decoded.username };  
        next(); 
    });
};


module.exports=ioAuth;