// ModelPage.js (modern redesign with driver selection)
import React, { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Thumbs,
  Autoplay,
  EffectFade,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/effect-fade";
import { useGetCarById } from "../hooks/useCar";
import { useMyDrivers } from "../hooks/useDriver";

import BookingForm from "../components/forms/BookingForm";
import ReviewSection from "../components/ReviewSection";
import ModelSideTab from "../components/ModelSideTab";

// Modern animations

const ModelPage = () => {
  const { modelId } = useParams();
  const { data: carData, isLoading } = useGetCarById(modelId);
  const { data: myDrivers } = useMyDrivers();
  const drivers = useMemo(() => myDrivers?.data || [], [myDrivers]);
  const car = useMemo(() => carData?.data || null, [carData]);

  // const { data: reviewData } = useGetCarReview(car?._id);
  // const reviews = useMemo(() => reviewData?.data || null, [reviewData]);

  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 968);

  useEffect(() => {
    // Check bookmarks from localStorage
    const bookmarks = JSON.parse(localStorage.getItem("carBookmarks") || "[]");
    setIsBookmarked(bookmarks.includes(modelId));

    // Handle resize events
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 968);
      // Auto-collapse on resize to larger screens
      if (window.innerWidth > 968) {
        setIsMobileExpanded(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [modelId]);

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem("carBookmarks") || "[]");
    let newBookmarks;

    if (isBookmarked) {
      newBookmarks = bookmarks.filter((id) => id !== modelId);
    } else {
      newBookmarks = [...bookmarks, modelId];
    }

    localStorage.setItem("carBookmarks", JSON.stringify(newBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  const toggleMobileExpand = () => {
    if (isMobile) {
      setIsMobileExpanded(!isMobileExpanded);
    }
  };

  if (isLoading) {
    return (
      <LoadingWrapper>
        <LoadingSpinner />
        <p>Loading car details...</p>
      </LoadingWrapper>
    );
  }

  if (!car) return <NotFound>Car not found.</NotFound>;

  // Booking Card Content Component to avoid duplication
  const BookingCardContent = () => (
    <>
      <BookingHeader
        onClick={isMobile ? toggleMobileExpand : undefined}
        isMobile={isMobile}
        isMobileExpanded={isMobileExpanded}
      >
        <div>
          <h3>🚗 Book This Car</h3>
          <PriceHighlight>${car.pricePerDay}/day</PriceHighlight>
        </div>
        {isMobile && (
          <MobileExpandIcon>{isMobileExpanded ? "▼" : "▲"}</MobileExpandIcon>
        )}
      </BookingHeader>

      {car.status === "available" ? (
        <>
          <AvailabilityBadge available={true}>
            ✅ Available for booking
          </AvailabilityBadge>
          <BookingForm car={car} drivers={drivers} />
          <BookingNote>
            💡 Free cancellation up to 24 hours before pickup
          </BookingNote>
        </>
      ) : (
        <NotAvailable>
          <NotAvailableIcon>⏸️</NotAvailableIcon>
          <h3>Currently Unavailable</h3>
          <p>
            This car is <strong>{car.status}</strong>. Check back later!
          </p>
          <NotifyButton>🔔 Notify me when available</NotifyButton>
        </NotAvailable>
      )}
    </>
  );

  return (
    <PageWrapper>
      {/* Modern Header with Actions */}
      <HeaderSection>
        <TitleWrapper>
          <Title>{car.name}</Title>
          <CarBadges>
            <StatusBadge status={car.status}>
              {car.status.toUpperCase()}
            </StatusBadge>
            <RatingBadge>⭐ {car.rating || "4.8"} / 5</RatingBadge>
          </CarBadges>
        </TitleWrapper>

        <ActionButtons>
          <BookmarkButton onClick={handleBookmark} isBookmarked={isBookmarked}>
            {isBookmarked ? "❤️ Bookmarked" : "🤍 Bookmark"}
          </BookmarkButton>
          <ShareButton>📤 Share</ShareButton>
        </ActionButtons>
      </HeaderSection>

      {/* Quick Stats Bar */}
      <StatsBar>
        <StatItem>
          <StatValue>${car.pricePerDay}</StatValue>
          <StatLabel>Per day</StatLabel>
        </StatItem>
        <StatDivider />
        <StatItem>
          <StatValue>{car.seats || 5}</StatValue>
          <StatLabel>Seats</StatLabel>
        </StatItem>
        <StatDivider />
        <StatItem>
          <StatValue>{car.fuelType || "Petrol"}</StatValue>
          <StatLabel>Fuel</StatLabel>
        </StatItem>
        <StatDivider />
        <StatItem>
          <StatValue>{car.transmission || "Automatic"}</StatValue>
          <StatLabel>Transmission</StatLabel>
        </StatItem>
      </StatsBar>

      <ContentWrapper>
        <LeftSection>
          {/* Enhanced Image Slider */}
          <SliderWrapper>
            <MainSwiper
              modules={[Navigation, Pagination, Thumbs, Autoplay, EffectFade]}
              navigation
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              thumbs={{ swiper: thumbsSwiper }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              effect="fade"
              loop={true}
              className="main-swiper"
            >
              {car.images.map((img, i) => (
                <SwiperSlide key={i}>
                  <MainImage
                    src={img}
                    alt={`${car.name} ${i + 1}`}
                    onError={(e) => {
                      e.target.src = `https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop&${i}`;
                    }}
                  />
                </SwiperSlide>
              ))}
            </MainSwiper>

            {/* Enhanced Thumbnail Slider */}
            <ThumbsWrapper>
              <Swiper
                onSwiper={setThumbsSwiper}
                modules={[Thumbs]}
                spaceBetween={12}
                slidesPerView={4}
                watchSlidesProgress
                freeMode={true}
                className="thumbs-swiper"
              >
                {car.images.map((img, i) => (
                  <SwiperSlide key={i}>
                    <ThumbImage
                      src={img}
                      alt={`thumb-${i}`}
                      onError={(e) => {
                        e.target.src = `https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&h=150&fit=crop&${i}`;
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </ThumbsWrapper>
          </SliderWrapper>
          {/* Enhanced Booking Card - Sticky on desktop, bottom sheet on mobile */}
          {isMobile ? (
            <MobileStickyContainer isExpanded={isMobileExpanded}>
              <MobileBookingCard
                isExpanded={isMobileExpanded}
                onClick={toggleMobileExpand}
              >
                <BookingCardContent />
              </MobileBookingCard>
            </MobileStickyContainer>
          ) : (
            <DesktopBookingCard>
              <BookingCardContent />
            </DesktopBookingCard>
          )}
        </LeftSection>

        {/* Enhanced Details Section with Tabs */}
        <ModelSideTab car={car} modelId={modelId} />
      </ContentWrapper>

      {/* Enhanced Review Section */}
      <Section>
        <SectionTitle>💬 Customer Reviews & Ratings</SectionTitle>
        <ReviewSection modelId={modelId} />
        {/* <CarReviewPage carId={modelId} /> */}
      </Section>

      {/* Similar Cars Section */}
      <Section>
        <SectionTitle>🔍 Similar Vehicles</SectionTitle>
        <SimilarCarsGrid>
          <SimilarCarCard>
            <SimilarCarImage src={car.images[0]} />
            <SimilarCarInfo>
              <h4>Similar {car.name}</h4>
              <p>${car.pricePerDay - 15}/day</p>
              <SmallBadge>Popular</SmallBadge>
            </SimilarCarInfo>
          </SimilarCarCard>

          <SimilarCarCard>
            <SimilarCarImage src={car.images[1] || car.images[0]} />
            <SimilarCarInfo>
              <h4>Premium {car.name}</h4>
              <p>${car.pricePerDay + 25}/day</p>
              <SmallBadge>Luxury</SmallBadge>
            </SimilarCarInfo>
          </SimilarCarCard>
        </SimilarCarsGrid>
      </Section>
    </PageWrapper>
  );
};

export default ModelPage;
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Modern Styled Components
const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  animation: ${fadeInUp} 0.6s ease-out;

  @media (max-width: 768px) {
    margin: 1rem auto;
    padding: 0 0.5rem;
    padding-bottom: 100px; /* Space for mobile sticky booking form */
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 1rem;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #3b82f6;
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

const NotFound = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  font-size: 1.2rem;
  color: #6b7280;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const TitleWrapper = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: clamp(2rem, 4vw, 3rem);
  color: #1f2937;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
  line-height: 1.2;
`;

const CarBadges = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const StatusBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${(props) =>
    props.status === "available"
      ? "#dcfce7"
      : props.status === "unavailable"
      ? "#fecaca"
      : "#e5e7eb"};
  color: ${(props) =>
    props.status === "available"
      ? "#166534"
      : props.status === "unavailable"
      ? "#991b1b"
      : "#6b7280"};
`;

const RatingBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: #fef3c7;
  color: #92400e;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const BookmarkButton = styled.button`
  padding: 0.75rem 1.25rem;
  border: 2px solid ${(props) => (props.isBookmarked ? "#ef4444" : "#d1d5db")};
  background: ${(props) => (props.isBookmarked ? "#ef4444" : "white")};
  color: ${(props) => (props.isBookmarked ? "white" : "#374151")};
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ShareButton = styled.button`
  padding: 0.75rem 1.25rem;
  border: 2px solid #3b82f6;
  background: white;
  color: #3b82f6;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background: #3b82f6;
    color: white;
    transform: translateY(-2px);
  }
`;

const StatsBar = styled.div`
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  color: white;
  animation: ${scaleIn} 0.6s ease-out;
`;

const StatItem = styled.div`
  flex: 1;
  text-align: center;
  padding: 0 1rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

const StatDivider = styled.div`
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.3);
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 3rem;
  align-items: flex-start;
  min-height: 100vh;

  @media (max-width: 968px) {
    flex-direction: column;
    gap: 1.5rem;
    min-height: auto;
  }
`;
const LeftSection = styled.div`
  flex: 1 1 60%;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  animation: ${fadeInUp} 0.8s ease-out;

  @media (max-width: 968px) {
    order: 2;
  }
`;

const SliderWrapper = styled.div`
  /* flex: 1 1 60%; */
  min-width: 300px;
  animation: ${fadeInUp} 0.8s ease-out;

  @media (max-width: 968px) {
    order: 1;
  }
`;

const MainSwiper = styled(Swiper)`
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);

  .swiper-button-next,
  .swiper-button-prev {
    color: white;
    background: rgba(0, 0, 0, 0.5);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    &:after {
      font-size: 1.2rem;
    }
  }
`;

const MainImage = styled.img`
  width: 100%;
  height: 500px;
  object-fit: cover;
  display: block;

  @media (max-width: 768px) {
    height: 350px;
  }
`;

const ThumbsWrapper = styled.div`
  margin-top: 1rem;
`;

const ThumbImage = styled.img`
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #3b82f6;
    transform: scale(1.05);
  }

  .swiper-slide-thumb-active & {
    border-color: #3b82f6;
  }
`;

// Desktop Booking Card (Sticky)
const DesktopBookingCard = styled.div`
  width: 100%;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  animation: ${scaleIn} 0.6s ease-out 0.2s both;
  position: sticky;
  top: 2rem;
  z-index: 10;
  transition: all 0.3s ease;
  flex: 1 1 35%;
  min-width: 280px;
  align-self: flex-start;

  @media (max-width: 968px) {
    display: none;
  }
`;

// Mobile Booking Card (Bottom Sheet)
const MobileStickyContainer = styled.div`
  width: 100%;
  background: red;
  @media (max-width: 968px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    border-top: 1px solid #e5e7eb;
    padding: 0;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    animation: ${slideUp} 0.3s ease-out;
  }

  @media (min-width: 969px) {
    display: none;
  }
`;

const MobileBookingCard = styled.div`
  @media (max-width: 968px) {
    background: white;
    border-radius: 20px 20px 0 0;
    padding: ${(props) => (props.isExpanded ? "1.5rem" : "1rem")};
    max-height: ${(props) => (props.isExpanded ? "80vh" : "80px")};
    overflow: ${(props) => (props.isExpanded ? "auto" : "hidden")};
    transition: all 0.3s ease;
    cursor: pointer;

    /* Custom scrollbar for mobile */
    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 2px;
    }
  }

  @media (min-width: 969px) {
    display: none;
  }
`;

const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) =>
    props.isMobile && !props.isMobileExpanded ? "0" : "1.5rem"};
  cursor: ${(props) => (props.isMobile ? "pointer" : "default")};

  h3 {
    margin: 0;
    color: #1f2937;
    font-size: 1.4rem;

    @media (max-width: 968px) {
      font-size: 1.2rem;
    }
  }

  div {
    display: flex;
    align-items: center;
    gap: 1rem;

    @media (max-width: 480px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
  }
`;

const MobileExpandIcon = styled.span`
  font-size: 1.2rem;
  color: #6b7280;
  margin-left: auto;
  transition: transform 0.3s ease;
`;

const PriceHighlight = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: #3b82f6;
  animation: ${pulse} 2s infinite;

  @media (max-width: 968px) {
    font-size: 1.5rem;
  }
`;

const AvailabilityBadge = styled.div`
  padding: 0.75rem 1rem;
  background: ${(props) => (props.available ? "#dcfce7" : "#fecaca")};
  color: ${(props) => (props.available ? "#166534" : "#991b1b")};
  border-radius: 8px;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const BookingNote = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: #f0f9ff;
  border-radius: 8px;
  color: #0369a1;
  font-size: 0.9rem;
  text-align: center;
`;

const NotAvailable = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  color: #6b7280;

  h3 {
    margin: 1rem 0 0.5rem 0;
    color: #ef4444;
  }
`;

const NotAvailableIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const NotifyButton = styled.button`
  padding: 1rem 2rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: #2563eb;
    transform: translateY(-2px);
  }
`;

const Section = styled.section`
  margin: 4rem 0;
  animation: ${fadeInUp} 0.8s ease-out;

  @media (max-width: 968px) {
    margin: 3rem 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: #1f2937;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const SimilarCarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const SimilarCarCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const SimilarCarImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const SimilarCarInfo = styled.div`
  padding: 1.5rem;

  h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.2rem;
    color: #1f2937;
  }

  p {
    margin: 0 0 1rem 0;
    font-size: 1.3rem;
    font-weight: 700;
    color: #3b82f6;
  }
`;

const SmallBadge = styled.span`
  padding: 0.25rem 0.75rem;
  background: #f0f9ff;
  color: #0369a1;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;
