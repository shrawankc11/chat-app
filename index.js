const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.static('public'));

const users = {};

app.get('/', (_req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.on('new-user', (name) => {
        users[socket.id] = name;
        socket.broadcast.emit('user-connected', name);
    });

    socket.on('chat message', (msg) => {
        socket.broadcast.emit('chat message', { msg, name: users[socket.id] });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', { name: users[socket.id] });
        delete users[socket.id];
    });

    socket.on('user-typing', () => {
        socket.broadcast.emit('user-typing', { name: users[socket.id] });
    });

    socket.on('user-not-typing', () => {
        socket.broadcast.emit('user-not-typing', 'none');
    });

    socket.on('show-online-users', () => {
        
    })
});
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`server listening at http://localhost:${PORT}`);
});
