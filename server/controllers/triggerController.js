import { validateVoiceSettings } from '../utils/voiceValidator.js';
import { processVoiceRequest } from '../services/elevenlabsService.js';

export const handleTrigger = async (req, res) => {
  try {
    // Normalize keys to lowercase for case-insensitive comparison
    const payload = normalizeKeys(req.body);
    
    // Destructure with normalized keys
    const { api_key, voice_id, voice_settings, text } = payload;
    
    console.log('Received request payload:', {
      voice_id,
      voice_settings,
      text: text?.substring(0, 50) + '...' // Log partial text for privacy
    });

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (voice_settings && !validateVoiceSettings(voice_settings)) {
      return res.status(400).json({ error: 'Invalid voice settings' });
    }

    // Set timeout for the response
    res.setTimeout(10000, () => {
      res.status(504).json({ error: 'Request timeout' });
    });

    const eventData = await processVoiceRequest(text, voice_id, voice_settings);
    req.app.locals.latestEvent = eventData;
    
    res.json({ 
      success: true, 
      message: 'Trigger received and processed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Trigger handler error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

export const handleSSE = (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  const sendEvent = () => {
    if (req.app.locals.latestEvent) {
      res.write(`data: ${JSON.stringify(req.app.locals.latestEvent)}\n\n`);
      req.app.locals.latestEvent = null;
    }
  };

  const intervalId = setInterval(sendEvent, 1000);

  req.on('close', () => {
    clearInterval(intervalId);
  });
};

// Helper function to normalize object keys to lowercase
function normalizeKeys(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;
  
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    const normalizedValue = typeof value === 'object' ? normalizeKeys(value) : value;
    acc[key.toLowerCase()] = normalizedValue;
    return acc;
  }, {});
}