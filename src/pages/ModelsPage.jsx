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
  FaStar,
  FaFilter,
  FaTimes,
} from "react-icons/fa";

const ModelsPage = () => {
  const { data: carsData, isLoading } = useGetCars();
  const cars = useMemo(() => carsData?.data?.data || [], [carsData]);

  // Filters state
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);

  // Collect unique states and get max price
  const states = useMemo(
    () => ["all", ...new Set(cars.map((car) => car.state).filter(Boolean))],
    [cars]
  );
  const maxPrice = useMemo(
    () => Math.max(...cars.map((car) => car.pricePerDay), 1000),
    [cars]
  );

  // Apply filters
  const filteredCars = cars.filter((car) => {
    const matchesStatus =
      selectedStatus === "all" || car.status === selectedStatus;
    const matchesState = selectedState === "all" || car.state === selectedState;
    const matchesPrice =
      car.pricePerDay >= priceRange[0] && car.pricePerDay <= priceRange[1];
    return matchesStatus && matchesState && matchesPrice;
  });

  const getStatusColor = (status) => {
    const colors = {
      available: "#10b981",
      rented: "#ef4444",
      maintenance: "#f59e0b",
      reserved: "#3b82f6",
    };
    return colors[status] || "#6b7280";
  };

  const getStatusText = (status) => {
    const texts = {
      available: "Available",
      rented: "Rented",
      maintenance: "Maintenance",
      reserved: "Reserved",
    };
    return texts[status] || status;
  };

  if (isLoading) {
    return (
      <LoadingWrapper>
        <LoadingSpinner>
          <div></div>
          <div></div>
          <div></div>
        </LoadingSpinner>
        <p>Loading our premium fleet...</p>
      </LoadingWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroTitle>Mercedes-Benz Premium Fleet</HeroTitle>
          <HeroSubtitle>
            Experience luxury and performance with our curated collection of
            Mercedes-Benz vehicles
          </HeroSubtitle>
          <HeroStats>
            <StatItem>
              <StatNumber>{cars.length}+</StatNumber>
              <StatLabel>Premium Vehicles</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>
                {cars.filter((c) => c.status === "available").length}
              </StatNumber>
              <StatLabel>Available Now</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>24/7</StatNumber>
              <StatLabel>Support</StatLabel>
            </StatItem>
          </HeroStats>
        </HeroContent>
      </HeroSection>

      {/* Filters Section */}
      <FiltersSection>
        <FiltersHeader>
          <FiltersTitle>
            <FaFilter />
            Filter Vehicles
          </FiltersTitle>
          <FilterToggle onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? <FaTimes /> : <FaFilter />}
            {showFilters ? "Hide Filters" : "Show Filters"}
          </FilterToggle>
        </FiltersHeader>

        <FiltersContent $show={showFilters}>
          <FilterGroup>
            <FilterLabel>Vehicle Status</FilterLabel>
            <StatusFilters>
              {["all", "available", "rented", "maintenance"].map((status) => (
                <StatusFilter
                  key={status}
                  $active={selectedStatus === status}
                  $color={getStatusColor(status)}
                  onClick={() => setSelectedStatus(status)}
                >
                  {status === "all" ? "All Vehicles" : getStatusText(status)}
                </StatusFilter>
              ))}
            </StatusFilters>
          </FilterGroup>

          <FilterRow>
            <FilterGroup>
              <FilterLabel>Location</FilterLabel>
              <Select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                {states.map((state, index) => (
                  <option key={index} value={state}>
                    {state === "all" ? "All Locations" : state}
                  </option>
                ))}
              </Select>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>
                Price Range: ${priceRange[0]} - ${priceRange[1]}/day
              </FilterLabel>
              <PriceRange>
                <RangeInput
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([parseInt(e.target.value), priceRange[1]])
                  }
                />
                <RangeInput
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value)])
                  }
                />
              </PriceRange>
            </FilterGroup>
          </FilterRow>
        </FiltersContent>

        <ResultsInfo>
          Showing {filteredCars.length} of {cars.length} vehicles
        </ResultsInfo>
      </FiltersSection>

      {/* Cars Grid */}
      {filteredCars.length === 0 ? (
        <EmptyState>
          <EmptyIcon>🚗</EmptyIcon>
          <EmptyTitle>No vehicles found</EmptyTitle>
          <EmptyText>Try adjusting your filters to see more results</EmptyText>
          <ResetButton
            onClick={() => {
              setSelectedStatus("all");
              setSelectedState("all");
              setPriceRange([0, maxPrice]);
            }}
          >
            Reset Filters
          </ResetButton>
        </EmptyState>
      ) : (
        <CarsGrid>
          {filteredCars.map((car) => (
            <CarCard key={car._id}>
              <CarImage>
                <img
                  src={car.images?.[0] || "/default-car.jpg"}
                  alt={car.model}
                />
                <StatusBadge $color={getStatusColor(car.status)}>
                  {getStatusText(car.status)}
                </StatusBadge>
                <Overlay>
                  <ViewDetailsButton to={`/model/${car._id}`}>
                    View Details
                  </ViewDetailsButton>
                </Overlay>
              </CarImage>

              <CarContent>
                <CarHeader>
                  <CarModel>{car.model}</CarModel>
                  <CarPrice>
                    ${car.pricePerDay}
                    <span>/day</span>
                  </CarPrice>
                </CarHeader>

                <CarSeries>{car.series}</CarSeries>

                <CarSpecs>
                  <SpecItem>
                    <FaCar />
                    <span>{car.transmission || "Automatic"}</span>
                  </SpecItem>
                  <SpecItem>
                    <FaGasPump />
                    <span>{car.fuel || "Premium"}</span>
                  </SpecItem>
                  <SpecItem>
                    <FaUsers />
                    <span>{car.seats || 5} Seats</span>
                  </SpecItem>
                </CarSpecs>

                {car.state && (
                  <Location>
                    <FaMapMarkerAlt />
                    <span>{car.state}</span>
                  </Location>
                )}

                <CarFeatures>
                  {car.features?.slice(0, 3).map((feature, index) => (
                    <FeatureTag key={index}>{feature}</FeatureTag>
                  ))}
                  {car.features && car.features.length > 3 && (
                    <FeatureTag>+{car.features.length - 3} more</FeatureTag>
                  )}
                </CarFeatures>

                <ActionButton to={`/model/${car._id}`}>
                  <FaCog />
                  Book Now
                </ActionButton>
              </CarContent>
            </CarCard>
          ))}
        </CarsGrid>
      )}
    </PageWrapper>
  );
};

export default ModelsPage;

// Styled Components
const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 1rem;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;

  div {
    display: inline-block;
    position: absolute;
    left: 8px;
    width: 16px;
    background: #3b82f6;
    animation: loading 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
  }

  div:nth-child(1) {
    left: 8px;
    animation-delay: -0.24s;
  }

  div:nth-child(2) {
    left: 32px;
    animation-delay: -0.12s;
  }

  div:nth-child(3) {
    left: 56px;
    animation-delay: 0;
  }

  @keyframes loading {
    0% {
      top: 8px;
      height: 64px;
    }
    50%,
    100% {
      top: 24px;
      height: 32px;
    }
  }
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #1e293b 0%, #374151 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: #d1d5db;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const HeroStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #60a5fa;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const FiltersSection = styled.section`
  background: white;
  padding: 2rem;
  margin: 2rem auto;
  max-width: 1200px;
  border-radius: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    margin: 1rem;
    padding: 1.5rem;
  }
`;

const FiltersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const FiltersTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  color: #1e293b;
  margin: 0;
`;

const FilterToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
`;

const FiltersContent = styled.div`
  display: ${(props) => (props.$show ? "block" : "none")};
  margin-bottom: 1.5rem;
`;

const FilterGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FilterLabel = styled.label`
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const StatusFilters = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const StatusFilter = styled.button`
  padding: 0.75rem 1.5rem;
  border: 2px solid ${(props) => (props.$active ? props.$color : "#e5e7eb")};
  background: ${(props) => (props.$active ? props.$color : "transparent")};
  color: ${(props) => (props.$active ? "white" : "#6b7280")};
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    border-color: ${(props) => props.$color};
    transform: translateY(-1px);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const PriceRange = styled.div`
  position: relative;
  padding: 1rem 0;
`;

const RangeInput = styled.input`
  width: 100%;
  margin: 0.5rem 0;
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: #3b82f6;
    border-radius: 50%;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #3b82f6;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
`;

const ResultsInfo = styled.div`
  text-align: center;
  color: #6b7280;
  font-weight: 600;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  max-width: 400px;
  margin: 2rem auto;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const EmptyText = styled.p`
  color: #6b7280;
  margin-bottom: 2rem;
`;

const ResetButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }
`;

const CarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 0 1rem 2rem;
    gap: 1.5rem;
  }
`;

const CarCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }
`;

const CarImage = styled.div`
  position: relative;
  height: 250px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: ${(props) => props.$color};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${CarCard}:hover & {
    opacity: 1;
  }
`;

const ViewDetailsButton = styled(Link)`
  background: #3b82f6;
  color: white;
  padding: 1rem 2rem;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: #2563eb;
    transform: scale(1.05);
  }
`;

const CarContent = styled.div`
  padding: 1.5rem;
`;

const CarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const CarModel = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const CarPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;

  span {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 400;
  }
`;

const CarSeries = styled.p`
  color: #6b7280;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const CarSpecs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SpecItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;

  svg {
    color: #3b82f6;
  }
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;

  svg {
    color: #ef4444;
  }
`;

const CarFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const FeatureTag = styled.span`
  background: #f1f5f9;
  color: #475569;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const ActionButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  text-decoration: none;
  padding: 1rem;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.5);
  }
`;
