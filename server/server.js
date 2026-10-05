'use strict';

const path = require('path');
const fs = require('fs');
const express = require('express');
const { connect, close } = require('./mongo');
const { attachUser } = require('./auth');

const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');
const enquiryRoutes = require('./routes/enquiries');
const adminRoutes = require('./routes/admin');

const PORT = process.env.PORT || 8765;
const HOST = process.env.HOST || '127.0.0.1';
const SERVER_DIR = __dirname;
const WEB_DIST = path.resolve(SERVER_DIR, '../web/dist');
const LEGACY_SITE = path.resolve(SERVER_DIR, '..');

async function createApp() {
  await connect();

  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '256kb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(attachUser);

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'bizbook', db: 'mongodb', time: new Date().toISOString() });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/enquiries', enquiryRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api', listingRoutes);

  app.use('/api', (_req, res) => res.status(404).json({ error: 'API endpoint not found' }));

  if (fs.existsSync(WEB_DIST)) {
    app.use(express.static(WEB_DIST, { index: false }));
    app.get('*', (_req, res) => res.sendFile(path.join(WEB_DIST, 'index.html')));
  } else {
    app.use(express.static(LEGACY_SITE, { extensions: ['html'] }));
    app.use((req, res) => {
      if (req.accepts('html')) return res.status(404).send('React app not built. Run: cd web && npm install && npm run build');
      res.status(404).json({ error: 'Not found' });
    });
  }

  app.use((err, _req, res, _next) => {
    console.error('[error]', err);
    if (err && err.code === 11000) return res.status(409).json({ error: 'That record already exists' });
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

async function start() {
  const app = await createApp();
  const server = app.listen(PORT, HOST, () => {
    console.log(`BizBook API + site  ->  http://${HOST}:${PORT}/`);
    console.log(`Admin login          ->  admin@bizbook.in / demo1234`);
    console.log(fs.existsSync(WEB_DIST) ? `Serving React build from ${WEB_DIST}` : 'React build missing (serving legacy site)');
  });

  for (const sig of ['SIGINT', 'SIGTERM']) {
    process.on(sig, () => server.close(() => close().then(() => process.exit(0))));
  }
  return server;
}

if (require.main === module) {
  start().catch((e) => { console.error('Failed to start:', e.message); process.exit(1); });
}

module.exports = { createApp, start };
