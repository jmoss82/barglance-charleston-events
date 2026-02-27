// Vercel serverless: only the Mapbox token is sent to the browser. BarGlance key stays server-side (see api/events.js).
export default function handler(req, res) {
  const token = process.env.MAPBOX_ACCESS_TOKEN || '';
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.send(
    `window.MAP_CONFIG={mapboxAccessToken:${JSON.stringify(token)},googleMapsApiKey:'',mapId:''};`
  );
}
