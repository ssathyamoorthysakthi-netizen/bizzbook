import { useMemo } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ChevronRight, Search, TrendingUp, Megaphone, ShoppingCart, Target, Factory, FileText, ArrowLeft } from 'lucide-react';
import { POSTS, formatDate } from '../lib/data';

const ICONS = { Search, TrendingUp, Megaphone, ShoppingCart, Target, Factory };

export default function Article() {
  const { slug } = useParams();
  const post = useMemo(() => POSTS.find(p => p.slug === slug), [slug]);

  if (!post) return <Navigate to="/resources" replace />;

  const Icon = ICONS[post.icon] || FileText;
  const more = POSTS.filter(p => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <section className="border-b border-ink-100 bg-ink-50/60">
        <div className="container-bb py-10">
          <Link to="/resources" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-500 transition-colors hover:text-brand-700">
            <ArrowLeft size={14} />All resources
          </Link>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-[11.5px]">
              <span className="rounded-md bg-brand-600 px-2 py-0.5 font-bold text-white">{post.category}</span>
              <span className="inline-flex items-center gap-1 text-ink-400"><Clock size={12} />{post.read} min read</span>
              <span className="text-ink-400">{formatDate(post.date)}</span>
            </div>
            <h1 className="mt-4 text-[28px] font-extrabold leading-tight text-ink-900 sm:text-[38px]">{post.title}</h1>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-600">{post.excerpt}</p>
            <div className="mt-6 flex items-center gap-3 border-t border-ink-100 pt-5">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-brand-600 shadow-card">
                <Icon size={20} />
              </span>
              <div>
                <p className="text-[13.5px] font-bold text-ink-900">BizBook Editorial</p>
                <p className="text-[12px] text-ink-500">Written for Indian businesses</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container-bb py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
          <article className="min-w-0 max-w-3xl">
            {post.body.map((p, i) => (
              <p key={i} className="mb-5 text-[15.5px] leading-[1.85] text-ink-700">{p}</p>
            ))}

            <div className="mt-9 rounded-2xl border border-ink-100 bg-ink-50/60 p-6">
              <p className="text-[14px] font-bold text-ink-900">Put this into practice today</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-600">
                Create a free business profile or find a verified supplier — both take under two minutes.
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                <Link to="/list-your-business" className="btn-primary btn-sm">List your business</Link>
                <Link to="/businesses" className="btn-outline btn-sm">Browse suppliers</Link>
              </div>
            </div>
          </article>

          <aside className="space-y-5">
            <div className="card p-5">
              <h2 className="text-[15px] font-extrabold text-ink-900">Read next</h2>
              <ul className="mt-3.5 space-y-3">
                {more.map(p => (
                  <li key={p.slug}>
                    <Link to={`/resources/${p.slug}`} className="group flex gap-2.5">
                      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                        {(() => { const I = ICONS[p.icon] || FileText; return <I size={15} />; })()}
                      </span>
                      <span>
                        <span className="block text-[13px] font-bold leading-snug text-ink-800 group-hover:text-brand-700">{p.title}</span>
                        <span className="mt-0.5 block text-[11px] text-ink-400">{p.read} min read</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-ink-900 bg-ink-950 p-6 text-white">
              <p className="text-[15px] font-extrabold">Need suppliers, not advice?</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-white/65">
                Search verified businesses by category, city and badge.
              </p>
              <Link to="/businesses" className="btn-primary btn-sm mt-4 w-full">
                Browse businesses <ChevronRight size={14} />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}