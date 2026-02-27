// Vercel serverless: serves config with env vars so no build step is needed.
export default function handler(req, res) {
  const token = process.env.MAPBOX_ACCESS_TOKEN || '';
  const apiKey = process.env.BARGLANCE_API_KEY || '';
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.send(
    `window.MAP_CONFIG={mapboxAccessToken:${JSON.stringify(token)},barGlanceApiKey:${JSON.stringify(apiKey)},googleMapsApiKey:'',mapId:''};`
  );
}
