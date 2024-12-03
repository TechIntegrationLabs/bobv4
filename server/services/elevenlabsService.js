import axios from 'axios';

export const processVoiceRequest = async (text, voiceId, voiceSettings) => {
  try {
    const eventData = {
      type: 'conversation',
      data: {
        text,
        voiceId: voiceId || '3xyT5pRsoAGIAmdNtqZl',
        voiceSettings: voiceSettings || {
          stability: 1.0,
          similarity_boost: 0.75,
          style: 0.2
        }
      }
    };

    console.log('Processing voice request:', {
      voiceId: eventData.data.voiceId,
      text: text.substring(0, 50) + '...' // Log partial text for privacy
    });

    return eventData;
  } catch (error) {
    console.error('Error processing voice request:', error);
    throw new Error('Failed to process voice request');
  }
};