import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import Keycloak from 'keycloak-connect';
import session from 'express-session';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Environment variables setup
require('dotenv').config();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// Keycloak setup
const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore });

app.use(cors());
app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
}));
app.use(keycloak.middleware());

// WebSocket setup for real-time collaboration
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('draw', (data) => {
        socket.broadcast.emit('draw', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Sample protected route
app.get('/protected', keycloak.protect(), (req, res) => {
    res.send('This is a protected route');
});

// Start the server
server.listen(5000, () => {
    console.log('Server running on port 5000');
});
