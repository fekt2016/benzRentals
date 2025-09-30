// src/components/CarCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { LuxuryCard, Badges, FeatureTag, Button } from "../components";

const CarCard = ({ car, className }) => {
  return (
    <Card
      className={className}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <CarImage>
        <img
          src={car.images?.[0] || "/default-car.jpg"}
          alt={car.model}
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop";
          }}
        />
        <StatusBadge status={car.status}>
          {car.status === "available"
            ? "Available"
            : car.status === "rented"
            ? "Rented"
            : car.status === "maintenance"
            ? "Maintenance"
            : "Reserved"}
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
          <SpecItem>🚗 {car.transmission || "Automatic"}</SpecItem>
          <SpecItem>⛽ {car.fuelType || "Premium"}</SpecItem>
          <SpecItem>👥 {car.seats || 5} Seats</SpecItem>
        </CarSpecs>

        {car.features && car.features.length > 0 && (
          <CarFeatures>
            {car.features.slice(0, 3).map((feature, index) => (
              <FeatureTag key={index}>{feature}</FeatureTag>
            ))}
            {car.features.length > 3 && (
              <FeatureTag>+{car.features.length - 3} more</FeatureTag>
            )}
          </CarFeatures>
        )}

        <BookButton to={`/model/${car._id}`} $size="lg">
          Book Now
        </BookButton>
      </CarContent>
    </Card>
  );
};

const Card = styled(LuxuryCard)`
  display: flex;
  flex-direction: column;
  height: 100%;
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

  ${Card}:hover & img {
    transform: scale(1.05);
  }
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

  ${Card}:hover & {
    opacity: 1;
  }
`;

const ViewDetailsButton = styled(Link)`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  text-decoration: none;
  font-weight: ${({ theme }) =>
    theme.typography.fontWeights["Plus Jakarta Sans"].semibold};
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    transform: scale(1.05);
  }
`;

const CarContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CarModel = styled.h3`
  font-family: ${({ theme }) => theme.typography.fonts.heading};
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) =>
    theme.typography.fontWeights["Cormorant Garamond"].semibold};
  color: ${({ theme }) => theme.colors.secondary};
  margin: 0;
`;

const CarPrice = styled.div`
  font-family: ${({ theme }) => theme.typography.fonts.body};
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) =>
    theme.typography.fontWeights["Plus Jakarta Sans"].bold};
  color: ${({ theme }) => theme.colors.primary};

  span {
    font-size: ${({ theme }) => theme.typography.sizes.sm};
    color: ${({ theme }) => theme.colors.text.muted};
    font-weight: normal;
  }
`;

const CarSeries = styled.p`
  color: ${({ theme }) => theme.colors.text.muted};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
`;

const CarSpecs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const SpecItem = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
`;

const CarFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const BookButton = styled(Button).attrs({ as: Link })`
  margin-top: auto;
  width: 100%;
  justify-content: center;
`;

export default CarCard;
