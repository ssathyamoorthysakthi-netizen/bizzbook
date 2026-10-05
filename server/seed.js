'use strict';

const bcrypt = require('bcryptjs');
const { db } = require('./db');

const CATEGORIES = [
  ['manufacturing', 'Manufacturing',      'fa-industry',     'Factories, plants and production partners across India.'],
  ['machinery',    'Machinery & Tools',  'fa-cog',          'Machine tools, CNC, packaging and industrial equipment.'],
  ['electronics',  'Electronics',        'fa-bolt',         'Components, modules, devices and electronics manufacturing.'],
  ['construction', 'Construction',        'fa-hard-hat',     'Builders, contractors, civil works and project suppliers.'],
  ['automotive',   'Automotive',         'fa-car',          'Parts, tyres, lubricants and vehicle-service businesses.'],
  ['textile',      'Textile & Garments', 'fa-shirt',        'Fabrics, apparel, dyeing and textile machinery.'],
  ['food',         'Food & Beverage',    'fa-utensils',     'Ingredients, processing, packaging and F&B suppliers.'],
  ['healthcare',   'Healthcare & Medical','fa-heartbeat',    'Medical devices, pharmaceuticals and diagnostics.']
];

const BUSINESSES = [
  ['shreeji-cnc-works', 'Shreeji CNC Works', 'cnc', 'Ahmedabad', 'Gujarat', 2008, '45-100', '₹10 crore - ₹25 crore', 'ISO 9001:2015, MSME / Udyam Registered', 'UAE, Germany, USA, Singapore (12 countries)', 'Advance, LC, NEFT, UPI', 1, 4.9, 214, 120],
  ['balaji-steels',     'Balaji Steels',     'manufacturing', 'Raipur', 'Chhattisgarh', 2003, '200-500', '₹100 crore - ₹500 crore', 'ISO 14001, BIS', 'Nepal, Bangladesh, UAE', 'Advance, LC, NEFT', 1, 4.7, 431, 45],
  ['sagar-machinery',   'Sagar Machinery',   'machinery', 'Ahmedabad', 'Gujarat', 1996, '100-200', '₹25 crore - ₹100 crore', 'ISO 9001:2015', 'Kenya, Tanzania, UAE', 'LC, NEFT, UPI', 1, 4.6, 288, 90],
  ['nova-electronics',  'Nova Electronics Pvt Ltd', 'electronics', 'Bengaluru', 'Karnataka', 2011, '50-100', '₹10 crore - ₹25 crore', 'ISO 9001:2015, CE', 'USA, Germany, Japan', 'Advance, LC, NEFT', 1, 4.8, 176, 30],
  ['meridian-infra',    'Meridian Infra',    'construction', 'Pune', 'Maharashtra', 2009, '250-500', '₹100 crore - ₹500 crore', 'ISO 9001:2015, PWD Class-A', 'UAE, Saudi Arabia', 'LC, NEFT', 1, 4.5, 322, 180],
  ['sundar-motors',     'Sundar Motors & Tyres','automotive', 'Chennai', 'Tamil Nadu', 1994, '100-200', '₹25 crore - ₹100 crore', 'BIS, ISO 9001', 'Sri Lanka, Nepal', 'Advance, NEFT', 1, 4.4, 512, 75],
  ['looms-of-gujarat',  'Looms of Gujarat',  'textile', 'Surat', 'Gujarat', 1987, '500-1000', '₹100 crore - ₹500 crore', 'OEKO-TEX, ISO 9001', 'EU, USA, UAE', 'LC, Advance', 1, 4.6, 654, 60],
  ['annapurna-foods',   'Annapurna Foods',   'food', 'Nashik', 'Maharashtra', 2005, '100-200', '₹25 crore - ₹100 crore', 'FSSAI, ISO 22000, HACCP', 'UAE, Singapore, UK', 'LC, NEFT, UPI', 1, 4.8, 389, 35],
  ['apollo-medisys',    'Apollo Medisys',    'healthcare', 'Hyderabad', 'Telangana', 2001, '250-500', '₹100 crore - ₹500 crore', 'ISO 13485, CE, USFDA', 'UAE, Kenya, USA', 'LC, NEFT', 1, 4.7, 743, 25],
  ['srishti-alloys',    'Shrishti Alloys',   'manufacturing', 'Coimbatore', 'Tamil Nadu', 1998, '50-100', '₹10 crore - ₹25 crore', 'ISO 9001:2015, IATF', 'Germany, Italy, UAE', 'Advance, LC', 0, 4.2, 97, 240],
  ['vertex-plastics',   'Vertex Plastics',   'manufacturing', 'Delhi', 'Delhi NCR', 2012, '25-50', '₹5 crore - ₹10 crore', 'ISO 9001:2015', 'Nepal, UAE', 'Advance, UPI', 0, 4.0, 58, 300],
  ['kavach-systems',    'Kavach Systems',    'electronics', 'Chennai', 'Tamil Nadu', 2014, '10-25', '₹1 crore - ₹5 crore', 'CE, RoHS', 'Singapore, UAE', 'Advance, UPI', 0, 4.3, 41, 360]
];

const PRODUCTS = [
  ['shreeji-cnc-works', 'CNC Vertical Machining Centre VMC 850',  485000, 485000, 'unit',  1,  'In Stock',   0],
  ['shreeji-cnc-works', 'Precision Turned Shafts (SS 304)',          850,    850, 'piece', 50, 'Made to Order', 1],
  ['shreeji-cnc-works', 'CNC Training Machine',                     240000, 240000, 'unit', 1,  'In Stock',   0],
  ['shreeji-cnc-works', 'Aluminium CNC Job Work',                  null,    null, 'job',  100,'Made to Order', 1],
  ['balaji-steels',     'TMT Reinforcement Bar Fe500D',             52000,  58000, 'tonne', 5, 'In Stock',  0],
  ['balaji-steels',     'Hot Rolled Steel Coil',                   61000,  67000, 'tonne', 2, 'In Stock',  0],
  ['balaji-steels',     'Galvanized Steel Sheet 1mm',              78000,  84000, 'tonne', 3, 'Made to Order', 0],
  ['sagar-machinery',   'Automatic Pouch Packing Machine',        420000, 680000, 'unit', 1, 'In Stock', 0],
  ['sagar-machinery',   'Hydraulic Press 100T',                   285000, 340000, 'unit', 1, 'In Stock', 0],
  ['nova-electronics',  'Custom PCBA Assembly',                    120,    480,   'unit', 100,'Made to Order', 1],
  ['nova-electronics',  'IoT Sensor Module',                       340,    690,   'unit', 50, 'In Stock',  0],
  ['nova-electronics',  'Power Supply 24V 10A',                    1250,   1850,  'unit', 10, 'In Stock',  0],
  ['sundar-motors',     'Commercial Tyre 195/65 R15',              4200,   5600,  'unit', 4,  'In Stock',  0],
  ['looms-of-gujarat',  'Cotton Saree Fabric (per metre)',          180,    420,   'metre', 500,'In Stock', 0],
  ['looms-of-gujarat',  'Denim Fabric 14oz',                       340,    560,   'metre', 300,'In Stock', 0],
  ['annapurna-foods',   'Organic Turmeric Powder (bulk)',           180,    260,   'kg',  100,'In Stock', 0],
  ['annapurna-foods',   'Cold Pressed Groundnut Oil',              280,    390,   'litre',50,'In Stock', 0],
  ['apollo-medisys',    'Digital Blood Pressure Monitor',         1250,   2400,  'unit', 10, 'In Stock', 0],
  ['apollo-medisys',    'Portable Ultrasound Scanner',           48000,  95000, 'unit', 1,  'Made to Order', 0]
];

const SERVICES = [
  ['shreeji-cnc-works', 'CNC Job Work (Turning / Milling)',   150,  600,  'per part', '3-7 days',  1],
  ['shreeji-cnc-works', 'Job Work Prototyping',                800, 2400,  'per part', '1-3 days',  1],
  ['sagar-machinery',   'Machine Installation & Commissioning',15000,45000,'per job', '5-10 days',1],
  ['sagar-machinery',   'Annual Maintenance Contract',        24000,72000, 'per year', '12 months', 0],
  ['nova-electronics',  'PCB Design & Prototyping',           12000,60000, 'per design','5-12 days',0],
  ['nova-electronics',  'IoT Firmware Development',           25000,120000,'per project','10-20 days',0],
  ['meridian-infra',    'Civil Construction Contracting',     null,  null, 'project',  'Project based', 1],
  ['meridian-infra',    'Structural Audit & Site Survey',     18000,45000, 'per site', '3-5 days',  1],
  ['apollo-medisys',    'Preventive Healthcare On-Site',       8500, 30000, 'per session','1 day',    1],
  ['apollo-medisys',    'Calibration & NABL Testing',         3500, 14000, 'per item', '4-6 days',  0],
  ['sundar-motors',     'Fleet Servicing Contract',           4500, 16000, 'per vehicle/month','Ongoing',0],
  ['vertex-plastics',   'Injection Moulding (tooling)',      85000,320000,'per mould', '20-30 days',0]
];

function seed() {
  const existing = db.prepare('SELECT COUNT(*) AS n FROM categories').get().n;
  if (existing > 0) {
    console.log('Database already seeded. Run with --force to reseed.');
    return;
  }

  db.exec('BEGIN');
  try {
    const catId = new Map();
    const insCat = db.prepare('INSERT INTO categories (slug,name,icon,blurb) VALUES (?,?,?,?)');
    for (const c of CATEGORIES) {
      const r = insCat.run(c[0], c[1], c[2], c[3]);
      catId.set(c[0], Number(r.lastInsertRowid));
    }

    const hash = bcrypt.hashSync('demo1234', 10);
    const admin = db.prepare(
      `INSERT INTO users (name,email,phone,password_hash,role,company,city,is_admin)
       VALUES (?,?,?,?,?,?,?,1)`
    ).run('BizBook Admin', 'admin@bizbook.in', '9876500000', hash, 'admin', 'BizBook', 'Mumbai');

    const insBiz = db.prepare(
      `INSERT INTO businesses
       (slug,name,category_id,tagline,description,city,state,address,gstin,year_founded,
        employees,employees_min,employees_max,turnover,certifications,export_markets,payment_terms,
        verified,rating,review_count,response_mins,phone,email,website,views,owner_id)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    );

    const bizId = new Map();
    const bizPhone = ['+91 98250 41120', '+91 98111 30255', '+91 98240 77881', '+91 98450 22119',
                      '+91 98220 66440', '+91 98400 55910', '+91 98250 90873', '+91 98220 11764',
                      '+91 98480 33021', '+91 98110 44590', '+91 98718 20204', '+91 98403 77120'];
    const bizMail = ['enquiry@shreejicnc.in', 'sales@balajisteels.in', 'info@sagarmachinery.in',
                     'hello@novaelectronics.in', 'projects@meridianinfra.in', 'sales@sundarmotors.in',
                     'export@loomsgujarat.in', 'sales@annapurnafoods.in', 'contact@apollomedisys.in',
                     'sales@shrishtialloys.in', 'info@vertexplastics.in', 'hello@kavachsystems.in'];

    BUSINESSES.forEach((b, i) => {
      const r = insBiz.run(
        b[0], b[1], catId.get(b[2]) || null,
        `${b[1]} — verified ${b[2]} supplier in ${b[3]}`,
        `${b[1]} is a verified ${b[2]} business based in ${b[3]}, ${b[4]}. Founded in ${b[5]}, the company ` +
        `serves B2B buyers with consistent quality, competitive pricing and reliable delivery across India and export markets.`,
        b[3], b[4], `${b[3]} Industrial Area`, `24ABC${1000 + i}1Z${5}`, b[5], b[6],
        parseInt(b[6], 10), b[6].includes('-') ? parseInt(b[6].split('-')[1], 10) : parseInt(b[6], 10),
        b[7], b[8], b[9], b[10], b[11], b[12], b[13],
        bizPhone[i], bizMail[i], `https://example.com/${b[0]}`, 120 + i * 37, admin.lastInsertRowid
      );
      bizId.set(b[0], Number(r.lastInsertRowid));
    });

    const insProd = db.prepare(
      `INSERT INTO products (business_id,title,slug,description,price_min,price_max,price_unit,moq,stock,is_custom)
       VALUES (?,?,?,?,?,?,?,?,?,?)`
    );
    for (const p of PRODUCTS) {
      const bId = bizId.get(p[0]);
      const slug = p[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      insProd.run(bId, p[1], slug,
        `${p[1]} supplied by a verified BizBook manufacturer. Available for B2B bulk orders with standard lead times and export-grade quality documentation.`,
        p[2], p[3], p[4], p[5], p[6], p[7]);
    }

    const insServ = db.prepare(
      `INSERT INTO services (business_id,title,slug,description,price_min,price_max,price_unit,duration,on_site)
       VALUES (?,?,?,?,?,?,?,?,?)`
    );
    for (const s of SERVICES) {
      const bId = bizId.get(s[0]);
      const slug = s[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      insServ.run(bId, s[1], slug,
        `${s[1]} offered by a verified BizBook service provider. Projects are executed by a dedicated team with clear scope, timelines and transparent pricing.`,
        s[2], s[3], s[4], s[5], s[6]);
    }

    db.prepare(
      `INSERT INTO contact_messages (name,email,topic,message) VALUES (?,?,?,?)`
    ).run('Anita Rao', 'anita@example.com', 'Sales', 'Please share B2B supplier onboarding details.');

    db.exec('COMMIT');
    console.log(`Seeded ${CATEGORIES.length} categories, ${BUSINESSES.length} businesses, ` +
                `${PRODUCTS.length} products, ${SERVICES.length} services.`);
    console.log('Admin login: admin@bizbook.in / demo1234');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
}

if (process.argv.includes('--force')) {
  for (const t of ['saved_searches', 'contact_messages', 'enquiries', 'services', 'products', 'businesses', 'categories', 'users']) {
    db.exec(`DELETE FROM ${t}`);
  }
  db.exec(`DELETE FROM sqlite_sequence`);
}

seed();
module.exports = { seed };
