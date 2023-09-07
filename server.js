const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const prisma = require('./lib/prisma');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

global.agencySockets = {};

app.use(cors());

const fetchUnreadNotifications = async (socket, agencyId) => {
    const unreadNotifications = await prisma.notification.findMany({
        where: {
            agencyId: parseInt(agencyId),
            readStatus: false
        }
    });

    socket.emit('unreadNotifications', unreadNotifications);
};

const listenForNewReservations = (socket, agencyId) => {
    socket.on('newReservation', async (data) => {

        try {
            const newNotification = await prisma.notification.create({
                data: {
                    agencyId: parseInt(data.agencyId),
                    message: `New reservation `,
                    reservationId: data.id,
                }
            });

            if (agencySockets[agencyId]) {
                agencySockets[agencyId].forEach(socket => socket.emit('newNotification', newNotification));
            }
        } catch (error) {
            console.error('Error creating newNotification:', error);
        }
    });
};

const listenForEditReservations = (socket, agencyId) => {
    socket.on('editReservation', async (data) => {

        try {
            const newNotification = await prisma.notification.create({
                data: {
                    agencyId: parseInt(data.agencyId),
                    message: `A reservation has been modified`,
                    reservationId: data.id,
                }
            });

            if (agencySockets[agencyId]) {
                agencySockets[agencyId].forEach(socket => socket.emit('newNotification', newNotification));
            }
        } catch (error) {
            console.error('Error creating newNotification:', error);
        }
    });
};


io.on('connection', async (socket) => {
    const agencyId = socket.handshake.query.agencyId;
    console.log('Agent connected:', socket.id, 'Agency ID:', agencyId);

    if (!agencySockets[agencyId]) {
        agencySockets[agencyId] = [];
    }
    agencySockets[agencyId].push(socket);

    fetchUnreadNotifications(socket, agencyId);
    listenForNewReservations(socket, agencyId);
    listenForEditReservations(socket, agencyId);

    socket.on('disconnect', () => {
        console.log('Agency disconnected:', socket.id);
        agencySockets[agencyId] = agencySockets[agencyId].filter(s => s !== socket);
    });
});

app.post('/notification/:id/read', async (req, res) => {
    const { id } = req.params;

    try {
        const updatedNotification = await prisma.notification.update({
            where: { id: parseInt(id) },
            data: { readStatus: true },
        });
        res.json(updatedNotification);
    } catch (error) {
        res.status(500).json({ error: 'Error updating notification' });
    }
});

server.listen(8000, () => {
    console.log('Server is running on port 8000');
});
