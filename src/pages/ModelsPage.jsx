// src/pages/ModelsPage.jsx
import { useMemo, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useGetCars } from "../hooks/useCar";
import {
  FaCar,
  FaGasPump,
  FaUsers,
  FaCog,
  FaMapMarkerAlt,
  FaFilter,
  FaSearch,
  FaSyncAlt,
} from "react-icons/fa";
import CarCard from "../components/Cards/CarCard";

// Component Imports
import { AutoGrid, Grid } from "../components/Grid";
import { LuxuryCard, StatsCard } from "../components/Cards/Card";
import {
  PrimaryButton,
  SecondaryButton,
  AccentButtonLink,
} from "../components/ui/Button";
import { SearchInput, Select, RangeSlider } from "../components/forms/Form";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import HeroSection from "../components/Sections/HeroSection";
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
          <LoadingState>
            <LoadingSpinner size="lg" />
            <LoadingText>Loading our premium fleet...</LoadingText>
          </LoadingState>
        ) : filteredCars.length === 0 ? (
          <EmptyState>
            <EmptyIcon>🚗</EmptyIcon>
            <EmptyTitle>No vehicles found</EmptyTitle>
            <EmptyText>Try adjusting your filters or search terms</EmptyText>
            <PrimaryButton onClick={resetFilters}>Reset Filters</PrimaryButton>
          </EmptyState>
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

const EmptyState = styled.div`
  text-align: center;
  padding: var(--space-2xl) var(--space-lg);
  max-width: 400px;
  margin: 0 auto;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: var(--space-lg);
`;

const EmptyTitle = styled.h3`
  font-size: var(--text-xl);
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
  font-family: var(--font-heading);
`;

const EmptyText = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--space-xl);
  font-family: var(--font-body);
`;

// ===== CAR CARD COMPONENTS =====
const CarImage = styled.div`
  position: relative;
  height: 250px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-normal);
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const StatusBadge = styled.div`
  position: absolute;
  top: var(--space-lg);
  left: var(--space-lg);
  background: ${(props) => props.$color};
  color: var(--white);
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  z-index: 2;
  font-family: var(--font-body);
`;

const CardOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-normal);
  z-index: 1;

  ${LuxuryCard}:hover & {
    opacity: 1;
  }
`;

const ViewDetailsButton = styled(Link)`
  background: var(--gradient-primary);
  color: var(--white);
  padding: var(--space-lg) var(--space-xl);
  border-radius: var(--radius-lg);
  text-decoration: none;
  font-weight: var(--font-semibold);
  transition: all var(--transition-normal);
  font-family: var(--font-body);

  &:hover {
    background: var(--primary-dark);
    transform: scale(1.05);
  }

  &:focus-visible {
    outline: 2px solid var(--white);
    outline-offset: 2px;
  }
`;

const CardContent = styled.div`
  padding: var(--space-xl);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-md);
`;

const CarModel = styled.h3`
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0 0 var(--space-xs) 0;
  line-height: 1.2;
  font-family: var(--font-body);
`;

const CarSeries = styled.p`
  color: var(--text-secondary);
  font-size: var(--text-sm);
  margin: 0;
  font-family: var(--font-body);
`;

const CarPrice = styled.div`
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--primary);
  text-align: right;
  font-family: var(--font-body);

  span {
    font-size: var(--text-sm);
    color: var(--text-muted);
    font-weight: var(--font-normal);
  }
`;

const CarSpecs = styled.div`
  display: flex;
  gap: var(--space-lg);
  margin-bottom: var(--space-lg);

  @media (max-width: 768px) {
    gap: var(--space-md);
  }
`;

const SpecItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-family: var(--font-body);

  svg {
    color: var(--primary);
    font-size: var(--text-base);
  }
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  margin-bottom: var(--space-lg);
  font-family: var(--font-body);

  svg {
    color: var(--error);
  }
`;

const CarFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
`;

const FeatureTag = styled.span`
  background: var(--gray-100);
  color: var(--text-secondary);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  font-family: var(--font-body);
`;

const ActionButton = styled(AccentButtonLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  width: 100%;
  text-decoration: none;
  font-weight: var(--font-semibold);
  transition: all var(--transition-normal);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  &:focus-visible {
    outline: 2px solid var(--white);
    outline-offset: 2px;
  }
`;
