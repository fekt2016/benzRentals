// src/components/Modal/CarUpdateModal.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useUpdateCar } from "../../hooks/useCar";
import { FaTrash } from "react-icons/fa";

/**
 * CarUpdateModal
 * - shows existing images (editable URLs)
 * - lets you remove existing images
 * - upload multiple new images (previews)
 * - edit status field
 * - submits FormData with:
 *     existingImages: JSON.stringify([...urls])
 *     newImages: files...
 */
const CarUpdateModal = ({ car, isOpen, onClose }) => {
  // pass car id to hook (your hook implementation may vary)
  const { mutate: updateCar } = useUpdateCar(car?._id);

  const [formData, setFormData] = useState({
    model: "",
    series: "",
    year: "",
    pricePerDay: "",
    status: "available",
    images: [], // contains both real URLs and blob preview URLs (for UI)
  });

  // holds actual File objects for new uploads.
  const [newFiles, setNewFiles] = useState([]);

  // initialize when car changes / modal opens
  useEffect(() => {
    if (car) {
      setFormData({
        model: car.model || "",
        series: car.series || "",
        year: car.year || "",
        pricePerDay: car.pricePerDay || "",
        status: car.status || "available",
        images: car.images ? [...car.images] : [],
      });
      setNewFiles([]);
    }
  }, [car]);

  if (!isOpen) return null;

  // simple controlled fields handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // edit an existing image URL in the list
  const handleImageUrlChange = (index, value) => {
    setFormData((prev) => {
      const updated = [...prev.images];
      updated[index] = value;
      return { ...prev, images: updated };
    });
  };

  // remove an image (either existing URL or a blob preview)
  const removeImage = (index) => {
    setFormData((prev) => {
      const prevImages = [...prev.images];
      const removed = prevImages.splice(index, 1)[0];

      // if removed item was a blob preview, also remove corresponding file from newFiles
      if (removed && removed.startsWith && removed.startsWith("blob:")) {
        // compute indices of blob entries in the previous images array
        const blobIndices = prev.images
          .map((img, idx) =>
            img && img.startsWith && img.startsWith("blob:") ? idx : null
          )
          .filter((v) => v !== null);

        // find which position (0-based) among blobs this index corresponds to
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

  // when user picks new files
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // add files to newFiles
    setNewFiles((prev) => [...prev, ...files]);

    // add blob previews to images array for UI
    const blobUrls = files.map((f) => URL.createObjectURL(f));
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...blobUrls] }));

    // reset file input value (optional) so user can re-select the same file if needed
    e.target.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare FormData: send existing (real) URLs as JSON and new files as files
    const fd = new FormData();
    fd.append("model", formData.model);
    fd.append("series", formData.series);
    fd.append("year", formData.year);
    fd.append("pricePerDay", formData.pricePerDay);
    fd.append("status", formData.status);

    // collect only real URLs (not blob:) from images preview
    const existingUrls = formData.images.filter(
      (img) => !(img && img.startsWith && img.startsWith("blob:"))
    );

    // Send existing URLs as a JSON string. Backend should parse req.body.existingImages
    fd.append("existingImages", JSON.stringify(existingUrls));

    // Append new files as 'newImages' (one entry per file)
    newFiles.forEach((file) => {
      fd.append("newImages", file);
    });

    // call mutate. Your hook must handle sending multipart/form-data
    updateCar(fd, {
      onSuccess: () => {
        onClose();
      },
      onError: (err) => {
        // optionally handle error (toast, set error state, etc.)
        console.error("Update failed:", err);
      },
    });
  };

  return (
    <Overlay>
      <Modal role="dialog" aria-modal="true" aria-labelledby="edit-car-title">
        <Header>
          <h2 id="edit-car-title">Edit Car</h2>
          <CloseBtn onClick={onClose} aria-label="Close">
            &times;
          </CloseBtn>
        </Header>

        <Form onSubmit={handleSubmit}>
          <label>
            Model:
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
            />
          </label>

          <label>
            Series:
            <input
              type="text"
              name="series"
              value={formData.series}
              onChange={handleChange}
            />
          </label>

          <label>
            Year:
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
            />
          </label>

          <label>
            Price/Day:
            <input
              type="number"
              name="pricePerDay"
              value={formData.pricePerDay}
              onChange={handleChange}
            />
          </label>

          <label>
            Status:
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </label>

          <ImagesWrapper>
            <p style={{ margin: 0, fontWeight: 600 }}>Images</p>
            <SmallNote>
              Edit URLs or remove images. Uploads will be appended.
            </SmallNote>

            {formData.images.length === 0 && <EmptySmall>No images</EmptySmall>}

            {formData.images.map((img, idx) => (
              <ImageRow key={idx}>
                {/* editable URL for existing images only (not for blob previews) */}
                <UrlInput
                  value={img}
                  onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                  placeholder="Image URL or leave preview"
                />
                <Thumb>
                  <img src={img} alt={`car-${idx}`} />
                </Thumb>
                <DeleteBtn
                  type="button"
                  onClick={() => removeImage(idx)}
                  aria-label={`Remove image ${idx + 1}`}
                >
                  <FaTrash />
                </DeleteBtn>
              </ImageRow>
            ))}
          </ImagesWrapper>

          <label>
            Upload New Images:
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
          </label>

          <Actions>
            <SubmitBtn type="submit">Update Car</SubmitBtn>
            <CancelBtn type="button" onClick={onClose}>
              Cancel
            </CancelBtn>
          </Actions>
        </Form>
      </Modal>
    </Overlay>
  );
};

export default CarUpdateModal;

/* ------------------- styled-components ------------------- */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const Modal = styled.div`
  width: 700px;
  max-width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  font-size: 1.6rem;
  cursor: pointer;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;

  label {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    font-size: 0.95rem;
  }

  input[type="text"],
  input[type="number"],
  select {
    padding: 0.55rem;
    border: 1px solid ${({ theme }) => theme.colors.gray};
    border-radius: var(--radius-md);
    font-size: 0.95rem;
  }

  input[type="file"] {
    margin-top: 0.35rem;
  }
`;

const ImagesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.25rem;
`;

const SmallNote = styled.small`
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
`;

const EmptySmall = styled.div`
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.9rem;
  padding: 0.25rem 0;
`;

const ImageRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const UrlInput = styled.input`
  flex: 1;
  padding: 0.45rem;
  border-radius: var(--radius-sm);
  border: 1px solid ${({ theme }) => theme.colors.gray};
  font-size: 0.9rem;
`;

const Thumb = styled.div`
  width: 90px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  background: #f6f6f6;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const DeleteBtn = styled.button`
  background: #ff4c4c;
  color: white;
  border: none;
  padding: 0.4rem;
  border-radius: 6px;
  cursor: pointer;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.6rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
`;

const SubmitBtn = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 0.65rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
`;

const CancelBtn = styled.button`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.gray};
  color: ${({ theme }) => theme.colors.text};
  padding: 0.55rem 0.9rem;
  border-radius: 8px;
  cursor: pointer;
`;
