import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Coins, Settings, Menu, X, Home } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
            <Coins className="w-8 h-8" />
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">AirdropHub</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-white/80 hover:text-white transition-colors flex items-center gap-1 ${
                location.pathname === '/' ? 'text-white font-semibold' : ''
              }`}
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link 
              to="/admin" 
              className={`text-white/80 hover:text-white transition-colors flex items-center gap-1 ${
                location.pathname === '/admin' ? 'text-white font-semibold' : ''
              }`}
            >
              <Settings className="w-4 h-4" />
              Admin
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <ConnectButton />
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white p-1 rounded-md hover:bg-white/10 transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/10 backdrop-blur-md border-b border-white/20 animate-fadeIn">
          <div className="container py-4">
            <nav className="flex flex-col gap-4">
              <Link 
                to="/" 
                className={`text-white/80 hover:text-white transition-colors flex items-center gap-2 p-2 rounded-md ${
                  location.pathname === '/' ? 'bg-white/10 text-white font-semibold' : ''
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                Home
              </Link>
              <Link 
                to="/admin" 
                className={`text-white/80 hover:text-white transition-colors flex items-center gap-2 p-2 rounded-md ${
                  location.pathname === '/admin' ? 'bg-white/10 text-white font-semibold' : ''
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="w-5 h-5" />
                Admin
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
