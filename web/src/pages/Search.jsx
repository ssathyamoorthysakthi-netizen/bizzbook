import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Building2, Package, Wrench, Globe, X, Loader2, Bell, Check } from 'lucide-react';
import { api } from '../lib/api';
import { cx } from '../lib/data';
import { useDebounced } from '../lib/hooks';
import { useApp } from '../components/AppProvider';
import { useEnquiryModal } from '../lib/enquiry';
import SearchBar from '../components/SearchBar';
import { BusinessCard, ProductCard, ServiceCard } from '../components/Cards';
import { EmptyState, SkeletonGrid, ErrorState } from '../components/ui';

const TABS = [
  { key: 'all', label: 'All', icon: Globe },
  { key: 'business', label: 'Businesses', icon: Building2 },
  { key: 'product', label: 'Products', icon: Package },
  { key: 'service', label: 'Services', icon: Wrench }
];

export default function Search() {
  const [params, setParams] = useSearchParams();
  const { user, toast } = useApp();
  const { openEnquiry } = useEnquiryModal();
  const [tab, setTab] = useState(params.get('kind') || 'all');
  const [saved, setSaved] = useState([]);
  const [saving, setSaving] = useState(false);

  const q = params.get('q') || '';
  const city = params.get('city') || 'All India';
  const dq = useDebounced(q, 320);

  const [data, setData] = useState({ businesses: [], products: [], services: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) { setSaved([]); return; }
    api.savedSearches.list().then(r => setSaved(r.items || [])).catch(() => setSaved([]));
  }, [user]);

  useEffect(() => {
    if (!dq.trim()) { setData({ businesses: [], products: [], services: [] }); setLoading(false); return; }
    let alive = true;
    const ctrl = new AbortController();
    setLoading(true); setError(null);

    Promise.all([
      api.businesses({ search: dq, city, limit: 8 }, ctrl.signal),
      api.products({ search: dq, city, limit: 8 }, ctrl.signal),
      api.services({ search: dq, city, limit: 8 }, ctrl.signal)
    ]).then(([b, p, s]) => {
      if (alive) setData({ businesses: b.items, products: p.items, services: s.items });
    }).catch(e => {
      if (alive && e.name !== 'AbortError') setError(e);
    }).finally(() => alive && setLoading(false));

    return () => { alive = false; ctrl.abort(); };
  }, [dq, city]);

  const total = data.businesses.length + data.products.length + data.services.length;

  const saveSearch = async () => {
    if (!user) { toast('Sign in to save this search', 'info'); return; }
    setSaving(true);
    try {
      const r = await api.savedSearches.save({ query: dq, city });
      setSaved(s => [{ id: r.id, query: dq, kind: 'all', city }, ...s]);
      toast('Search saved to your account');
    } catch (e) {
      toast(e.message || 'Could not save search', 'error');
    } finally {
      setSaving(false);
    }
  };

  const removeSaved = async (id) => {
    setSaved(s => s.filter(x => x.id !== id));
    try { await api.savedSearches.remove(id); } catch { /* ignore */ }
  };

  const sections = useMemo(() => ([
    tab === 'all' || tab === 'business' ? { key: 'business', title: 'Businesses', items: data.businesses, render: b => <BusinessCard business={b} onEnquiry={openEnquiry} /> } : null,
    tab === 'all' || tab === 'product' ? { key: 'product', title: 'Products', items: data.products, render: p => <ProductCard product={p} onEnquiry={openEnquiry} /> } : null,
    tab === 'all' || tab === 'service' ? { key: 'service', title: 'Services', items: data.services, render: s => <ServiceCard service={s} onEnquiry={openEnquiry} /> } : null
  ]).filter(Boolean), [tab, data, openEnquiry]);

  return (
    <>
      <section className="border-b border-ink-100 bg-ink-950">
        <div className="container-bb py-10 sm:py-12">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-[26px] font-extrabold leading-tight text-white sm:text-[34px]">
              Search Everything on BizBook
            </h1>
            <p className="mt-2.5 text-[14.5px] text-white/60">
              One search across businesses, products and services — filtered by industry and location.
            </p>
          </div>
          <div className="mx-auto mt-7 max-w-3xl">
            <SearchBar size="lg" initialQuery={q} initialCity={city} />
          </div>
        </div>
      </section>

      <section className="container-bb py-8">
        {dq && !loading && !error && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[14px] text-ink-600">
              <span className="font-bold text-ink-900">{total}</span> results for “{dq}”
              {city !== 'All India' && <> in <span className="font-bold text-ink-900">{city}</span></>}
            </p>
            <button onClick={saveSearch} disabled={saving} className="btn-outline btn-sm">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Bell size={14} />}
              Save this search
            </button>
          </div>
        )}

        <div className="mb-6 flex flex-wrap gap-2 border-b border-ink-200 pb-4">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={cx('inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[13.5px] font-bold transition-all',
                tab === t.key ? 'bg-brand-600 text-white shadow-glow' : 'border border-ink-200 bg-white text-ink-700 hover:border-brand-400 hover:text-brand-700')}>
              <t.icon size={15} />{t.label}
            </button>
          ))}
        </div>

        {error && <ErrorState error={error} />}

        {loading && <SkeletonGrid count={6} lines={4} />}

        {!loading && !error && !dq.trim() && (
          <EmptyState icon={SearchIcon} title="Start typing to search"
            sub="Try “CNC machine”, “solar panel”, “digital marketing” or a city like “Coimbatore”." />
        )}

        {!loading && !error && dq.trim() && total === 0 && (
          <EmptyState icon={SearchIcon} title={`Nothing found for “${dq}”`}
            sub="Try a broader term, remove the location filter, or browse by category instead."
            action={<Link to="/businesses" className="btn-primary btn-sm mt-1">Browse all businesses</Link>} />
        )}

        {!loading && !error && dq.trim() && total > 0 && (
          <div className="space-y-12">
            {sections.filter(s => s.items.length > 0).map(s => (
              <div key={s.key}>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-[19px] font-extrabold text-ink-900">
                    {s.title} <span className="ml-1 text-[14px] font-semibold text-ink-400">({s.items.length})</span>
                  </h2>
                  <Link to={`/${s.key === 'business' ? 'businesses' : s.key === 'product' ? 'products' : 'services'}?q=${encodeURIComponent(dq)}${city !== 'All India' ? `&city=${encodeURIComponent(city)}` : ''}`}
                    className="text-[13px] font-bold text-brand-700 hover:underline">See all {s.title.toLowerCase()}</Link>
                </div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {s.items.map(item => (
                    <div key={item.id}>{s.render(item)}</div>
                  ))}
                </motion.div>
              </div>
            ))}
          </div>
        )}

        {saved.length > 0 && (
          <div className="mt-12 border-t border-ink-200 pt-8">
            <h2 className="text-[15px] font-extrabold text-ink-900">Your saved searches</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {saved.map(s => (
                <span key={s.id} className="inline-flex items-center gap-1.5 rounded-xl border border-ink-200 bg-white px-3 py-1.5 text-[13px]">
                  <Link to={`/search?q=${encodeURIComponent(s.query)}`} className="font-semibold text-ink-800 hover:text-brand-700">{s.query}</Link>
                  {s.city && s.city !== 'All India' && <span className="text-ink-400">· {s.city}</span>}
                  <button onClick={() => removeSaved(s.id)} className="text-ink-400 hover:text-rose-600" aria-label={`Remove ${s.query}`}><X size={13} /></button>
                </span>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}