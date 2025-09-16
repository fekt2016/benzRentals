import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import HeroSection from "../components/HeroSection";
import CarShowcase from "../components/CarShowcase";
import BookingSteps from "../components/BookingStep";
import CTASection from "../components/CTASection";

const HomePage = () => {
  return (
    <Wrapper>
      <HeroSection />
      <CarShowcase />
      <Section dark>
        <h2>Why Choose BenzRent?</h2>
        <Features>
          <Feature>
            <h3>Luxury Only</h3>
            <p>Exclusive Mercedes-Benz fleet, no compromises.</p>
          </Feature>
          <Feature>
            <h3>Easy Booking</h3>
            <p>Reserve your dream car online in minutes.</p>
          </Feature>
          <Feature>
            <h3>24/7 Support</h3>
            <p>Our team is always here to assist you.</p>
          </Feature>
        </Features>
      </Section>

      {/* Booking Steps */}
      <BookingSteps />

      {/* Call To Action */}
      <CTASection />
    </Wrapper>
  );
};

export default HomePage;

// -------------------- Styles --------------------
const Wrapper = styled.div`
  font-family: "Arial", sans-serif;
`;

const Hero = styled.section`
  height: 100vh;
  background: url("https://images.unsplash.com/photo-1607860108855-7e9248e49963?auto=format&fit=crop&w=1600&q=80")
    center/cover no-repeat;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 80px; /* offset for fixed navbar */
  text-align: center;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.55);
`;

const HeroContent = styled.div`
  position: relative;
  color: white;
  z-index: 1;
  padding: 0 1rem;

  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  p {
    font-size: 1.25rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }
    p {
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    h1 {
      font-size: 1.5rem;
    }
    p {
      font-size: 0.9rem;
    }
  }
`;

const LinkButton = styled(Link)`
  padding: 0.75rem 1.5rem;
  background: white;
  color: black;
  border-radius: 6px;
  font-weight: bold;
  text-decoration: none;
  transition: background 0.3s;

  &:hover {
    background: #ddd;
  }
`;

const Section = styled.section`
  padding: 4rem 2rem;
  background: ${({ dark }) => (dark ? "#111" : "#fff")};
  color: ${({ dark }) => (dark ? "#fff" : "#000")};
  text-align: center;

  h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
    h2 {
      font-size: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    padding: 2rem 1rem;
    h2 {
      font-size: 1.25rem;
    }
  }
`;

const CarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const CarCard = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  img {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }

  h3 {
    margin: 1rem 0 0.5rem;
  }

  p {
    margin-bottom: 1rem;
    color: #555;
  }
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const Feature = styled.div`
  h3 {
    margin-bottom: 0.5rem;
  }
`;

const CTA = styled.section`
  padding: 3rem 2rem;
  background: black;
  color: white;
  text-align: center;

  h2 {
    margin-bottom: 1.5rem;
    font-size: 2rem;
  }

  @media (max-width: 768px) {
    h2 {
      font-size: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    padding: 2rem 1rem;
    h2 {
      font-size: 1.25rem;
    }
  }
`;
