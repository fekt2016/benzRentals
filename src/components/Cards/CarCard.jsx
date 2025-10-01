// src/components/cards/CarCard.jsx
import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { ButtonLink, PrimaryButton } from "../ui/Button";
import { devices } from "../../styles/GlobalStyles";

const getCarImage = (car) => {
  if (!car) return null;

  // If car.images exists and is an array with at least one image
  if (Array.isArray(car.images) && car.images.length > 0) {
    return car.images[0];
  }

  // If car.image exists as a string
  if (typeof car.image === "string") {
    return car.image;
  }

  // Fallback to a default image
  return "/default-car-image.jpg";
};

const CarCard = ({
  car,
  className = "",
  showOverlay = true,
  showBookButton = true,
  showStatus = true, // New prop to show status badge
}) => {
  console.log(car);
  const image = getCarImage(car);

  // Determine availability status
  const isAvailable = car.status === "available";

  const statusText = isAvailable ? "Available" : "Unavailable";
  const statusColor = isAvailable ? "var(--success)" : "var(--error)";
  const statusBg = isAvailable ? "#f0fdf4" : "#fef2f2";
  const statusBorder = isAvailable ? "#bbf7d0" : "#fecaca";

  return (
    <CardWrapper className={`luxury-card ${className}`}>
      <CarImage>
        <img src={image} alt={car.model} />

        {/* Status Badge */}
        {showStatus && (
          <StatusBadge
            $color={statusColor}
            $bgColor={statusBg}
            $borderColor={statusBorder}
          >
            {statusText}
          </StatusBadge>
        )}

        {showOverlay && (
          <CarOverlay>
            <ButtonLink to={`/model/${car._id}`} $size="md">
              View Details
            </ButtonLink>
          </CarOverlay>
        )}
      </CarImage>
      <CarContent>
        <CarHeader>
          <CarModel>{car.model}</CarModel>
          <CarPrice>
            ${car.price}
            <span>/day</span>
          </CarPrice>
        </CarHeader>
        <CarSeries>{car.series}</CarSeries>
        <CarFeatures>
          {car.features.map((feature, idx) => (
            <FeatureTag key={idx}>{feature}</FeatureTag>
          ))}
        </CarFeatures>
        {showBookButton && (
          <BookButtonWrapper>
            <PrimaryButton
              as={Link}
              to={`/model/${car._id}`}
              $size="md"
              disabled={!isAvailable}
            >
              {isAvailable ? "Book This Car" : "Unavailable"}
            </PrimaryButton>
            {!isAvailable && (
              <StatusMessage>Currently not available for booking</StatusMessage>
            )}
          </BookButtonWrapper>
        )}
      </CarContent>
    </CardWrapper>
  );
};

const CardWrapper = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: all var(--transition-normal);
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 500px; /* Ensure minimum height for consistent grid */

  &:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-lg);
  }
  @media ${devices.md} {
    margin: 0 5rem;
  }
`;

const CarImage = styled.div`
  position: relative;
  height: 250px;
  overflow: hidden;
  flex-shrink: 0;

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

// Status Badge Component
const StatusBadge = styled.div`
  position: absolute;
  top: var(--space-md);
  left: var(--space-md);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${(props) => props.$bgColor};
  color: ${(props) => props.$color};
  border: 1px solid ${(props) => props.$borderColor};
  font-family: var(--font-body);
  z-index: 2;
  backdrop-filter: blur(10px);
`;

const CarOverlay = styled.div`
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
  transition: opacity var(--transition-normal);

  ${CardWrapper}:hover & {
    opacity: 1;
  }
`;

const CarContent = styled.div`
  padding: var(--space-xl);
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between; /* Ensure content spreads properly */

  @media ${devices.sm} {
    padding: var(--space-lg);
  }
`;

const CarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-xs);

  @media ${devices.sm} {
    flex-direction: column;
    gap: var(--space-xs);
  }
`;

const CarModel = styled.h3`
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
  font-family: var(--font-heading);
  line-height: 1.3;
`;

const CarPrice = styled.div`
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--primary);
  font-family: var(--font-heading);
  text-align: right;

  span {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    font-weight: var(--font-normal);
  }

  @media ${devices.sm} {
    text-align: left;
  }
`;

const CarSeries = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--space-md);
  font-size: var(--text-sm);
  font-family: var(--font-body);
  line-height: 1.4;
`;

const CarFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-bottom: var(--space-lg);
  min-height: 60px; /* Ensure consistent height for features */
  align-items: flex-start;
`;

const FeatureTag = styled.span`
  background: var(--gray-100);
  color: var(--text-secondary);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  font-family: var(--font-body);
  white-space: nowrap;
`;

const BookButtonWrapper = styled.div`
  margin-top: auto; /* Push button to bottom */
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);

  button {
    width: 100%;

    &:disabled {
      background: var(--gray-300);
      cursor: not-allowed;

      &:hover {
        transform: none;
        box-shadow: none;
      }
    }
  }
`;

const StatusMessage = styled.p`
  font-size: var(--text-sm);
  color: var(--text-muted);
  text-align: center;
  margin: 0;
  font-family: var(--font-body);
  font-style: italic;
`;

export default CarCard;
