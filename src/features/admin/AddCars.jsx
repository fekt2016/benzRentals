import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useCreateCar } from "../../hooks/useCar";
import { compressImage } from "../../utils/ImageCompress";
import { useNavigate } from "react-router-dom";

// UI
import { LuxuryCard } from "../../components/Cards/Card";
import { PrimaryButton, SecondaryButton, GhostButton } from "../../components/ui/Button";
import { LoadingSpinner, ErrorState } from "../../components/ui/LoadingSpinner";
import {
  Input,
  Select,
  FormField,
  FileInput,
  Checkbox,
  TextArea,
} from "../../components/forms/Form";

const AddCar = () => {
  const [car, setCar] = useState({
    series: "",
    model: "",
    year: new Date().getFullYear(),
    pricePerDay: "",
    transmission: "automatic",
    fuelType: "petrol",
    seats: 4,
    description: "",
    features: [],
    carImages: [],          // keep using `carImages` as requested
    available: true,
    licensePlate: "",       // ✅ added
    currentOdometer: 0,     // ✅ added
  });
const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { mutate: createCar, isPending: isLoading } = useCreateCar();
  const fileInputRef = useRef(null);

  const availableFeatures = [
    "GPS Navigation",
    "Bluetooth",
    "Backup Camera",
    "Leather Seats",
    "Sunroof",
    "Heated Seats",
    "Apple CarPlay",
    "Android Auto",
    "Premium Sound System",
    "Keyless Entry",
    "Remote Start",
    "Parking Sensors",
    "Lane Assist",
    "Adaptive Cruise Control",
    "Wireless Charging",
  ];

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (car.carImages.length + files.length > 10) {
      setError("Maximum 10 images allowed");
      return;
    }
    setError("");
    setCar((prev) => ({
      ...prev,
      carImages: [...prev.carImages, ...files],
    }));
  };

  const handleRemoveImage = (index) => {
    setCar((prev) => ({
      ...prev,
      // ✅ fix: remove from carImages, not images
      carImages: prev.carImages.filter((_, i) => i !== index),
    }));
  };

  const handleFeatureToggle = (feature) => {
    setCar((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Basic validation
    if (!car.series || !car.model || !car.year || !car.pricePerDay) {
      setError("Please fill all required fields");
      setIsSubmitting(false);
      return;
    }

    if (!car.licensePlate) {
      setError("Please provide a license plate");
      setIsSubmitting(false);
      return;
    }

    if (car.carImages.length === 0) {
      setError("Please add at least one image");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("series", car.series);
    formData.append("model", car.model);
    formData.append("year", String(car.year));
    formData.append("pricePerDay", String(car.pricePerDay));
    formData.append("transmission", car.transmission);
    formData.append("fuelType", car.fuelType);
    formData.append("seats", String(car.seats));
    formData.append("available", String(car.available));
    formData.append("description", car.description);
    formData.append("features", JSON.stringify(car.features));
    formData.append("licensePlate", car.licensePlate.trim().toUpperCase()); // ✅ send plate
    formData.append("currentOdometer", String(Number(car.currentOdometer || 0))); // ✅ send odometer

    try {
      // ✅ compress & append `carImages`
      if (car.carImages && car.carImages.length > 0) {
        const compressionResults = await Promise.allSettled(
          car.carImages.map((file) => compressImage(file))
        );

        compressionResults.forEach((result, index) => {
          if (result.status === "fulfilled") {
            formData.append("carImages", result.value);
          } else {
            console.warn(`Image ${index} compression failed:`, result.reason);
            formData.append("carImages", car.carImages[index]);
          }
        });
      }

      // Debug print (optional)
      // for (let [k, v] of formData) console.log(k, v);

      createCar(formData, {
        onSuccess: () => {
          // Reset form
          setCar({
            series: "",
            model: "",
            year: new Date().getFullYear(),
            pricePerDay: "",
            transmission: "automatic",
            fuelType: "petrol",
            seats: 4,
            description: "",
            features: [],
            carImages: [],
            available: true,
            licensePlate: "",
            currentOdometer: 0,
          });
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }

navigate('/admin/cars')
        },
        onError: (err) => {
          setError(err?.message || "Failed to add car");
        },
      });
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const seriesOptions = [
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
  ];

  const transmissionOptions = [
    { value: "automatic", label: "Automatic" },
    { value: "manual", label: "Manual" },
  ];

  const fuelTypeOptions = [
    { value: "petrol", label: "Petrol" },
    { value: "diesel", label: "Diesel" },
    { value: "electric", label: "Electric" },
    { value: "hybrid", label: "Hybrid" },
  ];

  if (isLoading) {
    return (
      <Container>
        <LoadingSpinner size="xl" />
      </Container>
    );
  }

  return (
    <Container>
      <FormHeader>
        <FormTitle>Add New Car</FormTitle>
        <FormSubtitle>Add a new luxury vehicle to your rental fleet</FormSubtitle>
      </FormHeader>

      {error && (
        <ErrorState
          title="Error"
          message={error}
          action={<GhostButton onClick={() => setError("")}>Dismiss</GhostButton>}
        />
      )}

      <FormCard>
        <Form onSubmit={handleSubmit}>
          <FormGrid>
            {/* Basic Information */}
            <FormSection>
              <SectionTitle>Basic Information</SectionTitle>

              <FormField label="Series" required>
                <Select
                  value={car.series}
                  onChange={(e) => setCar({ ...car, series: e.target.value })}
                  options={seriesOptions.map((s) => ({ value: s, label: s }))}
                  placeholder="Select Series"
                  required
                />
              </FormField>

              <FormField label="Model" required>
                <Input
                  type="text"
                  value={car.model}
                  onChange={(e) => setCar({ ...car, model: e.target.value })}
                  placeholder="e.g., C300, E350, S580"
                  required
                />
              </FormField>

              <FormField label="Year" required>
                <Input
                  type="number"
                  min="2000"
                  max={new Date().getFullYear() + 1}
                  value={car.year}
                  onChange={(e) =>
                    setCar({ ...car, year: parseInt(e.target.value || "0", 10) })
                  }
                  required
                />
              </FormField>

              <FormField label="Price Per Day ($)" required>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={car.pricePerDay}
                  onChange={(e) =>
                    setCar({ ...car, pricePerDay: parseFloat(e.target.value || "0") })
                  }
                  placeholder="0.00"
                  required
                />
              </FormField>

              {/* ✅ License Plate */}
              <FormField label="License Plate" required>
                <Input
                  type="text"
                  value={car.licensePlate}
                  onChange={(e) =>
                    setCar({ ...car, licensePlate: e.target.value.toUpperCase() })
                  }
                  placeholder="e.g., BENZ-1234"
                  required
                />
              </FormField>
            </FormSection>

            {/* Specifications */}
            <FormSection>
              <SectionTitle>Specifications</SectionTitle>

              <FormField label="Transmission">
                <Select
                  value={car.transmission}
                  onChange={(e) => setCar({ ...car, transmission: e.target.value })}
                  options={transmissionOptions}
                />
              </FormField>

              <FormField label="Fuel Type">
                <Select
                  value={car.fuelType}
                  onChange={(e) => setCar({ ...car, fuelType: e.target.value })}
                  options={fuelTypeOptions}
                />
              </FormField>

              <FormField label="Seats">
                <Input
                  type="number"
                  min="2"
                  max="9"
                  value={car.seats}
                  onChange={(e) =>
                    setCar({ ...car, seats: parseInt(e.target.value || "0", 10) })
                  }
                />
              </FormField>

              {/* ✅ Current Odometer */}
              <FormField label="Current Odometer (km)">
                <Input
                  type="number"
                  min="0"
                  value={car.currentOdometer}
                  onChange={(e) =>
                    setCar({
                      ...car,
                      currentOdometer: parseInt(e.target.value || "0", 10),
                    })
                  }
                  placeholder="e.g., 25400"
                />
              </FormField>

              <FormField label="Description">
                <TextArea
                  value={car.description}
                  onChange={(e) => setCar({ ...car, description: e.target.value })}
                  placeholder="Describe the car's features, condition, and any special notes..."
                  rows={4}
                />
              </FormField>
            </FormSection>

            {/* Features */}
            <FormSection>
              <SectionTitle>Features & Amenities</SectionTitle>
              <FeaturesGrid>
                {availableFeatures.map((feature) => (
                  <Checkbox
                    key={feature}
                    checked={car.features.includes(feature)}
                    onChange={() => handleFeatureToggle(feature)}
                    label={feature}
                  />
                ))}
              </FeaturesGrid>
            </FormSection>

            {/* Images */}
            <FormSection>
              <SectionTitle>Images</SectionTitle>
              <FormField label="Upload Car Images (Max 10)" required>
                <FileUploadSection>
                  <FileInput
                    type="file"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ width: "100%" }}
                  />
                  <FileHint>
                    Supported formats: JPG, PNG, WEBP. Max file size: 5MB each.
                  </FileHint>
                </FileUploadSection>

                {car.carImages.length > 0 && (
                  <ImagesPreview>
                    {car.carImages.map((img, idx) => {
                      const src = typeof img === "string" ? img : URL.createObjectURL(img);
                      return (
                        <PreviewImageWrapper key={`${idx}-${src}`}>
                          <PreviewImage src={src} alt={`Car ${idx + 1}`} />
                          <RemoveButton type="button" onClick={() => handleRemoveImage(idx)}>
                            &times;
                          </RemoveButton>
                        </PreviewImageWrapper>
                      );
                    })}
                  </ImagesPreview>
                )}
              </FormField>
            </FormSection>

            {/* Availability */}
            <FormSection>
              <SectionTitle>Availability</SectionTitle>
              <Checkbox
                checked={car.available}
                onChange={(e) => setCar({ ...car, available: e.target.checked })}
                label="Available for rental"
              />
            </FormSection>
          </FormGrid>

          <FormActions>
            <SecondaryButton type="button" $size="lg">
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" $size="lg" disabled={isSubmitting || isLoading}>
              {(isSubmitting || isLoading) ? (
                <>
                  <LoadingSpinner size="sm" />
                  Adding Car...
                </>
              ) : (
                "Add Car to Fleet"
              )}
            </PrimaryButton>
          </FormActions>
        </Form>
      </FormCard>
    </Container>
  );
};

export default AddCar;

/* ---------------- STYLES ---------------- */
const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 var(--space-lg);
  @media (max-width: 768px) {
    padding: 0 var(--space-md);
    margin: 1rem auto;
  }
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: var(--space-2xl);
`;

const FormTitle = styled.h1`
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
  font-family: var(--font-heading);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  @media (max-width: 768px) {
    font-size: var(--text-3xl);
  }
`;

const FormSubtitle = styled.p`
  font-size: var(--text-lg);
  color: var(--text-muted);
  font-family: var(--font-body);
`;

const FormCard = styled(LuxuryCard)`
  padding: var(--space-2xl);
  background: var(--white);
  @media (max-width: 768px) {
    padding: var(--space-lg);
  }
  @media (max-width: 480px) {
    padding: var(--space-md);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-2xl);
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2xl);
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
`;

const SectionTitle = styled.h3`
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  font-family: var(--font-heading);
  padding-bottom: var(--space-sm);
  border-bottom: 2px solid var(--gray-200);
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-md);
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FileUploadSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const FileHint = styled.span`
  font-size: var(--text-sm);
  color: var(--text-muted);
  font-family: var(--font-body);
`;

const ImagesPreview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--space-md);
  margin-top: var(--space-lg);
`;

const PreviewImageWrapper = styled.div`
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: var(--radius-lg);
`;

const RemoveButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--error);
  color: var(--white);
  border: none;
  border-radius: var(--radius-full);
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-md);
  &:hover {
    background: #dc2626;
    transform: scale(1.1);
  }
  &:active {
    transform: scale(0.95);
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: var(--space-md);
  justify-content: flex-end;
  padding-top: var(--space-xl);
  border-top: 1px solid var(--gray-200);
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;
