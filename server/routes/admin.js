'use strict';

const express = require('express');
const { ObjectId } = require('mongodb');
const { col } = require('../mongo');
const { requireAdmin } = require('../auth');

const router = express.Router();

router.use(requireAdmin);

const shapeUser = (u) => ({
  id: String(u._id), name: u.name, email: u.email, phone: u.phone, role: u.role,
  company: u.company || null, city: u.city || null, isAdmin: !!u.isAdmin, createdAt: u.createdAt
});

const shapeEnquiry = (r) => ({
  id: String(r._id), name: r.name, email: r.email, phone: r.phone,
  subject: r.subject, message: r.message, status: r.status, createdAt: r.createdAt,
  business: r.businessId
    ? { id: String(r.businessId), name: r.businessName, slug: r.businessSlug, city: r.city }
    : null,
  user: r.userId && r.userName ? { name: r.userName, email: r.userEmail } : null
});

router.get('/stats', async (_req, res, next) => {
  try {
    const [
      users, businesses, verified, pending, products, services, enquiries, newEnquiries, messages
    ] = await Promise.all([
      col('users').countDocuments(),
      col('businesses').countDocuments(),
      col('businesses').countDocuments({ verified: true }),
      col('businesses').countDocuments({ verified: false }),
      col('products').countDocuments(),
      col('services').countDocuments(),
      col('enquiries').countDocuments(),
      col('enquiries').countDocuments({ status: 'new' }),
      col('contact_messages').countDocuments()
    ]);
    res.json({ users, businesses, verified, pending, products, services, enquiries, newEnquiries, messages });
  } catch (e) { next(e); }
});

router.get('/users', async (req, res, next) => {
  try {
    const search = (req.query.search || '').trim();
    const where = search
      ? { $or: [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] }
      : {};
    const items = await col('users').find(where).sort({ createdAt: -1 }).limit(200).toArray();
    res.json({ items: items.map(shapeUser) });
  } catch (e) { next(e); }
});

router.patch('/users/:id', async (req, res, next) => {
  try {
    const id = new ObjectId(req.params.id);
    const row = await col('users').findOne({ _id: id });
    if (!row) return res.status(404).json({ error: 'User not found' });

    const update = {};
    const b = req.body || {};
    if (typeof b.isAdmin === 'boolean' && String(id) !== req.user.id) update.isAdmin = b.isAdmin;
    if (['buyer', 'business', 'admin'].includes(b.role)) update.role = b.role;

    const fresh = await col('users').findOneAndUpdate({ _id: id }, { $set: update }, { returnDocument: 'after' });
    res.json({ user: shapeUser(fresh) });
  } catch (e) { next(e); }
});

router.delete('/users/:id', async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) return res.status(400).json({ error: 'You cannot delete your own account' });
    const r = await col('users').deleteOne({ _id: new ObjectId(req.params.id) });
    if (r.deletedCount === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

router.get('/businesses', async (_req, res, next) => {
  try {
    const items = await col('businesses').find({}).sort({ verified: 1, createdAt: -1 }).limit(300).toArray();
    res.json({
      items: items.map(b => ({
        id: String(b._id), slug: b.slug, name: b.name, city: b.city, state: b.state,
        category: b.categoryName, verified: !!b.verified, badge: b.badge || null,
        rating: b.rating, views: b.views || 0, ownerId: b.ownerId ? String(b.ownerId) : null,
        createdAt: b.createdAt
      }))
    });
  } catch (e) { next(e); }
});

router.patch('/businesses/:id/verify', async (req, res, next) => {
  try {
    const id = new ObjectId(req.params.id);
    const verified = !!(req.body || {}).verified;
    const patch = { verified, updatedAt: new Date() };
    if (verified) patch.badge = (req.body || {}).badge || 'Verified';
    const r = await col('businesses').updateOne({ _id: id }, { $set: patch });
    if (r.matchedCount === 0) return res.status(404).json({ error: 'Business not found' });
    res.json({ ok: true, verified });
  } catch (e) { next(e); }
});

router.delete('/businesses/:id', async (req, res, next) => {
  try {
    const id = new ObjectId(req.params.id);
    const r = await col('businesses').deleteOne({ _id: id });
    if (r.deletedCount === 0) return res.status(404).json({ error: 'Business not found' });
    await Promise.all([
      col('products').deleteMany({ businessId: id }),
      col('services').deleteMany({ businessId: id })
    ]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

router.get('/enquiries', async (req, res, next) => {
  try {
    const status = (req.query.status || '').trim();
    const where = status ? { status } : {};
    const items = await col('enquiries').find(where).sort({ createdAt: -1 }).limit(300).toArray();
    res.json({ items: items.map(shapeEnquiry) });
  } catch (e) { next(e); }
});

router.get('/messages', async (_req, res, next) => {
  try {
    const items = await col('contact_messages').find({}).sort({ createdAt: -1 }).limit(200).toArray();
    res.json({
      items: items.map(m => ({
        id: String(m._id), name: m.name, email: m.email, topic: m.topic, message: m.message, createdAt: m.createdAt
      }))
    });
  } catch (e) { next(e); }
});

module.exports = router;
