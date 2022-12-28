import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import path from 'path';
const __dirname = path.resolve();

const PORT = 3000;
const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))

app.use(express.static('public'))
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

const server = app.listen(PORT, () => console.log(`Listening on http://localhost:3000`));
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

io.use((socket, next) => {
    // console.log(socket.id, socket.request)
    next();
});
io.on("connection", (socket) => {
    console.log(socket?.origin);
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
        console.log(userData?._id);
        socket.join(userData?._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
        console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageReceived) => {
        let sended = socket.broadcast.emit('message received', newMessageReceived);
        console.log(sended);
        console.log(newMessageReceived);
    });
});