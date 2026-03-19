import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const url = `https://app.nio.com/n/c/lifestyle/account/user/qr_code?app_id=10002&app_ver=6.2.0&device_id=14e3f556d3984993a59ad96e8af3ba2d&lang=zh-cn&region=cn&timestamp=${timestamp}&refresh=0&sign=7088d8df23f2aadd9147ad5a4df30a3f`;

    const response = await fetch(url, {
      headers: {
        'Accept': '*/*',
        'X-Request-Session-ID': '0EFCCFB5-E066-4F06-ADB4-C8B1D55E8664',
        'Authorization': 'Bearer 2.0IkLw1IayXSA5CD32/1MdpTe9sF9zhR5BPmTEA3a2JX0=',
        'Accept-Language': 'zh-Hans-CN;q=1, en-CN;q=0.9',
        'User-Agent': 'NextevCar/6.2.0 (iPhone; iOS 26.3; Scale/3.00)',
        'Referer': 'https://app.nio.com/',
        'Origin': 'https://app.nio.com',
        'Connection': 'keep-alive',
        'Cookie': 'tgw_l7_route=2270eb995faa544130e664f1c8a2e41f',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Upstream error: ${response.status}` });
    }

    const data = await response.json();

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    return res.status(200).json(data);
  } catch (error) {
    console.error('QR Code proxy error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
