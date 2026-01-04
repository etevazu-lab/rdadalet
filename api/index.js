export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const path = req.url.replace('/api', '');
  
  if (path === '/' || path === '') {
    return res.status(200).send('OK');
  }
  
  const target = path.substring(1);
  
  if (!target.startsWith('http')) {
    return res.status(400).send('Bad Request');
  }
  
  try {
    const response = await fetch(target, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': '*/*'
      }
    });
    
    response.headers.forEach((value, key) => {
      if (!['connection', 'transfer-encoding'].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const buffer = Buffer.from(await response.arrayBuffer());
    return res.status(response.status).send(buffer);
    
  } catch (err) {
    return res.status(502).send('Error');
  }
}
