// functions/generate.js
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const { category, keywords } = JSON.parse(event.body || '{}');

    // Create prompt text for the model
    let prompt = `Generate a concise, friendly, and positive ${category.replace('_',' ')} about luck. Keep it <= 40 words.`;
    if (keywords) prompt += ` Include these keywords: ${keywords}.`;

    // Call OpenAI
    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if(!OPENAI_KEY) return { statusCode: 500, body: JSON.stringify({ error: 'Missing API key' }) };

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", /* or whatever model you have access to */
        messages: [{role:'system', content:'You are a short, upbeat fortune writer.'},{role:'user', content:prompt}],
        max_tokens: 120,
        temperature: 0.9
      })
    });

    if(!openaiRes.ok){
      const txt = await openaiRes.text();
      return { statusCode: 502, body: JSON.stringify({ error: 'OpenAI error', detail: txt }) };
    }
    const payload = await openaiRes.json();
    const text = payload.choices?.[0]?.message?.content || payload.choices?.[0]?.text || '';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result: text.trim() })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
  }
};
