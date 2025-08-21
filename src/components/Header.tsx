import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Coins, Users, Settings } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
            <Coins className="w-8 h-8" />
            AirdropHub
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-white/80 hover:text-white transition-colors ${
                location.pathname === '/' ? 'text-white font-semibold' : ''
              }`}
            >
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
          
          <ConnectButton />
        </div>
      </div>
    </header>
  );
};

export default Header;