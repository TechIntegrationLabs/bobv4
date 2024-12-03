import dotenv from 'dotenv';
dotenv.config();

export const validateApiKey = (apiKey) => {
  return apiKey === process.env.PI_AUTH_TOKEN;
};

export const corsOptions = {
  origin: process.env.VITE_APP_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};