import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCopy, FiShare2, FiGift, FiCheck } from "react-icons/fi";
import { useReferrals, useRedeemReward } from "../hooks/useReferrals";
import { PrimaryButton, SecondaryButton, GhostButton } from "../../../components/ui/Button";
import { LoadingSpinner, ErrorState } from "../../../components/ui/LoadingSpinner";
import Container from "../../../components/layout/Container";
import usePageTitle from "../../../app/hooks/usePageTitle";
import { toast } from "react-hot-toast";
import { devices } from "../../../styles/GlobalStyles";

const ReferralsPage = () => {
  usePageTitle("Referrals - BenzFlex", "Invite friends and earn rewards");
  const navigate = useNavigate();
  const { data, isLoading, error } = useReferrals();
  const { mutate: redeemReward, isPending: isRedeeming } = useRedeemReward();
  const [redeemAmount, setRedeemAmount] = useState("");
  const [copied, setCopied] = useState(false);

  const referralData = data?.data || {};
  const { referralCode, referralRewards = 0, shareLink, referrals = [] } = referralData;

  const handleCopy = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast.success("Referral code copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    if (navigator.share && shareLink) {
      navigator.share({
        title: "Join BenzFlex - Premium Car Rentals",
        text: `Use my referral code ${referralCode} to get started!`,
        url: shareLink,
      }).catch(() => {
        handleCopy();
      });
    } else {
      handleCopy();
    }
  };

  const handleRedeem = () => {
    const amount = parseFloat(redeemAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amount > referralRewards) {
      toast.error("Insufficient rewards");
      return;
    }
    redeemReward(amount);
    setRedeemAmount("");
  };

  if (isLoading) {
    return (
      <Container>
        <PageContainer>
          <LoadingSpinner size="lg" message="Loading referral information..." />
        </PageContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <PageContainer>
          <ErrorState
            title="Failed to Load Referrals"
            message={error?.response?.data?.message || "Unable to load referral information."}
            actions={[
              { text: "Go Back", onClick: () => navigate(-1), variant: "secondary" },
            ]}
          />
        </PageContainer>
      </Container>
    );
  }

  return (
    <Container>
      <PageContainer>
        <PageHeader>
          <GhostButton onClick={() => navigate(-1)} aria-label="Go back">
            <FiArrowLeft /> Back
          </GhostButton>
          <h1>Referrals & Rewards</h1>
        </PageHeader>

        <ReferralCard>
          <CardHeader>
            <FiGift size={24} color="var(--primary)" />
            <h2>Your Referral Code</h2>
          </CardHeader>
          <CodeDisplay>
            <CodeText>{referralCode || "Loading..."}</CodeText>
            <CopyButton onClick={handleCopy} $copied={copied}>
              {copied ? <FiCheck size={18} /> : <FiCopy size={18} />}
              {copied ? "Copied!" : "Copy"}
            </CopyButton>
          </CodeDisplay>
          <ShareButton onClick={handleShare}>
            <FiShare2 size={18} /> Share Link
          </ShareButton>
        </ReferralCard>

        <RewardsCard>
          <RewardsHeader>
            <h2>Your Rewards</h2>
            <RewardsAmount>${referralRewards.toFixed(2)}</RewardsAmount>
          </RewardsHeader>
          <RewardsInfo>
            <p>Earn $10 for each friend who signs up using your code</p>
          </RewardsInfo>
          {referralRewards > 0 && (
            <RedeemSection>
              <RedeemInput
                type="number"
                placeholder="Enter amount to redeem"
                value={redeemAmount}
                onChange={(e) => setRedeemAmount(e.target.value)}
                min="0"
                max={referralRewards}
                step="0.01"
              />
              <PrimaryButton onClick={handleRedeem} disabled={isRedeeming || !redeemAmount}>
                {isRedeeming ? "Redeeming..." : "Redeem"}
              </PrimaryButton>
            </RedeemSection>
          )}
        </RewardsCard>

        <ReferralsList>
          <h2>Referral History</h2>
          {referrals.length === 0 ? (
            <EmptyMessage>No referrals yet. Share your code to start earning!</EmptyMessage>
          ) : (
            <ReferralsTable>
              <thead>
                <tr>
                  <th>Friend</th>
                  <th>Status</th>
                  <th>Reward</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((ref) => (
                  <tr key={ref._id}>
                    <td>{ref.referred?.fullName || ref.referred?.email || "User"}</td>
                    <td>
                      <StatusBadge $status={ref.status}>{ref.status}</StatusBadge>
                    </td>
                    <td>${ref.rewardAmount?.toFixed(2) || "0.00"}</td>
                    <td>{new Date(ref.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </ReferralsTable>
          )}
        </ReferralsList>
      </PageContainer>
    </Container>
  );
};

const PageContainer = styled.div`
  padding: var(--space-2xl) 0;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: var(--space-2xl);
  display: flex;
  align-items: center;
  gap: var(--space-lg);

  h1 {
    font-size: var(--text-3xl);
    font-weight: var(--font-bold);
    color: var(--text-primary);
    margin: 0;
  }
`;

const ReferralCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--space-2xl);
  margin-bottom: var(--space-xl);
  box-shadow: var(--shadow-md);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);

  h2 {
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    margin: 0;
  }
`;

const CodeDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
  padding: var(--space-lg);
  background: var(--gray-50);
  border-radius: var(--radius-lg);
`;

const CodeText = styled.div`
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  font-family: monospace;
  color: var(--primary);
  flex: 1;
`;

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  background: ${(props) => (props.$copied ? "var(--success)" : "var(--primary)")};
  color: var(--white);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: var(--font-medium);
  transition: all var(--transition-normal);

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

const ShareButton = styled(SecondaryButton)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
`;

const RewardsCard = styled(ReferralCard)``;

const RewardsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);

  h2 {
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    margin: 0;
  }
`;

const RewardsAmount = styled.div`
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--primary);
`;

const RewardsInfo = styled.div`
  margin-bottom: var(--space-lg);
  color: var(--text-secondary);
`;

const RedeemSection = styled.div`
  display: flex;
  gap: var(--space-md);
  margin-top: var(--space-lg);

  @media ${devices.sm} {
    flex-direction: column;
  }
`;

const RedeemInput = styled.input`
  flex: 1;
  padding: var(--space-md);
  border: 2px solid var(--gray-300);
  border-radius: var(--radius-md);
  font-size: var(--text-base);

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const ReferralsList = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--space-2xl);
  box-shadow: var(--shadow-md);

  h2 {
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    margin-bottom: var(--space-lg);
  }
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: var(--text-secondary);
  padding: var(--space-xl);
`;

const ReferralsTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: var(--space-md);
    text-align: left;
    border-bottom: 1px solid var(--gray-200);
  }

  th {
    font-weight: var(--font-semibold);
    color: var(--text-secondary);
    font-size: var(--text-sm);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  td {
    color: var(--text-primary);
  }

  @media ${devices.sm} {
    font-size: var(--text-sm);

    th,
    td {
      padding: var(--space-sm);
    }
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  text-transform: capitalize;
  background: ${(props) => {
    switch (props.$status) {
      case "completed":
      case "rewarded":
        return "#f0fdf4";
      case "pending":
        return "#fef3c7";
      default:
        return "#f3f4f6";
    }
  }};
  color: ${(props) => {
    switch (props.$status) {
      case "completed":
      case "rewarded":
        return "#10b981";
      case "pending":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  }};
`;

export default ReferralsPage;

