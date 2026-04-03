import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
dotenv.config();

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Create a single Supabase client for validating tokens
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

// Socket.io Middleware for Supabase Auth
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error: Missing token'));
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      throw new Error('Invalid or expired token');
    }

    socket.data.user = { sub: user.id }; // Attach user info natively
    next();
  } catch (err) {
    console.error('API Verification error:', err);
    return next(new Error('Authentication error: Invalid token'));
  }
});

io.on('connection', (socket) => {
  const userId = socket.data.user?.sub;
  console.log(`User connected: Socket ${socket.id} (User ID: ${userId})`);

  socket.on('join-room', (roomId: string) => {
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);
    // Optional: socket.to(roomId).emit('user-joined', userId);
  });

  socket.on('code-change', ({ roomId, code }: { roomId: string, code: string }) => {
    // Broadcast to everyone else in the room
    socket.to(roomId).emit('code-change', code);
  });

  // --- Real-time Chat ---
  socket.on('chat-message', ({ roomId, message, senderId, senderName }: any) => {
    socket.to(roomId).emit('chat-message', { message, senderId, senderName, timestamp: new Date() });
  });

  // --- WebRTC Signaling ---
  socket.on('webrtc-offer', ({ roomId, offer }: any) => {
    socket.to(roomId).emit('webrtc-offer', offer);
  });

  socket.on('webrtc-answer', ({ roomId, answer }: any) => {
    socket.to(roomId).emit('webrtc-answer', answer);
  });

  socket.on('webrtc-ice-candidate', ({ roomId, candidate }: any) => {
    socket.to(roomId).emit('webrtc-ice-candidate', candidate);
  });

  socket.on('disconnecting', () => {
    // Notify all rooms this socket is part of, before it leaves
    for (const room of socket.rooms) {
      if (room !== socket.id) {
         socket.to(room).emit('peer-disconnected', userId);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: Socket ${socket.id}`);
  });
});

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Mentorship Platform Backend is running!');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
