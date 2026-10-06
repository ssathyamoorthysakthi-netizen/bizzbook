'use strict';

const { MongoClient, ObjectId } = require('mongodb');

const URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.MONGO_DB || 'bizbook';

// Validates a 24-char hex id before it reaches Mongo, so a malformed URL
// returns 400 instead of throwing BSONError and surfacing as a 500.
function toObjectId(value) {
  if (value instanceof ObjectId) return value;
  if (typeof value !== 'string' || !/^[0-9a-fA-F]{24}$/.test(value)) return null;
  return new ObjectId(value);
}

let client = null;
let db = null;

async function connect() {
  if (db) return db;
  client = new MongoClient(URI, { serverSelectionTimeoutMS: 5000 });
  await client.connect();
  db = client.db(DB_NAME);
  await ensureIndexes(db);
  return db;
}

async function ensureIndexes(database) {
  const p = (n) => database.collection(n);

  await p('users').createIndexes([
    { key: { email: 1 }, unique: true, name: 'uniq_email' },
    { key: { createdAt: -1 }, name: 'createdAt' }
  ]);

  await p('categories').createIndexes([{ key: { slug: 1 }, unique: true, name: 'uniq_slug' }]);

  await p('businesses').createIndexes([
    { key: { slug: 1 }, unique: true, name: 'uniq_slug' },
    { key: { name: 'text', tagline: 'text', description: 'text', city: 'text', state: 'text' }, name: 'text_search' },
    { key: { city: 1 }, name: 'city' },
    { key: { categorySlug: 1 }, name: 'categorySlug' },
    { key: { verified: -1, rating: -1, reviewCount: -1 }, name: 'rank' },
    { key: { ownerId: 1 }, name: 'ownerId' }
  ]);

  await p('products').createIndexes([
    { key: { slug: 1 }, unique: true, name: 'uniq_slug' },
    { key: { businessId: 1 }, name: 'businessId' },
    { key: { categorySlug: 1 }, name: 'categorySlug' },
    { key: { priceMin: 1 }, name: 'priceMin' },
    { key: { title: 'text', description: 'text' }, name: 'text_search' }
  ]);

  await p('services').createIndexes([
    { key: { slug: 1 }, unique: true, name: 'uniq_slug' },
    { key: { businessId: 1 }, name: 'businessId' },
    { key: { categorySlug: 1 }, name: 'categorySlug' },
    { key: { title: 'text', description: 'text' }, name: 'text_search' }
  ]);

  await p('enquiries').createIndexes([
    { key: { businessId: 1 }, name: 'businessId' },
    { key: { userId: 1 }, name: 'userId' },
    { key: { status: 1, createdAt: -1 }, name: 'status' }
  ]);

  await p('contact_messages').createIndexes([{ key: { createdAt: -1 }, name: 'createdAt' }]);
  await p('saved_searches').createIndexes([{ key: { userId: 1 }, name: 'userId' }]);
}

const col = (name) => db.collection(name);

async function close() {
  if (client) await client.close();
  client = null;
  db = null;
}

module.exports = { connect, close, col, toObjectId, getDb: () => db, DB_NAME, URI };
