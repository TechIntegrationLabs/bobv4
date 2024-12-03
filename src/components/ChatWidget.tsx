import React, { useEffect, useCallback, useRef } from 'react';

interface ChatWidgetProps {
  isActive: boolean;
}

interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
}

interface ConversationEvent {
  type: string;
  data: {
    text: string;
    voiceId: string;
    voiceSettings: VoiceSettings;
  };
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ isActive }) => {
  const widgetRef = useRef<HTMLElement | null>(null);

  const setupTriggerListener = useCallback(() => {
    if (!isActive) return;

    const eventSource = new EventSource(`${import.meta.env.VITE_API_URL}/api/events`);
    
    eventSource.onmessage = (event) => {
      try {
        const eventData: ConversationEvent = JSON.parse(event.data);
        
        if (eventData.type === 'conversation' && widgetRef.current) {
          const widget = widgetRef.current as any;
          
          // Update voice settings if the widget API supports it
          if (widget.setVoiceSettings) {
            widget.setVoiceSettings(
              eventData.data.voiceId,
              eventData.data.voiceSettings
            );
          }
          
          // Trigger conversation with the received text
          if (widget.startConversation) {
            widget.startConversation(eventData.data.text);
          }
        }
      } catch (error) {
        console.error('Error processing event:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    const script = document.createElement('script');
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.async = true;
    script.type = 'text/javascript';
    document.body.appendChild(script);

    script.onload = () => {
      const widget = document.createElement('elevenlabs-convai');
      widget.setAttribute('agent-id', '3xyT5pRsoAGIAmdNtqZl');
      widget.id = 'elevenlabs-widget';
      widget.style.position = 'fixed';
      widget.style.right = '20px';
      widget.style.bottom = '20px';
      widget.style.zIndex = '1000';
      document.body.appendChild(widget);
      widgetRef.current = widget;
    };

    const cleanup = setupTriggerListener();

    return () => {
      document.body.removeChild(script);
      const existingWidget = document.getElementById('elevenlabs-widget');
      if (existingWidget) {
        document.body.removeChild(existingWidget);
      }
      if (cleanup) cleanup();
      widgetRef.current = null;
    };
  }, [isActive, setupTriggerListener]);

  return null;
};

export default ChatWidget;