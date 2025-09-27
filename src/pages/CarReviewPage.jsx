// components/UserReviews.js
import React, { useMemo, useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  Star,
  StarHalf,
  StarOutline,
  Login,
  Edit,
  Delete,
} from "@styled-icons/material";
import { FaCar, FaCalendar } from "react-icons/fa";
import { useCurrentUser } from "../hooks/useAuth";
import {
  useDeleteReview,
  useUpdateReview,
  useGetUserReviews,
} from "../hooks/useReview";

const UserReviews = () => {
  const { data: userData } = useCurrentUser();
  const user = userData?.user || null;
  console.log("user", user);
  const { mutate: deleteReview } = useDeleteReview();
  const { mutate: updateReview, isLoading: isUpdating } = useUpdateReview();
  const { data: reviewsData } = useGetUserReviews(user?._id);
  console.log(reviewsData);
  const reviews = useMemo(() => reviewsData?.data || [], [reviewsData]);

  const [editingReview, setEditingReview] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  // Calculate statistics for user's reviews
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
    percentage:
      (reviews.filter((r) => r.rating === stars).length / reviews.length) * 100,
  }));

  const filteredReviews =
    activeFilter === "all"
      ? reviews
      : reviews.filter((review) => review.rating === parseInt(activeFilter));

  const renderStars = (rating, size = 20) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StyledStar key={i} size={size} />);
    }

    if (hasHalfStar) {
      stars.push(<StyledStarHalf key="half" size={size} />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StyledStarOutline key={`empty-${i}`} size={size} />);
    }

    return stars;
  };

  const handleUpdateReview = (e) => {
    e.preventDefault();
    if (!editingReview.comment.trim()) return;

    updateReview(
      {
        reviewId: editingReview._id,
        rating: editingReview.rating,
        comment: editingReview.comment.trim(),
      },
      {
        onSuccess: () => {
          setEditingReview(null);
        },
      }
    );
  };

  const handleDeleteReview = (reviewId) => {
    deleteReview(reviewId);
  };

  const startEditing = (review) => {
    setEditingReview({ ...review });
  };

  const cancelEditing = () => {
    setEditingReview(null);
  };

  if (!user) {
    return (
      <ModernReviewsWrapper>
        <LoginPrompt>
          <PromptIcon>
            <Login size={48} />
          </PromptIcon>
          <PromptContent>
            <h3>Please Log In</h3>
            <p>You need to be logged in to view and manage your reviews.</p>
            <ActionButton onClick={() => (window.location.href = "/login")}>
              Log In
            </ActionButton>
          </PromptContent>
        </LoginPrompt>
      </ModernReviewsWrapper>
    );
  }

  return (
    <ModernReviewsWrapper>
      {/* Header Section */}
      <HeaderSection>
        <HeaderContent>
          <Title>
            <StarIcon />
            My Reviews
            <ReviewCount>{reviews.length} reviews</ReviewCount>
          </Title>

          <StatsGrid>
            <AverageRatingCard>
              <RatingValue>{averageRating.toFixed(1)}</RatingValue>
              <StarsContainer>{renderStars(averageRating, 24)}</StarsContainer>
              <RatingText>Average Rating</RatingText>
            </AverageRatingCard>

            <RatingBars>
              {ratingDistribution.map(({ stars, count, percentage }) => (
                <RatingBar key={stars}>
                  <StarLabel>{stars} ★</StarLabel>
                  <BarContainer>
                    <BarFill percentage={percentage} />
                  </BarContainer>
                  <BarCount>{count}</BarCount>
                </RatingBar>
              ))}
            </RatingBars>
          </StatsGrid>
        </HeaderContent>
      </HeaderSection>

      {/* Reviews Management Section */}
      <ManagementSection>
        {/* Reviews Filter */}
        {reviews.length > 0 && (
          <FilterSection>
            <FilterLabel>Filter by rating:</FilterLabel>
            <FilterTabs>
              <FilterTab
                active={activeFilter === "all"}
                onClick={() => setActiveFilter("all")}
              >
                All ({reviews.length})
              </FilterTab>
              {[5, 4, 3, 2, 1].map((rating) => (
                <FilterTab
                  key={rating}
                  active={activeFilter === rating.toString()}
                  onClick={() => setActiveFilter(rating.toString())}
                >
                  {rating} ★ (
                  {reviews.filter((r) => r.rating === rating).length})
                </FilterTab>
              ))}
            </FilterTabs>
          </FilterSection>
        )}

        {/* User's Reviews */}
        <ReviewsGrid>
          {filteredReviews.map((review) => (
            <ReviewCard key={review._id} highlight>
              <ReviewHeader>
                <CarInfo>
                  <CarIcon>
                    <FaCar size={20} />
                  </CarIcon>
                  <div>
                    <CarName>
                      {review.car?.make} {review.car?.model} {review.car?.year}
                    </CarName>
                    <CarDetails>
                      {review.car?.type} • {review.car?.fuelType}
                    </CarDetails>
                  </div>
                </CarInfo>
                <ActionButtons>
                  <EditButton onClick={() => startEditing(review)}>
                    <Edit size={16} />
                    Edit
                  </EditButton>
                  <DeleteButton onClick={() => handleDeleteReview(review._id)}>
                    <Delete size={16} />
                    Delete
                  </DeleteButton>
                </ActionButtons>
              </ReviewHeader>

              {editingReview && editingReview._id === review._id ? (
                <EditForm onSubmit={handleUpdateReview}>
                  <RatingSelection>
                    <StarRating>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarButton
                          key={star}
                          type="button"
                          onClick={() =>
                            setEditingReview((prev) => ({
                              ...prev,
                              rating: star,
                            }))
                          }
                          active={star <= editingReview.rating}
                        >
                          <Star size={20} />
                        </StarButton>
                      ))}
                    </StarRating>
                  </RatingSelection>
                  <TextArea
                    value={editingReview.comment}
                    onChange={(e) =>
                      setEditingReview((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                  <EditActions>
                    <CancelButton type="button" onClick={cancelEditing}>
                      Cancel
                    </CancelButton>
                    <UpdateButton type="submit" disabled={isUpdating}>
                      {isUpdating ? "Updating..." : "Update Review"}
                    </UpdateButton>
                  </EditActions>
                </EditForm>
              ) : (
                <>
                  <ReviewMeta>
                    <StarsContainer>
                      {renderStars(review.rating)}
                    </StarsContainer>
                    <ReviewDate>
                      <FaCalendar size={14} />
                      Reviewed on{" "}
                      {new Date(review.createdAt).toLocaleDateString()}
                    </ReviewDate>
                    {review.updatedAt !== review.createdAt && (
                      <UpdatedBadge>
                        Edited •{" "}
                        {new Date(review.updatedAt).toLocaleDateString()}
                      </UpdatedBadge>
                    )}
                  </ReviewMeta>
                  <ReviewComment>{review.comment}</ReviewComment>
                </>
              )}
            </ReviewCard>
          ))}
        </ReviewsGrid>

        {reviews.length === 0 ? (
          <EmptyState>
            <EmptyIcon>💬</EmptyIcon>
            <h4>No Reviews Yet</h4>
            <p>
              You haven't written any reviews yet. Start reviewing cars you've
              rented!
            </p>
            <ActionButton
              primary
              onClick={() => (window.location.href = "/cars")}
            >
              Browse Cars
            </ActionButton>
          </EmptyState>
        ) : filteredReviews.length === 0 ? (
          <EmptyState>
            <EmptyIcon>🔍</EmptyIcon>
            <h4>No reviews match your filter</h4>
            <p>Try selecting a different rating filter</p>
          </EmptyState>
        ) : null}
      </ManagementSection>
    </ModernReviewsWrapper>
  );
};

export default UserReviews;

// Styled Components (mostly reused from CarReviews with some additions)
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(-10px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const ModernReviewsWrapper = styled.section`
  margin: 3rem 0;
  animation: ${fadeIn} 0.6s ease-out;
`;

const HeaderSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(30%, -30%);
  }
`;

const HeaderContent = styled.div`
  position: relative;
  z-index: 2;
`;

const Title = styled.h2`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0 0 2rem 0;
`;

const StarIcon = styled(Star)`
  color: #ffd700;
  width: 32px;
  height: 32px;
`;

const ReviewCount = styled.span`
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 3rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const AverageRatingCard = styled.div`
  text-align: center;
  background: rgba(255, 255, 255, 0.15);
  padding: 1.5rem;
  border-radius: 16px;
  backdrop-filter: blur(10px);
`;

const RatingValue = styled.div`
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 0.5rem;
`;

const RatingText = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
  margin-top: 0.5rem;
`;

const RatingBars = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const RatingBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StarLabel = styled.span`
  font-size: 0.9rem;
  width: 40px;
  opacity: 0.9;
`;

const BarContainer = styled.div`
  flex: 1;
  background: rgba(255, 255, 255, 0.2);
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
`;

const BarFill = styled.div`
  background: #ffd700;
  height: 100%;
  width: ${(props) => props.percentage}%;
  transition: width 0.3s ease;
  border-radius: 4px;
`;

const BarCount = styled.span`
  font-size: 0.9rem;
  width: 30px;
  text-align: right;
  opacity: 0.9;
`;

const ManagementSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ReviewCard = styled.div`
  background: white;
  border: 1px solid ${(props) => (props.highlight ? "#e0f2fe" : "#e2e8f0")};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: ${(props) =>
    props.highlight
      ? "0 4px 25px rgba(56, 189, 248, 0.15)"
      : "0 2px 10px rgba(0, 0, 0, 0.04)"};
  animation: ${slideIn} 0.3s ease-out;
  ${(props) =>
    props.highlight &&
    `
    border-left: 4px solid #3b82f6;
    background: #f8fafc;
  `}
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const CarInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
`;

const CarIcon = styled.div`
  color: #3b82f6;
  background: #eff6ff;
  padding: 0.75rem;
  border-radius: 12px;
`;

const CarName = styled.div`
  font-weight: 700;
  color: #1e293b;
  font-size: 1.2rem;
  margin-bottom: 0.25rem;
`;

const CarDetails = styled.div`
  color: #64748b;
  font-size: 0.9rem;
`;

const ReviewMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StarsContainer = styled.div`
  display: flex;
  gap: 2px;
  color: #fbbf24;
`;

const StyledStar = styled(Star)`
  width: ${(props) => props.size || 20}px;
  height: ${(props) => props.size || 20}px;
`;

const StyledStarHalf = styled(StarHalf)`
  width: ${(props) => props.size || 20}px;
  height: ${(props) => props.size || 20}px;
`;

const StyledStarOutline = styled(StarOutline)`
  width: ${(props) => props.size || 20}px;
  height: ${(props) => props.size || 20}px;
`;

const ReviewDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #64748b;
  font-size: 0.9rem;
`;

const UpdatedBadge = styled.span`
  background: #fef3c7;
  color: #92400e;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
`;

const ReviewComment = styled.p`
  color: #374151;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  background: #eff6ff;
  color: #3b82f6;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #dbeafe;
    transform: translateY(-1px);
  }
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  background: #fef2f2;
  color: #ef4444;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #fee2e2;
    transform: translateY(-1px);
  }
`;

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const RatingSelection = styled.div`
  label {
    display: block;
    margin-bottom: 1rem;
    font-weight: 600;
    color: #374151;
  }
`;

const StarRating = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${(props) => (props.active ? "#fbbf24" : "#d1d5db")};
  transition: all 0.2s ease;
  padding: 0.25rem;

  &:hover {
    transform: scale(1.2);
    color: #fbbf24;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  resize: vertical;
  font-family: inherit;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const EditActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e7eb;
  }
`;

const UpdateButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #2563eb;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const FilterSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
`;

const FilterLabel = styled.span`
  font-weight: 600;
  color: #374151;
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const FilterTab = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid ${(props) => (props.active ? "#3b82f6" : "#e2e8f0")};
  background: ${(props) => (props.active ? "#3b82f6" : "white")};
  color: ${(props) => (props.active ? "white" : "#64748b")};
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
  }
`;

const ReviewsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #64748b;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const LoginPrompt = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 4rem 2rem;
  text-align: center;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const PromptIcon = styled.div`
  color: #3b82f6;
`;

const PromptContent = styled.div`
  h3 {
    margin: 0 0 0.5rem 0;
    color: #1e293b;
    font-size: 1.5rem;
  }
  p {
    margin: 0 0 1.5rem 0;
    color: #64748b;
  }
`;

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${(props) =>
    props.primary
      ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
      : "transparent"};
  color: ${(props) => (props.primary ? "white" : "#3b82f6")};
  border: ${(props) => (props.primary ? "none" : "2px solid #3b82f6")};
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) =>
      props.primary
        ? "0 8px 20px rgba(59, 130, 246, 0.3)"
        : "0 8px 20px rgba(59, 130, 246, 0.15)"};
  }
`;
