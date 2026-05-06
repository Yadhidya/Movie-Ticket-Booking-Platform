export default async function handler(req, res) {
  const { path, ...queryParams } = req.query;
  
  // Construct the target URL with all query parameters
  const queryString = new URLSearchParams(queryParams).toString();
  const targetUrl = `https://smart-hub-2026.loca.lt/api/${path}${queryString ? '?' + queryString : ''}`;
  
  console.log(`Proxying to: ${targetUrl}`);

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Bypass-Tunnel-Reminder': 'true',
        'Content-Type': 'application/json'
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).send(errorText);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to reach backend via tunnel' });
  }
}
