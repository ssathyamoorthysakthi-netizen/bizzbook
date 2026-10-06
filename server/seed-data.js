'use strict';

// Written by scripts/generate-gallery.js. Guarded so the generator can run
// before the manifest exists.
let GALLERY = {};
try {
  GALLERY = require('./gallery-manifest.json');
} catch (e) {
  if (e.code !== 'MODULE_NOT_FOUND') throw e;
}

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

module.exports = { CATEGORIES, BUSINESSES, GALLERY };
