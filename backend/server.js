const express = require('express');
const http = require('http'); // Required to integrate with Socket.IO
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app); // Create an HTTP server instance
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],// Allow frontend to connect
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors()); 
app.use(express.json()); 

// 🔹 WebSocket (Socket.IO) Implementation
const rooms = {};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle "start-call" event to create a room
  socket.on('start-call', (callback) => {
    const roomId = `room-${Date.now()}`;
    rooms[roomId] = [];
    console.log(`Room created: ${roomId}`);

    callback(roomId); // Send the room ID back to the frontend
  });

  // Handle users joining a room
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    rooms[roomId].push(userId);
    io.to(roomId).emit('user-connected', userId);
  });

  // Handle WebRTC signaling
  socket.on('send-signal', (signalData) => {
    io.to(signalData.userId).emit('receive-signal', signalData);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// ✅ Add Express Routes if needed
app.get("/", (req, res) => {
  res.send("Video Call Backend Running");
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const otpRoutes = require('./routes/otpRoutes'); // New route for OTP
const caseRoutes = require("./routes/cRoutes");

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/otp', otpRoutes); // OTP Routes
app.use('/api/cases', caseRoutes);

// Connect to MongoDB
mongoose
  .connect(${MONGO_URI}, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// 🔹 Start the server (Only One `server.listen`)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
