"use client";

/**
 * Session Manager Utility
 * Handles "Remember Me" functionality and session validation
 */

const REMEMBER_ME_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
const DEFAULT_SESSION_DURATION = 24 * 60 * 60 * 1000; // 1 day in milliseconds

export interface SessionInfo {
  isRemembered: boolean;
  loginTime: number | null;
  isExpired: boolean;
}

/**
 * Check if the current session should be considered valid based on "Remember Me" preference
 */
export function getSessionInfo(): SessionInfo {
  if (typeof window === 'undefined') {
    return { isRemembered: false, loginTime: null, isExpired: false };
  }

  const rememberMe = localStorage.getItem('rememberMe') === 'true';
  const loginTimeStr = localStorage.getItem('loginTime');
  const loginTime = loginTimeStr ? parseInt(loginTimeStr, 10) : null;

  if (!loginTime) {
    return { isRemembered: rememberMe, loginTime: null, isExpired: false };
  }

  const currentTime = Date.now();
  const sessionDuration = rememberMe ? REMEMBER_ME_DURATION : DEFAULT_SESSION_DURATION;
  const isExpired = (currentTime - loginTime) > sessionDuration;

  return {
    isRemembered: rememberMe,
    loginTime,
    isExpired
  };
}

/**
 * Check if user should be redirected to login based on session expiry
 */
export function shouldRedirectToLogin(): boolean {
  const sessionInfo = getSessionInfo();
  
  // If user didn't opt for "Remember Me" and session is older than 1 day, redirect
  if (!sessionInfo.isRemembered && sessionInfo.loginTime) {
    const daysSinceLogin = (Date.now() - sessionInfo.loginTime) / (24 * 60 * 60 * 1000);
    if (daysSinceLogin > 1) {
      return true;
    }
  }
  
  // If user opted for "Remember Me" but session is older than 30 days, redirect
  if (sessionInfo.isRemembered && sessionInfo.loginTime) {
    const daysSinceLogin = (Date.now() - sessionInfo.loginTime) / (24 * 60 * 60 * 1000);
    if (daysSinceLogin > 30) {
      return true;
    }
  }
  
  return false;
}

/**
 * Clear session data on logout
 */
export function clearSessionData(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('loginTime');
  }
}

/**
 * Update login time (called on successful login)
 */
export function updateLoginTime(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('loginTime', Date.now().toString());
  }
}

/**
 * Set remember me preference
 */
export function setRememberMe(remember: boolean): void {
  if (typeof window !== 'undefined') {
    if (remember) {
      localStorage.setItem('rememberMe', 'true');
      localStorage.setItem('loginTime', Date.now().toString());
    } else {
      localStorage.setItem('rememberMe', 'false');
      localStorage.setItem('loginTime', Date.now().toString());
    }
  }
}

/**
 * Get days remaining in session
 */
export function getDaysRemainingInSession(): number | null {
  const sessionInfo = getSessionInfo();
  
  if (!sessionInfo.loginTime) {
    return null;
  }
  
  const maxDays = sessionInfo.isRemembered ? 30 : 1;
  const daysSinceLogin = (Date.now() - sessionInfo.loginTime) / (24 * 60 * 60 * 1000);
  const daysRemaining = Math.max(0, maxDays - daysSinceLogin);
  
  return Math.ceil(daysRemaining);
}
