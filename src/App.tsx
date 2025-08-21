import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AirdropProvider } from './contexts/AirdropContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ClaimPage from './pages/ClaimPage';
import AdminPage from './pages/AdminPage';
import ReferralPage from './pages/ReferralPage';

function App() {
  return (
    <AirdropProvider>
      <Router>
        <div className="min-h-screen">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/claim/:campaignId" element={<ClaimPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/referral/:referralCode" element={<ReferralPage />} />
          </Routes>
        </div>
      </Router>
    </AirdropProvider>
  );
}

export default App;