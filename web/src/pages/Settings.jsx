import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Lock, Bell, Trash2, Loader2, Check, ArrowLeft, ShieldCheck, LogOut, Download
} from 'lucide-react';
import { api, setToken } from '../lib/api';
import { cx, formatDate } from '../lib/data';
import { useApp } from '../components/AppProvider';
import { SectionHead, Avatar } from '../components/ui';

const TABS = [
  { key: 'profile', label: 'Profile', Icon: User },
  { key: 'password', label: 'Password', Icon: Lock },
  { key: 'notifications', label: 'Notifications', Icon: Bell },
  { key: 'danger', label: 'Account', Icon: Trash2 }
];

export default function Settings() {
  const { user, refreshUser, toast } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState('profile');

  const signOut = async () => {
    try { await api.auth.logout(); } catch { /* ignore */ }
    setToken(null);
    toast('Signed out');
    navigate('/');
  };

  return (
    <section className="container-bb py-8">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-500 transition-colors hover:text-brand-700">
        <ArrowLeft size={14} />Back to dashboard
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Avatar name={user.name} size="lg" />
        <div>
          <h1 className="text-[26px] font-extrabold text-ink-900">{user.name}</h1>
          <p className="text-[13.5px] text-ink-500">{user.email} · joined {formatDate(user.createdAt)}</p>
        </div>
        {user.isAdmin && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-3 py-1 text-[11.5px] font-bold text-white">
            <ShieldCheck size={12} />Administrator
          </span>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[210px_1fr]">
        <aside>
          <nav className="no-scrollbar sticky top-[86px] flex gap-1.5 overflow-x-auto rounded-2xl border border-ink-100 bg-white p-2 shadow-card lg:flex-col">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={cx('flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold transition-all',
                  tab === t.key ? 'bg-brand-600 text-white' : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900')}>
                <t.Icon size={16} /><span className="whitespace-nowrap">{t.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 max-w-2xl">
          {tab === 'profile' && <ProfileForm user={user} onSaved={async () => { await refreshUser(); toast('Profile updated'); }} />}
          {tab === 'password' && <PasswordForm toast={toast} />}
          {tab === 'notifications' && <Notifications toast={toast} />}
          {tab === 'danger' && <DangerZone user={user} onSignOut={signOut} toast={toast} />}
        </div>
      </div>
    </section>
  );
}

function ProfileForm({ user, onSaved }) {
  const [form, setForm] = useState({
    name: user.name || '', phone: user.phone || '', company: user.company || '', city: user.city || ''
  });
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setSaved(false); };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.auth.update(form);
      await onSaved();
      setSaved(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save} className="card p-6 sm:p-7">
      <SectionHead title="Profile Information" align="left" sub="Your name and contact details across BizBook." />
      <div className="space-y-5">
        <label className="block">
          <span className="label">Full name</span>
          <input className="field" value={form.name} onChange={set('name')} />
        </label>
        <label className="block">
          <span className="label">Email address</span>
          <input className="field opacity-60" value={user.email} disabled />
          <span className="mt-1 block text-[12px] text-ink-400">Contact support to change the email on your account.</span>
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="label">Phone</span>
            <input className="field" value={form.phone} onChange={set('phone')} placeholder="+91 98250 41120" />
          </label>
          <label className="block">
            <span className="label">City</span>
            <input className="field" value={form.city} onChange={set('city')} placeholder="Mumbai" />
          </label>
        </div>
        <label className="block">
          <span className="label">Company</span>
          <input className="field" value={form.company} onChange={set('company')} placeholder="Your business name" />
        </label>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <button disabled={busy} className="btn-primary btn-md">
          {busy ? <><Loader2 size={15} className="animate-spin" />Saving…</> : 'Save changes'}
        </button>
        {saved && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-emerald-600">
          <Check size={15} />Saved
        </motion.span>}
      </div>
    </form>
  );
}

function PasswordForm({ toast }) {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(x => ({ ...x, [k]: '' })); };

  const save = async (e) => {
    e.preventDefault();
    const err = {};
    if (form.next.length < 8) err.next = 'Use at least 8 characters';
    if (form.next !== form.confirm) err.confirm = 'Passwords do not match';
    setErrors(err);
    if (Object.keys(err).length) return;

    setBusy(true);
    try {
      await api.auth.changePassword({ currentPassword: form.current, password: form.next });
      toast('Password changed');
      setForm({ current: '', next: '', confirm: '' });
    } catch (e2) {
      setErrors({ current: e2.message || 'Could not change your password' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save} className="card p-6 sm:p-7">
      <SectionHead title="Change Password" align="left" sub="Use at least 8 characters you do not use elsewhere." />
      <div className="space-y-5">
        <label className="block">
          <span className="label">Current password</span>
          <input type="password" className="field" value={form.current} onChange={set('current')} />
          {errors.current && <span className="mt-1 block text-[12px] font-medium text-rose-600">{errors.current}</span>}
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="label">New password</span>
            <input type="password" className="field" value={form.next} onChange={set('next')} />
            {errors.next && <span className="mt-1 block text-[12px] font-medium text-rose-600">{errors.next}</span>}
          </label>
          <label className="block">
            <span className="label">Confirm new password</span>
            <input type="password" className="field" value={form.confirm} onChange={set('confirm')} />
            {errors.confirm && <span className="mt-1 block text-[12px] font-medium text-rose-600">{errors.confirm}</span>}
          </label>
        </div>
      </div>
      <button disabled={busy} className="btn-primary btn-md mt-6">
        {busy ? <><Loader2 size={15} className="animate-spin" />Updating…</> : 'Update password'}
      </button>
    </form>
  );
}

const PREFS = [
  { key: 'enquiries', t: 'New enquiry alerts', d: 'Email me when a buyer sends an enquiry to one of my listings.', on: true },
  { key: 'messages', t: 'Support messages', d: 'Email me when the support team replies to my contact request.', on: true },
  { key: 'digest', t: 'Weekly performance digest', d: 'A Monday summary of profile views, enquiries and lead quality.', on: false },
  { key: 'offers', t: 'Product and plan offers', d: 'Occasional announcements about new features and pricing.', on: false }
];

function Notifications({ toast }) {
  const [prefs, setPrefs] = useState(() => Object.fromEntries(PREFS.map(p => [p.key, p.on])));
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    await new Promise(r => setTimeout(r, 450));
    setBusy(false);
    toast('Notification preferences saved');
  };

  return (
    <div className="card p-6 sm:p-7">
      <SectionHead title="Notification Preferences" align="left" sub="Choose what BizBook emails you about." />
      <ul className="space-y-3">
        {PREFS.map(p => (
          <li key={p.key} className="flex items-start justify-between gap-4 rounded-xl border border-ink-100 p-4">
            <div className="min-w-0">
              <p className="text-[14px] font-bold text-ink-900">{p.t}</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-ink-600">{p.d}</p>
            </div>
            <button role="switch" aria-checked={prefs[p.key]} onClick={() => setPrefs(x => ({ ...x, [p.key]: !x[p.key] }))}
              className={cx('relative h-6 w-11 shrink-0 rounded-full transition-colors', prefs[p.key] ? 'bg-brand-600' : 'bg-ink-200')}>
              <span className={cx('absolute top-1 h-4 w-4 rounded-full bg-white transition-all', prefs[p.key] ? 'left-6' : 'left-1')} />
            </button>
          </li>
        ))}
      </ul>
      <button onClick={save} disabled={busy} className="btn-primary btn-md mt-6">
        {busy ? <><Loader2 size={15} className="animate-spin" />Saving…</> : 'Save preferences'}
      </button>
    </div>
  );
}

function DangerZone({ user, onSignOut, toast }) {
  return (
    <div className="space-y-5">
      <div className="card p-6 sm:p-7">
        <SectionHead title="Export Your Data" align="left" sub="Download a copy of your account and listing data." />
        <button onClick={() => toast('Your data export has been requested — check your email')}
          className="btn-outline btn-md">
          <Download size={15} />Request data export
        </button>
      </div>

      <div className="card border-rose-200 p-6 sm:p-7">
        <SectionHead title="Sign Out" align="left" sub="Sign out of BizBook on this device." />
        <button onClick={onSignOut} className="btn-outline btn-md">
          <LogOut size={15} />Sign out
        </button>
      </div>

      <div className="card border-rose-200 bg-rose-50/40 p-6 sm:p-7">
        <SectionHead title="Delete Account" align="left" sub="Permanent. This removes your profile, listings, products, services and enquiries." />
        <button onClick={() => {
          if (!window.confirm('Delete your BizBook account? This cannot be undone.')) return;
          toast('Account deletion requires contacting support so we can remove your listings safely');
        }} className="btn-md inline-flex items-center gap-2 rounded-xl border border-rose-300 bg-white px-4 py-2.5 text-[13.5px] font-bold text-rose-600 transition-all hover:bg-rose-50">
          <Trash2 size={15} />Delete my account
        </button>
        <p className="mt-3 text-[12.5px] text-rose-700">
          Signed in as <span className="font-bold">{user.email}</span>. Deletion is handled by our support team
          so we can remove your listings and enquiries completely.
        </p>
      </div>
    </div>
  );
}