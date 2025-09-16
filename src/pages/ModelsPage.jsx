// src/pages/ModelsPage.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

// Sample cars data with state
const cars = [
  {
    id: 1,
    name: "Mercedes-Benz S-Class",
    type: "Luxury Sedan",
    fuel: "Hybrid",
    seats: 5,
    price: 250,
    state: "California",
    img: "https://images.unsplash.com/photo-1616422285623-0564b7566bbb?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 2,
    name: "Mercedes-Benz G-Wagon",
    type: "Luxury SUV",
    fuel: "Petrol",
    seats: 5,
    price: 400,
    state: "Texas",
    img: "https://images.unsplash.com/photo-1600185365873-d31a9eac8d4f?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 3,
    name: "Mercedes-Benz C-Class",
    type: "Sedan",
    fuel: "Petrol",
    seats: 5,
    price: 180,
    state: "California",
    img: "https://images.unsplash.com/photo-1616789068151-d2a0c2ff7605?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 4,
    name: "Mercedes-Benz E-Class",
    type: "Executive Sedan",
    fuel: "Diesel",
    seats: 5,
    price: 220,
    state: "Florida",
    img: "https://images.unsplash.com/photo-1605538031846-770aaebd5b6e?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 5,
    name: "Mercedes-Benz AMG GT",
    type: "Sports Car",
    fuel: "Petrol",
    seats: 2,
    price: 500,
    state: "Texas",
    img: "https://images.unsplash.com/photo-1617817145159-cfb35c50a648?auto=format&fit=crop&w=1000&q=80",
  },
];

const ModelsPage = () => {
  const [selectedState, setSelectedState] = useState("All");

  const states = ["All", ...new Set(cars.map((car) => car.state))];

  // Filter cars based on selected state
  const filteredCars =
    selectedState === "All"
      ? cars
      : cars.filter((car) => car.state === selectedState);

  return (
    <PageWrapper>
      <Hero>
        <h1>Our Mercedes-Benz Fleet</h1>
        <p>Choose your dream car and reserve it today!</p>
      </Hero>

      <FilterSection>
        <label htmlFor="state-select">Select State:</label>
        <select
          id="state-select"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
        >
          {states.map((state, index) => (
            <option key={index} value={state}>
              {state}
            </option>
          ))}
        </select>
      </FilterSection>

      <CarsGrid>
        {filteredCars.map((car) => (
          <CarCard key={car.id}>
            <CarImage>
              <img src={car.img} alt={car.name} />
            </CarImage>
            <CarInfo>
              <h3>{car.name}</h3>
              <Specs>
                <span>{car.type}</span>
                <span>{car.fuel}</span>
                <span>{car.seats} Seats</span>
              </Specs>
              <Price>${car.price}/day</Price>
              <Link to={`/model/${car.id}`}>
                <DetailsButton>View Details</DetailsButton>
              </Link>
            </CarInfo>
          </CarCard>
        ))}
      </CarsGrid>
    </PageWrapper>
  );
};

export default ModelsPage;

// ---------------- Styled Components ---------------- //
const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Hero = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.primary};
  }

  p {
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.gray};
  }
`;

const FilterSection = styled.div`
  margin-bottom: 2rem;
  text-align: center;

  label {
    margin-right: 1rem;
    font-weight: 500;
  }

  select {
    padding: 0.5rem 1rem;
    border-radius: ${({ theme }) => theme.radius.small};
    border: 1px solid #ccc;
    font-size: 1rem;
  }
`;

const CarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
`;

const CarCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.medium};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CarImage = styled.div`
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CarInfo = styled.div`
  padding: 1.5rem;

  h3 {
    margin-bottom: 0.5rem;
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const Specs = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0 1rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.gray};
`;

const Price = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
`;

const DetailsButton = styled.button`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: 0.8rem;
  border: none;
  border-radius: ${({ theme }) => theme.radius.small};
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;
