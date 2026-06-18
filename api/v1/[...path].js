const BACKEND_ORIGIN = process.env.BACKEND_URL || 'http://168.144.0.100:9090';

const STRIP_HEADERS = new Set([
  'host',
  'connection',
  'origin',
  'referer',
  'x-forwarded-host',
  'x-forwarded-proto',
  'x-real-ip',
  'x-vercel-id',
  'x-vercel-deployment-url',
  'x-vercel-forwarded-for',
  'x-forwarded-for',
]);

export default async function handler(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const apiPath = url.pathname.replace(/^\/api\/v1\/?/, '');
  const targetUrl = `${BACKEND_ORIGIN}/api/v1/${apiPath}${url.search}`;

  const headers = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (STRIP_HEADERS.has(key.toLowerCase())) continue;
    headers[key] = value;
  }

  try {
    const init = { method: req.method, headers };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      if (chunks.length) init.body = Buffer.concat(chunks);
    }

    const upstream = await fetch(targetUrl, init);
    res.status(upstream.status);

    upstream.headers.forEach((value, key) => {
      if (!['transfer-encoding', 'connection'].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    res.send(Buffer.from(await upstream.arrayBuffer()));
  } catch (err) {
    res.status(502).json({
      error: 'Backend unreachable',
      message: err.message,
      target: targetUrl,
    });
  }
}

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};
