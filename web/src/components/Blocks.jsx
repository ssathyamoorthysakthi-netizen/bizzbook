import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight, Building2, BadgeCheck, Target, Search, Building, Package, MapPin, Megaphone,
  BarChart3, ShieldCheck, Headset, Scale, FileText, Send, PhoneCall, Heart, Globe,
  ShoppingCart, Factory, Briefcase, Store, Truck, GraduationCap, Hotel, Cpu, Car, Shirt,
  UtensilsCrossed, FlaskConical, Sprout, HeartPulse, MonitorSmartphone, Cog, HardHat, PackageOpen,
  ClipboardList, Wallet, LineChart, TrendingUp
} from 'lucide-react';
import { cx, initials } from '../lib/data';
import { Stars, Avatar } from './ui';

const ICONS = {
  BadgeCheck, Target, Search, Building2, Package, MapPin, Megaphone, BarChart3,
  ShieldCheck, Headset, Scale, FileText, Send, PhoneCall, Heart, Globe,
  ShoppingCart, Factory, Briefcase, Store, Truck, GraduationCap, Hotel, Cpu, Car,
  Shirt, UtensilsCrossed, FlaskConical, Sprout, HeartPulse, MonitorSmartphone, Cog, HardHat
};

/* ---------- StatsSection ---------- */
function useCountUp(target, active, duration = 1800) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return n;
}

function StatItem({ stat, active }) {
  const n = useCountUp(stat.value, active);
  return (
    <div className="px-2 text-center">
      <p className="font-display text-[32px] font-extrabold leading-none text-ink-900 sm:text-[42px]">
        {n >= 1000 ? n.toLocaleString('en-IN') : n}<span className="text-brand-600">{stat.suffix}</span>
      </p>
      <p className="mt-2 text-[12.5px] font-medium text-ink-600 sm:text-[13.5px]">{stat.label}</p>
    </div>
  );
}

export function StatsSection({ stats }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <section ref={ref} className="border-y border-ink-100 bg-gradient-to-b from-ink-50/70 to-white py-14 sm:py-20">
      <div className="container-bb">
        <p className="mb-9 text-center text-[12px] font-bold uppercase tracking-[0.18em] text-ink-400">
          Trusted by businesses and buyers across India
        </p>
        <div className="grid grid-cols-2 gap-y-9 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map(s => <StatItem key={s.label} stat={s} active={inView} />)}
        </div>
      </div>
    </section>
  );
}

/* ---------- CategoryCard ---------- */
const TONES = {
  brand: 'from-brand-50 to-brand-100 text-brand-700',
  emerald: 'from-emerald-50 to-emerald-100 text-emerald-700',
  sky: 'from-sky-50 to-sky-100 text-sky-700',
  amber: 'from-amber-50 to-amber-100 text-amber-700',
  violet: 'from-violet-50 to-violet-100 text-violet-700',
  rose: 'from-rose-50 to-rose-100 text-rose-700'
};

export function CategoryCard({ category, tone = 'brand', compact = false }) {
  const Icon = ICONS[category.icon] || Building2;
  return (
    <Link to={`/businesses?category=${category.slug}`}
      className="group card card-hover flex flex-col p-4 outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
      <span className={cx('grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br transition-transform duration-300 group-hover:scale-110', TONES[tone] || TONES.brand)}>
        <Icon size={20} />
      </span>
      <h3 className="mt-3.5 text-[14.5px] font-bold leading-snug text-ink-900 group-hover:text-brand-700">{category.name}</h3>
      {category.blurb && !compact && <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-ink-500">{category.blurb}</p>}
      <p className="mt-2.5 text-[12px] font-semibold text-ink-500">
        {category.businessCount} {category.businessCount === 1 ? 'business' : 'businesses'}
      </p>
      <span className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-bold text-brand-700 opacity-0 transition-all group-hover:opacity-100">
        Explore <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

export function IndustryCard({ industry }) {
  const Icon = ICONS[industry.icon] || Factory;
  return (
    <Link to={`/businesses?category=${industry.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-ink-100 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
        <Icon size={19} />
      </span>
      <h3 className="mt-3.5 text-[15px] font-bold text-ink-900">{industry.name}</h3>
      <p className="mt-2 text-[13px] leading-relaxed text-ink-600">{industry.desc}</p>
      <span className="mt-3.5 inline-flex items-center gap-1 text-[12.5px] font-bold text-brand-700">
        See suppliers <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

/* ---------- TestimonialCard ---------- */
export function TestimonialCard({ story, featured = false }) {
  return (
    <motion.article whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={cx('flex w-full shrink-0 snap-center flex-col rounded-2xl border border-ink-100 bg-white p-6 shadow-card sm:w-[420px] lg:w-[460px]',
        featured && 'border-brand-200 bg-gradient-to-br from-white to-brand-50/40')}>
      <svg width="34" height="26" viewBox="0 0 34 26" fill="currentColor" className="text-brand-200" aria-hidden="true">
        <path d="M0 26V14.6C0 6.5 4.6.9 13.7 0l1.4 4.3c-4.6 1.2-6.9 3.9-7 7.2h6.5V26H0zm20.2 0V14.6C20.2 6.5 24.8.9 33.9 0l1.1 4.3c-4.6 1.2-6.9 3.9-7 7.2h6.5V26H20.2z" />
      </svg>
      <p className="mt-3.5 flex-1 text-[16px] font-semibold leading-relaxed text-ink-800">“{story.quote}”</p>
      <div className="mt-5 flex items-center gap-3">
        <Avatar name={story.name} size="md" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold text-ink-900">{story.name}</p>
          <p className="truncate text-[12px] text-ink-500">{story.industry} · {story.location}</p>
        </div>
        <div className="shrink-0 text-right">
          <Stars value={story.rating} showValue={false} size={12} />
          <p className="mt-0.5 text-[11.5px] font-bold text-emerald-600">{story.metric}</p>
        </div>
      </div>
    </motion.article>
  );
}

/* ---------- JobCard ---------- */
export function JobCard({ job }) {
  return (
    <Link to="/jobs"
      className="group card card-hover flex flex-col p-4">
      <div className="flex items-start gap-3">
        <Avatar name={job.company} size="md" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-bold text-ink-900 group-hover:text-brand-700">{job.title}</h3>
          <p className="truncate text-[12.5px] text-ink-500">{job.company}</p>
        </div>
      </div>
      <div className="mt-3.5 flex flex-wrap gap-1.5">
        {[[job.type, 'bg-sky-50 text-sky-700'], [job.mode, 'bg-violet-50 text-violet-700'], [job.exp, 'bg-ink-50 text-ink-600']].map(([t, c]) => (
          <span key={t} className={cx('rounded-md px-2 py-0.5 text-[11px] font-bold', c)}>{t}</span>
        ))}
      </div>
      <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-ink-100 pt-3">
        <span className="flex items-center gap-1 text-[12px] text-ink-500"><MapPin size={12} />{job.location}</span>
        <span className="text-[13.5px] font-extrabold text-ink-900">{job.salary}</span>
      </div>
    </Link>
  );
}

/* ---------- BlogCard ---------- */
export function BlogCard({ post }) {
  const Icon = ICONS[post.icon] || FileText;
  return (
    <article className="group card card-hover flex flex-col overflow-hidden">
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-ink-50 to-ink-100">
        <span className="absolute inset-0 grid place-items-center">
          <Icon size={42} className="text-ink-300 transition-transform duration-500 group-hover:scale-110" />
        </span>
        <span className="absolute left-3.5 top-3.5 rounded-md bg-white/95 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-brand-700 shadow-sm">
          {post.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11.5px] text-ink-400">
          {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {post.read} min read
        </p>
        <h3 className="mt-2 text-[15.5px] font-bold leading-snug text-ink-900 group-hover:text-brand-700">
          <Link to={`/resources/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-[13px] leading-relaxed text-ink-600">{post.excerpt}</p>
        <Link to={`/resources/${post.slug}`}
          className="mt-3.5 inline-flex items-center gap-1 text-[13px] font-bold text-brand-700">
          Read More <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}

/* ---------- PricingCard ---------- */
export function PricingCard({ plan, billing, onSelect, ctaTo }) {
  const yearly = billing === 'yearly';
  const amount = yearly ? Math.round(plan.price * 12 * 0.8) : plan.price;
  return (
    <div className={cx('relative flex flex-col rounded-2xl border bg-white p-6 transition-all duration-300',
      plan.featured
        ? 'border-brand-300 shadow-lift lg:-translate-y-3 lg:scale-[1.02]'
        : 'border-ink-100 shadow-card hover:-translate-y-1 hover:shadow-lift')}>
      {plan.featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-glow">
          Most Popular
        </span>
      )}
      <h3 className="text-[17px] font-extrabold text-ink-900">{plan.name}</h3>
      <p className="mt-1.5 min-h-[40px] text-[13px] leading-relaxed text-ink-500">{plan.tagline}</p>

      <div className="mt-4 flex items-end gap-1.5">
        <span className="font-display text-[38px] font-extrabold leading-none text-ink-900">
          ₹{amount.toLocaleString('en-IN')}
        </span>
        <span className="pb-1 text-[13px] font-medium text-ink-500">{yearly ? '/year' : plan.period}</span>
      </div>
      {yearly && plan.price > 0 && (
        <p className="mt-1.5 text-[12px] font-semibold text-emerald-600">Save 20% with annual billing</p>
      )}
      {plan.price === 0 && <p className="mt-1.5 text-[12px] font-semibold text-ink-400">No card required</p>}

      <ul className="mt-5 flex-1 space-y-2.5">
        {plan.features.map(f => (
          <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-ink-700">
            <BadgeCheck size={16} className="mt-0.5 shrink-0 text-emerald-500" />{f}
          </li>
        ))}
      </ul>

      {onSelect ? (
        <button onClick={() => onSelect(plan)} className={cx('mt-6 w-full', plan.featured ? 'btn-primary' : 'btn-outline')}>
          {plan.cta}
        </button>
      ) : (
        <Link to={ctaTo || '/signup'} className={cx('mt-6 w-full', plan.featured ? 'btn-primary' : 'btn-outline')}>
          {plan.cta}
        </Link>
      )}
    </div>
  );
}

/* ---------- Feature grid ---------- */
export function FeatureGrid({ items, cols = 4, iconTone = 'brand' }) {
  return (
    <div className={cx('grid gap-4', {
      2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3',
      4: 'sm:grid-cols-2 lg:grid-cols-4'
    }[cols])}>
      {items.map((it, i) => {
        const Icon = ICONS[it.icon] || CheckIcon;
        return (
          <motion.div key={it.title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: Math.min(i * 0.04, 0.3), duration: 0.4 }}
            className="group card card-hover p-5">
            <span className={cx('grid h-10 w-10 place-items-center rounded-xl transition-colors',
              iconTone === 'brand' ? 'bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white' : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white')}>
              <Icon size={19} />
            </span>
            <h3 className="mt-3.5 text-[14.5px] font-bold text-ink-900">{it.title}</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-600">{it.desc}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

function CheckIcon(props) { return <BadgeCheck {...props} />; }

/* ---------- Popular search chip ---------- */
export function SearchChip({ label }) {
  return (
    <Link to={`/search?q=${encodeURIComponent(label)}`}
      className="group inline-flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-[13.5px] font-semibold text-ink-800 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand-400 hover:text-brand-700 hover:shadow-lift">
      <Search size={14} className="text-ink-400 transition-colors group-hover:text-brand-600" />
      {label}
      <ArrowRight size={14} className="text-ink-300 transition-all group-hover:translate-x-0.5 group-hover:text-brand-600" />
    </Link>
  );
}

/* ---------- Step / process card ---------- */
export function StepCard({ step, title, desc, Icon = ClipboardList, last = false }) {
  return (
    <div className="relative">
      {!last && (
        <span className="absolute left-[27px] top-[68px] hidden h-[calc(100%-2rem)] w-px bg-gradient-to-b from-brand-300 to-ink-100 lg:block" aria-hidden="true" />
      )}
      <div className="relative flex gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
          <Icon size={22} />
        </span>
        <div className="pt-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-brand-600">Step {step}</p>
          <h3 className="mt-1 text-[16px] font-bold text-ink-900">{title}</h3>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-600">{desc}</p>
        </div>
      </div>
    </div>
  );
}
