import React, { useMemo } from "react";
import styled from "styled-components";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useGetCars, useDeleteCar } from "../../hooks/useCar";
import CarUpdateModal from "../../components/Modal/CarUpdateModal";

const CarsManagementPage = () => {
  const { data: carsData, isLoading } = useGetCars();
  const { mutateAsync: deleteCar } = useDeleteCar();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedCar, setSelectedCar] = React.useState(null);

  const cars = useMemo(() => {
    return carsData?.data?.data || [];
  }, [carsData]);

  if (isLoading) {
    return <Container>Loading...</Container>;
  }

  const handleDelete = (id) => {
    console.log("Deleting car with ID:", id);
    deleteCar(id);
  };

  return (
    <Container>
      <Title>Manage Cars</Title>

      {/* Desktop Table */}
      <Table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Model</th>
            <th>Series</th>
            <th>Year</th>
            <th>Price/Day</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car._id}>
              <td>
                <img src={car.images[0]} alt={car.model} />
              </td>
              <td>{car.model}</td>
              <td>{car.series}</td>
              <td>{car.year}</td>
              <td>${car.pricePerDay}</td>
              <td>
                <StatusBadge status={car.status}>{car.status}</StatusBadge>
              </td>
              <td>
                <ActionBtn
                  color="#FFA500"
                  title="Edit"
                  onClick={() => {
                    setSelectedCar(car);
                    setIsModalOpen(true);
                  }}
                >
                  <FaEdit />
                </ActionBtn>
                <ActionBtn
                  color="#FF4C4C"
                  title="Delete"
                  onClick={() => handleDelete(car._id)}
                >
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
          <CarCard key={car._id}>
            <img src={car.images[0]} alt={car.model} />
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
              <span>Status:</span>
              <StatusBadge status={car.status}>{car.status}</StatusBadge>
            </div>
            <div>
              <ActionBtn
                color="#FFA500"
                title="Edit"
                onClick={() => {
                  setSelectedCar(car);
                  setIsModalOpen(true);
                }}
              >
                <FaEdit />
              </ActionBtn>
              <ActionBtn
                color="#FF4C4C"
                title="Delete"
                onClick={() => handleDelete(car._id)}
              >
                <FaTrash />
              </ActionBtn>
            </div>
          </CarCard>
        ))}
      </CardList>

      {/* Update Modal */}
      <CarUpdateModal
        car={selectedCar}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Container>
  );
};

export default CarsManagementPage;

/* ---------------- STYLES ---------------- */
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
  min-width: 900px;

  th,
  td {
    padding: 1rem;
    text-align: left;
    vertical-align: middle;
  }

  th {
    border-bottom: 2px solid ${({ theme }) => theme.colors.gray};
  }

  td {
    background: ${({ theme }) => theme.colors.white};
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray};
    border-radius: var(--radius-sm);
  }

  img {
    width: 80px;
    height: 50px;
    object-fit: cover;
    border-radius: var(--radius-md);
  }

  @media (max-width: 767px) {
    display: none;
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
    align-items: center;
  }

  img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: var(--radius-md);
    margin-bottom: 0.5rem;
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

const StatusBadge = styled.span`
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
  background-color: ${({ status }) =>
    status === "available"
      ? "green"
      : status === "rented"
      ? "orange"
      : status === "maintenance"
      ? "red"
      : "gray"};
  text-transform: capitalize;
`;
