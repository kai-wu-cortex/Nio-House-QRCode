import type * as http from 'http';
import { validateCredentials } from './api/login';

export async function notionAuthMiddleware(
  req: http.IncomingMessage & { url?: string; method?: string },
  res: http.ServerResponse,
  next: (err?: any) => void
) {
  // Handle POST to /api/login
  if (req.url === '/api/login' && req.method === 'POST') {
    let body = '';
    for await (const chunk of req) {
      body += chunk;
    }

    try {
      const { username, password } = JSON.parse(body);

      if (!username || !password) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: '缺少账号或密码' }));
        return;
      }

      const result = await validateCredentials({ username, password });

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(result));

    } catch (error) {
      console.error('Login error:', error);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: '服务器错误' }));
    }
    return;
  }

  // Handle GET to /api/qr-code (proxy to nio.com)
  if (req.url === '/api/qr-code' && req.method === 'GET') {
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
        },
      });

      const data = await response.json();

      res.statusCode = response.ok ? 200 : response.status;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.end(JSON.stringify(data));

    } catch (error) {
      console.error('QR Code proxy error:', error);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
    return;
  }

  // Handle OPTIONS for CORS
  if (req.url === '/api/qr-code' && req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.end();
    return;
  }

  return next();
}
