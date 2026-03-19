import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from '@notionhq/client';

// Auth types
interface LoginRequest {
  username: string;
  password: string;
}

interface ValidationResult {
  success: boolean;
  error?: string;
  username?: string;
}

const NOTION_TOKEN = process.env.NOTION_TOKEN || '';
const NOTION_DATA_SOURCE_ID = process.env.NOTION_DATABASE_ID || '';

const notion = new Client({ auth: NOTION_TOKEN });

/**
 * Validate user credentials against Notion database (data source)
 */
export async function validateCredentials(req: LoginRequest): Promise<ValidationResult> {
  const { username, password } = req;

  if (!NOTION_TOKEN || !NOTION_DATA_SOURCE_ID) {
    return { success: false, error: '服务器配置错误' };
  }

  try {
    // For a data source (database), we query directly
    const response = await (notion.databases as any).queryDatabase({
      database_id: NOTION_DATA_SOURCE_ID,
      filter: {
        property: '账户名',
        title: {
          equals: username.trim(),
        },
      },
    });

    if (response.results.length === 0) {
      return { success: false, error: '账号不存在' };
    }

    const page = response.results[0];

    // Extract password from page properties
    let storedPassword = '';
    if ('密码' in page.properties) {
      const passwordProp = page.properties.密码;
      if (passwordProp.type === 'rich_text') {
        storedPassword = passwordProp.rich_text
          .map((t: any) => t.plain_text)
          .join('')
          .trim();
      }
    }

    if (storedPassword !== password.trim()) {
      return { success: false, error: '密码错误' };
    }

    // Extract and validate subscription dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let startDate: Date | null = null;
    let endDate: Date | null = null;

    if ('起始订阅日期' in page.properties) {
      const startProp = page.properties['起始订阅日期'];
      if (startProp.type === 'date' && startProp.date?.start) {
        startDate = new Date(startProp.date.start);
      }
    }

    if ('结束订阅日期' in page.properties) {
      const endProp = page.properties['结束订阅日期'];
      if (endProp.type === 'date' && endProp.date?.start) {
        endDate = new Date(endProp.date.start);
      }
    }

    if (startDate && today < startDate) {
      return { success: false, error: '订阅尚未生效' };
    }

    if (endDate && today > endDate) {
      return { success: false, error: '订阅已过期' };
    }

    // All checks passed
    return { success: true, username };

  } catch (error) {
    console.error('Notion API error:', error);
    return { success: false, error: '服务器错误，请稍后再试' };
  }
}

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
