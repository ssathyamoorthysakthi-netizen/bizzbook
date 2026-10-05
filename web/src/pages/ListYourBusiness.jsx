import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Factory, MapPin, Package, Phone, ShieldCheck, ArrowRight, ArrowLeft,
  Check, Loader2, AlertCircle, FileText, Upload, Sparkles, CircleCheck
} from 'lucide-react';
import { api } from '../lib/api';
import { cx } from '../lib/data';
import { useApp } from '../components/AppProvider';

const STEPS = [
  { key: 'business', title: 'Business Information', Icon: Building2, desc: 'Tell us who you are' },
  { key: 'industry', title: 'Industry & Category', Icon: Factory, desc: 'What do you do?' },
  { key: 'location', title: 'Location', Icon: MapPin, desc: 'Where are you based?' },
  { key: 'offerings', title: 'Products & Services', Icon: Package, desc: 'What can you supply?' },
  { key: 'contact', title: 'Contact Information', Icon: Phone, desc: 'How buyers reach you' },
  { key: 'verification', title: 'Business Verification', Icon: ShieldCheck, desc: 'Documents & review' }
];

const TYPES = ['Manufacturer', 'Supplier', 'Wholesaler', 'Distributor', 'Contractor', 'Consultant', 'Service Provider'];
const STATES = ['Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi NCR', 'Gujarat', 'Haryana', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];
const CATEGORIES = ['manufacturing', 'machinery', 'electronics', 'construction', 'automotive', 'textile', 'food', 'chemical', 'agriculture', 'healthcare', 'it', 'professional', 'retail', 'logistics', 'education', 'hospitality'];

const EMPTY = {
  name: '', businessType: '', tagline: '', description: '',
  category: '', certifications: '', exportMarkets: '', paymentTerms: '',
  city: '', state: '', address: '', gstin: '', yearFounded: '', employees: '', turnover: '',
  phone: '', email: '', website: ''
};

export default function ListYourBusiness() {
  const navigate = useNavigate();
  const { categories, user, signup, login, toast } = useApp();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [authMode, setAuthMode] = useState('signup');
  const [credentials, setCredentials] = useState({ name: '', email: '', password: '' });
  const [authErrors, setAuthErrors] = useState({});
  const [created, setCreated] = useState(null);

  const catList = categories.length ? categories : CATEGORIES.map(c => ({ slug: c, name: c }));
  const set = (k) => (e) => { const v = e.target.value; setForm(f => ({ ...f, [k]: v })); setErrors(x => ({ ...x, [k]: '' })); };

  const validateStep = (i) => {
    const e = {};
    if (i === 0) {
      if (!form.name.trim()) e.name = 'Business name is required';
      if (form.yearFounded && (Number(form.yearFounded) < 1800 || Number(form.yearFounded) > 2026)) e.yearFounded = 'Enter a valid year';
      if (form.tagline && form.tagline.length > 140) e.tagline = 'Keep the tagline under 140 characters';
    }
    if (i === 1 && !form.category) e.category = 'Select a category';
    if (i === 2) {
      if (!form.city.trim()) e.city = 'City is required';
      if (!form.state) e.state = 'Select a state';
    }
    if (i === 4) {
      if (!form.phone.trim() && !form.email.trim()) e.phone = 'Provide a phone number or email';
      if (form.phone && !/^[+()\d][\d\s\-()]{6,19}$/.test(form.phone)) e.phone = 'Enter a valid phone number';
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) e.email = 'Enter a valid email';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep(step)) return;
    if (step === 4) { submit(); return; }
    setStep(s => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const back = () => { setStep(s => Math.max(0, s - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const setCred = (k) => (e) => { setCredentials(c => ({ ...c, [k]: e.target.value })); setAuthErrors(x => ({ ...x, [k]: '' })); };

  const submit = async () => {
    setBusy(true);
    try {
      let account = user;
      if (!account) {
        if (authMode === 'signup') {
          account = await signup({ name: credentials.name, email: credentials.email, password: credentials.password, role: 'business', company: form.name, city: form.city });
        } else {
          account = await login({ email: credentials.email, password: credentials.password });
        }
      }

      const payload = {
        name: form.name, category: form.category, city: form.city, state: form.state,
        businessType: form.businessType, tagline: form.tagline, description: form.description,
        address: form.address, gstin: form.gstin,
        yearFounded: form.yearFounded || undefined, employees: form.employees || undefined,
        turnover: form.turnover || undefined, certifications: form.certifications || undefined,
        exportMarkets: form.exportMarkets || undefined, paymentTerms: form.paymentTerms || undefined,
        phone: form.phone || undefined, email: form.email || undefined, website: form.website || undefined
      };
      const res = await api.createBusiness(payload);
      setCreated(res.business);
      toast('Business listing submitted for verification');
    } catch (e) {
      toast(e.message || 'Could not submit your listing', 'error');
    } finally {
      setBusy(false);
    }
  };

  const progress = ((step + (created ? 1 : 0)) / STEPS.length) * 100;

  if (created) {
    return (
      <section className="container-bb py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-xl rounded-3xl border border-ink-100 bg-white p-8 text-center shadow-lift">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50"><CircleCheck size={32} className="text-emerald-500" /></span>
          <h1 className="mt-5 text-[24px] font-extrabold text-ink-900">Listing submitted successfully</h1>
          <p className="mt-2.5 text-[14px] leading-relaxed text-ink-600">
            <span className="font-bold text-ink-900">{created.name}</span> is now live on BizBook in
            a pending state. Our verification team will review your documents and award the Verified badge
            — usually within 2 business days.
          </p>
          <div className="mt-6 rounded-xl border border-ink-100 bg-ink-50/60 p-4 text-left text-[13px]">
            <p className="font-semibold text-ink-800">What happens next</p>
            <ul className="mt-2 space-y-1.5 text-ink-600">
              <li>• Verification review of your GSTIN and business documents</li>
              <li>• Your profile becomes publicly searchable by buyers</li>
              <li>• Add products and services from your dashboard</li>
            </ul>
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to={`/business/${created.slug}`} className="btn-primary btn-md">View your profile</Link>
            <Link to="/dashboard" className="btn-outline btn-md">Go to dashboard</Link>
          </div>
        </motion.div>
      </section>
    );
  }

  const Current = STEPS[step].Icon;

  return (
    <>
      <section className="border-b border-ink-100 bg-ink-950">
        <div className="container-bb py-12">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11.5px] font-bold uppercase tracking-wider text-white/85">
              <Sparkles size={13} />Free to list
            </span>
            <h1 className="mt-4 text-[28px] font-extrabold leading-tight text-white sm:text-[38px]">
              Take Your Business Online with BizBook
            </h1>
            <p className="mx-auto mt-3.5 max-w-2xl text-[15px] leading-relaxed text-white/65">
              Create your business profile, showcase your products and services, reach new customers
              and generate quality leads — in six short steps.
            </p>
          </div>

          {/* stepper */}
          <div className="mt-10">
            <div className="relative mx-auto max-w-4xl">
              <div className="absolute left-0 right-0 top-6 hidden h-0.5 bg-white/12 lg:block" />
              <motion.div className="absolute left-0 top-6 hidden h-0.5 bg-brand-500 lg:block"
                animate={{ width: `${progress}%` }} transition={{ duration: .4 }} />
              <ol className="relative grid grid-cols-3 gap-y-6 lg:grid-cols-6">
                {STEPS.map((s, i) => {
                  const done = i < step;
                  const active = i === step;
                  return (
                    <li key={s.key} className="flex flex-col items-center text-center lg:flex-row lg:gap-2.5 lg:text-left">
                      <span className={cx('grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-2 transition-all',
                        done ? 'border-brand-500 bg-brand-600 text-white'
                          : active ? 'border-brand-500 bg-white text-brand-700'
                          : 'border-white/15 bg-ink-900 text-white/35')}>
                        {done ? <Check size={20} strokeWidth={3} /> : <s.Icon size={19} />}
                      </span>
                      <span className="mt-2 lg:mt-0">
                        <span className={cx('block text-[12.5px] font-bold', active ? 'text-white' : done ? 'text-brand-300' : 'text-white/40')}>
                          {i + 1}. {s.title}
                        </span>
                        <span className="hidden text-[11px] text-white/35 lg:block">{s.desc}</span>
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="container-bb py-10">
        <div className="mx-auto max-w-3xl">
          <div className="card p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600"><Current size={20} /></span>
              <div>
                <h2 className="text-[19px] font-extrabold text-ink-900">{STEPS[step].title}</h2>
                <p className="text-[13px] text-ink-500">Step {step + 1} of {STEPS.length} · {STEPS[step].desc}</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: .22 }}
                className="mt-7">

                {step === 0 && (
                  <div className="space-y-5">
                    <Field label="Business name" error={errors.name} required>
                      <input className="field" value={form.name} onChange={set('name')} placeholder="Shreeji CNC Works" />
                    </Field>
                    <Field label="Business type" required>
                      <div className="flex flex-wrap gap-2">
                        {TYPES.map(t => (
                          <button key={t} type="button" onClick={() => { setForm(f => ({ ...f, businessType: t })); setErrors(x => ({ ...x, category: '' })); }}
                            className={cx('rounded-xl border-2 px-3.5 py-2 text-[13px] font-semibold transition-all',
                              form.businessType === t ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-ink-200 text-ink-700 hover:border-brand-300')}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </Field>
                    <Field label="Short tagline" hint="Optional, max 140 characters" error={errors.tagline}>
                      <input className="field" value={form.tagline} onChange={set('tagline')} placeholder="Verified CNC machining partner for industrial buyers" maxLength={140} />
                    </Field>
                    <Field label="About your business" hint="Optional">
                      <textarea className="field h-28 resize-y py-2.5" value={form.description} onChange={set('description')}
                        placeholder="Tell buyers what you manufacture, your capacity, key markets and what makes you different…" />
                    </Field>
                    <div className="grid gap-5 sm:grid-cols-3">
                      <Field label="Year founded" error={errors.yearFounded}>
                        <input type="number" className="field" value={form.yearFounded} onChange={set('yearFounded')} placeholder="2008" />
                      </Field>
                      <Field label="Team size" hint="Optional">
                        <input className="field" value={form.employees} onChange={set('employees')} placeholder="45-100" />
                      </Field>
                      <Field label="Turnover" hint="Optional">
                        <input className="field" value={form.turnover} onChange={set('turnover')} placeholder="₹10 Cr - ₹25 Cr" />
                      </Field>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-5">
                    <Field label="Industry category" required error={errors.category}>
                      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                        {catList.map(c => (
                          <button key={c.slug} type="button" onClick={() => { setForm(f => ({ ...f, category: c.slug })); setErrors(x => ({ ...x, category: '' })); }}
                            className={cx('rounded-xl border-2 p-3 text-left transition-all',
                              form.category === c.slug ? 'border-brand-600 bg-brand-50' : 'border-ink-200 hover:border-brand-300')}>
                            <span className={cx('block text-[13.5px] font-bold', form.category === c.slug ? 'text-brand-700' : 'text-ink-900')}>{c.name}</span>
                          </button>
                        ))}
                      </div>
                    </Field>
                    <Field label="Certifications" hint="Optional">
                      <input className="field" value={form.certifications} onChange={set('certifications')} placeholder="ISO 9001:2015, MSME / Udyam Registered" />
                    </Field>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Export markets" hint="Optional">
                        <input className="field" value={form.exportMarkets} onChange={set('exportMarkets')} placeholder="UAE, Germany, USA" />
                      </Field>
                      <Field label="Payment terms accepted" hint="Optional">
                        <input className="field" value={form.paymentTerms} onChange={set('paymentTerms')} placeholder="Advance, LC, NEFT, UPI" />
                      </Field>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="City" required error={errors.city}>
                        <input className="field" value={form.city} onChange={set('city')} placeholder="Ahmedabad" />
                      </Field>
                      <Field label="State" required error={errors.state}>
                        <select className="field" value={form.state} onChange={set('state')}>
                          <option value="">Select state</option>
                          {STATES.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </Field>
                    </div>
                    <Field label="Full address" hint="Optional">
                      <input className="field" value={form.address} onChange={set('address')} placeholder="Plot 24, Phase II, Naroda Industrial Area" />
                    </Field>
                    <Field label="GSTIN" hint="Optional but speeds up verification">
                      <input className="field" value={form.gstin} onChange={set('gstin')} placeholder="24AABCS1234C1ZX" />
                    </Field>
                    <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-[13px] text-sky-800">
                      <strong>Why location matters:</strong> buyers filter by city, so an accurate location
                      puts you in front of local enquiries and improves your response rate.
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5">
                    <div className="rounded-xl border border-ink-100 bg-ink-50/60 p-5">
                      <h3 className="text-[14.5px] font-bold text-ink-900">You can add detailed listings after submitting</h3>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-ink-600">
                        Once your profile is live, open your dashboard to add each product and service with
                        pricing bands, MOQ, stock status and images. Listings with complete information receive
                        significantly more enquiries.
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        { Icon: Package, t: 'Products', d: 'Name, category, price band, MOQ, stock status and images.', to: '/products' },
                        { Icon: FileText, t: 'Services', d: 'Scope, duration, pricing and whether on-site work is available.', to: '/services' }
                      ].map(x => (
                        <Link key={x.t} to={x.to} className="group rounded-xl border border-ink-200 p-4 transition-all hover:border-brand-400 hover:bg-brand-50/30">
                          <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600"><x.Icon size={18} /></span>
                          <p className="mt-3 text-[14px] font-bold text-ink-900">{x.t}</p>
                          <p className="mt-1 text-[12.5px] leading-relaxed text-ink-600">{x.d}</p>
                        </Link>
                      ))}
                    </div>
                    <Field label="Anything buyers should know?" hint="Optional">
                      <textarea className="field h-24 resize-y py-2.5" value={form.tagline ? form.description || '' : ''}
                        placeholder="e.g. We accept sample orders, offer 7-day lead time and ship to 12 countries."
                        onChange={set('description')} />
                    </Field>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Phone number" error={errors.phone}>
                        <input className="field" value={form.phone} onChange={set('phone')} placeholder="+91 98250 41120" />
                      </Field>
                      <Field label="Email address" error={errors.email}>
                        <input className="field" value={form.email} onChange={set('email')} placeholder="sales@yourcompany.in" />
                      </Field>
                    </div>
                    <Field label="Website" hint="Optional">
                      <input className="field" value={form.website} onChange={set('website')} placeholder="https://yourcompany.in" />
                    </Field>

                    {!user && (
                      <div className="rounded-2xl border border-ink-200 bg-ink-50/60 p-5">
                        <p className="text-[14.5px] font-bold text-ink-900">Create an account to finish</p>
                        <p className="mt-1 text-[13px] text-ink-500">Your listing needs a BizBook account to manage enquiries and leads.</p>

                        <div className="mt-4 flex gap-1.5 rounded-xl bg-ink-100 p-1">
                          {[['signup', 'Create account'], ['login', 'I have an account']].map(([k, l]) => (
                            <button key={k} onClick={() => setAuthMode(k)}
                              className={cx('flex-1 rounded-lg py-2 text-[13px] font-bold transition-all',
                                authMode === k ? 'bg-white text-brand-700 shadow-sm' : 'text-ink-500')}>{l}</button>
                          ))}
                        </div>

                        <div className="mt-4 space-y-4">
                          {authMode === 'signup' && (
                            <Field label="Your name" error={authErrors.name} required>
                              <input className="field" value={credentials.name} onChange={setCred('name')} placeholder="Your full name" />
                            </Field>
                          )}
                          <Field label="Email" error={authErrors.email} required>
                            <input className="field" type="email" value={credentials.email} onChange={setCred('email')} placeholder="you@company.in" />
                          </Field>
                          <Field label="Password" error={authErrors.password} hint="Min 8 characters" required>
                            <input className="field" type="password" value={credentials.password} onChange={setCred('password')} placeholder="••••••••" />
                          </Field>
                        </div>
                      </div>
                    )}

                    {user && (
                      <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                        <CircleCheck size={20} className="shrink-0 text-emerald-600" />
                        <p className="text-[13px] text-emerald-800">
                          Signed in as <span className="font-bold">{user.name}</span> ({user.email}). Your listing will be linked to this account.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-5">
                    <div className="rounded-xl border border-ink-200 p-5">
                      <h3 className="text-[14.5px] font-bold text-ink-900">How verification works</h3>
                      <ol className="mt-3.5 space-y-3.5">
                        {[
                          ['Submit documents', 'Upload your GSTIN, incorporation certificate and category proof.'],
                          ['We review', 'Our team checks the documents against public records — usually within 2 business days.'],
                          ['Verified badge granted', 'Your badge appears on your profile, products and services.'],
                          ['Ongoing monitoring', 'Ratings and response times are tracked publicly for buyer trust.']
                        ].map(([t, d], i) => (
                          <li key={t} className="flex gap-3">
                            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-600 text-[12px] font-bold text-white">{i + 1}</span>
                            <div>
                              <p className="text-[13.5px] font-bold text-ink-900">{t}</p>
                              <p className="text-[12.5px] leading-relaxed text-ink-600">{d}</p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="rounded-xl border-2 border-dashed border-ink-200 p-7 text-center transition-colors hover:border-brand-400">
                      <Upload size={26} className="mx-auto text-ink-400" />
                      <p className="mt-3 text-[14px] font-bold text-ink-900">Upload documents later</p>
                      <p className="mx-auto mt-1.5 max-w-sm text-[12.5px] leading-relaxed text-ink-500">
                        You can submit your listing now and upload GSTIN, MSME or certification documents
                        from your dashboard. Uploading sooner speeds up badge approval.
                      </p>
                    </div>

                    <div className="rounded-xl bg-ink-50/70 p-4">
                      <p className="text-[12.5px] font-bold uppercase tracking-wide text-ink-400">Summary</p>
                      <dl className="mt-2.5 grid gap-2 text-[13px] sm:grid-cols-2">
                        {[
                          ['Business', form.name], ['Type', form.businessType], ['Category', catList.find(c => c.slug === form.category)?.name],
                          ['Location', [form.city, form.state].filter(Boolean).join(', ')], ['GSTIN', form.gstin || 'Not provided'],
                          ['Contact', form.phone || form.email]
                        ].map(([k, v]) => v && (
                          <div key={k} className="flex gap-2">
                            <dt className="shrink-0 text-ink-400">{k}:</dt>
                            <dd className="truncate font-semibold text-ink-800">{v}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-ink-100 pt-6">
              <button onClick={back} disabled={step === 0 || busy} className="btn-outline btn-md">
                <ArrowLeft size={15} />Back
              </button>
              <button onClick={next} disabled={busy} className="btn-primary btn-md">
                {busy ? <><Loader2 size={15} className="animate-spin" />Submitting…</>
                  : step === 5 ? <><ShieldCheck size={15} />Submit listing</> : <>Continue <ArrowRight size={15} /></>}
              </button>
            </div>
          </div>

          <p className="mt-5 text-center text-[12px] text-ink-400">
            Already listed?{' '}
            <Link to="/dashboard" className="font-semibold text-brand-700 hover:underline">Manage your business from the dashboard</Link>
          </p>
        </div>
      </section>
    </>
  );
}

function Field({ label, error, hint, required, children }) {
  return (
    <label className="block">
      <span className="label">
        {label}{required && <span className="ml-0.5 text-rose-500">*</span>}
        {hint && <span className="ml-1 font-normal text-ink-400">({hint})</span>}
      </span>
      {children}
      {error && <span className="mt-1 flex items-center gap-1 text-[12px] font-medium text-rose-600"><AlertCircle size={12} />{error}</span>}
    </label>
  );
}