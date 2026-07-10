import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/tasks.js'

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;

// Standard Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// link
app.use('/api/tasks', taskRoutes);

// Health Check Route (Good practice for verifying the server works)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend server running smoothly' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});