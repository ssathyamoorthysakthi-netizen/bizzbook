'use strict';

const express = require('express');
const { ObjectId } = require('mongodb');
const { col, toObjectId } = require('../mongo');
const { requireAuth } = require('../auth');

const router = express.Router();

const clamp = (n, min, max, dflt) => {
  const v = parseInt(n, 10);
  if (Number.isNaN(v)) return dflt;
  return Math.min(max, Math.max(min, v));
};

const escapeRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const SORTS = {
  relevance: { verified: -1, rating: -1, reviewCount: -1 },
  newest: { createdAt: -1 },
  rating: { rating: -1, reviewCount: -1 },
  reviews: { reviewCount: -1 },
  name: { name: 1 },
  name_desc: { name: -1 }
};

const CAT_SORTS = {
  relevance: { verified: -1, rating: -1, title: 1 },
  newest: { createdAt: -1 },
  price_asc: { priceMin: 1 },
  price_desc: { priceMax: -1 },
  rating: { rating: -1, reviewCount: -1 }
};

function shapeBusiness(b) {
  if (!b) return null;
  return {
    id: String(b._id), slug: b.slug, name: b.name, tagline: b.tagline, description: b.description,
    category: b.categoryName, categorySlug: b.categorySlug, icon: b.icon || null,
    city: b.city, state: b.state, address: b.address, gstin: b.gstin,
    yearFounded: b.yearFounded, employees: b.employees,
    turnover: b.turnover, certifications: b.certifications,
    exportMarkets: b.exportMarkets, paymentTerms: b.paymentTerms,
    verified: !!b.verified, badge: b.badge || null,
    rating: b.rating, reviewCount: b.reviewCount,
    respondsIn: b.responseMins ? `~${b.responseMins} min` : null,
    phone: b.phone, email: b.email, website: b.website, views: b.views,
    gallery: Array.isArray(b.gallery) ? b.gallery : [],
    coverImage: b.gallery && b.gallery[0] ? b.gallery[0] : null,
    businessType: b.businessType || null,
    ownerId: b.ownerId ? String(b.ownerId) : null,
    createdAt: b.createdAt
  };
}

function shapeCatalogue(r) {
  const b = r.business || {
    slug: r.businessSlug, name: r.businessName, city: r.city, state: r.state,
    verified: r.verified, badge: r.badge, rating: r.rating, reviewCount: r.reviewCount,
    responseMins: r.responseMins
  };
  return {
    id: String(r._id), slug: r.slug, title: r.title, description: r.description,
    category: r.categoryName, categorySlug: r.categorySlug,
    priceMin: r.priceMin ?? null, priceMax: r.priceMax ?? null, priceUnit: r.priceUnit || null,
    moq: r.moq ?? null, stock: r.stock ?? null, isCustom: !!r.isCustom,
    duration: r.duration ?? null, onSite: !!r.onSite,
    business: {
      slug: b.slug, name: b.name, city: b.city, state: b.state,
      verified: !!b.verified, badge: b.badge || null,
      rating: b.rating, reviewCount: b.reviewCount,
      respondsIn: b.responseMins ? `~${b.responseMins} min` : null
    }
  };
}

function buildQuery(q, opts = {}) {
  const where = [];

  const search = (q.search || q.q || '').trim();
  if (search) {
    const rx = new RegExp(escapeRe(search), 'i');
    if (opts.catalogue) where.push({ $or: [{ title: rx }, { description: rx }, { businessName: rx }, { city: rx }] });
    else where.push({ $or: [{ name: rx }, { tagline: rx }, { description: rx }, { city: rx }, { state: rx }, { categoryName: rx }] });
  }

  if (q.category && q.category !== 'all') where.push({ categorySlug: String(q.category) });
  if (q.city && q.city !== 'All India') where.push({ city: String(q.city) });
  if (q.state) where.push({ state: String(q.state) });
  if (q.verified === '1' || q.verified === 'true') where.push({ verified: true });
  if (q.badge) where.push({ badge: String(q.badge) });
  if (q.businessType) where.push({ businessType: String(q.businessType) });
  if (q.rating) where.push({ rating: { $gte: Number(q.rating) } });
  if (q.owner) where.push({ ownerId: new ObjectId(String(q.owner)) });

  if (opts.catalogue) {
    if (q.business) where.push({ businessSlug: String(q.business) });
    if (q.minPrice) where.push({ $expr: { $gte: [{ $ifNull: ['$priceMax', '$priceMin'] }, Number(q.minPrice)] } });
    if (q.maxPrice) where.push({ $expr: { $lte: [{ $ifNull: ['$priceMin', '$priceMax'] }, Number(q.maxPrice)] } });
    if (q.inStock === '1' || q.inStock === 'true') where.push({ stock: 'In Stock' });
    if (q.onSite === '1' || q.onSite === 'true') where.push({ onSite: true });
  }

  return where.length ? { $and: where } : {};
}

router.get('/categories', async (_req, res, next) => {
  try {
    const items = await col('categories').aggregate([
      { $lookup: { from: 'businesses', localField: 'slug', foreignField: 'categorySlug', as: 'biz' } },
      { $project: { name: 1, slug: 1, icon: 1, blurb: 1, businessCount: { $size: '$biz' } } },
      { $sort: { name: 1 } }
    ]).toArray();
    res.json({ items: items.map(c => ({ id: String(c._id), slug: c.slug, name: c.name, icon: c.icon, blurb: c.blurb, businessCount: c.businessCount })) });
  } catch (e) { next(e); }
});

router.get('/stats', async (_req, res, next) => {
  try {
    const [businesses, products, services, users, verified, cities, enquiries] = await Promise.all([
      col('businesses').countDocuments(),
      col('products').countDocuments(),
      col('services').countDocuments(),
      col('users').countDocuments(),
      col('businesses').countDocuments({ verified: true }),
      col('businesses').distinct('city'),
      col('enquiries').countDocuments()
    ]);
    res.json({ businesses, products, services, users, verified, cities: cities.length, enquiries });
  } catch (e) { next(e); }
});

router.get('/cities', async (_req, res, next) => {
  try {
    const items = await col('businesses').aggregate([
      { $group: { _id: { city: '$city', state: '$state' }, n: { $sum: 1 } } },
      { $sort: { n: -1, '_id.city': 1 } },
      { $limit: 60 }
    ]).toArray();
    res.json({
      items: items
        .filter(i => i._id.city)
        .map(i => ({
          city: i._id.city, state: i._id.state || null, count: i.n,
          label: i._id.state ? `${i._id.city}, ${i._id.state}` : i._id.city
        }))
    });
  } catch (e) { next(e); }
});

async function paginate(collection, q, { catalogue = false } = {}) {
  const where = buildQuery(q, { catalogue });
  const sorts = catalogue ? CAT_SORTS : SORTS;
  const sort = sorts[q.sort] || sorts.relevance;
  const limit = clamp(q.limit, 1, 60, 12);
  const page = clamp(q.page, 1, 10000, 1);

  const [total, items] = await Promise.all([
    collection.countDocuments(where),
    collection.find(where).sort(sort).skip((page - 1) * limit).limit(limit).toArray()
  ]);

  return {
    total, page, limit, pages: Math.max(1, Math.ceil(total / limit)),
    items: items.map(catalogue ? shapeCatalogue : shapeBusiness)
  };
}

router.get('/businesses', async (req, res, next) => {
  try { res.json(await paginate(col('businesses'), req.query)); } catch (e) { next(e); }
});

router.get('/businesses/mine/listings', requireAuth, async (req, res, next) => {
  try {
    const items = await col('businesses').find({ ownerId: new ObjectId(req.user.id) })
      .sort({ createdAt: -1 }).limit(100).toArray();
    res.json({ items: items.map(shapeBusiness) });
  } catch (e) { next(e); }
});

router.post('/businesses', requireAuth, async (req, res, next) => {
  try {
    const b = req.body || {};
    const missing = ['name', 'city', 'category'].filter((k) => !b[k] || !String(b[k]).trim());
    if (missing.length) return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });

    const cat = await col('categories').findOne({
      $or: [{ slug: String(b.category) }, ...(Number.isFinite(Number(b.category)) ? [{ _id: new ObjectId(String(b.category)) }] : [])]
    });
    if (!cat) return res.status(400).json({ error: 'Unknown category' });

    const base = String(b.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'business';
    let slug = base;
    let n = 1;
    while (await col('businesses').findOne({ slug })) slug = `${base}-${++n}`;

    const doc = {
      ownerId: new ObjectId(req.user.id),
      slug, name: String(b.name).trim(),
      categorySlug: cat.slug, categoryName: cat.name, icon: cat.icon,
      tagline: b.tagline ? String(b.tagline).trim() : null,
      description: b.description ? String(b.description).trim() : null,
      city: String(b.city).trim(), state: b.state ? String(b.state).trim() : null,
      address: b.address ? String(b.address).trim() : null,
      gstin: b.gstin ? String(b.gstin).trim() : null,
      yearFounded: b.yearFounded ? Number(b.yearFounded) : null,
      employees: b.employees ? String(b.employees).trim() : null,
      employeesMin: b.employeesMin ? Number(b.employeesMin) : null,
      employeesMax: b.employeesMax ? Number(b.employeesMax) : null,
      turnover: b.turnover ? String(b.turnover).trim() : null,
      certifications: b.certifications ? String(b.certifications).trim() : null,
      exportMarkets: b.exportMarkets ? String(b.exportMarkets).trim() : null,
      paymentTerms: b.paymentTerms ? String(b.paymentTerms).trim() : null,
      businessType: b.businessType ? String(b.businessType).trim() : null,
      phone: b.phone ? String(b.phone).trim() : null,
      email: b.email ? String(b.email).trim() : null,
      website: b.website ? String(b.website).trim() : null,
      verified: false, badge: null, rating: 0, reviewCount: 0, responseMins: null,
      views: 0, createdAt: new Date(), updatedAt: new Date()
    };

    const r = await col('businesses').insertOne(doc);
    res.status(201).json({ business: shapeBusiness({ ...doc, _id: r.insertedId }) });
  } catch (e) { next(e); }
});

router.get('/businesses/:slug', async (req, res, next) => {
  try {
    const biz = await col('businesses').findOne({ slug: req.params.slug });
    if (!biz) return res.status(404).json({ error: 'Business not found' });

    await col('businesses').updateOne({ _id: biz._id }, { $inc: { views: 1 } });

    const bizId = biz._id;
    const [products, services, related] = await Promise.all([
      col('products').find({ businessId: bizId }).sort({ createdAt: -1 }).limit(100).toArray(),
      col('services').find({ businessId: bizId }).sort({ createdAt: -1 }).limit(100).toArray(),
      col('businesses').find({ categorySlug: biz.categorySlug, _id: { $ne: bizId } })
        .sort({ rating: -1 }).limit(4).toArray()
    ]);

    const attach = (rows) => rows.map(r => shapeCatalogue({ ...r, business: biz }));

    res.json({
      business: shapeBusiness({ ...biz, views: (biz.views || 0) + 1 }),
      products: attach(products),
      services: attach(services),
      related: related.map(shapeBusiness)
    });
  } catch (e) { next(e); }
});

router.put('/businesses/:slug', requireAuth, async (req, res, next) => {
  try {
    const biz = await col('businesses').findOne({ slug: req.params.slug });
    if (!biz) return res.status(404).json({ error: 'Business not found' });
    if (String(biz.ownerId) !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'You can only edit your own listing' });
    }

    const b = req.body || {};
    const allowed = ['name', 'tagline', 'description', 'city', 'state', 'address', 'gstin',
      'phone', 'email', 'website', 'businessType', 'turnover', 'certifications'];
    const update = { updatedAt: new Date() };
    for (const k of allowed) if (b[k] !== undefined && b[k] !== '') update[k] = String(b[k]).trim();

    const fresh = await col('businesses').findOneAndUpdate(
      { _id: biz._id }, { $set: update }, { returnDocument: 'after' }
    );
    res.json({ business: shapeBusiness(fresh) });
  } catch (e) { next(e); }
});

router.delete('/businesses/:slug', requireAuth, async (req, res, next) => {
  try {
    const biz = await col('businesses').findOne({ slug: req.params.slug });
    if (!biz) return res.status(404).json({ error: 'Business not found' });
    if (String(biz.ownerId) !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'You can only remove your own listing' });
    }
    await Promise.all([
      col('businesses').deleteOne({ _id: biz._id }),
      col('products').deleteMany({ businessId: biz._id }),
      col('services').deleteMany({ businessId: biz._id })
    ]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

const catalogueRouter = (table) => async (req, res, next) => {
  try { res.json(await paginate(col(table), req.query, { catalogue: true })); } catch (e) { next(e); }
};

router.get('/products', catalogueRouter('products'));
router.get('/services', catalogueRouter('services'));

router.get('/products/:slug', async (req, res, next) => {
  try {
    const item = await col('products').findOne({ slug: req.params.slug });
    if (!item) return res.status(404).json({ error: 'Product not found' });
    const biz = await col('businesses').findOne({ _id: item.businessId });
    res.json({ product: shapeCatalogue({ ...item, business: biz }) });
  } catch (e) { next(e); }
});

router.get('/services/:slug', async (req, res, next) => {
  try {
    const item = await col('services').findOne({ slug: req.params.slug });
    if (!item) return res.status(404).json({ error: 'Service not found' });
    const biz = await col('businesses').findOne({ _id: item.businessId });
    res.json({ service: shapeCatalogue({ ...item, business: biz }) });
  } catch (e) { next(e); }
});

router.get('/saved-searches', requireAuth, async (req, res, next) => {
  try {
    const items = await col('saved_searches').find({ userId: new ObjectId(req.user.id) })
      .sort({ createdAt: -1 }).limit(100).toArray();
    res.json({ items: items.map(s => ({ id: String(s._id), query: s.query, kind: s.kind, city: s.city, createdAt: s.createdAt })) });
  } catch (e) { next(e); }
});

router.post('/saved-searches', requireAuth, async (req, res, next) => {
  try {
    const { query, kind, city } = req.body || {};
    if (!query || !String(query).trim()) return res.status(400).json({ error: 'Search query is required' });
    const r = await col('saved_searches').insertOne({
      userId: new ObjectId(req.user.id), query: String(query).trim(),
      kind: kind || 'all', city: city || 'All India', createdAt: new Date()
    });
    res.status(201).json({ id: String(r.insertedId) });
  } catch (e) { next(e); }
});

router.delete('/saved-searches/:id', requireAuth, async (req, res, next) => {
  try {
    const id = toObjectId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    await col('saved_searches').deleteOne({ _id: id, userId: new ObjectId(req.user.id) });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = router;
