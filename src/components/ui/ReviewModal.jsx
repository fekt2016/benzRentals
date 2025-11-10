/* eslint-disable react/prop-types */
// components/Modal/ReviewModal.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaStar, FaRegStar, FaTimes, FaRegSmile, FaExclamationTriangle } from "react-icons/fa";
import { useCreateReview } from "../../features/cars/useReview";
import { LoadingSpinner } from "../ui/LoadingSpinner";

const ReviewModal = ({ show, onClose, booking }) => {
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });

  const { mutate: createReview, isPending:isLoading, error } = useCreateReview();

  // Clear form and errors when modal opens/closes
  useEffect(() => {
    if (!show) {
      setReviewForm({ rating: 5, comment: "" });
    }
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.rating) return;

    console.log("Submitting review:", reviewForm);
    
    createReview({
      bookingId: booking._id,
      rating: reviewForm.rating,
      comment: reviewForm.comment.trim() || null,
    }, {
      onSuccess: () => {
        setReviewForm({ rating: 5, comment: "" });
        onClose();
      }
    });
  };

  const StarRating = ({ rating, onRatingChange }) => {
    return (
      <StarsContainer>
        {[1, 2, 3, 4, 5].map((star) => (
          <StarButton
            key={star}
            onClick={() => onRatingChange(star)}
            type="button"
            $active={star <= rating}
            $disabled={isLoading}
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
            <FaRegSmile /> Rate Your Experience
          </ModalTitle>
          <CloseButton onClick={onClose} disabled={isLoading}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {/* Error Display */}
          {error && (
            <ErrorState>
              <ErrorIcon>
                <FaExclamationTriangle />
              </ErrorIcon>
              <ErrorText>
                {error?.response?.data?.message  || "Failed to submit review. Please try again."}
              </ErrorText>
            </ErrorState>
          )}

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
            {/* Rating Section - REQUIRED */}
            <FormGroup>
              <Label>Overall Rating *</Label>
              <RequiredIndicator>(Required)</RequiredIndicator>
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

            {/* Comment - OPTIONAL */}
            <FormGroup>
              <Label>Your Review</Label>
              <OptionalIndicator>(Optional)</OptionalIndicator>
              <Textarea
                placeholder="Share more details about your experience (optional)"
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }))
                }
                rows={4}
                maxLength={500}
                disabled={isLoading}
              />
              <CharCount>{reviewForm.comment.length}/500</CharCount>
            </FormGroup>

            <TipsSection>
              <TipsTitle>💡 Quick Tips:</TipsTitle>
              <TipsList>
                <li>
                  <strong>Rating is required</strong> - just tap the stars
                </li>
                <li>Comments are completely optional</li>
                <li>Your rating helps other renters make better choices</li>
                <li>You can always add details later if you want</li>
              </TipsList>
            </TipsSection>

            {/* Quick Rating Options */}
            <QuickRatingSection>
              <QuickRatingTitle>Quick Rate:</QuickRatingTitle>
              <QuickRatingButtons>
                <QuickRatingButton
                  onClick={() =>
                    setReviewForm((prev) => ({ ...prev, rating: 5 }))
                  }
                  $active={reviewForm.rating === 5}
                  disabled={isLoading}
                >
                  Excellent
                </QuickRatingButton>
                <QuickRatingButton
                  onClick={() =>
                    setReviewForm((prev) => ({ ...prev, rating: 4 }))
                  }
                  $active={reviewForm.rating === 4}
                  disabled={isLoading}
                >
                  Very Good
                </QuickRatingButton>
                <QuickRatingButton
                  onClick={() =>
                    setReviewForm((prev) => ({ ...prev, rating: 3 }))
                  }
                  $active={reviewForm.rating === 3}
                  disabled={isLoading}
                >
                  Good
                </QuickRatingButton>
              </QuickRatingButtons>
            </QuickRatingSection>
          </ReviewForm>
        </ModalBody>

        <ModalActions>
          <CancelButton type="button" onClick={onClose} disabled={isLoading}>
            Cancel
          </CancelButton>
          <SubmitButton
            type="submit"
            onClick={handleSubmit}
            disabled={!reviewForm.rating || isLoading}
          >
            {isLoading ? (
              <>
                <LoadingSpinner $size="sm" />
                Submitting Review...
              </>
            ) : (
              <>
                <FaStar /> Submit {reviewForm.rating}-Star Rating
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
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  color: ${props => props.disabled ? '#9ca3af' : '#64748b'};
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s;
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:hover:not(:disabled) {
    background: #f1f5f9;
    color: #374151;
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
`;

// Error State Components
const ErrorState = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #fef2f2;
  border-radius: 8px;
  border: 1px solid #fecaca;
  margin-bottom: 1.5rem;
  animation: slideDown 0.3s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ErrorIcon = styled.div`
  color: #dc2626;
  font-size: 1.25rem;
  flex-shrink: 0;
`;

const ErrorText = styled.span`
  color: #dc2626;
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.4;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RequiredIndicator = styled.span`
  color: #ef4444;
  font-size: 0.8rem;
  font-weight: normal;
`;

const OptionalIndicator = styled.span`
  color: #6b7280;
  font-size: 0.8rem;
  font-weight: normal;
  font-style: italic;
`;

const StarsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 0.5rem 0;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  color: ${props => props.$active ? "#f59e0b" : "#d1d5db"};
  font-size: 2.5rem;
  transition: all 0.2s;
  padding: 0.25rem;
  border-radius: 4px;
  opacity: ${props => props.$disabled ? 0.6 : 1};

  &:hover:not(:disabled) {
    transform: scale(1.2);
    color: #f59e0b;
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
  padding: 0.5rem;
  background: #f0fdf4;
  border-radius: 6px;
  border-left: 3px solid #10b981;
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
  background-color: ${props => props.disabled ? '#f9fafb' : 'white'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'text'};

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }

  &:disabled {
    opacity: 0.6;
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

// New Quick Rating Section
const QuickRatingSection = styled.div`
  background: #f8fafc;
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const QuickRatingTitle = styled.h4`
  margin: 0 0 0.75rem 0;
  color: #374151;
  font-size: 0.9rem;
  font-weight: 600;
`;

const QuickRatingButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const QuickRatingButton = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid ${(props) => (props.$active ? "#10b981" : "#e5e7eb")};
  background: ${(props) => (props.$active ? "#10b981" : "white")};
  color: ${(props) => (props.$active ? "white" : "#374151")};
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:hover:not(:disabled) {
    border-color: #10b981;
    background: ${(props) => (props.$active ? "#10b981" : "#f0fdf4")};
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
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  color: #374151;
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:hover:not(:disabled) {
    background: #f3f4f6;
    border-color: #9ca3af;
  }
`;

const SubmitButton = styled.button`
  flex: 2;
  padding: 0.75rem 1.5rem;
  border: none;
  background: ${(props) =>
    props.disabled
      ? "#9ca3af"
      : "linear-gradient(135deg, #10b981, #059669)"};
  color: white;
  border-radius: 8px;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }
`;