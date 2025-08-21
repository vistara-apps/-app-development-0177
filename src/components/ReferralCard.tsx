import React, { useState } from 'react';
import { Share2, Copy, QrCode, ExternalLink } from 'lucide-react';
import { useAirdrop } from '../contexts/AirdropContext';

interface ReferralCardProps {
  campaignId: string;
  campaignName: string;
}

const ReferralCard: React.FC<ReferralCardProps> = ({ campaignId, campaignName }) => {
  const { generateReferralCode, getUserReferrals } = useAirdrop();
  const [referralCode, setReferralCode] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const userReferrals = getUserReferrals(campaignId);
  const existingReferral = userReferrals.find(r => r.campaignId === campaignId);

  React.useEffect(() => {
    if (existingReferral) {
      setReferralCode(existingReferral.code);
    }
  }, [existingReferral]);

  const handleGenerateCode = async () => {
    if (referralCode) return;
    
    setLoading(true);
    try {
      const code = await generateReferralCode(campaignId);
      setReferralCode(code);
    } catch (error) {
      console.error('Failed to generate referral code:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    const referralLink = `${window.location.origin}/referral/${referralCode}`;
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const referralLink = referralCode ? `${window.location.origin}/referral/${referralCode}` : '';

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-bold">Referral Program</h3>
      </div>
      
      <p className="text-gray-600 mb-4">
        Share your referral link and earn bonus tokens when friends claim through your link!
      </p>
      
      {!referralCode ? (
        <button 
          onClick={handleGenerateCode}
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? <div className="loading"></div> : 'Generate Referral Code'}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="referral-code">
            {referralCode}
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleCopy}
              className="btn-secondary flex-1"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <a 
              href={`https://twitter.com/intent/tweet?text=Check out this amazing airdrop opportunity!&url=${encodeURIComponent(referralLink)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <ExternalLink className="w-4 h-4" />
              Share
            </a>
          </div>
          
          {existingReferral && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-600">{existingReferral.uses}</div>
                  <div className="text-sm text-gray-600">Referrals</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{existingReferral.bonusEarned}</div>
                  <div className="text-sm text-gray-600">Bonus Earned</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReferralCard;