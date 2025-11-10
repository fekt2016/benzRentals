import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FiHome, FiSearch, FiArrowLeft } from "react-icons/fi";
import { PrimaryButton, SecondaryButton } from "../../components/ui/Button";
import MainLayout from "../../components/layout/MainLayout";
import { devices } from "../../styles/GlobalStyles";
import { PATHS } from "../../config/constants";

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
  text-align: center;
`;

const NotFoundIcon = styled.div`
  font-size: 8rem;
  color: ${({ theme }) => theme.colors.textMuted || "#9ca3af"};
  margin-bottom: 2rem;
  opacity: 0.5;

  @media ${devices.sm} {
    font-size: 5rem;
  }
`;

const NotFoundTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text || "#1f2937"};
  margin: 0 0 1rem 0;

  @media ${devices.sm} {
    font-size: 2rem;
  }
`;

const NotFoundMessage = styled.p`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.textMuted || "#6b7280"};
  margin: 0 0 2rem 0;
  max-width: 600px;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;

  @media ${devices.sm} {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }
`;

const QuickLinks = styled.div`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border || "#e5e7eb"};
  width: 100%;
  max-width: 600px;
`;

const QuickLinksTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text || "#1f2937"};
  margin: 0 0 1rem 0;
`;

const QuickLinksList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
`;

const QuickLink = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.colors.backgroundLight || "#f9fafb"};
  border: 1px solid ${({ theme }) => theme.colors.border || "#e5e7eb"};
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.text || "#1f2937"};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight || "#eff6ff"};
    border-color: ${({ theme }) => theme.colors.primary || "#3b82f6"};
    color: ${({ theme }) => theme.colors.primary || "#3b82f6"};
  }
`;

const NotFoundPage = () => {
  const navigate = useNavigate();

  const quickLinks = [
    { path: PATHS.HOME, label: "Home" },
    { path: PATHS.MODELS, label: "Our Fleet" },
    { path: PATHS.BOOKINGS, label: "My Bookings" },
    { path: PATHS.CONTACT, label: "Contact Us" },
    { path: PATHS.SUPPORT, label: "Support" },
  ];

  return (
    <MainLayout>
      <NotFoundContainer>
        <NotFoundIcon>404</NotFoundIcon>
        <NotFoundTitle>Page Not Found</NotFoundTitle>
        <NotFoundMessage>
          Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or the URL might be incorrect.
        </NotFoundMessage>

        <ButtonGroup>
          <PrimaryButton onClick={() => navigate(PATHS.HOME)} aria-label="Go to homepage">
            <FiHome style={{ marginRight: "0.5rem" }} />
            Go Home
          </PrimaryButton>
          <SecondaryButton onClick={() => navigate(-1)} aria-label="Go back">
            <FiArrowLeft style={{ marginRight: "0.5rem" }} />
            Go Back
          </SecondaryButton>
        </ButtonGroup>

        <QuickLinks>
          <QuickLinksTitle>Popular Pages</QuickLinksTitle>
          <QuickLinksList>
            {quickLinks.map((link) => (
              <QuickLink
                key={link.path}
                onClick={() => navigate(link.path)}
                aria-label={`Navigate to ${link.label}`}
              >
                {link.label}
              </QuickLink>
            ))}
          </QuickLinksList>
        </QuickLinks>
      </NotFoundContainer>
    </MainLayout>
  );
};

export default NotFoundPage;

