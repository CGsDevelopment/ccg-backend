const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

require('dotenv').config();

const PORT = 3001;
const mongoDBURL = process.env.DATABASE_URL;

const app = express();

app.use(express.json());
app.use(cors);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"],
    },
});

io.on('connection', (socket) => {
    // console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
        // console.log("Joined: ", data);
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data.message);
        // console.log("room: " , data.room, "| msg: ", data.message);
    });
});

mongoose.connect(mongoDBURL);

const userSchema = {
    userID: String,
    gameRoom: String
}

const gameRoomSchema = {
    gameRoom: String,
    userIDs: [userSchema]
}

const GameRoom = mongoose.model("GameRoom", gameRoomSchema);

server.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`)
})