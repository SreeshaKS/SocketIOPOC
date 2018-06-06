const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

const app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', (socket) => {
    console.log('New user conncted')

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('name and room name are required ! ');
        }
        socket.join(params.room)
        // Make sure there is no user with socket.id as id
        users.removeUser(socket.id)
        // Add New User
        users.addUser(socket.id, params.name, params.room)

        io.to(params.room).emit('updateUserList',users.getUserList(params.room))
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat application'))
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined `))

        callback();
    })

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('this is from the server');
    })

    socket.on('createLocationMessage', (data) => {
        io.emit('newLocationMessage', generateLocationMessage(data.from, { latitude: data.latitude, longitude: data.longitude }))
    })

    socket.on('disconnect', () => {
        var user =   users.removeUser(socket.id)
        if(user){
            io.to(user.room).emit('updateUserList',users.getUserList(user.room))
            io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left`))
        }
        socket.leave()
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})