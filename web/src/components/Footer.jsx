import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import { cx } from '../lib/data';

const COLUMNS = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Contact Us', to: '/contact' },
      { label: 'Careers', to: '/about#careers' },
      { label: 'Success Stories', to: '/resources?tag=stories' }
    ]
  },
  {
    title: 'For Buyers',
    links: [
      { label: 'Find Businesses', to: '/businesses' },
      { label: 'Find Products', to: '/products' },
      { label: 'Find Services', to: '/services' },
      { label: 'Find Suppliers', to: '/businesses?verified=1' },
      { label: 'Jobs', to: '/jobs' }
    ]
  },
  {
    title: 'For Businesses',
    links: [
      { label: 'List Your Business', to: '/list-your-business' },
      { label: 'Business Dashboard', to: '/dashboard' },
      { label: 'Advertise', to: '/pricing' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Lead Generation', to: '/for-businesses#leads' }
    ]
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', to: '/resources' },
      { label: 'Business Guides', to: '/resources' },
      { label: 'Industry Insights', to: '/resources' },
      { label: 'Help Center', to: '/help' },
      { label: 'FAQs', to: '/help#faqs' }
    ]
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/legal/privacy' },
      { label: 'Terms & Conditions', to: '/legal/terms' },
      { label: 'Refund Policy', to: '/legal/refund' },
      { label: 'Cookie Policy', to: '/legal/cookie' }
    ]
  }
];

const SOCIALS = [
  { Icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
  { Icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
  { Icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
  { Icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
  { Icon: Youtube, label: 'YouTube', href: 'https://youtube.com' }
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <footer className="border-t border-ink-100 bg-ink-50">
      {/* newsletter */}
      <div className="border-b border-ink-100 bg-white">
        <div className="container-bb flex flex-col items-center gap-5 py-9 lg:flex-row lg:justify-between">
          <div className="text-center lg:text-left">
            <h3 className="text-[19px] font-extrabold text-ink-900">Get B2B growth tips in your inbox</h3>
            <p className="mt-1 text-[13.5px] text-ink-500">Supplier ideas, sourcing guides and platform updates. No spam, unsubscribe anytime.</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); if (email.includes('@')) setSent(true); }}
            className="flex w-full max-w-md gap-2">
            <input type="email" required value={email} onChange={e => { setEmail(e.target.value); setSent(false); }}
              placeholder="you@company.com" aria-label="Email address"
              className="field flex-1" />
            <button type="submit" className="btn-primary btn-md shrink-0">
              <Send size={15} /><span className="hidden sm:inline">Subscribe</span>
            </button>
          </form>
        </div>
        {sent && <p className="pb-4 text-center text-[13px] font-semibold text-emerald-600">You&apos;re subscribed. Welcome aboard!</p>}
      </div>

      {/* link columns */}
      <div className="container-bb py-12">
        <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 font-display text-[17px] font-extrabold text-white">B</span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-[17px] font-extrabold text-ink-900">BizBook</span>
                <span className="text-[10.5px] font-medium text-ink-500">India&apos;s Business Marketplace</span>
              </span>
            </Link>
            <p className="mt-3.5 text-[13px] leading-relaxed text-ink-500">
              Connecting businesses, buyers, suppliers and service providers across India since 2019.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {SOCIALS.map(({ Icon, label, href }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer noopener" aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-ink-200 bg-white text-ink-500 transition-all hover:-translate-y-0.5 hover:border-brand-400 hover:text-brand-600">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map(col => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-[13px] font-bold uppercase tracking-wider text-ink-900">{col.title}</h3>
              <ul className="mt-3.5 space-y-2.5">
                {col.links.map(l => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-[13px] text-ink-500 transition-colors hover:text-brand-700">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* contact strip */}
      <div className="border-t border-ink-100 bg-white">
        <div className="container-bb grid gap-4 py-6 sm:grid-cols-3">
          <a href="mailto:hello@bizbook.in" className="flex items-center gap-3 text-[13px] text-ink-600 transition-colors hover:text-brand-700">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600"><Mail size={16} /></span>
            <span><span className="block text-[11px] font-semibold uppercase tracking-wide text-ink-400">Email</span>hello@bizbook.in</span>
          </a>
          <a href="tel:+9118001200120" className="flex items-center gap-3 text-[13px] text-ink-600 transition-colors hover:text-brand-700">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600"><Phone size={16} /></span>
            <span><span className="block text-[11px] font-semibold uppercase tracking-wide text-ink-400">Phone</span>1800 120 0120</span>
          </a>
          <div className="flex items-center gap-3 text-[13px] text-ink-600">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600"><MapPin size={16} /></span>
            <span><span className="block text-[11px] font-semibold uppercase tracking-wide text-ink-400">Office</span>Andheri East, Mumbai 400069</span>
          </div>
        </div>
      </div>

      <div className="border-t border-ink-100">
        <div className="container-bb flex flex-col items-center justify-between gap-3 py-5 sm:flex-row">
          <p className="text-center text-[12.5px] text-ink-500 sm:text-left">
            © 2026 BizBook. All Rights Reserved.
          </p>
          <p className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[12px] text-ink-400">
            <span>Made in India</span>
            <span>GSTIN 27AABCB1234C1ZX</span>
            <span className={cx('inline-flex items-center gap-1.5')}>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />All systems operational
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}