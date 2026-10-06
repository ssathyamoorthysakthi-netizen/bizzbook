import { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Phone, Mail, Globe, Calendar, Users, TrendingUp, BadgeCheck, Send, ArrowLeft,
  Share2, Heart, CheckCircle2, Package, Wrench, Eye, MessageSquare, Factory, Award, Truck, ShieldCheck,
  X, ChevronLeft, ChevronRight, ImageOff
} from 'lucide-react';
import { api } from '../lib/api';
import { cx, inr, priceLabel } from '../lib/data';
import { useApp } from '../components/AppProvider';
import { useEnquiryModal } from '../lib/enquiry';
import { Spinner, ErrorState, Stars, LocationChip, Avatar, RatingBreakdown, SectionHead } from '../components/ui';
import { BusinessCard, FavButton } from '../components/Cards';

const REVIEWS = [
  { name: 'Rakesh Gupta', role: 'Purchase Manager, Precision Forge Ltd', rating: 5, city: 'Pune, Maharashtra', text: 'Consistent quality across four orders. Documentation was accurate and delivery was ahead of schedule. We now treat them as our default supplier for turned components.' },
  { name: 'Anjali Menon', role: 'Procurement Lead, SolarEdge Infra', rating: 5, city: 'Bengaluru, Karnataka', text: 'Quotation turnaround is fast and the pricing bands on BizBook were realistic. They answered technical questions before we even asked.' },
  { name: 'Suresh Reddy', role: 'Director, BuildTech Contractors', rating: 4, city: 'Hyderabad, Telangana', text: 'Good capacity and fair pricing. Would like to see shorter lead times during peak season, but overall a reliable partner.' }
];

export default function BusinessProfile() {
  const { slug } = useParams();
  const { toast } = useApp();
  const { openEnquiry } = useEnquiryModal();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('products');
  const [lightbox, setLightbox] = useState(null);

  const load = () => {
    setLoading(true); setError(null);
    api.business(slug).then(setData).catch(setError).finally(() => setLoading(false));
  };

  useEffect(load, [slug]);

  const photos = (data && data.business && data.business.gallery) || [];

  const step = useCallback((dir) => {
    setLightbox((i) => (i === null ? i : (i + dir + photos.length) % photos.length));
  }, [photos.length]);

  useEffect(() => {
    if (lightbox === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox, step]);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: data.business.name, url });
      else { await navigator.clipboard.writeText(url); toast('Profile link copied to clipboard', 'info'); }
    } catch { /* dismissed */ }
  };

  if (loading) return <Spinner label="Loading business profile" />;
  if (error) return <div className="container-bb py-16"><ErrorState error={error} onRetry={load} title="Business not found" /></div>;

  const b = data.business;
  const facts = [
    { Icon: Calendar, label: 'Founded', value: b.yearFounded || 'Not specified' },
    { Icon: Users, label: 'Team size', value: b.employees || 'Not specified' },
    { Icon: TrendingUp, label: 'Turnover', value: b.turnover || 'Not specified' },
    { Icon: MessageSquare, label: 'Responds in', value: b.respondsIn || '—' },
    { Icon: Award, label: 'GSTIN', value: b.gstin || 'Not specified' },
    { Icon: Eye, label: 'Profile views', value: (b.views || 0).toLocaleString('en-IN') }
  ];

  return (
    <>
      {/* hero */}
      <section className="border-b border-ink-100 bg-ink-50/70">
        <div className="container-bb py-6">
          <Link to="/businesses" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-600 hover:text-brand-700">
            <ArrowLeft size={14} />All businesses
          </Link>

          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 flex-1 gap-4 sm:gap-5">
              <Avatar name={b.name} size="xl" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {b.verified && <span className="badge-verified"><BadgeCheck size={12} />Verified</span>}
                  {b.badge && <span className="badge-top">{b.badge}</span>}
                  <span className="rounded-md bg-ink-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-ink-600">{b.category}</span>
                </div>
                <h1 className="mt-2.5 text-[26px] font-extrabold leading-tight text-ink-900 sm:text-[34px]">{b.name}</h1>
                {b.tagline && <p className="mt-1.5 max-w-2xl text-[14.5px] text-ink-600">{b.tagline}</p>}
                <div className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-2">
                  <Stars value={b.rating} />
                  <span className="text-[13px] text-ink-500">{b.reviewCount} reviews</span>
                  <LocationChip city={b.city} state={b.state} />
                  {b.address && <span className="text-[12.5px] text-ink-400">{b.address}</span>}
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <button onClick={() => openEnquiry(b)} className="btn-primary btn-md"><Send size={15} />Send Enquiry</button>
              <button onClick={() => openEnquiry(b)} className="btn-dark btn-md">Get Quote</button>
              <FavButton slug={b.slug} />
              <button onClick={share} className="grid h-11 w-11 place-items-center rounded-xl border border-ink-200 bg-white text-ink-600 transition-colors hover:border-brand-400 hover:text-brand-700" aria-label="Share">
                <Share2 size={16} />
              </button>
            </div>
          </div>

          <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-ink-200/70 pt-6 sm:grid-cols-3 lg:grid-cols-6">
            {facts.map(f => (
              <div key={f.label}>
                <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                  <f.Icon size={12} />{f.label}
                </dt>
                <dd className="mt-1 truncate text-[14px] font-bold text-ink-900">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="container-bb py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_336px]">
          <div className="min-w-0">
            {/* about */}
            <div className="card p-6">
              <h2 className="text-[19px] font-extrabold text-ink-900">About Business</h2>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-600">{b.description}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  { Icon: Award, t: 'Certifications', v: b.certifications },
                  { Icon: Truck, t: 'Export markets', v: b.exportMarkets },
                  { Icon: ShieldCheck, t: 'Payment terms', v: b.paymentTerms },
                  { Icon: Factory, t: 'Category', v: b.category }
                ].map(f => f.v && (
                  <div key={f.t} className="flex gap-3 rounded-xl border border-ink-100 bg-ink-50/50 p-3.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-brand-600 shadow-sm"><f.Icon size={16} /></span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">{f.t}</p>
                      <p className="mt-0.5 text-[13.5px] font-semibold text-ink-800">{f.v}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* tabs */}
            <div className="mt-8">
              <div className="flex gap-1 border-b border-ink-200" role="tablist">
                {[['products', 'Products', data.products.length, Package],
                  ['services', 'Services', data.services.length, Wrench],
                  ['reviews', 'Reviews', b.reviewCount, BadgeCheck]].map(([k, label, n, Icon]) => (
                  <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
                    className={cx('-mb-px flex items-center gap-2 border-b-2 px-4 py-3 text-[14px] font-bold transition-colors',
                      tab === k ? 'border-brand-600 text-brand-700' : 'border-transparent text-ink-500 hover:text-ink-800')}>
                    <Icon size={15} />{label}
                    <span className={cx('rounded-full px-1.5 py-0.5 text-[11px]', tab === k ? 'bg-brand-50 text-brand-700' : 'bg-ink-100 text-ink-500')}>{n}</span>
                  </button>
                ))}
              </div>

              {tab === 'products' && (
                <div className="mt-6">
                  {data.products.length === 0
                    ? <p className="rounded-xl border border-dashed border-ink-200 px-6 py-10 text-center text-[14px] text-ink-500">No products listed yet.</p>
                    : (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {data.products.map(p => (
                          <motion.div key={p.id} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                            className="card card-hover flex flex-col p-4">
                            <div className="flex items-start gap-3">
                              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600"><Package size={18} /></span>
                              <div className="min-w-0 flex-1">
                                <h3 className="line-clamp-2 text-[14.5px] font-bold text-ink-900">{p.title}</h3>
                                <p className="mt-0.5 text-[11.5px] text-ink-500">{p.category}</p>
                              </div>
                            </div>
                            <p className="mt-3 line-clamp-2 flex-1 text-[12.5px] leading-relaxed text-ink-600">{p.description}</p>
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              <span className="rounded-md bg-ink-50 px-2 py-0.5 text-[11px] font-semibold text-ink-600">
                                MOQ {p.moq} {p.priceUnit || 'units'}
                              </span>
                              {p.stock && <span className={cx('rounded-md px-2 py-0.5 text-[11px] font-bold',
                                p.stock === 'In Stock' ? 'bg-emerald-50 text-emerald-700' : 'bg-ink-100 text-ink-600')}>{p.stock}</span>}
                            </div>
                            <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-ink-100 pt-3">
                              <span className="text-[16px] font-extrabold text-ink-900">{priceLabel(p)}</span>
                              <button onClick={() => openEnquiry(b, p)} className="btn-primary btn-sm">Inquire</button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                </div>
              )}

              {tab === 'services' && (
                <div className="mt-6">
                  {data.services.length === 0
                    ? <p className="rounded-xl border border-dashed border-ink-200 px-6 py-10 text-center text-[14px] text-ink-500">No services listed yet.</p>
                    : (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {data.services.map(s => (
                          <motion.div key={s.id} whileHover={{ y: -4 }} className="card card-hover flex flex-col p-4">
                            <div className="flex items-start gap-3">
                              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600"><Wrench size={18} /></span>
                              <div className="min-w-0 flex-1">
                                <h3 className="line-clamp-2 text-[14.5px] font-bold text-ink-900">{s.title}</h3>
                                <p className="mt-0.5 text-[11.5px] text-ink-500">{s.category}</p>
                              </div>
                            </div>
                            <p className="mt-3 line-clamp-2 flex-1 text-[12.5px] leading-relaxed text-ink-600">{s.description}</p>
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {s.duration && <span className="rounded-md bg-ink-50 px-2 py-0.5 text-[11px] font-semibold text-ink-600">{s.duration}</span>}
                              {s.onSite && <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">On-site</span>}
                            </div>
                            <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-ink-100 pt-3">
                              <span className="text-[16px] font-extrabold text-ink-900">
                                {s.priceMin === null ? 'On Request' : priceLabel(s)}
                              </span>
                              <button onClick={() => openEnquiry(b, s)} className="btn-dark btn-sm">Get Quote</button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                </div>
              )}

              {tab === 'reviews' && (
                <div className="mt-6 space-y-4">
                  <div className="card p-6"><RatingBreakdown rating={b.rating} count={b.reviewCount} /></div>
                  {REVIEWS.map(r => (
                    <div key={r.name} className="card p-5">
                      <div className="flex items-start gap-3.5">
                        <Avatar name={r.name} size="md" />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-[14px] font-bold text-ink-900">{r.name}</p>
                            <Stars value={r.rating} showValue={false} size={13} />
                          </div>
                          <p className="mt-0.5 text-[12px] text-ink-500">{r.role} · {r.city}</p>
                          <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-600">{r.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* gallery */}
            <div className="card mt-8 p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-[19px] font-extrabold text-ink-900">Gallery</h2>
                {photos.length > 0 && (
                  <span className="text-[12px] font-semibold text-ink-500">{photos.length} photos</span>
                )}
              </div>
              <p className="mt-1 text-[13px] text-ink-500">Photos shared by {b.name} on BizBook.</p>

              {photos.length === 0 ? (
                <div className="mt-5 grid place-items-center rounded-xl border border-dashed border-ink-200 bg-ink-50/60 px-6 py-12 text-center">
                  <ImageOff size={22} className="text-ink-400" />
                  <p className="mt-2 text-[13.5px] font-semibold text-ink-600">No photos yet</p>
                  <p className="mt-1 text-[12.5px] text-ink-500">
                    {b.name} has not uploaded gallery images.
                  </p>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {photos.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setLightbox(i)}
                      className="group relative aspect-square overflow-hidden rounded-xl bg-ink-100 text-left ring-1 ring-ink-900/5 transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
                      aria-label={`View photo ${i + 1} of ${photos.length}`}
                    >
                      <img
                        src={src}
                        alt={`${b.name} photo ${i + 1}`}
                        loading="lazy"
                        decoding="async"
                        width="640"
                        height="600"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
                      />
                      <span className="absolute inset-0 grid place-items-center bg-brand-600/0 text-[11px] font-bold text-white opacity-0 transition-all duration-300 group-hover:bg-brand-600/85 group-hover:opacity-100">
                        View photo
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* lightbox */}
          <AnimatePresence>
            {lightbox !== null && photos[lightbox] && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-ink-900/92 p-4"
                onClick={() => setLightbox(null)}
                role="dialog"
                aria-modal="true"
                aria-label="Photo viewer"
              >
                <button
                  type="button"
                  onClick={() => setLightbox(null)}
                  className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label="Close photo viewer"
                >
                  <X size={20} />
                </button>

                <motion.img
                  key={photos[lightbox]}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  src={photos[lightbox]}
                  alt={`${b.name} photo ${lightbox + 1}`}
                  className="max-h-[82vh] max-w-full rounded-xl object-contain shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />

                <div
                  className="mt-4 flex items-center gap-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  {photos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft size={18} />
                    </button>
                  )}
                  <span className="text-[12.5px] font-semibold text-white/80">
                    {lightbox + 1} / {photos.length}
                  </span>
                  {photos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => step(1)}
                      className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      aria-label="Next photo"
                    >
                      <ChevronRight size={18} />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-[86px] lg:self-start">
            <div className="card p-5">
              <h3 className="text-[15px] font-extrabold text-ink-900">Contact Business</h3>
              <p className="mt-1 text-[12.5px] text-ink-500">Typically responds {b.respondsIn || 'within a day'}</p>
              <div className="mt-4 space-y-2">
                <button onClick={() => openEnquiry(b)} className="btn-primary btn-md w-full"><Send size={15} />Send Enquiry</button>
                <a href={`tel:${(b.phone || '').replace(/\s/g, '')}`} className="btn-outline btn-md w-full"><Phone size={15} />{b.phone || 'Call'}</a>
                <a href={`mailto:${b.email}`} className="btn-outline btn-md w-full"><Mail size={15} />Email</a>
                {b.website && (
                  <a href={b.website} target="_blank" rel="noreferrer noopener" className="btn-ghost btn-md w-full">
                    <Globe size={15} />Visit website
                  </a>
                )}
              </div>
              <div className="mt-5 space-y-2 border-t border-ink-100 pt-4 text-[13px]">
                <p className="flex items-start gap-2 text-ink-600"><MapPin size={14} className="mt-0.5 shrink-0 text-brand-600" />{b.address || b.city}{b.state ? `, ${b.state}` : ''}</p>
                {b.phone && <p className="flex items-center gap-2 text-ink-600"><Phone size={14} className="shrink-0 text-brand-600" />{b.phone}</p>}
                {b.email && <p className="flex items-center gap-2 break-all text-ink-600"><Mail size={14} className="shrink-0 text-brand-600" />{b.email}</p>}
              </div>
            </div>

            <div className="card p-5">
              <h3 className="text-[15px] font-extrabold text-ink-900">Why deal with them</h3>
              <ul className="mt-3.5 space-y-2.5">
                {[
                  b.verified && 'Documents verified by BizBook',
                  b.respondsIn && `Responds in ${b.respondsIn}`,
                  b.certifications && `Certified: ${b.certifications.split(',')[0]}`,
                  b.exportMarkets && `Exports to ${b.exportMarkets.split(',')[0].trim()}`,
                  `${b.reviewCount} buyer reviews`
                ].filter(Boolean).map(t => (
                  <li key={t} className="flex items-start gap-2 text-[13px] text-ink-600">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-500" />{t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-5">
              <h3 className="text-[15px] font-extrabold text-ink-900">Similar businesses</h3>
              <div className="mt-3.5 space-y-3">
                {data.related.map(r => (
                  <Link key={r.id} to={`/business/${r.slug}`} className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-ink-50">
                    <Avatar name={r.name} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-bold text-ink-900">{r.name}</span>
                      <span className="block truncate text-[11.5px] text-ink-500">{r.city}</span>
                    </span>
                    <span className="shrink-0 text-[12px] font-bold text-ink-700">{r.rating}★</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {data.related.length > 0 && (
        <section className="section bg-ink-50/60">
          <div className="container-bb">
            <SectionHead eyebrow="You may also like" title="Other businesses in this category"
              action={<Link to={`/businesses?category=${b.categorySlug}`} className="btn-outline btn-md">See all</Link>} />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {data.related.map(r => <BusinessCard key={r.id} business={r} onEnquiry={openEnquiry} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}