/* eslint-disable react/prop-types */
import React, { useState, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import {
  FaStar,
  FaUser,
  FaCalendar,
  FaCheckCircle,
  FaEdit,
  FaImages,
} from "react-icons/fa";
import { useGetCarReviews, useCreateReview } from "../cars/useReview";
import { useGetBookings } from "../bookings/useBooking";
import { PrimaryButton,  } from "../../components/ui/Button";
import { devices } from "../../styles/GlobalStyles";

const ReviewSection = ({ modelId, userId }) => {
  // State for UI controls
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: "",
    photos: [],
    features: [],
  });
  const [activeFilter, setActiveFilter] = useState("all");

  // Custom hooks for data management
  const { data: reviewsData, isLoading: reviewsLoading } =
    useGetCarReviews(modelId);
  const { mutate: createReview, isLoading: isSubmitting } = useCreateReview();

  // Use your actual hook for user bookings
  const { data: myBookings, isLoading: bookingsLoading } =
    useGetBookings(userId);

  // Memoized computed values
  const reviews = useMemo(() => {
    return reviewsData?.data || [];
  }, [reviewsData]);

  // Check if user has booked this specific car model
  const userHasBooked = useMemo(() => {
    if (!myBookings || !modelId) return false;

    return myBookings.some(
      (booking) =>
        booking.carModelId === modelId ||
        booking.modelId === modelId ||
        booking.car?.modelId === modelId
    );
  }, [myBookings, modelId]);

  // Check if user has already reviewed this car
  const userHasReviewed = useMemo(() => {
    if (!reviews.length || !userId) return false;

    return reviews.some(
      (review) => review.userId === userId || review.user?.id === userId
    );
  }, [reviews, userId]);

  // Derived state
  const filteredReviews = useMemo(() => {
    return activeFilter === "all"
      ? reviews
      : reviews.filter((review) => review.rating === parseInt(activeFilter));
  }, [reviews, activeFilter]);

  const averageRating = useMemo(() => {
    return reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;
  }, [reviews]);

  const ratingDistribution = useMemo(() => {
    return [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: reviews.filter((r) => r.rating === stars).length,
      percentage:
        reviews.length > 0
          ? (reviews.filter((r) => r.rating === stars).length /
              reviews.length) *
            100
          : 0,
    }));
  }, [reviews]);

  // Event handlers
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!formData.comment.trim()) return;

    createReview(
      {
        modelId,
        userId,
        rating: formData.rating,
        comment: formData.comment,
        features: formData.features,
        photos: formData.photos,
      },
      {
        onSuccess: () => {
          setFormData({ rating: 5, comment: "", photos: [], features: [] });
          setShowForm(false);
        },
        onError: (error) => {
          console.error("Failed to submit review:", error);
        },
      }
    );
  };

  const handleRatingClick = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  // Loading states
  if (reviewsLoading || bookingsLoading) {
    return (
      <ReviewSectionWrapper>
        <LoadingState>Loading reviews...</LoadingState>
      </ReviewSectionWrapper>
    );
  }

  return (
    <ReviewSectionWrapper>
      <Header>
        <Title>
          <StarIcon /> Customer Reviews
          <ReviewCount>({reviews.length} reviews)</ReviewCount>
        </Title>

        {userHasBooked && !userHasReviewed && (
          <AddReviewButton
            onClick={() => setShowForm(!showForm)}
            disabled={isSubmitting}
            $variant="primary"
          >
            <FaEdit /> {showForm ? "Cancel Review" : "Write a Review"}
          </AddReviewButton>
        )}
      </Header>

      <ReviewStats>
        <AverageRating>
          <RatingValue>{averageRating.toFixed(1)}</RatingValue>
          <Stars>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} $filled={star <= Math.round(averageRating)} />
            ))}
          </Stars>
          <RatingText>Based on {reviews.length} reviews</RatingText>
        </AverageRating>

        <RatingBars>
          {ratingDistribution.map(({ stars, count, percentage }) => (
            <RatingBar key={stars}>
              <StarCount>{stars} ★</StarCount>
              <BarContainer>
                <BarFill $percentage={percentage} />
              </BarContainer>
              <BarCount>{count}</BarCount>
            </RatingBar>
          ))}
        </RatingBars>
      </ReviewStats>

      {/* Review Form - Only shown if user has booked and hasn't reviewed */}
      {showForm && userHasBooked && !userHasReviewed && (
        <ReviewForm onSubmit={handleSubmitReview}>
          <FormHeader>
            <FormTitle>Share Your Experience</FormTitle>
            <FormDescription>
              Tell others about your trip with this Mercedes-Benz
            </FormDescription>
          </FormHeader>

          <RatingSelection>
            <FormLabel>Overall Rating *</FormLabel>
            <StarRating>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarButton
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  $active={star <= formData.rating}
                  disabled={isSubmitting}
                >
                  <FaStar />
                </StarButton>
              ))}
            </StarRating>
          </RatingSelection>

          <FeatureSelection>
            <FormLabel>What stood out? (Select all that apply)</FormLabel>
            <FeatureGrid>
              {[
                "Performance",
                "Comfort",
                "Style",
                "Technology",
                "Fuel Efficiency",
                "Cleanliness",
                "Safety",
                "Value",
              ].map((feature) => (
                <FeatureTag
                  key={feature}
                  $selected={formData.features.includes(feature)}
                  onClick={() => handleFeatureToggle(feature)}
                  disabled={isSubmitting}
                  type="button"
                >
                  {feature}
                </FeatureTag>
              ))}
            </FeatureGrid>
          </FeatureSelection>

          <CommentSection>
            <FormLabel>Share details of your experience *</FormLabel>
            <Textarea
              placeholder="What did you love about the car? Was there anything that could be improved? Your review will help other customers make better decisions..."
              value={formData.comment}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, comment: e.target.value }))
              }
              required
              rows={4}
              disabled={isSubmitting}
              maxLength={500}
            />
            <CharCount>{formData.comment.length}/500</CharCount>
          </CommentSection>

          <SubmitButton
            type="submit"
            disabled={isSubmitting || !formData.comment.trim()}
            $variant="primary"
          >
            <FaCheckCircle />
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </SubmitButton>
        </ReviewForm>
      )}

      {/* Review Filters */}
      <FilterTabs>
        <FilterTab
          $active={activeFilter === "all"}
          onClick={() => setActiveFilter("all")}
        >
          All Reviews ({reviews.length})
        </FilterTab>
        {[5, 4, 3, 2, 1].map((rating) => (
          <FilterTab
            key={rating}
            $active={activeFilter === rating.toString()}
            onClick={() => setActiveFilter(rating.toString())}
          >
            {rating} ★ ({reviews.filter((r) => r.rating === rating).length})
          </FilterTab>
        ))}
      </FilterTabs>

      {/* Reviews List */}
      <ReviewsList>
        {filteredReviews.length === 0 ? (
          <EmptyState>
            <NoReviewsIcon>💬</NoReviewsIcon>
            <EmptyTitle>No reviews yet</EmptyTitle>
            <EmptyText>
              Be the first to share your experience with this vehicle
            </EmptyText>
          </EmptyState>
        ) : (
          filteredReviews.map((review) => { 
            

            return (<ReviewCard key={review._id}>
              <ReviewHeader>
                <UserInfo>
                  <UserAvatar>
                    {review.user?.avatar ? (
                      <img src={review.user.avatar} alt={review.user.name} />
                    ) : (
                      <FaUser />
                    )}
                  </UserAvatar>
                  <div>
                    <UserName>{review.user?.fullName || "Anonymous User"}</UserName>
                    <ReviewDate>
                      <FaCalendar />
                      {new Date(review.createdAt).toLocaleDateString()}
                      {review.verified && (
                        <VerifiedBadge>
                          <FaCheckCircle /> Verified Rental
                        </VerifiedBadge>
                      )}
                    </ReviewDate>
                  </div>
                </UserInfo>
                <ReviewRating>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} $filled={star <= review.rating} $small />
                  ))}
                </ReviewRating>
              </ReviewHeader>

              <ReviewComment>{review.comment}</ReviewComment>

              {review.features && review.features.length > 0 && (
                <ReviewFeatures>
                  {review.features.map((feature) => (
                    <FeatureBadge key={feature}>{feature}</FeatureBadge>
                  ))}
                </ReviewFeatures>
              )}

              {review.photos && review.photos.length > 0 && (
                <ReviewPhotos>
                  <PhotoLabel>
                    <FaImages /> Photos
                  </PhotoLabel>
                  <PhotoGrid>
                    {review.photos.map((photo, index) => (
                      <Photo
                        key={index}
                        src={photo}
                        alt={`Review photo ${index + 1}`}
                      />
                    ))}
                  </PhotoGrid>
                </ReviewPhotos>
              )}
            </ReviewCard>)}
          )
        )}
      </ReviewsList>

      {/* Call to Action for users who haven't booked */}
      {!userHasBooked && reviews.length > 0 && (
        <CTASection>
          <CTACard>
            <CTAIcon>🚗</CTAIcon>
            <CTAContent>
              <CTATitle>Experience this Mercedes-Benz for yourself</CTATitle>
              <CTADescription>
                Book now and share your own review after your trip
              </CTADescription>
            </CTAContent>
            <CTAButton href={`/booking/${modelId}`} $variant="primary">
              Book This Car
            </CTAButton>
          </CTACard>
        </CTASection>
      )}
    </ReviewSectionWrapper>
  );
};

export default ReviewSection;

// Animations
const fadeIn = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

const slideIn = keyframes`
  from { 
    transform: translateX(-10px); 
    opacity: 0; 
  }
  to { 
    transform: translateX(0); 
    opacity: 1; 
  }
`;

// Styled Components using Global Styles
const ReviewSectionWrapper = styled.section`
  margin: var(--space-2xl) 0;
  animation: ${fadeIn} 0.6s ease-out;
  font-family: var(--font-body);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xl);
  flex-wrap: wrap;
  gap: var(--space-lg);

  @media ${devices.md} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h2`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  font-size: var(--text-3xl);
  color: var(--text-primary);
  margin: 0;
  font-weight: var(--font-bold);
  font-family: var(--font-heading);

  @media ${devices.sm} {
    font-size: var(--text-2xl);
  }
`;

const StarIcon = styled(FaStar)`
  color: var(--warning);
  font-size: var(--text-2xl);
`;

const ReviewCount = styled.span`
  font-size: var(--text-lg);
  color: var(--text-muted);
  font-weight: var(--font-normal);
`;

const AddReviewButton = styled(PrimaryButton)`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  white-space: nowrap;

  @media ${devices.sm} {
    width: 100%;
    justify-content: center;
  }
`;

const ReviewStats = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-2xl);
  background: var(--gray-50);
  padding: var(--space-2xl);
  border-radius: var(--radius-xl);
  margin-bottom: var(--space-xl);

  @media ${devices.md} {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
    padding: var(--space-xl);
  }

  @media ${devices.sm} {
    padding: var(--space-lg);
  }
`;

const AverageRating = styled.div`
  text-align: center;
`;

const RatingValue = styled.div`
  font-size: var(--text-5xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  line-height: 1;
  font-family: var(--font-heading);

  @media ${devices.sm} {
    font-size: var(--text-4xl);
  }
`;

const Stars = styled.div`
  display: flex;
  gap: var(--space-xs);
  justify-content: center;
  margin: var(--space-md) 0;
`;

const Star = styled.div`
  color: ${(props) => (props.$filled ? "var(--warning)" : "var(--gray-300)")};
  font-size: ${(props) =>
    props.$small ? "var(--text-base)" : "var(--text-xl)"};
`;

const RatingText = styled.div`
  color: var(--text-muted);
  font-size: var(--text-sm);
`;

const RatingBars = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  justify-content: center;
`;

const RatingBar = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`;

const StarCount = styled.span`
  font-size: var(--text-sm);
  color: var(--text-muted);
  width: 40px;
`;

const BarContainer = styled.div`
  flex: 1;
  background: var(--gray-200);
  height: 8px;
  border-radius: var(--radius-sm);
  overflow: hidden;
`;

const BarFill = styled.div`
  background: var(--warning);
  height: 100%;
  width: ${(props) => props.$percentage}%;
  transition: width var(--transition-normal);
`;

const BarCount = styled.span`
  font-size: var(--text-sm);
  color: var(--text-muted);
  width: 30px;
  text-align: right;
`;

const ReviewForm = styled.form`
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-xl);
  padding: var(--space-2xl);
  margin-bottom: var(--space-xl);
  box-shadow: var(--shadow-md);
  animation: ${slideIn} 0.3s ease-out;

  @media ${devices.sm} {
    padding: var(--space-xl);
  }
`;

const FormHeader = styled.div`
  margin-bottom: var(--space-xl);
`;

const FormTitle = styled.h3`
  margin: 0 0 var(--space-sm) 0;
  color: var(--text-primary);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  font-family: var(--font-heading);
`;

const FormDescription = styled.p`
  margin: 0;
  color: var(--text-muted);
  font-size: var(--text-base);
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: var(--space-md);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  font-family: var(--font-body);
`;

const RatingSelection = styled.div`
  margin-bottom: var(--space-xl);
`;

const StarRating = styled.div`
  display: flex;
  gap: var(--space-sm);
`;

const StarButton = styled.button`
  background: none;
  border: none;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  font-size: var(--text-2xl);
  color: ${(props) => (props.$active ? "var(--warning)" : "var(--gray-300)")};
  transition: all var(--transition-fast);
  padding: var(--space-sm);
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};

  &:hover {
    transform: ${(props) => (props.disabled ? "none" : "scale(1.2)")};
  }
`;

const FeatureSelection = styled.div`
  margin-bottom: var(--space-xl);
`;

const FeatureGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
`;

const FeatureTag = styled.button`
  padding: var(--space-sm) var(--space-md);
  border: 2px solid
    ${(props) => (props.$selected ? "var(--primary)" : "var(--gray-200)")};
  background: ${(props) =>
    props.$selected ? "var(--primary)" : "var(--white)"};
  color: ${(props) =>
    props.$selected ? "var(--white)" : "var(--text-primary)"};
  border-radius: var(--radius-full);
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all var(--transition-normal);
  font-size: var(--text-sm);
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
  font-family: var(--font-body);

  &:hover {
    border-color: ${(props) =>
      props.disabled ? "var(--gray-200)" : "var(--primary)"};
  }
`;

const CommentSection = styled.div`
  margin-bottom: var(--space-xl);
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: var(--space-md);
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  resize: vertical;
  transition: border-color var(--transition-normal);
  font-family: var(--font-body);

  &:focus {
    outline: none;
    border-color: var(--primary);
  }

  &:disabled {
    background-color: var(--gray-50);
    cursor: not-allowed;
  }
`;

const CharCount = styled.div`
  text-align: right;
  color: var(--text-muted);
  font-size: var(--text-xs);
  margin-top: var(--space-sm);
`;

const SubmitButton = styled(PrimaryButton)`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  width: 100%;
  justify-content: center;
`;

const FilterTabs = styled.div`
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
  flex-wrap: wrap;
`;

const FilterTab = styled.button`
  padding: var(--space-md) var(--space-lg);
  border: 2px solid
    ${(props) => (props.$active ? "var(--primary)" : "var(--gray-200)")};
  background: ${(props) => (props.$active ? "var(--primary)" : "var(--white)")};
  color: ${(props) => (props.$active ? "var(--white)" : "var(--text-muted)")};
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-normal);
  font-weight: var(--font-medium);
  font-family: var(--font-body);

  &:hover {
    border-color: var(--primary);
  }

  @media ${devices.sm} {
    padding: var(--space-sm) var(--space-md);
    font-size: var(--text-sm);
  }
`;

const ReviewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  
`;

const ReviewCard = styled.article`
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  animation: ${fadeIn} 0.5s ease-out;

  @media ${devices.sm} {
    padding: var(--space-lg);
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-md);

  @media ${devices.sm} {
    flex-direction: column;
    gap: var(--space-md);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`;

const UserAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: var(--text-lg);
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const UserName = styled.div`
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
  font-family: var(--font-body);
`;

const ReviewDate = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--text-muted);
  font-size: var(--text-sm);
  font-family: var(--font-body);
`;

const VerifiedBadge = styled.span`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  background: var(--success-light);
  color: var(--success-dark);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  margin-left: var(--space-sm);
  font-family: var(--font-body);
`;

const ReviewRating = styled.div`
  display: flex;
  gap: var(--space-xs);
`;

const ReviewComment = styled.p`
  color: var(--text-primary);
  line-height: 1.6;
  margin-bottom: var(--space-md);
  font-family: var(--font-body);
`;

const ReviewFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
`;

const FeatureBadge = styled.span`
  background: var(--info-light);
  color: var(--info-dark);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  font-family: var(--font-body);
`;

const ReviewPhotos = styled.div`
  margin-top: var(--space-md);
`;

const PhotoLabel = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
  font-family: var(--font-body);
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: var(--space-sm);
`;

const Photo = styled.img`
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: var(--radius-lg);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--space-2xl);
  color: var(--text-muted);
`;

const NoReviewsIcon = styled.div`
  font-size: 3rem;
  margin-bottom: var(--space-lg);
`;

const EmptyTitle = styled.h3`
  margin: 0 0 var(--space-sm) 0;
  color: var(--text-primary);
  font-family: var(--font-heading);
`;

const EmptyText = styled.p`
  margin: 0;
  color: var(--text-muted);
  font-family: var(--font-body);
`;

const LoadingState = styled.div`
  text-align: center;
  padding: var(--space-2xl);
  color: var(--text-muted);
  font-size: var(--text-lg);
  font-family: var(--font-body);
`;

const CTASection = styled.div`
  margin-top: var(--space-2xl);
  padding: var(--space-2xl);
  background: var(--gradient-subtle);
  border-radius: var(--radius-xl);
  text-align: center;
  
`;

const CTACard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 600px;
  margin: 0 auto;

  @media ${devices.md} {
    flex-direction: column;
    gap: var(--space-xl);
  }
`;

const CTAIcon = styled.div`
  font-size: 3rem;
`;

const CTAContent = styled.div`
  flex: 1;
  text-align: left;
  margin: 0 var(--space-xl);

  @media ${devices.md} {
    text-align: center;
    margin: 0;
  }
`;

const CTATitle = styled.h3`
  margin: 0 0 var(--space-sm) 0;
  color: var(--text-primary);
  font-family: var(--font-heading);
`;

const CTADescription = styled.p`
  margin: 0;
  color: var(--text-muted);
  font-family: var(--font-body);
`;

const CTAButton = styled(PrimaryButton)`
  white-space: nowrap;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  @media ${devices.sm} {
    width: 100%;
  }
`;
