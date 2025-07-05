const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const protect = require("./middleware/authMiddleware");

const app = express();
const server = http.createServer(app); // Create HTTP server for Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all for now (you can restrict to frontend URL)
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Example protected test route
app.get("/api/private", protect, (req, res) => {
  res.json({ message: `Welcome ${req.user.name}, this is protected content.` });
});

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));

// Socket.IO Real-Time Communication
io.on("connection", (socket) => {
  console.log("🔌 A user connected:", socket.id);

  // When a task changes (create/update/delete), broadcast to others
  socket.on("task-changed", (data) => {
    socket.broadcast.emit("task-updated", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Make io globally accessible in request
app.set("io", io);
