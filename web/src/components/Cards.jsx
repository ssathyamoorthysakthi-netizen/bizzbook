import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowUpRight, Send, Eye, MessageSquare } from 'lucide-react';
import { cx, priceLabel } from '../lib/data';
import { useApp } from './AppProvider';
import { Avatar, Stars, LocationChip, VerifiedBadge } from './ui';

export function FavButton({ slug, className }) {
  const { favourites, toggleFav, toast } = useApp();
  const on = favourites.includes(slug);
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFav(slug); toast(on ? 'Removed from saved businesses' : 'Business saved to your favourites', 'info'); }}
      aria-label={on ? 'Remove from saved' : 'Save business'}
      aria-pressed={on}
      className={cx('grid h-9 w-9 place-items-center rounded-xl border backdrop-blur transition-all hover:scale-110',
        on ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-ink-100 bg-white/90 text-ink-400 hover:text-rose-500', className)}>
      <Heart size={15} className={on ? 'fill-current' : ''} />
    </button>
  );
}

function BadgeStrip({ badge }) {
  if (!badge) return null;
  const map = { 'Top Supplier': 'badge-top', Premium: 'badge-premium', 'Top Rated': 'badge-top', Trusted: 'badge-trusted' };
  return map[badge] ? <span className={map[badge]}>{badge}</span> : null;
}

export function BusinessCard({ business: b, onEnquiry }) {
  const navigate = useNavigate();
  return (
    <motion.article variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="card card-hover group flex flex-col overflow-hidden">
      <div className="flex items-start gap-3.5 p-4">
        <Avatar name={b.name} size="lg" />
        <div className="min-w-0 flex-1">
          <Link to={`/business/${b.slug}`} className="block">
            <h3 className="truncate text-[15.5px] font-bold leading-snug text-ink-900 transition-colors group-hover:text-brand-700">
              {b.name}
            </h3>
          </Link>
          <LocationChip city={b.city} state={b.state} className="mt-1" />
          <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            <Stars value={b.rating} />
            <span className="text-[12px] text-ink-400">({b.reviewCount})</span>
            <BadgeStrip badge={b.badge} />
          </div>
        </div>
        <FavButton slug={b.slug} className="relative z-10 shrink-0" />
      </div>

      <div className="px-4">
        <span className="inline-block rounded-md bg-ink-50 px-2 py-1 text-[11.5px] font-semibold text-ink-600">{b.category}</span>
        {b.tagline && <p className="mt-2.5 line-clamp-2 text-[13px] leading-relaxed text-ink-600">{b.tagline}</p>}
      </div>

      <dl className="mt-3.5 grid grid-cols-3 gap-2 border-y border-ink-100 px-4 py-2.5 text-center">
        {[
          ['Founded', b.yearFounded || '—'],
          ['Team', b.employees || '—'],
          ['Response', b.respondsIn || '—']
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-400">{k}</dt>
            <dd className="mt-0.5 truncate text-[12.5px] font-bold text-ink-800">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-auto flex items-center gap-2 p-4 pt-3.5">
        <Link to={`/business/${b.slug}`} className="btn-primary btn-sm flex-1">
          View Business <ArrowUpRight size={14} />
        </Link>
        <button onClick={() => onEnquiry ? onEnquiry(b) : navigate(`/contact?business=${b.slug}`)}
          className="btn-outline btn-sm" aria-label={`Send enquiry to ${b.name}`}>
          <Send size={14} />
        </button>
      </div>
    </motion.article>
  );
}

export function ProductCard({ product: p, onEnquiry }) {
  const navigate = useNavigate();
  const b = p.business || {};
  return (
    <motion.article variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
      whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="card card-hover group flex flex-col overflow-hidden">
      <div className="relative h-36 overflow-hidden bg-gradient-to-br from-ink-50 to-ink-100">
        <div className="absolute inset-0 grid place-items-center">
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" className="text-ink-300" aria-hidden="true">
            <path d="M3 7.5L12 3l9 4.5v9L12 21l-9-4.5v-9z" stroke="currentColor" strokeWidth="1.4" />
            <path d="M3 7.5L12 12l9-4.5M12 12v9" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </div>
        {p.stock && (
          <span className={cx('absolute left-3 top-3 rounded-md px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide',
            p.stock === 'In Stock' ? 'bg-emerald-600 text-white' : 'bg-ink-800 text-white')}>
            {p.stock}
          </span>
        )}
        {b.verified && <VerifiedBadge verified className="absolute right-3 top-3" />}
        {p.isCustom && (
          <span className="absolute bottom-3 left-3 rounded-md bg-white/95 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-brand-700 shadow-sm">
            Made to Order
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">{p.category}</span>
        <h3 className="mt-1.5 line-clamp-2 text-[15px] font-bold leading-snug text-ink-900 transition-colors group-hover:text-brand-700">
          {p.title}
        </h3>

        <Link to={`/business/${b.slug}`} className="mt-2.5 flex items-center gap-2">
          <Avatar name={b.name} size="sm" />
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-semibold text-ink-800">{b.name}</span>
            <span className="block truncate text-[11.5px] text-ink-500">{b.city}{b.state ? `, ${b.state}` : ''}</span>
          </span>
        </Link>

        <div className="mt-2.5 flex items-center gap-2">
          <Stars value={b.rating} />
          {b.respondsIn && (
            <span className="inline-flex items-center gap-1 text-[11.5px] text-ink-500"><MessageSquare size={11} />{b.respondsIn}</span>
          )}
        </div>

        <div className="mt-3.5 border-t border-ink-100 pt-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
            {p.priceMin === null ? 'Pricing' : 'Starting price'}
          </p>
          <p className="mt-0.5 text-[17px] font-extrabold text-ink-900">{priceLabel(p)}</p>
          {p.moq ? <p className="mt-0.5 text-[11.5px] text-ink-500">MOQ: {p.moq} {p.priceUnit || 'units'}</p> : null}
        </div>

        <div className="mt-3.5 flex items-center gap-2">
          <button onClick={() => onEnquiry ? onEnquiry(b, p) : navigate(`/contact?business=${b.slug}`)}
            className="btn-primary btn-sm flex-1"><Send size={14} /> Send Inquiry</button>
          <button onClick={() => navigate(`/products?q=${encodeURIComponent(p.title)}`)}
            className="btn-outline btn-sm" aria-label="View product"><Eye size={14} /></button>
        </div>
      </div>
    </motion.article>
  );
}

export function ServiceCard({ service: s, onEnquiry }) {
  const navigate = useNavigate();
  const b = s.business || {};
  return (
    <motion.article variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
      whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="card card-hover group flex flex-col p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            <path d="M14.7 6.3a4 4 0 015.6 5.6l-1.4-1.4-2.8.7.7-2.8-1.4-1.4z" strokeLinejoin="round" />
            <path d="M13.5 10.5L4.8 19.2a2 2 0 01-2.8-2.8l8.7-8.7" strokeLinecap="round" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-emerald-600">{s.category}</span>
          <h3 className="mt-1 line-clamp-2 text-[15px] font-bold leading-snug text-ink-900 transition-colors group-hover:text-brand-700">
            {s.title}
          </h3>
        </div>
      </div>

      {s.description && <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-ink-600">{s.description}</p>}

      <div className="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <Stars value={b.rating} />
        <LocationChip city={b.city} />
        {s.onSite && <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-emerald-600">On-site available</span>}
      </div>

      <Link to={`/business/${b.slug}`} className="mt-3.5 flex items-center gap-2 rounded-xl bg-ink-50/70 p-2.5 transition-colors hover:bg-ink-50">
        <Avatar name={b.name} size="sm" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-semibold text-ink-800">{b.name}</span>
          <span className="block text-[11.5px] text-ink-500">{b.verified ? 'Verified provider' : 'Service provider'}</span>
        </span>
        <VerifiedBadge verified={b.verified} />
      </Link>

      <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-ink-100 pt-3">
        <span className="min-w-0">
          <span className="block text-[11px] font-semibold uppercase tracking-wide text-ink-400">From</span>
          <span className="block text-[16px] font-extrabold text-ink-900">
            {s.priceMin === null ? 'On Request' : priceLabel(s)}
          </span>
        </span>
        <button onClick={() => onEnquiry ? onEnquiry(b, s) : navigate(`/contact?business=${b.slug}&service=${encodeURIComponent(s.title)}`)}
          className="btn-dark btn-sm shrink-0">Get Quote</button>
      </div>
    </motion.article>
  );
}
