import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal, X, MapPin, Check, Package, Wrench, Building2, Search,
  ChevronDown, Loader2, LayoutGrid, LayoutList
} from 'lucide-react';
import { api } from '../lib/api';
import { cx } from '../lib/data';
import { useDebounced } from '../lib/hooks';
import { useApp } from '../components/AppProvider';
import { useEnquiryModal } from '../lib/enquiry';
import { BusinessCard, ProductCard, ServiceCard } from '../components/Cards';
import { Pagination, SkeletonGrid, EmptyState, ErrorState } from '../components/ui';

const CONFIG = {
  businesses: {
    title: 'Find Businesses', eyebrow: 'Business directory',
    lead: 'Browse verified Indian businesses with audited capacity, certifications and buyer ratings.',
    q: 'Search business names, categories or cities',
    sortOptions: [
      ['relevance', 'Most relevant'], ['rating', 'Highest rated'], ['reviews', 'Most reviewed'],
      ['newest', 'Recently added'], ['name', 'Name (A–Z)']
    ],
    Card: BusinessCard, emptyIcon: Building2, noun: 'businesses', singular: 'business'
  },
  products: {
    title: 'Find Products', eyebrow: 'Product catalogue',
    lead: 'Source from verified manufacturers with pricing bands, MOQ and live stock status.',
    q: 'Search products, suppliers or categories',
    sortOptions: [
      ['relevance', 'Most relevant'], ['price_asc', 'Price: low to high'],
      ['price_desc', 'Price: high to low'], ['newest', 'Recently listed'], ['rating', 'Supplier rating']
    ],
    Card: ProductCard, emptyIcon: Package, noun: 'products', singular: 'product'
  },
  services: {
    title: 'Find Services', eyebrow: 'Service providers',
    lead: 'Hire verified service providers for marketing, construction, logistics, IT and more.',
    q: 'Search services, providers or categories',
    sortOptions: [
      ['relevance', 'Most relevant'], ['price_asc', 'Price: low to high'],
      ['price_desc', 'Price: high to low'], ['newest', 'Recently listed'], ['rating', 'Provider rating']
    ],
    Card: ServiceCard, emptyIcon: Wrench, noun: 'services', singular: 'service'
  }
};

const BADGES = ['Top Supplier', 'Premium', 'Top Rated', 'Trusted'];
const BUSINESS_TYPES = ['Manufacturer', 'Supplier', 'Wholesaler', 'Distributor', 'Contractor', 'Consultant'];

function Facet({ label, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-ink-100 py-3.5">
      <button onClick={() => setOpen(o => !o)} className="flex w-full items-center justify-between gap-2 text-left">
        <span className="text-[13px] font-bold uppercase tracking-wide text-ink-800">{label}</span>
        <ChevronDown size={15} className={cx('shrink-0 text-ink-400 transition-transform', open && 'rotate-180')} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: .22 }} className="overflow-hidden">
            <div className="pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckRow({ checked, onChange, label, count }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-[13.5px] text-ink-700 transition-colors hover:text-brand-700">
      <span className={cx('grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] border transition-colors',
        checked ? 'border-brand-600 bg-brand-600 text-white' : 'border-ink-300 bg-white')}>
        {checked && <Check size={12} strokeWidth={3.2} />}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span className="flex-1">{label}</span>
      {count !== undefined && <span className="text-[11.5px] text-ink-400">{count}</span>}
    </label>
  );
}

export default function Directory({ kind }) {
  const cfg = CONFIG[kind];
  const { categories, cities } = useApp();
  const { openEnquiry } = useEnquiryModal();
  const [params, setParams] = useSearchParams();

  const [query, setQuery] = useState(params.get('q') || '');
  const dq = useDebounced(query, 380);
  const [drawer, setDrawer] = useState(false);
  const [view, setView] = useState('grid');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filters = {
    category: params.get('category') || '',
    city: params.get('city') || 'All India',
    verified: params.get('verified') || '',
    badge: params.get('badge') || '',
    businessType: params.get('businessType') || '',
    rating: params.get('rating') || '',
    sort: params.get('sort') || 'relevance',
    page: Number(params.get('page') || 1),
    minPrice: params.get('minPrice') || '',
    maxPrice: params.get('maxPrice') || '',
    inStock: params.get('inStock') || ''
  };

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    if (key !== 'page') next.delete('page');
    setParams(next, { replace: true });
  };

  const clearAll = () => setParams(new URLSearchParams(), { replace: true });

  const activeCount = ['category', 'city', 'verified', 'badge', 'businessType', 'rating', 'minPrice', 'maxPrice', 'inStock']
    .filter(k => filters[k]).length;

  useEffect(() => { if (dq) setFilter('q', dq); else if (params.get('q')) setFilter('q', ''); }, [dq]);

  useEffect(() => {
    let alive = true;
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);

    const payload = {
      search: params.get('q') || '',
      category: filters.category, city: filters.city,
      verified: filters.verified, badge: filters.badge,
      businessType: filters.businessType, rating: filters.rating,
      sort: filters.sort, page: filters.page, limit: 12
    };
    if (kind !== 'businesses') {
      payload.minPrice = filters.minPrice;
      payload.maxPrice = filters.maxPrice;
      payload.inStock = filters.inStock;
    }

    api[kind === 'businesses' ? 'businesses' : kind](payload, ctrl.signal)
      .then(r => { if (alive) setResult(r); })
      .catch(e => { if (alive && e.name !== 'AbortError') setError(e); })
      .finally(() => alive && setLoading(false));

    return () => { alive = false; ctrl.abort(); };
  }, [params.toString(), kind]);

  const Card = cfg.Card;

  const sidebar = (
    <div>
      <div className="flex items-center justify-between border-b border-ink-100 pb-3">
        <span className="inline-flex items-center gap-2 text-[14px] font-bold text-ink-900">
          <SlidersHorizontal size={16} /> Filters{activeCount > 0 && <span className="rounded-full bg-brand-600 px-1.5 py-0.5 text-[11px] text-white">{activeCount}</span>}
        </span>
        {activeCount > 0 && (
          <button onClick={clearAll} className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-rose-600 hover:underline">
            <X size={12} />Clear
          </button>
        )}
      </div>

      <Facet label="Category">
        <select value={filters.category} onChange={e => setFilter('category', e.target.value)} className="field">
          <option value="">All categories</option>
          {categories.map(c => <option key={c.slug} value={c.slug}>{c.name} ({c.businessCount})</option>)}
        </select>
      </Facet>

      <Facet label="Location">
        <select value={filters.city} onChange={e => setFilter('city', e.target.value)} className="field">
          <option>All India</option>
          {cities.map(c => <option key={c.label}>{c.label}</option>)}
        </select>
      </Facet>

      <Facet label="Minimum rating">
        <div className="space-y-0.5">
          {[['4.5', '4.5 & above'], ['4', '4.0 & above'], ['3', '3.0 & above']].map(([v, l]) => (
            <CheckRow key={v} label={l} checked={filters.rating === v} onChange={() => setFilter('rating', filters.rating === v ? '' : v)} />
          ))}
        </div>
      </Facet>

      <Facet label="Verification & badges">
        <div className="space-y-0.5">
          <CheckRow label="Verified only" checked={filters.verified === '1'} onChange={() => setFilter('verified', filters.verified === '1' ? '' : '1')} />
          {BADGES.map(b => (
            <CheckRow key={b} label={b} checked={filters.badge === b} onChange={() => setFilter('badge', filters.badge === b ? '' : b)} />
          ))}
        </div>
      </Facet>

      {kind === 'businesses' ? (
        <Facet label="Business type">
          <div className="space-y-0.5">
            {BUSINESS_TYPES.map(t => (
              <CheckRow key={t} label={t} checked={filters.businessType === t} onChange={() => setFilter('businessType', filters.businessType === t ? '' : t)} />
            ))}
          </div>
        </Facet>
      ) : (
        <>
          <Facet label="Price range (₹)">
            <div className="grid grid-cols-2 gap-2">
              <input type="number" min="0" value={filters.minPrice} onChange={e => setFilter('minPrice', e.target.value)}
                placeholder="Min" className="field" aria-label="Minimum price" />
              <input type="number" min="0" value={filters.maxPrice} onChange={e => setFilter('maxPrice', e.target.value)}
                placeholder="Max" className="field" aria-label="Maximum price" />
            </div>
          </Facet>
          {kind === 'products' && (
            <Facet label="Availability">
              <div className="space-y-0.5">
                <CheckRow label="In stock only" checked={filters.inStock === '1'} onChange={() => setFilter('inStock', filters.inStock === '1' ? '' : '1')} />
              </div>
            </Facet>
          )}
        </>
      )}
    </div>
  );

  return (
    <>
      {/* header */}
      <section className="border-b border-ink-100 bg-ink-50/70">
        <div className="container-bb py-10 sm:py-12">
          <nav className="mb-4 flex items-center gap-1.5 text-[12.5px] text-ink-500" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-brand-700">Home</Link>
            <span>/</span>
            <span className="font-semibold text-ink-800">{cfg.title}</span>
          </nav>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">{cfg.eyebrow}</span>
              <h1 className="mt-2.5 text-[28px] font-extrabold leading-tight text-ink-900 sm:text-[36px]">{cfg.title}</h1>
              <p className="mt-2 max-w-2xl text-[14.5px] text-ink-600">{cfg.lead}</p>
            </div>
            {result && (
              <div className="rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-center shadow-card">
                <p className="font-display text-[22px] font-extrabold leading-none text-ink-900">{result.total.toLocaleString('en-IN')}</p>
                <p className="mt-0.5 text-[11.5px] text-ink-500">{cfg.noun} found</p>
              </div>
            )}
          </div>

          <div className="relative mt-6">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder={cfg.q} aria-label={cfg.q}
              className="h-13 w-full rounded-2xl border border-ink-200 bg-white pl-12 pr-4 text-[15px] shadow-card transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
          </div>
        </div>
      </section>

      <section className="container-bb py-8">
        <div className="grid gap-8 lg:grid-cols-[264px_1fr]">
          {/* desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-[86px] max-h-[calc(100vh-110px)] overflow-y-auto rounded-2xl border border-ink-100 bg-white p-4 pr-3 shadow-card">
              {sidebar}
            </div>
          </aside>

          <div className="min-w-0">
            {/* toolbar */}
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <button onClick={() => setDrawer(true)} className="btn-outline btn-sm lg:hidden">
                <SlidersHorizontal size={14} />Filters{activeCount > 0 && ` (${activeCount})`}
              </button>
              <div className="ml-auto flex items-center gap-2">
                <label className="hidden text-[12.5px] font-medium text-ink-500 sm:block">Sort</label>
                <select value={filters.sort} onChange={e => setFilter('sort', e.target.value)} className="field h-9 w-auto py-0 pr-8 text-[13px]">
                  {cfg.sortOptions.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
                <div className="hidden items-center rounded-xl border border-ink-200 sm:flex">
                  {[['grid', LayoutGrid], ['list', LayoutList]].map(([v, Icon]) => (
                    <button key={v} onClick={() => setView(v)} aria-label={`${v} view`}
                      className={cx('grid h-9 w-9 place-items-center transition-colors', view === v ? 'bg-brand-600 text-white' : 'text-ink-500 hover:bg-ink-50')}>
                      <Icon size={15} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* active chips */}
            {activeCount > 0 && (
              <div className="mb-5 flex flex-wrap gap-2">
                {[['category', filters.category], ['city', filters.city], ['verified', filters.verified === '1' ? 'Verified' : ''],
                ['badge', filters.badge], ['businessType', filters.businessType],
                ['rating', filters.rating ? `${filters.rating}★ & up` : ''], ['inStock', filters.inStock === '1' ? 'In stock' : '']]
                  .filter(([, v]) => v).map(([k, v]) => (
                    <button key={k} onClick={() => setFilter(k, '')} className="chip chip-active">
                      {v}<X size={12} />
                    </button>
                  ))}
              </div>
            )}

            {/* results */}
            {loading && <SkeletonGrid count={6} lines={4} />}

            {!loading && error && <ErrorState error={error} onRetry={() => setFilter('page', '')} />}

            {!loading && !error && result?.items?.length === 0 && (
              <EmptyState icon={cfg.emptyIcon} title={`No ${cfg.noun} match your search`}
                sub="Try removing a filter, widening the location, or searching a different term."
                action={activeCount > 0 ? <button onClick={clearAll} className="btn-outline btn-sm mt-1">Clear all filters</button> : null} />
            )}

            {!loading && !error && result?.items?.length > 0 && (
              <>
                <motion.div layout className={view === 'grid'
                  ? 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3'
                  : 'flex flex-col gap-4'}>
                  {result.items.map(item => (
                    <Card key={item.id} {...{[kind === 'businesses' ? 'business' : kind.slice(0, -1)]: item}} onEnquiry={openEnquiry} />
                  ))}
                </motion.div>
                <Pagination page={result.page} pages={result.pages} onChange={p => {
                  setFilter('page', p);
                  window.scrollTo({ top: 260, behavior: 'smooth' });
                }} className="mt-10" />
              </>
            )}
          </div>
        </div>
      </section>

      {/* mobile drawer */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDrawer(false)} className="fixed inset-0 z-[80] bg-ink-950/55 backdrop-blur-sm lg:hidden" />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 340, damping: 34 }}
              className="fixed inset-x-0 bottom-0 z-[90] flex max-h-[86vh] flex-col rounded-t-3xl bg-white shadow-2xl lg:hidden">
              <div className="flex shrink-0 items-center justify-between border-b border-ink-100 p-4">
                <p className="text-[16px] font-extrabold text-ink-900">Filters</p>
                <button onClick={() => setDrawer(false)} aria-label="Close filters" className="grid h-9 w-9 place-items-center rounded-xl text-ink-500 hover:bg-ink-50">
                  <X size={19} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-1">{sidebar}</div>
              <div className="shrink-0 border-t border-ink-100 p-4">
                <button onClick={() => setDrawer(false)} className="btn-primary btn-md w-full">
                  Show {result ? result.total : 'results'} {cfg.noun}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}