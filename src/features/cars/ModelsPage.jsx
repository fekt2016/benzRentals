/* eslint-disable react/react-in-jsx-scope */
// src/pages/ModelsPage.jsx
import { useMemo, useState } from "react";
import styled from "styled-components";

import { useGetCars } from "./useCar";
import {
 
  FaFilter,
  FaSearch,
  FaSyncAlt,
} from "react-icons/fa";
import CarCard from "./CarCard";

// Component Imports
import { AutoGrid, Grid } from "../../components/ui/Grid";
import { LuxuryCard, StatsCard } from "./Card";
import {
  PrimaryButton,
  SecondaryButton,

} from "../../components/ui/Button";
import { SearchInput, Select, RangeSlider } from "../../features/bookings/Form";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { CarCardSkeleton, ListSkeleton } from "../../components/ui/Skeleton";
import EmptyState from "../../components/feedback/EmptyState";
import HeroSection from "../../components/ui/HeroSection";
const ModelsPage = () => {
  const { data: carsData, isLoading, error } = useGetCars();
  const cars = useMemo(() => carsData?.data?.data || [], [carsData]);

  // Filters state
  const [filters, setFilters] = useState({
    status: "all",
    state: "all",
    priceRange: [0, 1000],
    searchQuery: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Collect unique states and get max price
  const { states, maxPrice } = useMemo(() => {
    const uniqueStates = [
      "all",
      ...new Set(cars.map((car) => car.state).filter(Boolean)),
    ];
    const maxCarPrice = Math.max(...cars.map((car) => car.pricePerDay), 1000);
    return { states: uniqueStates, maxPrice: maxCarPrice };
  }, [cars]);

  // Apply filters
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchesStatus =
        filters.status === "all" || car.status === filters.status;
      const matchesState =
        filters.state === "all" || car.state === filters.state;
      const matchesPrice =
        car.pricePerDay >= filters.priceRange[0] &&
        car.pricePerDay <= filters.priceRange[1];
      const matchesSearch =
        car.model?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        car.series?.toLowerCase().includes(filters.searchQuery.toLowerCase());

      return matchesStatus && matchesState && matchesPrice && matchesSearch;
    });
  }, [cars, filters]);

  const statusConfig = {
    available: { color: "var(--success)", text: "Available" },
    rented: { color: "var(--error)", text: "Rented" },
    maintenance: { color: "var(--warning)", text: "Maintenance" },
    reserved: { color: "var(--info)", text: "Reserved" },
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      status: "all",
      state: "all",
      priceRange: [0, maxPrice],
      searchQuery: "",
    });
  };

  // Hero section data
  const heroData = {
    backgroundImage: "/images/ben2.jpg",
    badge: "Premium Fleet",
    title: "Mercedes-Benz Premium Fleet",
    description:
      "Experience luxury and performance with our curated collection of Mercedes-Benz vehicles. Discover the perfect vehicle for your journey.",
    primaryButton: {
      to: "#filters",
      text: "Explore Fleet",
    },
    secondaryButton: {
      to: "/contact",
      text: "Contact Us",
    },
    scrollText: "Discover Our Collection",
  };

  // Stats section for the hero
  const HeroStats = () => (
    <StatsGrid $template="repeat(auto-fit, minmax(200px, 1fr))" gap="lg">
      <StatsCard>
        <StatNumber>{cars.length}</StatNumber>
        <StatLabel>Premium Vehicles</StatLabel>
      </StatsCard>
      <StatsCard>
        <StatNumber>
          {cars.filter((c) => c.status === "available").length}
        </StatNumber>
        <StatLabel>Available Now</StatLabel>
      </StatsCard>
      <StatsCard>
        <StatNumber>24/7</StatNumber>
        <StatLabel>Premium Support</StatLabel>
      </StatsCard>
    </StatsGrid>
  );

  if (error) {
    return (
      <ErrorState>
        <ErrorIcon>⚠️</ErrorIcon>
        <ErrorTitle>Failed to Load Vehicles</ErrorTitle>
        <ErrorText>Please try refreshing the page</ErrorText>
        <PrimaryButton onClick={() => window.location.reload()}>
          <FaSyncAlt />
          Retry
        </PrimaryButton>
      </ErrorState>
    );
  }

  return (
    <PageWrapper>
      {/* Hero Section */}
      <HeroSection
        backgroundImage={heroData.backgroundImage}
        badge={heroData.badge}
        title={heroData.title}
        description={heroData.description}
        primaryButton={heroData.primaryButton}
        secondaryButton={heroData.secondaryButton}
        scrollText={heroData.scrollText}
        onBackgroundError={(e) => {
          e.target.style.display = "none";
        }}
      >
        <HeroStats />
      </HeroSection>

      {/* Main Content */}
      <ContentSection id="filters">
        {/* Search and Filters */}
        <FiltersCard>
          <FiltersHeader>
            <FiltersTitle>
              <FaFilter />
              Find Your Mercedes
            </FiltersTitle>
            <FilterActions>
              <SearchInput
                placeholder="Search by model or series..."
                value={filters.searchQuery}
                onChange={(e) =>
                  handleFilterChange("searchQuery", e.target.value)
                }
                icon={<FaSearch />}
              />
              <FilterToggle
                $active={showFilters}
                onClick={() => setShowFilters(!showFilters)}
                $size="sm"
              >
                <FaFilter />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </FilterToggle>
            </FilterActions>
          </FiltersHeader>

          <FiltersContent $show={showFilters}>
            <Grid $template="1fr 1fr 2fr" gap="lg">
              <FilterGroup>
                <FilterLabel>Vehicle Status</FilterLabel>
                <StatusFilters>
                  {["all", "available", "rented", "maintenance"].map(
                    (status) => (
                      <StatusFilter
                        key={status}
                        $active={filters.status === status}
                        $color={
                          statusConfig[status]?.color || "var(--gray-500)"
                        }
                        onClick={() => handleFilterChange("status", status)}
                      >
                        {status === "all"
                          ? "All Vehicles"
                          : statusConfig[status]?.text}
                      </StatusFilter>
                    )
                  )}
                </StatusFilters>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Location</FilterLabel>
                <Select
                  value={filters.state}
                  onChange={(e) => handleFilterChange("state", e.target.value)}
                  options={states.map((state) => ({
                    value: state,
                    label: state === "all" ? "All Locations" : state,
                  }))}
                />
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>
                  Price Range: ${filters.priceRange[0]} - $
                  {filters.priceRange[1]}/day
                </FilterLabel>
                <RangeSlider
                  min={0}
                  max={maxPrice}
                  value={filters.priceRange}
                  onChange={(value) => handleFilterChange("priceRange", value)}
                  formatValue={(value) => `$${value}`}
                />
              </FilterGroup>
            </Grid>
          </FiltersContent>

          <FiltersFooter>
            <ResultsInfo>
              Showing {filteredCars.length} of {cars.length} vehicles
            </ResultsInfo>
            <SecondaryButton onClick={resetFilters}>
              Reset Filters
            </SecondaryButton>
          </FiltersFooter>
        </FiltersCard>

        {/* Cars Grid */}
        {isLoading ? (
          <CarsSection>
            <AutoGrid $minWidth="350px" gap="xl">
              {Array.from({ length: 6 }).map((_, i) => (
                <CarCardSkeleton key={i} />
              ))}
            </AutoGrid>
          </CarsSection>
        ) : filteredCars.length === 0 ? (
          <EmptyState
            icon="car"
            title="No vehicles found"
            message="Try adjusting your filters or search terms to find the perfect car for your journey."
            primaryAction={{
              label: "Reset Filters",
              onClick: resetFilters,
            }}
          />
        ) : (
          <CarsSection>
            <AutoGrid $minWidth="350px" gap="xl">
              {filteredCars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </AutoGrid>
          </CarsSection>
        )}
      </ContentSection>
    </PageWrapper>
  );
};

export default ModelsPage;

// Styled Components
const PageWrapper = styled.div`
  min-height: 100vh;
  background: var(--background);
`;

const ContentSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-xl) var(--space-lg);

  @media (max-width: 768px) {
    padding: var(--space-lg) var(--space-md);
  }
`;

const CarsSection = styled.section`
  margin-top: var(--space-xl);

`;

// ===== STATS COMPONENTS =====
const StatsGrid = styled(Grid)`
  max-width: 80rem;
  margin: 0 auto;
`;

const StatNumber = styled.div`
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-xs);
  font-family: var(--font-body);
`;

const StatLabel = styled.div`
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.9;
  font-family: var(--font-body);
`;

// ===== FILTERS COMPONENTS =====
const FiltersCard = styled(LuxuryCard)`
  padding: var(--space-xl);

  margin-bottom: var(--space-xl);
`;

const FiltersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--space-md);
    align-items: stretch;
  }
`;

const FiltersTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--text-2xl);
  color: var(--text-primary);
  margin: 0;
  font-family: var(--font-heading);
`;

const FilterActions = styled.div`
  display: flex;
  gap: var(--space-md);
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FilterToggle = styled(SecondaryButton)`
  white-space: nowrap;
  background: ${({ $active }) =>
    $active ? "var(--primary-light)" : "transparent"};
  border-color: ${({ $active }) =>
    $active ? "var(--primary)" : "var(--gray-300)"};
  color: ${({ $active }) =>
    $active ? "var(--primary-dark)" : "var(--text-secondary)"};
`;

const FiltersContent = styled.div`
  display: ${(props) => (props.$show ? "block" : "none")};
  margin-bottom: var(--space-lg);
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const FilterLabel = styled.label`
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-family: var(--font-body);
`;

const StatusFilters = styled.div`
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
`;

const StatusFilter = styled.button`
  padding: var(--space-sm) var(--space-lg);
  border: 2px solid
    ${(props) => (props.$active ? props.$color : "var(--gray-300)")};
  background: ${(props) => (props.$active ? props.$color : "transparent")};
  color: ${(props) =>
    props.$active ? "var(--white)" : "var(--text-secondary)"};
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
  transition: all var(--transition-normal);
  font-family: var(--font-body);

  &:hover {
    border-color: ${(props) => props.$color};
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
  }

  &:focus-visible {
    outline: 2px solid ${(props) => props.$color};
    outline-offset: 2px;
  }
`;

const FiltersFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-lg);
  border-top: 1px solid var(--gray-200);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--space-md);
    text-align: center;
  }
`;

const ResultsInfo = styled.div`
  font-weight: var(--font-semibold);
  color: var(--text-secondary);
  font-family: var(--font-body);
`;

// ===== STATE COMPONENTS =====
const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-2xl);
  gap: var(--space-lg);
`;

const LoadingText = styled.p`
  color: var(--text-secondary);
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  font-family: var(--font-body);
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-2xl) var(--space-lg);
  max-width: 400px;
  margin: 0 auto;
  min-height: 400px;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: var(--space-lg);
`;

const ErrorTitle = styled.h2`
  font-size: var(--text-2xl);
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
  font-family: var(--font-heading);
`;

const ErrorText = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--space-xl);
  font-family: var(--font-body);
`;

// EmptyState component now imported from components/feedback/EmptyState









