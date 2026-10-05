import { createContext, useContext, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cx } from '../lib/data';
import { useAuth, useToast } from '../lib/hooks';

const AppCtx = createContext(null);
export const useApp = () => useContext(AppCtx);

export function AppProvider({ children }) {
  const auth = useAuth();
  const { toasts, push, dismiss } = useToast();
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [favourites, setFavourites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bb_favs') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    let alive = true;
    Promise.allSettled([
      import('../lib/api').then(({ api }) => api.cities()),
      import('../lib/api').then(({ api }) => api.categories())
    ]).then(([c, k]) => {
      if (!alive) return;
      if (c.status === 'fulfilled') setCities(c.value.items || []);
      if (k.status === 'fulfilled') setCategories(k.value.items || []);
    });
    return () => { alive = false; };
  }, []);

  const toggleFav = (slug) => {
    setFavourites(prev => {
      const next = prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug];
      try { localStorage.setItem('bb_favs', JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  const value = { ...auth, toast: push, cities, categories, favourites, toggleFav };

  return (
    <AppCtx.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[min(92vw,380px)] flex-col gap-2">
        <AnimatePresence>
          {toasts.map(t => {
            const Icon = t.tone === 'error' ? AlertCircle : t.tone === 'info' ? Info : CheckCircle2;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 16, scale: .96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: .96 }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className={cx(
                  'pointer-events-auto flex items-start gap-3 rounded-xl border p-3.5 shadow-lift backdrop-blur',
                  t.tone === 'error' ? 'border-rose-200 bg-rose-50/95 text-rose-800'
                    : t.tone === 'info' ? 'border-sky-200 bg-sky-50/95 text-sky-800'
                    : 'border-emerald-200 bg-emerald-50/95 text-emerald-800'
                )}
              >
                <Icon size={18} className="mt-0.5 shrink-0" />
                <p className="flex-1 text-[13px] font-medium leading-snug">{t.message}</p>
                <button onClick={() => dismiss(t.id)} className="shrink-0 opacity-60 hover:opacity-100" aria-label="Dismiss">
                  <X size={15} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </AppCtx.Provider>
  );
}
