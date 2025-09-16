// src/components/BookingSteps.js
import styled from "styled-components";

const steps = [
  {
    id: 1,
    title: "Choose Your Car",
    description:
      "Browse our premium Mercedes-Benz fleet and select your ideal model.",
    img: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    title: "Select Dates & Location",
    description: "Pick your rental dates and preferred pick-up location.",
    img: "https://images.unsplash.com/photo-1606312616160-fbb6164b71a0?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    title: "Confirm & Pay",
    description: "Secure your booking with our easy online payment system.",
    img: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    title: "Enjoy Your Ride",
    description:
      "Pick up your Mercedes-Benz and enjoy your premium driving experience.",
    img: "https://images.unsplash.com/photo-1605346382595-d2d499e21c2d?auto=format&fit=crop&w=400&q=80",
  },
];

const BookingSteps = () => {
  return (
    <StepsWrapper>
      <h2>How to Book Your Mercedes-Benz</h2>
      <StepsColumn>
        {steps.map((step, index) => (
          <StepCard key={step.id} reverse={index % 2 !== 0}>
            <StepNumber>{step.id}</StepNumber>
            <StepImage>
              <img src={step.img} alt={step.title} />
            </StepImage>
            <StepInfo>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </StepInfo>
          </StepCard>
        ))}
      </StepsColumn>
    </StepsWrapper>
  );
};

export default BookingSteps;

// ---------------- Styled ---------------- //
const StepsWrapper = styled.section`
  padding: 6rem 2rem;
  background: ${({ theme }) => theme.colors.background || "#fff"};
  text-align: center;

  h2 {
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const StepsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4rem;
`;

const StepCard = styled.div`
  display: flex;
  align-items: center;
  flex-direction: ${({ reverse }) => (reverse ? "row-reverse" : "row")};
  background: ${({ theme }) => theme.colors.white};
  padding: 2rem;
  border-radius: ${({ theme }) => theme.radius.medium};
  box-shadow: ${({ theme }) => theme.shadows.card};
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const StepNumber = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

const StepImage = styled.div`
  width: 50%;
  height: 250px;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.small};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;

    &:hover {
      transform: scale(1.05);
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

const StepInfo = styled.div`
  width: 50%;
  text-align: left;

  h3 {
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.secondary};
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1.1rem;
    color: ${({ theme }) => theme.colors.gray};
  }

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
  }
`;
