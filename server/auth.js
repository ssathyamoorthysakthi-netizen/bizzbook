'use strict';

const crypto = require('node:crypto');

const IS_PROD = process.env.NODE_ENV === 'production';
const SECRET = process.env.JWT_SECRET || 'bizbook-dev-secret-change-in-production';

if (IS_PROD && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be set when NODE_ENV=production. Generate one with: node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"');
}

const TTL_SECONDS = 60 * 60 * 24 * 7;

const b64u = (buf) => Buffer.from(buf).toString('base64url');
const sign = (data) => crypto.createHmac('sha256', SECRET).update(data).digest('base64url');

function createToken(payload) {
  const header = b64u(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64u(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + TTL_SECONDS
  }));
  return `${header}.${body}.${sign(`${header}.${body}`)}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, body, sig] = parts;
  const expected = sign(`${header}.${body}`);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (typeof payload.exp === 'number' && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

function readToken(req) {
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7).trim();
  const cookie = req.headers.cookie || '';
  const m = cookie.match(/(?:^|;\s*)bb_token=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

function setAuthCookie(res, token) {
  const attrs = [
    `bb_token=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${TTL_SECONDS}`
  ];
  if (IS_PROD) attrs.push('Secure');
  res.setHeader('Set-Cookie', attrs.join('; '));
}

function clearAuthCookie(res) {
  res.setHeader('Set-Cookie', `bb_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${IS_PROD ? '; Secure' : ''}`);
}

function attachUser(req, _res, next) {
  const payload = verifyToken(readToken(req));
  if (payload && payload.sub) {
    req.user = { id: payload.sub, role: payload.role, name: payload.name, email: payload.email };
  }
  next();
}

function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  next();
}

module.exports = { createToken, verifyToken, attachUser, setAuthCookie, clearAuthCookie, requireAuth, requireAdmin };
