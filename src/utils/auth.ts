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
