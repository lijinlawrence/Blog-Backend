// src/index.js

import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import Yaml from 'yamljs';
import swaggerUI from 'swagger-ui-express';
import bodyParser from 'body-parser';

import dbconnect from './confiq/db.js';
import userRouter from './router/userRouter.js';
import postRouter from './router/postRouter.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

dotenv.config();

// Load Swagger documentation
const yamlFilePath = './src/api.yaml';
const swaggerJSDocs = Yaml.load(yamlFilePath);

// Connect to the database
dbconnect();
console.log(process.env.MONGO_URI);

const PORT = process.env.PORT || 7000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust this to the appropriate origin or use an array of allowed origins
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello world');
});

app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerJSDocs));

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Initialize socket.io
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('comment', (msg) => {
    io.emit('new-comment', msg);
  });

  socket.on('commentDeleted', ({ postId, commentId }) => {
    io.emit('comment-deleted', { postId, commentId });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Export the io instance for use in other modules if needed
export default io;

// Start the server
server.listen(PORT, () => {
  console.log(`Server connected successfully on port ${PORT}`);
});
