// Server-side: fetch bars (for hero images etc.); key never reaches the browser.
export default async function handler(req, res) {
  const apiKey = process.env.BARGLANCE_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'BARGLANCE_API_KEY not configured' });
    return;
  }
  try {
    const response = await fetch(
      'https://partner-api.barglance.com/api/v1/partner/bars',
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );
    const data = await response.json();
    if (!response.ok) {
      res.status(response.status).json(data);
      return;
    }
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch bars' });
  }
}
