// components/Modal/ReviewModal.js
import React, { useState } from "react";
import styled from "styled-components";
import {
  FaStar,
  FaRegStar,
  FaTimes,
  FaRegSmile,
  FaComment,
} from "react-icons/fa";
import { useCreateReview } from "../../hooks/useReview";

const ReviewModal = ({ show, onClose, booking }) => {
  console.log("booking", booking);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: "",
    comment: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate: createReview } = useCreateReview();

  const handleSubmit = async (e) => {
    console.log("reviewForm", reviewForm);
    e.preventDefault();
    if (!reviewForm.comment.trim()) return;

    setIsSubmitting(true);
    try {
      createReview({
        userId: booking.user,
        carId: booking.car._id,
        title: reviewForm.title,
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim(),
      });
      setReviewForm({ rating: 5, title: "", comment: "" });
      onClose();
    } catch (error) {
      console.error("Review submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ rating, onRatingChange }) => {
    return (
      <StarsContainer>
        {[1, 2, 3, 4, 5].map((star) => (
          <StarButton
            key={star}
            onClick={() => onRatingChange(star)}
            type="button"
          >
            {star <= rating ? <FaStar /> : <FaRegStar />}
          </StarButton>
        ))}
      </StarsContainer>
    );
  };

  if (!show) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <FaRegSmile /> Review Your Experience
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <ReviewCarInfo>
            <CarImage
              src={booking.car?.images[0] || "/default-car.jpg"}
              alt={booking.car?.model}
            />
            <div>
              <CarModel>{booking.car?.model}</CarModel>
              <CarDetails>
                <div>Pickup: {formatDate(booking.pickupDate)}</div>
                <div>Return: {formatDate(booking.returnDate)}</div>
                <div>Location: {booking.pickupLocation}</div>
              </CarDetails>
            </div>
          </ReviewCarInfo>

          <ReviewForm onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Overall Rating *</Label>
              <StarRating
                rating={reviewForm.rating}
                onRatingChange={(rating) =>
                  setReviewForm((prev) => ({ ...prev, rating }))
                }
              />
              <RatingText>
                {reviewForm.rating === 5 && "Excellent! 😊"}
                {reviewForm.rating === 4 && "Very Good! 👍"}
                {reviewForm.rating === 3 && "Good! 🙂"}
                {reviewForm.rating === 2 && "Fair 😐"}
                {reviewForm.rating === 1 && "Poor 😞"}
              </RatingText>
            </FormGroup>

            <FormGroup>
              <Label>Review Title</Label>
              <Input
                type="text"
                placeholder="Summarize your experience (optional)"
                value={reviewForm.title}
                onChange={(e) =>
                  setReviewForm((prev) => ({ ...prev, title: e.target.value }))
                }
                maxLength={100}
              />
              <CharCount>{reviewForm.title.length}/100</CharCount>
            </FormGroup>

            <FormGroup>
              <Label>Your Review *</Label>
              <Textarea
                placeholder="Share details about your experience with this vehicle. What did you like? Was there anything that could be improved?"
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }))
                }
                rows={5}
                maxLength={500}
              />
              <CharCount>{reviewForm.comment.length}/500</CharCount>
            </FormGroup>

            <TipsSection>
              <TipsTitle>💡 Writing Tips:</TipsTitle>
              <TipsList>
                <li>Describe the car's condition and performance</li>
                <li>Mention the pickup/drop-off experience</li>
                <li>Share how the car met your expectations</li>
                <li>Be honest and constructive</li>
              </TipsList>
            </TipsSection>
          </ReviewForm>
        </ModalBody>

        <ModalActions>
          <CancelButton type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </CancelButton>
          <SubmitButton
            type="submit"
            onClick={handleSubmit}
            disabled={!reviewForm.comment.trim() || isSubmitting}
            isSubmitting={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner />
                Submitting...
              </>
            ) : (
              <>
                <FaComment /> Submit Review
              </>
            )}
          </SubmitButton>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};

// Helper function to format dates
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default ReviewModal;

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: modalSlideIn 0.3s ease-out;

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  background: white;
  border-radius: 16px 16px 0 0;
  z-index: 10;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #1e293b;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #64748b;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
    color: #374151;
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
`;

const ReviewCarInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
`;

const CarImage = styled.img`
  width: 80px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
`;

const CarModel = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #1e293b;
  font-size: 1.25rem;
`;

const CarDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #64748b;

  div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const ReviewForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
`;

const StarsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 0.5rem 0;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #fbbf24;
  font-size: 2rem;
  transition: all 0.2s;
  padding: 0.25rem;

  &:hover {
    transform: scale(1.2);
  }

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
`;

const RatingText = styled.div`
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
  margin-top: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  resize: vertical;
  transition: border-color 0.2s;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const CharCount = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  text-align: right;
  margin-top: 0.25rem;
`;

const TipsSection = styled.div`
  background: #f0f9ff;
  padding: 1.25rem;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
`;

const TipsTitle = styled.h4`
  margin: 0 0 0.75rem 0;
  color: #1e40af;
  font-size: 0.9rem;
`;

const TipsList = styled.ul`
  margin: 0;
  padding-left: 1.25rem;
  color: #374151;
  font-size: 0.85rem;
  line-height: 1.5;

  li {
    margin-bottom: 0.5rem;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 0 0 16px 16px;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  color: #374151;

  &:hover:not(:disabled) {
    background: #f3f4f6;
    border-color: #9ca3af;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  flex: 2;
  padding: 0.75rem 1.5rem;
  border: none;
  background: ${(props) =>
    props.isSubmitting
      ? "#9ca3af"
      : "linear-gradient(135deg, #10b981, #059669)"};
  color: white;
  border-radius: 8px;
  font-weight: 600;
  cursor: ${(props) => (props.isSubmitting ? "not-allowed" : "pointer")};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
