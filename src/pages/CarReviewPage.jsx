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

// Import UI Components
import {
  PrimaryButton,
  SecondaryButton,
  GhostButton,
  ErrorButton,
} from "../components/ui/Button";
import { Card } from "../components/Cards/Card";
import { EmptyState } from "../components/ui/LoadingSpinner";
import {
  FormGroup,
  Label,
  TextArea as TextAreaBase,
  ErrorMessage,
} from "../components/forms/Form";

import usePageTitle from "../hooks/usePageTitle";

import { ROUTE_CONFIG, PATHS } from "../routes/routePaths";

const UserReviews = () => {
  const seoConfig = ROUTE_CONFIG[PATHS.REVIEWS];

  usePageTitle(seoConfig.title, seoConfig.description);
  const { data: userData } = useCurrentUser();
  const user = userData?.user || null;

  const { mutate: deleteReview } = useDeleteReview();
  const { mutate: updateReview, isLoading: isUpdating } = useUpdateReview();
  const { data: reviewsData } = useGetUserReviews();

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
            <PrimaryButton onClick={() => (window.location.href = "/login")}>
              Log In
            </PrimaryButton>
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
            <ReviewCard key={review._id} $highlight>
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
                  <FormGroup>
                    <Label>Rating</Label>
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
                            $active={star <= editingReview.rating}
                          >
                            <Star size={20} />
                          </StarButton>
                        ))}
                      </StarRating>
                    </RatingSelection>
                  </FormGroup>
                  <FormGroup>
                    <Label>Review Comment</Label>
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
                  </FormGroup>
                  <EditActions>
                    <SecondaryButton type="button" onClick={cancelEditing}>
                      Cancel
                    </SecondaryButton>
                    <PrimaryButton type="submit" disabled={isUpdating}>
                      {isUpdating ? "Updating..." : "Update Review"}
                    </PrimaryButton>
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
          <EmptyState
            icon="💬"
            title="No Reviews Yet"
            message="You haven't written any reviews yet. Start reviewing cars you've rented!"
            action={
              <PrimaryButton onClick={() => (window.location.href = "/models")}>
                Browse Cars
              </PrimaryButton>
            }
          />
        ) : filteredReviews.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No reviews match your filter"
            message="Try selecting a different rating filter"
          />
        ) : null}
      </ManagementSection>
    </ModernReviewsWrapper>
  );
};

export default UserReviews;

// Styled Components using Global Styles
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(-10px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const ModernReviewsWrapper = styled.section`
  margin: var(--space-2xl) 0;
  animation: ${fadeIn} var(--transition-normal) ease-out;
  font-family: var(--font-body);
`;

const HeaderSection = styled.div`
  background: var(--gradient-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-2xl);
  margin-bottom: var(--space-xl);
  color: var(--white);
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
  gap: var(--space-md);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  margin: 0 0 var(--space-xl) 0;
  font-family: var(--font-heading);
`;

const StarIcon = styled(Star)`
  color: var(--accent);
  width: 32px;
  height: 32px;
`;

const ReviewCount = styled.span`
  background: rgba(255, 255, 255, 0.2);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-full);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  backdrop-filter: blur(10px);
  font-family: var(--font-body);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-xl);
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }
`;

const AverageRatingCard = styled.div`
  text-align: center;
  background: rgba(255, 255, 255, 0.15);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(10px);
`;

const RatingValue = styled.div`
  font-size: var(--text-4xl);
  font-weight: var(--font-extrabold);
  line-height: 1;
  margin-bottom: var(--space-sm);
  font-family: var(--font-heading);
`;

const RatingText = styled.div`
  font-size: var(--text-sm);
  opacity: 0.9;
  margin-top: var(--space-sm);
  font-family: var(--font-body);
`;

const RatingBars = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const RatingBar = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`;

const StarLabel = styled.span`
  font-size: var(--text-sm);
  width: 40px;
  opacity: 0.9;
  font-family: var(--font-body);
`;

const BarContainer = styled.div`
  flex: 1;
  background: rgba(255, 255, 255, 0.2);
  height: 8px;
  border-radius: var(--radius-sm);
  overflow: hidden;
`;

const BarFill = styled.div`
  background: var(--accent);
  height: 100%;
  width: ${(props) => props.percentage}%;
  transition: width var(--transition-normal) ease;
  border-radius: var(--radius-sm);
`;

const BarCount = styled.span`
  font-size: var(--text-sm);
  width: 30px;
  text-align: right;
  opacity: 0.9;
  font-family: var(--font-body);
`;

const ManagementSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
`;

const ReviewCard = styled(Card)`
  border: 1px solid
    ${(props) => (props.$highlight ? "var(--gray-300)" : "var(--gray-200)")};
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  animation: ${slideIn} var(--transition-normal) ease-out;
  ${(props) =>
    props.$highlight &&
    `
    border-left: 4px solid var(--primary);
    background: var(--surface);
  `}
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-md);
`;

const CarInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  flex: 1;
`;

const CarIcon = styled.div`
  color: var(--primary);
  background: var(--gray-100);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
`;

const CarName = styled.div`
  font-weight: var(--font-bold);
  color: var(--text-primary);
  font-size: var(--text-lg);
  margin-bottom: var(--space-xs);
  font-family: var(--font-heading);
`;

const CarDetails = styled.div`
  color: var(--text-muted);
  font-size: var(--text-sm);
  font-family: var(--font-body);
`;

const ReviewMeta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
`;

const StarsContainer = styled.div`
  display: flex;
  gap: 2px;
  color: var(--accent);
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
  gap: var(--space-xs);
  color: var(--text-muted);
  font-size: var(--text-sm);
  font-family: var(--font-body);
`;

const UpdatedBadge = styled.span`
  background: var(--gray-100);
  color: var(--text-secondary);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-family: var(--font-body);
`;

const ReviewComment = styled.p`
  color: var(--text-primary);
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
  font-family: var(--font-body);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--space-sm);
`;

const EditButton = styled(GhostButton)`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  font-size: var(--text-sm);
`;

const DeleteButton = styled(ErrorButton)`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  font-size: var(--text-sm);
`;

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-top: var(--space-md);
`;

const RatingSelection = styled.div`
  label {
    display: block;
    margin-bottom: var(--space-md);
    font-weight: var(--font-semibold);
    color: var(--text-primary);
    font-family: var(--font-body);
  }
`;

const StarRating = styled.div`
  display: flex;
  gap: var(--space-sm);
`;

const StarButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${(props) => (props.$active ? "var(--accent)" : "var(--gray-400)")};
  transition: all var(--transition-normal) ease;
  padding: var(--space-xs);

  &:hover {
    transform: scale(1.2);
    color: var(--accent);
  }
`;

const TextArea = styled(TextAreaBase)`
  width: 100%;
  padding: var(--space-lg);
  border: 2px solid var(--gray-300);
  border-radius: var(--radius-lg);
  resize: vertical;
  font-family: var(--font-body);
  font-size: var(--text-base);
  transition: all var(--transition-normal);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
  }
`;

const EditActions = styled.div`
  display: flex;
  gap: var(--space-md);
  justify-content: flex-end;
`;

const FilterSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--surface);
  border-radius: var(--radius-lg);
`;

const FilterLabel = styled.span`
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  font-family: var(--font-body);
`;

const FilterTabs = styled.div`
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
`;

const FilterTab = styled.button`
  padding: var(--space-sm) var(--space-md);
  border: 2px solid
    ${(props) => (props.active ? "var(--primary)" : "var(--gray-300)")};
  background: ${(props) => (props.active ? "var(--primary)" : "var(--white)")};
  color: ${(props) => (props.active ? "var(--white)" : "var(--text-muted)")};
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--transition-normal) ease;
  font-family: var(--font-body);

  &:hover {
    border-color: var(--primary);
  }
`;

const ReviewsGrid = styled.div`
  display: grid;
  gap: var(--space-lg);
`;

const LoginPrompt = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xl);
  padding: var(--space-2xl) var(--space-xl);
  text-align: center;
  background: var(--white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
`;

const PromptIcon = styled.div`
  color: var(--primary);
`;

const PromptContent = styled.div`
  h3 {
    margin: 0 0 var(--space-sm) 0;
    color: var(--text-primary);
    font-size: var(--text-xl);
    font-family: var(--font-heading);
  }
  p {
    margin: 0 0 var(--space-lg) 0;
    color: var(--text-muted);
    font-family: var(--font-body);
  }
`;
