import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, TrendingUp, Megaphone, ShoppingCart, Target, Factory, BookOpen,
  ChevronRight, Clock, FileText
} from 'lucide-react';
import { POSTS, formatDate, cx } from '../lib/data';
import { SectionHead, EmptyState } from '../components/ui';

const CATEGORIES = ['All', ...new Set(POSTS.map(p => p.category))];

const ICONS = { Search, TrendingUp, Megaphone, ShoppingCart, Target, Factory };

export default function Resources() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');

  const posts = useMemo(() => POSTS.filter(p => {
    if (cat !== 'All' && p.category !== cat) return false;
    if (q && !`${p.title} ${p.excerpt} ${p.category}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [q, cat]);

  const [lead, ...rest] = posts;
  const featured = lead && POSTS.includes(lead) ? lead : POSTS[0];
  const grid = posts.filter(p => p.slug !== featured?.slug);

  return (
    <>
      <section className="relative overflow-hidden bg-ink-950">
        <div className="container-bb relative py-14 text-center sm:py-20">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl">
            <span className="eyebrow border-white/15 bg-white/10 text-brand-300">Resources</span>
            <h1 className="mt-4 text-[30px] font-extrabold leading-tight text-white sm:text-[44px]">
              Practical Guides for Indian B2B
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-white/65">
              Sourcing checklists, growth playbooks and industry explainers written for businesses
              that need to act on them — not for search traffic.
            </p>

            <div className="mx-auto mt-8 max-w-xl">
              <label className="relative block">
                <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
                <input value={q} onChange={e => setQ(e.target.value)}
                  className="w-full rounded-2xl bg-white py-3.5 pl-11 pr-4 text-[14px] text-ink-900 outline-none placeholder:text-ink-400"
                  placeholder="Search guides, sourcing, marketing…" />
              </label>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-ink-100 bg-white">
        <div className="container-bb no-scrollbar flex gap-2 overflow-x-auto py-4">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={cx('shrink-0 rounded-full border px-4 py-2 text-[13px] font-semibold transition-all',
                cat === c ? 'border-brand-600 bg-brand-600 text-white' : 'border-ink-200 text-ink-600 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700')}>
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="container-bb py-12">
        {posts.length === 0 ? (
          <EmptyState icon={BookOpen} title="No guides match that search"
            sub="Try a broader term like sourcing, marketing or manufacturing."
            action={<button onClick={() => { setQ(''); setCat('All'); }} className="btn-outline btn-sm mt-1">Clear filters</button>} />
        ) : (
          <>
            <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="group relative overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-lift">
              <div className="grid lg:grid-cols-[1.15fr_1fr]">
                <div className="flex flex-col justify-center p-7 sm:p-10">
                  <div className="flex flex-wrap items-center gap-2 text-[11.5px]">
                    <span className="rounded-md bg-brand-600 px-2 py-0.5 font-bold text-white">Featured</span>
                    <span className="rounded-md bg-ink-100 px-2 py-0.5 font-bold text-ink-600">{featured.category}</span>
                    <span className="inline-flex items-center gap-1 text-ink-400"><Clock size={12} />{featured.read} min read</span>
                  </div>
                  <h2 className="mt-4 text-[24px] font-extrabold leading-tight text-ink-900 group-hover:text-brand-700 sm:text-[30px]">
                    {featured.title}
                  </h2>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-ink-600">{featured.excerpt}</p>
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <Link to={`/resources/${featured.slug}`} className="btn-primary btn-md">
                      Read the guide <ChevronRight size={15} />
                    </Link>
                    <span className="text-[12px] text-ink-400">{formatDate(featured.date)}</span>
                  </div>
                </div>
                <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand-600 to-ink-950 lg:block">
                  <div className="grid h-full place-items-center">
                    {(() => { const Icon = ICONS[featured.icon] || FileText; return <Icon size={110} className="text-white/12" strokeWidth={1} />; })()}
                  </div>
                </div>
              </div>
            </motion.article>

            <div className="mt-10">
              <SectionHead eyebrow="Library" title={`${grid.length} more guide${grid.length === 1 ? '' : 's'}`} align="left" />
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {grid.map((p, i) => {
                  const Icon = ICONS[p.icon] || FileText;
                  return (
                    <motion.div key={p.slug} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .05 }}>
                      <Link to={`/resources/${p.slug}`} className="card group flex h-full flex-col p-6 transition-all hover:border-brand-300 hover:shadow-lift">
                        <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                          <Icon size={19} />
                        </span>
                        <span className="mt-4 flex items-center gap-2 text-[11.5px]">
                          <span className="rounded-md bg-ink-100 px-2 py-0.5 font-bold text-ink-600">{p.category}</span>
                          <span className="inline-flex items-center gap-1 text-ink-400"><Clock size={12} />{p.read} min</span>
                        </span>
                        <h3 className="mt-3 text-[16.5px] font-extrabold leading-snug text-ink-900 group-hover:text-brand-700">{p.title}</h3>
                        <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-ink-600">{p.excerpt}</p>
                        <span className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-bold text-brand-700">
                          Read more <ChevronRight size={14} />
                        </span>
                        <span className="mt-1 text-[11.5px] text-ink-400">{formatDate(p.date)}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </section>

      <section className="border-t border-ink-100 bg-ink-50/60 py-14">
        <div className="container-bb">
          <div className="grid gap-5 lg:grid-cols-3">
            {[
              { t: 'Looking for suppliers?', d: 'Use our filters to find verified businesses by category, city and badge, then send a direct enquiry.',
                cta: 'Browse businesses', to: '/businesses' },
              { t: 'Want more enquiries?', d: 'Complete your free business profile — capacity, certifications and payment terms are what buyers check first.',
                cta: 'List your business', to: '/list-your-business' },
              { t: 'Hiring this quarter?', d: 'Post roles to candidates across India from your dashboard, with published salary ranges.',
                cta: 'See open jobs', to: '/jobs' }
            ].map(x => (
              <div key={x.t} className="card p-6">
                <h3 className="text-[16.5px] font-extrabold text-ink-900">{x.t}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-600">{x.d}</p>
                <Link to={x.to} className="btn-outline btn-sm mt-4 inline-flex">
                  {x.cta} <ChevronRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}