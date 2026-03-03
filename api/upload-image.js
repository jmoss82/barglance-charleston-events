import { put } from '@vercel/blob';

const MAX_BYTES = 6 * 1024 * 1024;

function sanitizeName(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseDataUrl(dataUrl) {
  const match = /^data:([^;]+);base64,(.+)$/.exec(String(dataUrl || ''));
  if (!match) return null;
  return { mime: match[1], base64: match[2] };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    res.status(500).json({ error: 'BLOB_READ_WRITE_TOKEN not configured' });
    return;
  }

  try {
    const { filename, contentType, dataUrl, venueId, venueName } = req.body || {};
    const parsed = parseDataUrl(dataUrl);
    if (!parsed) {
      res.status(400).json({ error: 'Invalid dataUrl payload' });
      return;
    }

    const mime = String(contentType || parsed.mime || '');
    if (!mime.startsWith('image/')) {
      res.status(400).json({ error: 'Only image uploads are supported' });
      return;
    }

    const buffer = Buffer.from(parsed.base64, 'base64');
    if (!buffer.length) {
      res.status(400).json({ error: 'Empty file' });
      return;
    }
    if (buffer.length > MAX_BYTES) {
      res.status(400).json({ error: 'File exceeds 6MB limit' });
      return;
    }

    const extFromMime = mime.split('/')[1] || 'jpg';
    const safeExt = sanitizeName(extFromMime) || 'jpg';
    const safeBase = sanitizeName(filename) || 'upload';
    const safeVenueName = sanitizeName(venueName) || 'venue';
    const safeVenueId = sanitizeName(venueId) || 'unknown';
    const path = `venue-images/${safeVenueName}-${safeVenueId}/${Date.now()}-${safeBase}.${safeExt}`;

    const blob = await put(path, buffer, {
      access: 'public',
      contentType: mime,
      addRandomSuffix: false,
      token
    });

    res.status(200).json({ url: blob.url, pathname: blob.pathname, size: buffer.length });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
}
