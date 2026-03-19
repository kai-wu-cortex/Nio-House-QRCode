import type { VercelRequest, VercelResponse } from '@vercel/node';
import { validateCredentials } from './_utils/login';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: '缺少账号或密码' });
  }

  const result = await validateCredentials({ username, password });

  return res.status(200).json(result);
}