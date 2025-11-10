/* eslint-disable react/prop-types */
import React from "react";
import styled from "styled-components";
import {
  FaCar,
  FaCalendarAlt,
  FaGasPump,
  FaUsers,
  FaDollarSign,
  FaCog,
  FaCheckCircle,
  FaTachometerAlt,
  FaPalette,
  FaShieldAlt,
} from "react-icons/fa";
import {scaleIn, glow, fadeInUp } from '../../styles/animations';

const CarDetails = ({ car }) => {
 
  // Animation for icon entrances

  const details = [
    { icon: FaCar, label: "Series", value: car.series, color: "#3B82F6" },
    { icon: FaCalendarAlt, label: "Year", value: car.year, color: "#10B981" },
    {
      icon: FaGasPump,
      label: "Fuel Type",
      value: car.fuelType,
      color: "#F59E0B",
    },
    { icon: FaUsers, label: "Seats", value: car.seats, color: "#EF4444" },
    {
      icon: FaDollarSign,
      label: "Price/Day",
      value: `$${car.pricePerDay}`,
      color: "#8B5CF6",
    },
    {
      icon: FaCog,
      label: "Transmission",
      value: car.transmission,
      color: "#06B6D4",
    },
    {
      icon: FaTachometerAlt,
      label: "Mileage",
      value: car.mileage || "15,000 km",
      color: "#F97316",
    },
    {
      icon: FaPalette,
      label: "Color",
      value: car.color || "Obsidian Black",
      color: "#EC4899",
    },
  ];

  const statusConfig = {
    available: { color: "#10B981", bg: "#DCFCE7", icon: "✅" },
    unavailable: { color: "#EF4444", bg: "#FECACA", icon: "⏸️" },
    maintenance: { color: "#F59E0B", bg: "#FEF3C7", icon: "🔧" },
    reserved: { color: "#8B5CF6", bg: "#F3E8FF", icon: "📅" },
  };

  const status = statusConfig[car.status] || statusConfig.unavailable;

  return (
    <Wrapper>
      {/* Header with Status */}
      <Header>
        <Title>
          Vehicle Specifications
        </Title>
        <StatusBadge $color={status.color} $bg={status.bg}>
          {status.icon} {car.status?.toUpperCase() || "UNAVAILABLE"}
        </StatusBadge>
      </Header>

      {/* Main Details Grid */}
      <DetailsGrid>
        {details.map((item, index) => {
          
          return <DetailCard key={item.label} $delay={index * 0.1}>
            <DetailIcon $color={item.color}>
              <item.icon />
            </DetailIcon>
            <DetailContent>
              <DetailLabel>{item.label}</DetailLabel>
              <DetailValue>{item.value}</DetailValue>
            </DetailContent>
          </DetailCard>
})}
      </DetailsGrid>

      {/* Features Section */}
      {car.features && car.features.length > 0 && (
        <FeaturesSection>
          <SectionTitle>
            <FaCheckCircle />
            Premium Features
          </SectionTitle>
          <FeaturesGrid>
            {car.features.slice(0, 6).map((feature, index) => (
              <FeatureItem key={index}>
                <FeatureDot $delay={index * 0.1} />
                {feature}
              </FeatureItem>
            ))}
          </FeaturesGrid>
        </FeaturesSection>
      )}

      {/* Safety & Specifications */}
      <SpecsGrid>
        <SpecCard>
          <SpecIcon $color="#06B6D4">
            <FaShieldAlt />
          </SpecIcon>
          <SpecContent>
            <SpecTitle>Safety Rating</SpecTitle>
            <SpecValue>⭐ 5/5 Stars</SpecValue>
          </SpecContent>
        </SpecCard>

        <SpecCard>
          <SpecIcon $color="#10B981">
            <FaTachometerAlt />
          </SpecIcon>
          <SpecContent>
            <SpecTitle>Fuel Economy</SpecTitle>
            <SpecValue>8.2L/100km</SpecValue>
          </SpecContent>
        </SpecCard>
      </SpecsGrid>

      {/* Additional Info */}
      <AdditionalInfo>
        <InfoItem>
          <strong>📦 Trunk Space:</strong> 450L
        </InfoItem>
        <InfoItem>
          <strong>🎵 Audio:</strong> Premium Burmester® Surround Sound
        </InfoItem>
        <InfoItem>
          <strong>🛡️ Insurance:</strong> Comprehensive Coverage Included
        </InfoItem>
      </AdditionalInfo>
    </Wrapper>
  );
};

export default CarDetails;





// Styled Components
const Wrapper = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: ${fadeInUp} 0.6s ease-out;

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h2`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.8rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  background: linear-gradient(135deg, #1f2937 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

// const CarIcon = styled.span`
//   font-size: 2rem;
//   animation: ${pulse} 2s ease-in-out infinite;
// `;

const StatusBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  background: ${(props) => props.$bg};
  color: ${(props) => props.$color};
  animation: ${scaleIn} 0.5s ease-out;
`;

const DetailsGrid = styled.div`
  display: grid;
   gap: 1.5rem;
  grid-template-columns: repeat(2, 1fr);


  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const DetailCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.6s ease-out ${(props) => props.$delay}s both;
 

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`;

const DetailIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: ${(props) => props.$color}15;
  color: ${(props) => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  transition: all 0.3s ease;

  ${DetailCard}:hover & {
    transform: scale(1.1);
    animation: ${glow} 1s ease-in-out;
  }
`;

const DetailContent = styled.div`
  flex: 1;
`;

const DetailLabel = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const FeaturesSection = styled.div`
  margin: 2.5rem 0;
  padding: 2rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 16px;
  border-left: 4px solid #3b82f6;

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 2rem 0;
  }
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.4rem;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  font-weight: 500;
  color: #374151;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateX(5px);
    background: white;
  }
`;

const FeatureDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3b82f6;
  animation: ${scaleIn} 0.5s ease-out ${(props) => props.$delay}s both;
`;

const SpecsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const SpecCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const SpecIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: ${(props) => props.$color}15;
  color: ${(props) => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const SpecContent = styled.div`
  flex: 1;
`;

const SpecTitle = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const SpecValue = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
`;

const AdditionalInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  margin-top: 1.5rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: #4b5563;

  strong {
    color: #1f2937;
    font-weight: 600;
  }
`;
