const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const setupChatSocket = require('./chatSocket');

/**
 * Set up the Socket.io server
 * @param {Object} server - HTTP server instance
 * @returns {Object} Socket.io server instance
 */
const setupSocketServer = (server) => {
  console.log('🔌 Setting up Socket.io server');
  
  // Create Socket.io server with CORS config
  const io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000, // 60 seconds
    pingInterval: 25000, // 25 seconds - more frequent pings for better connection detection
    transports: ['polling', 'websocket'], // Allow both transport methods
    allowUpgrades: true, // Allow transport upgrades
    path: '/socket.io/', // Explicit path
    connectTimeout: 45000, // Longer connection timeout (45 seconds)
  });
  
  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        console.log('❌ Socket connection rejected: No token provided');
        return next(new Error('Authentication error: Token required'));
      }
      
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (!decoded || !decoded.userId) {
        console.log('❌ Socket connection rejected: Invalid token');
        return next(new Error('Authentication error: Invalid token'));
      }
      
      // Find user by MongoDB ID instead of Clerk ID
      const user = await User.findById(decoded.userId);
      if (!user) {
        console.log(`❌ Socket connection rejected: User not found for MongoDB ID ${decoded.userId}`);
        return next(new Error('Authentication error: User not found'));
      }
      
      // Attach user data to socket
      socket.user = {
        id: decoded.userId, // This is now the MongoDB ID
        mongoId: user._id,
        username: user.username
      };
      
      console.log(`✅ Socket authentication successful for user: ${user.username}`);
      next();
    } catch (error) {
      console.error('❌ Socket authentication error:', error.message);
      next(new Error('Authentication error: ' + error.message));
    }
  });
  
  // Set up chat sockets
  setupChatSocket(io);
  
  // Handle connection events
  io.on('connection', (socket) => {
    console.log(`🟢 User connected: ${socket.user.username} (${socket.id})`);
    
    // Handle ping request (for connection testing)
    socket.on('ping', (data) => {
      console.log(`📡 Ping received from ${socket.user.username}:`, data);
      
      // Send pong response with timestamp for latency calculation
      socket.emit('pong', { 
        serverTime: new Date().toISOString(),
        clientTime: data?.timestamp,
        user: socket.user.username
      });
    });
    
    // Handle custom health check
    socket.on('health_check', (_, callback) => {
      try {
        callback({
          status: 'ok',
          socketId: socket.id,
          user: socket.user.username,
          time: new Date().toISOString()
        });
      } catch (error) {
        console.error('❌ Error in health check callback:', error);
      }
    });
    
    // Log disconnect events
    socket.on('disconnect', (reason) => {
      console.log(`🔴 User disconnected: ${socket.user.username} (${socket.id}), reason: ${reason}`);
    });
    
    // Handle socket errors
    socket.on('error', (error) => {
      console.error(`❌ Socket error for ${socket.user.username}:`, error);
    });
  });
  
  // Handle server-level errors
  io.engine.on('connection_error', (err) => {
    console.error('❌ Socket.io connection error:', err);
  });
  
  console.log('✅ Socket.io server set up successfully');
  return io;
};

module.exports = setupSocketServer; 