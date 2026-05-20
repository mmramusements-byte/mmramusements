import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import GamingCartsPage from './pages/GamingCartsPage';
import PopularAccountsPage from './pages/PopularAccountsPage';
import DealsPage from './pages/DealsPage';
import ReviewsPage from './pages/ReviewsPage';
import SupportPage from './pages/SupportPage';
import CustomCursor from './components/common/CustomCursor';
import Preloader from './components/common/Preloader';

function App() {
  return (
    <div className="app-wrapper">
      <Preloader />
      <CustomCursor />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gaming-carts" element={<GamingCartsPage />} />
          <Route path="/popular" element={<PopularAccountsPage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/support" element={<SupportPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
