// src/components/CTASection.js
import styled from "styled-components";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <CTAWrapper>
      <CTAContent>
        <Text>
          <h2>Book Your Mercedes Today</h2>
          <p>
            Experience luxury and comfort with our premium Mercedes-Benz fleet.
          </p>
          <LinkButton to="/models">Start Booking</LinkButton>
        </Text>
        <ImageWrapper>
          <Overlay />
          <img
            src="/images/2025-mercedes-benz-gle-350.avif" // ✅ Correct path
            alt="Mercedes-Benz"
          />
        </ImageWrapper>
      </CTAContent>
    </CTAWrapper>
  );
};

export default CTASection;

// ---------------- Styled ---------------- //
const CTAWrapper = styled.section`
  padding: 4rem 2rem;
  background-color: ${({ theme }) => theme.colors.background || "#f8f9fa"};
`;

const CTAContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    text-align: center;
  }
`;

const Text = styled.div`
  flex: 1;
  z-index: 2;
  position: relative;

  h2 {
    font-size: 2.5rem;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.6rem;
    margin-bottom: 2rem;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const ImageWrapper = styled.div`
  flex: 1;
  position: relative;
  border-radius: ${({ theme }) => theme.radius.medium || "12px"};
  overflow: hidden;

  img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
    transition: transform 0.5s;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
`;

const LinkButton = styled(Link)`
  display: inline-block;
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.small};
  font-weight: 600;
  z-index: 2;
  position: relative;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;
