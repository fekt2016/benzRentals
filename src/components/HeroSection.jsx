// src/components/HeroSection.jsx
import React from "react";
import styled from "styled-components";

const HeroSection = () => {
  return (
    <Hero>
      <HeroContent>
        <h1>Drive Luxury. Drive Mercedes.</h1>
        <p>Experience premium Benz rentals at unbeatable prices.</p>

        {/* Search Form Card */}
        <FormCard>
          <SearchForm>
            <input type="text" placeholder="Pick-up Location" />
            <input type="date" />
            <input type="date" />
            <select>
              <option value="">Select Car Type</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="coupe">Coupe</option>
              <option value="convertible">Convertible</option>
              <option value="wagon">Wagon</option>
            </select>
            <SearchButton type="submit">Find Your Mercedes</SearchButton>
          </SearchForm>
        </FormCard>
      </HeroContent>
    </Hero>
  );
};

export default HeroSection;

const Hero = styled.section`
  height: 80vh;
  width: 100%;
  background-image: url("images/ben1.jpg"); // place your image in public/images
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  color: ${({ theme }) => theme.colors.white};
  max-width: 1000px;
  padding: 2rem;

  h1 {
    font-size: 4rem;
    font-family: ${({ theme }) => theme.fonts.heading};
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.primary};
  }

  p {
    font-size: 1.6rem;
    margin-bottom: 2.5rem;
    color: ${({ theme }) => theme.colors.white};
  }
`;

const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.5);
  padding: 2rem;
  border-radius: ${({ theme }) => theme.radius.medium};
  display: inline-block;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const SearchForm = styled.form`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;

  input,
  select {
    padding: 1.2rem 1.5rem;
    border-radius: ${({ theme }) => theme.radius.small};
    border: 1px solid ${({ theme }) => theme.colors.gray};
    font-size: 1.4rem;
    flex: 1 1 200px;
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.text};
  }

  select {
    cursor: pointer;
  }
`;

const SearchButton = styled.button`
  padding: 1.2rem 2rem;
  border-radius: ${({ theme }) => theme.radius.small};
  border: none;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;
