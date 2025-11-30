export default async function handler(req, res) {
  const nextdns = 'https://api.nextdns.io' + req.url.replace('/api-proxy', '');
  const headers = {
    ...req.headers,
    'X-Api-Key': 'f31f2871d328a52a45fefadc09a1c67d0dd5d53d',
    'User-Agent': 'Mozilla/5.0',
    'Accept': 'application/json'
  };
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Api-Key');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.status(200).end();
    return;
  }
  const resp = await fetch(nextdns, {
    method: req.method,
    headers,
    body: req.method === 'GET' ? undefined : req.body
  });
  res.setHeader('Access-Control-Allow-Origin', '*');
  const text = await resp.text();
  res.status(resp.status).send(text);
}
