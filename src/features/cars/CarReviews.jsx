/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import styled from "styled-components";
import { useGetCarReviews } from "../cars/useReview";
import {
  FaStar,
  FaRegStar,
  FaUserCircle,
  FaCalendarAlt,
  FaQuoteLeft,
} from "react-icons/fa";

export default function CarReviews({ modelId }) {
  const { data: reviewData } = useGetCarReviews(modelId);
  const reviews = reviewData?.data || [];

  // Get only the most recent 5 reviews
  const recentReviews = reviews.slice(0, 5);

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  // Star rating component
  const StarRating = ({ rating, size = 16 }) => {
    return (
      <StarsContainer>
        {[1, 2, 3, 4, 5].map((star) =>
          star <= rating ? (
            <FaStar key={star} size={size} color="#FFD700" />
          ) : (
            <FaRegStar key={star} size={size} color="#FFD700" />
          )
        )}
      </StarsContainer>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <ReviewsContainer>
      {/* Header with overall rating */}
      <ReviewsHeader>
        <RatingSummary>
          <AverageRating>{averageRating}</AverageRating>
          <div>
            <StarRating rating={Math.round(averageRating)} size={20} />
            <RatingCount>{reviews.length} reviews</RatingCount>
          </div>
        </RatingSummary>

        <RatingBreakdown>
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = reviews.filter(
              (review) => review.rating === stars
            ).length;
            const percentage =
              reviews.length > 0 ? (count / reviews.length) * 100 : 0;

            return (
              <RatingBar key={stars}>
                <RatingLabel>{stars} stars</RatingLabel>
                <BarContainer>
                  <BarFill percentage={percentage} />
                </BarContainer>
                <RatingPercentage>{count}</RatingPercentage>
              </RatingBar>
            );
          })}
        </RatingBreakdown>
      </ReviewsHeader>

      {/* Recent Reviews List */}
      <ReviewsList>
        {recentReviews.length > 0 ? (
          recentReviews.map((review) => (
            <ReviewCard key={review._id}>
              <ReviewHeader>
                <UserInfo>
                  <UserAvatar>
                    {review.user?.avatar ? (
                      <AvatarImage
                        src={review.user.avatar}
                        alt={review.user.name}
                      />
                    ) : (
                      <FaUserCircle size={32} color="#6B7280" />
                    )}
                  </UserAvatar>
                  <UserDetails>
                    <UserName>{review.user?.name || "Anonymous User"}</UserName>
                    <ReviewDate>
                      <FaCalendarAlt size={12} />
                      {formatDate(review.createdAt)}
                    </ReviewDate>
                  </UserDetails>
                </UserInfo>
                <StarRating rating={review.rating} />
              </ReviewHeader>

              {review.title && <ReviewTitle>{review.title}</ReviewTitle>}

              <ReviewComment>
                <QuoteIcon>
                  <FaQuoteLeft size={16} color="#E5E7EB" />
                </QuoteIcon>
                {review.comment}
              </ReviewComment>

              {review.images && review.images.length > 0 && (
                <ReviewImages>
                  {review.images.slice(0, 3).map((image, index) => (
                    <ReviewImage
                      key={index}
                      src={image}
                      alt={`Review image ${index + 1}`}
                    />
                  ))}
                  {review.images.length > 3 && (
                    <MoreImages>+{review.images.length - 3}</MoreImages>
                  )}
                </ReviewImages>
              )}
            </ReviewCard>
          ))
        ) : (
          <EmptyState>
            <EmptyIcon>💬</EmptyIcon>
            <EmptyTitle>No Reviews Yet</EmptyTitle>
            <EmptyText>Be the first to review this vehicle</EmptyText>
          </EmptyState>
        )}
      </ReviewsList>

      {/* View All Reviews Button */}
      {reviews.length > 5 && (
        <ViewAllButton
          onClick={() => console.log("Navigate to full reviews page")}
        >
          View All {reviews.length} Reviews
        </ViewAllButton>
      )}
    </ReviewsContainer>
  );
}

// Modern Styled Components
const ReviewsContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 0;
  max-height: 600px;
  display: flex;
  flex-direction: column;
`;

const ReviewsHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
`;

const RatingSummary = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const AverageRating = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
`;

const RatingCount = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const RatingBreakdown = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RatingBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const RatingLabel = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  width: 60px;
`;

const BarContainer = styled.div`
  flex: 1;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
`;

const BarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
  width: ${(props) => props.percentage}%;
  border-radius: 3px;
  transition: width 0.3s ease;
`;

const RatingPercentage = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  width: 30px;
  text-align: right;
`;

const ReviewsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f3f4f6;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 2px;
  }
`;

const ReviewCard = styled.div`
  background: white;
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const UserName = styled.div`
  font-weight: 600;
  color: #1f2937;
  font-size: 0.95rem;
`;

const ReviewDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
`;

const StarsContainer = styled.div`
  display: flex;
  gap: 0.25rem;
  align-items: center;
`;

const ReviewTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
`;

const ReviewComment = styled.p`
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
  position: relative;
  padding-left: 1.5rem;
`;

const QuoteIcon = styled.span`
  position: absolute;
  left: 0;
  top: 0;
`;

const ReviewImages = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const ReviewImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const MoreImages = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
  color: #6b7280;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  color: #374151;
  margin: 0 0 0.5rem 0;
`;

const EmptyText = styled.p`
  margin: 0;
  font-size: 0.95rem;
`;

const ViewAllButton = styled.button`
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 0 0 16px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: auto;

  &:hover {
    background: linear-gradient(135deg, #1d4ed8, #1e40af);
    transform: translateY(-1px);
  }
`;
