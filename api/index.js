export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.url === '/') {
    return res.status(200).send('OK');
  }
  
  const target = req.url.substring(1);
  
  if (!target.startsWith('http')) {
    return res.status(400).send('Bad Request');
  }
  
  try {
    const response = await fetch(target, {
      method: req.method,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'tr-TR,tr;q=0.9',
        'Referer': 'https://radyo.duhnet.tv/',
        'Origin': 'https://radyo.duhnet.tv',
        'Sec-Fetch-Dest': 'audio',
        'Sec-Fetch-Mode': 'cors',
        'Range': req.headers['range'] || ''
      }
    });
    
    const newHeaders = {};
    
    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (!['connection', 'transfer-encoding', 'content-encoding'].includes(lowerKey)) {
        newHeaders[key] = value;
      }
    });
    
    newHeaders['Access-Control-Allow-Origin'] = '*';
    newHeaders['Access-Control-Expose-Headers'] = '*';
    
    Object.entries(newHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    
    const buffer = Buffer.from(await response.arrayBuffer());
    return res.status(response.status).send(buffer);
    
  } catch (err) {
    return res.status(502).json({ error: err.message });
  }
}
