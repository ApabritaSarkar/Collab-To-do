const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const roomRoutes = require("./routes/room");
const protect = require("./middleware/authMiddleware");

const app = express();
const server = http.createServer(app);

// ✅ Proper CORS setup
const allowedOrigins = [
  "http://localhost:5173",
  "https://collab-to-do-chi.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};


app.use(cors(corsOptions));
app.use(express.json());

// ✅ Setup socket.io with same CORS
const io = new Server(server, {
  cors: corsOptions,
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/rooms", roomRoutes);

app.get("/api/private", protect, (req, res) => {
  res.json({ message: `Welcome ${req.user.name}, this is protected content.` });
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("Mongo Error:", err));

// ✅ Socket.io logic
io.on("connection", (socket) => {
  console.log("🔌 A user connected:", socket.id);

  socket.on("task-changed", (data) => {
    socket.broadcast.emit("task-updated", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

app.set("io", io);
