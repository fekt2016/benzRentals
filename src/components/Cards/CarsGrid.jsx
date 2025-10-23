// // src/components/layout/CarsGrid.jsx
// import React from "react";
// import styled from "styled-components";
// import { devices } from "../../styles/GlobalStyles";

// const CarsGrid = ({ children, className = "", columns = 3 }) => {
//   return (
//     <GridWrapper className={className} $columns={columns}>
//       {children}
//     </GridWrapper>
//   );
// };

// const GridWrapper = styled.div`
//   display: grid;
//   grid-template-columns: repeat(${(props) => props.$columns}, 1fr);
//   gap: var(--space-lg);
//   margin-bottom: var(--space-xl);

//   @media ${devices.lg} {
//     grid-template-columns: ${(props) =>
//       props.$columns >= 3
//         ? "repeat(2, 1fr)"
//         : `repeat(${props.$columns}, 1fr)`};
//   }

//   @media ${devices.md} {
//     grid-template-columns: 1fr;
//     gap: var(--space-md);
//     margin-bottom: var(--space-lg);
//   }
// `;

// export default CarsGrid;
