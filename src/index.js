const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io')
const { addUser,removeUser,getUser, getRoomUsers } = require('./utils/user')
const { generateMsg } = require('./utils/message')

const port = process.env.PORT || 3000

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    // socket.emit('responseToUI', generateMsg(`Welcome to connect-chat`));
    // socket.broadcast.emit('responseToUI', 'Someone jonpmined to this chat')


    socket.on('join', (usersInfo,callback) => {
        const { error, user } = addUser({ id : socket.id, ...usersInfo })
        if(error){
            return callback(error);
        }

        socket.join(user.room)

        socket.emit('responseToUI', generateMsg(`Welcome ${user.username} to Connect Chat App`));
        socket.broadcast.to(user.room).emit('responseToUI', generateMsg(`${user.username} just joined the chat`));

        const users = getRoomUsers(user.room);
        io.to(user.room).emit('roomData', { users, room : user.room })
    })

    socket.on('sentText', (message) => {
        const  user  = getUser(socket.id); 
        io.to(user.room).emit('responseToUI',generateMsg(user.username, message));
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if(user !== undefined){
            socket.broadcast.emit('responseToUI', generateMsg(`${user.username} just left the chat`))
            io.to(user.room).emit(generateMsg(`${user.username} has left the chat`))
        }else{
            console.log('user value is undefined');
        }
    })
})

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})




