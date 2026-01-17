export async function onRequestPost(context) {
  try {
    const { message, history, knowledgeBase } = await context.request.json();
    
    const apiKey = context.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('API key missing from environment variables');
      return new Response(JSON.stringify({ 
        text: '⚠️ Configuration error. Please contact support at 1331.',
        debug: 'API_KEY_MISSING'
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Format conversation history
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.parts[0].text }]
    }));

    const contents = [
      ...formattedHistory,
      { role: 'user', parts: [{ text: message }] }
    ];

    const requestBody = {
      contents,
      systemInstruction: {
        role: 'user',
        parts: [{
          text: `You are the Official PickMe AI Support Assistant.

CRITICAL RULES:
1. LANGUAGE: Respond in the SAME language the customer uses (English/Sinhala/Tamil)
2. For Trip/Driver complaints: Ask for Name, Trip ID, Contact Number
3. For Lost items: Direct to call 1331 immediately
4. For Refunds: Guide to PickMe App → My Trips → HELP button
5. TONE: Professional, empathetic, urgent

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
    };

    console.log('Calling Gemini API...');
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API error: ${response.status}`, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Invalid API response:', JSON.stringify(data));
      throw new Error('Invalid API response structure');
    }
    
    const text = data.candidates[0].content.parts[0].text;
    console.log('Successfully generated response');
    
    return new Response(JSON.stringify({ text }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('Chat API Error:', error.message, error.stack);
    return new Response(JSON.stringify({ 
      text: "I'm having trouble connecting. Please call 1331 for immediate help.",
      debug: error.message
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
