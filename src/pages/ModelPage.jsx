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
import { useCurrentUser } from "../hooks/useAuth";

// Component Imports
import BookingForm from "../components/forms/BookingForm";
import ReviewSection from "../components/ReviewSection";
import ModelSideTab from "../components/ModelSideTab";
// import HeroSection from "../components/Sections/HeroSection";
import CarCard from "../components/Cards/CarCard";
import { PrimaryButton, SecondaryButton } from "../components/ui/Button";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

// Global Styles
import { devices } from "../styles/GlobalStyles";

// Modern animations
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

const ModelPage = () => {
  const { modelId } = useParams();
  const { data: carData, isLoading } = useGetCarById(modelId);
  const { data: myDrivers } = useMyDrivers();
  const drivers = useMemo(() => myDrivers?.data || [], [myDrivers]);
  const car = useMemo(() => carData?.data || null, [carData]);
  const { data: userData } = useCurrentUser();
  console.log("userData", userData);
  const user = useMemo(() => userData?.user || null, [userData]);

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

  // Transform car data for similar cars display
  const transformCarForCard = (carData, variant = "similar") => {
    const baseFeatures = [
      carData.transmission || "Automatic",
      carData.fuel || "Premium",
      `${carData.seats || 5} Seats`,
    ].filter(Boolean);

    const features = [...(carData.features || []), ...baseFeatures];

    return {
      id: carData._id,
      image: carData.images?.[0] || "/default-car.jpg",
      model:
        variant === "premium"
          ? `Premium ${carData.name}`
          : `Similar ${carData.name}`,
      price:
        variant === "premium"
          ? carData.pricePerDay + 25
          : carData.pricePerDay - 15,
      series: variant === "premium" ? "Luxury Edition" : "Economy Option",
      features: features.slice(0, 4), // Limit features for similar cards
    };
  };

  if (isLoading) {
    return (
      <LoadingWrapper>
        <LoadingSpinner />
        <LoadingText>Loading car details...</LoadingText>
      </LoadingWrapper>
    );
  }

  if (!car) return <NotFound>Car not found.</NotFound>;

  // Booking Card Content Component to avoid duplication
  const BookingCardContent = () => (
    <>
      <BookingHeader
        onClick={isMobile ? toggleMobileExpand : undefined}
        $isMobile={isMobile}
        $isMobileExpanded={isMobileExpanded}
      >
        <div>
          <BookingTitle>🚗 Book This Car</BookingTitle>
          <PriceHighlight>${car.pricePerDay}/day</PriceHighlight>
        </div>
        {isMobile && (
          <MobileExpandIcon>{isMobileExpanded ? "▼" : "▲"}</MobileExpandIcon>
        )}
      </BookingHeader>

      {car.status === "available" ? (
        <>
          <AvailabilityBadge $available={true}>
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
          <NotAvailableTitle>Currently Unavailable</NotAvailableTitle>
          <NotAvailableText>
            This car is <strong>{car.status}</strong>. Check back later!
          </NotAvailableText>
          <NotifyButton>🔔 Notify me when available</NotifyButton>
        </NotAvailable>
      )}
    </>
  );

  // Create similar cars data
  const similarCars = [
    transformCarForCard(car, "similar"),
    transformCarForCard(car, "premium"),
  ];

  return (
    <PageWrapper>
      {/* Modern Header with Actions */}
      <HeaderSection>
        <TitleWrapper>
          <Title>{car.name}</Title>
          <CarBadges>
            <StatusBadge $status={car.status}>
              {car.status?.toUpperCase() || "UNAVAILABLE"}
            </StatusBadge>
            <RatingBadge>⭐ {car.rating || "4.8"} / 5</RatingBadge>
          </CarBadges>
        </TitleWrapper>

        <ActionButtons>
          <BookmarkButton onClick={handleBookmark} $isBookmarked={isBookmarked}>
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
              {car.images?.map((img, i) => (
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
                {car.images?.map((img, i) => (
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
            <MobileStickyContainer $isExpanded={isMobileExpanded}>
              <MobileBookingCard
                $isExpanded={isMobileExpanded}
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
        <ReviewSection modelId={modelId} userId={user?._id} />
      </Section>

      {/* Similar Cars Section using CarCard Component */}
      <Section>
        <SectionTitle>🔍 Similar Vehicles</SectionTitle>
        <SimilarCarsGrid>
          {similarCars.map((similarCar) => {
            console.log("sim", similarCar);
            return (
              <CarCard
                key={similarCar._id}
                car={similarCar}
                showOverlay={true}
                showBookButton={true}
                className="similar-car-card"
              />
            );
          })}
        </SimilarCarsGrid>
      </Section>
    </PageWrapper>
  );
};

export default ModelPage;

// Modern Styled Components using CSS Variables from Global Styles
const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 var(--space-lg);
  animation: ${fadeInUp} 0.6s ease-out;
  font-family: var(--font-body);

  @media ${devices.lg} {
    margin: var(--space-xl) auto;
  }

  @media ${devices.md} {
    margin: var(--space-lg) auto;
    padding: 0 var(--space-md);
  }

  @media ${devices.sm} {
    margin: var(--space-md) auto;
    padding: 0 var(--space-sm);
    padding-bottom: 100px; /* Space for mobile sticky booking form */
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: var(--space-lg);
`;

const LoadingText = styled.p`
  color: var(--text-secondary);
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  font-family: var(--font-body);
`;

const NotFound = styled.div`
  text-align: center;
  padding: var(--space-2xl) var(--space-xl);
  font-size: var(--text-xl);
  color: var(--text-muted);
  font-family: var(--font-body);
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-xl);
  flex-wrap: wrap;
  gap: var(--space-lg);

  @media ${devices.md} {
    flex-direction: column;
    text-align: center;
    gap: var(--space-md);
  }
`;

const TitleWrapper = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: clamp(var(--text-3xl), 4vw, var(--text-5xl));
  color: var(--text-primary);
  margin: 0 0 var(--space-sm) 0;
  font-weight: var(--font-bold);
  line-height: 1.2;
  font-family: var(--font-heading);
`;

const CarBadges = styled.div`
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;

  @media ${devices.sm} {
    justify-content: center;
    gap: var(--space-sm);
  }
`;

const StatusBadge = styled.span`
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  background: ${(props) =>
    props.$status === "available"
      ? "var(--success-light)"
      : props.$status === "unavailable"
      ? "var(--error-light)"
      : "var(--gray-200)"};
  color: ${(props) =>
    props.$status === "available"
      ? "var(--success-dark)"
      : props.$status === "unavailable"
      ? "var(--error-dark)"
      : "var(--text-muted)"};
`;

const RatingBadge = styled.span`
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  background: var(--warning-light);
  color: var(--warning-dark);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--space-md);

  @media ${devices.sm} {
    width: 100%;
    justify-content: center;
  }
`;

const BookmarkButton = styled.button`
  padding: var(--space-md) var(--space-lg);
  border: 2px solid
    ${(props) => (props.$isBookmarked ? "var(--error)" : "var(--gray-300)")};
  background: ${(props) =>
    props.$isBookmarked ? "var(--error)" : "var(--white)"};
  color: ${(props) =>
    props.$isBookmarked ? "var(--white)" : "var(--text-primary)"};
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-weight: var(--font-semibold);
  transition: all var(--transition-normal);
  white-space: nowrap;
  font-family: var(--font-body);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  @media ${devices.sm} {
    padding: var(--space-sm) var(--space-md);
    font-size: var(--text-sm);
  }
`;

const ShareButton = styled(SecondaryButton)`
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: var(--space-sm);

  @media ${devices.sm} {
    padding: var(--space-sm) var(--space-md);
    font-size: var(--text-sm);
  }
`;

const StatsBar = styled.div`
  display: flex;
  align-items: center;
  background: var(--gradient-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  margin-bottom: var(--space-2xl);
  color: var(--white);
  animation: ${scaleIn} 0.6s ease-out;

  @media ${devices.sm} {
    padding: var(--space-lg);
    margin-bottom: var(--space-xl);
  }
`;

const StatItem = styled.div`
  flex: 1;
  text-align: center;
  padding: 0 var(--space-lg);

  @media ${devices.sm} {
    padding: 0 var(--space-sm);
  }
`;

const StatValue = styled.div`
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-xs);
  font-family: var(--font-heading);

  @media ${devices.sm} {
    font-size: var(--text-xl);
  }
`;

const StatLabel = styled.div`
  font-size: var(--text-sm);
  opacity: 0.9;
  font-family: var(--font-body);
`;

const StatDivider = styled.div`
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.3);
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2xl);
  margin-bottom: var(--space-2xl);
  align-items: flex-start;
  min-height: 100vh;

  @media ${devices.lg} {
    gap: var(--space-xl);
  }

  @media ${devices.md} {
    flex-direction: column;
    gap: var(--space-lg);
    min-height: auto;
  }
`;

const LeftSection = styled.div`
  flex: 1 1 60%;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  position: relative;
  animation: ${fadeInUp} 0.8s ease-out;

  @media ${devices.md} {
    order: 2;
    gap: var(--space-lg);
  }
`;

const SliderWrapper = styled.div`
  min-width: 300px;
  animation: ${fadeInUp} 0.8s ease-out;

  @media ${devices.md} {
    order: 1;
  }
`;

const MainSwiper = styled(Swiper)`
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg);

  .swiper-button-next,
  .swiper-button-prev {
    color: var(--white);
    background: rgba(0, 0, 0, 0.5);
    width: 50px;
    height: 50px;
    border-radius: 50%;

    &:after {
      font-size: var(--text-lg);
    }
  }
`;

const MainImage = styled.img`
  width: 100%;
  height: 500px;
  object-fit: cover;
  display: block;

  @media ${devices.md} {
    height: 400px;
  }

  @media ${devices.sm} {
    height: 300px;
  }
`;

const ThumbsWrapper = styled.div`
  margin-top: var(--space-lg);
`;

const ThumbImage = styled.img`
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: var(--radius-lg);
  border: 3px solid transparent;
  cursor: pointer;
  transition: all var(--transition-normal);

  &:hover {
    border-color: var(--primary);
    transform: scale(1.05);
  }

  .swiper-slide-thumb-active & {
    border-color: var(--primary);
  }
`;

// Desktop Booking Card (Sticky)
const DesktopBookingCard = styled.div`
  width: 100%;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-xl);
  padding: var(--space-2xl);
  box-shadow: var(--shadow-lg);
  animation: ${scaleIn} 0.6s ease-out 0.2s both;
  position: sticky;
  top: var(--space-xl);
  z-index: 10;
  transition: all var(--transition-normal);
  flex: 1 1 35%;
  min-width: 280px;
  align-self: flex-start;

  @media ${devices.lg} {
    display: none;
  }
`;

// Mobile Booking Card (Bottom Sheet)
const MobileStickyContainer = styled.div`
  @media ${devices.lg} {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--white);
    border-top: 1px solid var(--gray-200);
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
  @media ${devices.lg} {
    background: var(--white);
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    padding: ${(props) =>
      props.$isExpanded ? "var(--space-xl)" : "var(--space-lg)"};
    max-height: ${(props) => (props.$isExpanded ? "80vh" : "80px")};
    overflow: ${(props) => (props.$isExpanded ? "auto" : "hidden")};
    transition: all var(--transition-normal);
    cursor: pointer;

    /* Custom scrollbar for mobile */
    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: var(--gray-100);
    }

    &::-webkit-scrollbar-thumb {
      background: var(--gray-400);
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
    props.$isMobile && !props.$isMobileExpanded ? "0" : "var(--space-xl)"};
  cursor: ${(props) => (props.$isMobile ? "pointer" : "default")};

  @media ${devices.sm} {
    margin-bottom: ${(props) =>
      props.$isMobile && !props.$isMobileExpanded ? "0" : "var(--space-lg)"};
  }

  div {
    display: flex;
    align-items: center;
    gap: var(--space-lg);

    @media ${devices.sm} {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-sm);
    }
  }
`;

const BookingTitle = styled.h3`
  margin: 0;
  color: var(--text-primary);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  font-family: var(--font-heading);

  @media ${devices.lg} {
    font-size: var(--text-lg);
  }
`;

const MobileExpandIcon = styled.span`
  font-size: var(--text-lg);
  color: var(--text-muted);
  margin-left: auto;
  transition: transform var(--transition-normal);
`;

const PriceHighlight = styled.span`
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--primary);
  animation: ${pulse} 2s infinite;
  font-family: var(--font-heading);

  @media ${devices.lg} {
    font-size: var(--text-2xl);
  }
`;

const AvailabilityBadge = styled.div`
  padding: var(--space-md) var(--space-lg);
  background: ${(props) =>
    props.$available ? "var(--success-light)" : "var(--error-light)"};
  color: ${(props) =>
    props.$available ? "var(--success-dark)" : "var(--error-dark)"};
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-xl);
  text-align: center;
  font-family: var(--font-body);
`;

const BookingNote = styled.div`
  margin-top: var(--space-lg);
  padding: var(--space-lg);
  background: var(--info-light);
  border-radius: var(--radius-lg);
  color: var(--info-dark);
  font-size: var(--text-sm);
  text-align: center;
  font-family: var(--font-body);
`;

const NotAvailable = styled.div`
  text-align: center;
  padding: var(--space-2xl) var(--space-lg);
  color: var(--text-muted);
  font-family: var(--font-body);
`;

const NotAvailableIcon = styled.div`
  font-size: 3rem;
  margin-bottom: var(--space-lg);
`;

const NotAvailableTitle = styled.h3`
  margin: var(--space-lg) 0 var(--space-sm) 0;
  color: var(--error);
  font-family: var(--font-heading);
`;

const NotAvailableText = styled.p`
  margin: 0 0 var(--space-lg) 0;
  font-family: var(--font-body);
`;

const NotifyButton = styled(PrimaryButton)`
  margin-top: var(--space-lg);
  padding: var(--space-lg) var(--space-xl);
`;

const Section = styled.section`
  margin: var(--space-2xl) 0;
  animation: ${fadeInUp} 0.8s ease-out;

  @media ${devices.lg} {
    margin: var(--space-xl) 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: var(--text-3xl);
  color: var(--text-primary);
  margin-bottom: var(--space-2xl);
  text-align: center;
  font-weight: var(--font-bold);
  font-family: var(--font-heading);

  @media ${devices.md} {
    font-size: var(--text-2xl);
    margin-bottom: var(--space-xl);
  }
`;

const SimilarCarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--space-xl);

  @media ${devices.md} {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }

  .similar-car-card {
    min-height: 500px;

    @media ${devices.sm} {
      min-height: 450px;
    }
  }
`;
