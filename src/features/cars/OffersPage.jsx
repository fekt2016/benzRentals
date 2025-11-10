import React, { useState } from "react";
import styled from "styled-components";
import { FiTag, FiCalendar, FiArrowRight, FiCheck } from "react-icons/fi";
import Container from "../../components/layout/Container";
import { PrimaryButton, SecondaryButton } from "../../components/ui/Button";
import { devices } from "../../styles/GlobalStyles";
import usePageTitle from "../../app/hooks/usePageTitle";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../config/constants";

const OffersContainer = styled(Container)`
  max-width: 1200px;
  padding: 2rem 1rem;

  @media ${devices.sm} {
    padding: 1rem 0.5rem;
  }
`;

const OffersHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text || "#1f2937"};
    margin: 0 0 1rem 0;

    @media ${devices.sm} {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.125rem;
    color: ${({ theme }) => theme.colors.textMuted || "#6b7280"};
    margin: 0;
  }
`;

const OffersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;

  @media ${devices.md} {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  @media ${devices.sm} {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const OfferCard = styled.div`
  background: ${({ theme }) => theme.colors.background || "#ffffff"};
  border: 2px solid ${({ theme, $featured }) => ($featured ? theme.colors.primary : theme.colors.border)};
  border-radius: 12px;
  padding: 2rem;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  ${({ $featured }) =>
    $featured &&
    `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-color: transparent;
  `}
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #fbbf24;
  color: #1f2937;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const OfferIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: ${({ theme, $featured }) => ($featured ? "#ffffff" : theme.colors.primary)};
`;

const OfferTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: ${({ $featured }) => ($featured ? "#ffffff" : "inherit")};
`;

const OfferDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  color: ${({ $featured }) => ($featured ? "rgba(255, 255, 255, 0.9)" : "inherit")};
`;

const OfferDetails = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;

  li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    font-size: 0.875rem;
    color: ${({ $featured }) => ($featured ? "rgba(255, 255, 255, 0.9)" : "inherit")};

    svg {
      color: ${({ $featured }) => ($featured ? "#ffffff" : "#10b981")};
      flex-shrink: 0;
    }
  }
`;

const OfferFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${({ $featured }) => ($featured ? "rgba(255, 255, 255, 0.2)" : "#e5e7eb")};
`;

const OfferCode = styled.div`
  font-family: monospace;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ $featured }) => ($featured ? "#ffffff" : theme => theme.colors.primary)};
  background: ${({ $featured }) => ($featured ? "rgba(255, 255, 255, 0.2)" : theme => theme.colors.primaryLight)};
  padding: 0.5rem 1rem;
  border-radius: 6px;
`;

const mockOffers = [
  {
    id: 1,
    title: "Summer Special",
    description: "Get 20% off on all luxury sedans this summer. Perfect for your vacation plans!",
    discount: "20% OFF",
    code: "SUMMER20",
    featured: true,
    validUntil: "2025-08-31",
    benefits: [
      "Valid on all sedan models",
      "Minimum 3-day rental",
      "Cannot be combined with other offers",
    ],
  },
  {
    id: 2,
    title: "Weekend Getaway",
    description: "Enjoy 15% off on weekend rentals. Book Friday to Sunday and save!",
    discount: "15% OFF",
    code: "WEEKEND15",
    featured: false,
    validUntil: "2025-12-31",
    benefits: [
      "Valid Friday to Sunday",
      "Minimum 2-day rental",
      "Applies to all vehicle types",
    ],
  },
  {
    id: 3,
    title: "Corporate Discount",
    description: "Special rates for corporate clients. Contact us for bulk booking discounts.",
    discount: "Up to 25% OFF",
    code: "CORP25",
    featured: false,
    validUntil: "2025-12-31",
    benefits: [
      "Corporate accounts only",
      "Minimum 5 bookings",
      "Custom pricing available",
    ],
  },
  {
    id: 4,
    title: "First-Time Customer",
    description: "New to BenzFlex? Get 10% off your first booking!",
    discount: "10% OFF",
    code: "FIRST10",
    featured: false,
    validUntil: "2025-12-31",
    benefits: [
      "First booking only",
      "No minimum rental period",
      "All vehicle types eligible",
    ],
  },
  {
    id: 5,
    title: "Long-Term Rental",
    description: "Planning an extended trip? Save 30% on rentals of 7+ days.",
    discount: "30% OFF",
    code: "LONG30",
    featured: false,
    validUntil: "2025-12-31",
    benefits: [
      "7+ day rentals",
      "All vehicle types",
      "Best value for extended trips",
    ],
  },
  {
    id: 6,
    title: "Luxury SUV Special",
    description: "Experience luxury with 25% off on all SUV models this month.",
    discount: "25% OFF",
    code: "SUV25",
    featured: false,
    validUntil: "2025-02-28",
    benefits: [
      "SUV models only",
      "Valid this month",
      "Perfect for family trips",
    ],
  },
];

const OffersPage = () => {
  usePageTitle("Special Offers - BenzFlex", "Exclusive deals and promotions on luxury car rentals");
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleBookNow = (code) => {
    navigate(PATHS.MODELS, { state: { promoCode: code } });
  };

  return (
    <OffersContainer>
      <OffersHeader>
        <FiTag size={48} style={{ marginBottom: "1rem", color: "#3b82f6" }} />
        <h1>Special Offers & Promotions</h1>
        <p>Discover exclusive deals and save on your next luxury car rental</p>
      </OffersHeader>

      <OffersGrid>
        {mockOffers.map((offer) => (
          <OfferCard key={offer.id} $featured={offer.featured}>
            {offer.featured && (
              <FeaturedBadge>
                <FiTag size={14} />
                Featured
              </FeaturedBadge>
            )}

            <OfferIcon $featured={offer.featured}>
              <FiTag />
            </OfferIcon>

            <OfferTitle $featured={offer.featured}>{offer.title}</OfferTitle>
            <OfferDescription $featured={offer.featured}>{offer.description}</OfferDescription>

            <OfferDetails $featured={offer.featured}>
              {offer.benefits.map((benefit, index) => (
                <li key={index}>
                  <FiCheck size={16} />
                  {benefit}
                </li>
              ))}
            </OfferDetails>

            <OfferFooter $featured={offer.featured}>
              <div>
                <div style={{ fontSize: "0.875rem", opacity: 0.8, marginBottom: "0.25rem" }}>
                  Valid until {new Date(offer.validUntil).toLocaleDateString()}
                </div>
                <OfferCode $featured={offer.featured}>
                  {copiedCode === offer.code ? "Copied!" : offer.code}
                </OfferCode>
              </div>
            </OfferFooter>

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              <SecondaryButton
                onClick={() => handleCopyCode(offer.code)}
                style={{ flex: 1 }}
                aria-label={`Copy code ${offer.code}`}
              >
                {copiedCode === offer.code ? "Copied!" : "Copy Code"}
              </SecondaryButton>
              <PrimaryButton
                onClick={() => handleBookNow(offer.code)}
                style={{ flex: 1 }}
                aria-label={`Book with ${offer.code}`}
              >
                Book Now <FiArrowRight style={{ marginLeft: "0.5rem" }} />
              </PrimaryButton>
            </div>
          </OfferCard>
        ))}
      </OffersGrid>
    </OffersContainer>
  );
};

export default OffersPage;

