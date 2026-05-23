import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useProductStore } from './admin/store/useProductStore';
import { useSettingsStore } from './store/useSettingsStore';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import GamingCartsPage from './pages/GamingCartsPage';
import PopularAccountsPage from './pages/PopularAccountsPage';
import DealsPage from './pages/DealsPage';
import ReviewsPage from './pages/ReviewsPage';
import SupportPage from './pages/SupportPage';
import AboutPage from './pages/AboutPage';
import FaqPage from './pages/FaqPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import SecurityPage from './pages/SecurityPage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import CustomQuotePage from './pages/CustomQuotePage';
import { Toaster } from 'react-hot-toast';
import Preloader from './components/common/Preloader';
import ScrollToTop from './components/common/ScrollToTop';

// Admin Imports
import AdminLayout from './admin/components/layout/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import ProductsPage from './admin/pages/ProductsPage';
import AddProductPage from './admin/pages/AddProductPage';
import EditProductPage from './admin/pages/EditProductPage';
import DealsAdminPage from './admin/pages/DealsPage';
import ReviewsAdminPage from './admin/pages/ReviewsPage';
import BannersPage from './admin/pages/BannersPage';
import HomepagePage from './admin/pages/HomepagePage';
import CategoriesPage from './admin/pages/CategoriesPage';
import SettingsPage from './admin/pages/SettingsPage';
import LoginPage from './admin/pages/LoginPage';
import SocialsPage from './admin/pages/SocialsPage';
import AdminCareersPage from './admin/pages/AdminCareersPage';
import AdminQueriesPage from './admin/pages/AdminQueriesPage';
import OrdersPage from './admin/pages/OrdersPage';
import OrderDetailPage from './admin/pages/OrderDetailPage';
import CareersPage from './pages/CareersPage';
import ContactPage from './pages/ContactPage';
import CategoryPage from './pages/CategoryPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ProductDetailPage from './pages/ProductDetailPage';

function StorefrontLayout({ children }) {
  return (
    <div className="app-wrapper">
      <ScrollToTop />
      <Preloader />
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#1a1a1a', color: '#fff', border: '1px solid #333' } }} />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const fetchSettings = useSettingsStore((state) => state.fetchSettings);

  useEffect(() => {
    fetchProducts();
    fetchSettings();
  }, [fetchProducts, fetchSettings]);

  return (
    <Routes>
      {/* ─── ADMIN AUTH ROUTE ─── */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* ─── ADMIN ROUTES ─── */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/add" element={<AddProductPage />} />
        <Route path="products/edit/:id" element={<EditProductPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="deals" element={<DealsAdminPage />} />
        <Route path="reviews" element={<ReviewsAdminPage />} />
        <Route path="banners" element={<BannersPage />} />
        <Route path="homepage" element={<HomepagePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="settings/socials" element={<SocialsPage />} />
        <Route path="careers" element={<AdminCareersPage />} />
        <Route path="queries" element={<AdminQueriesPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:id" element={<OrderDetailPage />} />
      </Route>

      {/* ─── STOREFRONT ROUTES ─── */}
      <Route path="/*" element={
        <StorefrontLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gaming-carts" element={<GamingCartsPage />} />
            <Route path="/popular" element={<PopularAccountsPage />} />
            <Route path="/deals" element={<DealsPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/categories/:mainCategorySlug" element={<CategoryPage />} />
            <Route path="/categories/:mainCategorySlug/:subcategorySlug" element={<CategoryPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/refund-policy" element={<RefundPolicyPage />} />
            <Route path="/custom-quote" element={<CustomQuotePage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
          </Routes>
        </StorefrontLayout>
      } />
    </Routes>
  );
}

export default App;
