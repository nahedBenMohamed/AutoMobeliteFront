const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        method: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });

    socket.on('newReservation', (data) => {
        // Émettez l'événement aux autres clients connectés
        socket.broadcast.emit('newReservation', data);
    });
});
server.listen(8000, () => {
    console.log('Server is running on port 8000');
});
