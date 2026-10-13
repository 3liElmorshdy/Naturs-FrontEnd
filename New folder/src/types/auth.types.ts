import type { UserRole } from './User.js';

// ─── User ──────────────────────────────────────────────────────────────────────
// نفس الـ interface الموجودة في User.ts لكن مُعاد تصديرها هنا للـ auth context
export interface AuthUser {
  _id: string;
  id?: string;
  name: string;
  email: string;
  photo?: string;
  role: UserRole;
  isVerified?: boolean;
  createdAt?: string | Date;
  passwordChangedAt?: string | Date;
  refreshToken?: string;
  refreshTokenExpiresAt?: string | Date;
}

// ─── Auth API Response ─────────────────────────────────────────────────────────
// للـ endpoints اللي بترجع token — Login / ResetPassword
export interface AuthResponse {
  status: string;        // 'success' | 'fail' | 'error'
  accessToken: string;   // JWT access token — الـ backend بيبعته بهذا الاسم
  token?: string;        // fallback — بعض الـ endpoints القديمة
  data: {
    user: AuthUser;
  };
}

// ─── Message-only Responses ───────────────────────────────────────────────────
// للـ endpoints اللي بترجع status + message فقط (بدون token)

// Signup: { status, message } — "Please check your email to verify"
export interface SignupResponse {
  status: string;
  message: string;
}

// Forgot Password: { status, message }
export interface ForgotPasswordResponse {
  status: string;
  message: string;
}

// Verify Email: { status, message }
export interface VerifyEmailResponse {
  status: string;
  message: string;  // required — الـ API دايماً بيبعته
}

// ─── API Error Shape ────────────────────────────────────────────────────────────
// الشكل القياسي لأخطاء الـ backend (Error Middleware)
export interface ApiError {
  status: string;       // 'fail' | 'error'
  message: string;
  error?: {
    code?: number;                          // مثال: 11000 (Duplicate key)
    keyValue?: Record<string, string>;      // مثال: { email: 'test@test.com' }
  };
}
