import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { Gift, Users, TrendingUp } from 'lucide-react';
import { useAirdrop } from '../contexts/AirdropContext';

const ReferralPage: React.FC = () => {
  const { referralCode } = useParams<{ referralCode: string }>();
  const { isConnected } = useAccount();
  const { referrals, campaigns } = useAirdrop();

  const referral = referrals.find(r => r.code === referralCode);
  const campaign = referral ? campaigns.find(c => c.id === referral.campaignId) : null;

  // Store referral code in localStorage for use during claim
  useEffect(() => {
    if (referralCode) {
      localStorage.setItem('pending_referral_code', referralCode);
    }
  }, [referralCode]);

  if (!referral || !campaign) {
    return (
      <div className="min-h-screen pt-20">
        <div className="container">
          <div className="card text-center">
            <h1 className="text-2xl font-bold mb-4">Invalid Referral Link</h1>
            <p className="text-gray-600 mb-6">The referral code you're trying to use is invalid or expired.</p>
            <a href="/" className="btn-primary">Browse Airdrops</a>
          </div>
        </div>
      </div>
    );
  }

  const bonusAmount = Math.floor(campaign.tokenAmount * campaign.referralBonus / 100);
  const isExpired = new Date() > campaign.endDate;

  return (
    <div className="min-h-screen pt-20">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          {/* Hero Section */}
          <div className="card text-center mb-8">
            <Gift className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">You've Been Invited!</h1>
            <p className="text-lg text-gray-600 mb-6">
              Someone has shared an exclusive airdrop opportunity with you
            </p>
            
            <div className="bg-indigo-50 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-bold text-indigo-900 mb-2">{campaign.name}</h2>
              <p className="text-indigo-700 mb-4">{campaign.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {campaign.tokenAmount} {campaign.tokenSymbol}
                  </div>
                  <div className="text-sm text-indigo-600">Base Reward</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    +{bonusAmount} {campaign.tokenSymbol}
                  </div>
                  <div className="text-sm text-purple-600">Referral Bonus</div>
                </div>
              </div>
            </div>

            <div className="success mb-6">
              <TrendingUp className="w-5 h-5 inline mr-2" />
              You'll receive <strong>{campaign.tokenAmount + bonusAmount} {campaign.tokenSymbol}</strong> total!
            </div>

            {isExpired ? (
              <div className="error">
                This campaign has expired and is no longer accepting new claims.
              </div>
            ) : !isConnected ? (
              <div>
                <p className="text-gray-600 mb-4">Connect your wallet to claim your bonus tokens</p>
                <div className="text-indigo-600 font-semibold">👆 Use the connect button above</div>
              </div>
            ) : (
              <a 
                href={`/claim/${campaign.id}`}
                className="btn-primary"
              >
                Claim Your Tokens
                <Gift className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Referral Stats */}
          <div className="card">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Users className="w-6 h-6" />
              Referral Activity
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{referral.uses}</div>
                <div className="text-sm text-purple-600">People Referred</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{referral.bonusEarned}</div>
                <div className="text-sm text-green-600">Bonus Tokens Earned</div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                This referral link was shared by: <br />
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  {referral.walletAddress.slice(0, 6)}...{referral.walletAddress.slice(-4)}
                </code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralPage;