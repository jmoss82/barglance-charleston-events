import { list, put } from '@vercel/blob';

const OVERRIDES_BLOB_PATH = 'config/image-overrides.json';

function normalizeOverrideMap(input) {
  if (!input || typeof input !== 'object') return { updatedAt: '', venues: {} };
  const raw = input.venues && typeof input.venues === 'object' ? input.venues : input;
  const venues = {};
  Object.keys(raw).forEach((key) => {
    const item = raw[key];
    if (!item || typeof item !== 'object') return;
    const id = String(key).trim();
    if (!id) return;
    const imageUrl = String(item.imageUrl || item.heroUrl || '').trim();
    venues[id] = {
      imageUrl: imageUrl.replace(/^http:\/\//i, 'https://'),
      objectFit: item.objectFit === 'contain' ? 'contain' : 'cover',
      objectPosition: item.objectPosition ? String(item.objectPosition).trim() : 'center center',
      notes: item.notes ? String(item.notes).trim() : ''
    };
  });
  return {
    updatedAt: input.updatedAt || new Date().toISOString(),
    venues
  };
}

async function loadOverridesFromBlob(token) {
  const result = await list({ prefix: OVERRIDES_BLOB_PATH, limit: 1, token });
  const blob = result && result.blobs && result.blobs[0] ? result.blobs[0] : null;
  if (!blob || !blob.url) return { updatedAt: '', venues: {} };

  const response = await fetch(blob.url, { cache: 'no-store' });
  if (!response.ok) return { updatedAt: '', venues: {} };
  const data = await response.json();
  return normalizeOverrideMap(data);
}

export default async function handler(req, res) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    res.status(500).json({ error: 'BLOB_READ_WRITE_TOKEN not configured' });
    return;
  }

  if (req.method === 'GET') {
    try {
      const overrides = await loadOverridesFromBlob(token);
      res.setHeader('Cache-Control', 'public, max-age=30');
      res.status(200).json(overrides);
    } catch (err) {
      res.status(500).json({ error: err.message || 'Failed to load overrides' });
    }
    return;
  }

  if (req.method === 'POST') {
    const adminToken = process.env.ADMIN_PANEL_TOKEN || '';
    const provided = String(req.headers['x-admin-token'] || '').trim();
    if (!adminToken || provided !== adminToken) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const normalized = normalizeOverrideMap(req.body || {});
      normalized.updatedAt = new Date().toISOString();

      const blob = await put(
        OVERRIDES_BLOB_PATH,
        JSON.stringify(normalized, null, 2),
        {
          access: 'public',
          contentType: 'application/json',
          addRandomSuffix: false,
          token
        }
      );

      res.status(200).json({
        ok: true,
        updatedAt: normalized.updatedAt,
        url: blob.url,
        count: Object.keys(normalized.venues || {}).length
      });
    } catch (err) {
      res.status(500).json({ error: err.message || 'Failed to save overrides' });
    }
    return;
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).json({ error: 'Method not allowed' });
}
