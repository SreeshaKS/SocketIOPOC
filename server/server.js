const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;

const {generateMessage} = require('./utils/message');
const app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', (socket) => {
    console.log('New user conncted')

    socket.emit('newMessage', generateMessage('Admin','Welcome to the chat application'))

    socket.broadcast.emit('newMessage', generateMessage('Admin','New user joined'))

    socket.on('createMessage', (message) => {
        console.log('createMessage', message)
        io.emit('newMessage', generateMessage(message.from,message.to))
        socket.broadcast.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        })
    })

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})