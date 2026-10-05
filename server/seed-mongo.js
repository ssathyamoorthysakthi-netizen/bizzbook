'use strict';

const bcrypt = require('bcryptjs');
const { connect, col, close } = require('./mongo');

const CATEGORIES = [
  ['manufacturing', 'Manufacturing', 'Factory', 'Manufacturers, plants and production partners across India.'],
  ['machinery', 'Machinery & Equipment', 'Cog', 'Machine tools, CNC, packaging and industrial equipment.'],
  ['electronics', 'Electronics & Electrical', 'Cpu', 'Components, modules, devices and electrical assemblies.'],
  ['construction', 'Construction & Building', 'HardHat', 'Builders, contractors, civil works and project material suppliers.'],
  ['automotive', 'Automotive', 'Car', 'Parts, tyres, lubricants and vehicle-service businesses.'],
  ['textile', 'Textile & Garments', 'Shirt', 'Fabrics, apparel, dyeing and textile machinery.'],
  ['food', 'Food & Beverages', 'UtensilsCrossed', 'Ingredients, processing, packaging and F&B suppliers.'],
  ['chemical', 'Chemical & Plastic', 'FlaskConical', 'Chemicals, polymers, resins and plastic manufacturers.'],
  ['agriculture', 'Agriculture & Farming', 'Sprout', 'Agro machinery, seeds, fertilisers and farm equipment.'],
  ['healthcare', 'Healthcare & Pharma', 'HeartPulse', 'Medical devices, pharmaceuticals and diagnostics.'],
  ['it', 'IT & Solutions', 'MonitorSmartphone', 'Software, IT infrastructure and technology services.'],
  ['professional', 'Professional Services', 'Briefcase', 'Consulting, legal, accounting and advisory firms.'],
  ['retail', 'Retail & FMCG', 'ShoppingCart', 'Retailers, distributors and consumer goods brands.'],
  ['logistics', 'Logistics & Transport', 'Truck', 'Freight, warehousing, last-mile and supply chain firms.'],
  ['education', 'Education & Training', 'GraduationCap', 'Institutions, coaching and skill-training providers.'],
  ['hospitality', 'Hospitality & Tourism', 'Hotel', 'Hotels, travel agents, restaurants and event firms.']
];

const BUSINESSES = [
  ['shreeji-cnc-works', 'Shreeji CNC Works', 'machinery', 'Ahmedabad', 'Gujarat', 2008, '45-100', '₹10 crore - ₹25 crore', 'ISO 9001:2015, MSME / Udyam Registered', 'UAE, Germany, USA, Singapore (12 countries)', 'Advance, LC, NEFT, UPI', 1, 4.9, 214, 120, 'Top Supplier'],
  ['balaji-steels', 'Balaji Steels', 'manufacturing', 'Raipur', 'Chhattisgarh', 2003, '200-500', '₹100 crore - ₹500 crore', 'ISO 14001, BIS', 'Nepal, Bangladesh, UAE', 'Advance, LC, NEFT', 1, 4.7, 431, 45, 'Top Rated'],
  ['sagar-machinery', 'Sagar Machinery', 'machinery', 'Ahmedabad', 'Gujarat', 1996, '100-200', '₹25 crore - ₹100 crore', 'ISO 9001:2015', 'Kenya, Tanzania, UAE', 'LC, NEFT, UPI', 1, 4.6, 288, 90, 'Top Supplier'],
  ['nova-electronics', 'Nova Electronics Pvt Ltd', 'electronics', 'Bengaluru', 'Karnataka', 2011, '50-100', '₹10 crore - ₹25 crore', 'ISO 9001:2015, CE', 'USA, Germany, Japan', 'Advance, LC, NEFT', 1, 4.8, 176, 30, 'Premium'],
  ['meridian-infra', 'Meridian Infra', 'construction', 'Pune', 'Maharashtra', 2009, '250-500', '₹100 crore - ₹500 crore', 'ISO 9001:2015, PWD Class-A', 'UAE, Saudi Arabia', 'LC, NEFT', 1, 4.5, 322, 180, 'Top Rated'],
  ['sundar-motors', 'Sundar Motors & Tyres', 'automotive', 'Chennai', 'Tamil Nadu', 1994, '100-200', '₹25 crore - ₹100 crore', 'BIS, ISO 9001', 'Sri Lanka, Nepal', 'Advance, NEFT', 1, 4.4, 512, 75, 'Premium'],
  ['looms-of-gujarat', 'Looms of Gujarat', 'textile', 'Surat', 'Gujarat', 1987, '500-1000', '₹100 crore - ₹500 crore', 'OEKO-TEX, ISO 9001', 'EU, USA, UAE', 'LC, Advance', 1, 4.6, 654, 60, 'Top Supplier'],
  ['annapurna-foods', 'Annapurna Foods', 'food', 'Nashik', 'Maharashtra', 2005, '100-200', '₹25 crore - ₹100 crore', 'FSSAI, ISO 22000, HACCP', 'UAE, Singapore, UK', 'LC, NEFT, UPI', 1, 4.8, 389, 35, 'Top Supplier'],
  ['apollo-medisys', 'Apollo Medisys', 'healthcare', 'Hyderabad', 'Telangana', 2001, '250-500', '₹100 crore - ₹500 crore', 'ISO 13485, CE, USFDA', 'UAE, Kenya, USA', 'LC, NEFT', 1, 4.7, 743, 25, 'Trusted'],
  ['sri-venkatesh-machinery', 'Sri Venkatesh Machinery', 'machinery', 'Coimbatore', 'Tamil Nadu', 1992, '100-200', '₹25 crore - ₹100 crore', 'ISO 9001:2015, ISI', 'Sri Lanka, UAE, Kenya', 'LC, Advance, NEFT', 1, 5.0, 386, 40, 'Top Supplier'],
  ['sun-tech-solutions', 'Sun Tech Solutions', 'electronics', 'Chennai', 'Tamil Nadu', 2010, '50-100', '₹10 crore - ₹25 crore', 'ISO 9001:2015, CE, RoHS', 'UAE, Singapore, USA', 'Advance, LC, UPI', 1, 4.9, 268, 55, 'Premium'],
  ['build-right-construction', 'Build Right Construction', 'construction', 'Bengaluru', 'Karnataka', 2006, '250-500', '₹100 crore - ₹500 crore', 'ISO 9001:2015, PWD Class-1A', 'UAE, Oman, Kenya', 'LC, NEFT', 1, 4.8, 441, 70, 'Top Rated'],
  ['medical-care-pharma', 'Medical Care Pharma', 'healthcare', 'Hyderabad', 'Telangana', 1999, '200-500', '₹100 crore - ₹500 crore', 'ISO 13485, WHO-GMP, USFDA', 'UAE, Kenya, Tanzania', 'LC, NEFT', 1, 4.9, 597, 35, 'Trusted'],
  ['fresh-bite-foods', 'Fresh Bite Foods', 'food', 'Madurai', 'Tamil Nadu', 2013, '50-100', '₹10 crore - ₹25 crore', 'FSSAI, ISO 22000, HACCP', 'UAE, Singapore, UK', 'Advance, UPI', 1, 4.8, 324, 40, 'Top Supplier'],
  ['style-tex-garments', 'Style Tex Garments', 'textile', 'Tiruppur', 'Tamil Nadu', 2001, '200-500', '₹100 crore - ₹500 crore', 'OEKO-TEX, BSCI, ISO 9001', 'USA, EU, UAE', 'LC, Advance', 1, 4.9, 472, 50, 'Premium'],
  ['srishti-alloys', 'Shrishti Alloys', 'manufacturing', 'Coimbatore', 'Tamil Nadu', 1998, '50-100', '₹10 crore - ₹25 crore', 'ISO 9001:2015, IATF', 'Germany, Italy, UAE', 'Advance, LC', 0, 4.2, 97, 240, ''],
  ['vertex-plastics', 'Vertex Plastics', 'chemical', 'Delhi', 'Delhi NCR', 2012, '25-50', '₹5 crore - ₹10 crore', 'ISO 9001:2015', 'Nepal, UAE', 'Advance, UPI', 0, 4.0, 58, 300, ''],
  ['kavach-systems', 'Kavach Systems', 'electronics', 'Chennai', 'Tamil Nadu', 2014, '10-25', '₹1 crore - ₹5 crore', 'CE, RoHS, ISO 9001', 'Singapore, UAE', 'Advance, UPI', 0, 4.3, 41, 360, '']
];

const PRODUCTS = [
  ['shreeji-cnc-works', 'CNC Vertical Machining Centre VMC 850', 'machinery', 485000, 485000, 'unit', 1, 'In Stock', 0],
  ['sri-venkatesh-machinery', 'CNC Vertical Machining Centre VMC 850', 'machinery', 465000, 520000, 'unit', 1, 'In Stock', 0],
  ['sri-venkatesh-machinery', 'Solar Panel 550W Mono PERC', 'electronics', 4200, 4800, 'unit', 10, 'In Stock', 0],
  ['shreeji-cnc-works', 'Precision Turned Shafts (SS 304)', 'machinery', 850, 850, 'piece', 50, 'Made to Order', 1],
  ['style-tex-garments', 'Automatic Quilting Machine', 'textile', 385000, 545000, 'unit', 1, 'In Stock', 0],
  ['sagar-machinery', 'Automatic Pouch Packing Machine', 'machinery', 420000, 680000, 'unit', 1, 'In Stock', 0],
  ['medical-care-pharma', 'Hospital Equipment - Multi-Para Monitor', 'healthcare', 18500, 42000, 'unit', 2, 'In Stock', 0],
  ['build-right-construction', 'Ready-Mix Concrete M25', 'construction', 4200, 4600, 'm3', 5, 'In Stock', 0],
  ['sundar-motors', 'Commercial Tyre 195/65 R15', 'automotive', 4200, 5600, 'unit', 4, 'In Stock', 0],
  ['nova-electronics', 'Custom PCBA Assembly', 'electronics', 120, 480, 'unit', 100, 'Made to Order', 1],
  ['balaji-steels', 'TMT Reinforcement Bar Fe500D', 'manufacturing', 52000, 58000, 'tonne', 5, 'In Stock', 0],
  ['kavach-systems', 'IoT Sensor Module', 'electronics', 340, 690, 'unit', 50, 'In Stock', 0],
  ['fresh-bite-foods', 'Cold Pressed Groundnut Oil', 'food', 280, 390, 'litre', 50, 'In Stock', 0],
  ['apollo-medisys', 'Digital Blood Pressure Monitor', 'healthcare', 1250, 2400, 'unit', 10, 'In Stock', 0],
  ['looms-of-gujarat', 'Cotton Saree Fabric', 'textile', 180, 420, 'metre', 500, 'In Stock', 0],
  ['vertex-plastics', 'Industrial Plastic Granules (PP)', 'chemical', 145, 195, 'kg', 1000, 'In Stock', 0],
  ['srishti-alloys', 'Stainless Steel Round Bar 304', 'manufacturing', 210, 285, 'kg', 100, 'Made to Order', 0],
  ['meridian-infra', 'TMT Steel Rods Fe550', 'construction', 55000, 61000, 'tonne', 5, 'In Stock', 0]
];

const SERVICES = [
  ['shreeji-cnc-works', 'CNC Job Work (Turning / Milling)', 'machinery', 150, 600, 'per part', '3-7 days', 1],
  ['sun-tech-solutions', 'Digital Marketing & SEO', 'it', 25000, 120000, 'per month', 'Ongoing', 0],
  ['sun-tech-solutions', 'Web Development', 'it', 45000, 350000, 'per project', '15-40 days', 0],
  ['sri-venkatesh-machinery', 'Machine Installation & Commissioning', 'machinery', 15000, 45000, 'per job', '5-10 days', 1],
  ['build-right-construction', 'Civil Construction Contracting', 'construction', null, null, 'project', 'Project based', 1],
  ['medical-care-pharma', 'Preventive Healthcare On-Site', 'healthcare', 8500, 30000, 'per session', '1 day', 1],
  ['style-tex-garments', 'Bulk Fabric Sourcing & Supply', 'textile', null, null, 'order', '10-20 days', 0],
  ['sagar-machinery', 'Annual Maintenance Contract', 'machinery', 24000, 72000, 'per year', '12 months', 0],
  ['nova-electronics', 'PCB Design & Prototyping', 'electronics', 12000, 60000, 'per design', '5-12 days', 0],
  ['meridian-infra', 'Structural Audit & Site Survey', 'construction', 18000, 45000, 'per site', '3-5 days', 1],
  ['fresh-bite-foods', 'Bulk Food Supply Contracts', 'food', null, null, 'contract', 'Monthly', 0],
  ['sundar-motors', 'Fleet Servicing Contract', 'automotive', 4500, 16000, 'per vehicle/month', 'Ongoing', 0],
  ['balaji-steels', 'Logistics & Freight Services', 'logistics', 1800, 6500, 'per tonne', '3-7 days', 0],
  ['apollo-medisys', 'Calibration & NABL Testing', 'healthcare', 3500, 14000, 'per item', '4-6 days', 0]
];

const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const scopedSlug = (businessSlug, title) => `${businessSlug}-${slugify(title)}`.slice(0, 120);
const now = () => new Date();

async function seed({ force = false } = {}) {
  await connect();

  if (force) {
    for (const n of ['saved_searches', 'contact_messages', 'enquiries', 'services', 'products', 'businesses', 'categories', 'users']) {
      await col(n).deleteMany({});
    }
  } else if (await col('businesses').countDocuments() > 0) {
    console.log('MongoDB already seeded. Pass --force to reseed.');
    return;
  }

  const catDocs = CATEGORIES.map(([slug, name, icon, blurb]) => ({ slug, name, icon, blurb }));
  await col('categories').insertMany(catDocs);
  const catBySlug = Object.fromEntries(catDocs.map(c => [c.slug, c]));
  console.log(`categories: ${catDocs.length}`);

  const hash = bcrypt.hashSync('demo1234', 10);
  const userResult = await col('users').insertMany([{
    name: 'BizBook Admin', email: 'admin@bizbook.in', phone: '9876500000',
    passwordHash: hash, role: 'admin', company: 'BizBook', city: 'Mumbai',
    isAdmin: true, createdAt: now()
  }]);
  const adminId = Object.values(userResult.insertedIds)[0];
  console.log('users: 1 (admin@bizbook.in / demo1234)');

  const PHONES = ['+91 98250 41120', '+91 98111 30255', '+91 98240 77881', '+91 98450 22119', '+91 98220 66440',
    '+91 98400 55910', '+91 98250 90873', '+91 98220 11764', '+91 98480 33021', '+91 94420 55610',
    '+91 98400 12345', '+91 98860 33445', '+91 94400 77881', '+91 90030 22110', '+91 94426 66990',
    '+91 98110 44590', '+91 98718 20204', '+91 98403 77120'];
  const MAILS = ['enquiry@shreejicnc.in', 'sales@balajisteels.in', 'info@sagarmachinery.in', 'hello@novaelectronics.in',
    'projects@meridianinfra.in', 'sales@sundarmotors.in', 'export@loomsgujarat.in', 'sales@annapurnafoods.in',
    'contact@apollomedisys.in', 'sales@srivenkateshmachinery.in', 'info@suntechsolutions.in', 'projects@buildright.co.in',
    'sales@medicalcarepharma.in', 'export@freshbitefoods.in', 'sales@styletex.in', 'sales@shrishtialloys.in',
    'info@vertexplastics.in', 'hello@kavachsystems.in'];

  const bizDocs = BUSINESSES.map((b, i) => {
    const [slug, name, cat, city, state, yearFounded, employees, turnover, certifications,
      exportMarkets, paymentTerms, verified, rating, reviewCount, responseMins, badge] = b;
    return {
      ownerId: adminId, slug, name, categorySlug: cat, categoryName: catBySlug[cat].name,
      tagline: `${name} — verified ${catBySlug[cat].name.toLowerCase()} supplier in ${city}`,
      description: `${name} is a verified ${catBySlug[cat].name.toLowerCase()} business based in ${city}, ${state}. ` +
        `Founded in ${yearFounded}, the company serves B2B buyers with consistent quality, competitive pricing and ` +
        `reliable delivery across India and export markets.`,
      city, state, address: `${city} Industrial Area`, gstin: `24ABC${1000 + i}1Z${5}`,
      yearFounded, employees, employeesMin: parseInt(employees, 10),
      employeesMax: parseInt(employees.split('-')[1], 10),
      turnover, certifications, exportMarkets, paymentTerms,
      verified: !!verified, badge, rating, reviewCount, responseMins,
      phone: PHONES[i], email: MAILS[i], website: `https://example.com/${slug}`,
      views: 120 + i * 137, createdAt: now(), updatedAt: now()
    };
  });
  await col('businesses').insertMany(bizDocs);
  const bizBySlug = Object.fromEntries(bizDocs.map(b => [b.slug, b]));
  console.log(`businesses: ${bizDocs.length}`);

  const productDocs = PRODUCTS.map(([bs, title, cat, pmin, pmax, unit, moq, stock, isCustom]) => ({
    businessId: bizBySlug[bs]._id, businessSlug: bs, businessName: bizBySlug[bs].name,
    city: bizBySlug[bs].city, state: bizBySlug[bs].state,
    verified: bizBySlug[bs].verified, rating: bizBySlug[bs].rating, reviewCount: bizBySlug[bs].reviewCount,
    responseMins: bizBySlug[bs].responseMins,
    title, slug: scopedSlug(bs, title), categorySlug: cat, categoryName: catBySlug[cat].name,
    description: `${title} supplied by a verified BizBook manufacturer. Available for B2B bulk orders with ` +
      `standard lead times and export-grade quality documentation.`,
    priceMin: pmin, priceMax: pmax, priceUnit: unit, moq, stock, isCustom: !!isCustom, createdAt: now()
  }));
  await col('products').insertMany(productDocs);
  console.log(`products: ${productDocs.length}`);

  const serviceDocs = SERVICES.map(([bs, title, cat, pmin, pmax, unit, duration, onSite]) => ({
    businessId: bizBySlug[bs]._id, businessSlug: bs, businessName: bizBySlug[bs].name,
    city: bizBySlug[bs].city, state: bizBySlug[bs].state,
    verified: bizBySlug[bs].verified, rating: bizBySlug[bs].rating, reviewCount: bizBySlug[bs].reviewCount,
    responseMins: bizBySlug[bs].responseMins,
    title, slug: scopedSlug(bs, title), categorySlug: cat, categoryName: catBySlug[cat].name,
    description: `${title} offered by a verified BizBook service provider. Projects are executed by a dedicated ` +
      `team with clear scope, timelines and transparent pricing.`,
    priceMin: pmin, priceMax: pmax, priceUnit: unit, duration, onSite: !!onSite, createdAt: now()
  }));
  await col('services').insertMany(serviceDocs);
  console.log(`services: ${serviceDocs.length}`);

  await col('contact_messages').insertOne({
    name: 'Anita Rao', email: 'anita@example.com', topic: 'Sales',
    message: 'Please share B2B supplier onboarding details for our Pune facility.',
    createdAt: now()
  });
  console.log('contact_messages: 1');
}

module.exports = { seed };

if (require.main === module) {
  const force = process.argv.includes('--force');
  seed({ force })
    .then(() => close())
    .then(() => { console.log('Seed complete.'); process.exit(0); })
    .catch((e) => { console.error(e); process.exit(1); });
}
