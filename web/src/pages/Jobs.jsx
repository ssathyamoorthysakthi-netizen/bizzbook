import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase, MapPin, Clock, Search, GraduationCap, Building2, Send, Banknote,
  Wifi, Filter, Sparkles, Users, Globe
} from 'lucide-react';
import { JOBS, JOB_TYPES, cx } from '../lib/data';
import { SectionHead, EmptyState, Stars } from '../components/ui';

const MODE_TONE = {
  Onsite: 'bg-amber-50 text-amber-700',
  Hybrid: 'bg-sky-50 text-sky-700',
  Remote: 'bg-emerald-50 text-emerald-700'
};

const TYPE_TONE = {
  'Full Time': 'bg-brand-50 text-brand-700',
  Contract: 'bg-violet-50 text-violet-700',
  Internship: 'bg-rose-50 text-rose-700'
};

const HIRING = [
  { company: 'Sun Tech Solutions', openings: 12, city: 'Chennai' },
  { company: 'Shreeji CNC Works', openings: 8, city: 'Ahmedabad' },
  { company: 'Balaji Steels', openings: 6, city: 'Raipur' },
  { company: 'Fresh Bite Foods', openings: 15, city: 'Madurai' },
  { company: 'Style Tex Garments', openings: 5, city: 'Tiruppur' },
  { company: 'Sri Venkatesh Machinery', openings: 4, city: 'Coimbatore' }
];

const BENEFITS = [
  { Icon: Banknote, t: 'Salary transparency', d: 'Every role on BizBook shows a published range, so candidates apply with realistic expectations.' },
  { Icon: Globe, t: 'Verified employers', d: 'Hiring companies are checked against GSTIN and registration records before they can post roles.' },
  { Icon: Wifi, t: 'Remote & hybrid', d: 'Filter by work mode to find roles that fit how you actually want to work.' },
  { Icon: Users, t: 'Direct hiring', d: 'No recruiter middleman — you read the role and apply to the employer directly.' }
];

export default function Jobs() {
  const [q, setQ] = useState('');
  const [type, setType] = useState('all');
  const [mode, setMode] = useState('all');
  const [loc, setLoc] = useState('');

  const jobs = useMemo(() => JOBS.filter(j => {
    if (q && !`${j.title} ${j.company} ${j.location}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (type !== 'all' && j.type !== type) return false;
    if (mode !== 'all' && j.mode !== mode) return false;
    if (loc && !j.location.toLowerCase().includes(loc.toLowerCase())) return false;
    return true;
  }), [q, type, mode, loc]);

  return (
    <>
      <section className="relative overflow-hidden bg-ink-950">
        <div className="container-bb relative py-14 sm:py-20">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
            <span className="eyebrow border-white/15 bg-white/10 text-brand-300">Careers</span>
            <h1 className="mt-4 text-[30px] font-extrabold leading-tight text-white sm:text-[44px]">
              Find Work with Verified Indian Employers
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-white/65">
              BizBook jobs connect candidates directly with manufacturers, suppliers and service businesses
              that have been checked and are hiring right now.
            </p>

            <div className="mx-auto mt-8 grid max-w-2xl gap-2.5 rounded-2xl bg-white/10 p-2.5 backdrop-blur sm:grid-cols-[1.5fr_1fr_auto]">
              <label className="relative">
                <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input value={q} onChange={e => setQ(e.target.value)}
                  className="w-full rounded-xl bg-white py-3 pl-10 pr-3 text-[14px] text-ink-900 outline-none placeholder:text-ink-400"
                  placeholder="Job title, skill or company" />
              </label>
              <label className="relative">
                <MapPin size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input value={loc} onChange={e => setLoc(e.target.value)}
                  className="w-full rounded-xl bg-white py-3 pl-10 pr-3 text-[14px] text-ink-900 outline-none placeholder:text-ink-400"
                  placeholder="City" />
              </label>
              <button className="btn-primary btn-md py-3">Search jobs</button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-ink-100 bg-white">
        <div className="container-bb no-scrollbar flex gap-2 overflow-x-auto py-4">
          {JOB_TYPES.map(t => (
            <Link key={t} to="/jobs" className="shrink-0 rounded-full border border-ink-200 px-4 py-2 text-[13px] font-semibold text-ink-600 transition-all hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700">
              {t}
            </Link>
          ))}
        </div>
      </section>

      <section className="container-bb py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-[20px] font-extrabold text-ink-900">
                  {jobs.length} open role{jobs.length === 1 ? '' : 's'}
                </h2>
                <p className="text-[13.5px] text-ink-500">Updated across BizBook-listed employers in India</p>
              </div>
              <div className="flex gap-1.5 rounded-xl bg-ink-100 p-1">
                {[['all', 'All'], ['Full Time', 'Full time'], ['Contract', 'Contract']].map(([k, l]) => (
                  <button key={k} onClick={() => setType(k)}
                    className={cx('rounded-lg px-3 py-1.5 text-[12.5px] font-bold transition-all',
                      type === k ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500')}>{l}</button>
                ))}
              </div>
            </div>

            {jobs.length === 0 ? (
              <EmptyState icon={Briefcase} title="No jobs match those filters"
                sub="Try widening your search — clear the city or work-mode filter."
                action={<button onClick={() => { setQ(''); setType('all'); setMode('all'); setLoc(''); }} className="btn-outline btn-sm mt-1">Clear filters</button>} />
            ) : (
              <div className="space-y-4">
                {jobs.map((j, i) => (
                  <motion.article key={j.title} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .05 }}
                    className="card group p-6 transition-all hover:border-brand-300 hover:shadow-lift">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-[17px] font-extrabold text-ink-900 group-hover:text-brand-700">{j.title}</h3>
                        <p className="mt-1 text-[13.5px] text-ink-600">{j.company}</p>
                        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] text-ink-500">
                          <span className="inline-flex items-center gap-1"><MapPin size={13} />{j.location}</span>
                          <span className="inline-flex items-center gap-1"><Clock size={13} />{j.exp} experience</span>
                          <span className="inline-flex items-center gap-1"><Briefcase size={13} />{j.type}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-[17px] font-extrabold text-ink-900">{j.salary}</p>
                        <p className="text-[11.5px] text-ink-400">per annum</p>
                        <span className={cx('mt-2 inline-block rounded-md px-2 py-0.5 text-[11px] font-bold', MODE_TONE[j.mode])}>{j.mode}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-4">
                      <span className={cx('rounded-md px-2 py-0.5 text-[11px] font-bold', TYPE_TONE[j.type])}>{j.type}</span>
                      <Link to="/contact" className="btn-primary btn-sm">
                        <Send size={13} />Apply now
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-5">
            <div className="card p-5">
              <h3 className="flex items-center gap-2 text-[15px] font-extrabold text-ink-900">
                <Filter size={16} />Filters
              </h3>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="label">Work mode</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['all', 'Onsite', 'Hybrid', 'Remote'].map(m => (
                      <button key={m} onClick={() => setMode(m)}
                        className={cx('rounded-lg border px-2.5 py-1.5 text-[12.5px] font-semibold transition-all',
                          mode === m ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-ink-200 text-ink-600 hover:border-brand-300')}>
                        {m === 'all' ? 'Any' : m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <h3 className="flex items-center gap-2 text-[15px] font-extrabold text-ink-900">
                <Building2 size={16} />Companies hiring
              </h3>
              <ul className="mt-4 space-y-3">
                {HIRING.map(h => (
                  <li key={h.company} className="flex items-center justify-between gap-2 text-[13px]">
                    <Link to={`/businesses?q=${encodeURIComponent(h.company)}`} className="truncate font-semibold text-ink-800 hover:text-brand-700">{h.company}</Link>
                    <span className="shrink-0 rounded-md bg-ink-100 px-1.5 py-0.5 text-[11px] font-bold text-ink-600">{h.openings}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-ink-900 bg-ink-950 p-6 text-white">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600"><Sparkles size={18} /></span>
              <h3 className="mt-3.5 text-[16px] font-extrabold">Hiring? Post a job free</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-white/65">
                Business accounts can publish roles and reach candidates across India from the dashboard.
              </p>
              <Link to="/list-your-business" className="btn-primary btn-sm mt-4 w-full">List your business</Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-ink-100 bg-ink-50/60 py-14">
        <div className="container-bb">
          <SectionHead eyebrow="Why BizBook Jobs" title="Hiring That Respects Both Sides" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map(b => (
              <div key={b.t} className="card p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600"><b.Icon size={19} /></span>
                <h3 className="mt-3.5 text-[15.5px] font-extrabold text-ink-900">{b.t}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-600">{b.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-ink-100 bg-white p-8 text-center">
            <GraduationCap size={26} className="text-brand-600" />
            <p className="text-[15px] font-bold text-ink-900">Looking for an internship or your first job?</p>
            <p className="max-w-md text-[13.5px] leading-relaxed text-ink-600">
              Filter for internship opportunities across listed employers — many BizBook businesses hire
              fresh graduates for entry-level roles.
            </p>
            <Link to="/resources" className="btn-outline btn-md mt-1">Read hiring guides</Link>
          </div>
        </div>
      </section>
    </>
  );
}