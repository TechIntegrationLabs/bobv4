import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { corsOptions } from './config/auth.js';
import { validateApiKey } from './config/auth.js';
import { handleTrigger, handleSSE } from './controllers/triggerController.js';
import { securityMiddleware } from './middleware/security.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Trust first proxy
app.set('trust proxy', 1);

// Apply security middleware
app.use(securityMiddleware);
app.use(cors(corsOptions));
app.use(express.json());

const authenticateRequest = (req, res, next) => {
  const apiKey = req.body.API_KEY;
  if (!apiKey || !validateApiKey(apiKey)) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  next();
};

// Enable CORS for SSE endpoint
app.get('/api/events', cors(), handleSSE);
app.post('/api/trigger', authenticateRequest, handleTrigger);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});