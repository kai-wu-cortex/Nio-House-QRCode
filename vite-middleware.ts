import type { Connect } from 'vite';
import { validateCredentials } from './server/login';

export async function notionAuthMiddleware(
  req: Connect.IncomingMessage,
  res: Connect.ServerResponse,
  next: Connect.NextFunction
) {
  // Only handle POST to /api/login
  if (req.url !== '/api/login' || req.method !== 'POST') {
    return next();
  }

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
}