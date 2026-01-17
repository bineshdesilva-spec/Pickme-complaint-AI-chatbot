// ============================================
// FILE 1: functions/api/chat.js (Claude Version)
// ============================================
export async function onRequestPost(context) {
  try {
    const { message, history, knowledgeBase } = await context.request.json();
    
    const apiKey = context.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      console.error('API key missing from environment variables');
      return new Response(JSON.stringify({ 
        text: '⚠️ Configuration error. Please contact support at 1331.'
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Build conversation history for Claude
    const messages = history.map(msg => ({
      role: msg.role === 'model' ? 'assistant' : 'user',
      content: msg.parts[0].text
    }));

    // Add current message
    messages.push({
      role: 'user',
      content: message
    });

    const systemPrompt = `You are the Official PickMe AI Support Assistant.

CRITICAL RULES:
1. LANGUAGE: Respond in the SAME language the customer uses (English/Sinhala/Tamil)
2. For Trip/Driver complaints: Ask for Name, Trip ID, Contact Number
3. For Lost items: Direct to call 1331 immediately
4. For Refunds: Guide to PickMe App → My Trips → HELP button
5. TONE: Professional, empathetic, urgent

KNOWLEDGE BASE:
${knowledgeBase}`;

    console.log('Calling Claude API...');
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Claude API error: ${response.status}`, errorText);
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.content?.[0]?.text) {
      console.error('Invalid API response:', JSON.stringify(data));
      throw new Error('Invalid API response structure');
    }
    
    const text = data.content[0].text;
    console.log('Successfully generated response');
    
    return new Response(JSON.stringify({ text }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('Chat API Error:', error.message);
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