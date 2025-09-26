// components/CarReviews.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Star,
  StarHalf,
  StarOutline,
  Login,
  CheckCircle,
} from "@styled-icons/material";
import { useCurrentUser } from "../hooks/useAuth";
import { useCreateReview } from "../hooks/useReview";
// import { useMyBookings } from "../hooks/useBooking";

const CarReviews = ({ carId }) => {
  const { data: userData } = useCurrentUser();
  // const { data: reviewsData, isLoading, error } = useGetCarReview(carId);
  // const { data: BookingsData } = useMyBookings();
  // console.log("BookingsData", BookingsData);

  // const bookings = useMemo(() => {
  //   return myBookings?.data?.data.filter(
  //     (booking) => booking.status === "completed"
  //   );
  // }, [myBookings]);

  // const userBookings = useMemo(() => {
  //   return bookings.filter((booking) => booking.car._id === carId);
  // }, [bookings, carId]);
  const user = userData?.user || null;
  // const reviews = useMemo(() => {
  //   reviewsData?.reviews || [];
  // }, [reviewsData]);
  const { mutate: createReview, isLoading: isSubmitting } = useCreateReview();

  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [hasRentedCar, setHasRentedCar] = useState(false);
  console.log(setHasRentedCar);
  // const [userReview, setUserReview] = useState(null);

  // Check if user has rented this car and if they've already reviewed it
  useEffect(() => {
    if (user && carId) {
      // Check if user has any completed bookings for this car
      // const rentedThisCar = userBookings.some(
      //   (booking) => booking.car._id === carId && booking.status === "completed"
      // );
      // setHasRentedCar(rentedThisCar);
      // Check if user has already reviewed this car
      // const existingReview = reviews.find(
      //   (review) => review.user._id === user._id
      // );
      // setUserReview(existingReview);
    }
  }, [user, carId]);

  // Calculate average rating
  // const averageRating =
  //   reviews.length > 0
  //     ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
  //     : 0;

  // Function to render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StyledStar key={i} />);
    }

    if (hasHalfStar) {
      stars.push(<StyledStarHalf key="half" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StyledStarOutline key={`empty-${i}`} />);
    }

    return stars;
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();

    if (!newReview.comment.trim()) {
      alert("Please enter a comment for your review.");
      return;
    }

    if (!hasRentedCar) {
      alert("You can only review cars you've rented.");
      return;
    }

    createReview(
      {
        carId,
        rating: newReview.rating,
        comment: newReview.comment.trim(),
      },
      {
        onSuccess: () => {
          setNewReview({ rating: 5, comment: "" });
        },
        onError: (error) => {
          console.error("Failed to submit review:", error);
          alert("Failed to submit review. Please try again.");
        },
      }
    );
  };

  const handleLoginRedirect = () => {
    window.location.href = `/login?redirect=${encodeURIComponent(
      window.location.pathname
    )}`;
  };

  // Determine review eligibility and message
  const getReviewEligibility = () => {
    if (!user) {
      return {
        canReview: false,
        message: "Please log in to leave a review",
        type: "login",
      };
    }

    // if (userReview) {
    //   return {
    //     canReview: false,
    //     message: "You've already reviewed this car",
    //     type: "reviewed",
    //   };
    // }

    if (!hasRentedCar) {
      return {
        canReview: false,
        message: "You can review this car after completing a rental",
        type: "not-rented",
      };
    }

    return {
      canReview: true,
      message: "Share your experience with this car",
      type: "eligible",
    };
  };

  const eligibility = getReviewEligibility();

  // if (isLoading) {
  //   return (
  //     <ReviewsWrapper>
  //       <LoadingState>Loading reviews...</LoadingState>
  //     </ReviewsWrapper>
  //   );
  // }

  // if (error) {
  //   return (
  //     <ReviewsWrapper>
  //       <ErrorState>
  //         <h3>Unable to load reviews</h3>
  //         <p>Please try refreshing the page.</p>
  //       </ErrorState>
  //     </ReviewsWrapper>
  //   );
  // }

  return (
    <ReviewsWrapper>
      <ReviewsHeader>
        <h2>Customer Reviews</h2>
        <RatingSummary>
          {/* <AverageRating>{averageRating.toFixed(1)}</AverageRating> */}
          {/* <StarsContainer>{renderStars(averageRating)}</StarsContainer> */}
          {/* <ReviewCount>({reviews.length} reviews)</ReviewCount> */}
        </RatingSummary>
      </ReviewsHeader>

      {/* Add Review Section */}
      <ReviewSection>
        {eligibility.canReview ? (
          <ReviewForm onSubmit={handleSubmitReview}>
            <ReviewEligibilityBadge type="eligible">
              <CheckCircle size={16} />
              You've rented this car - Share your experience!
            </ReviewEligibilityBadge>

            <h3>Add Your Review</h3>
            <RatingInput>
              <label>Rating:</label>
              <select
                value={newReview.rating}
                onChange={(e) =>
                  setNewReview({ ...newReview, rating: Number(e.target.value) })
                }
                disabled={isSubmitting}
              >
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} Star{rating !== 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </RatingInput>
            <TextArea
              placeholder="Share your experience with this car..."
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              rows={4}
              disabled={isSubmitting}
              maxLength={500}
            />
            <CharacterCount>
              {newReview.comment.length}/500 characters
            </CharacterCount>
            <SubmitButton
              type="submit"
              disabled={isSubmitting || !newReview.comment.trim()}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </SubmitButton>
          </ReviewForm>
        ) : (
          <ReviewEligibilityPrompt type={eligibility.type}>
            <div className="icon">
              {eligibility.type === "login" && <Login size={24} />}
              {eligibility.type === "reviewed" && <CheckCircle size={24} />}
              {/* {eligibility.type === "not-rented" && <Clock size={24} />} */}
            </div>
            <div className="content">
              <h3>
                {eligibility.type === "login" &&
                  "Want to share your experience?"}
                {eligibility.type === "reviewed" && "Review Submitted"}
                {eligibility.type === "not-rented" && "Rent to Review"}
              </h3>
              <p>{eligibility.message}</p>
              {eligibility.type === "login" && (
                <LoginButton onClick={handleLoginRedirect}>
                  Log In to Review
                </LoginButton>
              )}
              {eligibility.type === "not-rented" && (
                <RentButton
                  onClick={() => (window.location.href = `/cars/${carId}/book`)}
                >
                  Rent This Car
                </RentButton>
              )}
            </div>
          </ReviewEligibilityPrompt>
        )}
      </ReviewSection>

      {/* User's Existing Review */}
      {/* {userReview && (
        <UserReviewSection>
          <h3>Your Review</h3>
          <ReviewItem>
            <ReviewHeader>
              <UserInfo>
                <UserName>You</UserName>
                <ReviewDate>
                  {new Date(userReview.createdAt).toLocaleDateString()}
                </ReviewDate>
              </UserInfo>
              <StarsContainer>{renderStars(userReview.rating)}</StarsContainer>
            </ReviewHeader>
            <Comment>{userReview.comment}</Comment>
          </ReviewItem>
        </UserReviewSection>
      )} */}

      {/* Other Users' Reviews */}
      {/* {reviews.filter((review) => !user || review.user._id !== user._id)
        .length > 0 ? (
        <ReviewsList>
          <h3>Other Reviews</h3>
          {reviews
            .filter((review) => !user || review.user._id !== user._id)
            .map((review) => (
              <ReviewItem key={review._id}>
                <ReviewHeader>
                  <UserInfo>
                    <UserName>
                      {review.user?.name ||
                        review.user?.username ||
                        "Anonymous"}
                    </UserName>
                    <ReviewDate>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </ReviewDate>
                  </UserInfo>
                  <StarsContainer>{renderStars(review.rating)}</StarsContainer>
                </ReviewHeader>
                <Comment>{review.comment}</Comment>
              </ReviewItem>
            ))}
        </ReviewsList>
      ) : (
        !userReview && (
          <EmptyReviews>
            <h3>No reviews yet</h3>
            <p>Be the first to share your experience with this car!</p>
          </EmptyReviews>
        )
      )} */}
    </ReviewsWrapper>
  );
};

export default CarReviews;

// Styled Components
const ReviewsWrapper = styled.section`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid #e2e8f0;
`;

const ReviewsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h2 {
    color: #3b82f6;
    margin: 0;
    font-size: 1.8rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const RatingSummary = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AverageRating = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #3b82f6;
`;

const StarsContainer = styled.div`
  display: flex;
  gap: 2px;
  color: #f59e0b;
`;

const StyledStar = styled(Star)`
  width: 20px;
  height: 20px;
`;

const StyledStarHalf = styled(StarHalf)`
  width: 20px;
  height: 20px;
`;

const StyledStarOutline = styled(StarOutline)`
  width: 20px;
  height: 20px;
`;

const ReviewCount = styled.span`
  color: #64748b;
  font-size: 0.9rem;
`;

const ReviewSection = styled.div`
  margin-bottom: 2rem;
`;

const ReviewForm = styled.form`
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;

  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #1e293b;
  }
`;

const ReviewEligibilityBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 6px;
  color: #166534;
  font-weight: 600;
  margin-bottom: 1rem;

  svg {
    color: #22c55e;
  }
`;

const ReviewEligibilityPrompt = styled.div`
  background: #f8fafc;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  border: 2px dashed #cbd5e1;
  display: flex;
  align-items: center;
  gap: 1rem;

  .icon {
    color: ${(props) => {
      switch (props.type) {
        case "login":
          return "#3b82f6";
        case "reviewed":
          return "#22c55e";
        case "not-rented":
          return "#f59e0b";
        default:
          return "#64748b";
      }
    }};
  }

  .content {
    flex: 1;

    h3 {
      margin: 0 0 0.5rem 0;
      color: #1e293b;
    }

    p {
      color: #64748b;
      margin-bottom: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    flex-direction: column;
    text-align: center;
  }
`;

const LoginButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background: #2563eb;
  }
`;

const RentButton = styled.button`
  background: #f59e0b;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background: #d97706;
  }
`;

const RatingInput = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  label {
    font-weight: 600;
    color: #374151;
  }

  select {
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background: white;

    &:disabled {
      background: #f3f4f6;
      cursor: not-allowed;
    }
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }
`;

const CharacterCount = styled.div`
  text-align: right;
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 0.25rem;
`;

const SubmitButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 1rem;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background: #2563eb;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const UserReviewSection = styled.div`
  margin-bottom: 2rem;

  h3 {
    color: #1e293b;
    margin-bottom: 1rem;
  }
`;

const ReviewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  h3 {
    color: #1e293b;
    margin-bottom: 1rem;
  }
`;

const ReviewItem = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const UserInfo = styled.div``;

const UserName = styled.div`
  font-weight: 600;
  color: #1e293b;
`;

const ReviewDate = styled.div`
  font-size: 0.9rem;
  color: #64748b;
`;

const Comment = styled.p`
  line-height: 1.6;
  margin: 0;
  color: #374151;
  white-space: pre-wrap;
`;

const EmptyReviews = styled.div`
  text-align: center;
  padding: 3rem;
  color: #64748b;

  h3 {
    margin-bottom: 0.5rem;
    color: #1e293b;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #64748b;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #ef4444;

  h3 {
    margin-bottom: 0.5rem;
  }
`;
