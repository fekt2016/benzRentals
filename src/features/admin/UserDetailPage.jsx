import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaArrowLeft, FaEdit, FaTrash, FaUser } from "react-icons/fa";
import { useGetUserById } from "../../features/users/useUser";
import { Card, LuxuryCard } from "../../features/cars/Card";
import { PrimaryButton, SecondaryButton, GhostButton } from "../../components/ui/Button";
import { LoadingSpinner, ErrorState } from "../../components/ui/LoadingSpinner";


const UserDetailPage = () => {
  const { userId:id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useGetUserById(id);
  const user = data?.data?.data || data?.data || null;

  if (isLoading)
    return (
      <Centered>
        <LoadingSpinner size="xl" />
      </Centered>
    );

  if (isError || !user)
    return (
      <Centered>
        <ErrorState
          title="User Not Found"
          message={error?.message || "Unable to load user details."}
          action={<PrimaryButton onClick={() => navigate(-1)}>Go Back</PrimaryButton>}
        />
      </Centered>
    );

  return (
    <Container>
      {/* Header */}
      <PageHeader>
        <HeaderContent>
          <HeaderLeft>
            <GhostButton onClick={() => navigate(-1)}>
              <FaArrowLeft /> Back
            </GhostButton>
            <Title>User Details</Title>
          </HeaderLeft>
          <HeaderActions>
            <SecondaryButton>
              <FaEdit /> Edit
            </SecondaryButton>
            <PrimaryButton $danger>
              <FaTrash /> Delete
            </PrimaryButton>
          </HeaderActions>
        </HeaderContent>
      </PageHeader>

      {/* Content */}
      <ContentGrid>
        {/* User Overview */}
        <LuxuryCard>
          <Section>
            <CardTitle>
              <FaUser /> Basic Information
            </CardTitle>

            <ProfileHeader>
              <Avatar>
                {user.fullName?.charAt(0).toUpperCase() || <FaUser />}
              </Avatar>
              <UserName>{user.fullName}</UserName>
              <UserEmail>{user.email}</UserEmail>
              <StatusPill data-status={user.active ? "active" : "inactive"}>
                {user.active ? "Active" : "Inactive"}
              </StatusPill>
            </ProfileHeader>

            <InfoGrid>
              <InfoItem>
                <Label>Phone</Label>
                <Value>{user.phone || "N/A"}</Value>
              </InfoItem>
              <InfoItem>
                <Label>Role</Label>
                <Value>{user.role}</Value>
              </InfoItem>
              <InfoItem>
                <Label>Created At</Label>
                <Value>{new Date(user.createdAt).toLocaleString()}</Value>
              </InfoItem>
              <InfoItem>
                <Label>Updated At</Label>
                <Value>{new Date(user.updatedAt).toLocaleString()}</Value>
              </InfoItem>
              {user.createdBy && (
                <InfoItem>
                  <Label>Created By</Label>
                  <Value>{user.createdBy?.fullName || "Admin"}</Value>
                </InfoItem>
              )}
            </InfoGrid>
          </Section>
        </LuxuryCard>

        {/* Account Info */}
        <Card>
          <Section>
            <CardTitle>Account Details</CardTitle>
            <InfoGrid>
              <InfoItem>
                <Label>Email Verified</Label>
                <Value>{user.emailVerified ? "Yes" : "No"}</Value>
              </InfoItem>
              <InfoItem>
                <Label>Login Attempts</Label>
                <Value>{user.loginAttempts || 0}</Value>
              </InfoItem>
              <InfoItem>
                <Label>Last Login</Label>
                <Value>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}</Value>
              </InfoItem>
              <InfoItem>
                <Label>Blocked</Label>
                <Value>{user.blocked ? "Yes" : "No"}</Value>
              </InfoItem>
            </InfoGrid>
          </Section>
        </Card>
      </ContentGrid>
    </Container>
  );
};

export default UserDetailPage;

/* -------------------- Styles -------------------- */
const Container = styled.div`
  padding: var(--space-xl);
  background: var(--surface);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
`;

const Centered = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
`;

const PageHeader = styled.div`
  background: var(--white);
  border-radius: var(--radius-2xl);
  padding: var(--space-xl);
  box-shadow: var(--shadow-md);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-md);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`;

const HeaderActions = styled.div`
  display: flex;
  gap: var(--space-md);
`;

const Title = styled.h1`
  font-size: var(--text-3xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: var(--space-xl);
  
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
 padding: 1rem;
`;

const CardTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  text-align: center;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  background: var(--gradient-primary);
  border-radius: 50%;
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
`;

const UserName = styled.h3`
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
`;

const UserEmail = styled.span`
  font-size: var(--text-sm);
  color: var(--text-muted);
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--space-lg);
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`;

const Label = styled.span`
  color: var(--text-muted);
  font-size: var(--text-xs);
  text-transform: uppercase;
  font-weight: var(--font-medium);
`;

const Value = styled.span`
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--text-primary);
`;

const StatusPill = styled.span`
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  &[data-status="active"] {
    background: #d1fae5;
    color: #065f46;
  }
  &[data-status="inactive"] {
    background: #fee2e2;
    color: #991b1b;
  }
`;

// const ErrorContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: var(--space-lg);
//   align-items: center;
//   text-align: center;
// `;

// const BackButton = styled(GhostButton)`
//   display: flex;
//   align-items: center;
//   gap: var(--space-xs);
// `;
