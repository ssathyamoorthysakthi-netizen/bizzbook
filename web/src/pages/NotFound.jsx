import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Home, Building2, Package, Wrench, Briefcase, LifeBuoy, ArrowRight, Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  { to: '/businesses', label: 'Browse businesses', Icon: Building2 },
  { to: '/products', label: 'Search products', Icon: Package },
  { to: '/services', label: 'Find services', Icon: Wrench },
  { to: '/jobs', label: 'Open jobs', Icon: Briefcase },
  { to: '/help', label: 'Help centre', Icon: LifeBuoy },
  { to: '/list-your-business', label: 'List your business', Icon: Sparkles }
];

export default function NotFound() {
  return (
    <section className="container-bb flex min-h-[68vh] flex-col items-center justify-center py-16 text-center">
      <motion.p initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }}
        className="font-display text-[86px] font-extrabold leading-none text-brand-100 sm:text-[120px]">
        404
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }} className="-mt-4">
        <h1 className="text-[26px] font-extrabold text-ink-900 sm:text-[32px]">We could not find that page</h1>
        <p className="mx-auto mt-3 max-w-md text-[14.5px] leading-relaxed text-ink-600">
          The link may be broken, or the listing you were looking for has been removed.
          Try searching for a business or category instead.
        </p>

        <div className="mx-auto mt-7 flex max-w-md items-center gap-2 rounded-2xl border border-ink-200 bg-white p-2 shadow-card">
          <Search size={17} className="ml-2 shrink-0 text-ink-400" />
          <input
            className="w-full bg-transparent py-2.5 text-[14px] text-ink-900 outline-none placeholder:text-ink-400"
            placeholder="Search businesses, products and services"
            onKeyDown={e => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                window.location.href = `/search?q=${encodeURIComponent(e.currentTarget.value.trim())}`;
              }
            }}
          />
          <Link to="/search" className="btn-primary btn-md shrink-0">Search</Link>
        </div>

        <div className="mt-9">
          <p className="text-[12.5px] font-bold uppercase tracking-wider text-ink-400">Popular destinations</p>
          <div className="mt-3.5 flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map(s => (
              <Link key={s.to} to={s.to}
                className="inline-flex items-center gap-1.5 rounded-xl border border-ink-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-ink-700 transition-all hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700">
                <s.Icon size={14} />{s.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary btn-md"><Home size={15} />Back to home</Link>
          <Link to="/help" className="btn-outline btn-md">Get help <ArrowRight size={15} /></Link>
        </div>
      </motion.div>
    </section>
  );
}