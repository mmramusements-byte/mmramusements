import { useEffect } from 'react';
import HeroSection from '../components/sections/HeroSection';
import FeaturedAccounts from '../components/sections/FeaturedAccounts';
import TrendingAccounts from '../components/sections/TrendingAccounts';
import BestSellers from '../components/sections/BestSellers';
import NewArrivals from '../components/sections/NewArrivals';
import PopularProducts from '../components/sections/PopularProducts';
import RecommendedProducts from '../components/sections/RecommendedProducts';
import AccountDeals from '../components/sections/AccountDeals';
import CategoryExperience from '../components/sections/CategoryExperience';
import Testimonials from '../components/sections/Testimonials';
import { useSettingsStore } from '../store/useSettingsStore';
import { useProductStore } from '../admin/store/useProductStore';

export default function HomePage() {
  const { settings, fetchSettings } = useSettingsStore();
  const fetchProducts = useProductStore((state) => state.fetchProducts);

  useEffect(() => {
    fetchSettings();
    fetchProducts();
  }, [fetchSettings, fetchProducts]);

  return (
    <>
      {settings?.hero_visible !== false && <HeroSection />}
      {settings?.featured_visible !== false && <FeaturedAccounts />}
      {settings?.trending_visible !== false && <TrendingAccounts />}
      {settings?.best_sellers_visible !== false && <BestSellers />}
      {settings?.new_arrivals_visible !== false && <NewArrivals />}
      {settings?.popular_visible !== false && <PopularProducts />}
      {settings?.recommended_visible !== false && <RecommendedProducts />}
      {settings?.deals_visible !== false && <AccountDeals />}
      <CategoryExperience />
      {settings?.reviews_visible !== false && <Testimonials />}
    </>
  );
}
