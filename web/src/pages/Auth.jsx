import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, Building2, ShoppingBag, AlertCircle, Loader2, Check, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../components/AppProvider';
import { cx } from '../lib/data';

const DEMO = [
  { label: 'Admin demo', email: 'admin@bizbook.in', password: 'demo1234', note: 'Full admin console access' },
  { label: 'Business demo', email: 'business@demo.in', password: 'demo1234', note: 'Buyer account with saved searches' }
];

export default function Auth({ mode = 'login' }) {
  const isLogin = mode === 'login';
  const { login, signup, user } = useApp();
  const navigate = useNavigate();
  const loc = useLocation();

  const [role, setRole] = useState('buyer');
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', city: '', password: '', remember: true });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState('');

  if (user) {
    navigate('/', { replace: true });
  }

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(x => ({ ...x, [k]: '' })); setServerError(''); };

  const validate = () => {
    const e = {};
    if (!isLogin && !form.name.trim()) e.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password || form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (!isLogin && form.phone && !/^[+()\d][\d\s\-()]{6,19}$/.test(form.phone)) e.phone = 'Enter a valid phone';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setServerError('');
    if (!validate()) return;
    setBusy(true);
    try {
      if (isLogin) {
        await login({ email: form.email.trim(), password: form.password });
      } else {
        await signup({
          name: form.name.trim(), email: form.email.trim(), password: form.password,
          phone: form.phone.trim() || undefined,
          company: form.company.trim() || undefined,
          city: form.city.trim() || undefined,
          role
        });
      }
      navigate(loc.state?.from || '/dashboard', { replace: true });
    } catch (err) {
      setServerError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const fillDemo = (d) => { setForm(f => ({ ...f, email: d.email, password: d.password })); setErrors({}); setServerError(''); };

  return (
    <section className="relative overflow-hidden bg-ink-950">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-[440px] w-[440px] rounded-full bg-brand-600/25 blur-[110px]" />
        <div className="absolute bottom-0 right-0 h-[440px] w-[440px] rounded-full bg-sky-600/20 blur-[110px]" />
      </div>

      <div className="container-bb relative grid gap-10 py-12 lg:grid-cols-2 lg:gap-14 lg:py-16">
        {/* left panel */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .5 }}
          className="hidden flex-col justify-center lg:flex">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 font-display text-[19px] font-extrabold text-white">B</span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-[19px] font-extrabold text-white">BizBook</span>
              <span className="text-[11px] font-medium text-white/50">India&apos;s Business Marketplace</span>
            </span>
          </Link>

          <h2 className="mt-8 text-[32px] font-extrabold leading-tight text-white">
            {isLogin ? 'Welcome back to' : 'Join India’s'}
            <span className="block bg-gradient-to-r from-brand-400 to-amber-300 bg-clip-text text-transparent">
              {isLogin ? 'BizBook' : 'business marketplace'}
            </span>
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/60">
            {isLogin
              ? 'Sign in to reach your saved businesses, enquiries, leads and business dashboard.'
              : 'Create a free account to save suppliers, send unlimited enquiries and manage your business listings.'}
          </p>

          <ul className="mt-8 space-y-3">
            {[
              'Access 500K+ verified businesses across India',
              'Save searches and shortlist suppliers',
              'Manage listings, leads and analytics in one dashboard',
              'Free plan available forever — no card required'
            ].map(t => (
              <li key={t} className="flex items-start gap-2.5 text-[13.5px] text-white/70">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/20 text-emerald-400"><Check size={12} strokeWidth={3} /></span>
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-9 rounded-2xl border border-white/12 bg-white/[0.05] p-4 backdrop-blur">
            <p className="text-[11.5px] font-bold uppercase tracking-wider text-white/40">Demo accounts</p>
            <div className="mt-2.5 space-y-2">
              {DEMO.map(d => (
                <button key={d.email} onClick={() => fillDemo(d)} className="flex w-full items-center justify-between gap-3 rounded-lg bg-white/[0.06] px-3 py-2 text-left transition-colors hover:bg-white/[0.12]">
                  <span className="min-w-0">
                    <span className="block text-[12.5px] font-bold text-white">{d.label}</span>
                    <span className="block truncate text-[11px] text-white/45">{d.email} · {d.note}</span>
                  </span>
                  <ArrowRight size={14} className="shrink-0 text-white/40" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .1 }}
          className="rounded-3xl border border-ink-100 bg-white p-6 shadow-2xl sm:p-8">
          <Link to="/" className="mb-6 inline-flex items-center gap-2.5 lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 font-display text-[17px] font-extrabold text-white">B</span>
            <span className="font-display text-[17px] font-extrabold text-ink-900">BizBook</span>
          </Link>

          <h1 className="text-[24px] font-extrabold text-ink-900">{isLogin ? 'Sign in to BizBook' : 'Create your account'}</h1>
          <p className="mt-1.5 text-[13.5px] text-ink-500">
            {isLogin ? 'Enter your details to continue.' : 'It takes less than a minute. No credit card needed.'}
          </p>

          {!isLogin && (
            <div className="mt-6">
              <span className="label">I am</span>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'buyer', t: 'A Buyer', d: 'Source products & services', Icon: ShoppingBag },
                  { key: 'business', t: 'A Business', d: 'List & get leads', Icon: Building2 }
                ].map(o => (
                  <button key={o.key} onClick={() => setRole(o.key)}
                    className={cx('flex flex-col items-start gap-1.5 rounded-xl border-2 p-3.5 text-left transition-all',
                      role === o.key ? 'border-brand-600 bg-brand-50' : 'border-ink-200 hover:border-brand-300')}>
                    <o.Icon size={19} className={role === o.key ? 'text-brand-600' : 'text-ink-400'} />
                    <span className={cx('text-[14px] font-bold', role === o.key ? 'text-brand-700' : 'text-ink-900')}>{o.t}</span>
                    <span className="text-[11.5px] text-ink-500">{o.d}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={submit} className="mt-6 space-y-4">
            {!isLogin && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" error={errors.name}>
                  <div className="relative">
                    <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                    <input className="field pl-10" value={form.name} onChange={set('name')} placeholder="Anita Rao" autoComplete="name" />
                  </div>
                </Field>
                <Field label="Phone" error={errors.phone} hint="Optional">
                  <div className="relative">
                    <Phone size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                    <input className="field pl-10" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" autoComplete="tel" />
                  </div>
                </Field>
              </div>
            )}

            <Field label="Email address" error={errors.email}>
              <div className="relative">
                <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input type="email" className="field pl-10" value={form.email} onChange={set('email')} placeholder="you@company.com" autoComplete="email" />
              </div>
            </Field>

            {!isLogin && role === 'business' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Company name">
                  <div className="relative">
                    <Building2 size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                    <input className="field pl-10" value={form.company} onChange={set('company')} placeholder="Shreeji CNC Works" autoComplete="organization" />
                  </div>
                </Field>
                <Field label="City">
                  <input className="field" value={form.city} onChange={set('city')} placeholder="Ahmedabad" autoComplete="address-level2" />
                </Field>
              </div>
            )}

            <Field label="Password" error={errors.password}>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input type={showPass ? 'text' : 'password'} className="field pl-10 pr-11" value={form.password} onChange={set('password')}
                  placeholder="••••••••" autoComplete={isLogin ? 'current-password' : 'new-password'} />
                <button type="button" onClick={() => setShowPass(s => !s)} aria-label={showPass ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>

            {isLogin && (
              <div className="flex items-center justify-between gap-3">
                <label className="flex cursor-pointer items-center gap-2 text-[13px] text-ink-600">
                  <input type="checkbox" checked={form.remember} onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))}
                    className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500" />
                  Remember me
                </label>
                <Link to="/help" className="text-[13px] font-semibold text-brand-700 hover:underline">Forgot password?</Link>
              </div>
            )}

            {serverError && (
              <p className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-[13px] font-medium text-rose-700">
                <AlertCircle size={15} className="mt-0.5 shrink-0" />{serverError}
              </p>
            )}

            <button type="submit" disabled={busy} className="btn-primary btn-lg w-full">
              {busy ? <><Loader2 size={17} className="animate-spin" />Please wait…</>
                : <>{isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={17} /></>}
            </button>
          </form>

          <p className="mt-5 text-center text-[13px] text-ink-500">
            {isLogin ? "Don't have an account? " : 'Already registered? '}
            <Link to={isLogin ? '/signup' : '/login'} className="font-bold text-brand-700 hover:underline">
              {isLogin ? 'Create a free account' : 'Sign in'}
            </Link>
          </p>

          {!isLogin && (
            <p className="mt-4 text-center text-[11.5px] leading-relaxed text-ink-400">
              By creating an account you agree to our{' '}
              <Link to="/legal/terms" className="underline hover:text-brand-700">Terms</Link> and{' '}
              <Link to="/legal/privacy" className="underline hover:text-brand-700">Privacy Policy</Link>.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function Field({ label, error, hint, children }) {
  return (
    <label className="block">
      <span className="label">{label}{hint && <span className="ml-1 font-normal text-ink-400">({hint})</span>}</span>
      {children}
      {error && <span className="mt-1 flex items-center gap-1 text-[12px] font-medium text-rose-600"><AlertCircle size={12} />{error}</span>}
    </label>
  );
}