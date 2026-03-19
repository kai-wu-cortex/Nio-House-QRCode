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
        'Host': 'app.nio.com',
        'Accept': '*/*',
        'X-Request-Session-ID': '0EFCCFB5-E066-4F06-ADB4-C8B1D55E8664',
        'Accept-Encoding': 'gzip, deflate, br',
        'User-Agent': 'NextevCar/6.2.0 (iPhone; iOS 26.3; Scale/3.00)',
        'Accept-Language': 'zh-Hans-CN;q=1, en-CN;q=0.9',
        'Authorization': 'Bearer 2.0IkLw1IayXSA5CD32/1MdpTe9sF9zhR5BPmTEA3a2JX0=',
        'Connection': 'keep-alive',
        'Cookie': 'tgw_l7_route=2270eb995faa544130e664f1c8a2e41f; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%22412125065%22%2C%22first_id%22%3A%2219b02b2c8e6353-0544563f11c4dd-43670f62-334836-19b02b2c8e7e7c%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfY29va2llX2lkIjoiMTliMDJiMmM4ZTYzNTMtMDU0NDU2M2YxMWM0ZGQtNDM2NzBmNjItMzM0ODM2LTE5YjAyYjJjOGU3ZTdjIiwiJGlkZW50aXR5X2xvZ2luX2lkIjoiNDEyMTI1MDY1In0%3D%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%24identity_login_id%22%2C%22value%22%3A%22412125065%22%7D%2C%22%24device_id%22%3A%2219b02b2c8e6353-0544563f11c4dd-43670f62-334836-19b02b2c8e7e7c%22%7D; RANGERS_WEB_ID=user',
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
