module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
        signal: AbortSignal.timeout(270000)
      }
    );

    const data = await response.json();
    console.log('Gemini raw response:', JSON.stringify(data).slice(0, 500));

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!text) {
      console.log('No text found:', JSON.stringify(data));
      return res.status(200).json({ text: '', error: 'No text in response' });
    }

    res.status(200).json({ text });

  } catch (err) {
    console.error('Handler error:', err);
    res.status(500).json({ text: '', error: err.message });
  }
}
