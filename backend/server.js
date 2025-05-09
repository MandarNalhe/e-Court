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
    origin: ["https://frontend-production-cd40.up.railway.app"],// Allow frontend to connect
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors()); 
app.use(express.json()); 

// 🔹 WebSocket (Socket.IO) Implementation
const rooms = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Create a room
 // Server-side code (backend/server.js)
socket.on("start-call", (callback) => {
  const roomId = `room-${Date.now()}`;
  rooms[roomId] = [];
  console.log(`Room created: ${roomId}`);
  
  if (typeof callback === "function") {
    callback(roomId); // Send the room ID back to the frontend
  } else {
    console.error('Callback is not a function!');
  }
});;

  // Join room
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    if (!rooms[roomId]) rooms[roomId] = [];
    rooms[roomId].push(socket.id);

    socket.to(roomId).emit("user-connected", socket.id); // Notify others in the room
  });

  // WebRTC Signaling

  socket.on("offer", ({ to, offer }) => {
    console.log(`Emitting offer to ${to}`, offer);
    io.to(to).emit("offer", { from: socket.id, offer });
  });

  socket.on("answer", ({ to, answer }) => {
    console.log(`Emitting answer to ${to}`, answer);
    io.to(to).emit("answer", { from: socket.id, answer });
  });

  socket.on("ice-candidate", ({ to, candidate }) => {
    console.log(`Emitting ICE candidate to ${to}`, candidate);
    io.to(to).emit("ice-candidate", { from: socket.id, candidate });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    // Optional: remove from rooms[roomId] if needed
  });
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
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// 🔹 Start the server (Only One `server.listen`)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
