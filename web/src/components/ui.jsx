import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Inbox, Loader2, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { cx } from '../lib/data';

export function SectionHead({ eyebrow, title, sub, align = 'center', action }) {
  return (
    <div className={cx('mb-10 sm:mb-14', align === 'center' ? 'text-center mx-auto max-w-2xl' : 'flex flex-wrap items-end justify-between gap-4')}>
      <div className={align === 'center' ? '' : 'max-w-2xl'}>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 className="h2 mt-3">{title}</h2>
        {sub && <p className="lede">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Spinner({ label = 'Loading' }) {
  return (
    <div className="flex items-center justify-center gap-2.5 py-16 text-ink-500">
      <Loader2 size={20} className="animate-spin" />
      <span className="text-sm font-medium">{label}…</span>
    </div>
  );
}

export function SkeletonCard({ lines = 3, className }) {
  return (
    <div className={cx('card overflow-hidden', className)}>
      <div className="skeleton h-40 w-full rounded-none" />
      <div className="space-y-2.5 p-4">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="skeleton h-3" style={{ width: `${100 - i * 14}%` }} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6, lines = 3 }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} lines={lines} />)}
    </div>
  );
}

export function ErrorState({ error, onRetry, title = 'Could not load this section' }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/60 px-6 py-12 text-center">
      <AlertCircle size={30} className="text-rose-500" />
      <div>
        <p className="font-semibold text-rose-900">{title}</p>
        <p className="mt-1 text-sm text-rose-700">{error?.message || 'Please try again in a moment.'}</p>
      </div>
      {onRetry && <button onClick={onRetry} className="btn-outline btn-sm mt-1">Try again</button>}
    </div>
  );
}

export function EmptyState({ title = 'Nothing found', sub = 'Try adjusting your filters or search terms.', icon: Icon = Inbox, action }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink-200 bg-ink-50/60 px-6 py-16 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-card"><Icon size={24} className="text-ink-400" /></span>
      <div>
        <p className="font-semibold text-ink-800">{title}</p>
        <p className="mt-1 max-w-sm text-sm text-ink-500">{sub}</p>
      </div>
      {action}
    </div>
  );
}

export function Stars({ value = 0, showValue = true, size = 14 }) {
  const full = Math.round(value);
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-flex" aria-label={`${value} out of 5`}>
        {[1, 2, 3, 4, 5].map(i => (
          <svg key={i} width={size} height={size} viewBox="0 0 20 20" aria-hidden="true"
            className={i <= full ? 'fill-amber-400' : 'fill-ink-200'}>
            <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
          </svg>
        ))}
      </span>
      {showValue && <span className="text-[13px] font-semibold text-ink-800">{Number(value).toFixed(1)}</span>}
    </span>
  );
}

export function LocationChip({ city, state, className }) {
  if (!city) return null;
  return (
    <span className={cx('inline-flex items-center gap-1 text-[13px] text-ink-500', className)}>
      <MapPin size={13} className="shrink-0" />{city}{state ? `, ${state}` : ''}
    </span>
  );
}

export function VerifiedBadge({ verified, badge }) {
  if (!verified) return null;
  const map = {
    'Top Supplier': 'badge-top', Premium: 'badge-premium',
    'Top Rated': 'badge-top', Trusted: 'badge-trusted'
  };
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span className="badge-verified">
        <svg width="11" height="11" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 1l2.2 1.6 2.7-.2 1 2.5 2.2 1.5-.8 2.6.8 2.6-2.2 1.5-1 2.5-2.7-.2L10 19l-2.2-1.6-2.7.2-1-2.5L1.9 13.6l.8-2.6-.8-2.6 2.2-1.5 1-2.5 2.7.2z" />
          <path d="M8.6 13.2L6 10.6l1.1-1.1 1.5 1.5 3.7-3.7 1.1 1.1z" fill="#fff" />
        </svg>
        Verified
      </span>
      {badge && map[badge] && <span className={map[badge]}>{badge}</span>}
    </span>
  );
}

export function Avatar({ name, src, size = 'md' }) {
  const dims = { sm: 'h-9 w-9 text-[11px]', md: 'h-12 w-12 text-sm', lg: 'h-16 w-16 text-lg', xl: 'h-24 w-24 text-2xl' }[size];
  const letters = (name || 'BB').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const hue = [...(name || 'BB')].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  if (src) return <img src={src} alt={name} className={cx(dims, 'shrink-0 rounded-xl object-cover ring-1 ring-ink-100')} />;
  return (
    <span aria-hidden="true" className={cx(dims, 'grid shrink-0 place-items-center rounded-xl font-display font-bold text-white ring-1 ring-black/5')}
      style={{ background: `linear-gradient(135deg, hsl(${hue} 72% 46%), hsl(${(hue + 38) % 360} 74% 38%))` }}>
      {letters}
    </span>
  );
}

export function Pagination({ page, pages, onChange, className }) {
  if (!pages || pages < 2) return null;

  const windowed = [];
  const push = (p) => { if (!windowed.includes(p) && p >= 1 && p <= pages) windowed.push(p); };
  push(1); push(2);
  for (let p = page - 1; p <= page + 1; p++) push(p);
  push(pages - 1); push(pages);
  windowed.sort((a, b) => a - b);

  return (
    <nav className={cx('flex items-center justify-center gap-1.5', className)} aria-label="Pagination">
      <button onClick={() => onChange(page - 1)} disabled={page <= 1} className="btn-outline btn-sm" aria-label="Previous page">
        <ChevronLeft size={15} />
      </button>
      {windowed.map((p, i) => (
        <span key={p} className="flex items-center gap-1.5">
          {i > 0 && windowed[i - 1] !== p - 1 && <span className="px-1 text-ink-400">…</span>}
          <button onClick={() => onChange(p)} aria-current={p === page ? 'page' : undefined}
            className={cx('btn btn-sm h-9 w-9 px-0', p === page ? 'bg-brand-600 text-white' : 'border border-ink-200 text-ink-700 hover:border-brand-400 hover:text-brand-700')}>
            {p}
          </button>
        </span>
      ))}
      <button onClick={() => onChange(page + 1)} disabled={page >= pages} className="btn-outline btn-sm" aria-label="Next page">
        <ChevronRight size={15} />
      </button>
    </nav>
  );
}

export function RatingBreakdown({ rating, count }) {
  const bars = [5, 4, 3, 2, 1].map(star => ({ star, pct: Math.max(2, Math.round(((rating - star + 1) / 1) * 14)) }));
  return (
    <div className="flex flex-wrap items-center gap-5">
      <div className="text-center">
        <p className="font-display text-4xl font-extrabold text-ink-900">{Number(rating || 0).toFixed(1)}</p>
        <Stars value={rating} showValue={false} />
        <p className="mt-1 text-xs text-ink-500">{count || 0} reviews</p>
      </div>
      <div className="min-w-[200px] flex-1 space-y-1.5">
        {bars.map(b => (
          <div key={b.star} className="flex items-center gap-2.5 text-[12px] text-ink-500">
            <span className="w-8 shrink-0">{b.star} ★</span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-ink-100">
              <span className="block h-full rounded-full bg-amber-400" style={{ width: `${b.pct}%` }} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Carousel({ children, count }) {
  const ref = useRef(null);
  const [index, setIndex] = useState(0);
  const total = count || children?.length || 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => setIndex(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [total]);

  const scrollTo = (i) => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <div ref={ref} className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth">
        {children}
      </div>
      {total > 1 && (
        <div className="mt-5 flex justify-center gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <button key={i} onClick={() => scrollTo(i)} aria-label={`Slide ${i + 1}`}
              className={cx('h-2 rounded-full transition-all', i === index ? 'w-6 bg-brand-600' : 'w-2 bg-ink-200 hover:bg-ink-300')} />
          ))}
        </div>
      )}
    </div>
  );
}

export function Accordion({ items, defaultOpen = -1 }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100 bg-white">
      {items.map((it, i) => (
        <div key={i}>
          <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-ink-50/70">
            <span className="text-[15px] font-semibold text-ink-900">{it.q}</span>
            <span className={cx('grid h-7 w-7 shrink-0 place-items-center rounded-full border border-ink-200 text-ink-500 transition-transform', open === i && 'rotate-45 border-brand-400 text-brand-600')}>+</span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                transition={{ duration: .25, ease: 'easeInOut' }} className="overflow-hidden">
                <p className="px-5 pb-4 text-sm leading-relaxed text-ink-600">{it.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export function ProgressBar({ value, label, tone = 'brand' }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[13px]">
        <span className="font-medium text-ink-600">{label}</span>
        <span className="font-semibold text-ink-900">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-ink-100">
        <motion.div initial={{ width: 0 }} whileInView={{ width: `${value}%` }} viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={cx('h-full rounded-full', tone === 'brand' ? 'bg-brand-500' : 'bg-emerald-500')} />
      </div>
    </div>
  );
}
