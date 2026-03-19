# Notion Authentication System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Notion database-based authentication to the Nio House QRCode application. Users will authenticate against a Notion database with username/password/subscription date validation.

**Architecture:** Server-side proxy pattern - Notion API token stays on the server, never exposed to client. Development uses Vite middleware, production uses Vercel serverless function. Frontend stores authentication state in localStorage for persistent sessions.

**Tech Stack:**
- Backend: TypeScript + @notionhq/client + Express connect middleware
- Frontend: React 19 + TypeScript (existing)
- Build: Vite (existing)

---

## File Structure

New files to create:
- `package.json` - add @notionhq/client dependency
- `src/types.ts` - TypeScript type definitions for auth
- `src/utils/auth.ts` - frontend auth utilities (localStorage)
- `server/login.ts` - core login validation logic using Notion API
- `api/login.ts` - Vercel serverless function entry point
- `vite-middleware.ts` - Vite dev server API middleware
- `.env.example` - add NOTION_TOKEN and NOTION_DATABASE_ID (modify existing)
- `vite.config.ts` - add middleware (modify existing)
- `src/App.tsx` - update login logic (modify existing)

---

### Task 1: Add Notion SDK dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add @notionhq/client to dependencies**

```bash
npm install @notionhq/client
```

- [ ] **Step 2: Verify installation**

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add @notionhq/client for Notion API"
```

---

### Task 2: Update .env.example with new environment variables

**Files:**
- Modify: `.env.example`

Read existing file:

- [ ] **Step 1: Add environment variable placeholders**

Add to existing file:
```
# Notion Authentication
NOTION_TOKEN=your_notion_integration_token_here
NOTION_DATABASE_ID=your_notion_database_id_here
```

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "docs: add Notion env vars to .env.example"
```

---

### Task 3: Create TypeScript type definitions

**Files:**
- Create: `src/types.ts`

- [ ] **Step 1: Write types**

```typescript
// Auth types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  username?: string;
  error?: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  username: string | null;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types.ts
git commit -m "feat: add auth types"
```

---

### Task 4: Create frontend auth utilities for localStorage

**Files:**
- Create: `src/utils/auth.ts`

- [ ] **Step 1: Write localStorage utilities**

```typescript
import { AuthState } from '../types';

const STORAGE_KEY = 'nio_auth_state';

export function getSavedAuthState(): AuthState {
  if (typeof window === 'undefined') {
    return { isLoggedIn: false, username: null };
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { isLoggedIn: false, username: null };
    }
    return JSON.parse(stored) as AuthState;
  } catch (e) {
    return { isLoggedIn: false, username: null };
  }
}

export function saveAuthState(username: string): void {
  const state: AuthState = { isLoggedIn: true, username };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearAuthState(): void {
  localStorage.removeItem(STORAGE_KEY);
}
```

- [ ] **Step 2: Commit**

```bash
mkdir -p src/utils
git add src/utils/auth.ts
git commit -m "feat: add auth localStorage utilities"
```

---

### Task 5: Create core server login validation logic

**Files:**
- Create: `server/login.ts`

- [ ] **Step 1: Write Notion client setup and validation logic**

```typescript
import { Client } from '@notionhq/client';
import { LoginRequest } from '../src/types';

const NOTION_TOKEN = process.env.NOTION_TOKEN || '';
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID || '';

const notion = new Client({ auth: NOTION_TOKEN });

export interface ValidationResult {
  success: boolean;
  error?: string;
  username?: string;
}

/**
 * Validate user credentials against Notion database
 */
export async function validateCredentials(req: LoginRequest): Promise<ValidationResult> {
  const { username, password } = req;

  if (!NOTION_TOKEN || !NOTION_DATABASE_ID) {
    return { success: false, error: '服务器配置错误' };
  }

  try {
    // Query Notion database for matching username
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
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
          .map(t => t.plain_text)
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
```

- [ ] **Step 2: Commit**

```bash
mkdir -p server
git add server/login.ts
git commit -m "feat: add core login validation with Notion API"
```

---

### Task 6: Create Vercel serverless function

**Files:**
- Create: `api/login.ts`

- [ ] **Step 1: Write Vercel serverless function entry**

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { validateCredentials } from '../server/login';

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
```

- [ ] **Step 2: Commit**

```bash
mkdir -p api
git add api/login.ts
git commit -m "feat: add Vercel serverless function for login"
```

---

### Task 7: Create Vite development middleware

**Files:**
- Create: `vite-middleware.ts`

- [ ] **Step 1: Write Vite connect middleware for dev mode**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add vite-middleware.ts
git commit -m "feat: add Vite dev middleware for login"
```

---

### Task 8: Update vite.config.ts to use middleware

**Files:**
- Modify: `vite.config.ts`

- [ ] **Step 1: Add middleware configuration**

Existing content:
```typescript
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
```

Add:
```typescript
import { notionAuthMiddleware } from './vite-middleware';
```

Update inside defineConfig:
```typescript
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'notion-auth-middleware',
        configureServer(server) {
          server.middlewares.use(notionAuthMiddleware);
        },
      },
    ],
    // ... rest stays the same
  };
});
```

- [ ] **Step 2: Commit**

```bash
git add vite.config.ts
git commit -m "feat: add notion auth middleware to vite config"
```

---

### Task 9: Update App.tsx with real authentication

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add imports**

Add to top:
```typescript
import { getSavedAuthState, saveAuthState, clearAuthState } from './utils/auth';
```

- [ ] **Step 2: Update useState initialization**

Change from:
```typescript
const [isLoggedIn, setIsLoggedIn] = useState(false);
```

To:
```typescript
const [isLoggedIn, setIsLoggedIn] = useState(getSavedAuthState().isLoggedIn);
const [loginError, setLoginError] = useState<string | null>(null);
const [usernameInput, setUsernameInput] = useState('');
const [passwordInput, setPasswordInput] = useState('');
```

- [ ] **Step 3: Update handleLogin function**

Replace existing `handleLogin`:

```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoginError(null);

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: usernameInput,
        password: passwordInput,
      }),
    });

    const result = await response.json();

    if (result.success) {
      saveAuthState(result.username);
      setIsLoggedIn(true);
    } else {
      setLoginError(result.error || '登录失败');
    }
  } catch (error) {
    setLoginError('网络错误，请稍后再试');
  }
};
```

- [ ] **Step 4: Update logout handler**

Update the logout onClick:

```typescript
onClick={() => {
  clearAuthState();
  setIsLoggedIn(false);
}}
```

- [ ] **Step 5: Bind inputs to state**

Update username input:
```typescript
value={usernameInput}
onChange={(e) => setUsernameInput(e.target.value)}
```

Update password input:
```typescript
value={passwordInput}
onChange={(e) => setPasswordInput(e.target.value)}
```

- [ ] **Step 6: Add error message display**

Add error display after the form before the closing `</form>` tag:

```typescript
{loginError && (
  <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
    <p className="text-red-600 text-sm text-center">{loginError}</p>
  </div>
)}
```

- [ ] **Step 7: TypeScript check**

Run: `npm run lint`

Fix any type errors.

- [ ] **Step 8: Commit**

```bash
git add src/App.tsx
git commit -m "feat: update App.tsx with real Notion authentication"
```

---

### Task 10: Verify TypeScript compilation

**Files:**
- None to modify

- [ ] **Step 1: Run TypeScript check**

```bash
npm run lint
```

- [ ] **Step 2: Fix any errors found**

- [ ] **Step 3: Commit if changes needed**

- [ ] **Step 4: Verify dev server starts**

```bash
npm run dev
```

Check that the server starts without errors.

---

### Post-Implementation Notes

User needs to:
1. Fill in `NOTION_TOKEN` and `NOTION_DATABASE_ID` in `.env.local`
2. Set the same environment variables in Vercel dashboard for production deployment
3. Verify Notion database property names match exactly: `账户名`, `密码`, `起始订阅日期`, `结束订阅日期`
