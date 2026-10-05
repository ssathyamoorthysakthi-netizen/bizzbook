import { useCallback, useEffect, useRef, useState } from 'react';
import { api, setToken } from '../lib/api';

export function useApi(path, fn, deps = [], { skip = false } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState(null);
  const alive = useRef(true);

  const run = useCallback(async () => {
    if (skip) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fn();
      if (alive.current) setData(res);
    } catch (e) {
      if (alive.current && e.name !== 'AbortError') setError(e);
    } finally {
      if (alive.current) setLoading(false);
    }
  }, deps);

  useEffect(() => {
    alive.current = true;
    run();
    return () => { alive.current = false; };
  }, [run]);

  return { data, loading, error, refetch: run, setData };
}

const USER_KEY = 'bb_user';

export function readStoredUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch { return null; }
}

export function useAuth() {
  const [user, setUser] = useState(readStoredUser);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    api.auth.me()
      .then(({ user: u }) => { if (alive) { setUser(u); localStorage.setItem(USER_KEY, JSON.stringify(u)); } })
      .catch(() => { if (alive) { setUser(null); localStorage.removeItem(USER_KEY); } })
      .finally(() => alive && setReady(true));
    return () => { alive = false; };
  }, []);

  const login = useCallback(async (creds) => {
    const res = await api.auth.login(creds);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    return res.user;
  }, []);

  const signup = useCallback(async (data) => {
    const res = await api.auth.signup(data);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    return res.user;
  }, []);

  const logout = useCallback(async () => {
    try { await api.auth.logout(); } catch { /* ignore */ }
    setToken(null);
    setUser(null);
    localStorage.removeItem(USER_KEY);
  }, []);

  return { user, ready, login, signup, logout, isAdmin: !!user?.isAdmin, isBusiness: user?.role === 'business' };
}

export function useDebounced(value, delay = 350) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export function useMediaQuery(query) {
  const [match, setMatch] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}

export function useLockBody(locked) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [locked]);
}

export function useToast() {
  const [toasts, setToasts] = useState([]);
  const id = useRef(0);

  const push = useCallback((message, tone = 'success') => {
    const key = ++id.current;
    setToasts(t => [...t, { id: key, message, tone }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== key)), 4200);
  }, []);

  const dismiss = useCallback((key) => setToasts(t => t.filter(x => x.id !== key)), []);

  return { toasts, push, dismiss };
}
