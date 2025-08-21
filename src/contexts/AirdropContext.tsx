import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

export interface Campaign {
  id: string;
  name: string;
  description: string;
  tokenSymbol: string;
  tokenAmount: number;
  totalSupply: number;
  claimedAmount: number;
  startDate: Date;
  endDate: Date;
  requiresPayment: boolean;
  paymentAmount: string;
  isActive: boolean;
  referralBonus: number; // percentage
  verificationRequired: boolean;
}

export interface Claim {
  id: string;
  campaignId: string;
  walletAddress: string;
  amount: number;
  referralCode?: string;
  referredBy?: string;
  claimedAt: Date;
  txHash?: string;
  verified: boolean;
}

export interface Referral {
  code: string;
  walletAddress: string;
  campaignId: string;
  uses: number;
  bonusEarned: number;
  createdAt: Date;
}

interface AirdropContextType {
  campaigns: Campaign[];
  claims: Claim[];
  referrals: Referral[];
  createCampaign: (campaign: Omit<Campaign, 'id' | 'claimedAmount'>) => Promise<void>;
  claimTokens: (campaignId: string, referralCode?: string) => Promise<void>;
  generateReferralCode: (campaignId: string) => Promise<string>;
  verifyClaim: (claimId: string) => Promise<void>;
  getUserClaims: (walletAddress: string) => Claim[];
  getUserReferrals: (walletAddress: string) => Referral[];
  loading: boolean;
  error: string | null;
}

const AirdropContext = createContext<AirdropContextType | undefined>(undefined);

export const useAirdrop = () => {
  const context = useContext(AirdropContext);
  if (!context) {
    throw new Error('useAirdrop must be used within an AirdropProvider');
  }
  return context;
};

export const AirdropProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address } = useAccount();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize with sample data
  useEffect(() => {
    const sampleCampaigns: Campaign[] = [
      {
        id: 'camp-1',
        name: 'Token Launch Airdrop',
        description: 'Get free tokens for early supporters of our platform',
        tokenSymbol: 'TLA',
        tokenAmount: 100,
        totalSupply: 1000000,
        claimedAmount: 45000,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        requiresPayment: true,
        paymentAmount: '$2',
        isActive: true,
        referralBonus: 20,
        verificationRequired: true
      },
      {
        id: 'camp-2',
        name: 'Community Rewards',
        description: 'Reward loyal community members with bonus tokens',
        tokenSymbol: 'CRW',
        tokenAmount: 50,
        totalSupply: 500000,
        claimedAmount: 12000,
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-06-30'),
        requiresPayment: false,
        paymentAmount: '$0',
        isActive: true,
        referralBonus: 15,
        verificationRequired: false
      }
    ];
    setCampaigns(sampleCampaigns);
  }, []);

  const createCampaign = async (campaignData: Omit<Campaign, 'id' | 'claimedAmount'>) => {
    setLoading(true);
    setError(null);
    try {
      const newCampaign: Campaign = {
        ...campaignData,
        id: `camp-${Date.now()}`,
        claimedAmount: 0
      };
      setCampaigns(prev => [...prev, newCampaign]);
    } catch (err) {
      setError('Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  const claimTokens = async (campaignId: string, referralCode?: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    setLoading(true);
    setError(null);
    try {
      const campaign = campaigns.find(c => c.id === campaignId);
      if (!campaign) throw new Error('Campaign not found');

      // Check if already claimed
      const existingClaim = claims.find(c => c.campaignId === campaignId && c.walletAddress === address);
      if (existingClaim) throw new Error('Already claimed for this campaign');

      let amount = campaign.tokenAmount;
      let referredBy: string | undefined;

      // Apply referral bonus
      if (referralCode) {
        const referral = referrals.find(r => r.code === referralCode && r.campaignId === campaignId);
        if (referral && referral.walletAddress !== address) {
          amount = Math.floor(amount * (1 + campaign.referralBonus / 100));
          referredBy = referral.walletAddress;
          
          // Update referral stats
          setReferrals(prev => prev.map(r => 
            r.code === referralCode ? {
              ...r,
              uses: r.uses + 1,
              bonusEarned: r.bonusEarned + (amount - campaign.tokenAmount)
            } : r
          ));
        }
      }

      const newClaim: Claim = {
        id: `claim-${Date.now()}`,
        campaignId,
        walletAddress: address,
        amount,
        referralCode,
        referredBy,
        claimedAt: new Date(),
        verified: !campaign.verificationRequired
      };

      setClaims(prev => [...prev, newClaim]);
      setCampaigns(prev => prev.map(c => 
        c.id === campaignId ? { ...c, claimedAmount: c.claimedAmount + amount } : c
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim tokens');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generateReferralCode = async (campaignId: string): Promise<string> => {
    if (!address) throw new Error('Wallet not connected');
    
    setLoading(true);
    try {
      // Check if referral code already exists
      const existingReferral = referrals.find(r => r.campaignId === campaignId && r.walletAddress === address);
      if (existingReferral) return existingReferral.code;

      const code = `REF-${address.slice(2, 8).toUpperCase()}-${campaignId.slice(-4).toUpperCase()}`;
      const newReferral: Referral = {
        code,
        walletAddress: address,
        campaignId,
        uses: 0,
        bonusEarned: 0,
        createdAt: new Date()
      };

      setReferrals(prev => [...prev, newReferral]);
      return code;
    } finally {
      setLoading(false);
    }
  };

  const verifyClaim = async (claimId: string) => {
    setLoading(true);
    try {
      setClaims(prev => prev.map(c => 
        c.id === claimId ? { ...c, verified: true } : c
      ));
    } finally {
      setLoading(false);
    }
  };

  const getUserClaims = (walletAddress: string) => {
    return claims.filter(c => c.walletAddress === walletAddress);
  };

  const getUserReferrals = (walletAddress: string) => {
    return referrals.filter(r => r.walletAddress === walletAddress);
  };

  return (
    <AirdropContext.Provider value={{
      campaigns,
      claims,
      referrals,
      createCampaign,
      claimTokens,
      generateReferralCode,
      verifyClaim,
      getUserClaims,
      getUserReferrals,
      loading,
      error
    }}>
      {children}
    </AirdropContext.Provider>
  );
};