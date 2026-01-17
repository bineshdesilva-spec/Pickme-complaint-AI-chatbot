export async function onRequestPost(context) {
  try {
    const { message, history, knowledgeBase } = await context.request.json();
    
    // Access environment variable from Cloudflare Pages
    const apiKey = context.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ 
        text: '⚠️ API key not configured. Please contact support at 1331.'
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            ...history,
            { role: 'user', parts: [{ text: message }] }
          ],
          systemInstruction: {
            parts: [{
              text: `You are the Official PickMe AI Support Assistant.
Your mission is to handle complaints with extreme empathy and speed.

STRICT RULES:
1. LANGUAGE: Always reply in the user's language (Sinhala, English, or Tamil).
2. DATA: For Trip/Driver complaints, ask for: Name, Trip ID, and Contact Number.
3. REDIRECTION: For lost items, tell them to call 1331 immediately.
4. APP SUPPORT: For refunds, guide them to use "HELP" in PickMe App → My Trips.
5. TONE: Professional but warm.

KNOWLEDGE BASE:
${knowledgeBase}`
            }]
          },
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    return new Response(JSON.stringify({ text }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      text: "I'm having trouble connecting. Please call 1331 for immediate help."
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}