/**
 * Build-time script: writes config.js from env vars.
 * This file is browser-visible, so only include public keys.
 */
const fs = require('fs');
const path = require('path');

const token = process.env.MAPBOX_ACCESS_TOKEN;

if (!token) {
  console.error('Missing env: MAPBOX_ACCESS_TOKEN must be set.');
  process.exit(1);
}

const config = `// Generated at build from env (public values only)
window.MAP_CONFIG = {
  mapboxAccessToken: ${JSON.stringify(token)},
  // Keep BarGlance key server-side only (api/events.js + api/bars.js)
  barGlanceApiKey: '',
  googleMapsApiKey: '',
  mapId: ''
};
`;

fs.writeFileSync(path.join(__dirname, 'config.js'), config);
console.log('config.js generated from env (Mapbox token only).');