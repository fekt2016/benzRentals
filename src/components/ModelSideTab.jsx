import React from "react";
import styled, { keyframes } from "styled-components";
import CarDetails from "./CarDetails";
import CarReviews from "./CarReviews";

export default function ModelSideTab({ car, modelId }) {
  const [activeTab, setActiveTab] = React.useState("details");
  return (
    <DetailsWrapper>
      {/* Tab Navigation */}
      <TabNavigation>
        <Tab
          active={activeTab === "details"}
          onClick={() => setActiveTab("details")}
        >
          📋 Details
        </Tab>
        <Tab
          active={activeTab === "features"}
          onClick={() => setActiveTab("features")}
        >
          ⚡ Features
        </Tab>
        <Tab
          active={activeTab === "reviews"}
          onClick={() => setActiveTab("reviews")}
        >
          💬 Reviews
        </Tab>
      </TabNavigation>

      {/* Tab Content */}
      <TabContent>
        {activeTab === "details" && (
          <TabPanel>
            <CarDetails car={car} />
          </TabPanel>
        )}

        {activeTab === "features" && (
          <TabPanel>
            <FeaturesGrid>
              {(
                car.features || [
                  "Air Conditioning",
                  "Bluetooth",
                  "Navigation System",
                  "Backup Camera",
                  "Leather Seats",
                  "Sunroof",
                  "Keyless Entry",
                  "Premium Sound System",
                ]
              ).map((feature, index) => (
                <FeatureItem key={index}>✅ {feature}</FeatureItem>
              ))}
            </FeaturesGrid>
          </TabPanel>
        )}

        {activeTab === "reviews" && (
          <TabPanel>
            <CarReviews modelId={modelId} carId={car._id} />
          </TabPanel>
        )}
      </TabContent>
    </DetailsWrapper>
  );
}
// Modern animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const DetailsWrapper = styled.div`
  flex: 1 1 35%;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;

  @media (max-width: 968px) {
    order: 2;
  }
`;

const TabNavigation = styled.div`
  display: flex;
  background: #f8fafc;
  border-radius: 12px;
  padding: 4px;
  gap: 4px;
`;

const Tab = styled.button`
  flex: 1;
  padding: 12px 16px;
  border: none;
  background: ${(props) => (props.active ? "#3b82f6" : "transparent")};
  color: ${(props) => (props.active ? "white" : "#6b7280")};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 0.9rem;

  &:hover {
    background: ${(props) => (props.active ? "#3b82f6" : "#e5e7eb")};
  }
`;

const TabContent = styled.div`
  min-height: 300px;
`;

const TabPanel = styled.div`
  animation: ${fadeInUp} 0.5s ease-out;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
`;

const FeatureItem = styled.div`
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  font-weight: 500;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateX(5px);
    background: #f0f4f8;
  }
`;
