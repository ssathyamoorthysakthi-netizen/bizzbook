'use strict';

const express = require('express');
const { ObjectId } = require('mongodb');
const { col, toObjectId } = require('../mongo');
const { requireAuth } = require('../auth');

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\d][\d\s\-()]{6,19}$/;

const shape = (r) => ({
  id: String(r._id), name: r.name, email: r.email, phone: r.phone,
  subject: r.subject, message: r.message, status: r.status, createdAt: r.createdAt,
  business: r.businessId
    ? { id: String(r.businessId), name: r.businessName, slug: r.businessSlug, city: r.city }
    : null,
  user: r.userId && r.userName ? { name: r.userName, email: r.userEmail } : null
});

router.post('/', async (req, res, next) => {
  try {
    const { businessSlug, name, email, phone, subject, message } = req.body || {};

    if (!name || !String(name).trim()) return res.status(400).json({ error: 'Your name is required' });
    if (!email || !EMAIL_RE.test(String(email).trim())) return res.status(400).json({ error: 'A valid email is required' });
    if (phone && !PHONE_RE.test(String(phone).trim())) return res.status(400).json({ error: 'Enter a valid phone number' });
    if (!message || String(message).trim().length < 10) {
      return res.status(400).json({ error: 'Please describe your requirement in at least 10 characters' });
    }

    let biz = null;
    if (businessSlug) {
      biz = await col('businesses').findOne({ slug: String(businessSlug) });
      if (!biz) return res.status(404).json({ error: 'That business listing was not found' });
    }

    const doc = {
      businessId: biz ? biz._id : null,
      businessSlug: biz ? biz.slug : null,
      businessName: biz ? biz.name : null,
      city: biz ? biz.city : null,
      userId: req.user ? new ObjectId(req.user.id) : null,
      userName: req.user ? req.user.name : null,
      userEmail: req.user ? req.user.email : null,
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: phone ? String(phone).trim() : null,
      subject: subject ? String(subject).trim() : null,
      message: String(message).trim(),
      status: 'new',
      createdAt: new Date()
    };

    const r = await col('enquiries').insertOne(doc);
    res.status(201).json({ enquiry: shape({ ...doc, _id: r.insertedId }) });
  } catch (e) { next(e); }
});

router.get('/received', requireAuth, async (req, res, next) => {
  try {
    const mine = await col('businesses').find({ ownerId: new ObjectId(req.user.id) }).project({ _id: 1 }).toArray();
    const items = await col('enquiries').find({ businessId: { $in: mine.map(b => b._id) } })
      .sort({ createdAt: -1 }).limit(200).toArray();
    res.json({ items: items.map(shape) });
  } catch (e) { next(e); }
});

router.get('/sent', requireAuth, async (req, res, next) => {
  try {
    const items = await col('enquiries').find({ userId: new ObjectId(req.user.id) })
      .sort({ createdAt: -1 }).limit(200).toArray();
    res.json({ items: items.map(shape) });
  } catch (e) { next(e); }
});

router.patch('/:id/status', requireAuth, async (req, res, next) => {
  try {
    const id = toObjectId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    const row = await col('enquiries').findOne({ _id: id });
    if (!row) return res.status(404).json({ error: 'Enquiry not found' });

    if (req.user.role !== 'admin') {
      const owns = await col('businesses').findOne({ _id: row.businessId });
      if (!owns || String(owns.ownerId) !== req.user.id) {
        return res.status(403).json({ error: 'Not permitted' });
      }
    }

    const allowed = ['new', 'contacted', 'quoted', 'closed'];
    const status = String((req.body || {}).status || '');
    if (!allowed.includes(status)) return res.status(400).json({ error: `Status must be one of: ${allowed.join(', ')}` });

    await col('enquiries').updateOne({ _id: row._id }, { $set: { status } });
    res.json({ enquiry: shape({ ...row, status }) });
  } catch (e) { next(e); }
});

router.post('/contact', async (req, res, next) => {
  try {
    const { name, email, topic, message } = req.body || {};
    if (!name || !String(name).trim()) return res.status(400).json({ error: 'Your name is required' });
    if (!email || !EMAIL_RE.test(String(email).trim())) return res.status(400).json({ error: 'A valid email is required' });
    if (!message || String(message).trim().length < 10) {
      return res.status(400).json({ error: 'Please enter a message of at least 10 characters' });
    }

    const r = await col('contact_messages').insertOne({
      name: String(name).trim(), email: String(email).trim().toLowerCase(),
      topic: topic ? String(topic).trim() : null, message: String(message).trim(),
      createdAt: new Date()
    });
    res.status(201).json({ id: String(r.insertedId), ok: true });
  } catch (e) { next(e); }
});

module.exports = router;
