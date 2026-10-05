import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';
import { useApp } from './AppProvider';
import { useLockBody } from '../lib/hooks';
import { cx } from '../lib/data';

export default function EnquiryModal({ open, onClose, business, item }) {
  const { user, toast } = useApp();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  useLockBody(open);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setDone(false);
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      subject: item ? `Enquiry: ${item.title}` : business ? `Enquiry for ${business.name}` : '',
      message: item
        ? `I would like a quotation for ${item.title}. Please share pricing, MOQ and availability.`
        : business
          ? `I am interested in your products and services. Please share your latest catalogue and pricing.`
          : ''
    });
  }, [open, user, business, item]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && open && onClose?.();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(x => ({ ...x, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) e.email = 'Enter a valid email';
    if (form.phone && !/^[+()\d][\d\s\-()]{6,19}$/.test(form.phone)) e.phone = 'Enter a valid phone';
    if (form.message.trim().length < 10) e.message = 'Add at least 10 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setBusy(true);
    try {
      await api.enquiries.create({
        businessSlug: business?.slug,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        subject: form.subject.trim() || undefined,
        message: form.message.trim()
      });
      setDone(true);
      toast(`Enquiry sent to ${business?.name || 'the supplier'}`);
      setTimeout(() => { setDone(false); onClose?.(); }, 2000);
    } catch (err) {
      toast(err.message || 'Could not send your enquiry', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 z-[80] bg-ink-950/60 backdrop-blur-sm" />
          <div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-4">
            <motion.div
              initial={{ opacity: 0, y: 28, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: .98 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              role="dialog" aria-modal="true" aria-label="Send enquiry"
              className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
              <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-ink-100 bg-white p-5">
                <div className="min-w-0">
                  <h2 className="text-[18px] font-extrabold text-ink-900">Send Enquiry</h2>
                  {business && <p className="mt-0.5 truncate text-[13px] text-ink-500">to {business.name} · {business.city}</p>}
                </div>
                <button onClick={onClose} aria-label="Close" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-ink-500 hover:bg-ink-50">
                  <X size={19} />
                </button>
              </div>

              {done ? (
                <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-50"><CheckCircle2 size={30} className="text-emerald-500" /></span>
                  <p className="text-[17px] font-bold text-ink-900">Enquiry sent successfully</p>
                  <p className="max-w-xs text-[13.5px] text-ink-500">
                    {business?.name} will receive your requirement and typically responds within one business day.
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4 p-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Your name" error={errors.name}>
                      <input className="field" value={form.name} onChange={set('name')} placeholder="Anita Rao" autoComplete="name" />
                    </Field>
                    <Field label="Email" error={errors.email}>
                      <input className="field" type="email" value={form.email} onChange={set('email')} placeholder="you@company.com" autoComplete="email" />
                    </Field>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Phone" error={errors.phone} hint="Optional">
                      <input className="field" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" autoComplete="tel" />
                    </Field>
                    <Field label="Subject">
                      <input className="field" value={form.subject} onChange={set('subject')} placeholder="Requirement for bulk order" />
                    </Field>
                  </div>
                  <Field label="Your requirement" error={errors.message}>
                    <textarea className="field h-32 resize-y py-2.5" value={form.message} onChange={set('message')}
                      placeholder="Describe quantity, specification, delivery location and timeline…" />
                  </Field>
                  <p className="text-[11.5px] leading-relaxed text-ink-500">
                    Your contact details are shared with this supplier so they can respond. We never sell your data.
                  </p>
                  <button type="submit" disabled={busy} className="btn-primary btn-md w-full">
                    {busy ? <><Loader2 size={16} className="animate-spin" /> Sending…</> : <><Send size={16} /> Send Enquiry</>}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function Field({ label, error, hint, children }) {
  return (
    <label className="block">
      <span className="label">{label}{hint && <span className="ml-1 font-normal text-ink-400">({hint})</span>}</span>
      {children}
      {error && (
        <span className="mt-1 flex items-center gap-1 text-[12px] font-medium text-rose-600">
          <AlertCircle size={12} />{error}
        </span>
      )}
    </label>
  );
}
