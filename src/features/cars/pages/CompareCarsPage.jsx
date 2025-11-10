/* eslint-disable react/react-in-jsx-scope */
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { useCarComparison } from "../hooks/useCarComparison";
import {
  FiX,
  FiTrash2,
  FiArrowLeft,
  FiDollarSign,
  FiUsers,
  FiCpu,
  FiDroplet,
  FiActivity,
  FiCalendar,
  FiTruck,
} from "react-icons/fi";
import { PrimaryButton, SecondaryButton } from "../../../components/ui/Button";
import { Card } from "../Card";
import { PATHS } from "../../../config/constants";
import usePageTitle from "../../../app/hooks/usePageTitle";

const CompareCarsPage = () => {
  usePageTitle("Compare Cars - BenzFlex", "Compare and choose the perfect car for your rental");
  
  const navigate = useNavigate();
  const {
    comparisonCars,
    removeFromComparison,
    clearComparison,
    comparisonCount,
  } = useCarComparison();

  if (comparisonCars.length === 0) {
    return (
      <Container>
        <Header>
          <BackButton onClick={() => navigate(-1)}>
            <FiArrowLeft />
            Back
          </BackButton>
          <Title>Compare Cars</Title>
        </Header>
        <EmptyState>
          <FiTruck size={64} />
          <EmptyTitle>No Cars to Compare</EmptyTitle>
          <EmptyText>
            Add cars to comparison from the car listings to see them side by side.
          </EmptyText>
          <PrimaryButton as={Link} to={PATHS.MODELS}>
            Browse Cars
          </PrimaryButton>
        </EmptyState>
      </Container>
    );
  }

  // Get all unique specification keys from all cars
  const getAllSpecs = () => {
    const specKeys = new Set();
    comparisonCars.forEach((car) => {
      if (car.specifications) {
        Object.keys(car.specifications).forEach((key) => specKeys.add(key));
      }
    });
    return Array.from(specKeys);
  };

  const specKeys = getAllSpecs();

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <FiArrowLeft />
          Back
        </BackButton>
        <Title>Compare Cars ({comparisonCount})</Title>
        <ClearButton onClick={clearComparison} $variant="ghost">
          <FiTrash2 />
          Clear All
        </ClearButton>
      </Header>

      <ComparisonTable>
        <TableHeader>
          <HeaderCell>Specification</HeaderCell>
          {comparisonCars.map((car) => (
            <CarHeaderCell key={car._id || car.id}>
              <CarImage
                src={car.images?.[0] || car.image || "/default-car.jpg"}
                alt={car.model}
                onError={(e) => {
                  e.target.src = "/default-car.jpg";
                }}
              />
              <CarInfo>
                <CarModel>{car.model}</CarModel>
                <CarSeries>{car.series}</CarSeries>
                <CarPrice>
                  <FiDollarSign />
                  {car.pricePerDay || car.price}/day
                </CarPrice>
              </CarInfo>
              <RemoveButton
                onClick={() => removeFromComparison(car._id || car.id)}
                aria-label="Remove from comparison"
              >
                <FiX />
              </RemoveButton>
            </CarHeaderCell>
          ))}
        </TableHeader>

        <TableBody>
          {/* Price Row */}
          <TableRow>
            <SpecLabel>
              <FiDollarSign />
              Price per Day
            </SpecLabel>
            {comparisonCars.map((car) => (
              <SpecValue key={car._id || car.id}>
                ${car.pricePerDay || car.price || "N/A"}
              </SpecValue>
            ))}
          </TableRow>

          {/* Year Row */}
          <TableRow>
            <SpecLabel>
              <FiCalendar />
              Year
            </SpecLabel>
            {comparisonCars.map((car) => (
              <SpecValue key={car._id || car.id}>
                {car.year || "N/A"}
              </SpecValue>
            ))}
          </TableRow>

          {/* Seats Row */}
          <TableRow>
            <SpecLabel>
              <FiUsers />
              Seats
            </SpecLabel>
            {comparisonCars.map((car) => (
              <SpecValue key={car._id || car.id}>
                {car.seats || car.specifications?.seats || "N/A"}
              </SpecValue>
            ))}
          </TableRow>

          {/* Transmission Row */}
          <TableRow>
            <SpecLabel>
              <FiCpu />
              Transmission
            </SpecLabel>
            {comparisonCars.map((car) => (
              <SpecValue key={car._id || car.id}>
                {car.transmission || car.specifications?.transmission || "N/A"}
              </SpecValue>
            ))}
          </TableRow>

          {/* Fuel Type Row */}
          <TableRow>
            <SpecLabel>
              <FiDroplet />
              Fuel Type
            </SpecLabel>
            {comparisonCars.map((car) => (
              <SpecValue key={car._id || car.id}>
                {car.fuelType || car.specifications?.fuelType || "N/A"}
              </SpecValue>
            ))}
          </TableRow>

          {/* Mileage Row */}
          <TableRow>
            <SpecLabel>
              <FiActivity />
              Mileage
            </SpecLabel>
            {comparisonCars.map((car) => (
              <SpecValue key={car._id || car.id}>
                {car.mileage || car.specifications?.mileage || "N/A"}
              </SpecValue>
            ))}
          </TableRow>

          {/* Additional Specifications */}
          {specKeys.map((key) => (
            <TableRow key={key}>
              <SpecLabel>{key.replace(/([A-Z])/g, " $1").trim()}</SpecLabel>
              {comparisonCars.map((car) => (
                <SpecValue key={car._id || car.id}>
                  {car.specifications?.[key] || "N/A"}
                </SpecValue>
              ))}
            </TableRow>
          ))}

          {/* Features Row */}
          <TableRow>
            <SpecLabel>Features</SpecLabel>
            {comparisonCars.map((car) => (
              <SpecValue key={car._id || car.id}>
                <FeaturesList>
                  {car.features?.slice(0, 5).map((feature, idx) => (
                    <FeatureTag key={idx}>{feature}</FeatureTag>
                  ))}
                  {car.features?.length > 5 && (
                    <MoreFeatures>+{car.features.length - 5} more</MoreFeatures>
                  )}
                </FeaturesList>
              </SpecValue>
            ))}
          </TableRow>

          {/* Actions Row */}
          <TableRow $actions>
            <SpecLabel>Actions</SpecLabel>
            {comparisonCars.map((car) => (
              <SpecValue key={car._id || car.id}>
                <ActionButtons>
                  <PrimaryButton
                    as={Link}
                    to={`/model/${car._id || car.id}`}
                    $size="sm"
                  >
                    View Details
                  </PrimaryButton>
                  <SecondaryButton
                    as={Link}
                    to={`/model/${car._id || car.id}`}
                    $size="sm"
                  >
                    Book Now
                  </SecondaryButton>
                </ActionButtons>
              </SpecValue>
            ))}
          </TableRow>
        </TableBody>
      </ComparisonTable>
    </Container>
  );
};

export default CompareCarsPage;

// Styled Components
const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-2xl);
  min-height: 100vh;
  background: var(--surface);

  @media (max-width: 768px) {
    padding: var(--space-lg);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-2xl);
  gap: var(--space-md);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const BackButton = styled(SecondaryButton)`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`;

const Title = styled.h1`
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
  flex: 1;
`;

const ClearButton = styled(SecondaryButton)`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  gap: var(--space-lg);

  svg {
    color: var(--text-muted);
    opacity: 0.5;
  }
`;

const EmptyTitle = styled.h2`
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
`;

const EmptyText = styled.p`
  font-size: var(--text-base);
  color: var(--text-muted);
  max-width: 500px;
  margin: 0;
`;

const ComparisonTable = styled(Card)`
  overflow-x: auto;
  padding: 0;
  background: var(--white);
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 200px repeat(auto-fit, minmax(250px, 1fr));
  gap: 0;
  border-bottom: 2px solid var(--gray-200);
  position: sticky;
  top: 0;
  background: var(--white);
  z-index: 10;
`;

const HeaderCell = styled.div`
  padding: var(--space-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  background: var(--gray-50);
  border-right: 1px solid var(--gray-200);
`;

const CarHeaderCell = styled(HeaderCell)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  position: relative;
  background: var(--white);
  min-width: 250px;
`;

const CarImage = styled.img`
  width: 100%;
  max-width: 200px;
  height: 150px;
  object-fit: cover;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
`;

const CarInfo = styled.div`
  text-align: center;
  width: 100%;
`;

const CarModel = styled.div`
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
`;

const CarSeries = styled.div`
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-bottom: var(--space-sm);
`;

const CarPrice = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--primary);
`;

const RemoveButton = styled.button`
  position: absolute;
  top: var(--space-sm);
  right: var(--space-sm);
  background: var(--error);
  color: var(--white);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    background: var(--error-dark);
    transform: scale(1.1);
  }
`;

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 200px repeat(auto-fit, minmax(250px, 1fr));
  gap: 0;
  border-bottom: 1px solid var(--gray-200);

  ${(props) =>
    props.$actions &&
    `
    background: var(--gray-50);
    padding: var(--space-md) 0;
  `}

  &:hover {
    background: ${(props) => (props.$actions ? "var(--gray-50)" : "var(--gray-50)")};
  }
`;

const SpecLabel = styled.div`
  padding: var(--space-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  background: var(--gray-50);
  border-right: 1px solid var(--gray-200);
  display: flex;
  align-items: center;
  gap: var(--space-sm);

  svg {
    color: var(--primary);
  }
`;

const SpecValue = styled.div`
  padding: var(--space-lg);
  color: var(--text-secondary);
  border-right: 1px solid var(--gray-200);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-width: 250px;
`;

const FeaturesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  justify-content: center;
`;

const FeatureTag = styled.span`
  padding: var(--space-xs) var(--space-sm);
  background: var(--primary-light);
  color: var(--primary-dark);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
`;

const MoreFeatures = styled.span`
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-style: italic;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  width: 100%;
`;

