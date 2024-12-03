import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: true // Enable when behind a reverse proxy
});

export const securityMiddleware = [
  helmet({
    contentSecurityPolicy: false, // Disabled for ElevenLabs widget
    crossOriginEmbedderPolicy: false
  }),
  limiter
];