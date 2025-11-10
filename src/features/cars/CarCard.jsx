/* eslint-disable react/prop-types */
// src/components/cards/CarCard.jsx
import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FiHeart, FiBarChart2 } from "react-icons/fi";
import { ButtonLink, PrimaryButton } from "../../components/ui/Button";
import { devices } from "../../styles/GlobalStyles";
import { useToggleFavorite, useFavorites } from "../users/hooks/useFavorites";
import { useCurrentUser } from "../auth/useAuth";
import { useCarComparison } from "./hooks/useCarComparison";

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
  // showStatus = true, // New prop to show status badge
}) => {
  const carId = car?.id || car?._id;
  const image = getCarImage(car);
  
  // Favorites functionality
  const { data: currentUser } = useCurrentUser();
  const { data: favoritesData } = useFavorites();
  const { mutate: toggleFavorite, isPending: isTogglingFavorite } = useToggleFavorite();
  
  // Comparison functionality
  const { addToComparison, isInComparison } = useCarComparison();
  
  const favorites = favoritesData?.data?.favorites || [];
  const isFavorite = favorites.some((fav) => (fav._id || fav.id) === carId);
  const inComparison = isInComparison(carId);
  
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentUser?.user) {
      toggleFavorite(carId);
    }
  };

  const handleCompareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToComparison(car);
  };

  // Determine availability status
  // const isAvailable = car.status === "available";

  // const statusText = isAvailable ? "Available" : "Unavailable";
  // const statusColor = isAvailable ? "var(--success)" : "var(--error)";
  // const statusBg = isAvailable ? "#f0fdf4" : "#fef2f2";
  // const statusBorder = isAvailable ? "#bbf7d0" : "#fecaca";

  return (
    <CardWrapper className={`luxury-card ${className}`}>
      <CarImage>
        <img src={image} alt={car.model} />

        {/* Favorite Heart Icon */}
        {currentUser?.user && (
          <FavoriteButton
            onClick={handleFavoriteClick}
            $isFavorite={isFavorite}
            disabled={isTogglingFavorite}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <FiHeart size={20} fill={isFavorite ? "currentColor" : "none"} />
          </FavoriteButton>
        )}

        {/* Compare Icon */}
        <CompareButton
          onClick={handleCompareClick}
          $inComparison={inComparison}
          aria-label={inComparison ? "In comparison" : "Add to comparison"}
          title={inComparison ? "In comparison" : "Add to comparison"}
        >
          <FiBarChart2 size={20} fill={inComparison ? "currentColor" : "none"} />
        </CompareButton>

        {showOverlay && (
          <CarOverlay>
            <ButtonLink to={`/model/${carId}`} $size="md">
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
              to={`/model/${carId}`}
              $size="md"
              // disabled={!isAvailable}
            >
              Book This Car
            </PrimaryButton>
            {/* {!isAvailable && (
              <StatusMessage>Currently not available for booking</StatusMessage>
            )} */}
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
  min-height: 50rem; /* Ensure minimum height for consistent grid */

  &:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-lg);
  }
  @media ${devices.md} {
    margin: 0 1rem;
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

const FavoriteButton = styled.button`
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  z-index: 10;
  color: ${(props) => (props.$isFavorite ? "#ef4444" : "var(--text-secondary)")};
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.1);
    color: ${(props) => (props.$isFavorite ? "#dc2626" : "#ef4444")};
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const CompareButton = styled.button`
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 2px solid ${(props) => (props.$inComparison ? "var(--primary)" : "var(--gray-300)")};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  color: ${(props) => (props.$inComparison ? "var(--primary)" : "var(--text-secondary)")};
  z-index: 3;

  &:hover {
    transform: scale(1.1);
    color: var(--primary);
    border-color: var(--primary);
    background: var(--white);
  }

  &:active {
    transform: scale(0.95);
  }
`;

// Status Badge Component
// const StatusBadge = styled.div`
//   position: absolute;
//   top: var(--space-md);
//   left: var(--space-md);
//   padding: var(--space-xs) var(--space-sm);
//   border-radius: var(--radius-full);
//   font-size: var(--text-xs);
//   font-weight: var(--font-semibold);
//   text-transform: uppercase;
//   letter-spacing: 0.05em;
//   background: ${(props) => props.$bgColor};
//   color: ${(props) => props.$color};
//   border: 1px solid ${(props) => props.$borderColor};
//   font-family: var(--font-body);
//   z-index: 2;
//   backdrop-filter: blur(10px);
// `;

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

// const StatusMessage = styled.p`
//   font-size: var(--text-sm);
//   color: var(--text-muted);
//   text-align: center;
//   margin: 0;
//   font-family: var(--font-body);
//   font-style: italic;
// `;

export default CarCard;
