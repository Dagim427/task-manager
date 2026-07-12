import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/tasks.js'
import db from './config/db.js'

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

// check databases
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("DB connection successfully");
    connection.release();
  } catch (error) {
    console.error("DB connection failed:", error.message);
  }
})();

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});