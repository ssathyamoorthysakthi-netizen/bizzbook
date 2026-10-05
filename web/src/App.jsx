import { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useLocation, Link } from 'react-router-dom';
import { AppProvider, useApp } from './components/AppProvider';
import Header from './components/Header';
import Footer from './components/Footer';
import EnquiryModal from './components/EnquiryModal';
import { EnquiryProvider, useEnquiryModal } from './lib/enquiry';
import Home from './pages/Home';
import { Loader2 } from 'lucide-react';

const Directory = lazy(() => import('./pages/Directory'));
const BusinessProfile = lazy(() => import('./pages/BusinessProfile'));
const Auth = lazy(() => import('./pages/Auth'));
const ListYourBusiness = lazy(() => import('./pages/ListYourBusiness'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Admin = lazy(() => import('./pages/Admin'));
const StaticPage = lazy(() => import('./pages/StaticPage'));
const Resources = lazy(() => import('./pages/Resources'));
const Article = lazy(() => import('./pages/Article'));
const Jobs = lazy(() => import('./pages/Jobs'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Search = lazy(() => import('./pages/Search'));
const Contact = lazy(() => import('./pages/Contact'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname, search]);
  return null;
}

function Protected({ children, adminOnly = false }) {
  const { user, ready } = useApp();
  if (!ready) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-2.5 text-ink-400">
        <Loader2 size={20} className="animate-spin" />Checking your session…
      </div>
    );
  }
  if (!user) {
    return (
      <div className="container-bb flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-[18px] font-extrabold text-ink-900">Please sign in to continue</p>
        <p className="max-w-sm text-[14px] text-ink-500">
          You need a BizBook account to access this page. It takes less than a minute to create one.
        </p>
        <div className="mt-1 flex gap-2">
          <Link to="/login" className="btn-primary btn-md">Sign in</Link>
          <Link to="/signup" className="btn-outline btn-md">Create account</Link>
        </div>
      </div>
    );
  }
  if (adminOnly && !user.isAdmin) {
    return (
      <div className="container-bb flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-[18px] font-extrabold text-ink-900">Admin access required</p>
        <p className="max-w-sm text-[14px] text-ink-500">This console is restricted to BizBook administrators.</p>
        <Link to="/dashboard" className="btn-outline btn-md mt-1">Go to dashboard</Link>
      </div>
    );
  }
  return children;
}

function PageFallback() {
  return (
    <div className="flex min-h-[55vh] items-center justify-center gap-2.5 text-ink-400">
      <Loader2 size={20} className="animate-spin" />Loading…
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <EnquiryProvider>
        <ScrollToTop />
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/businesses" element={<Directory kind="businesses" />} />
                <Route path="/products" element={<Directory kind="products" />} />
                <Route path="/services" element={<Directory kind="services" />} />
                <Route path="/search" element={<Search />} />

                <Route path="/business/:slug" element={<BusinessProfile />} />

                <Route path="/login" element={<Auth mode="login" />} />
                <Route path="/signup" element={<Auth mode="signup" />} />

                <Route path="/list-your-business" element={<ListYourBusiness />} />

                <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
                <Route path="/admin" element={<Protected adminOnly><Admin /></Protected>} />
                <Route path="/settings" element={<Protected><Settings /></Protected>} />

                <Route path="/resources" element={<Resources />} />
                <Route path="/resources/:slug" element={<Article />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/contact" element={<Contact />} />

                <Route path="/for-buyers" element={<StaticPage page="forBuyers" />} />
                <Route path="/for-businesses" element={<StaticPage page="forBusinesses" />} />
                <Route path="/about" element={<StaticPage page="about" />} />
                <Route path="/help" element={<StaticPage page="help" />} />
                <Route path="/legal/:doc" element={<StaticPage page="legal" />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <GlobalEnquiryModal />
        </div>
      </EnquiryProvider>
    </AppProvider>
  );
}

function GlobalEnquiryModal() {
  const { open, business, item, close } = useEnquiryModal();
  return <EnquiryModal open={open} onClose={close} business={business} item={item} />;
}