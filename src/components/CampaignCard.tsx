import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Gift, Users, TrendingUp } from 'lucide-react';
import { Campaign } from '../contexts/AirdropContext';

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const progress = (campaign.claimedAmount / campaign.totalSupply) * 100;
  const isExpired = new Date() > campaign.endDate;
  const daysLeft = Math.ceil((campaign.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <Gift className="w-6 h-6 text-indigo-600" />
          <h3 className="text-xl font-bold">{campaign.name}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          campaign.isActive && !isExpired 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {campaign.isActive && !isExpired ? 'Active' : 'Ended'}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4">{campaign.description}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600">
            {campaign.tokenAmount} {campaign.tokenSymbol}
          </div>
          <div className="text-sm text-gray-500">Per Claim</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            +{campaign.referralBonus}%
          </div>
          <div className="text-sm text-gray-500">Referral Bonus</div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span>Progress</span>
          <span>{campaign.claimedAmount.toLocaleString()} / {campaign.totalSupply.toLocaleString()}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }}></div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {isExpired ? 'Expired' : `${daysLeft} days left`}
        </div>
        {campaign.requiresPayment && (
          <div className="text-indigo-600 font-medium">
            Requires {campaign.paymentAmount}
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <Link 
          to={`/claim/${campaign.id}`}
          className={`btn-primary flex-1 text-center ${
            !campaign.isActive || isExpired ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
          Claim Tokens
        </Link>
      </div>
    </div>
  );
};

export default CampaignCard;