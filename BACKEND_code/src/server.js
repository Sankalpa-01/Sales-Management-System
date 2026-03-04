const dotenv = require('dotenv');
dotenv.config(); 

const app = require('./app');
const db = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app); // Create HTTP server for socket.io to hook into
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // allow your frontend
    methods: ["GET", "POST"],
  },
});

// Setup socket events
io.on('connection', (socket) => {
  console.log(`📡 Client connected: ${socket.id}`);

  // Example event: test ping
  socket.on('ping', () => {
    console.log('🔁 Received ping from client');
    socket.emit('pong');
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// Store the socket.io instance for use elsewhere (optional)
app.set('io', io);

// Connect to DB and then start server
db.getConnection()
  .then((connection) => {
    console.log('✅ Connected to MySQL Database');
    connection.release();

    server.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message || err);
    process.exit(1);
  });
