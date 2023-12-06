// socketServer.js
import { Server } from 'socket.io';

const initSocketServer = (httpServer: any) => {
    const io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('join', (data) => {
            // Join the Socket.IO room based on the group ID
            console.log(`user join with groupid ${data.groupId}`)
            socket.join(data.groupId);
        });

        socket.on('leave', (data) => {
            // Leave the Socket.IO room based on the group ID
            console.log(`user leaved with group id ${data.groupId}`)
            socket.leave(data.groupId);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });

        // You might want to handle other events here
    });


    return io;
};

export default initSocketServer;
