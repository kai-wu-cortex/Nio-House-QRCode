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
    // sign is fixed, must use fixed timestamp that matches the sign
    const timestamp = 1778949276;
    const url = `https://app.nio.com/n/c/lifestyle/account/user/qr_code?app_id=10002&app_ver=6.4.1&device_id=14e3f556d3984993a59ad96e8af3ba2d&lang=zh-cn&region=cn&timestamp=${timestamp}&refresh=0&sign=4c200f5a531a081bf7e1519a7af78ae4`;

    const response = await fetch(url, {
      headers: {
        'Host': 'app.nio.com',
        'Accept': '*/*',
        'X-Request-Session-ID': '685D4877-8379-4CB8-B454-88C0ACCEC8F4',
        'Accept-Encoding': 'gzip, deflate, br',
        'User-Agent': 'NextevCar/6.4.1 (iPhone; iOS 26.4.1; Scale/3.00)wa',
        'Accept-Language': 'zh-Hans-CN;q=1, en-CN;q=0.9',
        'Authorization': 'Bearer 2.03JcSoRwJe7GTWB/u7rYQc/GFpE2LowvHwyY265Pqrcc=',
        'Connection': 'keep-alive',
        'Cookie': 'tgw_l7_route=0c0b045b30d29b6cb7e64bafee42da3e; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%22412125065%22%2C%22first_id%22%3A%2219a770b261630d1-07897244f8104b4-41670c64-383040-19a770b261743f6%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfY29va2llX2lkIjoiMTlhNzcwYjI2MTYzMGQxLTA3ODk3MjQ0ZjgxMDRiNC00MTY3MGM2NC0zODMwNDAtMTlhNzcwYjI2MTc0M2Y2IiwiJGlkZW50aXR5X2xvZ2luX2lkIjoiNDEyMTI1MDY1In0%3D%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%24identity_login_id%22%2C%22value%22%3A%22412125065%22%7D%2C%22%24device_id%22%3A%2219a770b261630d1-07897244f8104b4-41670c64-383040-19a770b261743f6%22%7D',
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
