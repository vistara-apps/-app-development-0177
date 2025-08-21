import React from 'react';
import { useAccount } from 'wagmi';
import { Gift, TrendingUp, Users, Shield } from 'lucide-react';
import { useAirdrop } from '../contexts/AirdropContext';
import CampaignCard from '../components/CampaignCard';

const HomePage: React.FC = () => {
  const { isConnected } = useAccount();
  const { campaigns } = useAirdrop();

  const activeCampaigns = campaigns.filter(c => c.isActive && new Date() <= c.endDate);
  const totalRewards = activeCampaigns.reduce((sum, c) => sum + c.tokenAmount, 0);
  const totalClaimed = campaigns.reduce((sum, c) => sum + c.claimedAmount, 0);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Claim Your Free Tokens</h1>
          <p>Join exclusive airdrops, earn referral bonuses, and grow your crypto portfolio</p>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{activeCampaigns.length}</div>
              <div className="stat-label">Active Campaigns</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{totalRewards}</div>
              <div className="stat-label">Tokens Available</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{totalClaimed.toLocaleString()}</div>
              <div className="stat-label">Total Claimed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-3xl font-bold text-center text-white mb-16">Why Choose AirdropHub?</h2>
          <div className="grid grid-3 gap-8">
            <div className="card text-center">
              <Gift className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Free Token Claims</h3>
              <p className="text-gray-600">Claim free tokens from verified projects with just a few clicks</p>
            </div>
            <div className="card text-center">
              <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Referral Rewards</h3>
              <p className="text-gray-600">Earn bonus tokens by referring friends to exclusive airdrops</p>
            </div>
            <div className="card text-center">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Verified Campaigns</h3>
              <p className="text-gray-600">All campaigns are verified for authenticity and security</p>
            </div>
          </div>
        </div>
      </section>

      {/* Active Campaigns */}
      {isConnected && (
        <section className="py-20">
          <div className="container">
            <h2 className="text-3xl font-bold text-center text-white mb-16">Active Campaigns</h2>
            <div className="grid grid-2 gap-8">
              {activeCampaigns.map(campaign => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
            {activeCampaigns.length === 0 && (
              <div className="card text-center">
                <p className="text-gray-600">No active campaigns at the moment. Check back soon!</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      {!isConnected && (
        <section className="py-20">
          <div className="container">
            <div className="card text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Start Earning?</h2>
              <p className="text-gray-600 mb-6">Connect your wallet to access exclusive airdrops and start earning tokens today!</p>
              <div className="text-indigo-600 font-semibold">👆 Connect your wallet above to get started</div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;