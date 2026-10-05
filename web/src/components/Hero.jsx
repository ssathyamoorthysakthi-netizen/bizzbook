import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, MapPin, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import SearchBar from './SearchBar';

const FLOATING = [
  { icon: TrendingUp, title: 'New enquiry received', sub: 'CNC Turning · Coimbatore', tone: 'text-emerald-600 bg-emerald-50', pos: 'left-0 top-[18%]', delay: 0 },
  { icon: ShieldCheck, title: 'Verified supplier', sub: 'ISO 9001 · MSME Registered', tone: 'text-sky-600 bg-sky-50', pos: 'right-0 top-[10%]', delay: 1.2 },
  { icon: Users, title: '214 buyer reviews', sub: '4.9 average rating', tone: 'text-amber-600 bg-amber-50', pos: 'left-[8%] bottom-[16%]', delay: 2.1 },
  { icon: MapPin, title: 'Coimbatore, TN', sub: 'Industrial belt · 5,000+ suppliers', tone: 'text-violet-600 bg-violet-50', pos: 'right-[6%] bottom-[8%]', delay: 1.6 }
];

const TRUST = [
  { n: '500K+', l: 'Businesses listed' },
  { n: '16', l: 'Industries covered' },
  { n: '25+', l: 'Countries served' },
  { n: '4.9/5', l: 'Average rating' }
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink-950">
      {/* background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[560px] w-[560px] rounded-full bg-brand-600/25 blur-[120px]" />
        <div className="absolute -bottom-52 -right-32 h-[620px] w-[620px] rounded-full bg-sky-500/15 blur-[130px]" />
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '56px 56px' }} />
      </div>

      <div className="container-bb relative">
        <div className="grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:py-20">
          {/* copy */}
          <div>
            <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[12px] font-semibold text-white/90 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Trusted by 2M+ buyers across India
            </motion.span>

            <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, delay: .06 }}
              className="mt-5 text-[32px] font-extrabold leading-[1.08] tracking-tight text-white sm:text-[44px] lg:text-[54px]">
              Discover Businesses,
              <span className="block bg-gradient-to-r from-brand-400 via-brand-300 to-amber-300 bg-clip-text text-transparent">
                Products &amp; Services
              </span>
              <span className="block text-white">Across India</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, delay: .12 }}
              className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/70 sm:text-[16.5px]">
              Connect with trusted businesses, suppliers, manufacturers and service providers
              from across India — verified documents, transparent pricing and direct enquiries.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, delay: .18 }}
              className="mt-8 max-w-2xl">
              <SearchBar size="lg" showKinds />
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Link to="/businesses" className="btn-lg btn border border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/20">
                  Explore Businesses <ArrowRight size={16} />
                </Link>
                <Link to="/list-your-business" className="btn-lg btn-ghost text-white/80 hover:bg-white/10 hover:text-white">
                  List Your Business
                </Link>
              </div>
            </motion.div>

            <motion.dl initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .6, delay: .3 }}
              className="mt-10 grid max-w-lg grid-cols-2 gap-x-6 gap-y-4 border-t border-white/10 pt-6 sm:grid-cols-4">
              {TRUST.map(t => (
                <div key={t.l}>
                  <dt className="font-display text-[20px] font-extrabold text-white">{t.n}</dt>
                  <dd className="mt-0.5 text-[11.5px] leading-tight text-white/55">{t.l}</dd>
                </div>
              ))}
            </motion.dl>
          </div>

          {/* visual */}
          <div className="relative hidden lg:block">
            <motion.div initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .7, delay: .2 }}
              className="relative aspect-[4/4.4] w-full overflow-hidden rounded-[28px] border border-white/12 bg-gradient-to-br from-ink-800 to-ink-900 p-5 shadow-2xl">
              <div aria-hidden="true" className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-500/25 blur-3xl" />
              <div className="relative flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Live marketplace</p>
                    <p className="mt-0.5 text-[15px] font-bold text-white">Tamil Nadu · Machinery</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-300 ring-1 ring-inset ring-emerald-400/25">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />LIVE
                  </span>
                </div>

                <div className="mt-4 space-y-2.5">
                  {[
                    ['Sri Venkatesh Machinery', 'Coimbatore · 4.9 ★', 'bg-brand-500/15 text-brand-300'],
                    ['Sun Tech Solutions', 'Chennai · 4.9 ★', 'bg-sky-500/15 text-sky-300'],
                    ['Style Tex Garments', 'Tiruppur · 4.9 ★', 'bg-violet-500/15 text-violet-300'],
                    ['Fresh Bite Foods', 'Madurai · 4.8 ★', 'bg-amber-500/15 text-amber-300'],
                    ['Build Right Construction', 'Bengaluru · 4.8 ★', 'bg-rose-500/15 text-rose-300']
                  ].map(([n, s, c], i) => (
                    <motion.div key={n} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .45 + i * .1, duration: .45 }}
                      className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.04] p-3 backdrop-blur transition-colors hover:bg-white/[0.08]">
                      <span className={cxLogo(c)}>{n.split(' ').slice(0, 2).map(w => w[0]).join('')}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13.5px] font-bold text-white">{n}</span>
                        <span className="block truncate text-[11.5px] text-white/50">{s}</span>
                      </span>
                      <span className="shrink-0 rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">✓</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-auto rounded-xl border border-white/8 bg-white/[0.04] p-3.5 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <span className="text-[11.5px] text-white/50">Leads this month</span>
                    <span className="text-[12px] font-bold text-emerald-300">+312%</span>
                  </div>
                  <div className="mt-2.5 flex h-14 items-end gap-1.5">
                    {[38, 52, 44, 66, 58, 74, 68, 88, 80, 96, 92, 100].map((h, i) => (
                      <motion.span key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: .6 + i * .05, duration: .4 }}
                        className="flex-1 rounded-sm bg-gradient-to-t from-brand-600/50 to-brand-400" />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {FLOATING.map(f => (
              <motion.div key={f.title} initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 + f.delay * 0.2, duration: .5 }}
                style={{ top: f.pos.includes('top-') ? f.pos.split(' ')[0].replace('top-', '') : undefined }}
                className="absolute hidden w-[214px] rounded-2xl border border-white/12 bg-ink-900/85 p-3 shadow-xl backdrop-blur-xl xl:block"
                >
                <div className="flex items-center gap-2.5">
                  <span className={cxLogo(f.tone)}><f.icon size={15} /></span>
                  <span className="min-w-0">
                    <span className="block truncate text-[12.5px] font-bold text-white">{f.title}</span>
                    <span className="block truncate text-[11px] text-white/45">{f.sub}</span>
                  </span>
                </div>
                <span className="sr-only">{f.pos}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-white/[0.03] py-5">
        <div className="container-bb flex flex-wrap items-center justify-center gap-x-8 gap-y-2.5 text-[12.5px] text-white/45">
          {['ISO 9001 Verified Network', 'GSTIN Checked Suppliers', 'Encrypted Enquiries', 'Made in India · Made for India'].map(t => (
            <span key={t} className="inline-flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-400" />{t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

const cxLogo = (c) => `grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[11px] font-extrabold ${c}`;
