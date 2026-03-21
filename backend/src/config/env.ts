import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/streaksy',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/auth/google/callback',
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    callbackUrl: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3001/api/auth/github/callback',
  },
  email: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'Streaksy <noreply@streaksy.in>',
  },
  ai: {
    apiKey: process.env.NVIDIA_API_KEY || '',
    model: process.env.AI_MODEL || 'meta/llama-3.3-70b-instruct',
    baseUrl: process.env.AI_BASE_URL || 'https://integrate.api.nvidia.com/v1',
  },
  vapid: {
    publicKey: process.env.VAPID_PUBLIC_KEY || 'BCRxgTLGAASPB6QzyuC1J7i28XrI85XlbuUk9N3iJx4ZXkQTHGlMRKNOjwCBNjdZF-qM9r_27vEotUHivxmRz-0',
    privateKey: process.env.VAPID_PRIVATE_KEY || 'mr-hnqd2YDWGFgPMTNh8ToK0I3qD2A_4a0gv8FcZQbQ',
    subject: process.env.VAPID_SUBJECT || 'mailto:noreply@streaksy.in',
  },
  logLevel: process.env.LOG_LEVEL || 'info',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  // Multiple allowed origins for CORS (comma-separated)
  // Supports web frontend, mobile apps, dev servers
  allowedOrigins: (process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || 'http://localhost:3000')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  // Mobile deep link callback for OAuth
  mobileCallbackUrl: process.env.MOBILE_CALLBACK_URL || '',
} as const;
