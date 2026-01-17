import { PICKME_KNOWLEDGE_BASE } from "../constants/pickmeData";

export const getChatResponse = async (
  userMessage: string, 
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  try {
    // Determine the correct endpoint
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const endpoint = isDev ? '/api/chat' : '/functions/api/chat';
    
    console.log('Calling endpoint:', endpoint);
    console.log('Message:', userMessage);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        history: history,
        knowledgeBase: PICKME_KNOWLEDGE_BASE
      })
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Response data:', data);
    
    if (data.debug) {
      console.error('Debug info:', data.debug);
    }
    
    if (data.error) {
      console.error('API Error:', data.error);
      throw new Error(data.error);
    }

    return data.text || "I apologize, I couldn't generate a response. Please try again.";

  } catch (error: any) {
    console.error("PickMe Bot Error:", error);
    return "I'm sorry, I'm having trouble connecting to the support system. Please try again or call our 24/7 hotline at 1331 for immediate assistance.";
  }
};