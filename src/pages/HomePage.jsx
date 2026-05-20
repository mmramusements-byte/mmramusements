import HeroSection from '../components/sections/HeroSection';
import FeaturedAccounts from '../components/sections/FeaturedAccounts';
import TrendingAccounts from '../components/sections/TrendingAccounts';
import AccountDeals from '../components/sections/AccountDeals';
import CategoryExperience from '../components/sections/CategoryExperience';
import Testimonials from '../components/sections/Testimonials';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedAccounts />
      <TrendingAccounts />
      <AccountDeals />
      <CategoryExperience />
      <Testimonials />
    </>
  );
}
