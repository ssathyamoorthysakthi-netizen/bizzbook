import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Building2, Package, Wrench, Target, MessageSquare, Star, BarChart3,
  CreditCard, Settings, Plus, Eye, TrendingUp, Clock, CheckCircle2, Loader2, ArrowUpRight,
  AlertCircle, Trash2, ExternalLink, Inbox, ChevronRight
} from 'lucide-react';
import { api } from '../lib/api';
import { cx, timeAgo } from '../lib/data';
import { useApp } from '../components/AppProvider';
import { Spinner, ErrorState, EmptyState, Avatar, Stars, ProgressBar, SectionHead } from '../components/ui';

const NAV = [
  { key: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { key: 'profile', label: 'Business Profile', Icon: Building2 },
  { key: 'products', label: 'Products', Icon: Package },
  { key: 'services', label: 'Services', Icon: Wrench },
  { key: 'leads', label: 'Leads', Icon: Target },
  { key: 'messages', label: 'Messages', Icon: MessageSquare },
  { key: 'reviews', label: 'Reviews', Icon: Star },
  { key: 'analytics', label: 'Analytics', Icon: BarChart3 },
  { key: 'subscription', label: 'Subscription', Icon: CreditCard },
  { key: 'settings', label: 'Settings', Icon: Settings }
];

const STATUS_COLOURS = {
  new: 'bg-sky-50 text-sky-700', contacted: 'bg-amber-50 text-amber-700',
  quoted: 'bg-violet-50 text-violet-700', closed: 'bg-emerald-50 text-emerald-700'
};

export default function Dashboard() {
  const { user, toast } = useApp();
  const [tab, setTab] = useState('dashboard');
  const [listings, setListings] = useState([]);
  const [leads, setLeads] = useState([]);
  const [sent, setSent] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true); setError(null);
    Promise.allSettled([api.myListings(), api.enquiries.received(), api.enquiries.sent(), api.stats()])
      .then(([l, r, s, st]) => {
        if (l.status === 'fulfilled') setListings(l.value.items || []);
        if (r.status === 'fulfilled') setLeads(r.value.items || []);
        if (s.status === 'fulfilled') setSent(s.value.items || []);
        if (st.status === 'fulfilled') setStats(st.value);
        const failed = [l, r, s, st].find(x => x.status === 'rejected');
        if (failed) setError(failed.reason);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const setStatus = async (id, status) => {
    setBusyId(id);
    try {
      await api.enquiries.setStatus(id, status);
      setLeads(l => l.map(x => (x.id === id ? { ...x, status } : x)));
      toast(`Enquiry marked as ${status}`);
    } catch (e) {
      toast(e.message || 'Could not update enquiry', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const removeListing = async (slug) => {
    if (!window.confirm('Delete this listing? Its products and services will be removed too.')) return;
    try {
      await api.deleteBusiness(slug);
      setListings(l => l.filter(x => x.slug !== slug));
      toast('Listing deleted');
    } catch (e) {
      toast(e.message || 'Could not delete listing', 'error');
    }
  };

  const totalViews = listings.reduce((a, b) => a + (b.views || 0), 0);
  const completion = useMemo(() => {
    if (!listings.length) return 0;
    const b = listings[0];
    let score = 0;
    const checks = [b.tagline, b.description, b.address, b.gstin, b.yearFounded, b.employees,
      b.turnover, b.certifications, b.exportMarkets, b.paymentTerms, b.phone, b.website, b.verified];
    score = checks.filter(Boolean).length / checks.length;
    return Math.round(score * 100);
  }, [listings]);

  if (loading) return <Spinner label="Loading your dashboard" />;
  if (error && !listings.length) return <div className="container-bb py-16"><ErrorState error={error} onRetry={load} /></div>;

  const Main = () => {
    if (tab === 'dashboard') return (
      <div className="space-y-7">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Profile views', value: totalViews.toLocaleString('en-IN'), Icon: Eye, tone: 'text-brand-600 bg-brand-50', delta: '+18%' },
            { label: 'Total enquiries', value: leads.length, Icon: Target, tone: 'text-emerald-600 bg-emerald-50', delta: '+9%' },
            { label: 'New leads', value: leads.filter(l => l.status === 'new').length, Icon: AlertCircle, tone: 'text-sky-600 bg-sky-50', delta: 'today' },
            { label: 'Quotes sent', value: leads.filter(l => l.status === 'quoted').length, Icon: CheckCircle2, tone: 'text-violet-600 bg-violet-50', delta: 'total' }
          ].map(m => (
            <motion.div key={m.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <span className={`grid h-10 w-10 place-items-center rounded-xl ${m.tone}`}><m.Icon size={18} /></span>
                <span className="rounded-md bg-ink-50 px-1.5 py-0.5 text-[10.5px] font-bold text-ink-500">{m.delta}</span>
              </div>
              <p className="mt-3.5 font-display text-[28px] font-extrabold leading-none text-ink-900">{m.value}</p>
              <p className="mt-1 text-[12.5px] text-ink-500">{m.label}</p>
            </motion.div>
          ))}
        </div>

        {listings.length === 0 ? (
          <EmptyState icon={Building2} title="You have not listed a business yet"
            sub="Create your free business profile to start receiving enquiries from buyers across India."
            action={<Link to="/list-your-business" className="btn-primary btn-sm mt-1">List your business</Link>} />
        ) : (
          <>
            <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
              <div className="card p-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-[16px] font-extrabold text-ink-900">Recent enquiries</h2>
                  <button onClick={() => setTab('leads')} className="text-[12.5px] font-bold text-brand-700 hover:underline">View all</button>
                </div>
                {leads.length === 0 ? (
                  <p className="py-10 text-center text-[13.5px] text-ink-500">No enquiries yet. Complete your profile to improve visibility.</p>
                ) : (
                  <ul className="mt-4 divide-y divide-ink-100">
                    {leads.slice(0, 5).map(l => (
                      <li key={l.id} className="flex items-start gap-3 py-3">
                        <Avatar name={l.name} size="sm" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13.5px] font-bold text-ink-900">{l.name}</p>
                          <p className="truncate text-[12px] text-ink-500">{l.email} · {timeAgo(l.createdAt)}</p>
                        </div>
                        <span className={cx('shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold capitalize', STATUS_COLOURS[l.status])}>{l.status}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="space-y-5">
                <div className="card p-6">
                  <h2 className="text-[16px] font-extrabold text-ink-900">Profile completion</h2>
                  <p className="mt-1 text-[12.5px] text-ink-500">{completion}% complete</p>
                  <div className="mt-4"><ProgressBar value={completion} label="Overall" /></div>
                  <Link to="/list-your-business" className="btn-outline btn-sm mt-4 w-full">Complete profile</Link>
                </div>

                <div className="card p-6">
                  <h2 className="text-[16px] font-extrabold text-ink-900">Subscription</h2>
                  <p className="mt-1 text-[12.5px] text-ink-500">Current plan</p>
                  <p className="mt-2 font-display text-[22px] font-extrabold text-ink-900">Free</p>
                  <Link to="/pricing" className="btn-primary btn-sm mt-4 w-full">Upgrade plan</Link>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-[16px] font-extrabold text-ink-900">Getting started</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { t: 'Complete your profile', d: 'Add certifications, capacity and payment terms.', to: '/list-your-business' },
                  { t: 'Add products', d: 'Listings with MOQ get far more enquiries.', to: '/products' },
                  { t: 'Add services', d: 'Show what you can do, not just what you sell.', to: '/services' },
                  { t: 'Respond fast', d: 'First reply wins most B2B enquiries.', to: '/help' }
                ].map(s => (
                  <Link key={s.t} to={s.to} className="group rounded-xl border border-ink-100 p-4 transition-all hover:border-brand-300 hover:bg-brand-50/30">
                    <p className="text-[13.5px] font-bold text-ink-900 group-hover:text-brand-700">{s.t}</p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-ink-600">{s.d}</p>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );

    if (tab === 'profile') return (
      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <SectionHead title="Your Business Profiles" align="left" />
          <Link to="/list-your-business" className="btn-primary btn-sm"><Plus size={14} />Add another</Link>
        </div>
        {listings.length === 0 ? (
          <EmptyState icon={Building2} title="No listings yet"
            action={<Link to="/list-your-business" className="btn-primary btn-sm mt-1">List your business</Link>} />
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {listings.map(b => (
              <div key={b.id} className="card p-6">
                <div className="flex items-start gap-4">
                  <Avatar name={b.name} size="lg" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-[17px] font-extrabold text-ink-900">{b.name}</h3>
                      {b.verified
                        ? <span className="badge-verified">Verified</span>
                        : <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 ring-1 ring-inset ring-amber-600/20">Pending verification</span>}
                    </div>
                    <p className="mt-1 text-[13px] text-ink-500">{b.category} · {b.city}{b.state ? `, ${b.state}` : ''}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <Stars value={b.rating} />
                      <span className="text-[12px] text-ink-400">{b.reviewCount} reviews</span>
                      <span className="inline-flex items-center gap-1 text-[12px] text-ink-500"><Eye size={12} />{b.views}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link to={`/business/${b.slug}`} className="btn-outline btn-sm">View public page <ExternalLink size={13} /></Link>
                  <button onClick={() => removeListing(b.slug)} className="btn-ghost btn-sm text-rose-600 hover:bg-rose-50"><Trash2 size={13} />Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );

    if (tab === 'leads' || tab === 'messages') {
      const rows = tab === 'leads' ? leads : sent;
      return (
        <div>
          <SectionHead title={tab === 'leads' ? 'Buyer Enquiries' : 'Enquiries You Sent'} align="left"
            sub={tab === 'leads' ? 'Enquiries received for your listings.' : 'Track enquiries you have sent to suppliers.'} />
          {rows.length === 0 ? (
            <EmptyState icon={Inbox} title={tab === 'leads' ? 'No enquiries received yet' : 'You have not sent any enquiries'}
              sub={tab === 'leads' ? 'Enquiries appear here as soon as buyers contact you.' : 'Find a supplier and send your requirement to get started.'}
              action={tab === 'leads' ? null : <Link to="/businesses" className="btn-primary btn-sm mt-1">Find suppliers</Link>} />
          ) : (
            <div className="space-y-3">
              {rows.map(l => (
                <div key={l.id} className="card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <Avatar name={l.name} size="md" />
                      <div className="min-w-0">
                        <p className="truncate text-[14.5px] font-bold text-ink-900">{l.name}</p>
                        <p className="truncate text-[12.5px] text-ink-500">{l.email}{l.phone ? ` · ${l.phone}` : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cx('rounded-md px-2 py-0.5 text-[11px] font-bold capitalize', STATUS_COLOURS[l.status])}>{l.status}</span>
                      <span className="text-[11.5px] text-ink-400">{timeAgo(l.createdAt)}</span>
                    </div>
                  </div>
                  {l.subject && <p className="mt-3 text-[13px] font-semibold text-ink-800">{l.subject}</p>}
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-600">{l.message}</p>
                  <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-3">
                    {l.business && <span className="text-[12px] text-ink-500">Regarding: <span className="font-semibold text-ink-800">{l.business.name}</span></span>}
                    {tab === 'leads' && (
                      <div className="ml-auto flex flex-wrap gap-2">
                        {['contacted', 'quoted', 'closed'].filter(s => s !== l.status).map(s => (
                          <button key={s} disabled={busyId === l.id} onClick={() => setStatus(l.id, s)}
                            className="btn-outline btn-sm capitalize">{busyId === l.id ? 'Saving…' : `Mark ${s}`}</button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (tab === 'analytics') return (
      <div>
        <SectionHead title="Analytics & Insights" align="left" sub="Understand how buyers are finding and engaging with your business." />
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="card p-6">
            <h3 className="text-[16px] font-extrabold text-ink-900">Views over time</h3>
            <div className="mt-6 flex h-52 items-end gap-2">
              {[22, 34, 28, 46, 38, 55, 48, 62, 58, 74, 68, 88, 80, 100].map((h, i) => (
                <div key={i} className="flex-1">
                  <div className="rounded-t-md bg-gradient-to-t from-brand-600/60 to-brand-400 transition-all hover:from-brand-600" style={{ height: `${h}%` }} title={`${h}`} />
                </div>
              ))}
            </div>
            <div className="mt-2.5 flex justify-between text-[11px] text-ink-400"><span>14 days ago</span><span>Today</span></div>
          </div>
          <div className="card p-6">
            <h3 className="text-[16px] font-extrabold text-ink-900">Where your enquiries come from</h3>
            <div className="mt-5 space-y-4">
              {[['Organic search', 46, 'bg-brand-500'], ['Direct profile visit', 24, 'bg-sky-500'],
                ['Category browse', 18, 'bg-emerald-500'], ['Referral', 12, 'bg-violet-500']].map(([t, p, c]) => (
                <div key={t}>
                  <div className="mb-1.5 flex items-center justify-between text-[13px]">
                    <span className="font-medium text-ink-700">{t}</span><span className="font-bold text-ink-900">{p}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-ink-100">
                    <div className={`h-full rounded-full ${c}`} style={{ width: `${p}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-6 lg:col-span-2">
            <h3 className="text-[16px] font-extrabold text-ink-900">Marketplace snapshot</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-4">
              {[['Listings', listings.length], ['Products', stats?.products ?? '—'], ['Services', stats?.services ?? '—'],
                ['Cities covered', listings.length ? new Set(listings.map(b => b.city)).size : 0]].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-ink-100 bg-ink-50/50 p-4">
                  <p className="font-display text-[24px] font-extrabold leading-none text-ink-900">{v}</p>
                  <p className="mt-1 text-[12.5px] text-ink-500">{k}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );

    if (tab === 'subscription') return (
      <div>
        <SectionHead title="Subscription" align="left" sub="Manage your plan and billing." />
        <div className="card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-wide text-ink-400">Current plan</p>
              <p className="mt-1 font-display text-[30px] font-extrabold text-ink-900">Free</p>
              <p className="mt-1 text-[13px] text-ink-500">₹0 forever · {leads.length} enquiries received</p>
            </div>
            <Link to="/pricing" className="btn-primary btn-md">Upgrade plan <ArrowUpRight size={15} /></Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {['Business Profile', 'Basic Visibility', 'Product Listing', 'Basic Enquiries'].map(f => (
              <p key={f} className="flex items-center gap-2 text-[13.5px] text-ink-700"><CheckCircle2 size={15} className="text-emerald-500" />{f}</p>
            ))}
          </div>
        </div>
      </div>
    );

    if (tab === 'reviews') return (
      <div>
        <SectionHead title="Reviews" align="left" sub="Feedback from buyers who enquired through BizBook." />
        <EmptyState icon={Star} title="No reviews yet"
          sub="Reviews appear after a buyer completes an enquiry through your BizBook profile." />
      </div>
    );

    if (tab === 'products' || tab === 'services') {
      const isP = tab === 'products';
      return (
        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <SectionHead title={isP ? 'Your Products' : 'Your Services'} align="left" />
            <Link to={isP ? '/products' : '/services'} className="btn-outline btn-sm"><Plus size={14} />Browse {isP ? 'products' : 'services'} to add</Link>
          </div>
          <EmptyState icon={isP ? Package : Wrench} title={`No ${isP ? 'products' : 'services'} added`}
            sub={`Add ${isP ? 'products with MOQ and price bands' : 'services with scope and duration'} from your dashboard to win more enquiries.`} />
        </div>
      );
    }

    if (tab === 'settings') {
      return <SettingsPanel user={user} onSaved={() => { load(); toast('Account updated'); }} />;
    }

    return null;
  };

  return (
    <section className="container-bb py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-extrabold text-ink-900 sm:text-[32px]">
            Welcome back, {user.name?.split(' ')[0]}
          </h1>
          <p className="mt-1 text-[14px] text-ink-500">Manage your listings, enquiries, leads and analytics.</p>
        </div>
        <Link to="/list-your-business" className="btn-primary btn-md"><Plus size={15} />Add business</Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[236px_1fr]">
        <aside>
          <nav className="no-scrollbar sticky top-[86px] flex gap-1.5 overflow-x-auto rounded-2xl border border-ink-100 bg-white p-2 shadow-card lg:flex-col lg:overflow-visible" aria-label="Dashboard">
            {NAV.map(n => (
              <button key={n.key} onClick={() => setTab(n.key)}
                className={cx('flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold transition-all',
                  tab === n.key ? 'bg-brand-600 text-white shadow-glow' : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900')}>
                <n.Icon size={16} /><span className="whitespace-nowrap">{n.label}</span>
                {n.key === 'leads' && leads.filter(l => l.status === 'new').length > 0 && (
                  <span className={cx('ml-auto rounded-full px-1.5 py-0.5 text-[10.5px] font-bold',
                    tab === n.key ? 'bg-white/25 text-white' : 'bg-brand-600 text-white')}>
                    {leads.filter(l => l.status === 'new').length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        <div className="min-w-0"><Main /></div>
      </div>
    </section>
  );
}

function SettingsPanel({ user, onSaved }) {
  const [form, setForm] = useState({ name: user.name, phone: user.phone || '', company: user.company || '', city: user.city || '' });
  const [busy, setBusy] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.auth.update(form);
      onSaved();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-lg">
      <SectionHead title="Account Settings" align="left" sub="Update your personal details." />
      <form onSubmit={save} className="card space-y-4 p-6">
        <label className="block"><span className="label">Full name</span>
          <input className="field" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></label>
        <label className="block"><span className="label">Phone</span>
          <input className="field" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></label>
        <label className="block"><span className="label">Company</span>
          <input className="field" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} /></label>
        <label className="block"><span className="label">City</span>
          <input className="field" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} /></label>
        <button disabled={busy} className="btn-primary btn-md">
          {busy ? <><Loader2 size={15} className="animate-spin" />Saving…</> : 'Save changes'}
        </button>
      </form>
    </div>
  );
}