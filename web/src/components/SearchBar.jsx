import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, MapPin, ChevronDown, Building2, Package, Wrench, Loader2 } from 'lucide-react';
import { cx } from '../lib/data';
import { useApp } from './AppProvider';
import { useDebounced } from '../lib/hooks';

const KINDS = [
  { key: 'all', label: 'Everything', icon: Search, to: '/search' },
  { key: 'business', label: 'Businesses', icon: Building2, to: '/businesses' },
  { key: 'product', label: 'Products', icon: Package, to: '/products' },
  { key: 'service', label: 'Services', icon: Wrench, to: '/services' }
];

function LocationSelect({ value, onChange, cities, className, id }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);

  return (
    <div ref={ref} className={cx('relative', className)}>
      <button type="button" id={id} onClick={() => setOpen(o => !o)} aria-haspopup="listbox" aria-expanded={open}
        className="flex h-11 w-full items-center gap-1.5 rounded-xl border border-ink-200 bg-white pl-3 pr-2.5 text-[13px] font-medium text-ink-700 transition-colors hover:border-brand-300">
        <MapPin size={15} className="shrink-0 text-brand-600" />
        <span className="truncate">{value || 'All India'}</span>
        <ChevronDown size={14} className={cx('ml-auto shrink-0 text-ink-400 transition-transform', open && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul initial={{ opacity: 0, y: 6, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 4, scale: .98 }}
            transition={{ duration: .14 }} role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-64 w-[min(74vw,280px)] overflow-y-auto rounded-xl border border-ink-100 bg-white p-1.5 shadow-lift">
            <li>
              <button role="option" aria-selected={value === 'All India'} onClick={() => { onChange('All India'); setOpen(false); }}
                className={cx('w-full rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-colors', value === 'All India' ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-ink-50')}>
                All India
              </button>
            </li>
            {cities.map(c => (
              <li key={c.label}>
                <button role="option" aria-selected={value === c.label} onClick={() => { onChange(c.label); setOpen(false); }}
                  className={cx('flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-[13px] transition-colors',
                    value === c.label ? 'bg-brand-50 font-semibold text-brand-700' : 'text-ink-700 hover:bg-ink-50')}>
                  <span className="truncate">{c.label}</span>
                  <span className="shrink-0 text-[11px] text-ink-400">{c.count}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SearchBar({
  size = 'md', showKinds = false, initialQuery = '', initialCity = 'All India',
  initialKind = 'all', autoFocus = false, onSearched, className
}) {
  const { cities } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const [city, setCity] = useState(initialCity);
  const [kind, setKind] = useState(initialKind);
  const [suggest, setSuggest] = useState(null);
  const [openSuggest, setOpenSuggest] = useState(false);
  const [busy, setBusy] = useState(false);
  const boxRef = useRef(null);
  const dq = useDebounced(query, 300);

  useEffect(() => { setQuery(initialQuery); }, [initialQuery]);
  useEffect(() => { setCity(initialCity); }, [initialCity]);

  useEffect(() => {
    if (dq.trim().length < 2) { setSuggest(null); return; }
    let alive = true;
    setBusy(true);
    import('../lib/api').then(({ api }) => {
      const p = api.products({ search: dq, limit: 4 });
      const s = api.services({ search: dq, limit: 4 });
      const b = api.businesses({ search: dq, limit: 4 });
      return Promise.allSettled([p, s, b]);
    }).then(([p, s, b]) => {
      if (!alive) return;
      setSuggest({
        products: p.status === 'fulfilled' ? p.value.items : [],
        services: s.status === 'fulfilled' ? s.value.items : [],
        businesses: b.status === 'fulfilled' ? b.value.items : []
      });
    }).catch(() => alive && setSuggest(null)).finally(() => alive && setBusy(false));
    return () => { alive = false; };
  }, [dq]);

  useEffect(() => {
    const onDoc = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpenSuggest(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const submit = (e, overrideKind) => {
    e?.preventDefault();
    const k = overrideKind || kind;
    const target = KINDS.find(x => x.key === k)?.to || '/search';
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (city !== 'All India') params.set('city', city);
    const qsStr = params.toString();
    setOpenSuggest(false);
    navigate(qsStr ? `${target}?${qsStr}` : target);
    onSearched?.({ query, city, kind: k });
  };

  const goItem = (to) => { setOpenSuggest(false); navigate(to); };

  const total = suggest ? suggest.products.length + suggest.services.length + suggest.businesses.length : 0;
  const big = size === 'lg';

  return (
    <div ref={boxRef} className={cx('relative w-full', className)}>
      {showKinds && (
        <div className="mb-2.5 flex flex-wrap gap-1.5" role="tablist" aria-label="Search type">
          {KINDS.map(k => (
            <button key={k.key} role="tab" aria-selected={kind === k.key} onClick={() => setKind(k.key)}
              className={cx('inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition-all',
                kind === k.key ? 'bg-white text-brand-700 shadow-sm' : 'text-white/75 hover:text-white')}>
              <k.icon size={13} />{k.label}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={submit}
        className={cx('flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-lift sm:flex-row sm:items-center',
          big && 'sm:gap-2.5 sm:p-2.5')}>
        <div className="relative flex min-w-0 flex-1 items-center">
          <Search size={big ? 20 : 18} className="pointer-events-none absolute left-3.5 shrink-0 text-ink-400" />
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setOpenSuggest(true); }}
            onFocus={() => setOpenSuggest(true)}
            autoFocus={autoFocus}
            aria-label="Search businesses, products and services"
            placeholder={big ? 'Search for products, businesses or services' : 'Search businesses, products, services...'}
            className={cx('w-full rounded-xl border border-transparent bg-ink-50/70 pl-11 pr-10 text-ink-900 placeholder:text-ink-400 transition-colors focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20',
              big ? 'h-14 text-[15px]' : 'h-11 text-sm')}
          />
          {busy && <Loader2 size={16} className="absolute right-3.5 animate-spin text-brand-500" />}
        </div>

        <LocationSelect value={city} onChange={setCity} cities={cities}
          className="sm:w-[172px] sm:shrink-0" id="bb-location" />

        <button type="submit" className={cx('btn-primary sm:shrink-0', big ? 'h-14 px-7 text-[15px]' : 'h-11 px-5 text-sm')}>
          <Search size={big ? 18 : 16} />Search
        </button>
      </form>

      <AnimatePresence>
        {openSuggest && suggest && total > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            transition={{ duration: .16 }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-[70vh] overflow-y-auto rounded-2xl border border-ink-100 bg-white p-2 shadow-lift">
            {suggest.businesses.length > 0 && (
              <div>
                <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-400">Businesses</p>
                {suggest.businesses.map(b => (
                  <button key={b.id} onClick={() => goItem(`/business/${b.slug}`)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-ink-50">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600"><Building2 size={15} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-semibold text-ink-900">{b.name}</span>
                      <span className="block truncate text-[12px] text-ink-500">{b.category} · {b.city}{b.verified ? ' · Verified' : ''}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
            {suggest.products.length > 0 && (
              <div className="mt-1 border-t border-ink-100 pt-1">
                <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-400">Products</p>
                {suggest.products.map(p => (
                  <button key={p.id} onClick={() => goItem('/products')}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-ink-50">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-sky-50 text-sky-600"><Package size={15} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-semibold text-ink-900">{p.title}</span>
                      <span className="block truncate text-[12px] text-ink-500">{p.business?.name} · {p.business?.city}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
            {suggest.services.length > 0 && (
              <div className="mt-1 border-t border-ink-100 pt-1">
                <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-400">Services</p>
                {suggest.services.map(s => (
                  <button key={s.id} onClick={() => goItem('/services')}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-ink-50">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600"><Wrench size={15} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-semibold text-ink-900">{s.title}</span>
                      <span className="block truncate text-[12px] text-ink-500">{s.business?.name} · {s.business?.city}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
            <div className="mt-1 border-t border-ink-100 pt-1">
              <Link to="/search" onClick={() => { setOpenSuggest(false); setQuery(''); }}
                className="block rounded-lg px-3 py-2 text-center text-[13px] font-semibold text-brand-700 transition-colors hover:bg-brand-50">
                See all results for “{query}”
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
