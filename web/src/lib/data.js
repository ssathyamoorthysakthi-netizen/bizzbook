export const CATEGORY_ICONS = {
  manufacturing: 'Factory',
  machinery: 'Cog',
  electronics: 'Cpu',
  construction: 'HardHat',
  automotive: 'Car',
  textile: 'Shirt',
  food: 'UtensilsCrossed',
  chemical: 'FlaskConical',
  agriculture: 'Sprout',
  healthcare: 'HeartPulse',
  it: 'MonitorSmartphone',
  professional: 'Briefcase',
  retail: 'ShoppingCart',
  logistics: 'Truck',
  education: 'GraduationCap',
  hospitality: 'Hotel'
};

export const inr = (n) => {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return null;
  const v = Number(n);
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(v % 10000000 === 0 ? 0 : 2)} Cr`;
  if (v >= 100000) return `₹${(v / 100000).toFixed(v % 100000 === 0 ? 0 : 1)} L`;
  if (v >= 1000) return `₹${v.toLocaleString('en-IN')}`;
  return `₹${v}`;
};

export const priceLabel = (p) => {
  if (!p) return 'Get Latest Price';
  const { priceMin, priceMax, priceUnit } = p;
  if (priceMin === null || priceMin === undefined) return 'On Request';
  const unit = priceUnit ? ` / ${priceUnit}` : '';
  if (priceMax && priceMax !== priceMin) {
    return `${inr(priceMin)} – ${inr(priceMax)}${unit}`;
  }
  return `${inr(priceMin)}${unit}`;
};

export const initials = (name = '') =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'BB';

export const cx = (...parts) => parts.filter(Boolean).join(' ');

export const timeAgo = (d) => {
  if (!d) return '';
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

export const POPULAR_SEARCHES = [
  'CNC Machine', 'Solar Panel', 'Packaging', 'Textile',
  'Hospital Equipment', 'Digital Marketing', 'Construction'
];

export const EXPLORE_CARDS = [
  {
    key: 'b2b', title: 'B2B', subtitle: 'Business to Business', tone: 'brand',
    desc: 'Connect manufacturers, suppliers, wholesalers and businesses on one verified network.',
    points: ['Verified suppliers', 'Bulk pricing', 'Direct enquiries']
  },
  {
    key: 'b2c', title: 'B2C', subtitle: 'Business to Consumer', tone: 'emerald',
    desc: 'Discover products and services directly from manufacturers with transparent pricing.',
    points: ['Factory direct', 'Wide range', 'Compare quotes']
  },
  {
    key: 'd2c', title: 'D2C', subtitle: 'Direct to Consumer', tone: 'sky',
    desc: 'Help brands and manufacturers connect straight to customers without middlemen.',
    points: ['No broker', 'Direct orders', 'Faster margins']
  },
  {
    key: 'local', title: 'Local Search', subtitle: 'Find Local Businesses', tone: 'amber',
    desc: 'Discover trusted businesses, workshops and services near you across every Indian city.',
    points: ['City-wise search', 'Instant contact', 'Nearby pros']
  }
];

export const PLATFORM_STATS = [
  { value: 500, suffix: 'K+', label: 'Businesses' },
  { value: 10, suffix: 'M+', label: 'Products & Services' },
  { value: 2, suffix: 'M+', label: 'Buyers' },
  { value: 100, suffix: 'K+', label: 'Monthly Leads' },
  { value: 25, suffix: '+', label: 'Countries' },
  { value: 98, suffix: '%', label: 'Customer Satisfaction' }
];

export const WHY_CHOOSE = [
  { title: 'Verified Businesses', desc: 'Every supplier is checked against GSTIN and company records before going live.', icon: 'BadgeCheck' },
  { title: 'Quality Leads', desc: 'Buyers contact you with genuine requirements, not spam or scraped data.', icon: 'Target' },
  { title: 'Powerful Search', desc: 'Filter by category, city, rating, price range, badges and business type in one go.', icon: 'Search' },
  { title: 'Business Profiles', desc: 'A complete profile with certifications, turnover, capacity and payment terms.', icon: 'Building2' },
  { title: 'Product Discovery', desc: 'List products with MOQ, price bands and stock status so buyers know instantly.', icon: 'Package' },
  { title: 'Local Visibility', desc: 'Appear in city-level search results and let nearby buyers find you faster.', icon: 'MapPin' },
  { title: 'Marketing Tools', desc: 'Promote listings, highlight badges and reach buyers who are actively searching.', icon: 'Megaphone' },
  { title: 'Analytics & Insights', desc: 'Know which pages get views, which products convert and when buyers respond.', icon: 'BarChart3' },
  { title: 'Trusted Platform', desc: 'A verified badge that buyers across India recognise and trust.', icon: 'ShieldCheck' },
  { title: 'Dedicated Support', desc: 'Real people on call for onboarding, listing help and account questions.', icon: 'Headset' }
];

export const BUYER_TOOLS = [
  { title: 'Search Products', desc: 'Filter thousands of listings by category, city, price and availability.', icon: 'Search' },
  { title: 'Compare Suppliers', desc: 'View ratings, certifications, capacity and payment terms side by side.', icon: 'Scale' },
  { title: 'Request Quotes', desc: 'Ask for pricing on your exact quantity and get a written quotation.', icon: 'FileText' },
  { title: 'Send Enquiries', desc: 'Reach the right person directly with your requirement in one click.', icon: 'Send' },
  { title: 'Find Verified Businesses', desc: 'Only browse companies whose documents have been checked.', icon: 'BadgeCheck' },
  { title: 'Contact Suppliers', desc: 'Phone, email and website details for every verified listing.', icon: 'PhoneCall' },
  { title: 'Save Favourite Businesses', desc: 'Shortlist suppliers and return to them whenever you are ready.', icon: 'Heart' }
];

export const BUSINESS_TOOLS = [
  { title: 'Business Website', desc: 'Get a professional, mobile-ready profile page for your company at no extra cost.', icon: 'Globe' },
  { title: 'Get Quality Leads', desc: 'Connect with buyers who are actively searching for what you supply.', icon: 'Target' },
  { title: 'Sell Online', desc: 'Showcase your catalogue and let buyers request bulk quotations.', icon: 'ShoppingCart' },
  { title: 'Local Visibility', desc: 'Be found by customers searching your city and category.', icon: 'MapPin' },
  { title: 'Marketing Tools', desc: 'Promote products, feature your listing and reach wider audiences.', icon: 'Megaphone' },
  { title: 'Analytics & Insights', desc: 'Track profile views, product views, enquiries and lead quality.', icon: 'BarChart3' },
  { title: 'Trusted Platform', desc: 'Build credibility with a verified badge on every page you appear on.', icon: 'ShieldCheck' },
  { title: 'Dedicated Support', desc: 'Get help from a real account manager whenever you need it.', icon: 'Headset' }
];

export const JOB_TYPES = ['Find Jobs', 'Post a Job', 'Companies Hiring', 'Internship Opportunities', 'Industry Jobs', 'Remote Jobs'];

export const JOBS = [
  { title: 'Web Developer', company: 'Sun Tech Solutions', location: 'Chennai, Tamil Nadu', type: 'Full Time', exp: '2-4 yrs', salary: '₹6.0 L – ₹10.0 L', mode: 'Hybrid' },
  { title: 'Sales Executive', company: 'Sri Venkatesh Machinery', location: 'Coimbatore, Tamil Nadu', type: 'Full Time', exp: '1-3 yrs', salary: '₹3.6 L – ₹6.0 L', mode: 'Onsite' },
  { title: 'Mechanical Engineer', company: 'Shreeji CNC Works', location: 'Ahmedabad, Gujarat', type: 'Full Time', exp: '3-5 yrs', salary: '₹8.0 L – ₹14.0 L', mode: 'Onsite' },
  { title: 'Marketing Executive', company: 'Fresh Bite Foods', location: 'Madurai, Tamil Nadu', type: 'Full Time', exp: '1-3 yrs', salary: '₹3.0 L – ₹5.5 L', mode: 'Remote' },
  { title: 'Textile Designer', company: 'Style Tex Garments', location: 'Tiruppur, Tamil Nadu', type: 'Contract', exp: '2-5 yrs', salary: '₹4.5 L – ₹8.0 L', mode: 'Hybrid' },
  { title: 'Production Manager', company: 'Balaji Steels', location: 'Raipur, Chhattisgarh', type: 'Full Time', exp: '5-8 yrs', salary: '₹12.0 L – ₹20.0 L', mode: 'Onsite' }
];

export const INDUSTRIES = [
  { name: 'Manufacturing', slug: 'manufacturing', desc: 'Connect with factories, machine shops and production partners with audited capacity and certifications.' },
  { name: 'Retail & FMCG', slug: 'retail', desc: 'Source wholesale stock, find distributors and reach retail buyers across every state.' },
  { name: 'Healthcare & Pharma', slug: 'healthcare', desc: 'List medical devices, pharmaceuticals and diagnostics to hospitals, labs and distributors.' },
  { name: 'Construction & Real Estate', slug: 'construction', desc: 'Find contractors, material suppliers and project consultants for builds of any scale.' },
  { name: 'Education & Training', slug: 'education', desc: 'Reach institutions and learners for admissions, training and edtech partnerships.' },
  { name: 'Logistics & Transport', slug: 'logistics', desc: 'Book freight, warehousing and last-mile partners for domestic and export movement.' },
  { name: 'Hospitality & Tourism', slug: 'hospitality', desc: 'Source supplies, booking technology and hospitality services for operators.' },
  { name: 'Professional Services', slug: 'professional', desc: 'Hire consultants, legal, accounting and marketing firms for business requirements.' }
];

export const SERVICE_CATEGORIES = [
  'Digital Marketing', 'Web Development', 'Construction Services', 'Interior Design',
  'Logistics', 'Business Consulting', 'Accounting', 'Industrial Services',
  'IT Solutions', 'Advertising & Marketing'
];

export const PRODUCT_THUMBS = [
  'CNC Machines', 'Solar Panels', 'Textile Machinery', 'Packaging Machines',
  'Hospital Equipment', 'Electrical Equipment', 'Construction Materials', 'Automotive Parts'
];

export const SUCCESS_STORIES = [
  {
    quote: 'BizBook helped us reach new buyers across India.',
    name: 'Sundar Motors & Tyres', industry: 'Automotive', location: 'Chennai, Tamil Nadu', rating: 4.4, metric: '+312% enquiries'
  },
  {
    quote: 'We filled three export orders in one month of listing.',
    name: 'Annapurna Foods', industry: 'Food & Beverages', location: 'Nashik, Maharashtra', rating: 4.8, metric: '3 export orders'
  },
  {
    quote: 'Our leads now come from buyers who actually want to buy.',
    name: 'Shreeji CNC Works', industry: 'Machinery', location: 'Ahmedabad, Gujarat', rating: 4.9, metric: '4.9 avg rating'
  },
  {
    quote: 'Local search put us in front of every contractor in Pune.',
    name: 'Meridian Infra', industry: 'Construction', location: 'Pune, Maharashtra', rating: 4.5, metric: '+180 enquiries/mo'
  }
];

export const POSTS = [
  {
    slug: 'find-reliable-suppliers-india', title: 'How to Find Reliable Suppliers in India',
    category: 'Sourcing', date: '2026-09-18', read: 8, icon: 'Search',
    excerpt: 'A practical checklist for vetting Indian suppliers — GSTIN checks, plant audits, certification verification and payment-term red flags.',
    body: [
      'Finding a reliable supplier in India is less about finding the cheapest quote and more about reducing risk. The best B2B relationships begin with verification, not negotiation.',
      'Start with documentary checks. Ask for the GSTIN and confirm it against the public GST portal — the legal name, state and registration date should match the company you are dealing with. A mismatch is the single most common warning sign.',
      'Next, verify certifications independently. ISO, BIS, FSSAI and CE claims are cheap to fake. Ask for the certificate number and check it with the issuing body directly. A genuine supplier will not mind the extra step.',
      'Capacity claims should be tested. Ask for floor area, machine count, monthly output and current order book. If the numbers do not align with the employee count on their Udyam registration, be cautious.',
      'Always run a small trial order before committing volume. Trial orders reveal lead-time honesty, packaging quality and documentation discipline at very low cost.',
      'Finally, agree on dispute resolution and payment terms in writing. For new relationships, keep payment milestones tied to inspection so you are not exposed on a large first consignment.'
    ]
  },
  {
    slug: 'grow-b2b-business-online', title: 'How to Grow Your B2B Business Online',
    category: 'Growth', date: '2026-09-11', read: 7, icon: 'TrendingUp',
    excerpt: 'How Indian manufacturers are using marketplaces and digital presence to open new geography without a physical sales team.',
    body: [
      'For most Indian SMEs, the hardest part of expansion is not demand — it is finding the right demand. Sales teams scale slowly and travel costs eat into margins long before a new territory pays back.',
      'A structured online presence changes the economics. A verified marketplace profile lets an export manager or a small sales team handle inbound interest, because the profile answers the qualification questions before the call happens.',
      'The three high-leverage things to publish are: what you make, your capacity, and your certifications. Buyers filter on exactly these. Businesses that leave them blank appear generic and get ignored.',
      'Measure the funnel properly. Profile views tell you whether the listing is discoverable. Enquiries tell you whether the description converts. Response time tells you whether you win the deal.',
      'Treat the profile as a live sales asset. Update stock status, refresh product photos and add new certifications. A stale profile quietly stops converting.'
    ]
  },
  {
    slug: 'top-manufacturing-trends-india', title: 'Top Manufacturing Trends in India',
    category: 'Industry', date: '2026-09-04', read: 9, icon: 'Factory',
    excerpt: 'Automation, Industry 4.0, export diversification and green manufacturing — what Indian factories are actually investing in.',
    body: [
      'Automation is no longer a large-firm privilege. CNC and automated handling equipment that once required crore-plus investment are now reachable for mid-size plants through leasing and vendor finance.',
      'Industry 4.0 adoption has moved from pilots to line deployment. Machine monitoring, OEE dashboards and predictive maintenance are being justified on downtime reduction rather than buzzwords.',
      'Export diversification has become a survival skill. Dependence on a handful of buyers or destinations proved fragile. More exporters are building multiple markets and using certification to enter regulated segments.',
      'Green manufacturing is increasingly a commercial requirement, not just compliance. Buyers now ask for energy and waste documentation before shortlisting vendors.',
      'Energy efficiency has moved into the cost of goods. Factories that cut unit power consumption structurally improve export margins.'
    ]
  },
  {
    slug: 'digital-marketing-for-business', title: 'How Digital Marketing Helps Businesses',
    category: 'Marketing', date: '2026-08-28', read: 6, icon: 'Megaphone',
    excerpt: 'A channel-by-channel breakdown of what actually generates B2B enquiries in India, and what does not.',
    body: [
      'B2B digital marketing in India is dominated by search. When a buyer needs a supplier, they search rather than browse. This means the practical work is making sure your category, city and product names are searchable.',
      'Search intent is usually high. A query like "TMT bar supplier Raipur" is close to a purchase decision. Ranking for these terms is worth more than brand awareness campaigns.',
      'Marketplace listings and your own website should agree with each other. Conflicting information across channels confuses buyers and weakens both listings.',
      'Track lead quality, not lead count. A cheap campaign that produces fifty enquiries with no responses is a cost, not a return.',
      'Response time remains the strongest differentiator. Buyers frequently contact three suppliers and respond fastest to whoever replies first with specifics.'
    ]
  },
  {
    slug: 'guide-selling-products-online', title: 'Guide to Selling Products Online',
    category: 'E-commerce', date: '2026-08-21', read: 8, icon: 'ShoppingCart',
    excerpt: 'Setting up an online catalogue for a physical product business — listings, pricing bands, MOQ and enquiry handling.',
    body: [
      'Selling B2B online is not retail checkout. The buyer needs a quotation, not a cart, and the listing must communicate the terms that make an order possible.',
      'Publish price bands, not exact prices. A range with a unit and MOQ tells a buyer whether you are in their ballpark and filters out mismatched enquiries.',
      'MOQ belongs on the listing. It is the first thing a buyer checks and the most common cause of wasted enquiries.',
      'Stock status should be accurate and current. A wrong status creates a broken first impression you cannot recover from.',
      'Build a response template that asks for quantity, destination and grade. It turns a vague enquiry into a quotable requirement in one round trip.'
    ]
  },
  {
    slug: 'generate-quality-leads', title: 'How to Generate Quality Business Leads',
    category: 'Sales', date: '2026-08-14', read: 7, icon: 'Target',
    excerpt: 'Defining a qualified lead, building a response workflow, and using analytics to fix the leakiest part of your funnel.',
    body: [
      'A qualified lead has three attributes: a real business, a real requirement and a real timeline. Most lead problems are actually a failure to qualify early.',
      'Write down your qualification criteria and apply them on the first reply. It feels slower and is much faster overall.',
      'Response time is the single most controllable factor in winning B2B work. Template the first reply so it can go out in minutes, not hours.',
      'Track where leads die. Views to enquiry, enquiry to quotation, quotation to order. The stage with the worst drop-off is where your business is losing the most money.',
      'Close the loop with buyers. A short follow-up after a quotation converts more than new prospecting does.'
    ]
  }
];

export const FAQS = [
  { q: 'What is BizBook?', a: 'BizBook is an Indian B2B marketplace that connects businesses, buyers, product suppliers and service providers. Buyers can search verified companies by category, city and requirement, while suppliers get a professional profile to showcase products and receive enquiries.' },
  { q: 'Is it free to list my business?', a: 'Yes. The Free plan includes a business profile, basic visibility, product listings and basic enquiries. Paid Professional and Premium plans add featured placement, more listings, lead generation and analytics.' },
  { q: 'How are businesses verified?', a: 'We verify GSTIN, company registration details and category eligibility before a Verified badge is granted. Verification is reviewed by our team and can be revoked if documents are found to be invalid.' },
  { q: 'Can I search suppliers by city?', a: 'Yes. Every listing carries a city and state, and the directory filters by location. You can also use the location selector in the search bar to restrict results to one city.' },
  { q: 'How do I contact a supplier?', a: 'Use the Send Enquiry button on any listing to send your requirement directly to the supplier. Verified listings also show phone, email and website details.' },
  { q: 'What does a Professional plan include?', a: 'Featured business placement, additional product listings, lead generation, analytics and marketing tools to promote your listings across the platform.' },
  { q: 'Do you support international buyers?', a: 'Yes. Suppliers list the markets they export to, and the platform is used by buyers across 25+ countries. Payment terms, MOQ and export documentation are shown on each listing.' },
  { q: 'Can I post jobs on BizBook?', a: 'Business accounts can post roles from the dashboard. Job listings are visible to candidates across India and can be marked onsite, hybrid or remote.' },
  { q: 'How do I get support?', a: 'Every paid plan includes dedicated support. Free plan users can reach us through the Help Center and the contact form, with response within two business days.' },
  { q: 'Can I delete my listing?', a: 'Yes. Business owners can remove their own listing at any time from the dashboard. Removal also removes associated products, services and enquiries.' }
];

export const PRICING_PLANS = [
  {
    name: 'Free', price: 0, priceLabel: '₹0', period: '/forever', tagline: 'Start by getting discovered.',
    cta: 'Get Started', featured: false, action: 'signup',
    features: ['Business Profile', 'Basic Visibility', 'Product Listing', 'Basic Enquiries']
  },
  {
    name: 'Professional', price: 4999, priceLabel: '₹4,999', period: '/month', tagline: 'For growing businesses that want leads.',
    cta: 'Upgrade Now', featured: true, action: 'signup',
    features: ['Featured Business', 'More Product Listings', 'Lead Generation', 'Analytics', 'Marketing Tools']
  },
  {
    name: 'Premium', price: 14999, priceLabel: '₹14,999', period: '/month', tagline: 'Maximum visibility and insight.',
    cta: 'Upgrade Now', featured: false, action: 'signup',
    features: ['Premium Business Profile', 'Priority Visibility', 'Advanced Analytics', 'Unlimited Listings', 'Premium Support']
  }
];

export const TEAM = [
  { name: 'Rohit Sharma', role: 'Founder & CEO', city: 'Mumbai' },
  { name: 'Ananya Iyer', role: 'Head of Product', city: 'Bengaluru' },
  { name: 'Vikram Rathore', role: 'Head of Marketplace', city: 'Delhi NCR' },
  { name: 'Meera Nair', role: 'Head of Growth', city: 'Chennai' }
];

export const MILESTONES = [
  { year: '2019', text: 'BizBook founded in Mumbai with a focus on Indian SME discovery.' },
  { year: '2021', text: 'Crossed 100,000 verified business listings across 12 categories.' },
  { year: '2023', text: 'Launched product and service catalogue with enquiry workflow.' },
  { year: '2025', text: 'Expanded to 25+ countries with multilingual buyer support.' },
  { year: '2026', text: 'Introduced analytics, jobs and Industry 4.0 supplier modules.' }
];

export const LEGAL = {
  privacy: {
    title: 'Privacy Policy',
    updated: '1 January 2026',
    sections: [
      { h: 'Information We Collect', p: 'We collect account details (name, email, phone, company, city), business listing information you submit (including GSTIN and certifications), enquiry and contact message content, and standard technical data such as IP address, device type and pages viewed. We do not collect payment card details — payments are handled by our payment partners.' },
      { h: 'How We Use Your Information', p: 'We use your data to operate the marketplace: to show your listing, to deliver enquiries you request, to match buyers with suppliers, to provide support and to prevent fraud. Aggregate, non-identifying analytics are used to improve search relevance.' },
      { h: 'Verification Data', p: 'GSTIN and certification documents submitted for verification are reviewed by our verification team, stored securely, and used solely to determine Verified status. Verified businesses consent to their badge being displayed.' },
      { h: 'Sharing', p: 'We share your information only with the parties needed to fulfil your request — for example, your enquiry details are shared with the supplier you contacted. We do not sell personal data to third parties. We may disclose data where required by Indian law or court order.' },
      { h: 'Cookies', p: 'We use essential cookies for session handling and authentication, and optional analytics cookies to understand aggregate usage. You can disable non-essential cookies in your browser settings.' },
      { h: 'Data Retention', p: 'We retain account and listing data while your account is active. On account deletion, personal data is removed or anonymised within 30 days, except where retention is required by law.' },
      { h: 'Your Rights', p: 'You may access, correct, export or delete your personal data at any time by writing to privacy@bizbook.in. We respond to verified requests within 30 days.' },
      { h: 'Security', p: 'Passwords are hashed and never stored in plain text. Data is transmitted over TLS, and access to production data is limited to authorised staff.' }
    ]
  },
  terms: {
    title: 'Terms & Conditions',
    updated: '1 January 2026',
    sections: [
      { h: 'Acceptance of Terms', p: 'By accessing or using BizBook you agree to these terms. If you do not agree, you must not use the platform. These terms are governed by the laws of India.' },
      { h: 'Account Obligations', p: 'You are responsible for accurate account information, for maintaining the confidentiality of your credentials, and for all activity under your account. One person or entity may operate one business account.' },
      { h: 'Listings and Content', p: 'You may only list content you own or are authorised to publish. Listings must be accurate and must not contain misleading claims, illegal goods, or infringing material. We may remove listings that breach these rules.' },
      { h: 'Verification', p: 'A Verified badge indicates that documents submitted for review were found consistent at the time of review. It is not an endorsement, guarantee of quality, or certification of the supplier’s claims. Verification may be revoked.' },
      { h: 'Enquiries and Transactions', p: 'BizBook facilitates contact between buyers and suppliers. Contracts, quotations, payments, delivery, quality claims and disputes between buyers and suppliers are entirely between those parties. BizBook is not a party to such transactions.' },
      { h: 'Prohibited Conduct', p: 'You may not scrape, reverse engineer, overload the platform, misrepresent your identity, impersonate another business, or use the platform for unlawful, fraudulent or abusive purposes.' },
      { h: 'Subscriptions', p: 'Paid plans renew automatically until cancelled. You may cancel at any time; access continues to the end of the paid period. Refunds are handled per the Refund Policy. Prices are exclusive of GST.' },
      { h: 'Intellectual Property', p: 'BizBook owns the platform, its design, and the BizBook name and marks. You retain ownership of content you upload and grant us a licence to display it as part of the service.' },
      { h: 'Disclaimers', p: 'The platform is provided on an "as is" basis. We do not warrant that it will be uninterrupted or error-free, nor that any listing is accurate or that any transaction will be completed.' },
      { h: 'Limitation of Liability', p: 'To the maximum extent permitted by law, our total liability arising out of your use of the platform is limited to the amount you paid us in the preceding twelve months. Nothing excludes liability for fraud, death or personal injury caused by negligence.' },
      { h: 'Governing Law', p: 'These terms are governed by Indian law. Disputes are subject to the exclusive jurisdiction of the courts at Mumbai, Maharashtra.' },
      { h: 'Contact', p: 'Questions about these terms can be sent to legal@bizbook.in.' }
    ]
  },
  refund: {
    title: 'Refund Policy',
    updated: '1 January 2026',
    sections: [
      { h: 'Free Plan', p: 'The Free plan requires no payment and is not refundable because there is no charge.' },
      { h: 'Paid Plans', p: 'Paid subscriptions may be cancelled at any time from the dashboard. On cancellation, access continues until the end of the current paid period.' },
      { h: 'Refund Windows', p: 'Refunds are available within 7 days of a charge if fewer than 10 lead impressions have been delivered. Requests after 7 days are not eligible for refund but the plan remains active until period end.' },
      { h: 'How to Request', p: 'Write to billing@bizbook.in from your registered account email with the invoice number and reason. We respond within 5 business days.' },
      { h: 'Processing', p: 'Approved refunds are returned to the original payment method. Banks typically take 5-10 business days to credit the amount. GST amounts are refunded proportionately.' },
      { h: 'Chargebacks', p: 'Please contact us before raising a chargeback so we can resolve the issue directly.' },
      { h: 'Non-Refundable Items', p: 'Custom marketing campaigns, promoted listings already delivered, and one-time setup services already performed are non-refundable.' }
    ]
  },
  cookie: {
    title: 'Cookie Policy',
    updated: '1 January 2026',
    sections: [
      { h: 'What Cookies Are', p: 'Cookies are small text files placed on your device by a website. They are widely used to make sites work correctly, remember preferences and understand usage.' },
      { h: 'Essential Cookies', p: 'These are required for core functionality — session tokens keeping you signed in, security tokens protecting forms, and load-balancing cookies. They cannot be disabled and are covered by our Privacy Policy.' },
      { h: 'Analytics Cookies', p: 'These help us understand aggregate usage — pages viewed, referrers and rough location — so we can improve the platform. They are optional and can be disabled.' },
      { h: 'Preference Cookies', p: 'These remember choices such as selected location, sort order and saved search preferences so you do not have to re-enter them.' },
      { h: 'Marketing Cookies', p: 'Used to measure the effectiveness of paid campaigns across our own channels. These are optional.' },
      { h: 'Managing Cookies', p: 'You can accept, reject or delete cookies through your browser settings and our cookie preference centre. Disabling essential cookies means you will not be able to sign in.' },
      { h: 'Third-Party Cookies', p: 'Some embedded content, such as map or analytics services, may set their own cookies. These are governed by those providers’ policies.' }
    ]
  }
};