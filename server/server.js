const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;

const app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket) => {
    console.log('New user conncted')

    socket.emit('createMessage', {
        from: 'sree',
        text: 'Hey'
    })

    socket.emit('newMessage', {
        from: 'sree2',
        text: 'Hey',
        createdAt: 123
    })

    socket.on('createMessage', (message) => {
        console.log('createMessage', message)
    })

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    })
})

app.use(express.static(path.join(__dirname, '../public')));

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})