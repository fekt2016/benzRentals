// src/pages/admin/AddEditCarPage.jsx
import React, { useState } from "react";
import styled from "styled-components";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: ${({ theme }) => theme.colors.white};
  padding: 2rem;
  border-radius: var(--radius-lg);
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const Input = styled.input`
  padding: 0.8rem 1rem;
  border-radius: var(--radius-sm);
  border: 1px solid ${({ theme }) => theme.colors.gray};
`;

const Button = styled.button`
  padding: 0.8rem 1rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: var(--radius-md);
  cursor: pointer;
`;

const AddEditCarPage = () => {
  const [car, setCar] = useState({
    model: "",
    series: "",
    year: "",
    pricePerDay: "",
  });

  return (
    <div>
      <h1>Add / Edit Car</h1>
      <Form>
        <Input
          placeholder="Model"
          value={car.model}
          onChange={(e) => setCar({ ...car, model: e.target.value })}
        />
        <Input
          placeholder="Series"
          value={car.series}
          onChange={(e) => setCar({ ...car, series: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Year"
          value={car.year}
          onChange={(e) => setCar({ ...car, year: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Price Per Day"
          value={car.pricePerDay}
          onChange={(e) => setCar({ ...car, pricePerDay: e.target.value })}
        />
        <Button>Save</Button>
      </Form>
    </div>
  );
};

export default AddEditCarPage;
