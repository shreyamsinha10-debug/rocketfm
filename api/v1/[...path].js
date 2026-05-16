const BACKEND_ORIGIN = process.env.BACKEND_URL || 'http://64.225.84.126:9090';

export default async function handler(req, res) {
  const segments = req.query.path;
  const path = Array.isArray(segments) ? segments.join('/') : segments || '';
  const queryStart = req.url?.indexOf('?') ?? -1;
  const query = queryStart >= 0 ? req.url.slice(queryStart) : '';
  const targetUrl = `${BACKEND_ORIGIN}/api/v1/${path}${query}`;

  try {
    const headers = { ...req.headers };
    delete headers.host;
    delete headers.connection;

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

    const body = Buffer.from(await upstream.arrayBuffer());
    res.send(body);
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
