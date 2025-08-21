import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { Plus, Settings, Users, BarChart3, CheckCircle, Clock } from 'lucide-react';
import { useAirdrop } from '../contexts/AirdropContext';

const AdminPage: React.FC = () => {
  const { isConnected } = useAccount();
  const { campaigns, claims, referrals, createCampaign, verifyClaim, loading } = useAirdrop();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tokenSymbol: '',
    tokenAmount: '',
    totalSupply: '',
    endDate: '',
    requiresPayment: false,
    paymentAmount: '$0',
    referralBonus: '20',
    verificationRequired: false
  });

  const unverifiedClaims = claims.filter(c => !c.verified);
  const totalReferrals = referrals.reduce((sum, r) => sum + r.uses, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCampaign({
        name: formData.name,
        description: formData.description,
        tokenSymbol: formData.tokenSymbol,
        tokenAmount: parseInt(formData.tokenAmount),
        totalSupply: parseInt(formData.totalSupply),
        startDate: new Date(),
        endDate: new Date(formData.endDate),
        requiresPayment: formData.requiresPayment,
        paymentAmount: formData.requiresPayment ? formData.paymentAmount : '$0',
        isActive: true,
        referralBonus: parseInt(formData.referralBonus),
        verificationRequired: formData.verificationRequired
      });
      setShowCreateForm(false);
      setFormData({
        name: '',
        description: '',
        tokenSymbol: '',
        tokenAmount: '',
        totalSupply: '',
        endDate: '',
        requiresPayment: false,
        paymentAmount: '$0',
        referralBonus: '20',
        verificationRequired: false
      });
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  const handleVerifyClaim = async (claimId: string) => {
    try {
      await verifyClaim(claimId);
    } catch (error) {
      console.error('Failed to verify claim:', error);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen pt-20">
        <div className="container">
          <div className="card text-center">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
            <p className="text-gray-600">Connect your wallet to access admin features</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Admin Dashboard</h1>
          
          {/* Stats */}
          <div className="stats-grid mb-8">
            <div className="stat-card">
              <div className="stat-value">{campaigns.length}</div>
              <div className="stat-label">Total Campaigns</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{claims.length}</div>
              <div className="stat-label">Total Claims</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{totalReferrals}</div>
              <div className="stat-label">Total Referrals</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{unverifiedClaims.length}</div>
              <div className="stat-label">Pending Verification</div>
            </div>
          </div>

          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            Create New Campaign
          </button>
        </div>

        {/* Create Campaign Form */}
        {showCreateForm && (
          <div className="card mb-8">
            <h2 className="text-2xl font-bold mb-6">Create New Campaign</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Campaign Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Token Symbol</label>
                  <input
                    type="text"
                    value={formData.tokenSymbol}
                    onChange={(e) => setFormData({...formData, tokenSymbol: e.target.value})}
                    className="input"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="input"
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tokens per Claim</label>
                  <input
                    type="number"
                    value={formData.tokenAmount}
                    onChange={(e) => setFormData({...formData, tokenAmount: e.target.value})}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Total Supply</label>
                  <input
                    type="number"
                    value={formData.totalSupply}
                    onChange={(e) => setFormData({...formData, totalSupply: e.target.value})}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Referral Bonus (%)</label>
                  <input
                    type="number"
                    value={formData.referralBonus}
                    onChange={(e) => setFormData({...formData, referralBonus: e.target.value})}
                    className="input"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="input"
                  required
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="requiresPayment"
                    checked={formData.requiresPayment}
                    onChange={(e) => setFormData({...formData, requiresPayment: e.target.checked})}
                  />
                  <label htmlFor="requiresPayment" className="text-sm font-medium">Requires Payment</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="verificationRequired"
                    checked={formData.verificationRequired}
                    onChange={(e) => setFormData({...formData, verificationRequired: e.target.checked})}
                  />
                  <label htmlFor="verificationRequired" className="text-sm font-medium">Manual Verification</label>
                </div>
              </div>
              
              {formData.requiresPayment && (
                <div>
                  <label className="block text-sm font-medium mb-2">Payment Amount</label>
                  <input
                    type="text"
                    value={formData.paymentAmount}
                    onChange={(e) => setFormData({...formData, paymentAmount: e.target.value})}
                    placeholder="e.g., $2"
                    className="input"
                    required
                  />
                </div>
              )}
              
              <div className="flex gap-4">
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? <div className="loading"></div> : 'Create Campaign'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowCreateForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Pending Verifications */}
        {unverifiedClaims.length > 0 && (
          <div className="card mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Pending Verifications
            </h2>
            <div className="space-y-4">
              {unverifiedClaims.map(claim => {
                const campaign = campaigns.find(c => c.id === claim.campaignId);
                return (
                  <div key={claim.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{campaign?.name}</div>
                        <div className="text-sm text-gray-600">
                          Wallet: {claim.walletAddress.slice(0, 6)}...{claim.walletAddress.slice(-4)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Amount: {claim.amount} {campaign?.tokenSymbol}
                        </div>
                        <div className="text-sm text-gray-600">
                          Claimed: {claim.claimedAt.toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        onClick={() => handleVerifyClaim(claim.id)}
                        className="btn-primary"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Verify
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Campaigns List */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Campaign Performance
          </h2>
          <div className="space-y-4">
            {campaigns.map(campaign => {
              const campaignClaims = claims.filter(c => c.campaignId === campaign.id);
              const campaignReferrals = referrals.filter(r => r.campaignId === campaign.id);
              const progress = (campaign.claimedAmount / campaign.totalSupply) * 100;
              
              return (
                <div key={campaign.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{campaign.name}</h3>
                      <p className="text-gray-600">{campaign.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      campaign.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">{campaignClaims.length}</div>
                      <div className="text-sm text-gray-500">Total Claims</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{campaignReferrals.length}</div>
                      <div className="text-sm text-gray-500">Referral Codes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{campaign.claimedAmount.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Tokens Claimed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{progress.toFixed(1)}%</div>
                      <div className="text-sm text-gray-500">Progress</div>
                    </div>
                  </div>
                  
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;