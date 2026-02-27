/**
 * Build-time script: writes config.js from env vars (for Vercel etc.).
 * Set MAPBOX_ACCESS_TOKEN and BARGLANCE_API_KEY in your host's environment.
 */
const fs = require('fs');
const path = require('path');

const token = process.env.MAPBOX_ACCESS_TOKEN;
const apiKey = process.env.BARGLANCE_API_KEY;

if (!token || !apiKey) {
  console.error('Missing env: MAPBOX_ACCESS_TOKEN and BARGLANCE_API_KEY must be set in Vercel → Settings → Environment Variables.');
  process.exit(1);
}

const config = `// Generated at build from env (do not commit if it contains real keys)
window.MAP_CONFIG = {
  mapboxAccessToken: ${JSON.stringify(token)},
  barGlanceApiKey: ${JSON.stringify(apiKey)},
  googleMapsApiKey: '',
  mapId: ''
};
`;
fs.writeFileSync(path.join(__dirname, 'config.js'), config);
console.log('config.js generated from env.');
