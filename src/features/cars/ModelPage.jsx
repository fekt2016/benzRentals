// ModelPage.js (FIXED - Header Button Alignment)
import React, { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
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
import { useGetCarById } from "../cars/useCar";
import { useMyDrivers } from "../drivers/useDriver";
import { useCurrentUser } from "../auth/useAuth";

// Component Imports
import ReviewSection from "../../features/cars/ReviewSection";
import ModelSideTab from "../../features/cars/ModelSideTab";
import CarCard from "../../features/cars/CarCard";
import {  SecondaryButton } from "../../components/ui/Button";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import MobileBookingForm from "../../features/bookings/MobileBookingForm";

// Global Styles and Animations
import { devices } from "../../styles/GlobalStyles";
import { fadeInUp, scaleIn, slideUp } from "../../styles/animations";

const ModelPage = () => {
  const { modelId } = useParams();
  
  const { data: carData, isLoading } = useGetCarById(modelId);
  const { data: myDrivers } = useMyDrivers();
  const drivers = useMemo(() => myDrivers?.data || [], [myDrivers]);
  const car = useMemo(() => carData?.data || null, [carData]);
  const { data: userData } = useCurrentUser();
  const user = useMemo(() => userData?.user || null, [userData]);

  console.log("Car Data:", car);

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
              <RatingBadge>⭐ {car.averageRating || "4.5"} / 5</RatingBadge>
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
          <StatLabel>Per day</StatLabel>
          <StatValue>${car.pricePerDay}</StatValue>
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
                < MobileBookingForm 
                  car={car}
                  mileageInfo={mileageInfo}
                  drivers={drivers}
                  isMobile={isMobile}
                  isMobileExpanded={isMobileExpanded}
                  toggleMobileExpand={toggleMobileExpand}
                />
              </MobileBookingCard>
            </MobileStickyContainer>
          ) : (
            <DesktopBookingCard>
              <MobileBookingForm 
                car={car}
                mileageInfo={mileageInfo}
                drivers={drivers}
                isMobile={isMobile}
                isMobileExpanded={isMobileExpanded}
                toggleMobileExpand={toggleMobileExpand}
              />
            </DesktopBookingCard>
          )}
        </LeftSection>

        {/* Enhanced Details Section with Tabs - Now includes mileage info */}
        <ModelSideTab car={car} modelId={modelId} mileageInfo={mileageInfo} />
      </ContentWrapper>

      {/* Enhanced Review Section */}
      <Section>
        <SectionTitle> Customer Reviews & Ratings</SectionTitle>
        <ReviewSection modelId={modelId} userId={user?._id} />
      </Section>

      {/* Similar Cars Section using CarCard Component */}
      <Section>
        <SectionTitle> Similar Vehicles</SectionTitle>
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
  margin: 3rem auto;
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
  margin-bottom: var(--space-sm);
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
  
    padding: var(--space-sm);
    border-radius: var(--radius-lg);
    flex-wrap: wrap;
    
     
    
  }
`;

const StatItem = styled.div`
  flex: 1;
  text-align: center;
  padding: 0 var(--space-md);
  min-width: 80px;
  align-self: flex-start;
 

  @media ${devices.sm} {
    padding: 0 var(--space-sm);
    min-width: 100px;
  }
`;

const StatValue = styled.p`
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-xs);
  font-family: var(--font-heading);
  color: var(--white);
text-transform: capitalize;
  @media ${devices.sm} {
    font-size: var(--text-lg);
  }
`;

const StatLabel = styled.div`
  font-size: var(--text-xs);
  opacity: 0.9;
  font-family: var(--font-body);
  text-transform: capitalize;

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