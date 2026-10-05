import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, ArrowUpRight, Building2, Factory, Truck, GraduationCap, Hotel, Store, Briefcase,
  HeartPulse, Search, Send, Scale, FileText, BadgeCheck, PhoneCall, Heart, Globe, ShoppingCart,
  Target, Megaphone, BarChart3, ShieldCheck, Headset, Compass, MapPin, ClipboardList,
  Handshake, Sparkles, Wallet, LineChart, CheckCircle2, Package, Store as ShopIcon
} from 'lucide-react';
import Hero from '../components/Hero';
import { api } from '../lib/api';
import {
  EXPLORE_CARDS, PLATFORM_STATS, POPULAR_SEARCHES, WHY_CHOOSE, BUYER_TOOLS,
  BUSINESS_TOOLS, JOB_TYPES, JOBS, INDUSTRIES, SERVICE_CATEGORIES, PRODUCT_THUMBS,
  SUCCESS_STORIES, POSTS, CATEGORY_ICONS
} from '../lib/data';
import {
  SectionHead, SkeletonGrid, ErrorState, Carousel, RatingBreakdown
} from '../components/ui';
import {
  StatsSection, CategoryCard, IndustryCard, TestimonialCard, JobCard, BlogCard,
  FeatureGrid, SearchChip, StepCard
} from '../components/Blocks';
import { BusinessCard, ProductCard, ServiceCard } from '../components/Cards';
import { useEnquiryModal } from '../lib/enquiry';

const EXPLORE_TONES = ['brand', 'emerald', 'sky', 'amber'];
const EXPLORE_ICONS = { b2b: Building2, b2c: ShoppingCart, d2c: Store, local: MapPin };
const CAT_TONES = ['brand', 'emerald', 'sky', 'amber', 'violet', 'rose'];

const INDUSTRY_ICONS = {
  manufacturing: Factory, retail: Store, healthcare: HeartPulse, construction: Building2,
  education: GraduationCap, logistics: Truck, hospitality: Hotel, professional: Briefcase
};

const SERVICE_ICONS = {
  'Digital Marketing': Megaphone, 'Web Development': Globe, 'Construction Services': Building2,
  'Interior Design': Compass, Logistics: Truck, 'Business Consulting': Briefcase,
  Accounting: Wallet, 'Industrial Services': Factory, 'IT Solutions': Target,
  'Advertising & Marketing': Megaphone
};

const PRODUCT_ICONS = {
  'CNC Machines': Factory, 'Solar Panels': Sparkles, 'Textile Machinery': Compass,
  'Packaging Machines': Package, 'Hospital Equipment': HeartPulse,
  'Electrical Equipment': Target, 'Construction Materials': Building2, 'Automotive Parts': Truck
};

const PRODUCT_SUBTITLES = {
  'CNC Machines': 'Machining centres · Job work', 'Solar Panels': 'Mono PERC · 400–580W',
  'Textile Machinery': 'Spinning · Weaving · Printing', 'Packaging Machines': 'Pouch · Auger · VFFS',
  'Hospital Equipment': 'Diagnostic · Patient care', 'Electrical Equipment': 'Panels · Cables · Switchgear',
  'Construction Materials': 'Steel · Cement · Aggregate', 'Automotive Parts': 'Tyres · Components'
};

function useLiveData() {
  const [state, setState] = useState({ businesses: null, products: null, services: null });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      api.businesses({ limit: 6, sort: 'rating', verified: '1' }),
      api.products({ limit: 8, sort: 'rating' }),
      api.services({ limit: 10, sort: 'rating' })
    ]).then(([b, p, s]) => {
      setState({ businesses: b.items, products: p.items, services: s.items });
      setLoading(false);
    }).catch((e) => { setError(e); setLoading(false); });
  };

  useEffect(load, []);
  return { ...state, error, loading, reload: load };
}

export default function Home() {
  const { businesses, products, services, error, loading, reload } = useLiveData();
  const { openEnquiry } = useEnquiryModal();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.categories().then(r => setCategories(r.items || [])).catch(() => setCategories([]));
  }, []);

  const shownCategories = categories.length ? categories : [
    { slug: 'manufacturing', name: 'Manufacturing', businessCount: 0 },
    { slug: 'machinery', name: 'Machinery & Equipment', businessCount: 0 }
  ];

  const avgRating = businesses?.length
    ? (businesses.reduce((a, b) => a + b.rating, 0) / businesses.length).toFixed(1)
    : '4.8';

  return (
    <>
      <Hero />

      {/* 1. Explore BizBook */}
      <section className="section">
        <div className="container-bb">
          <SectionHead eyebrow="How it works" title="Explore BizBook" sub="Four ways to discover businesses, buy products and hire service providers across India." />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {EXPLORE_CARDS.map((c, i) => {
              const Icon = EXPLORE_ICONS[c.key];
              const to = c.key === 'local' ? '/search' : c.key === 'b2b' ? '/businesses' : c.key === 'b2c' ? '/products' : '/for-businesses';
              return (
                <motion.div key={c.key} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }} transition={{ delay: i * .07, duration: .45 }}>
                  <Link to={to} className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-lift">
                    <span className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-50 transition-transform duration-500 group-hover:scale-[1.6]" />
                    <span className="relative grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
                      <Icon size={22} />
                    </span>
                    <p className="relative mt-4 font-display text-[13px] font-bold uppercase tracking-wider text-brand-600">{c.title}</p>
                    <h3 className="relative mt-1 text-[17px] font-extrabold text-ink-900">{c.subtitle}</h3>
                    <p className="relative mt-2 flex-1 text-[13.5px] leading-relaxed text-ink-600">{c.desc}</p>
                    <ul className="relative mt-4 space-y-1.5">
                      {c.points.map(p => (
                        <li key={p} className="flex items-center gap-2 text-[12.5px] text-ink-600">
                          <CheckCircle2 size={13} className="shrink-0 text-emerald-500" />{p}
                        </li>
                      ))}
                    </ul>
                    <span className="relative mt-5 inline-flex items-center gap-1.5 text-[13px] font-bold text-brand-700">
                      Explore <ArrowRight size={15} className="transition-transform group-hover:translate-x-1.5" />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Stats */}
      <StatsSection stats={PLATFORM_STATS} />

      {/* 3. Popular searches */}
      <section className="pb-4">
        <div className="container-bb">
          <div className="flex flex-col items-center gap-5 rounded-3xl border border-ink-100 bg-gradient-to-br from-ink-50 to-white px-6 py-9 text-center">
            <h2 className="h2 text-[24px] sm:text-[30px]">Popular Searches</h2>
            <p className="max-w-lg text-[14px] text-ink-600">What buyers on BizBook are searching for this week.</p>
            <div className="flex flex-wrap justify-center gap-2.5">
              {POPULAR_SEARCHES.map(s => <SearchChip key={s} label={s} />)}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Categories */}
      <section className="section">
        <div className="container-bb">
          <SectionHead eyebrow="Categories" title="Explore Businesses by Industry"
            sub="Browse verified suppliers across 16 industry categories covering every major Indian manufacturing and service hub."
            align="center" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {shownCategories.slice(0, 16).map((c, i) => (
              <motion.div key={c.slug} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }} transition={{ delay: Math.min(i * .035, .3), duration: .4 }}>
                <CategoryCard category={{ ...c, icon: CATEGORY_ICONS[c.slug] }} tone={CAT_TONES[i % CAT_TONES.length]} />
              </motion.div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/businesses" className="btn-dark btn-md">View All Categories <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* 5. Large visual */}
      <section className="relative overflow-hidden">
        <div className="container-bb py-4">
          <div className="relative overflow-hidden rounded-[28px] bg-ink-950 px-6 py-14 sm:px-12 lg:py-20">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-brand-600/25 blur-[100px]" />
              <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-sky-600/20 blur-[100px]" />
              <div className="absolute inset-0 opacity-[0.06]"
                style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
            </div>

            <div className="relative grid items-center gap-10 lg:grid-cols-2">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11.5px] font-bold uppercase tracking-wider text-white/85">
                  <Sparkles size={13} />One platform, complete ecosystem
                </span>
                <h2 className="mt-4 text-[28px] font-extrabold leading-tight text-white sm:text-[38px] lg:text-[44px]">
                  Everything You Need to
                  <span className="block bg-gradient-to-r from-brand-400 to-amber-300 bg-clip-text text-transparent">Grow Your Business</span>
                </h2>
                <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/70">
                  Find reliable suppliers, discover new products, connect with buyers and grow your
                  business with BizBook — built for the way Indian trade actually works.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link to="/businesses" className="btn-primary btn-lg">Explore Businesses <ArrowRight size={17} /></Link>
                  <Link to="/products" className="btn-lg btn border border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/20">
                    Find Products
                  </Link>
                </div>
                <dl className="mt-9 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
                  {[['24 hrs', 'Avg. buyer response'], ['2M+', 'Active buyers'], ['16', 'Industries']].map(([a, b]) => (
                    <div key={b}>
                      <dt className="font-display text-[22px] font-extrabold text-white">{a}</dt>
                      <dd className="mt-0.5 text-[11.5px] text-white/50">{b}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="relative hidden lg:block">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { Icon: Factory, label: 'Manufacturing', n: '4,120 businesses', tone: 'text-brand-300' },
                    { Icon: Truck, label: 'Logistics & Freight', n: '1,860 businesses', tone: 'text-sky-300' },
                    { Icon: HeartPulse, label: 'Healthcare', n: '2,240 businesses', tone: 'text-emerald-300' },
                    { Icon: Globe, label: 'Export Ready', n: '25+ countries', tone: 'text-amber-300' }
                  ].map(({ Icon, label, n, tone }, i) => (
                    <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * .1, duration: .5 }}
                      whileHover={{ y: -6 }}
                      className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur">
                      <span className={`grid h-11 w-11 place-items-center rounded-xl bg-white/10 ${tone}`}><Icon size={20} /></span>
                      <p className="mt-3.5 text-[15px] font-bold text-white">{label}</p>
                      <p className="mt-0.5 text-[12px] text-white/45">{n}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Featured businesses */}
      <section className="section">
        <div className="container-bb">
          <SectionHead eyebrow="Handpicked" title="Featured Businesses"
            sub="Verified companies with strong ratings, proven capacity and active response times."
            action={<Link to="/businesses?sort=rating" className="btn-outline btn-md">See all <ArrowRight size={15} /></Link>} />
          {error ? <ErrorState error={error} onRetry={reload} /> : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-80 rounded-2xl" />)
                : businesses?.map(b => <BusinessCard key={b.id} business={b} onEnquiry={openEnquiry} />)}
            </div>
          )}
        </div>
      </section>

      {/* 7. Products */}
      <section className="section bg-ink-50/60">
        <div className="container-bb">
          <SectionHead eyebrow="Products" title="Find Products from Trusted Suppliers"
            sub="Compare listings with pricing bands, MOQ and live stock status — then send a direct enquiry."
            action={<Link to="/products" className="btn-outline btn-md">All products <ArrowRight size={15} /></Link>} />
          {error ? <ErrorState error={error} onRetry={reload} /> : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-[380px] rounded-2xl" />)
                  : products?.slice(0, 8).map(p => <ProductCard key={p.id} product={p} onEnquiry={openEnquiry} />)}
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {PRODUCT_THUMBS.map(t => {
                  const Icon = PRODUCT_ICONS[t];
                  return (
                    <Link key={t} to={`/products?q=${encodeURIComponent(t.split(' ')[0])}`}
                      className="group flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-3 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand-300">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-ink-50 text-ink-500 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                        <Icon size={18} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13.5px] font-bold text-ink-900">{t}</span>
                        <span className="block truncate text-[11.5px] text-ink-500">{PRODUCT_SUBTITLES[t]}</span>
                      </span>
                      <ArrowUpRight size={15} className="shrink-0 text-ink-300 transition-colors group-hover:text-brand-600" />
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* 8. Services */}
      <section className="section">
        <div className="container-bb">
          <SectionHead eyebrow="Services" title="Find Professional Services"
            sub="From digital marketing to civil contracting — book verified providers with transparent pricing."
            action={<Link to="/services" className="btn-outline btn-md">All services <ArrowRight size={15} /></Link>} />
          {error ? <ErrorState error={error} onRetry={reload} /> : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-[340px] rounded-2xl" />)
                  : services?.slice(0, 6).map(s => <ServiceCard key={s.id} service={s} onEnquiry={openEnquiry} />)}
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-2.5">
                {SERVICE_CATEGORIES.map(s => {
                  const Icon = SERVICE_ICONS[s] || Briefcase;
                  return (
                    <Link key={s} to={`/services?q=${encodeURIComponent(s)}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-ink-700 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand-400 hover:text-brand-700">
                      <Icon size={14} className="text-brand-600" />{s}
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* 9. For buyers */}
      <section className="section bg-gradient-to-b from-white to-brand-50/40">
        <div className="container-bb">
          <SectionHead eyebrow="For buyers" title="Everything Buyers Need"
            sub="Source with confidence — every tool you need to find, compare and contact the right supplier."
            action={<Link to="/for-buyers" className="btn-outline btn-md">Full guide <ArrowRight size={15} /></Link>} />
          <FeatureGrid items={BUYER_TOOLS} cols={4} />
          <div className="mt-10 rounded-3xl border border-brand-200 bg-white p-8 text-center shadow-lift">
            <h3 className="text-[22px] font-extrabold text-ink-900">Ready to find verified suppliers?</h3>
            <p className="mx-auto mt-2 max-w-lg text-[14px] text-ink-600">
              Create a free buyer account to save businesses, request quotations and track every enquiry in one place.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/signup" className="btn-primary btn-lg">Start Finding Suppliers <ArrowRight size={17} /></Link>
              <Link to="/businesses" className="btn-outline btn-lg">Browse Businesses</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 10. For businesses */}
      <section className="section">
        <div className="container-bb">
          <SectionHead eyebrow="For businesses" title="Grow Your Business with BizBook"
            sub="Get a professional online presence, quality leads and analytics that show what is actually working."
            action={<Link to="/for-businesses" className="btn-outline btn-md">Full guide <ArrowRight size={15} /></Link>} />
          <FeatureGrid items={BUSINESS_TOOLS} cols={4} />
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/list-your-business" className="btn-primary btn-lg">List Your Business <ArrowRight size={17} /></Link>
            <Link to="/pricing" className="btn-outline btn-lg">Explore Business Plans</Link>
          </div>
        </div>
      </section>

      {/* 11. Jobs */}
      <section className="section bg-ink-950">
        <div className="container-bb">
          <div className="mb-9 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11.5px] font-bold uppercase tracking-wider text-white/85">
              <Handshake size={13} />Hiring across the network
            </span>
            <h2 className="mt-4 text-[28px] font-extrabold leading-tight text-white sm:text-[38px]">Jobs &amp; Career Opportunities</h2>
            <p className="mx-auto mt-3 max-w-xl text-[15px] text-white/60">
              Find roles in manufacturing, technology, sales and operations — or hire from our verified employer network.
            </p>
          </div>

          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {JOB_TYPES.map((t, i) => (
              <Link key={t} to="/jobs"
                className="rounded-xl border border-white/12 bg-white/[0.06] px-4 py-2 text-[13px] font-semibold text-white/80 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-brand-400 hover:bg-brand-500/20 hover:text-white">
                {t}
              </Link>
            ))}
          </div>

          <div className="grid gap-4 rounded-3xl bg-white/[0.03] p-4 sm:grid-cols-2 lg:grid-cols-3">
            {JOBS.map(j => <JobCard key={j.title} job={j} />)}
          </div>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link to="/jobs" className="btn-primary btn-lg">Find Jobs <ArrowRight size={17} /></Link>
            <Link to="/dashboard" className="btn-lg btn border border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/20">Post a Job</Link>
          </div>
        </div>
      </section>

      {/* 12. Industry solutions */}
      <section className="section">
        <div className="container-bb">
          <SectionHead eyebrow="Industry solutions" title="Industry Solutions"
            sub="BizBook adapts to how each sector actually buys, sells and hires." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {INDUSTRIES.map((ind, i) => (
              <motion.div key={ind.slug} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }} transition={{ delay: Math.min(i * .04, .3), duration: .4 }}>
                <IndustryCard industry={{ ...ind, icon: INDUSTRY_ICONS[ind.slug] }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. Why choose */}
      <section className="section bg-ink-50/60">
        <div className="container-bb">
          <SectionHead eyebrow="Why BizBook" title="Why Choose BizBook?"
            sub="Ten reasons buyers and businesses across India trust the platform." />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {WHY_CHOOSE.map((w, i) => {
              const IconMap = { BadgeCheck, Target, Search, Building2, Package, MapPin, Megaphone, BarChart3, ShieldCheck, Headset };
              const Icon = IconMap[w.icon] || BadgeCheck;
              return (
                <motion.div key={w.title} initial={{ opacity: 0, scale: .96 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-30px' }} transition={{ delay: Math.min(i * .035, .3), duration: .4 }}
                  className="group rounded-xl border border-ink-100 bg-white p-4 shadow-card transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                    <Icon size={17} />
                  </span>
                  <p className="mt-2.5 text-[13.5px] font-bold text-ink-900">{w.title}</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-ink-500">{w.desc}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-10 grid items-center gap-8 rounded-3xl border border-ink-100 bg-white p-8 shadow-card lg:grid-cols-2">
            <div>
              <h3 className="text-[22px] font-extrabold text-ink-900">How BizBook verification works</h3>
              <div className="mt-6 space-y-5">
                {[
                  { Icon: ClipboardList, t: 'Submit business documents', d: 'GSTIN, incorporation certificate and category proof.' },
                  { Icon: BadgeCheck, t: 'We verify the details', d: 'Documents are checked against public records by our team.' },
                  { Icon: ShieldCheck, t: 'Verified badge is granted', d: 'Your badge appears on every listing, product and service page.' },
                  { Icon: LineChart, t: 'Performance is monitored', d: 'Ratings and response times are tracked publicly.' }
                ].map(({ Icon, t, d }, i) => (
                  <StepCard key={t} step={i + 1} title={t} desc={d} Icon={Icon} last={i === 3} />
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-sm rounded-2xl border border-ink-100 bg-ink-50/60 p-6 text-center">
                <p className="text-[13px] font-semibold uppercase tracking-wide text-ink-400">Live network rating</p>
                <div className="mt-3 flex justify-center"><RatingBreakdown rating={Number(avgRating) || 4.8} count={businesses?.reduce((a, b) => a + b.reviewCount, 0) || 0} /></div>
                <p className="mt-5 border-t border-ink-200/70 pt-4 text-[12.5px] text-ink-500">
                  Ratings come from verified buyers who completed an enquiry through BizBook.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 14. Success stories */}
      <section className="section">
        <div className="container-bb">
          <SectionHead eyebrow="Success stories" title="Success Stories"
            sub="Real Indian businesses growing through the BizBook network." />
          <Carousel count={SUCCESS_STORIES.length}>
            {SUCCESS_STORIES.map((s, i) => (
              <div key={s.name} className="px-1.5 py-1"><TestimonialCard story={s} featured={i === 0} /></div>
            ))}
          </Carousel>
        </div>
      </section>

      {/* 15. Insights */}
      <section className="section bg-ink-50/60">
        <div className="container-bb">
          <SectionHead eyebrow="Resources" title="Latest Insights & Resources"
            sub="Practical guides for buyers, suppliers and business owners."
            action={<Link to="/resources" className="btn-outline btn-md">All articles <ArrowRight size={15} /></Link>} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {POSTS.map(p => <BlogCard key={p.slug} post={p} />)}
          </div>
        </div>
      </section>

      {/* 16. Pricing teaser */}
      <section className="section">
        <div className="container-bb">
          <div className="grid gap-6 rounded-3xl border border-ink-100 bg-white p-8 shadow-card lg:grid-cols-[1.1fr_1fr] lg:p-10">
            <div>
              <span className="eyebrow">Pricing</span>
              <h2 className="mt-3 text-[26px] font-extrabold leading-tight text-ink-900 sm:text-[34px]">
                Start Free. Upgrade When Leads Flow.
              </h2>
              <p className="mt-3 max-w-lg text-[14.5px] leading-relaxed text-ink-600">
                Every plan starts with a professional business profile. Upgrade when you need featured
                placement, more listings and detailed analytics. No lock-in, cancel anytime.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/pricing" className="btn-primary btn-md">See full pricing <ArrowRight size={16} /></Link>
                <Link to="/list-your-business" className="btn-outline btn-md">List Your Business</Link>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { plan: 'Free', price: '₹0', items: 'Profile · Basic visibility · Product listings' },
                { plan: 'Professional', price: '₹4,999/mo', items: 'Featured · Leads · Analytics · Marketing' },
                { plan: 'Premium', price: '₹14,999/mo', items: 'Priority · Unlimited · Advanced analytics' }
              ].map(p => (
                <Link key={p.plan} to="/pricing"
                  className="flex items-center justify-between gap-4 rounded-xl border border-ink-100 p-4 transition-all hover:border-brand-300 hover:bg-brand-50/40">
                  <span className="min-w-0">
                    <span className="block text-[14.5px] font-bold text-ink-900">{p.plan}</span>
                    <span className="block truncate text-[12px] text-ink-500">{p.items}</span>
                  </span>
                  <span className="shrink-0 font-display text-[17px] font-extrabold text-ink-900">{p.price}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 17. Final CTA */}
      <section className="pb-20">
        <div className="container-bb">
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 px-6 py-14 text-center shadow-lift sm:px-12 lg:py-16">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-20"
              style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,.35), transparent 45%), radial-gradient(circle at 80% 80%, rgba(255,255,255,.25), transparent 45%)' }} />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-[28px] font-extrabold leading-tight text-white sm:text-[38px] lg:text-[44px]">
                Take Your Business Online with BizBook
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/80">
                Create your business profile, showcase your products and services, reach new customers
                and generate quality leads — all in one place.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/list-your-business" className="btn-lg btn bg-white text-brand-700 hover:bg-brand-50 shadow-lg">
                  List Your Business <ArrowRight size={17} />
                </Link>
                <Link to="/signup" className="btn-lg btn border border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20">
                  Create Free Account
                </Link>
              </div>
              <p className="mt-6 text-[12.5px] text-white/65">No credit card required · Free plan forever available</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}