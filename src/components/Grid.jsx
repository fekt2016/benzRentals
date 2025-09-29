// components/ui/Grid.jsx
import styled from "styled-components";

export const Grid = styled.div`
  display: grid;
  grid-template-columns: ${({ columns = 1, $template }) =>
    $template || `repeat(${columns}, 1fr)`};
  gap: ${({ gap = "md", theme }) => {
    switch (gap) {
      case "sm":
        return theme.spacing.sm;
      case "md":
        return theme.spacing.md;
      case "lg":
        return theme.spacing.lg;
      case "xl":
        return theme.spacing.xl;
      default:
        return theme.spacing.md;
    }
  }};
  margin: ${({ margin = "0" }) => margin};

  /* Responsive behavior */
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    ${({ columns, responsive = true, $template }) =>
      responsive &&
      !$template &&
      columns > 2 &&
      `
        grid-template-columns: repeat(2, 1fr);
      `}
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    ${({ responsive = true, $template }) =>
      responsive &&
      !$template &&
      `
        grid-template-columns: 1fr;
      `}
  }

  /* Additional alignment properties */
  align-items: ${({ align = "stretch" }) => align};
  justify-items: ${({ justify = "stretch" }) => justify};
`;

// Specialized Grid Components
export const CardsGrid = styled(Grid).attrs({
  columns: 3,
  responsive: true,
})`
  /* Additional styling specific to card grids */
`;

export const StatsGrid = styled(Grid).attrs({
  columns: 4,
  responsive: true,
})`
  /* Stats specific styling */
`;

export const FeaturesGrid = styled(Grid).attrs({
  columns: 2,
  responsive: true,
})`
  /* Features specific styling */
`;

// Auto-fit grid for flexible layouts
export const AutoGrid = styled(Grid)`
  grid-template-columns: ${({ $minWidth = "300px" }) =>
    `repeat(auto-fit, minmax(${$minWidth}, 1fr))`};

  /* Override responsive behavior for auto-grid */
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: ${({ $minWidth = "300px" }) =>
      `repeat(auto-fit, minmax(${$minWidth}, 1fr))`};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;
