// src/components/cards/CarCard.jsx
import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { ButtonLink, PrimaryButton } from "../ui/Button";
import { devices } from "../../styles/GlobalStyles";

const CarCard = ({
  car,
  className = "",
  showOverlay = true,
  showBookButton = true,
}) => {
  return (
    <CardWrapper className={`luxury-card ${className}`}>
      <CarImage>
        <img src={car.images[0]} alt={car.model} />
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
            <PrimaryButton as={Link} to={`/model/${car.id}`} $size="md">
              Book This Car
            </PrimaryButton>
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

  button {
    width: 100%;
  }
`;

export default CarCard;
