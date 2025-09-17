import React from "react";
import styled from "styled-components";
import { FaEdit, FaTrash } from "react-icons/fa";

const Container = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  margin-bottom: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.5rem;
  min-width: 700px;

  th,
  td {
    padding: 1rem;
    text-align: left;
  }

  th {
    border-bottom: 2px solid ${({ theme }) => theme.colors.gray};
  }

  td {
    background: ${({ theme }) => theme.colors.white};
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray};
    border-radius: var(--radius-sm);
  }

  @media (max-width: 767px) {
    display: none; /* Hide table on mobile */
  }
`;

const CardList = styled.div`
  display: none;

  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

const CarCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 1rem;
  border-radius: var(--radius-lg);
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  div {
    display: flex;
    justify-content: space-between;
  }
`;

const ActionBtn = styled.button`
  padding: 0.3rem 0.6rem;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  background-color: ${({ color }) => color || "#333"};
  color: white;
  margin-right: 0.5rem;

  &:hover {
    opacity: 0.8;
  }
`;

const CarsManagementPage = () => {
  const cars = [
    { id: 1, model: "C-Class", series: "C200", year: 2025, pricePerDay: 150 },
    { id: 2, model: "E-Class", series: "E350", year: 2024, pricePerDay: 200 },
    { id: 3, model: "S-Class", series: "S500", year: 2025, pricePerDay: 300 },
  ];

  return (
    <Container>
      <Title>Manage Cars</Title>

      {/* Desktop Table */}
      <Table>
        <thead>
          <tr>
            <th>Model</th>
            <th>Series</th>
            <th>Year</th>
            <th>Price/Day</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.id}>
              <td>{car.model}</td>
              <td>{car.series}</td>
              <td>{car.year}</td>
              <td>${car.pricePerDay}</td>
              <td>
                <ActionBtn color="#FFA500" title="Edit">
                  <FaEdit />
                </ActionBtn>
                <ActionBtn color="#FF4C4C" title="Delete">
                  <FaTrash />
                </ActionBtn>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Mobile Cards */}
      <CardList>
        {cars.map((car) => (
          <CarCard key={car.id}>
            <div>
              <span>Model:</span>
              <span>{car.model}</span>
            </div>
            <div>
              <span>Series:</span>
              <span>{car.series}</span>
            </div>
            <div>
              <span>Year:</span>
              <span>{car.year}</span>
            </div>
            <div>
              <span>Price/Day:</span>
              <span>${car.pricePerDay}</span>
            </div>
            <div>
              <ActionBtn color="#FFA500" title="Edit">
                <FaEdit />
              </ActionBtn>
              <ActionBtn color="#FF4C4C" title="Delete">
                <FaTrash />
              </ActionBtn>
            </div>
          </CarCard>
        ))}
      </CardList>
    </Container>
  );
};

export default CarsManagementPage;
