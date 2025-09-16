// pages/LocationDetailPage.js
import React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";

const LocationDetailContainer = styled.div`
  padding: 2rem 0;
`;

const LocationHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (min-width: ${(props) => props.theme.breakpoints.tablet}) {
    flex-direction: row;
  }
`;

const LocationImage = styled.div`
  flex: 1;

  img {
    width: 100%;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const LocationInfo = styled.div`
  flex: 1;
`;

const LocationDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const DetailCard = styled.div`
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 0.5rem;

  h3 {
    margin-bottom: 1rem;
    color: ${(props) => props.theme.colors.primary};
  }
`;

const MapContainer = styled.div`
  margin-top: 3rem;
  height: 400px;
  background: #e2e8f0;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LocationDetailPage = () => {
  const { locationId } = useParams();

  // In a real app, this would come from an API based on locationId
  const location = {
    id: locationId,
    name: "New York City",
    address: "123 Broadway, New York, NY 10001",
    phone: "(212) 555-1234",
    hours: "Mon-Sun: 8am-10pm",
    image:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    description:
      "Our New York City location is conveniently located in the heart of Manhattan, just minutes from Times Square and major transportation hubs. We offer a wide selection of vehicles for both business and leisure travelers.",
    services: [
      "24/7 Customer Support",
      "Free Parking",
      "Vehicle Delivery",
      "Airport Shuttle",
    ],
    staff: [
      "John Smith - Manager",
      "Jane Doe - Rental Agent",
      "Mike Johnson - Maintenance",
    ],
  };

  return (
    <LocationDetailContainer className="container">
      <LocationHeader>
        <LocationImage>
          <img src={location.image} alt={location.name} />
        </LocationImage>
        <LocationInfo>
          <h1>{location.name}</h1>
          <p>{location.address}</p>
          <p>
            <strong>Phone:</strong> {location.phone}
          </p>
          <p>
            <strong>Hours:</strong> {location.hours}
          </p>
          <button className="btn btn-primary">Book at This Location</button>
        </LocationInfo>
      </LocationHeader>

      <div>
        <h2>About This Location</h2>
        <p>{location.description}</p>

        <LocationDetails>
          <DetailCard>
            <h3>Services</h3>
            <ul>
              {location.services.map((service, index) => (
                <li key={index}>{service}</li>
              ))}
            </ul>
          </DetailCard>

          <DetailCard>
            <h3>Our Team</h3>
            <ul>
              {location.staff.map((person, index) => (
                <li key={index}>{person}</li>
              ))}
            </ul>
          </DetailCard>

          <DetailCard>
            <h3>Location Details</h3>
            <p>
              <strong>Address:</strong> {location.address}
            </p>
            <p>
              <strong>Phone:</strong> {location.phone}
            </p>
            <p>
              <strong>Hours:</strong> {location.hours}
            </p>
          </DetailCard>
        </LocationDetails>
      </div>

      <div>
        <h2>Find Us</h2>
        <MapContainer>
          <p>Interactive Map would be displayed here</p>
        </MapContainer>
      </div>
    </LocationDetailContainer>
  );
};

export default LocationDetailPage;
