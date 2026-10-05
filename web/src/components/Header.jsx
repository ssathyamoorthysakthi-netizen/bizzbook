import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Search, MapPin, ChevronDown, LogOut, LayoutDashboard, Shield, User } from 'lucide-react';
import { cx } from '../lib/data';
import { useApp } from './AppProvider';
import { useLockBody } from '../lib/hooks';

const NAV = [
  { label: 'Find Businesses', to: '/businesses' },
  { label: 'Find Products', to: '/products' },
  { label: 'Find Services', to: '/services' },
  { label: 'For Buyers', to: '/for-buyers' },
  { label: 'For Businesses', to: '/for-businesses' },
  { label: 'Resources', to: '/resources' },
  { label: 'Pricing', to: '/pricing' }
];

const MOBILE_MORE = [
  { label: 'Jobs & Careers', to: '/jobs' },
  { label: 'Search Everything', to: '/search' },
  { label: 'Help Center', to: '/help' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact Us', to: '/contact' }
];

function Logo({ compact = false }) {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="BizBook home">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 font-display text-[17px] font-extrabold text-white shadow-sm">
        B
      </span>
      {!compact && (
        <span className="flex min-w-0 flex-col leading-none">
          <span className="font-display text-[17px] font-extrabold tracking-tight text-ink-900">BizBook</span>
          <span className="hidden truncate text-[10.5px] font-medium text-ink-500 sm:block">India&apos;s Business Marketplace</span>
        </span>
      )}
    </Link>
  );
}

function SearchStrip() {
  const { cities } = useApp();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [city, setCity] = useState('All India');
  const [open, setOpen] = useState(false);

  const go = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q.trim()) p.set('q', q.trim());
    if (city !== 'All India') p.set('city', city);
    const s = p.toString();
    navigate(s ? `/search?${s}` : '/search');
  };

  return (
    <form onSubmit={go} className="flex w-full items-center gap-2" role="search">
      <div className="relative flex min-w-0 flex-1 items-center">
        <Search size={16} className="pointer-events-none absolute left-3 shrink-0 text-ink-400" />
        <input value={q} onChange={e => setQ(e.target.value)}
          onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 160)}
          aria-label="Search businesses, products, services"
          placeholder="Search businesses, products, services..."
          className="h-10 w-full rounded-xl border border-ink-200 bg-ink-50/60 pl-9 pr-3 text-[13px] transition-colors focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
        {open && (
          <ul className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-xl border border-ink-100 bg-white p-1.5 shadow-lift">
            {NAV.slice(0, 3).map(n => (
              <li key={n.to}>
                <Link to={n.to} className="block rounded-lg px-3 py-2 text-[13px] font-medium text-ink-700 hover:bg-ink-50">{n.label}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="relative hidden shrink-0 md:block">
        <select value={city} onChange={e => setCity(e.target.value)} aria-label="Select location"
          className="h-10 appearance-none rounded-xl border border-ink-200 bg-white pl-8 pr-7 text-[13px] font-medium text-ink-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20">
          <option>All India</option>
          {cities.map(c => <option key={c.label}>{c.label}</option>)}
        </select>
        <MapPin size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-brand-600" />
        <ChevronDown size={13} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-ink-400" />
      </div>

      <button type="submit" className="btn-primary h-10 shrink-0 px-4 text-[13px]">Search</button>
    </form>
  );
}

function UserMenu() {
  const { user, logout } = useApp();
  const [open, setOpen] = useState(false);

  if (!user) {
    return (
      <div className="hidden items-center gap-1.5 lg:flex">
        <Link to="/login" className="btn-ghost btn-sm">Login</Link>
        <Link to="/signup" className="btn-outline btn-sm">Sign Up</Link>
        <Link to="/list-your-business" className="btn-primary btn-sm ml-1">List Your Business</Link>
      </div>
    );
  }

  return (
    <div className="relative hidden lg:block">
      <button onClick={() => setOpen(o => !o)} aria-haspopup="menu" aria-expanded={open}
        className="flex items-center gap-2 rounded-xl border border-ink-200 py-1.5 pl-1.5 pr-2.5 text-left transition-colors hover:border-brand-300">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-600 text-[11px] font-bold text-white">
          {(user.name || 'U').slice(0, 1).toUpperCase()}
        </span>
        <span className="max-w-[92px] truncate text-[13px] font-semibold text-ink-800">{user.name?.split(' ')[0]}</span>
        <ChevronDown size={14} className={cx('text-ink-400 transition-transform', open && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
              transition={{ duration: .15 }} role="menu"
              className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-ink-100 bg-white p-1.5 shadow-lift">
              <div className="border-b border-ink-100 px-3 py-2.5">
                <p className="truncate text-[13.5px] font-semibold text-ink-900">{user.name}</p>
                <p className="truncate text-[12px] text-ink-500">{user.email}</p>
                <span className="mt-1.5 inline-block rounded-md bg-brand-50 px-1.5 py-0.5 text-[10.5px] font-bold uppercase text-brand-700">
                  {user.isAdmin ? 'Admin' : user.role}
                </span>
              </div>
              <Link to="/dashboard" onClick={() => setOpen(false)} className="mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] font-medium text-ink-700 hover:bg-ink-50">
                <LayoutDashboard size={15} /> Business Dashboard
              </Link>
              {user.isAdmin && (
                <Link to="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] font-medium text-ink-700 hover:bg-ink-50">
                  <Shield size={15} /> Admin Console
                </Link>
              )}
              <Link to="/settings" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] font-medium text-ink-700 hover:bg-ink-50">
                <User size={15} /> Account Settings
              </Link>
              <button onClick={() => { setOpen(false); logout(); }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13.5px] font-medium text-rose-600 hover:bg-rose-50">
                <LogOut size={15} /> Sign out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const { user, logout } = useApp();
  const loc = useLocation();
  useLockBody(open);

  useEffect(() => setOpen(false), [loc.pathname]);
  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={cx('sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur transition-shadow duration-200',
      sticky ? 'border-ink-100 shadow-card' : 'border-transparent')}>
      <div className="container-bb">
        <div className="flex h-[62px] items-center gap-4 xl:gap-6">
          <Logo />

          <nav className="hidden shrink-0 items-center gap-0.5 xl:flex" aria-label="Main">
            {NAV.map(n => (
              <NavLink key={n.to} to={n.to}
                className={({ isActive }) => cx('rounded-lg px-2.5 py-2 text-[13.5px] font-semibold transition-colors',
                  isActive ? 'text-brand-700' : 'text-ink-700 hover:bg-ink-50 hover:text-ink-900')}>
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto hidden min-w-0 flex-1 max-w-[420px] lg:block">
            <SearchStrip />
          </div>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <UserMenu />
            <button onClick={() => setOpen(true)} aria-label="Open menu"
              className="grid h-10 w-10 place-items-center rounded-xl border border-ink-200 text-ink-700 transition-colors hover:border-brand-300 xl:hidden">
              <Menu size={19} />
            </button>
          </div>
        </div>

        <div className="pb-3 lg:hidden">
          <SearchStrip />
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)} className="fixed inset-0 z-[60] bg-ink-950/50 backdrop-blur-sm xl:hidden" />
            <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 34 }}
              className="fixed right-0 top-0 z-[70] flex h-full w-[min(88vw,360px)] flex-col bg-white shadow-2xl xl:hidden">
              <div className="flex h-[62px] shrink-0 items-center justify-between border-b border-ink-100 px-4">
                <Logo />
                <button onClick={() => setOpen(false)} aria-label="Close menu" className="grid h-10 w-10 place-items-center rounded-xl text-ink-600 hover:bg-ink-50">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {!user ? (
                  <div className="mb-4 grid grid-cols-2 gap-2">
                    <Link to="/login" className="btn-outline btn-sm w-full">Login</Link>
                    <Link to="/signup" className="btn-primary btn-sm w-full">Sign Up</Link>
                    <Link to="/list-your-business" className="btn-dark btn-sm col-span-2 w-full">List Your Business</Link>
                  </div>
                ) : (
                  <div className="mb-4 rounded-xl border border-ink-100 bg-ink-50/60 p-3">
                    <p className="text-[13.5px] font-semibold text-ink-900">{user.name}</p>
                    <p className="truncate text-[12px] text-ink-500">{user.email}</p>
                    <div className="mt-2.5 grid gap-2">
                      <Link to="/dashboard" className="btn-outline btn-sm w-full">Business Dashboard</Link>
                      {user.isAdmin && <Link to="/admin" className="btn-outline btn-sm w-full">Admin Console</Link>}
                    </div>
                  </div>
                )}

                <p className="mb-1.5 px-1 text-[11px] font-bold uppercase tracking-wider text-ink-400">Marketplace</p>
                <ul className="space-y-0.5">
                  {[...NAV, ...MOBILE_MORE].map(n => (
                    <li key={n.to}>
                      <NavLink to={n.to}
                        className={({ isActive }) => cx('block rounded-xl px-3 py-2.5 text-[14.5px] font-semibold transition-colors',
                          isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-800 hover:bg-ink-50')}>
                        {n.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>

              {user && (
                <div className="shrink-0 border-t border-ink-100 p-4">
                  <button onClick={() => { setOpen(false); logout(); }} className="btn-outline btn-md w-full text-rose-600">
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
