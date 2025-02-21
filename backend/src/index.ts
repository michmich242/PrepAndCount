import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:8081', 'http://10.0.0.196:8081', 'exp://10.0.0.196:8081', 'http://10.0.0.64:5000', 'exp://10.0.0.64:5000', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/prepandcount';
console.log('Environment variables loaded:', {
  MONGODB_URI: MONGODB_URI.replace(/:[^:]*@/, ':****@'),
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT
});

const mongooseOptions: mongoose.ConnectOptions = {
  connectTimeoutMS: 10000, // Connection timeout
  socketTimeoutMS: 45000,  // Socket timeout
  serverSelectionTimeoutMS: 10000, // Server selection timeout
  heartbeatFrequencyMS: 2000, // Heartbeat frequency
  maxPoolSize: 10, // Maximum number of connections
  minPoolSize: 2,  // Minimum number of connections
  retryWrites: true,
  w: 'majority' // Write concern directly on the options object
};

// Add detailed error logging
mongoose.set('debug', true); // Enable mongoose debug mode

mongoose.connect(MONGODB_URI, mongooseOptions)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas');
    console.log('Database name:', mongoose.connection.name);
    console.log('Database host:', mongoose.connection.host);
    console.log('Connection state:', mongoose.connection.readyState);
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    if (error.name === 'MongoServerSelectionError') {
      console.error('Could not connect to MongoDB Atlas. Please check:');
      console.error('1. Your network connection');
      console.error('2. IP Whitelist in MongoDB Atlas');
      console.error('3. Database user credentials');
      console.error('4. Database cluster status');
    }
    console.error('Full error details:', JSON.stringify(error, null, 2));
  });

// Configure mongoose connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected successfully');
});

// Start server
const PORT = parseInt(process.env.PORT || '5000', 10);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Server is accessible at http://localhost:${PORT}`);
  console.log(`For mobile devices, use http://10.0.0.196:${PORT}`);
});
