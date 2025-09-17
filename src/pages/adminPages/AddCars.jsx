// src/pages/admin/AddEditCarPage.jsx
import React, { useState, useRef } from "react";
import styled from "styled-components";
import { devices } from "../../styles/GlobalStyles"; // your breakpoints

const Container = styled.div`
  padding: 2rem;
  @media ${devices.sm} {
    padding: 1rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: ${({ theme }) => theme.colors.white};
  padding: 2rem;
  border-radius: var(--radius-lg);
  box-shadow: ${({ theme }) => theme.shadows.md};

  @media ${devices.sm} {
    padding: 1rem;
  }
`;

const Input = styled.input`
  padding: 0.8rem 1rem;
  border-radius: var(--radius-sm);
  border: 1px solid ${({ theme }) => theme.colors.gray};
  font-size: 1.4rem;

  @media ${devices.sm} {
    font-size: 1.2rem;
  }
`;

const Button = styled.button`
  padding: 0.8rem 1rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: var(--radius-md);
  cursor: pointer;
  border: none;
  font-size: 1.4rem;

  @media ${devices.sm} {
    font-size: 1.2rem;
  }
`;

const DragDropArea = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.gray};
  padding: 2rem;
  border-radius: var(--radius-md);
  text-align: center;
  cursor: pointer;
  background-color: ${({ isDragging, theme }) =>
    isDragging ? theme.colors.primaryLight : "transparent"};
  transition: background-color 0.3s;
  font-size: 1.4rem;

  @media ${devices.sm} {
    padding: 1rem;
    font-size: 1.2rem;
  }
`;

const ImagesPreview = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  div {
    position: relative;
  }

  img {
    width: 120px;
    height: 80px;
    object-fit: cover;
    border-radius: var(--radius-sm);
    border: 1px solid ${({ theme }) => theme.colors.gray};

    @media ${devices.sm} {
      width: 90px;
      height: 60px;
    }
  }

  button {
    position: absolute;
    top: -5px;
    right: -5px;
    background: red;
    color: white;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    cursor: pointer;

    @media ${devices.sm} {
      width: 16px;
      height: 16px;
      font-size: 0.8rem;
    }
  }
`;

const AddEditCarPage = () => {
  const [car, setCar] = useState({
    model: "",
    series: "",
    year: "",
    pricePerDay: "",
    images: [],
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    setCar((prev) => ({ ...prev, images: [...prev.images, ...fileArray] }));

    const previews = fileArray.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...previews]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleRemoveImage = (index) => {
    setCar((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(car); // TODO: send to backend
  };

  return (
    <Container>
      <h1>Add / Edit Car</h1>
      <Form onSubmit={handleSubmit}>
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

        <DragDropArea
          isDragging={isDragging}
          onClick={() => fileInputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          Drag & Drop Images Here or Click to Select
        </DragDropArea>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files)}
        />

        {previewImages.length > 0 && (
          <ImagesPreview>
            {previewImages.map((src, idx) => (
              <div key={idx}>
                <img src={src} alt={`Car ${idx + 1}`} />
                <button type="button" onClick={() => handleRemoveImage(idx)}>
                  &times;
                </button>
              </div>
            ))}
          </ImagesPreview>
        )}

        <Button type="submit">Save</Button>
      </Form>
    </Container>
  );
};

export default AddEditCarPage;
