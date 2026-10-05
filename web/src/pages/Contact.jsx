import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail, Phone, MapPin, Clock, Loader2, Send, CheckCircle2, MessageSquare, Headset, Globe
} from 'lucide-react';
import { api } from '../lib/api';
import { cx } from '../lib/data';
import { SectionHead, Accordion } from '../components/ui';

const TOPICS = ['General enquiry', 'Listing help', 'Verification', 'Billing', 'Report a listing', 'Partnership'];

const CHANNELS = [
  { Icon: Mail, t: 'Email', v: 'hello@bizbook.in', d: 'General and listing enquiries' },
  { Icon: Phone, t: 'Phone', v: '+91 22 4000 1234', d: 'Mon–Sat, 9:30 AM – 6:30 PM IST' },
  { Icon: MessageSquare, t: 'WhatsApp', v: '+91 98250 41120', d: 'Fastest response for urgent help' },
  { Icon: MapPin, t: 'Office', v: 'Andheri East, Mumbai, Maharashtra 400069', d: 'Visits by appointment' }
];

const FAQS = [
  { q: 'How quickly will I get a reply?', a: 'We respond to every message within one business day, and usually the same working day. Verification requests are prioritised.' },
  { q: 'I listed my business but have no badge yet.', a: 'Verification usually completes within 2 business days of receiving your GSTIN and documents. If it is taking longer, message us with your listing slug.' },
  { q: 'Can I change or remove my listing?', a: 'Yes. Business owners can edit and delete their own listing from the dashboard at any time, with no notice period or fee.' },
  { q: 'Someone is using my company name incorrectly.', a: 'Report the listing from this form with the URL. We review trademark and misrepresentation claims and remove confirmed violations.' },
  { q: 'Do you offer refunds on paid plans?', a: 'Refunds are available within 7 days of a charge if fewer than 10 lead impressions have been delivered. See the Refund Policy for full terms.' },
  { q: 'Do you support international buyers?', a: 'Yes. Suppliers list their export markets and the platform is used by buyers across 25+ countries.' }
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', topic: 'General enquiry', message: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k) => (e) => {
    const v = e.target.value;
    setForm(f => ({ ...f, [k]: v }));
    setErrors(x => ({ ...x, [k]: '' }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const err = {};
    if (!form.name.trim()) err.name = 'Your name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) err.email = 'Enter a valid email';
    if (form.message.trim().length < 10) err.message = 'Please write at least 10 characters';
    setErrors(err);
    if (Object.keys(err).length) return;

    setBusy(true);
    try {
      await api.contact(form);
      setDone(true);
      setForm({ name: '', email: '', topic: 'General enquiry', message: '' });
    } catch (e2) {
      setErrors({ message: e2.message || 'Could not send your message' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <section className="relative overflow-hidden bg-ink-950">
        <div className="container-bb relative py-14 text-center sm:py-20">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl">
            <span className="eyebrow border-white/15 bg-white/10 text-brand-300">Contact</span>
            <h1 className="mt-4 text-[30px] font-extrabold leading-tight text-white sm:text-[44px]">Talk to BizBook</h1>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-white/65">
              Questions about listing, verification, billing or a partnership? Send us a message and a
              real person will reply within one business day.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container-bb py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="card p-6 sm:p-8">
              {done ? (
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="py-6 text-center">
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50">
                    <CheckCircle2 size={32} className="text-emerald-500" />
                  </span>
                  <h2 className="mt-5 text-[22px] font-extrabold text-ink-900">Message sent</h2>
                  <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-ink-600">
                    Thanks for reaching out. Our team will reply to your email within one business day.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                    <Link to="/businesses" className="btn-primary btn-md">Browse businesses</Link>
                    <button onClick={() => setDone(false)} className="btn-outline btn-md">Send another</button>
                  </div>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-[20px] font-extrabold text-ink-900">Send us a message</h2>
                  <p className="mt-1 text-[13.5px] text-ink-500">All fields marked with * are required.</p>

                  <form onSubmit={submit} className="mt-6 space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="block">
                        <span className="label">Your name *</span>
                        <input className="field" value={form.name} onChange={set('name')} placeholder="Your full name" />
                        {errors.name && <span className="mt-1 block text-[12px] font-medium text-rose-600">{errors.name}</span>}
                      </label>
                      <label className="block">
                        <span className="label">Email address *</span>
                        <input type="email" className="field" value={form.email} onChange={set('email')} placeholder="you@company.in" />
                        {errors.email && <span className="mt-1 block text-[12px] font-medium text-rose-600">{errors.email}</span>}
                      </label>
                    </div>

                    <label className="block">
                      <span className="label">What is this about?</span>
                      <select className="field" value={form.topic} onChange={set('topic')}>
                        {TOPICS.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </label>

                    <label className="block">
                      <span className="label">Message *</span>
                      <textarea className="field h-36 resize-y py-2.5" value={form.message} onChange={set('message')}
                        placeholder="Tell us what you need help with. Include your listing slug if it is about a specific business." />
                      {errors.message && <span className="mt-1 block text-[12px] font-medium text-rose-600">{errors.message}</span>}
                    </label>

                    <button type="submit" disabled={busy} className="btn-primary btn-md">
                      {busy ? <><Loader2 size={15} className="animate-spin" />Sending…</> : <><Send size={15} />Send message</>}
                    </button>
                  </form>
                </>
              )}
            </div>

            <div className="mt-10">
              <SectionHead eyebrow="FAQ" title="Answers Before You Wait" />
              <Accordion items={FAQS} defaultOpen={0} />
            </div>
          </div>

          <aside className="space-y-5">
            <div className="card p-6">
              <h2 className="flex items-center gap-2 text-[16px] font-extrabold text-ink-900">
                <Headset size={17} className="text-brand-600" />Reach us directly
              </h2>
              <ul className="mt-5 space-y-4">
                {CHANNELS.map(c => (
                  <li key={c.t} className="flex gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                      <c.Icon size={16} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold uppercase tracking-wide text-ink-400">{c.t}</p>
                      <p className="truncate text-[13.5px] font-bold text-ink-900">{c.v}</p>
                      <p className="mt-0.5 text-[12px] text-ink-500">{c.d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-ink-100 bg-ink-50/60 p-6">
              <p className="flex items-center gap-2 text-[14px] font-extrabold text-ink-900">
                <Clock size={15} />Support hours
              </p>
              <dl className="mt-3.5 space-y-2 text-[13px]">
                {[
                  ['Monday – Friday', '9:30 AM – 6:30 PM IST'],
                  ['Saturday', '10:00 AM – 4:00 PM IST'],
                  ['Sunday & public holidays', 'Closed — use the form']
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3">
                    <dt className="text-ink-500">{k}</dt>
                    <dd className="text-right font-semibold text-ink-800">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-2xl border border-ink-900 bg-ink-950 p-6 text-white">
              <Globe size={22} className="text-brand-400" />
              <p className="mt-3 text-[15px] font-extrabold">Looking for a partner?</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-white/65">
                We work with trade bodies, industry associations and SaaS platforms.
              </p>
              <a href="mailto:partnerships@bizbook.in" className="btn-primary btn-sm mt-4 w-full">
                partnerships@bizbook.in
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}