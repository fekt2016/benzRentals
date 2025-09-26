import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import {
  FaStar,
  FaUser,
  FaCalendar,
  FaCheckCircle,
  FaEdit,
  FaImages,
} from "react-icons/fa";

// Mock data - replace with actual API calls
const MOCK_REVIEWS = [
  {
    id: 1,
    user: { name: "Michael Rodriguez", avatar: null },
    rating: 5,
    comment:
      "Absolutely loved the Mercedes S-Class! The ride was smooth and the service was exceptional. Will definitely rent again!",
    date: "2024-01-15",
    verified: true,
    photos: [],
    features: ["Comfort", "Performance", "Cleanliness"],
  },
  {
    id: 2,
    user: { name: "Sarah Johnson", avatar: null },
    rating: 4,
    comment:
      "Great car for our anniversary trip. The interior was pristine and the fuel efficiency was better than expected.",
    date: "2024-01-10",
    verified: true,
    photos: [],
    features: ["Interior", "Fuel Efficiency"],
  },
];

const ReviewSection = ({ carId, userId }) => {
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [showForm, setShowForm] = useState(false);
  const [userHasBooked, setUserHasBooked] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: "",
    photos: [],
    features: [],
  });
  const [activeFilter, setActiveFilter] = useState("all");

  // Check if user has booked this car (replace with actual API call)
  useEffect(() => {
    // Simulate API call to check user bookings
    const checkUserBooking = async () => {
      // Replace with actual API call
      const hasBooked = true; // Mock data - user has booked
      const hasReviewed = false; // Mock data - user hasn't reviewed yet

      setUserHasBooked(hasBooked);
      setUserHasReviewed(hasReviewed);
      setShowForm(hasBooked && !hasReviewed);
    };

    checkUserBooking();
  }, [carId, userId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    // Simulate API call
    const newReview = {
      id: reviews.length + 1,
      user: { name: "Current User", avatar: null },
      rating: formData.rating,
      comment: formData.comment,
      date: new Date().toISOString().split("T")[0],
      verified: true,
      photos: formData.photos,
      features: formData.features,
    };

    setReviews((prev) => [newReview, ...prev]);
    setFormData({ rating: 5, comment: "", photos: [], features: [] });
    setShowForm(false);
    setUserHasReviewed(true);
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

  const filteredReviews =
    activeFilter === "all"
      ? reviews
      : reviews.filter((review) => review.rating === parseInt(activeFilter));

  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
    percentage:
      (reviews.filter((r) => r.rating === stars).length / reviews.length) * 100,
  }));

  return (
    <ReviewSectionWrapper>
      <Header>
        <Title>
          <StarIcon /> Customer Reviews
          <ReviewCount>({reviews.length} reviews)</ReviewCount>
        </Title>

        {userHasBooked && !userHasReviewed && (
          <AddReviewButton onClick={() => setShowForm(!showForm)}>
            <FaEdit /> {showForm ? "Cancel Review" : "Write a Review"}
          </AddReviewButton>
        )}
      </Header>

      <ReviewStats>
        <AverageRating>
          <RatingValue>{averageRating.toFixed(1)}</RatingValue>
          <Stars>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} filled={star <= Math.round(averageRating)} />
            ))}
          </Stars>
          <RatingText>Based on {reviews.length} reviews</RatingText>
        </AverageRating>

        <RatingBars>
          {ratingDistribution.map(({ stars, count, percentage }) => (
            <RatingBar key={stars}>
              <StarCount>{stars} ★</StarCount>
              <BarContainer>
                <BarFill percentage={percentage} />
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
            <h3>Share Your Experience</h3>
            <p>Tell others about your trip with this Mercedes-Benz</p>
          </FormHeader>

          <RatingSelection>
            <label>Overall Rating *</label>
            <StarRating>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarButton
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  active={star <= formData.rating}
                >
                  <FaStar />
                </StarButton>
              ))}
            </StarRating>
          </RatingSelection>

          <FeatureSelection>
            <label>What stood out? (Select all that apply)</label>
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
                  selected={formData.features.includes(feature)}
                  onClick={() => handleFeatureToggle(feature)}
                >
                  {feature}
                </FeatureTag>
              ))}
            </FeatureGrid>
          </FeatureSelection>

          <CommentSection>
            <label>Share details of your experience *</label>
            <Textarea
              placeholder="What did you love about the car? Was there anything that could be improved? Your review will help other customers make better decisions..."
              value={formData.comment}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, comment: e.target.value }))
              }
              required
              rows={4}
            />
            <CharCount>{formData.comment.length}/500</CharCount>
          </CommentSection>

          <SubmitButton type="submit">
            <FaCheckCircle /> Submit Review
          </SubmitButton>
        </ReviewForm>
      )}

      {/* Review Filters */}
      <FilterTabs>
        <FilterTab
          active={activeFilter === "all"}
          onClick={() => setActiveFilter("all")}
        >
          All Reviews ({reviews.length})
        </FilterTab>
        {[5, 4, 3, 2, 1].map((rating) => (
          <FilterTab
            key={rating}
            active={activeFilter === rating.toString()}
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
            <h3>No reviews yet</h3>
            <p>Be the first to share your experience with this vehicle</p>
          </EmptyState>
        ) : (
          filteredReviews.map((review) => (
            <ReviewCard key={review.id}>
              <ReviewHeader>
                <UserInfo>
                  <UserAvatar>
                    {review.user.avatar ? (
                      <img src={review.user.avatar} alt={review.user.name} />
                    ) : (
                      <FaUser />
                    )}
                  </UserAvatar>
                  <div>
                    <UserName>{review.user.name}</UserName>
                    <ReviewDate>
                      <FaCalendar />{" "}
                      {new Date(review.date).toLocaleDateString()}
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
                    <Star key={star} filled={star <= review.rating} small />
                  ))}
                </ReviewRating>
              </ReviewHeader>

              <ReviewComment>{review.comment}</ReviewComment>

              {review.features.length > 0 && (
                <ReviewFeatures>
                  {review.features.map((feature) => (
                    <FeatureBadge key={feature}>{feature}</FeatureBadge>
                  ))}
                </ReviewFeatures>
              )}

              {review.photos.length > 0 && (
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
            </ReviewCard>
          ))
        )}
      </ReviewsList>

      {/* Call to Action for users who haven't booked */}
      {!userHasBooked && reviews.length > 0 && (
        <CTASection>
          <CTACard>
            <CTAIcon>🚗</CTAIcon>
            <CTAContent>
              <h3>Experience this Mercedes-Benz for yourself</h3>
              <p>Book now and share your own review after your trip</p>
            </CTAContent>
            <CTAButton href={`/booking/${carId}`}>Book This Car</CTAButton>
          </CTACard>
        </CTASection>
      )}
    </ReviewSectionWrapper>
  );
};

export default ReviewSection;

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(-10px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

// Styled Components
const ReviewSectionWrapper = styled.section`
  margin: 4rem 0;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h2`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 2rem;
  color: #1f2937;
  margin: 0;
`;

const StarIcon = styled(FaStar)`
  color: #fbbf24;
  font-size: 1.8rem;
`;

const ReviewCount = styled.span`
  font-size: 1rem;
  color: #6b7280;
  font-weight: normal;
`;

const AddReviewButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
  }
`;

const ReviewStats = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 3rem;
  background: #f8fafc;
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const AverageRating = styled.div`
  text-align: center;
`;

const RatingValue = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
`;

const Stars = styled.div`
  display: flex;
  gap: 0.25rem;
  justify-content: center;
  margin: 0.5rem 0;
`;

const Star = styled.div`
  color: ${(props) => (props.filled ? "#fbbf24" : "#d1d5db")};
  font-size: ${(props) => (props.small ? "1rem" : "1.5rem")};
`;

const RatingText = styled.div`
  color: #6b7280;
  font-size: 0.9rem;
`;

const RatingBars = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
`;

const RatingBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StarCount = styled.span`
  font-size: 0.9rem;
  color: #6b7280;
  width: 40px;
`;

const BarContainer = styled.div`
  flex: 1;
  background: #e5e7eb;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
`;

const BarFill = styled.div`
  background: #fbbf24;
  height: 100%;
  width: ${(props) => props.percentage}%;
  transition: width 0.3s ease;
`;

const BarCount = styled.span`
  font-size: 0.9rem;
  color: #6b7280;
  width: 30px;
  text-align: right;
`;

const ReviewForm = styled.form`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  animation: ${slideIn} 0.3s ease-out;
`;

const FormHeader = styled.div`
  margin-bottom: 2rem;

  h3 {
    margin: 0 0 0.5rem 0;
    color: #1f2937;
  }

  p {
    margin: 0;
    color: #6b7280;
  }
`;

const RatingSelection = styled.div`
  margin-bottom: 2rem;

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
  font-size: 2rem;
  color: ${(props) => (props.active ? "#fbbf24" : "#d1d5db")};
  transition: all 0.2s ease;
  padding: 0.5rem;

  &:hover {
    transform: scale(1.2);
  }
`;

const FeatureSelection = styled.div`
  margin-bottom: 2rem;

  label {
    display: block;
    margin-bottom: 1rem;
    font-weight: 600;
    color: #374151;
  }
`;

const FeatureGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const FeatureTag = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid ${(props) => (props.selected ? "#3b82f6" : "#e5e7eb")};
  background: ${(props) => (props.selected ? "#3b82f6" : "white")};
  color: ${(props) => (props.selected ? "white" : "#374151")};
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    border-color: #3b82f6;
  }
`;

const CommentSection = styled.div`
  margin-bottom: 2rem;

  label {
    display: block;
    margin-bottom: 1rem;
    font-weight: 600;
    color: #374151;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const CharCount = styled.div`
  text-align: right;
  color: #6b7280;
  font-size: 0.8rem;
  margin-top: 0.5rem;
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
  }
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterTab = styled.button`
  padding: 0.75rem 1.5rem;
  border: 2px solid ${(props) => (props.active ? "#3b82f6" : "#e5e7eb")};
  background: ${(props) => (props.active ? "#3b82f6" : "white")};
  color: ${(props) => (props.active ? "white" : "#6b7280")};
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    border-color: #3b82f6;
  }
`;

const ReviewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ReviewCard = styled.article`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  animation: ${fadeIn} 0.5s ease-out;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 1.2rem;
`;

const UserName = styled.div`
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
`;

const ReviewDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.9rem;
`;

const VerifiedBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: #d1fae5;
  color: #065f46;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  margin-left: 0.5rem;
`;

const ReviewRating = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const ReviewComment = styled.p`
  color: #374151;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const ReviewFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const FeatureBadge = styled.span`
  background: #f0f9ff;
  color: #0369a1;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const ReviewPhotos = styled.div`
  margin-top: 1rem;
`;

const PhotoLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.5rem;
`;

const Photo = styled.img`
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
`;

const NoReviewsIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const CTASection = styled.div`
  margin-top: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 16px;
  text-align: center;
`;

const CTACard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const CTAIcon = styled.div`
  font-size: 3rem;
`;

const CTAContent = styled.div`
  flex: 1;
  text-align: left;
  margin: 0 2rem;

  @media (max-width: 768px) {
    text-align: center;
    margin: 0;
  }

  h3 {
    margin: 0 0 0.5rem 0;
    color: #1f2937;
  }

  p {
    margin: 0;
    color: #6b7280;
  }
`;

const CTAButton = styled.a`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
  }
`;
