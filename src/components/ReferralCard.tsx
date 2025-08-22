import React, { useState } from 'react';
import { Share2, Copy, QrCode, ExternalLink, Twitter, Facebook, Mail, Link as LinkIcon, CheckCircle, Award } from 'lucide-react';
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
  const [showQR, setShowQR] = useState(false);

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

  const toggleQRCode = () => {
    setShowQR(!showQR);
  };

  const referralLink = referralCode ? `${window.location.origin}/referral/${referralCode}` : '';

  return (
    <div className="card">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
          <Share2 className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-1">Referral Program</h3>
          <p className="text-gray-600">
            Share your referral link and earn bonus tokens when friends claim through your link!
          </p>
        </div>
      </div>
      
      {!referralCode ? (
        <div className="bg-purple-50 rounded-lg p-6 text-center mb-4">
          <Award className="w-12 h-12 text-purple-500 mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Earn Bonus Tokens</h4>
          <p className="text-gray-600 mb-4">Generate your unique referral code and share it with friends to earn bonus tokens!</p>
          <button 
            onClick={handleGenerateCode}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <>
                <div className="loading"></div>
                Generating Code...
              </>
            ) : (
              <>
                Generate Referral Code
                <LinkIcon className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Referral Code Display */}
          <div onClick={handleCopy} className="referral-code">
            {referralCode}
          </div>
          
          {/* QR Code Section (Placeholder) */}
          {showQR && (
            <div className="bg-white p-4 rounded-lg text-center border-2 border-dashed border-purple-200">
              <div className="w-48 h-48 mx-auto bg-gray-100 rounded-md flex items-center justify-center">
                <QrCode className="w-24 h-24 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mt-2">Scan this QR code to access the referral link</p>
            </div>
          )}
          
          {/* Sharing Options */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleCopy}
              className="btn-secondary"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <button
              onClick={toggleQRCode}
              className="btn-secondary"
            >
              <QrCode className="w-4 h-4" />
              {showQR ? 'Hide QR Code' : 'Show QR Code'}
            </button>
          </div>
          
          {/* Social Sharing */}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Share via:</div>
            <div className="flex gap-2">
              <a 
                href={`https://twitter.com/intent/tweet?text=Join me on ${campaignName} and get free tokens! Use my referral link:&url=${encodeURIComponent(referralLink)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex-1 bg-[#1DA1F2] text-white border-[#1DA1F2] hover:bg-[#1a94e0] hover:border-[#1a94e0]"
                aria-label="Share on Twitter"
              >
                <Twitter className="w-4 h-4" />
                Twitter
              </a>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex-1 bg-[#4267B2] text-white border-[#4267B2] hover:bg-[#3b5998] hover:border-[#3b5998]"
                aria-label="Share on Facebook"
              >
                <Facebook className="w-4 h-4" />
                Facebook
              </a>
              <a 
                href={`mailto:?subject=Join me on ${campaignName}&body=Use my referral link to claim free tokens: ${referralLink}`}
                className="btn-secondary flex-1"
                aria-label="Share via Email"
              >
                <Mail className="w-4 h-4" />
                Email
              </a>
            </div>
          </div>
          
          {/* Referral Stats */}
          {existingReferral && (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-5 rounded-lg border border-purple-100">
              <h4 className="text-center font-semibold text-gray-800 mb-3 flex items-center justify-center gap-2">
                <Award className="w-5 h-5 text-purple-500" />
                Your Referral Stats
              </h4>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">{existingReferral.uses}</div>
                  <div className="text-sm font-medium text-gray-600">Friends Referred</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-indigo-600">{existingReferral.bonusEarned}</div>
                  <div className="text-sm font-medium text-gray-600">Bonus Tokens</div>
                </div>
              </div>
              {existingReferral.uses > 0 && (
                <div className="text-center mt-3 text-sm text-green-600 flex items-center justify-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Your referral link is working!
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReferralCard;
