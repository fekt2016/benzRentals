/* eslint-disable react/prop-types */
// src/components/Modal/CarUpdateModal.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaTrash } from "react-icons/fa";
import { useUpdateCar } from "../../hooks/useCar";

// Your project UI components
import { PrimaryButton, SecondaryButton } from "../ui/Button";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { FormField, Input, Select, FileInput } from "../forms/Form";

const statusOptions = [
  { value: "available", label: "Available" },
  { value: "rented", label: "Rented" },
  { value: "maintenance", label: "Maintenance" },
];

const CarUpdateModal = ({ car, isOpen, onClose }) => {
  const { mutate: updateCar, isPending, error } = useUpdateCar(car?._id);

  const [formData, setFormData] = useState({
    model: "",
    series: "",
    year: "",
    pricePerDay: "",
    status: "available",
    licensePlate: "",
    currentOdometer: "",
    images: [], // mix of existing URLs + blob previews
  });

  // Only the new File objects to upload
  const [newFiles, setNewFiles] = useState([]);

  useEffect(() => {
    if (car) {
      setFormData({
        model: car.model || "",
        series: car.series || "",
        year: car.year ?? "",
        pricePerDay: car.pricePerDay ?? "",
        status: car.status || "available",
        licensePlate: car.licensePlate || "",
        currentOdometer:
          typeof car.currentOdometer === "number"
            ? String(car.currentOdometer)
            : car.currentOdometer || "",
        images: Array.isArray(car.images) ? [...car.images] : [],
      });
      setNewFiles([]);
    }
  }, [car]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "licensePlate") {
      setFormData((p) => ({ ...p, licensePlate: value.toUpperCase() }));
      return;
    }

    if (name === "year" || name === "pricePerDay" || name === "currentOdometer") {
      setFormData((p) => ({ ...p, [name]: value }));
      return;
    }

    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleStatusChange = (e) => {
    setFormData((p) => ({ ...p, status: e.target.value }));
  };

  const handleImageUrlChange = (index, value) => {
    setFormData((prev) => {
      const updated = [...prev.images];
      updated[index] = value;
      return { ...prev, images: updated };
    });
  };

  const removeImage = (index) => {
    setFormData((prev) => {
      const prevImages = [...prev.images];
      const removed = prevImages.splice(index, 1)[0];

      // If removed image was a blob preview, remove corresponding file as well
      if (removed && typeof removed === "string" && removed.startsWith("blob:")) {
        const blobIndices = prev.images
          .map((img, idx) => (typeof img === "string" && img.startsWith("blob:") ? idx : null))
          .filter((v) => v !== null);

        const pos = blobIndices.indexOf(index);
        if (pos !== -1) {
          setNewFiles((prevFiles) => {
            const updatedFiles = [...prevFiles];
            updatedFiles.splice(pos, 1);
            return updatedFiles;
          });
        }
      }

      return { ...prev, images: prevImages };
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setNewFiles((prev) => [...prev, ...files]);
    const previews = files.map((f) => URL.createObjectURL(f));
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...previews] }));
    e.target.value = "";
  };

  // In CarUpdateModal.jsx
const handleSubmit = (e) => {
  e.preventDefault();

  const fd = new FormData();

  // Helper: append only when provided (and non-empty string)
  const appendIfFilled = (key, val) => {
    if (val === undefined || val === null) return;
    if (typeof val === "string" && val.trim() === "") return;
    fd.append(key, val);
  };

  // Optional scalar fields (append only if user typed something)
  appendIfFilled("model", formData.model);
  appendIfFilled("series", formData.series);
  appendIfFilled("year", formData.year);
  appendIfFilled("pricePerDay", formData.pricePerDay);
  appendIfFilled("status", formData.status);
  appendIfFilled("licensePlate", formData.licensePlate);       // optional
  appendIfFilled("currentOdometer", formData.currentOdometer); // optional
  appendIfFilled("description", formData.description);
  appendIfFilled("transmission", formData.transmission);
  appendIfFilled("fuelType", formData.fuelType);
  appendIfFilled("seats", formData.seats);

  // IMAGES: only include if changed or new files selected
  const initialUrls = Array.isArray(car?.images) ? car.images : [];
  const currentUrls = (formData.images || []).filter(
    (img) => !(img?.startsWith && img.startsWith("blob:"))
  );
  const imagesChanged =
    newFiles.length > 0 ||
    JSON.stringify(initialUrls) !== JSON.stringify(currentUrls);

  if (imagesChanged) {
    fd.append("existingImages", JSON.stringify(currentUrls));
    newFiles.forEach((f) => fd.append("carImages", f));
  }

  updateCar(fd, {
    onSuccess: () => onClose(),
    onError: (err) => console.error("Update failed:", err),
  });
};


  return (
    <Overlay>
      <Modal role="dialog" aria-modal="true" aria-labelledby="edit-car-title">
        <HeaderRow>
          <Title id="edit-car-title">Edit Car</Title>
          <CloseBtn onClick={onClose} aria-label="Close">
            &times;
          </CloseBtn>
        </HeaderRow>

        {error && (
          <ErrorBanner>
            {error?.message || "Update failed. Please try again."}
          </ErrorBanner>
        )}

        <Form onSubmit={handleSubmit}>
          <Grid>
            <FormField label="Model" required>
              <Input
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g., C300, E350, S580"
                // required
              />
            </FormField>

            <FormField label="Series" required>
              <Input
                name="series"
                value={formData.series}
                onChange={handleChange}
                placeholder="e.g., C-Class, E-Class"
                // required
              />
            </FormField>

            <FormField label="Year" required>
              <Input
                type="number"
                name="year"
                min="2000"
                max={new Date().getFullYear() + 1}
                value={formData.year}
                onChange={handleChange}
                // required
              />
            </FormField>

            <FormField label="Price Per Day ($)" required>
              <Input
                type="number"
                name="pricePerDay"
                min="0"
                step="0.01"
                value={formData.pricePerDay}
                onChange={handleChange}
                // required
              />
            </FormField>

            <FormField label="License Plate" required>
              <Input
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleChange}
                placeholder="e.g., BENZ-1234"
                // required
              />
            </FormField>

            <FormField label="Current Odometer (km)" required>
              <Input
                type="number"
                name="currentOdometer"
                min="0"
                value={formData.currentOdometer}
                onChange={handleChange}
                placeholder="e.g., 25400"
                // required
              />
            </FormField>

            <FormField label="Status" required>
              <Select
                value={formData.status}
                onChange={handleStatusChange}
                options={statusOptions}
              />
            </FormField>
          </Grid>

          <ImagesBlock>
            <ImagesHeader>Images</ImagesHeader>
            <SmallNote>
              Edit URLs (for existing images) or remove any. New uploads will be appended.
            </SmallNote>

            {formData.images.length === 0 && <EmptyText>No images</EmptyText>}

            {formData.images.map((img, idx) => {
              const isBlob = typeof img === "string" && img.startsWith("blob:");
              return (
                <ImageRow key={idx}>
                  <FormField label={`Image ${idx + 1} URL`}>
                    <Input
                      value={img}
                      onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                      disabled={isBlob} // can't edit blob URLs
                    />
                  </FormField>

                  <Thumb>
                 
                    <img src={img} alt={`car image ${idx + 1}`} />
                  </Thumb>

                  <IconBtn
                    type="button"
                    title="Remove"
                    onClick={() => removeImage(idx)}
                  >
                    <FaTrash />
                  </IconBtn>
                </ImageRow>
              );
            })}
          </ImagesBlock>

          <FormField label="Upload New Images">
            <FileInput accept="image/*" multiple onChange={handleFileChange} />
          </FormField>

          <Actions>
            <SecondaryButton type="button" onClick={onClose} $size="lg">
              Cancel
            </SecondaryButton>

            <PrimaryButton type="submit" $size="lg" disabled={isPending}>
              {isPending ? (
                <>
                  <LoadingSpinner size="sm" />
                  Updating...
                </>
              ) : (
                "Update Car"
              )}
            </PrimaryButton>
          </Actions>
        </Form>
      </Modal>
    </Overlay>
  );
};

export default CarUpdateModal;

/* ---------------- styles ---------------- */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const Modal = styled.div`
  width: 820px;
  max-width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  background: var(--white);
  border-radius: var(--radius-2xl);
  padding: var(--space-xl);
  box-shadow: var(--shadow-2xl);
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
`;

const Title = styled.h2`
  margin: 0;
  font-weight: var(--font-bold);
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  font-size: 1.75rem;
  line-height: 1;
  cursor: pointer;
`;

const ErrorBanner = styled.div`
  margin-bottom: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  background: #fde2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImagesBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const ImagesHeader = styled.h4`
  margin: 0;
`;

const SmallNote = styled.small`
  color: var(--text-muted);
`;

const EmptyText = styled.div`
  color: var(--text-muted);
  font-size: var(--text-sm);
  padding: var(--space-xs) 0;
`;

const ImageRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: var(--space-sm);
  align-items: end;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    align-items: stretch;
  }
`;

const Thumb = styled.div`
  width: 110px;
  height: 72px;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: #f6f6f6;
  display: flex;
  align-items: center;
  justify-content: center;

  img { width: 100%; height: 100%; object-fit: cover; }
`;

const IconBtn = styled.button`
  background: var(--error);
  color: var(--white);
  border: none;
  padding: 0.6rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover { opacity: 0.9; }
`;

const Actions = styled.div`
  display: flex;
  gap: var(--space-md);
  justify-content: flex-end;
`;
