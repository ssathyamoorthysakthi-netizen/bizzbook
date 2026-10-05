'use strict';

const express = require('express');
const bcrypt = require('bcryptjs');
const { col } = require('../mongo');
const { createToken, setAuthCookie, clearAuthCookie, requireAuth } = require('../auth');

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function publicUser(u) {
  if (!u) return null;
  return {
    id: String(u._id), name: u.name, email: u.email, phone: u.phone || null,
    role: u.role, company: u.company || null, city: u.city || null,
    isAdmin: !!u.isAdmin, createdAt: u.createdAt
  };
}

function issue(res, user) {
  const token = createToken({ sub: String(user._id), role: user.role, name: user.name, email: user.email });
  setAuthCookie(res, token);
  return token;
}

router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password, phone, company, city, role } = req.body || {};

    if (!name || !String(name).trim()) return res.status(400).json({ error: 'Name is required' });
    if (!email || !EMAIL_RE.test(String(email).trim())) return res.status(400).json({ error: 'A valid email is required' });
    if (!password || String(password).length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

    const cleanEmail = String(email).trim().toLowerCase();
    if (await col('users').findOne({ email: cleanEmail })) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const doc = {
      name: String(name).trim(),
      email: cleanEmail,
      phone: phone ? String(phone).trim() : null,
      passwordHash: bcrypt.hashSync(String(password), 10),
      role: role === 'business' ? 'business' : 'buyer',
      company: company ? String(company).trim() : null,
      city: city ? String(city).trim() : null,
      isAdmin: false,
      createdAt: new Date()
    };

    const r = await col('users').insertOne(doc);
    const user = { ...doc, _id: r.insertedId };
    const token = issue(res, user);
    res.status(201).json({ user: publicUser(user), token });
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const user = await col('users').findOne({ email: String(email).trim().toLowerCase() });
    if (!user || !bcrypt.compareSync(String(password), user.passwordHash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = issue(res, user);
    res.json({ user: publicUser(user), token });
  } catch (e) { next(e); }
});

router.post('/logout', (_req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const { ObjectId } = require('mongodb');
    const user = await col('users').findOne({ _id: new ObjectId(req.user.id) });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user: publicUser(user) });
  } catch (e) { next(e); }
});

router.patch('/me', requireAuth, async (req, res, next) => {
  try {
    const { ObjectId } = require('mongodb');
    const { name, phone, company, city } = req.body || {};
    const update = {};
    if (name) update.name = String(name).trim();
    if (phone) update.phone = String(phone).trim();
    if (company) update.company = String(company).trim();
    if (city) update.city = String(city).trim();

    const user = await col('users').findOneAndUpdate(
      { _id: new ObjectId(req.user.id) },
      { $set: update },
      { returnDocument: 'after' }
    );
    res.json({ user: publicUser(user) });
  } catch (e) { next(e); }
});

router.post('/change-password', requireAuth, async (req, res, next) => {
  try {
    const { ObjectId } = require('mongodb');
    const { currentPassword, newPassword } = req.body || {};
    if (!newPassword || String(newPassword).length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }
    const user = await col('users').findOne({ _id: new ObjectId(req.user.id) });
    if (!user || !bcrypt.compareSync(String(currentPassword || ''), user.passwordHash)) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    await col('users').updateOne(
      { _id: user._id },
      { $set: { passwordHash: bcrypt.hashSync(String(newPassword), 10) } }
    );
    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = router;
