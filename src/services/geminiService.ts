import { PICKME_KNOWLEDGE_BASE } from "../constants/pickmeData";

export const getChatResponse = async (
  userMessage: string, 
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  try {
    const response = await fetch('/api/chat', {
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

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
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