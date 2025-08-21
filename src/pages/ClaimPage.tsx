import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { Gift, Clock, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAirdrop } from '../contexts/AirdropContext';
import { usePaymentContext } from '../hooks/usePaymentContext';
import ReferralCard from '../components/ReferralCard';

const ClaimPage: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { isConnected, address } = useAccount();
  const { campaigns, claims, claimTokens, getUserClaims, loading, error } = useAirdrop();
  const { createSession } = usePaymentContext();
  
  const [claimStatus, setClaimStatus] = useState<'idle' | 'payment' | 'claiming' | 'success' | 'error'>('idle');
  const [referralCode, setReferralCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const campaign = campaigns.find(c => c.id === campaignId);
  const userClaims = address ? getUserClaims(address) : [];
  const hasClaimed = userClaims.some(c => c.campaignId === campaignId);

  if (!campaign) {
    return <Navigate to="/" replace />;
  }

  const isExpired = new Date() > campaign.endDate;
  const daysLeft = Math.ceil((campaign.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const canClaim = isConnected && campaign.isActive && !isExpired && !hasClaimed;

  const handleClaim = async () => {
    if (!canClaim) return;

    setClaimStatus('claiming');
    setErrorMessage('');

    try {
      // Handle payment if required
      if (campaign.requiresPayment && claimStatus !== 'payment') {
        setClaimStatus('payment');
        await createSession(campaign.paymentAmount);
        setClaimStatus('claiming');
      }

      await claimTokens(campaignId!, referralCode || undefined);
      setClaimStatus('success');
    } catch (err) {
      setClaimStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to claim tokens');
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Campaign Header */}
          <div className="card mb-8">
            <div className="flex items-start gap-4 mb-6">
              <Gift className="w-12 h-12 text-indigo-600" />
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{campaign.name}</h1>
                <p className="text-gray-600 text-lg">{campaign.description}</p>
              </div>
              <span className={`px-4 py-2 rounded-full font-medium ${
                campaign.isActive && !isExpired 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {campaign.isActive && !isExpired ? 'Active' : 'Ended'}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {campaign.tokenAmount} {campaign.tokenSymbol}
                </div>
                <div className="text-sm text-gray-500">Base Reward</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  +{campaign.referralBonus}%
                </div>
                <div className="text-sm text-gray-500">Referral Bonus</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {((campaign.totalSupply - campaign.claimedAmount) / campaign.tokenAmount).toFixed(0)}
                </div>
                <div className="text-sm text-gray-500">Claims Left</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {isExpired ? 'Expired' : `${daysLeft}d`}
                </div>
                <div className="text-sm text-gray-500">Time Left</div>
              </div>
            </div>

            {campaign.requiresPayment && (
              <div className="warning mb-6">
                <AlertTriangle className="w-5 h-5 inline mr-2" />
                This campaign requires a payment of {campaign.paymentAmount} to claim tokens.
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Claim Section */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Claim Your Tokens</h2>
              
              {!isConnected ? (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-4">Connect your wallet to claim tokens</div>
                  <div className="text-indigo-600 font-semibold">👆 Use the connect button above</div>
                </div>
              ) : hasClaimed ? (
                <div className="success text-center py-8">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4" />
                  <div className="text-xl font-bold mb-2">Already Claimed!</div>
                  <div>You have already claimed tokens for this campaign.</div>
                </div>
              ) : !canClaim ? (
                <div className="error text-center py-8">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
                  <div className="text-xl font-bold mb-2">
                    {isExpired ? 'Campaign Expired' : 'Cannot Claim'}
                  </div>
                  <div>
                    {isExpired ? 'This campaign has ended.' : 'This campaign is not active.'}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Referral Code (Optional)
                    </label>
                    <input
                      type="text"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      placeholder="Enter referral code for bonus tokens"
                      className="input"
                      disabled={claimStatus === 'claiming'}
                    />
                    {referralCode && (
                      <div className="text-sm text-green-600 mt-1">
                        +{Math.floor(campaign.tokenAmount * campaign.referralBonus / 100)} bonus tokens!
                      </div>
                    )}
                  </div>

                  {errorMessage && (
                    <div className="error">
                      {errorMessage}
                    </div>
                  )}

                  {claimStatus === 'success' && (
                    <div className="success text-center py-4">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                      <div className="font-bold">Tokens Claimed Successfully!</div>
                      <div className="text-sm">
                        {referralCode ? 
                          campaign.tokenAmount + Math.floor(campaign.tokenAmount * campaign.referralBonus / 100) :
                          campaign.tokenAmount
                        } {campaign.tokenSymbol} added to your wallet
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleClaim}
                    disabled={claimStatus === 'claiming' || claimStatus === 'success'}
                    className="btn-primary w-full"
                  >
                    {claimStatus === 'claiming' ? (
                      <>
                        <div className="loading"></div>
                        {campaign.requiresPayment ? 'Processing Payment...' : 'Claiming Tokens...'}
                      </>
                    ) : claimStatus === 'success' ? (
                      'Claimed Successfully!'
                    ) : (
                      <>
                        {campaign.requiresPayment ? `Pay ${campaign.paymentAmount} & Claim` : 'Claim Tokens'}
                        <Gift className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Referral Section */}
            {isConnected && (
              <ReferralCard campaignId={campaignId!} campaignName={campaign.name} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimPage;