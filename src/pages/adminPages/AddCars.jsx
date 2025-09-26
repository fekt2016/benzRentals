import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useCreateCar } from "../../hooks/useCar";
import { compressImage } from "../../utils/ImageCompress";

const AddCar = () => {
  const [car, setCar] = useState({
    series: "",
    model: "",
    year: new Date().getFullYear(),
    pricePerDay: "",
    transmission: "automatic",
    fuelType: "petrol",
    seats: 4,
    images: [],
    available: true,
  });
  const { mutate: createCar } = useCreateCar();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setCar((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const handleRemoveImage = (index) => {
    setCar((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!car.series || !car.model || !car.year || !car.pricePerDay) {
      alert("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("series", car.series);
    formData.append("model", car.model);
    formData.append("year", car.year);
    formData.append("pricePerDay", car.pricePerDay);
    formData.append("transmission", car.transmission);
    formData.append("fuelType", car.fuelType);
    formData.append("seats", car.seats);
    formData.append("available", car.available);

    // Process additional images
    if (car.images && car.images.length > 0) {
      const compressionResults = await Promise.allSettled(
        car.images.map(compressImage)
      );

      compressionResults.forEach((result, index) => {
        if (result.status === "fulfilled") {
          formData.append("images", result.value);
        } else {
          console.warn(`Image ${index} compression failed:`, result.reason);
          formData.append("images", car.images[index]);
        }
      });
    }
    // for (let [key, value] of formData.entries()) {
    //   console.log(key, "→", value);
    // }
    // Call your API using react-query
    createCar(formData);
  };

  return (
    <Container>
      <h1>Add New Car</h1>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label>Series*</Label>
          <Select
            value={car.series}
            onChange={(e) => setCar({ ...car, series: e.target.value })}
            required
          >
            <option value="">Select Series</option>
            {[
              "A-Class",
              "B-Class",
              "C-Class",
              "E-Class",
              "S-Class",
              "CLA",
              "CLS",
              "GLA",
              "GLB",
              "GLC",
              "GLE",
              "GLS",
              "G-Class",
              "EQC",
              "AMG GT",
            ].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Model*</Label>
          <Input
            type="text"
            value={car.model}
            onChange={(e) => setCar({ ...car, model: e.target.value })}
            required
          />
        </div>

        <div>
          <Label>Year*</Label>
          <Input
            type="number"
            min="2000"
            max="2030"
            value={car.year}
            onChange={(e) => setCar({ ...car, year: parseInt(e.target.value) })}
            required
          />
        </div>

        <div>
          <Label>Price Per Day ($)*</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={car.pricePerDay}
            onChange={(e) =>
              setCar({ ...car, pricePerDay: parseFloat(e.target.value) })
            }
            required
          />
        </div>

        <div>
          <Label>Transmission</Label>
          <Select
            value={car.transmission}
            onChange={(e) => setCar({ ...car, transmission: e.target.value })}
          >
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
          </Select>
        </div>

        <div>
          <Label>Fuel Type</Label>
          <Select
            value={car.fuelType}
            onChange={(e) => setCar({ ...car, fuelType: e.target.value })}
          >
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Electric</option>
            <option value="hybrid">Hybrid</option>
          </Select>
        </div>

        <div>
          <Label>Seats</Label>
          <Input
            type="number"
            min="2"
            max="9"
            value={car.seats}
            onChange={(e) =>
              setCar({ ...car, seats: parseInt(e.target.value) })
            }
          />
        </div>

        <div>
          <Label>Available</Label>
          <input
            type="checkbox"
            checked={car.available}
            onChange={(e) => setCar({ ...car, available: e.target.checked })}
          />
        </div>

        <div>
          <Label>Images</Label>
          <input
            type="file"
            multiple
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <ImagesPreview>
            {car.images.map((img, idx) => (
              <PreviewImageWrapper key={idx}>
                <PreviewImage
                  src={typeof img === "string" ? img : URL.createObjectURL(img)}
                  alt={`Car ${idx}`}
                />
                <RemoveButton
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                >
                  &times;
                </RemoveButton>
              </PreviewImageWrapper>
            ))}
          </ImagesPreview>
        </div>

        <Button type="submit">Add Car</Button>
      </Form>
    </Container>
  );
};

export default AddCar;

// Styled Components (same as before)
const Container = styled.div`
  max-width: 800px;
  margin: 4rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Label = styled.label`
  font-weight: 600;
`;

const Input = styled.input`
  padding: 0.8rem 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const Select = styled.select`
  padding: 0.8rem 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  background: #d32f2f;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #b71c1c;
  }
`;

const ImagesPreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const PreviewImageWrapper = styled.div`
  position: relative;
`;

const PreviewImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: -6px;
  right: -6px;
  background: #b71c1c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  font-size: 14px;
  line-height: 0;
`;
