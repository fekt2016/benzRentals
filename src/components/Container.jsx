import styled from "styled-components";

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 ${({ theme }) => theme.spacing.md};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 ${({ theme }) => theme.spacing.sm};
  }
`;

export const Section = styled.section`
  padding: ${({ $size = "lg" }) => {
    switch ($size) {
      case "sm":
        return "3rem 0";
      case "md":
        return "5rem 0";
      case "lg":
        return "6rem 0";
      default:
        return "6rem 0";
    }
  }};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ $size = "lg" }) => {
      switch ($size) {
        case "sm":
          return "2rem 0";
        case "md":
          return "3rem 0";
        case "lg":
          return "4rem 0";
        default:
          return "4rem 0";
      }
    }};
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: ${({ columns = 1 }) => `repeat(${columns}, 1fr)`};
  gap: ${({ gap = "md" }) => {
    switch (gap) {
      case "sm":
        return "1rem";
      case "md":
        return "2rem";
      case "lg":
        return "3rem";
      default:
        return "2rem";
    }
  }};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: ${({ columns, responsive = true }) =>
      responsive && columns > 2 ? "repeat(2, 1fr)" : "1fr"};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

export const Flex = styled.div`
  display: flex;
  gap: ${({ gap = "md" }) => {
    switch (gap) {
      case "sm":
        return "0.5rem";
      case "md":
        return "1rem";
      case "lg":
        return "2rem";
      default:
        return "1rem";
    }
  }};
  align-items: ${({ align = "center" }) => align};
  justify-content: ${({ justify = "flex-start" }) => justify};
  flex-direction: ${({ direction = "row" }) => direction};
  flex-wrap: ${({ wrap = "nowrap" }) => wrap};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: ${({ responsive = true, direction }) =>
      responsive && direction === "row" ? "column" : direction};
  }
`;
