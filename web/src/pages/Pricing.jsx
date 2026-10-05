import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Sparkles, ShieldCheck, HelpCircle, ArrowRight, Loader2, BadgeCheck, Info } from 'lucide-react';
import { PRICING_PLANS, FAQS, cx } from '../lib/data';
import { Accordion, SectionHead } from '../components/ui';
import { useApp } from '../components/AppProvider';

const COMPARE = [
  { f: 'Business profile', free: true, pro: true, prem: true },
  { f: 'Product listings', free: '5', pro: '50', prem: 'Unlimited' },
  { f: 'Service listings', free: '3', pro: '30', prem: 'Unlimited' },
  { f: 'City & category filters', free: true, pro: true, prem: true },
  { f: 'Enquiries per month', free: '10', pro: '100', prem: 'Unlimited' },
  { f: 'Featured placement', free: false, pro: true, prem: true },
  { f: 'Analytics', free: false, pro: true, prem: true },
  { f: 'Marketing tools', free: false, pro: true, prem: true },
  { f: 'Priority support', free: false, pro: false, prem: true },
  { f: 'Dedicated account manager', free: false, pro: false, prem: true }
];

const CELL = {
  true: <Check size={16} className="mx-auto text-emerald-500" strokeWidth={3} />,
  false: <span className="mx-auto block h-px w-3.5 bg-ink-300" />
};

export default function Pricing() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [yearly, setYearly] = useState(false);

  const price = (p) => {
    if (!p.price) return p.priceLabel;
    return yearly ? `₹${Math.round(p.price * 0.8).toLocaleString('en-IN')}` : p.priceLabel;
  };
  const period = (p) => (!p.price ? p.period : yearly ? '/month, billed yearly' : p.period);

  const choose = (plan) => {
    if (!plan.price) {
      navigate(user ? '/list-your-business' : '/signup');
      return;
    }
    navigate(user ? '/dashboard' : '/signup', { state: { plan: plan.name } });
  };

  return (
    <>
      <section className="relative overflow-hidden bg-ink-950">
        <div className="container-bb relative py-14 text-center sm:py-20">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl">
            <span className="eyebrow border-white/15 bg-white/10 text-brand-300">Pricing</span>
            <h1 className="mt-4 text-[30px] font-extrabold leading-tight text-white sm:text-[44px]">
              Simple Pricing That Scales With Your Business
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-white/65">
              Start free forever. Upgrade when you want featured placement, more listings and analytics
              that tell you which buyers are actually interested.
            </p>

            <div className="mt-8 inline-flex items-center gap-1 rounded-xl bg-white/10 p-1">
              {[[false, 'Monthly'], [true, 'Yearly · save 20%']].map(([v, l]) => (
                <button key={l} onClick={() => setYearly(v)}
                  className={cx('rounded-lg px-4 py-2 text-[13.5px] font-bold transition-all',
                    yearly === v ? 'bg-white text-ink-900' : 'text-white/65 hover:text-white')}>{l}</button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container-bb -mt-10 pb-4">
        <div className="grid gap-5 lg:grid-cols-3">
          {PRICING_PLANS.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .08 }}
              className={cx('card relative p-7', p.featured && 'lg:-mt-4 lg:mb-[-16px] lg:border-brand-600 lg:shadow-lift')}>
              {p.featured && (
                <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                  <Sparkles size={12} />Most popular
                </span>
              )}
              <h2 className="text-[20px] font-extrabold text-ink-900">{p.name}</h2>
              <p className="mt-1 text-[13px] text-ink-500">{p.tagline}</p>
              <div className="mt-5 flex items-end gap-1">
                <span className="font-display text-[40px] font-extrabold leading-none text-ink-900">{price(p)}</span>
                <span className="mb-1 text-[13px] text-ink-500">{period(p)}</span>
              </div>
              <button onClick={() => choose(p)} className={cx('mt-6 w-full', p.featured ? 'btn-primary btn-md' : 'btn-outline btn-md')}>
                {p.cta}
              </button>
              <ul className="mt-6 space-y-2.5 border-t border-ink-100 pt-5">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-ink-700">
                    <Check size={15} className="mt-0.5 shrink-0 text-emerald-500" strokeWidth={3} />{f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <p className="mt-6 text-center text-[12.5px] text-ink-500">
          All prices exclude GST. Cancel any time — access continues to the end of the paid period.
        </p>
      </section>

      <section className="container-bb py-14">
        <SectionHead eyebrow="Compare" title="Full Feature Comparison" />
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-[13.5px]">
              <thead className="border-b border-ink-100 bg-ink-50/60">
                <tr>
                  <th className="px-5 py-3.5 font-bold text-ink-400">Feature</th>
                  {PRICING_PLANS.map(p => (
                    <th key={p.name} className="px-5 py-3.5 text-center font-extrabold text-ink-900">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {COMPARE.map(r => (
                  <tr key={r.f} className="transition-colors hover:bg-ink-50/40">
                    <td className="px-5 py-3 font-medium text-ink-700">{r.f}</td>
                    <td className="px-5 py-3 text-center">{typeof r.free === 'boolean' ? CELL[r.free] : <span className="font-semibold text-ink-800">{r.free}</span>}</td>
                    <td className="bg-brand-50/30 px-5 py-3 text-center">{typeof r.pro === 'boolean' ? CELL[r.pro] : <span className="font-semibold text-ink-800">{r.pro}</span>}</td>
                    <td className="px-5 py-3 text-center">{typeof r.prem === 'boolean' ? CELL[r.prem] : <span className="font-semibold text-ink-800">{r.prem}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-y border-ink-100 bg-ink-50/60 py-14">
        <div className="container-bb grid gap-8 lg:grid-cols-[1fr_380px] lg:items-center">
          <div>
            <SectionHead eyebrow="Free to start" title="Listing on BizBook Is Free" align="left"
              sub="Create your business profile, add your catalogue and receive enquiries at no cost. Upgrade only when you want more visibility." />
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { Icon: BadgeCheck, t: 'Free verification', d: 'We verify GSTIN and documents on every plan, including free.' },
                { Icon: ShieldCheck, t: 'No listing fee', d: 'Profile, products and services are free to publish.' },
                { Icon: HelpCircle, t: 'Real support', d: 'Our onboarding team helps you get a complete profile.' },
                { Icon: Info, t: 'No lock-in', d: 'Delete your listing any time — no notice period.' }
              ].map(x => (
                <div key={x.t} className="flex gap-3 rounded-xl border border-ink-100 bg-white p-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600"><x.Icon size={17} /></span>
                  <div>
                    <p className="text-[13.5px] font-bold text-ink-900">{x.t}</p>
                    <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-600">{x.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-ink-900 bg-ink-950 p-8 text-white">
            <h3 className="text-[20px] font-extrabold">Need help choosing?</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-white/65">
              Tell us what industry you are in and how many enquiries you need. We will point you at the
              plan that actually fits, not the biggest one.
            </p>
            <Link to="/contact" className="btn-primary btn-md mt-5 w-full">Talk to us <ArrowRight size={15} /></Link>
            <Link to="/list-your-business" className="mt-2.5 block w-full">
              <span className="btn-outline btn-md w-full border-white/25 text-white hover:bg-white/10">Start free instead</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="container-bb py-14">
        <SectionHead eyebrow="FAQ" title="Pricing Questions, Answered" />
        <div className="mx-auto max-w-3xl">
          <Accordion items={FAQS.slice(1, 7)} defaultOpen={0} />
        </div>
      </section>
    </>
  );
}