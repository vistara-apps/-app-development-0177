import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Gift, Users, TrendingUp, Clock, DollarSign, CheckCircle, AlertTriangle } from 'lucide-react';
import { Campaign } from '../contexts/AirdropContext';

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const progress = (campaign.claimedAmount / campaign.totalSupply) * 100;
  const isExpired = new Date() > campaign.endDate;
  const daysLeft = Math.ceil((campaign.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  // Calculate remaining claims
  const remainingClaims = Math.floor((campaign.totalSupply - campaign.claimedAmount) / campaign.tokenAmount);

  return (
    <div className="card">
      {/* Campaign Status Badge */}
      <div className="absolute top-4 right-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
          campaign.isActive && !isExpired 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {campaign.isActive && !isExpired ? (
            <>
              <CheckCircle className="w-3 h-3" />
              Active
            </>
          ) : (
            <>
              <AlertTriangle className="w-3 h-3" />
              Ended
            </>
          )}
        </span>
      </div>
      
      {/* Campaign Header */}
      <div className="flex items-start gap-3 mb-4 pr-20">
        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
          <Gift className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-1">{campaign.name}</h3>
          <p className="text-gray-600">{campaign.description}</p>
        </div>
      </div>
      
      {/* Campaign Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-indigo-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-indigo-600">
            {campaign.tokenAmount} {campaign.tokenSymbol}
          </div>
          <div className="text-sm text-gray-600 font-medium">Base Reward</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-600">
            +{campaign.referralBonus}%
          </div>
          <div className="text-sm text-gray-600 font-medium">Referral Bonus</div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-gray-700">Distribution Progress</span>
          <span className="text-gray-600">{Math.round(progress)}% Complete</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }}></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{campaign.claimedAmount.toLocaleString()} claimed</span>
          <span>{campaign.totalSupply.toLocaleString()} total</span>
        </div>
      </div>
      
      {/* Campaign Details */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2 text-gray-700">
          <Clock className="w-4 h-4 text-indigo-500" />
          <span className="text-sm">
            {isExpired ? 'Expired' : `${daysLeft} days left`}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Users className="w-4 h-4 text-purple-500" />
          <span className="text-sm">
            {remainingClaims} claims left
          </span>
        </div>
        {campaign.requiresPayment && (
          <div className="flex items-center gap-2 text-gray-700 col-span-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">
              Requires {campaign.paymentAmount} payment
            </span>
          </div>
        )}
        {campaign.verificationRequired && (
          <div className="flex items-center gap-2 text-gray-700 col-span-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-sm">
              Requires verification
            </span>
          </div>
        )}
      </div>
      
      {/* Call to Action */}
      <div className="flex gap-2">
        <Link 
          to={`/claim/${campaign.id}`}
          className={`btn-primary flex-1 text-center ${
            !campaign.isActive || isExpired ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
          {campaign.isActive && !isExpired ? 'Claim Tokens' : 'Campaign Ended'}
          {campaign.isActive && !isExpired && <Gift className="w-4 h-4" />}
        </Link>
      </div>
    </div>
  );
};

export default CampaignCard;
