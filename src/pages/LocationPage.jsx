// pages/LocationsPage.js
import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const LocationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const LocationCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const LocationImage = styled.div`
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const LocationInfo = styled.div`
  padding: 1.5rem;
`;

const LocationsPage = () => {
  const locations = [
    {
      id: "new-york",
      name: "New York City",
      address: "123 Broadway, New York, NY 10001",
      phone: "(212) 555-1234",
      hours: "Mon-Sun: 8am-10pm",
      image:
        "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    },
    {
      id: "los-angeles",
      name: "Los Angeles",
      address: "456 Sunset Blvd, Los Angeles, CA 90001",
      phone: "(310) 555-5678",
      hours: "Mon-Sun: 7am-11pm",
      image:
        "https://images.unsplash.com/photo-1515896769750-31548aa180f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    },
    {
      id: "chicago",
      name: "Chicago",
      address: "789 Michigan Ave, Chicago, IL 60601",
      phone: "(312) 555-9012",
      hours: "Mon-Sun: 8am-9pm",
      image:
        "https://images.unsplash.com/photo-1513642627252-8f9ed5f0d5da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    },
    {
      id: "miami",
      name: "Miami",
      address: "101 Ocean Dr, Miami, FL 33139",
      phone: "(305) 555-3456",
      hours: "Mon-Sun: 7am-10pm",
      image:
        "https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    },
    {
      id: "las-vegas",
      name: "Las Vegas",
      address: "202 Las Vegas Blvd, Las Vegas, NV 89101",
      phone: "(702) 555-7890",
      hours: "24/7",
      image:
        "https://images.unsplash.com/photo-1581351721010-4d3f50b77f4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    },
    {
      id: "san-francisco",
      name: "San Francisco",
      address: "303 Golden Gate Ave, San Francisco, CA 94102",
      phone: "(415) 555-2345",
      hours: "Mon-Sun: 8am-9pm",
      image:
        "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    },
  ];

  return (
    <div className="container">
      <div className="section">
        <h1 className="section-title">Our Locations</h1>
        <p style={{ textAlign: "center", marginBottom: "2rem" }}>
          We have rental locations across the United States for your
          convenience.
        </p>

        <LocationsGrid>
          {locations.map((location) => (
            <LocationCard key={location.id}>
              <LocationImage>
                <img src={location.image} alt={location.name} />
              </LocationImage>
              <LocationInfo>
                <h3>{location.name}</h3>
                <p>{location.address}</p>
                <p>{location.phone}</p>
                <p>{location.hours}</p>
                <Link
                  to={`/locations/${location.id}`}
                  className="btn btn-primary"
                  style={{ marginTop: "1rem" }}
                >
                  View Details
                </Link>
              </LocationInfo>
            </LocationCard>
          ))}
        </LocationsGrid>
      </div>
    </div>
  );
};

export default LocationsPage;
