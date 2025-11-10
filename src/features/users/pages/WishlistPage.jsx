import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FiHeart, FiArrowLeft, FiShoppingBag } from "react-icons/fi";
import { useFavorites } from "../hooks/useFavorites";
import CarCard from "../../cars/CarCard";
import { PrimaryButton, GhostButton } from "../../../components/ui/Button";
import { LoadingSpinner, EmptyState } from "../../../components/ui/LoadingSpinner";
import Container from "../../../components/layout/Container";
import usePageTitle from "../../../app/hooks/usePageTitle";
import { PATHS } from "../../../config/constants";
import { devices } from "../../../styles/GlobalStyles";

const WishlistPage = () => {
  usePageTitle("My Wishlist - BenzFlex", "Your favorite luxury vehicles");
  const navigate = useNavigate();
  const { data, isLoading, error } = useFavorites();

  const favorites = data?.data?.favorites || [];

  if (isLoading) {
    return (
      <Container>
        <PageContainer>
          <LoadingSpinner size="lg" message="Loading your wishlist..." />
        </PageContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <PageContainer>
          <EmptyState
            icon={FiHeart}
            title="Failed to Load Wishlist"
            message={error?.response?.data?.message || "Unable to load your favorites. Please try again."}
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
          <HeaderContent>
            <FiHeart size={32} color="#ef4444" />
            <h1>My Wishlist</h1>
            <p>{favorites.length} {favorites.length === 1 ? "car" : "cars"} saved</p>
          </HeaderContent>
        </PageHeader>

        {favorites.length === 0 ? (
          <EmptyState
            icon={FiHeart}
            title="Your Wishlist is Empty"
            message="Start exploring our luxury fleet and add cars to your wishlist!"
            actions={[
              { text: "Browse Cars", onClick: () => navigate(PATHS.MODELS), variant: "primary", icon: FiShoppingBag },
            ]}
          />
        ) : (
          <CarsGrid>
            {favorites.map((car) => (
              <CarCard key={car._id || car.id} car={car} />
            ))}
          </CarsGrid>
        )}
      </PageContainer>
    </Container>
  );
};

const PageContainer = styled.div`
  padding: var(--space-2xl) 0;
  min-height: 60vh;
`;

const PageHeader = styled.div`
  margin-bottom: var(--space-2xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);

  h1 {
    font-size: var(--text-3xl);
    font-weight: var(--font-bold);
    color: var(--text-primary);
    margin: 0;
  }

  p {
    margin: 0;
    color: var(--text-secondary);
    font-size: var(--text-base);
  }

  @media ${devices.sm} {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-sm);
  }
`;

const CarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-xl);
  margin-top: var(--space-xl);

  @media ${devices.md} {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--space-lg);
  }

  @media ${devices.sm} {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }
`;

export default WishlistPage;

