'use strict';

const path = require('path');
const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const DB_PATH = process.env.DB_PATH || path.join(DATA_DIR, 'bizbook.db');

const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT    NOT NULL,
  email         TEXT    NOT NULL UNIQUE,
  phone         TEXT,
  password_hash TEXT    NOT NULL,
  role          TEXT    NOT NULL DEFAULT 'buyer',
  company       TEXT,
  city          TEXT,
  is_admin      INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS categories (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  slug     TEXT NOT NULL UNIQUE,
  name     TEXT NOT NULL,
  icon     TEXT,
  blurb    TEXT
);

CREATE TABLE IF NOT EXISTS businesses (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_id     INTEGER REFERENCES users(id) ON DELETE SET NULL,
  slug         TEXT    NOT NULL UNIQUE,
  name         TEXT    NOT NULL,
  category_id  INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  tagline      TEXT,
  description  TEXT,
  city         TEXT    NOT NULL,
  state        TEXT,
  address      TEXT,
  gstin        TEXT,
  year_founded INTEGER,
  employees    TEXT,
  employees_min INTEGER,
  employees_max INTEGER,
  turnover     TEXT,
  certifications TEXT,
  export_markets TEXT,
  payment_terms  TEXT,
  verified     INTEGER NOT NULL DEFAULT 0,
  rating       REAL    NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  response_mins INTEGER,
  logo         TEXT,
  phone        TEXT,
  email        TEXT,
  website      TEXT,
  views        INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  title       TEXT    NOT NULL,
  slug        TEXT    NOT NULL UNIQUE,
  description TEXT,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  price_min   REAL,
  price_max   REAL,
  price_unit  TEXT,
  moq         INTEGER,
  stock       TEXT,
  is_custom   INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS services (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  title       TEXT    NOT NULL,
  slug        TEXT    NOT NULL UNIQUE,
  description TEXT,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  price_min   REAL,
  price_max   REAL,
  price_unit  TEXT,
  duration    TEXT,
  on_site     INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS enquiries (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE,
  user_id     INTEGER REFERENCES users(id) ON DELETE SET NULL,
  name        TEXT    NOT NULL,
  email       TEXT    NOT NULL,
  phone       TEXT,
  subject     TEXT,
  message     TEXT    NOT NULL,
  status      TEXT    NOT NULL DEFAULT 'new',
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  topic      TEXT,
  message    TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS saved_searches (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  query      TEXT    NOT NULL,
  kind       TEXT    NOT NULL DEFAULT 'all',
  city       TEXT,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_biz_city     ON businesses(city);
CREATE INDEX IF NOT EXISTS idx_biz_cat      ON businesses(category_id);
CREATE INDEX IF NOT EXISTS idx_biz_verified ON businesses(verified);
CREATE INDEX IF NOT EXISTS idx_prod_biz     ON products(business_id);
CREATE INDEX IF NOT EXISTS idx_serv_biz     ON services(business_id);
CREATE INDEX IF NOT EXISTS idx_enq_biz      ON enquiries(business_id);
CREATE INDEX IF NOT EXISTS idx_enq_status   ON enquiries(status);
`);

module.exports = { db, DB_PATH, DATA_DIR };
