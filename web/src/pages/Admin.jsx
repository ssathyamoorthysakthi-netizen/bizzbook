import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, Users, Building2, Target, MessageSquare, LayoutGrid, Search,
  BadgeCheck, Trash2, Loader2, Check, X, Mail, Inbox, UserCog, AlertTriangle, RefreshCw
} from 'lucide-react';
import { api } from '../lib/api';
import { cx, timeAgo } from '../lib/data';
import { Spinner, ErrorState, EmptyState, Avatar, SectionHead } from '../components/ui';

const TABS = [
  { key: 'overview', label: 'Overview', Icon: LayoutGrid },
  { key: 'businesses', label: 'Businesses', Icon: Building2 },
  { key: 'users', label: 'Users', Icon: Users },
  { key: 'enquiries', label: 'Enquiries', Icon: Target },
  { key: 'messages', label: 'Messages', Icon: Mail }
];

const STATUSES = ['', 'new', 'contacted', 'quoted', 'closed'];

export default function Admin() {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [users, setUsers] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [messages, setMessages] = useState([]);
  const [enqStatus, setEnqStatus] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [bizSearch, setBizSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(null);

  const load = () => {
    setLoading(true); setError(null);
    Promise.allSettled([
      api.admin.stats(), api.admin.businesses(), api.admin.users({ search: userSearch }),
      api.admin.enquiries({ status: enqStatus }), api.admin.messages()
    ]).then(([s, b, u, e, m]) => {
      if (s.status === 'fulfilled') setStats(s.value);
      if (b.status === 'fulfilled') setBusinesses(b.value.items || []);
      if (u.status === 'fulfilled') setUsers(u.value.items || []);
      if (e.status === 'fulfilled') setEnquiries(e.value.items || []);
      if (m.status === 'fulfilled') setMessages(m.value.items || []);
      const bad = [s, b, u, e, m].find(x => x.status === 'rejected');
      if (bad) setError(bad.reason);
    }).finally(() => setLoading(false));
  };

  useEffect(load, [userSearch, enqStatus]);

  const act = async (key, fn, success) => {
    setBusy(key);
    try { await fn(); toast(success); load(); }
    catch (e) { toast(e.message || 'Action failed', 'error'); }
    finally { setBusy(null); }
  };

  const toast = (msg, tone) => {
    const el = document.createElement('div');
    el.textContent = msg;
    el.className = cx(
      'fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 rounded-xl px-4 py-3 text-[13.5px] font-semibold shadow-lift',
      tone === 'error' ? 'bg-rose-600 text-white' : 'bg-ink-900 text-white');
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2600);
  };

  if (loading && !stats) return <Spinner label="Loading admin console" />;
  if (error && !stats) return <div className="container-bb py-16"><ErrorState error={error} onRetry={load} /></div>;

  const pending = businesses.filter(b => !b.verified);
  const filteredBiz = businesses.filter(b =>
    !bizSearch || `${b.name} ${b.city} ${b.category}`.toLowerCase().includes(bizSearch.toLowerCase()));
  const filteredEnq = enquiries;

  return (
    <section className="container-bb py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
            <Shield size={12} />Admin
          </span>
          <h1 className="mt-2.5 text-[26px] font-extrabold text-ink-900 sm:text-[32px]">Marketplace Console</h1>
          <p className="mt-1 text-[14px] text-ink-500">Verify listings, manage users and monitor marketplace activity.</p>
        </div>
        <button onClick={load} className="btn-outline btn-md"><RefreshCw size={15} />Refresh</button>
      </div>

      {pending.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <AlertTriangle size={19} className="shrink-0 text-amber-600" />
          <p className="text-[13.5px] text-amber-900">
            <span className="font-bold">{pending.length} listing{pending.length > 1 ? 's' : ''}</span> awaiting verification review.
          </p>
          <button onClick={() => setTab('businesses')} className="btn-outline btn-sm ml-auto border-amber-300 text-amber-800 hover:bg-amber-100">Review now</button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[210px_1fr]">
        <aside>
          <nav className="no-scrollbar sticky top-[86px] flex gap-1.5 overflow-x-auto rounded-2xl border border-ink-100 bg-white p-2 shadow-card lg:flex-col">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={cx('flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold transition-all',
                  tab === t.key ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900')}>
                <t.Icon size={16} /><span className="whitespace-nowrap">{t.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <div className="min-w-0">
          {tab === 'overview' && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { k: 'Users', v: stats?.users, Icon: Users, tone: 'text-sky-600 bg-sky-50' },
                  { k: 'Businesses', v: stats?.businesses, Icon: Building2, tone: 'text-brand-600 bg-brand-50' },
                  { k: 'Enquiries', v: stats?.enquiries, Icon: Target, tone: 'text-emerald-600 bg-emerald-50' },
                  { k: 'Messages', v: stats?.messages, Icon: MessageSquare, tone: 'text-violet-600 bg-violet-50' }
                ].map(c => (
                  <motion.div key={c.k} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
                    <span className={`grid h-10 w-10 place-items-center rounded-xl ${c.tone}`}><c.Icon size={18} /></span>
                    <p className="mt-3.5 font-display text-[28px] font-extrabold leading-none text-ink-900">{c.v ?? '—'}</p>
                    <p className="mt-1 text-[12.5px] text-ink-500">{c.k}</p>
                  </motion.div>
                ))}
              </div>

              <div className="card p-6">
                <h2 className="text-[16px] font-extrabold text-ink-900">Verification queue</h2>
                <p className="mt-1 text-[12.5px] text-ink-500">Listings are pending until you approve their documents.</p>
                {pending.length === 0 ? (
                  <p className="py-8 text-center text-[13.5px] text-ink-500">Nothing waiting. All listings are reviewed.</p>
                ) : (
                  <ul className="mt-4 divide-y divide-ink-100">
                    {pending.slice(0, 6).map(b => (
                      <li key={b.id} className="flex items-center gap-3 py-3">
                        <Avatar name={b.name} size="sm" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13.5px] font-bold text-ink-900">{b.name}</p>
                          <p className="truncate text-[12px] text-ink-500">{b.category} · {b.city}</p>
                        </div>
                        <button onClick={() => act(b.id, () => api.admin.verify(b.id, true), `${b.name} verified`)}
                          disabled={busy === b.id} className="btn-primary btn-sm">
                          {busy === b.id ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}Approve
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {tab === 'businesses' && (
            <div>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <SectionHead title="Business Listings" align="left" sub="Approve or remove listings from the marketplace." />
                <label className="relative">
                  <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input className="field pl-9 sm:w-64" value={bizSearch} onChange={e => setBizSearch(e.target.value)} placeholder="Search listings" />
                </label>
              </div>
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left text-[13px]">
                    <thead className="border-b border-ink-100 bg-ink-50/60 text-[11.5px] uppercase tracking-wide text-ink-400">
                      <tr>
                        <th className="px-4 py-3 font-bold">Business</th>
                        <th className="px-4 py-3 font-bold">Category</th>
                        <th className="px-4 py-3 font-bold">Location</th>
                        <th className="px-4 py-3 font-bold">Status</th>
                        <th className="px-4 py-3 font-bold">Views</th>
                        <th className="px-4 py-3 text-right font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-100">
                      {filteredBiz.map(b => (
                        <tr key={b.id} className="transition-colors hover:bg-ink-50/40">
                          <td className="px-4 py-3">
                            <Link to={`/business/${b.slug}`} className="font-bold text-ink-900 hover:text-brand-700">{b.name}</Link>
                            <p className="text-[11.5px] text-ink-400">Added {timeAgo(b.createdAt)}</p>
                          </td>
                          <td className="px-4 py-3 text-ink-600">{b.category || '—'}</td>
                          <td className="px-4 py-3 text-ink-600">{b.city}{b.state ? `, ${b.state}` : ''}</td>
                          <td className="px-4 py-3">
                            {b.verified
                              ? <span className="badge-verified"><BadgeCheck size={11} />Verified</span>
                              : <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 ring-1 ring-inset ring-amber-600/20">Pending</span>}
                          </td>
                          <td className="px-4 py-3 font-semibold text-ink-700">{b.views}</td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-1.5">
                              <button onClick={() => act(b.id, () => api.admin.verify(b.id, !b.verified), b.verified ? 'Verification revoked' : 'Business verified')}
                                disabled={busy === b.id} className={cx('btn-sm inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[12px] font-bold transition-all',
                                  b.verified ? 'border-ink-200 text-ink-600 hover:bg-ink-50' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50')}>
                                {busy === b.id ? <Loader2 size={12} className="animate-spin" /> : b.verified ? <X size={12} /> : <BadgeCheck size={12} />}
                                {b.verified ? 'Revoke' : 'Verify'}
                              </button>
                              <button onClick={() => window.confirm(`Delete ${b.name}? Products and services will be removed too.`) &&
                                act(b.id, () => api.admin.deleteBusiness(b.id), 'Listing deleted')}
                                className="rounded-lg border border-rose-200 px-2.5 py-1.5 text-rose-600 transition-all hover:bg-rose-50">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredBiz.length === 0 && <p className="py-8 text-center text-[13.5px] text-ink-500">No listings match your search.</p>}
              </div>
            </div>
          )}

          {tab === 'users' && (
            <div>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <SectionHead title="Users" align="left" sub="Manage roles and admin access." />
                <label className="relative">
                  <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input className="field pl-9 sm:w-64" value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search by name or email" />
                </label>
              </div>
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[680px] text-left text-[13px]">
                    <thead className="border-b border-ink-100 bg-ink-50/60 text-[11.5px] uppercase tracking-wide text-ink-400">
                      <tr>
                        <th className="px-4 py-3 font-bold">User</th>
                        <th className="px-4 py-3 font-bold">Company</th>
                        <th className="px-4 py-3 font-bold">Role</th>
                        <th className="px-4 py-3 font-bold">Joined</th>
                        <th className="px-4 py-3 text-right font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-100">
                      {users.map(u => (
                        <tr key={u.id} className="transition-colors hover:bg-ink-50/40">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <Avatar name={u.name} size="sm" />
                              <div className="min-w-0">
                                <p className="truncate font-bold text-ink-900">{u.name}</p>
                                <p className="truncate text-[11.5px] text-ink-400">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-ink-600">{u.company || '—'}</td>
                          <td className="px-4 py-3">
                            <select value={u.role} onChange={e => act(`r${u.id}`, () => api.admin.setUser(u.id, { role: e.target.value }), 'Role updated')}
                              className="rounded-lg border border-ink-200 bg-white px-2 py-1 text-[12px] font-semibold capitalize">
                              {['buyer', 'business', 'admin'].map(r => <option key={r}>{r}</option>)}
                            </select>
                          </td>
                          <td className="px-4 py-3 text-ink-500">{timeAgo(u.createdAt)}</td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-1.5">
                              <button onClick={() => act(`a${u.id}`, () => api.admin.setUser(u.id, { isAdmin: !u.isAdmin }), u.isAdmin ? 'Admin revoked' : 'Admin granted')}
                                className="rounded-lg border border-ink-200 px-2.5 py-1.5 text-[12px] font-bold text-ink-600 transition-all hover:bg-ink-50"
                                title={u.isAdmin ? 'Revoke admin' : 'Grant admin'}>
                                <UserCog size={12} />
                              </button>
                              <button onClick={() => window.confirm(`Delete ${u.name}?`) && act(`d${u.id}`, () => api.admin.deleteUser(u.id), 'User deleted')}
                                className="rounded-lg border border-rose-200 px-2.5 py-1.5 text-rose-600 transition-all hover:bg-rose-50">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {users.length === 0 && <p className="py-8 text-center text-[13.5px] text-ink-500">No users match your search.</p>}
              </div>
            </div>
          )}

          {tab === 'enquiries' && (
            <div>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <SectionHead title="Enquiries" align="left" sub="Every enquiry sent through the marketplace." />
                <div className="flex gap-1.5 rounded-xl bg-ink-100 p-1">
                  {STATUSES.map(s => (
                    <button key={s || 'all'} onClick={() => setEnqStatus(s)}
                      className={cx('rounded-lg px-3 py-1.5 text-[12.5px] font-bold capitalize transition-all',
                        enqStatus === s ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-800')}>
                      {s || 'all'}
                    </button>
                  ))}
                </div>
              </div>
              {filteredEnq.length === 0 ? (
                <EmptyState icon={Inbox} title="No enquiries" sub="Enquiries sent by buyers will appear here." />
              ) : (
                <div className="space-y-3">
                  {filteredEnq.map(e => (
                    <div key={e.id} className="card p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <Avatar name={e.name} size="md" />
                          <div className="min-w-0">
                            <p className="truncate text-[14px] font-bold text-ink-900">{e.name}</p>
                            <p className="truncate text-[12.5px] text-ink-500">{e.email}{e.phone ? ` · ${e.phone}` : ''}</p>
                            {e.business && <p className="mt-0.5 truncate text-[12px] text-ink-400">To: <span className="font-semibold text-ink-600">{e.business.name}</span></p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-ink-100 px-2 py-0.5 text-[11px] font-bold capitalize text-ink-600">{e.status}</span>
                          <span className="text-[11.5px] text-ink-400">{timeAgo(e.createdAt)}</span>
                        </div>
                      </div>
                      {e.subject && <p className="mt-3 text-[13px] font-semibold text-ink-800">{e.subject}</p>}
                      <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-600">{e.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'messages' && (
            <div>
              <SectionHead title="Contact Messages" align="left" sub="Support requests sent through the contact form." />
              {messages.length === 0 ? (
                <EmptyState icon={Mail} title="No messages" sub="Messages from the contact form will appear here." />
              ) : (
                <div className="space-y-3">
                  {messages.map(m => (
                    <div key={m.id} className="card p-5">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="text-[14px] font-bold text-ink-900">{m.name}</p>
                          <p className="text-[12.5px] text-ink-500">{m.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {m.topic && <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-700">{m.topic}</span>}
                          <span className="text-[11.5px] text-ink-400">{timeAgo(m.createdAt)}</span>
                        </div>
                      </div>
                      <p className="mt-2.5 whitespace-pre-line text-[13.5px] leading-relaxed text-ink-600">{m.message}</p>
                      <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.topic || 'BizBook enquiry')}`}
                        className="btn-outline btn-sm mt-3.5 inline-flex">Reply via email</a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}