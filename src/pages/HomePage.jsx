import React, { useRef, useEffect, useMemo } from "react";
import styled from "styled-components";
// eslint-disable-next-line no-unused-vars
import { motion, useInView, useAnimation } from "framer-motion";
import { devices } from "../styles/GlobalStyles";

// Import reusable components
import HeroSection from "../components/Sections/HeroSection";
import SectionHeader from "../components/Sections/SectionHeader";
import StatsGrid from "../components/Sections/StatsGrid";
import CarCard from "../components/Cards/CarCard";
import FeatureCard from "../components/Cards/FeatureCard";
import Container from "../Layout/Container";
import CarGrid from "../Layout/CarGrid";

// Import buttons
import {
  PrimaryButton,
  SecondaryButton,
  AccentButton,
  ButtonLink,
  SecondaryButtonLink,
} from "../components/ui/Button";

// Import hooks and utilities
import { useGetCars } from "../hooks/useCar";
import { getRandomItems } from "../utils/helper";
import { ROUTE_CONFIG, PATHS } from "../routes/routePaths";
import usePageTitle from "../hooks/usePageTitle";

// Icons
import {
  FaCar,
  FaShieldAlt,
  FaClock,
  FaStar,
  FaCheckCircle,
  FaArrowRight,
  FaPlay,
  FaUsers,
  FaAward,
} from "react-icons/fa";

const HomePage = () => {
  const seoConfig = ROUTE_CONFIG[PATHS.HOME];
  usePageTitle(seoConfig.title, seoConfig.description);

  // Refs for intersection observer
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const showcaseRef = useRef(null);
  const statsRef = useRef(null);
  const discountRef = useRef(null);
  const ctaRef = useRef(null);

  const { data: carData } = useGetCars();
  const cars = useMemo(() => carData?.data?.data || [], [carData]);
  const availableCars = useMemo(() => {
    return cars.filter((car) => car.status === "available");
  }, [cars]);

  const heroControls = useAnimation();
  const featuresControls = useAnimation();
  const showcaseControls = useAnimation();
  const statsControls = useAnimation();
  const discountControls = useAnimation();
  const ctaControls = useAnimation();

  // Check if elements are in view using useInView
  const heroInView = useInView(heroRef, { threshold: 0.5 });
  const featuresInView = useInView(featuresRef, { threshold: 0.3 });
  const showcaseInView = useInView(showcaseRef, { threshold: 0.2 });
  const statsInView = useInView(statsRef, { threshold: 0.3 });
  const discountInView = useInView(discountRef, { threshold: 0.3 });
  const ctaInView = useInView(ctaRef, { threshold: 0.4 });

  // Trigger animations when elements come into view
  useEffect(() => {
    if (heroInView) heroControls.start("visible");
  }, [heroInView, heroControls]);

  useEffect(() => {
    if (featuresInView) featuresControls.start("visible");
  }, [featuresInView, featuresControls]);

  useEffect(() => {
    if (showcaseInView) showcaseControls.start("visible");
  }, [showcaseInView, showcaseControls]);

  useEffect(() => {
    if (statsInView) statsControls.start("visible");
  }, [statsInView, statsControls]);

  useEffect(() => {
    if (discountInView) discountControls.start("visible");
  }, [discountInView, discountControls]);

  useEffect(() => {
    if (ctaInView) ctaControls.start("visible");
  }, [ctaInView, ctaControls]);

  // Featured cars data - use actual cars if available, otherwise fallback
  const featuredCars = useMemo(() => {
    if (availableCars && availableCars.length > 0) {
      return getRandomItems(availableCars, 3).map((car, index) => ({
        id: car._id || index + 1,
        model: car.model || "Mercedes-Benz Model",
        series: car.series || "Premium Series",
        price: car.price || 199,
        status: car.status || "availabe",
        image:
          car.images[0] ||
          "https://images.unsplash.com/photo-1563720223182-8e41e09c2396?auto=format&fit=crop&w=800&q=80",
        features: car.features || [
          "Premium Sound",
          "Luxury Interior",
          "Advanced Safety",
        ],
      }));
    }

    // Fallback data
    return [
      {
        id: 1,
        model: "Mercedes-Benz S-Class",
        series: "S 580 4MATIC",
        price: 249,
        image:
          "https://images.unsplash.com/photo-1563720223182-8e41e09c2396?auto=format&fit=crop&w=800&q=80",
        features: ["Premium Sound", "Panoramic Roof", "Massage Seats"],
      },
      {
        id: 2,
        model: "Mercedes-Benz GLE",
        series: "GLE 450 4MATIC",
        price: 189,
        image:
          "https://images.unsplash.com/photo-1621109246687-10ae98f9bd8a?auto=format&fit=crop&w=800&q=80",
        features: ["7-Seater", "Air Suspension", "Advanced Safety"],
      },
      {
        id: 3,
        model: "Mercedes-Benz E-Class",
        series: "E 350 4MATIC",
        price: 159,
        image:
          "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80",
        features: ["Luxury Interior", "MBUX System", "Driver Assist"],
      },
    ];
  }, [availableCars]);

  // Stats data
  const stats = [
    { number: "500+", label: "Happy Customers", icon: FaUsers },
    { number: "50+", label: "Premium Vehicles", icon: FaCar },
    { number: "99%", label: "Satisfaction Rate", icon: FaStar },
    { number: "24/7", label: "Support Available", icon: FaClock },
  ];

  // Features data
  const features = [
    {
      icon: FaCar,
      title: "Premium Fleet Only",
      description:
        "Exclusively Mercedes-Benz vehicles, meticulously maintained and regularly updated",
      color: "var(--success)",
    },
    {
      icon: FaShieldAlt,
      title: "Full Coverage Insurance",
      description:
        "Comprehensive insurance included with every rental for complete peace of mind",
      color: "var(--info)",
    },
    {
      icon: FaClock,
      title: "24/7 Support",
      description:
        "Round-the-clock customer service ready to assist you whenever you need",
      color: "var(--warning)",
    },
    {
      icon: FaCheckCircle,
      title: "Easy Booking Process",
      description:
        "Simple 3-step booking process with instant confirmation and flexible options",
      color: "var(--error)",
    },
  ];

  return (
    <Wrapper>
      {/* Hero Section */}
      <HeroContainer ref={heroRef}>
        <HeroSection
          backgroundImage="/images/ben1.jpg"
          badge={
            <>
              <FaStar size={16} />
              Premium Luxury Rentals
            </>
          }
          title={
            <>
              <WhiteText>Experience</WhiteText>{" "}
              <GradientText>Benzflex</GradientText>
              <WhiteText>Excellence</WhiteText>
            </>
          }
          description="Discover the pinnacle of automotive luxury with our exclusive Mercedes-Benz fleet. From sophisticated sedans to powerful SUVs, experience premium comfort and performance."
          primaryButton={{
            to: "/models",
            text: "Explore Our Fleet",
            icon: (props) => <FaArrowRight size={18} {...props} />,
          }}
          secondaryButton={{
            onClick: () => console.log("Watch story clicked"),
            text: "Watch Story",
            icon: (props) => <FaPlay size={16} {...props} />,
          }}
          onBackgroundError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1563720223182-8e41e09c2396?auto=format&fit=crop&w=1600&q=80";
          }}
          scrollText="Scroll to Explore"
        />
      </HeroContainer>

      {/* Stats Section */}
      <StatsSection ref={statsRef}>
        <Container>
          <StatsGrid stats={stats} animationControls={statsControls} />
        </Container>
      </StatsSection>

      {/* Features Section */}
      <FeaturesSection ref={featuresRef}>
        <Container>
          <motion.div
            initial="hidden"
            animate={featuresControls}
            variants={sectionVariants}
          >
            <SectionHeader
              subtitle="Why Choose BenzRent"
              title="Unmatched Luxury Experience"
            />

            <FeaturesGrid>
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  variants={featureVariants}
                  custom={index}
                >
                  <FeatureCard
                    {...feature}
                    icon={(props) =>
                      React.createElement(feature.icon, { size: 24, ...props })
                    }
                  />
                </motion.div>
              ))}
            </FeaturesGrid>
          </motion.div>
        </Container>
      </FeaturesSection>

      {/* Car Showcase Section */}
      <ShowcaseSection ref={showcaseRef}>
        <Container>
          <motion.div
            initial="hidden"
            animate={showcaseControls}
            variants={sectionVariants}
          >
            <SectionHeader
              subtitle="Featured Collection"
              title="Our Premium Fleet"
            />

            <CarGrid columns={3}>
              {featuredCars.map((car, index) => {
                // console.log(car);
                return (
                  <motion.div
                    key={car.id}
                    variants={carCardVariants}
                    custom={index}
                  >
                    <CarCard car={car} />
                  </motion.div>
                );
              })}
            </CarGrid>

            <ViewAllWrapper>
              <SecondaryButtonLink to="/models" $size="lg">
                View All Vehicles
                <FaArrowRight size={18} />
              </SecondaryButtonLink>
            </ViewAllWrapper>
          </motion.div>
        </Container>
      </ShowcaseSection>

      {/* Discount Section */}
      <DiscountSection ref={discountRef}>
        <Container>
          <motion.div
            initial="hidden"
            animate={discountControls}
            variants={discountVariants}
          >
            <DiscountCard className="luxury-card">
              <DiscountContent>
                <DiscountBadge className="status-badge status-badge--warning">
                  <FaAward size={16} />
                  Limited Time Offer
                </DiscountBadge>

                <DiscountTitle>
                  Get <DiscountHighlight>15% OFF</DiscountHighlight> Your First
                  Luxury Trip
                </DiscountTitle>

                <DiscountDescription>
                  Experience Mercedes-Benz excellence at an exclusive price. New
                  customers save 15% on your first rental. Limited time offer
                  for luxury seekers.
                </DiscountDescription>

                <DiscountFeatures>
                  <DiscountFeature>
                    <FaCheckCircle size={20} />
                    <span>Applicable on all Mercedes-Benz models</span>
                  </DiscountFeature>
                  <DiscountFeature>
                    <FaCheckCircle size={20} />
                    <span>No minimum rental period required</span>
                  </DiscountFeature>
                  <DiscountFeature>
                    <FaCheckCircle size={20} />
                    <span>Includes premium insurance coverage</span>
                  </DiscountFeature>
                  <DiscountFeature>
                    <FaCheckCircle size={20} />
                    <span>Flexible cancellation policy</span>
                  </DiscountFeature>
                </DiscountFeatures>

                <DiscountActions>
                  <AccentButton as={ButtonLink} to="/models" $size="lg">
                    <FaCar size={20} />
                    Claim Your 15% Off
                  </AccentButton>
                  <SecondaryButton
                    as="button"
                    $size="lg"
                    onClick={() =>
                      alert("Contact us at 1-800-MERCEDES for details")
                    }
                  >
                    <FaClock size={18} />
                    Limited Time Offer
                  </SecondaryButton>
                </DiscountActions>

                <DiscountTerms>
                  *Offer valid for first-time customers only. Cannot be combined
                  with other promotions. Valid until{" "}
                  {new Date(
                    Date.now() + 30 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString()}
                  .
                </DiscountTerms>
              </DiscountContent>

              <DiscountVisual>
                <CarImageBackground
                  src="https://images.unsplash.com/photo-1563720223182-8e41e09c2396?auto=format&fit=crop&w=800&q=80"
                  alt="Mercedes-Benz Luxury Car"
                />
                <DiscountOverlay />
                <DiscountStats>
                  <DiscountStat>
                    <StatValue>15%</StatValue>
                    <StatLabel>Discount</StatLabel>
                  </DiscountStat>
                  <DiscountStat>
                    <StatValue>500+</StatValue>
                    <StatLabel>Happy Customers</StatLabel>
                  </DiscountStat>
                  <DiscountStat>
                    <StatValue>4.9/5</StatValue>
                    <StatLabel>Rating</StatLabel>
                  </DiscountStat>
                </DiscountStats>
              </DiscountVisual>
            </DiscountCard>
          </motion.div>
        </Container>
      </DiscountSection>

      {/* CTA Section */}
      <CTASection ref={ctaRef}>
        <Container>
          <motion.div
            initial="hidden"
            animate={ctaControls}
            variants={ctaVariants}
          >
            <CTACard className="luxury-card">
              <CTAContent>
                <h2>Ready to Experience Luxury?</h2>
                <p>
                  Join thousands of satisfied customers who've chosen BenzRent
                  for their premium mobility needs
                </p>
                <CTAButtons>
                  <PrimaryButton as={ButtonLink} to="/models" $size="lg">
                    Book Your Mercedes Now
                  </PrimaryButton>
                  <SecondaryButton
                    as="button"
                    $size="lg"
                    onClick={() => console.log("Contact team clicked")}
                  >
                    Contact Our Team
                  </SecondaryButton>
                </CTAButtons>
              </CTAContent>
              <CTAIllustration>
                <FaCar size={48} />
              </CTAIllustration>
            </CTACard>
          </motion.div>
        </Container>
      </CTASection>
    </Wrapper>
  );
};

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2,
    },
  },
};

const featureVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const carCardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

const discountVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const ctaVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

// Styled Components - Fixed overflow issues
const Wrapper = styled.div`
  margin-top: 4rem;
  overflow-x: hidden;
  width: 100%;
  max-width: 100vw;
  position: relative;
`;

const HeroContainer = styled.div`
  width: 100%;
  overflow: hidden;
`;

// Stats Section
const StatsSection = styled.section`
  padding: var(--space-2xl) 0;
  background: var(--surface);
  width: 100%;
  overflow: hidden;
`;

// Features Section
const FeaturesSection = styled.section`
  padding: var(--space-2xl) 0;
  background: var(--white);
  width: 100%;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: var(--space-xl) 0;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-lg);
  width: 100%;

  @media ${devices.md} {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }
`;

// Showcase Section
const ShowcaseSection = styled.section`
  padding: var(--space-2xl) 0;
  background: var(--surface);
  width: 100%;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: var(--space-xl) 0;
  }
`;

const ViewAllWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: var(--space-xl);
  width: 100%;
`;

const GradientText = styled.span`
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: var(--font-heading);
`;

// Discount Section
const DiscountSection = styled.section`
  padding: var(--space-2xl) 0;
  background: var(--gradient-secondary);
  width: 100%;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: var(--space-xl) 0;
  }
`;

const DiscountCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-3xl);
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  box-shadow: var(--shadow-xl);
  max-width: 100%;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const DiscountContent = styled.div`
  padding: var(--space-2xl);
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 100%;

  @media (max-width: 768px) {
    padding: var(--space-xl);
  }

  @media (max-width: 480px) {
    padding: var(--space-lg);
  }
`;

const DiscountBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  color: var(--white);
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-full);
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
  margin-bottom: var(--space-xl);
  width: fit-content;
  font-family: var(--font-body);
`;

const DiscountTitle = styled.h2`
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
  line-height: 1.2;
  font-family: var(--font-heading);
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: var(--text-3xl);
  }

  @media (max-width: 480px) {
    font-size: var(--text-2xl);
  }
`;

const DiscountHighlight = styled.span`
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: var(--font-heading);
`;

const DiscountDescription = styled.p`
  font-size: var(--text-lg);
  color: var(--text-secondary);
  margin-bottom: var(--space-xl);
  line-height: 1.6;
  font-family: var(--font-body);
  word-wrap: break-word;

  @media (max-width: 480px) {
    font-size: var(--text-base);
  }
`;

const DiscountFeatures = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-bottom: var(--space-2xl);
  width: 100%;
`;

const DiscountFeature = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--text-primary);
  font-family: var(--font-body);
  width: 100%;

  svg {
    color: var(--success);
    flex-shrink: 0;
  }

  span {
    font-weight: var(--font-medium);
    word-wrap: break-word;
  }
`;

const DiscountActions = styled.div`
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
  width: 100%;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const DiscountTerms = styled.p`
  font-size: var(--text-xs);
  color: var(--text-muted);
  line-height: 1.4;
  font-family: var(--font-body);
  word-wrap: break-word;
`;

const DiscountVisual = styled.div`
  position: relative;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 100%;

  @media (max-width: 968px) {
    min-height: 400px;
  }
`;

const CarImageBackground = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
`;

const DiscountOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--gradient-overlay);
`;

const DiscountStats = styled.div`
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);
  text-align: center;
  color: var(--white);
  width: 100%;
  max-width: 100%;

  @media (max-width: 480px) {
    gap: var(--space-md);
  }
`;

const DiscountStat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatValue = styled.div`
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-xs);
  font-family: var(--font-heading);

  @media (max-width: 480px) {
    font-size: var(--text-2xl);
  }
`;

const StatLabel = styled.div`
  font-size: var(--text-sm);
  opacity: 0.9;
  font-family: var(--font-body);
`;

// CTA Section
const CTASection = styled.section`
  padding: var(--space-2xl) 0;
  background: var(--gradient-luxury);
  width: 100%;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: var(--space-xl) 0;
  }
`;

const CTACard = styled.div`
  background: var(--white);
  border-radius: var(--radius-3xl);
  padding: var(--space-2xl);
  display: flex;
  align-items: center;
  gap: var(--space-xl);
  box-shadow: var(--shadow-xl);
  max-width: 100%;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: var(--space-xl);
    gap: var(--space-lg);
  }

  @media (max-width: 480px) {
    padding: var(--space-lg);
    border-radius: var(--radius-xl);
  }
`;

const CTAContent = styled.div`
  flex: 1;
  max-width: 100%;

  h2 {
    font-size: var(--text-4xl);
    font-weight: var(--font-bold);
    color: var(--text-primary);
    margin-bottom: var(--space-md);
    font-family: var(--font-heading);
    word-wrap: break-word;

    @media (max-width: 768px) {
      font-size: var(--text-3xl);
    }

    @media (max-width: 480px) {
      font-size: var(--text-2xl);
    }
  }

  p {
    font-size: var(--text-lg);
    color: var(--text-secondary);
    margin-bottom: var(--space-xl);
    line-height: 1.6;
    font-family: var(--font-body);
    word-wrap: break-word;

    @media (max-width: 480px) {
      font-size: var(--text-base);
    }
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
  width: 100%;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const CTAIllustration = styled.div`
  width: 200px;
  height: 200px;
  background: var(--gradient-primary);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  flex-shrink: 0;

  svg {
    font-size: 4rem;
  }

  @media (max-width: 768px) {
    width: 150px;
    height: 150px;

    svg {
      font-size: 3rem;
    }
  }

  @media (max-width: 480px) {
    width: 120px;
    height: 120px;

    svg {
      font-size: 2.5rem;
    }
  }
`;
const WhiteText = styled.span`
  color: var(--white);
`;

export default HomePage;
