/* eslint-disable react/prop-types */
import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { useAvailableProfessionalDrivers } from "../drivers/useProfessionalDriver";
import { LoadingSpinner } from "./ui/LoadingSpinner";
import { Card } from "./Cards/Card";
import { PrimaryButton, SecondaryButton } from "./ui/Button";
import { FaUser, FaStar, FaLanguage, FaCheckCircle } from "react-icons/fa";

const DriverServiceSelector = ({ 
  onSelectDriver, 
  selectedDriverId, 
  pickupDate, 
  returnDate,
  pickupTime,
  returnTime,
  rentalDays 
}) => {
  const [showDriverList, setShowDriverList] = useState(false);
  const [enableService, setEnableService] = useState(false);

  // Fetch available drivers when dates are selected
  const { data: driversData, isLoading, error } = useAvailableProfessionalDrivers(
    {
      pickupDate,
      returnDate,
      pickupTime,
      returnTime,
    },
    enableService && !!pickupDate && !!returnDate
  );

  const availableDrivers = useMemo(() => {
    return driversData?.data || [];
  }, [driversData]);

  const selectedDriver = useMemo(() => {
    return availableDrivers.find(d => d._id === selectedDriverId);
  }, [availableDrivers, selectedDriverId]);

  const handleToggleService = () => {
    setEnableService(!enableService);
    if (enableService) {
      onSelectDriver(null);
      setShowDriverList(false);
    }
  };

  const handleSelectDriver = (driver) => {
    onSelectDriver(driver._id);
    setShowDriverList(false);
  };

  const calculateDriverCost = (driver) => {
    if (!driver || !rentalDays) return 0;
    return driver.dailyRate * rentalDays;
  };

  if (!enableService) {
    return (
      <DriverServiceCard>
        <ServiceHeader>
          <ServiceTitle>
            <FaUser style={{ marginRight: "8px" }} />
            Add Professional Driver Service
          </ServiceTitle>
          <ServiceDescription>
            Rent a car with our professional chauffeur service. Experienced drivers available for your convenience.
          </ServiceDescription>
        </ServiceHeader>
        <PrimaryButton onClick={handleToggleService} style={{ width: "100%" }}>
          Enable Driver Service
        </PrimaryButton>
      </DriverServiceCard>
    );
  }

  return (
    <DriverServiceCard>
      <ServiceHeader>
        <ServiceTitle>
          <FaUser style={{ marginRight: "8px" }} />
          Professional Driver Service
        </ServiceTitle>
        <SecondaryButton onClick={handleToggleService} size="sm">
          Disable Service
        </SecondaryButton>
      </ServiceHeader>

      {!pickupDate || !returnDate ? (
        <InfoMessage>
          Please select pickup and return dates to see available drivers.
        </InfoMessage>
      ) : isLoading ? (
        <LoadingState>
          <LoadingSpinner />
          <p>Loading available drivers...</p>
        </LoadingState>
      ) : error ? (
        <ErrorMessage>
          Unable to load drivers. Please try again later.
        </ErrorMessage>
      ) : availableDrivers.length === 0 ? (
        <InfoMessage>
          No drivers available for the selected dates. Please try different dates.
        </InfoMessage>
      ) : (
        <>
          {selectedDriver ? (
            <SelectedDriverCard>
              <DriverInfo>
                <DriverAvatar>
                  {selectedDriver.profileImage ? (
                    <img src={selectedDriver.profileImage} alt={selectedDriver.name} />
                  ) : (
                    <FaUser />
                  )}
                </DriverAvatar>
                <DriverDetails>
                  <DriverName>
                    {selectedDriver.name}
                    {selectedDriver.verified && (
                      <FaCheckCircle style={{ color: "#10b981", marginLeft: "8px" }} />
                    )}
                  </DriverName>
                  <DriverMeta>
                    <StarRating>
                      <FaStar style={{ color: "#fbbf24" }} />
                      {selectedDriver.rating?.toFixed(1) || "0.0"}
                    </StarRating>
                    <DriverRides>{selectedDriver.totalRides || 0} rides</DriverRides>
                  </DriverMeta>
                  {selectedDriver.languages?.length > 0 && (
                    <Languages>
                      <FaLanguage style={{ marginRight: "4px" }} />
                      {selectedDriver.languages.join(", ")}
                    </Languages>
                  )}
                  {selectedDriver.bio && (
                    <Bio>{selectedDriver.bio}</Bio>
                  )}
                </DriverDetails>
              </DriverInfo>
              <DriverPricing>
                <PriceInfo>
                  <PriceLabel>Daily Rate:</PriceLabel>
                  <PriceValue>${selectedDriver.dailyRate}/day</PriceValue>
                </PriceInfo>
                {rentalDays > 0 && (
                  <TotalCost>
                    <TotalLabel>Total Driver Cost:</TotalLabel>
                    <TotalValue>${calculateDriverCost(selectedDriver).toFixed(2)}</TotalValue>
                  </TotalCost>
                )}
              </DriverPricing>
              <SecondaryButton 
                onClick={() => setShowDriverList(true)} 
                style={{ width: "100%", marginTop: "12px" }}
              >
                Change Driver
              </SecondaryButton>
            </SelectedDriverCard>
          ) : (
            <>
              {!showDriverList ? (
                <PrimaryButton 
                  onClick={() => setShowDriverList(true)} 
                  style={{ width: "100%" }}
                >
                  Select a Driver
                </PrimaryButton>
              ) : (
                <DriversList>
                  <ListHeader>
                    <h3>Available Drivers ({availableDrivers.length})</h3>
                    <SecondaryButton onClick={() => setShowDriverList(false)} size="sm">
                      Cancel
                    </SecondaryButton>
                  </ListHeader>
                  {availableDrivers.map((driver) => (
                    <DriverCard 
                      key={driver._id}
                      onClick={() => handleSelectDriver(driver)}
                      $selected={selectedDriverId === driver._id}
                    >
                      <DriverInfo>
                        <DriverAvatar>
                          {driver.profileImage ? (
                            <img src={driver.profileImage} alt={driver.name} />
                          ) : (
                            <FaUser />
                          )}
                        </DriverAvatar>
                        <DriverDetails>
                          <DriverName>
                            {driver.name}
                            {driver.verified && (
                              <FaCheckCircle style={{ color: "#10b981", marginLeft: "8px" }} />
                            )}
                          </DriverName>
                          <DriverMeta>
                            <StarRating>
                              <FaStar style={{ color: "#fbbf24" }} />
                              {driver.rating?.toFixed(1) || "0.0"}
                            </StarRating>
                            <DriverRides>{driver.totalRides || 0} rides</DriverRides>
                          </DriverMeta>
                          {driver.languages?.length > 0 && (
                            <Languages>
                              <FaLanguage style={{ marginRight: "4px" }} />
                              {driver.languages.join(", ")}
                            </Languages>
                          )}
                          {driver.bio && (
                            <Bio>{driver.bio}</Bio>
                          )}
                        </DriverDetails>
                      </DriverInfo>
                      <DriverPricing>
                        <PriceInfo>
                          <PriceLabel>Daily Rate:</PriceLabel>
                          <PriceValue>${driver.dailyRate}/day</PriceValue>
                        </PriceInfo>
                        {rentalDays > 0 && (
                          <TotalCost>
                            <TotalLabel>Total:</TotalLabel>
                            <TotalValue>${calculateDriverCost(driver).toFixed(2)}</TotalValue>
                          </TotalCost>
                        )}
                      </DriverPricing>
                    </DriverCard>
                  ))}
                </DriversList>
              )}
            </>
          )}
        </>
      )}
    </DriverServiceCard>
  );
};

export default DriverServiceSelector;

// Styled Components
const DriverServiceCard = styled(Card)`
  margin: 1.5rem 0;
  padding: 1.5rem;
`;

const ServiceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ServiceTitle = styled.h3`
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

const ServiceDescription = styled.p`
  color: var(--text-muted);
  font-size: 0.9rem;
  margin: 0.5rem 0 0 0;
`;

const InfoMessage = styled.div`
  padding: 1rem;
  background: var(--background-light);
  border-radius: 8px;
  color: var(--text-muted);
  text-align: center;
`;

const ErrorMessage = styled(InfoMessage)`
  background: #fee2e2;
  color: #991b1b;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  gap: 1rem;
`;

const SelectedDriverCard = styled.div`
  border: 2px solid var(--primary);
  border-radius: 12px;
  padding: 1.5rem;
  background: var(--background-light);
`;

const DriversList = styled.div`
  max-height: 500px;
  overflow-y: auto;
  margin-top: 1rem;
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  h3 {
    margin: 0;
    font-size: 1.1rem;
  }
`;

const DriverCard = styled.div`
  border: 2px solid ${props => props.$selected ? "var(--primary)" : "#e5e7eb"};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.$selected ? "var(--background-light)" : "white"};
  
  &:hover {
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const DriverInfo = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const DriverAvatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--background-light);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  svg {
    font-size: 1.5rem;
    color: var(--text-muted);
  }
`;

const DriverDetails = styled.div`
  flex: 1;
`;

const DriverName = styled.h4`
  display: flex;
  align-items: center;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const DriverMeta = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const StarRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const DriverRides = styled.span`
  color: var(--text-muted);
`;

const Languages = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
`;

const Bio = styled.p`
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0.5rem 0 0 0;
  line-height: 1.5;
`;

const DriverPricing = styled.div`
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
  margin-top: 1rem;
`;

const PriceInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const PriceLabel = styled.span`
  color: var(--text-muted);
  font-size: 0.9rem;
`;

const PriceValue = styled.span`
  font-weight: 600;
  color: var(--text-primary);
`;

const TotalCost = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 0.5rem;
  border-top: 1px solid #e5e7eb;
  margin-top: 0.5rem;
`;

const TotalLabel = styled.span`
  font-weight: 600;
  color: var(--text-primary);
`;

const TotalValue = styled.span`
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--primary);
`;

