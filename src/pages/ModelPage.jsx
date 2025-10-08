// ModelPage.js (FIXED - Header Button Alignment)
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

  const user = useMemo(() => userData?.user || null, [userData]);

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 968);
  const [imageError, setImageError] = useState({});

  // Calculate mileage-related information
  const mileageInfo = useMemo(() => {
    if (!car) return null;

    const dailyAllowance = car.mileagePolicy?.dailyAllowance || 200;
    const extraMileRate = car.mileagePolicy?.extraMileRate || 0.5;
    const unlimitedMileage = car.mileagePolicy?.unlimitedMileage || false;
    const currentMileage = car.currentMileage || 0;
    const milesUntilService =
      car.milesUntilService ||
      car.maintenance?.nextServiceMileage - currentMileage ||
      0;
    const needsService =
      car.needsService ||
      car.maintenance?.nextServiceMileage <= currentMileage ||
      false;

    return {
      dailyAllowance,
      extraMileRate,
      unlimitedMileage,
      currentMileage,
      milesUntilService,
      needsService,
      isWellMaintained: milesUntilService > 1000, // Good if more than 1000 miles until service
    };
  }, [car]);

  useEffect(() => {
    // Check bookmarks from localStorage
    const bookmarks = JSON.parse(localStorage.getItem("carBookmarks") || "[]");
    setIsBookmarked(bookmarks.includes(modelId));

    // Handle resize events
    const handleResize = () => {
      const mobile = window.innerWidth <= 968;
      setIsMobile(mobile);
      // Auto-collapse on resize to larger screens
      if (!mobile) {
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

  const handleImageError = (index) => {
    setImageError((prev) => ({ ...prev, [index]: true }));
  };

  const getFallbackImage = (index) => {
    return `https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=${
      window.innerWidth
    }&h=${Math.floor(window.innerWidth * 0.75)}&fit=crop&auto=format&${index}`;
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
      currentMileage: carData.currentMileage || 0,
      mileagePolicy: carData.mileagePolicy,
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

  // FIXED: Booking Card Content with proper button for mobile
  const BookingCardContent = () => (
    <BookingCardContentWrapper>
      <BookingHeader
        $isMobile={isMobile}
        $isMobileExpanded={isMobileExpanded}
        className="booking-header"
      >
        <div>
          <BookingTitle> Book This Car</BookingTitle>
          <PriceHighlight>${car.pricePerDay}/day</PriceHighlight>
        </div>
        {isMobile && (
          <MobileExpandButton
            onClick={toggleMobileExpand}
            $expanded={isMobileExpanded}
            aria-label={
              isMobileExpanded ? "Collapse booking form" : "Expand booking form"
            }
          >
            <span>{isMobileExpanded ? "Hide Form" : "Show Booking Form"}</span>
            <span>{isMobileExpanded ? "▼" : "▲"}</span>
          </MobileExpandButton>
        )}
      </BookingHeader>

      {/* FIXED: Always render form content but control visibility with CSS */}
      <BookingCardBody
        $isMobile={isMobile}
        $isMobileExpanded={isMobileExpanded}
        onClick={(e) => e.stopPropagation()}
      >
        {car.status === "available" ? (
          <>
            <AvailabilityBadge $available={true}>
              Available for booking
            </AvailabilityBadge>

            {/* Mileage Policy Display */}
            {mileageInfo && (
              <MileagePolicyCard>
                <MileagePolicyTitle> Mileage Policy</MileagePolicyTitle>
                <MileagePolicyDetails>
                  {mileageInfo.unlimitedMileage ? (
                    <UnlimitedMileage>
                      <span>🚀 Unlimited Mileage</span>
                      <small>
                        Drive as much as you want with no extra charges
                      </small>
                    </UnlimitedMileage>
                  ) : (
                    <Mil>
                      <MileageAllowance>
                        <strong>{mileageInfo.dailyAllowance} miles</strong> Per
                        day
                      </MileageAllowance>
                      <MileageRate>
                        <strong>${mileageInfo.extraMileRate}/mile</strong> Extra
                        milages
                      </MileageRate>
                    </Mil>
                  )}
                </MileagePolicyDetails>
              </MileagePolicyCard>
            )}

            {/* Car Condition Indicator */}
            {/* {mileageInfo && (
              <CarConditionCard>
                <CarConditionHeader>
                  <span>🔧 Vehicle Condition</span>
                  <ConditionStatus $good={mileageInfo.isWellMaintained}>
                    {mileageInfo.isWellMaintained
                      ? "Excellent"
                      : "Needs Attention"}
                  </ConditionStatus>
                </CarConditionHeader>
                <CarConditionDetails>
                  <MileageInfo>
                    <span>Current Mileage:</span>
                    <strong>
                      {mileageInfo.currentMileage?.toLocaleString()} miles
                    </strong>
                  </MileageInfo>
                  {!mileageInfo.unlimitedMileage && (
                    <ServiceInfo $needsService={mileageInfo.needsService}>
                      <span>Next Service:</span>
                      <strong>
                        {mileageInfo.needsService
                          ? "Due Now"
                          : `in ${mileageInfo.milesUntilService?.toLocaleString()} miles`}
                      </strong>
                    </ServiceInfo>
                  )}
                </CarConditionDetails>
              </CarConditionCard>
            )} */}

            <FormContainer className="booking-form">
              <BookingForm
                car={car}
                drivers={drivers}
                mileageInfo={mileageInfo}
              />
            </FormContainer>
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
            {car.status === "maintenance" && mileageInfo?.needsService && (
              <MaintenanceNote>
                🔧 This vehicle is undergoing scheduled maintenance
              </MaintenanceNote>
            )}
            <NotifyButton>🔔 Notify me when available</NotifyButton>
          </NotAvailable>
        )}
      </BookingCardBody>
    </BookingCardContentWrapper>
  );

  // Create similar cars data
  const similarCars = [
    transformCarForCard(car, "similar"),
    transformCarForCard(car, "premium"),
  ];

  return (
    <PageWrapper>
      {/* FIXED: Modern Header with Properly Aligned Actions */}
      <HeaderSection>
        <HeaderContent>
          <TitleWrapper>
            <Title>{car.name}</Title>
            <CarBadges>
              <StatusBadge $status={car.status}>
                {car.status?.toUpperCase() || "UNAVAILABLE"}
              </StatusBadge>
              <RatingBadge>⭐ {car.rating || "4.8"} / 5</RatingBadge>
              {mileageInfo?.unlimitedMileage && (
                <MileageBadge>🚀 Unlimited Miles</MileageBadge>
              )}
            </CarBadges>
          </TitleWrapper>

          <ActionButtons>
            <BookmarkButton
              onClick={handleBookmark}
              $isBookmarked={isBookmarked}
            >
              {isBookmarked ? "❤️ Bookmarked" : "🤍 Bookmark"}
            </BookmarkButton>
            <ShareButton>📤 Share</ShareButton>
          </ActionButtons>
        </HeaderContent>
      </HeaderSection>

      {/* Quick Stats Bar - Updated with Mileage */}
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
        <StatDivider />
        <StatItem>
          <StatValue>
            {mileageInfo?.currentMileage
              ? `${(mileageInfo.currentMileage / 1000).toFixed(0)}k`
              : "0"}
          </StatValue>
          <StatLabel>Miles</StatLabel>
        </StatItem>
        {!mileageInfo?.unlimitedMileage && (
          <>
            <StatDivider />
            <StatItem>
              <StatValue>{mileageInfo?.dailyAllowance || 200}</StatValue>
              <StatLabel>Miles/day</StatLabel>
            </StatItem>
          </>
        )}
      </StatsBar>

      <ContentWrapper>
        <LeftSection>
          {/* Enhanced Image Slider - Fixed for mobile */}
          <SliderWrapper $isMobile={isMobile}>
            <MainSwiper
              modules={[Navigation, Pagination, Thumbs, Autoplay, EffectFade]}
              navigation={!isMobile} // Hide navigation on mobile
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
                    src={imageError[i] ? getFallbackImage(i) : img}
                    alt={`${car.name} ${i + 1}`}
                    onError={() => handleImageError(i)}
                    $isMobile={isMobile}
                  />
                </SwiperSlide>
              ))}
            </MainSwiper>

            {/* Enhanced Thumbnail Slider - Hide on mobile */}
            {!isMobile && (
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
            )}
          </SliderWrapper>

          {/* FIXED: Enhanced Booking Card with proper button for mobile */}
          {isMobile ? (
            <MobileStickyContainer $isExpanded={isMobileExpanded}>
              <MobileBookingCard $isExpanded={isMobileExpanded}>
                <BookingCardContent />
              </MobileBookingCard>
            </MobileStickyContainer>
          ) : (
            <DesktopBookingCard>
              <BookingCardContent />
            </DesktopBookingCard>
          )}
        </LeftSection>

        {/* Enhanced Details Section with Tabs - Now includes mileage info */}
        <ModelSideTab car={car} modelId={modelId} mileageInfo={mileageInfo} />
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
          {similarCars.map((similarCar) => (
            <CarCard
              key={similarCar.id}
              car={similarCar}
              showOverlay={true}
              showBookButton={true}
              showMileage={true} // New prop to show mileage
              className="similar-car-card"
            />
          ))}
        </SimilarCarsGrid>
      </Section>
    </PageWrapper>
  );
};

export default ModelPage;

// ============================================================================
// STYLED COMPONENTS - FIXED HEADER ALIGNMENT
// ============================================================================

const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 var(--space-lg);
  animation: ${fadeInUp} 0.6s ease-out;
  font-family: var(--font-body);
  overflow-x: hidden;

  @media ${devices.lg} {
    margin: var(--space-xl) auto;
    padding: 0 var(--space-md);
  }

  @media ${devices.md} {
    margin: var(--space-lg) auto;
    padding: 0 var(--space-sm);
  }

  @media ${devices.sm} {
    margin: var(--space-md) auto;
    padding: 0 var(--space-xs);
    padding-bottom: 120px;
  }
`;

// FIXED: Improved Header Section with better alignment
const HeaderSection = styled.div`
  width: 100%;
  margin-bottom: var(--space-xl);
  animation: ${fadeInUp} 0.6s ease-out;

  @media ${devices.md} {
    margin-bottom: var(--space-lg);
  }

  @media ${devices.sm} {
    margin-bottom: var(--space-md);
  }
`;

// NEW: Header content wrapper for proper alignment
const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-lg);
  width: 100%;

  @media ${devices.md} {
    flex-direction: column;
    text-align: center;
    gap: var(--space-md);
  }

  @media ${devices.sm} {
    gap: var(--space-sm);
  }
`;

const TitleWrapper = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  align-items: flex-start;

  @media ${devices.md} {
    align-items: center;
    width: 100%;
  }
`;
const Mil = styled.div`
  display: flex;
  justify-content: space-around;
`;
const Title = styled.h1`
  font-size: clamp(var(--text-2xl), 4vw, var(--text-5xl));
  color: var(--text-primary);
  margin: 0;
  font-weight: var(--font-bold);
  line-height: 1.2;
  font-family: var(--font-heading);
  word-wrap: break-word;
  overflow-wrap: break-word;
  text-align: left;

  @media ${devices.md} {
    text-align: center;
    font-size: var(--text-2xl);
  }

  @media ${devices.sm} {
    font-size: var(--text-xl);
  }
`;

const CarBadges = styled.div`
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
  justify-content: flex-start;

  @media ${devices.md} {
    justify-content: center;
    gap: var(--space-sm);
  }

  @media ${devices.sm} {
    gap: var(--space-xs);
  }
`;

const StatusBadge = styled.span`
  padding: var(--space-xs) var(--space-md);
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
  white-space: nowrap;

  @media ${devices.sm} {
    padding: var(--space-xs) var(--space-sm);
    font-size: var(--text-xxs);
  }
`;

const RatingBadge = styled.span`
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  background: var(--warning-light);
  color: var(--warning-dark);
  white-space: nowrap;

  @media ${devices.sm} {
    padding: var(--space-xs) var(--space-sm);
    font-size: var(--text-xxs);
  }
`;

const MileageBadge = styled.span`
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  background: var(--primary-light);
  color: var(--primary-dark);
  white-space: nowrap;

  @media ${devices.sm} {
    padding: var(--space-xs) var(--space-sm);
    font-size: var(--text-xxs);
  }
`;

// FIXED: Action Buttons with proper alignment
const ActionButtons = styled.div`
  display: flex;
  gap: var(--space-md);
  flex-shrink: 0;
  align-items: center;

  @media ${devices.md} {
    width: 100%;
    justify-content: center;
    gap: var(--space-sm);
  }

  @media ${devices.sm} {
    gap: var(--space-xs);
  }
`;

const BookmarkButton = styled.button`
  padding: var(--space-sm) var(--space-md);
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
  font-size: var(--text-sm);
  height: fit-content;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  @media ${devices.md} {
    padding: var(--space-xs) var(--space-sm);
    font-size: var(--text-xs);
    flex: 1;
    max-width: 140px;
  }

  @media ${devices.sm} {
    max-width: 120px;
    font-size: var(--text-xxs);
  }
`;

const ShareButton = styled(SecondaryButton)`
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--text-sm);
  height: fit-content;

  @media ${devices.md} {
    padding: var(--space-xs) var(--space-sm);
    font-size: var(--text-xs);
    flex: 1;
    max-width: 140px;
  }

  @media ${devices.sm} {
    max-width: 120px;
    font-size: var(--text-xxs);
  }
`;

const StatsBar = styled.div`
  display: flex;
  align-items: center;
  background: var(--gradient-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  margin-bottom: var(--space-2xl);
  color: var(--white);
  animation: ${scaleIn} 0.6s ease-out;
  flex-wrap: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  @media ${devices.sm} {
    padding: var(--space-md);
    margin-bottom: var(--space-xl);
    border-radius: var(--radius-lg);
  }
`;

const StatItem = styled.div`
  flex: 1;
  text-align: center;
  padding: 0 var(--space-md);
  min-width: 80px;

  @media ${devices.sm} {
    padding: 0 var(--space-sm);
    min-width: 70px;
  }
`;

const StatValue = styled.div`
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-xs);
  font-family: var(--font-heading);

  @media ${devices.sm} {
    font-size: var(--text-lg);
  }
`;

const StatLabel = styled.div`
  font-size: var(--text-xs);
  opacity: 0.9;
  font-family: var(--font-body);

  @media ${devices.sm} {
    font-size: var(--text-xxs);
  }
`;

const StatDivider = styled.div`
  width: 1px;
  height: 30px;
  background: rgba(255, 255, 255, 0.3);

  @media ${devices.sm} {
    height: 25px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2xl);
  margin-bottom: var(--space-2xl);
  align-items: flex-start;
  width: 100%;

  @media ${devices.lg} {
    gap: var(--space-xl);
  }

  @media ${devices.md} {
    flex-direction: column;
    gap: var(--space-lg);
    margin-bottom: var(--space-xl);
  }

  @media ${devices.sm} {
    gap: var(--space-md);
    margin-bottom: var(--space-lg);
  }
`;

const LeftSection = styled.div`
  flex: 1 1 60%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  position: relative;
  animation: ${fadeInUp} 0.8s ease-out;

  @media ${devices.md} {
    order: 2;
    gap: var(--space-lg);
    width: 100%;
  }

  @media ${devices.sm} {
    gap: var(--space-md);
  }
`;

const SliderWrapper = styled.div`
  width: 100%;
  min-width: 0;
  animation: ${fadeInUp} 0.8s ease-out;
  overflow: hidden;

  @media ${devices.md} {
    order: 1;
  }
`;

const MainSwiper = styled(Swiper)`
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  width: 100%;

  .swiper-button-next,
  .swiper-button-prev {
    color: var(--white);
    background: rgba(0, 0, 0, 0.5);
    width: 40px;
    height: 40px;
    border-radius: 50%;

    &:after {
      font-size: var(--text-md);
    }

    @media ${devices.sm} {
      width: 35px;
      height: 35px;

      &:after {
        font-size: var(--text-sm);
      }
    }
  }

  .swiper-pagination-bullet {
    background: var(--white);
    opacity: 0.6;

    &-active {
      opacity: 1;
      background: var(--primary);
    }
  }
`;

const MainImage = styled.img`
  width: 100%;
  height: ${(props) => (props.$isMobile ? "60vh" : "500px")};
  object-fit: cover;
  display: block;
  background: var(--gray-100);

  @media ${devices.md} {
    height: 400px;
  }

  @media ${devices.sm} {
    height: 60vh;
    max-height: 500px;
    min-height: 300px;
  }
`;

const ThumbsWrapper = styled.div`
  margin-top: var(--space-lg);
  width: 100%;

  @media ${devices.sm} {
    display: none;
  }
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

const DesktopBookingCard = styled.div`
  width: 100%;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  box-shadow: var(--shadow-lg);
  animation: ${scaleIn} 0.6s ease-out 0.2s both;
  position: sticky;
  top: var(--space-xl);
  z-index: 10;
  transition: all var(--transition-normal);
  flex: 1 1 35%;
  min-width: 28rem;
  align-self: flex-start;

  @media ${devices.lg} {
    display: none;
  }
`;

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
    width: 100vw;
    margin-left: calc(-1 * var(--space-xs));
  }

  @media ${devices.md} {
    display: block;
  }
`;

const MobileBookingCard = styled.div`
  @media ${devices.lg} {
    background: var(--white);
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    padding: ${(props) =>
      props.$isExpanded ? "var(--space-xl)" : "var(--space-lg)"};
    max-height: ${(props) => (props.$isExpanded ? "80vh" : "auto")};
    overflow: ${(props) => (props.$isExpanded ? "auto" : "hidden")};
    transition: all var(--transition-normal);
    width: 100%;

    /* Allow form elements to be clickable */
    .booking-form * {
      pointer-events: auto;
    }

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

  @media ${devices.sm} {
    padding: ${(props) =>
      props.$isExpanded ? "var(--space-lg)" : "var(--space-md)"};
  }
`;

const BookingCardContentWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) =>
    props.$isMobile && !props.$isMobileExpanded ? "0" : "var(--space-lg)"};
  width: 100%;
  padding: ${(props) => (props.$isMobile ? "var(--space-sm) 0" : "0")};

  @media ${devices.sm} {
    margin-bottom: ${(props) =>
      props.$isMobile && !props.$isMobileExpanded ? "0" : "var(--space-sm)"};
  }

  div {
    display: flex;
    align-items: center;
    gap: var(--space-lg);
    flex: 1;

    @media ${devices.sm} {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-sm);
    }
  }
`;

// NEW: Mobile Expand Button Components
const MobileExpandButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  background: var(--primary);
  color: var(--white);
  border: none;
  border-radius: var(--radius-lg);
  padding: var(--space-xl) var(--space-md);
  cursor: pointer;

  /* font-weight: var(--font-semibold); */
  transition: all var(--transition-normal);
  min-width: 160px;
  margin-left: auto;

  &:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  &:active {
    transform: translateY(0);
  }

  @media ${devices.sm} {
    min-width: 140px;
    padding: var(--space-xs) var(--space-sm);
    font-size: var(--text-xs);
  }
  span {
    font-size: var(--text-xl);
  }
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
`;

const ButtonText = styled.span`
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  white-space: nowrap;

  @media ${devices.sm} {
    font-size: var(--text-xs);
  }
`;

const ButtonIcon = styled.span`
  font-size: var(--text-sm);
  transition: transform var(--transition-normal);
  transform: ${(props) => (props.$expanded ? "rotate(180deg)" : "rotate(0)")};

  @media ${devices.sm} {
    font-size: var(--text-xs);
  }
`;

const BookingCardBody = styled.div`
  display: ${(props) =>
    props.$isMobile && !props.$isMobileExpanded ? "none" : "block"};
  animation: ${(props) =>
      props.$isMobile && props.$isMobileExpanded ? slideUp : "none"}
    0.3s ease-out;
  pointer-events: auto;
`;

const FormContainer = styled.div`
  width: 100%;

  & > * {
    pointer-events: auto;
  }

  input,
  select,
  textarea,
  button,
  label {
    pointer-events: auto !important;
  }
`;

const BookingTitle = styled.h3`
  margin: 0;
  color: var(--text-primary);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  font-family: var(--font-heading);

  @media ${devices.sm} {
    font-size: var(--text-md);
  }
`;

const PriceHighlight = styled.span`
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--primary);
  animation: ${pulse} 2s infinite;
  font-family: var(--font-heading);

  @media ${devices.sm} {
    font-size: var(--text-xl);
  }
`;

const AvailabilityBadge = styled.div`
  /* padding: var(--space-md) var(--space-lg); */
  background: ${(props) =>
    props.$available ? "var(--success-light)" : "var(--error-light)"};
  color: ${(props) =>
    props.$available ? "var(--success-dark)" : "var(--error-dark)"};
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  /* margin-bottom: var(--space-xl); */
  text-align: center;
  font-family: var(--font-body);

  /* @media ${devices.sm} {
    padding: var(--space-sm) var(--space-md);
    margin-bottom: var(--space-lg);
    font-size: var(--text-sm);
  } */
`;

const MileagePolicyCard = styled.div`
  background: var(--accent);
  border: 1px solid var(--primary);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  margin-bottom: var(--space-md);
  animation: ${fadeInUp} 0.6s ease-out;

  @media ${devices.sm} {
    padding: var(--space-md);
    margin-bottom: var(--space-sm);
  }
`;

const MileagePolicyTitle = styled.h4`
  margin: 0 0 var(--space-md) 0;
  color: var(--primary-dark);
  font-size: var(--text-3xxl);
  font-weight: var(--font-bold);
  font-family: var(--font-heading);

  @media ${devices.sm} {
    font-size: var(--text-sm);
    margin-bottom: var(--space-sm);
  }
`;

const MileagePolicyDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const UnlimitedMileage = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);

  span {
    font-weight: var(--font-bold);
    color: var(--primary-dark);
    font-size: var(--text-md);
  }

  small {
    color: var(--text-secondary);
    font-size: var(--text-sm);
  }

  @media ${devices.sm} {
    span {
      font-size: var(--text-sm);
    }

    small {
      font-size: var(--text-xs);
    }
  }
`;

const MileageAllowance = styled.div`
  color: var(--text-primary);
  font-size: var(--text-2xl);

  strong {
    color: var(--primary-dark);
  }

  @media ${devices.sm} {
    font-size: var(--text-lg);
  }
`;

const MileageRate = styled.div`
  color: var(--text-primary);
  font-size: var(--text-2xl);

  strong {
    color: var(--primary-dark);
  }

  @media ${devices.sm} {
    font-size: var(--text-lg);
  }
`;

const CarConditionCard = styled.div`
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  margin-bottom: var(--space-lg);
  animation: ${fadeInUp} 0.6s ease-out 0.1s both;

  @media ${devices.sm} {
    padding: var(--space-md);
    margin-bottom: var(--space-md);
  }
`;

const CarConditionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);

  span {
    font-weight: var(--font-semibold);
    color: var(--text-primary);
    font-size: var(--text-md);
  }

  @media ${devices.sm} {
    margin-bottom: var(--space-sm);

    span {
      font-size: var(--text-sm);
    }
  }
`;

const ConditionStatus = styled.span`
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  background: ${(props) =>
    props.$good ? "var(--success-light)" : "var(--warning-light)"};
  color: ${(props) =>
    props.$good ? "var(--success-dark)" : "var(--warning-dark)"};
`;

const CarConditionDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const MileageInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    color: var(--text-secondary);
    font-size: var(--text-sm);
  }

  strong {
    color: var(--text-primary);
    font-size: var(--text-md);
  }

  @media ${devices.sm} {
    span,
    strong {
      font-size: var(--text-sm);
    }
  }
`;

const ServiceInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    color: var(--text-secondary);
    font-size: var(--text-sm);
  }

  strong {
    color: ${(props) =>
      props.$needsService ? "var(--error)" : "var(--success)"};
    font-size: var(--text-md);
    font-weight: var(--font-semibold);
  }

  @media ${devices.sm} {
    span,
    strong {
      font-size: var(--text-sm);
    }
  }
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

  @media ${devices.sm} {
    padding: var(--space-md);
    margin-top: var(--space-md);
    font-size: var(--text-xs);
  }
`;

const NotAvailable = styled.div`
  text-align: center;
  padding: var(--space-xl) var(--space-lg);
  color: var(--text-muted);
  font-family: var(--font-body);

  @media ${devices.sm} {
    padding: var(--space-lg) var(--space-md);
  }
`;

const NotAvailableIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: var(--space-lg);

  @media ${devices.sm} {
    font-size: 2rem;
    margin-bottom: var(--space-md);
  }
`;

const NotAvailableTitle = styled.h3`
  margin: var(--space-lg) 0 var(--space-sm) 0;
  color: var(--error);
  font-family: var(--font-heading);
  font-size: var(--text-xl);

  @media ${devices.sm} {
    font-size: var(--text-lg);
    margin: var(--space-md) 0 var(--space-xs) 0;
  }
`;

const NotAvailableText = styled.p`
  margin: 0 0 var(--space-lg) 0;
  font-family: var(--font-body);
  font-size: var(--text-md);

  @media ${devices.sm} {
    font-size: var(--text-sm);
    margin-bottom: var(--space-md);
  }
`;

const MaintenanceNote = styled.div`
  padding: var(--space-md);
  background: var(--warning-light);
  border-radius: var(--radius-lg);
  color: var(--warning-dark);
  font-weight: var(--font-medium);
  margin-bottom: var(--space-lg);
  font-size: var(--text-sm);

  @media ${devices.sm} {
    padding: var(--space-sm);
    margin-bottom: var(--space-md);
    font-size: var(--text-xs);
  }
`;

const NotifyButton = styled(PrimaryButton)`
  margin-top: var(--space-lg);
  padding: var(--space-md) var(--space-lg);
  font-size: var(--text-sm);

  @media ${devices.sm} {
    margin-top: var(--space-md);
    padding: var(--space-sm) var(--space-md);
    font-size: var(--text-xs);
    width: 100%;
  }
`;

const Section = styled.section`
  margin: var(--space-2xl) 0;
  animation: ${fadeInUp} 0.8s ease-out;
  width: 100%;

  @media ${devices.lg} {
    margin: var(--space-xl) 0;
  }

  @media ${devices.sm} {
    margin: var(--space-lg) 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: var(--text-2xl);
  color: var(--text-primary);
  margin-bottom: var(--space-xl);
  text-align: center;
  font-weight: var(--font-bold);
  font-family: var(--font-heading);

  @media ${devices.md} {
    font-size: var(--text-xl);
    margin-bottom: var(--space-lg);
  }

  @media ${devices.sm} {
    font-size: var(--text-lg);
    margin-bottom: var(--space-md);
  }
`;

const SimilarCarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-xl);
  width: 100%;

  @media ${devices.md} {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }

  @media ${devices.sm} {
    gap: var(--space-md);
  }

  .similar-car-card {
    min-height: 45rem;

    @media ${devices.sm} {
      min-height: 40rem;
    }
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
