import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, BadgeCheck, Target, Building2, Globe, Megaphone, BarChart3, ShieldCheck, Headset,
  ShoppingCart, MapPin, Send, PhoneCall, Heart, Scale, FileText, CheckCircle2, HeartHandshake,
  Rocket, Sprout, Clock, SendHorizontal, Building, Package,
  Check, ArrowRight, Sparkles
} from 'lucide-react';
import { LEGAL, TEAM, MILESTONES, BUYER_TOOLS, BUSINESS_TOOLS, FAQS, cx } from '../lib/data';
import { Accordion, SectionHead } from '../components/ui';

const ICONS = {
  Search, BadgeCheck, Target, Building2, Globe, Megaphone, BarChart3, ShieldCheck, Headset,
  ShoppingCart, MapPin, Send, PhoneCall, Heart, Scale, FileText, CheckCircle2, HeartHandshake,
  Rocket, Sprout, Clock, Building, Package
};

const TOOL_SETS = {
  forBuyers: {
    eyebrow: 'For Buyers',
    title: 'Source Better, Faster',
    sub: 'Find verified Indian businesses, compare them properly and reach the right supplier without cold-calling a hundred listings.',
    tools: BUYER_TOOLS,
    tone: 'brand'
  },
  forBusinesses: {
    eyebrow: 'For Businesses',
    title: 'Get Found by Real Buyers',
    sub: 'A free business profile, a searchable catalogue and an enquiry workflow built for how Indian SMEs actually sell.',
    tools: BUSINESS_TOOLS,
    tone: 'emerald'
  }
};

const STEPS = [
  { Icon: Building, t: 'Create your free profile', d: 'Add your business name, category, city, capacity and certifications in about two minutes.' },
  { Icon: BadgeCheck, t: 'Get verified', d: 'Submit your GSTIN and category documents. We review them and award the Verified badge.' },
  { Icon: Package, t: 'Publish your catalogue', d: 'List products with price bands and MOQ, and services with scope and duration.' },
  { Icon: Target, t: 'Receive qualified enquiries', d: 'Buyers send requirements directly to you. You track status from your dashboard.' }
];

const VALUES = [
  { Icon: ShieldCheck, t: 'Verification over volume', d: 'We would rather have ten accurate listings than a thousand unverifiable ones.' },
  { Icon: HeartHandshake, t: 'Fair to both sides', d: 'Buyers get transparency; suppliers get enquiries without a broker taking a cut.' },
  { Icon: BarChart3, t: 'Useful analytics', d: 'Numbers you can act on — where enquiries come from and which listings convert.' },
  { Icon: Clock, t: 'Respect response time', d: 'Fast replies win B2B work. The platform is built to make replying easy.' }
];

const HELP_TOPICS = [
  { Icon: Building2, t: 'Listing your business', d: 'Create a profile, add catalogues and understand how search finds you.' },
  { Icon: BadgeCheck, t: 'Verification', d: 'Which documents we need, how review works and how long it takes.' },
  { Icon: SendHorizontal, t: 'Enquiries & leads', d: 'How buyers contact you, statuses and how to respond effectively.' },
  { Icon: Scale, t: 'Plans & billing', d: 'Compare plans, invoices, upgrades, cancellations and refunds.' },
  { Icon: ShoppingCart, t: 'Buying on BizBook', d: 'Searching, filtering, comparing suppliers and requesting quotes.' },
  { Icon: Headset, t: 'Report a problem', d: 'Report inaccurate listings, misuse or anything that needs attention.' }
];

const FooterLink = ({ to, children }) => (
  <Link to={to} className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-ink-600 transition-colors hover:text-brand-700">
    {children} <ArrowRight size={13} />
  </Link>
);

export default function StaticPage({ page }) {
  if (page === 'legal') return <LegalPage />;

  if (page === 'forBuyers' || page === 'forBusinesses') {
    const cfg = TOOL_SETS[page];
    const IconList = cfg.tools.map(t => ({ ...t, Icon: ICONS[t.icon] || CheckCircle2 }));
    return (
      <>
        <section className="relative overflow-hidden bg-ink-950">
          <div className="container-bb relative py-16 sm:py-24">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
              <span className={cx('eyebrow', cfg.tone === 'emerald' ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300' : 'border-white/15 bg-white/10 text-brand-300')}>
                {cfg.eyebrow}
              </span>
              <h1 className="mt-4 text-[32px] font-extrabold leading-tight text-white sm:text-[46px]">{cfg.title}</h1>
              <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-relaxed text-white/65">{cfg.sub}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to={page === 'forBuyers' ? '/businesses' : '/list-your-business'} className="btn-primary btn-md">
                  {page === 'forBuyers' ? 'Search businesses' : 'List your business free'}
                </Link>
                <Link to={page === 'forBuyers' ? '/products' : '/pricing'} className="btn-outline btn-md border-white/25 text-white hover:bg-white/10">
                  {page === 'forBuyers' ? 'Browse products' : 'See pricing'}
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="container-bb py-14">
          <SectionHead eyebrow="Capabilities" title={page === 'forBuyers' ? 'Everything Buyers Need' : 'Everything You Get'} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {IconList.map((t, i) => (
              <motion.div key={t.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .05 }}
                className="card p-6 transition-all hover:border-brand-300 hover:shadow-lift">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600"><t.Icon size={19} /></span>
                <h3 className="mt-3.5 text-[16px] font-extrabold text-ink-900">{t.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-600">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="border-y border-ink-100 bg-ink-50/60 py-14">
          <div className="container-bb">
            <SectionHead eyebrow="How it works" title="Four Steps to Your First Enquiry" />
            <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s, i) => (
                <li key={s.t} className="card relative p-6">
                  <span className="absolute -top-3 -left-3 grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-[13px] font-extrabold text-white shadow-glow">
                    {i + 1}
                  </span>
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600"><s.Icon size={18} /></span>
                  <h3 className="mt-3.5 text-[15.5px] font-extrabold text-ink-900">{s.t}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-600">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="container-bb py-14">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHead eyebrow="Common questions" title={`${cfg.eyebrow} — FAQ`} align="left" />
              <Link to="/help" className="btn-outline btn-md">Open the help centre</Link>
            </div>
            <Accordion items={page === 'forBuyers' ? FAQS.slice(2, 7) : FAQS.slice(0, 5)} defaultOpen={0} />
          </div>
        </section>

        <section className="border-t border-ink-100 bg-ink-950 py-14 text-center">
          <div className="container-bb">
            <Sparkles size={24} className="mx-auto text-brand-400" />
            <h2 className="mt-4 text-[24px] font-extrabold text-white sm:text-[30px]">
              {page === 'forBuyers' ? 'Ready to find your supplier?' : 'Ready to take your business online?'}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[14.5px] leading-relaxed text-white/60">
              {page === 'forBuyers'
                ? 'Search by category, city, badge and price band — then send a requirement directly to the supplier.'
                : 'Creating a profile is free. Upgrade only when you want featured placement and analytics.'}
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link to={page === 'forBuyers' ? '/businesses' : '/list-your-business'} className="btn-primary btn-md">
                {page === 'forBuyers' ? 'Start searching' : 'List your business'}
              </Link>
              <Link to="/contact" className="btn-outline btn-md border-white/25 text-white hover:bg-white/10">Talk to us</Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (page === 'about') {
    return (
      <>
        <section className="relative overflow-hidden bg-ink-950">
          <div className="container-bb relative py-16 sm:py-24">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
              <span className="eyebrow border-white/15 bg-white/10 text-brand-300">About BizBook</span>
              <h1 className="mt-4 text-[32px] font-extrabold leading-tight text-white sm:text-[46px]">
                The Verified Network for Indian Business
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-relaxed text-white/65">
                BizBook connects manufacturers, suppliers, service providers and buyers on one verified
                marketplace — so finding a trustworthy trading partner stops being guesswork.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/businesses" className="btn-primary btn-md">Browse businesses</Link>
                <Link to="/list-your-business" className="btn-outline btn-md border-white/25 text-white hover:bg-white/10">Join the network</Link>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="container-bb py-14">
          <SectionHead eyebrow="Our mission" title="Make Trust the Default" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(v => (
              <div key={v.t} className="card p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600"><v.Icon size={19} /></span>
                <h3 className="mt-3.5 text-[16px] font-extrabold text-ink-900">{v.t}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-600">{v.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-ink-100 bg-ink-50/60 py-14">
          <div className="container-bb">
            <SectionHead eyebrow="Journey" title="How We Got Here" />
            <ol className="relative mx-auto max-w-3xl space-y-6 border-l-2 border-brand-200 pl-7">
              {MILESTONES.map(m => (
                <li key={m.year} className="relative">
                  <span className="absolute -left-[35px] grid h-6 w-6 place-items-center rounded-full bg-brand-600 ring-4 ring-brand-50" />
                  <p className="font-display text-[18px] font-extrabold text-brand-700">{m.year}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-ink-700">{m.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="container-bb py-14">
          <SectionHead eyebrow="Team" title="The People Behind BizBook" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map(t => (
              <div key={t.name} className="card p-6 text-center">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl font-display text-xl font-bold text-white"
                  style={{ background: `linear-gradient(135deg, hsl(${t.name.length * 37 % 360} 72% 46%), hsl(${(t.name.length * 37 + 38) % 360} 74% 38%))` }}>
                  {t.name.split(' ').map(w => w[0]).join('')}
                </span>
                <h3 className="mt-4 text-[15.5px] font-extrabold text-ink-900">{t.name}</h3>
                <p className="mt-0.5 text-[13px] font-semibold text-brand-700">{t.role}</p>
                <p className="mt-1 inline-flex items-center gap-1 text-[12px] text-ink-400"><MapPin size={11} />{t.city}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link to="/contact" className="btn-outline btn-md">Work with us <ArrowRight size={15} /></Link>
          </div>
        </section>
      </>
    );
  }

  if (page === 'help') {
    return (
      <>
        <section className="border-b border-ink-100 bg-ink-50/60">
          <div className="container-bb py-14 text-center sm:py-20">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl">
              <span className="eyebrow">Help Centre</span>
              <h1 className="mt-4 text-[32px] font-extrabold leading-tight text-ink-900 sm:text-[44px]">How Can We Help?</h1>
              <p className="mx-auto mt-4 max-w-2xl text-[15.5px] leading-relaxed text-ink-600">
                Guides for suppliers and buyers — listing, verification, enquiries, plans and reporting.
              </p>
              <Link to="/resources" className="btn-primary btn-md mt-7">Browse all guides</Link>
            </motion.div>
          </div>
        </section>

        <section className="container-bb py-14">
          <SectionHead eyebrow="Topics" title="Choose a Category" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {HELP_TOPICS.map(t => (
              <Link key={t.t} to="/contact" className="card group flex gap-4 p-6 transition-all hover:border-brand-300 hover:shadow-lift">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <t.Icon size={19} />
                </span>
                <div>
                  <h3 className="text-[16px] font-extrabold text-ink-900 group-hover:text-brand-700">{t.t}</h3>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-ink-600">{t.d}</p>
                  <span className="mt-2.5 inline-flex items-center gap-1 text-[12.5px] font-bold text-brand-700">
                    Get help <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-ink-100 bg-ink-50/60 py-14">
          <div className="container-bb grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
            <div>
              <SectionHead eyebrow="FAQ" title="Frequently Asked Questions" align="left" />
              <Accordion items={FAQS} defaultOpen={0} />
            </div>
            <div className="rounded-2xl border border-ink-900 bg-ink-950 p-6 text-white">
              <Headset size={22} className="text-brand-400" />
              <h3 className="mt-3 text-[16px] font-extrabold">Still stuck?</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/65">
                Send us the details and a real person will reply within one business day.
              </p>
              <div className="mt-5 space-y-2">
                <FooterLink to="/contact">Contact support</FooterLink>
                <div><FooterLink to="/legal/refund">Refund policy</FooterLink></div>
                <div><FooterLink to="/pricing">See plans</FooterLink></div>
              </div>
              <Link to="/contact" className="btn-primary btn-sm mt-5 w-full">Open contact form</Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return <Navigate to="/" replace />;
}

function LegalPage() {
  const { doc } = useParams();
  const data = LEGAL[doc] || LEGAL.privacy;
  const links = [
    ['privacy', 'Privacy Policy'], ['terms', 'Terms & Conditions'],
    ['refund', 'Refund Policy'], ['cookie', 'Cookie Policy']
  ];

  return (
    <>
      <section className="border-b border-ink-100 bg-ink-50/60">
        <div className="container-bb py-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">Legal</span>
              <h1 className="mt-3 text-[28px] font-extrabold text-ink-900 sm:text-[36px]">{data.title}</h1>
              <p className="mt-1.5 text-[13.5px] text-ink-500">Last updated: {data.updated}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {links.map(([k, l]) => (
                <Link key={k} to={`/legal/${k}`}
                  className={cx('rounded-lg border px-3 py-1.5 text-[12.5px] font-semibold transition-all',
                    k === doc ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-ink-200 text-ink-600 hover:border-brand-300')}>
                  {l}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-bb py-12">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <aside>
            <nav className="sticky top-[86px] rounded-2xl border border-ink-100 bg-white p-2 shadow-card">
              {data.sections.map((s, i) => (
                <a key={s.h} href={`#s${i}`}
                  className="block rounded-lg px-3 py-2 text-[13px] font-medium text-ink-600 transition-colors hover:bg-brand-50 hover:text-brand-700">
                  {s.h}
                </a>
              ))}
            </nav>
          </aside>

          <article className="min-w-0 max-w-3xl">
            {data.sections.map((s, i) => (
              <section key={s.h} id={`s${i}`} className="mb-8 scroll-mt-28">
                <h2 className="text-[19px] font-extrabold text-ink-900">{i + 1}. {s.h}</h2>
                <p className="mt-2.5 text-[15px] leading-[1.8] text-ink-700">{s.p}</p>
              </section>
            ))}
            <div className="rounded-2xl border border-ink-100 bg-ink-50/60 p-6">
              <p className="text-[14.5px] font-bold text-ink-900">Questions about this document?</p>
              <p className="mt-1.5 text-[13.5px] text-ink-600">Write to legal@bizbook.in and we will clarify in writing.</p>
              <Link to="/contact" className="btn-outline btn-sm mt-4">Contact us</Link>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}