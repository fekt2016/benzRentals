import React, { useRef, useEffect, useMemo } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, useInView, useAnimation } from "framer-motion";
import { useGetCars } from "../hooks/useCar";
import { getRandomItems } from "../utils/helper";

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
  FaHeart,
} from "react-icons/fa";

const HomePage = () => {
  // Refs for intersection observer
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const showcaseRef = useRef(null);
  const statsRef = useRef(null);
  const discountRef = useRef(null);
  const ctaRef = useRef(null);

  const { data: carData } = useGetCars();
  const cars = useMemo(() => carData?.data?.data || [], [carData]);

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
    if (cars && cars.length > 0) {
      return getRandomItems(cars, 3).map((car, index) => ({
        id: car._id || index + 1,
        model: car.model || "Mercedes-Benz Model",
        series: car.series || "Premium Series",
        price: car.price || 199,
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
  }, [cars]);

  const stats = [
    { number: "500+", label: "Happy Customers", icon: FaUsers },
    { number: "50+", label: "Premium Vehicles", icon: FaCar },
    { number: "99%", label: "Satisfaction Rate", icon: FaStar },
    { number: "24/7", label: "Support Available", icon: FaClock },
  ];

  return (
    <Wrapper>
      {/* Hero Section */}
      <HeroSection ref={heroRef}>
        <HeroBackground>
          <BackgroundImage src="/images/ben1.jpg" alt="Mercedes-Benz Fleet" />
          <Overlay />
        </HeroBackground>

        <HeroContent>
          <motion.div
            initial="hidden"
            animate={heroControls}
            variants={heroVariants}
          >
            <motion.div variants={heroItemVariants}>
              <HeroBadge>
                <FaStar />
                Premium Luxury Rentals
              </HeroBadge>
            </motion.div>

            <motion.h1 variants={heroItemVariants}>
              Experience <GradientText>Mercedes-Benz</GradientText> Excellence
            </motion.h1>

            <motion.p variants={heroItemVariants}>
              Discover the pinnacle of automotive luxury with our exclusive
              Mercedes-Benz fleet. From sophisticated sedans to powerful SUVs,
              experience premium comfort and performance.
            </motion.p>

            <motion.div variants={heroItemVariants}>
              <HeroButtons>
                <PrimaryButton to="/models">
                  Explore Our Fleet
                  <FaArrowRight />
                </PrimaryButton>
                <SecondaryButton>
                  <FaPlay />
                  Watch Story
                </SecondaryButton>
              </HeroButtons>
            </motion.div>
          </motion.div>
        </HeroContent>

        <ScrollIndicator>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Scroll to Explore
          </motion.div>
        </ScrollIndicator>
      </HeroSection>

      {/* Stats Section */}
      <StatsSection ref={statsRef}>
        <StatsGrid>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial="hidden"
              animate={statsControls}
              variants={statVariants}
              custom={index}
            >
              <StatCard>
                <StatIcon>
                  <stat.icon />
                </StatIcon>
                <StatNumber>{stat.number}</StatNumber>
                <StatLabel>{stat.label}</StatLabel>
              </StatCard>
            </motion.div>
          ))}
        </StatsGrid>
      </StatsSection>

      {/* Features Section */}
      <FeaturesSection ref={featuresRef}>
        <Container>
          <motion.div
            initial="hidden"
            animate={featuresControls}
            variants={sectionVariants}
          >
            <SectionHeader>
              <SectionSubtitle>Why Choose BenzRent</SectionSubtitle>
              <SectionTitle>Unmatched Luxury Experience</SectionTitle>
            </SectionHeader>

            <FeaturesGrid>
              <motion.div variants={featureVariants}>
                <FeatureCard>
                  <FeatureIcon $color="#10b981">
                    <FaCar />
                  </FeatureIcon>
                  <FeatureContent>
                    <h3>Premium Fleet Only</h3>
                    <p>
                      Exclusively Mercedes-Benz vehicles, meticulously
                      maintained and regularly updated
                    </p>
                  </FeatureContent>
                </FeatureCard>
              </motion.div>

              <motion.div variants={featureVariants}>
                <FeatureCard>
                  <FeatureIcon $color="#3b82f6">
                    <FaShieldAlt />
                  </FeatureIcon>
                  <FeatureContent>
                    <h3>Full Coverage Insurance</h3>
                    <p>
                      Comprehensive insurance included with every rental for
                      complete peace of mind
                    </p>
                  </FeatureContent>
                </FeatureCard>
              </motion.div>

              <motion.div variants={featureVariants}>
                <FeatureCard>
                  <FeatureIcon $color="#f59e0b">
                    <FaClock />
                  </FeatureIcon>
                  <FeatureContent>
                    <h3>24/7 Support</h3>
                    <p>
                      Round-the-clock customer service ready to assist you
                      whenever you need
                    </p>
                  </FeatureContent>
                </FeatureCard>
              </motion.div>

              <motion.div variants={featureVariants}>
                <FeatureCard>
                  <FeatureIcon $color="#ef4444">
                    <FaCheckCircle />
                  </FeatureIcon>
                  <FeatureContent>
                    <h3>Easy Booking Process</h3>
                    <p>
                      Simple 3-step booking process with instant confirmation
                      and flexible options
                    </p>
                  </FeatureContent>
                </FeatureCard>
              </motion.div>
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
            <SectionHeader>
              <SectionSubtitle>Featured Collection</SectionSubtitle>
              <SectionTitle>Our Premium Fleet</SectionTitle>
            </SectionHeader>

            <CarsGrid>
              {featuredCars.map((car, index) => (
                <motion.div
                  key={car.id}
                  variants={carCardVariants}
                  custom={index}
                >
                  <CarCard>
                    <CarImage>
                      <img src={car.image} alt={car.model} />
                      <CarOverlay>
                        <ViewDetailsButton to={`/model/${car.id}`}>
                          View Details
                        </ViewDetailsButton>
                      </CarOverlay>
                    </CarImage>
                    <CarContent>
                      <CarHeader>
                        <CarModel>{car.model}</CarModel>
                        <CarPrice>
                          ${car.price}
                          <span>/day</span>
                        </CarPrice>
                      </CarHeader>
                      <CarSeries>{car.series}</CarSeries>
                      <CarFeatures>
                        {car.features.map((feature, idx) => (
                          <FeatureTag key={idx}>{feature}</FeatureTag>
                        ))}
                      </CarFeatures>
                      <BookButton to={`/model/${car.id}`}>
                        Book This Car
                      </BookButton>
                    </CarContent>
                  </CarCard>
                </motion.div>
              ))}
            </CarsGrid>

            <ViewAllButton to="/models">
              View All Vehicles
              <FaArrowRight />
            </ViewAllButton>
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
            <DiscountCard>
              <DiscountContent>
                <DiscountBadge>
                  <FaAward />
                  Limited Time Offer
                </DiscountBadge>

                <DiscountTitle>
                  Get <DiscountHighlight>15% OFF</DiscountHighlight> Your First
                  Luxury Trip
                </DiscountTitle>

                <DiscountDescription>
                  Experience Mercedes-Benz excellence at an exclusive price. New
                  customers save 15% on their first rental. Limited time offer
                  for luxury seekers.
                </DiscountDescription>

                <DiscountFeatures>
                  <DiscountFeature>
                    <FaCheckCircle />
                    <span>Applicable on all Mercedes-Benz models</span>
                  </DiscountFeature>
                  <DiscountFeature>
                    <FaCheckCircle />
                    <span>No minimum rental period required</span>
                  </DiscountFeature>
                  <DiscountFeature>
                    <FaCheckCircle />
                    <span>Includes premium insurance coverage</span>
                  </DiscountFeature>
                  <DiscountFeature>
                    <FaCheckCircle />
                    <span>Flexible cancellation policy</span>
                  </DiscountFeature>
                </DiscountFeatures>

                <DiscountActions>
                  <DiscountButton to="/models" primary>
                    <FaCar />
                    Claim Your 15% Off
                  </DiscountButton>
                  <DiscountButton
                    as="button"
                    secondary
                    onClick={() =>
                      alert("Contact us at 1-800-MERCEDES for details")
                    }
                  >
                    <FaClock />
                    Limited Time Offer
                  </DiscountButton>
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
            <CTACard>
              <CTAContent>
                <h2>Ready to Experience Luxury?</h2>
                <p>
                  Join thousands of satisfied customers who've chosen BenzRent
                  for their premium mobility needs
                </p>
                <CTAButtons>
                  <PrimaryButton to="/models" $large>
                    Book Your Mercedes Now
                  </PrimaryButton>
                  <SecondaryButton $large>Contact Our Team</SecondaryButton>
                </CTAButtons>
              </CTAContent>
              <CTAIllustration>
                <FaCar />
              </CTAIllustration>
            </CTACard>
          </motion.div>
        </Container>
      </CTASection>
    </Wrapper>
  );
};

// Animation variants
const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.8,
    },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

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

const statVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      duration: 0.6,
    },
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

// Styled Components
const Wrapper = styled.div`
  margin-top: 4rem;
  overflow-x: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

// Hero Section
const HeroSection = styled.section`
  height: 90vh;
  min-height: 600px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 80vh;
    min-height: 500px;
  }
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const BackgroundImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.4) 100%
  );
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  max-width: 800px;
  padding: 0 2rem;

  h1 {
    font-size: 4rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    line-height: 1.1;

    @media (max-width: 768px) {
      font-size: 2.5rem;
    }

    @media (max-width: 480px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.25rem;
    margin-bottom: 2.5rem;
    opacity: 0.9;
    line-height: 1.6;

    @media (max-width: 768px) {
      font-size: 1.1rem;
    }

    @media (max-width: 480px) {
      font-size: 1rem;
    }
  }
`;

const GradientText = styled.span`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  margin-bottom: 2rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 0.9rem;

  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Button = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: ${(props) => (props.$large ? "1.25rem 2.5rem" : "1rem 2rem")};
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: ${(props) => (props.$large ? "1.1rem" : "1rem")};
  border: none;
  cursor: pointer;
  justify-content: center;

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 480px) {
    width: 100%;
    max-width: 280px;
  }
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;

  &:hover {
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
  }
`;

const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: ${(props) => (props.$large ? "1.25rem 2.5rem" : "1rem 2rem")};
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: ${(props) => (props.$large ? "1.1rem" : "1rem")};
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }

  @media (max-width: 480px) {
    width: 100%;
    max-width: 280px;
  }
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  color: white;
  opacity: 0.7;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    bottom: 1rem;
  }
`;

// Stats Section
const StatsSection = styled.section`
  padding: 4rem 0;
  background: #f8fafc;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    padding: 0 1rem;
  }
`;

const StatCard = styled.div`
  text-align: center;
  padding: 2rem 1rem;

  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
  }
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
  font-size: 1.5rem;

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const StatLabel = styled.div`
  color: #64748b;
  font-weight: 500;
  font-size: 0.9rem;
`;

// Features Section
const FeaturesSection = styled.section`
  padding: 6rem 0;
  background: white;

  @media (max-width: 768px) {
    padding: 4rem 0;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    margin-bottom: 3rem;
  }
`;

const SectionSubtitle = styled.div`
  color: #3b82f6;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FeatureCard = styled.div`
  display: flex;
  gap: 1.5rem;
  padding: 2rem;
  background: #f8fafc;
  border-radius: 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 480px) {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
    gap: 1rem;
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: ${(props) => props.$color}20;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.$color};
  font-size: 1.5rem;
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
    margin: 0 auto;
  }
`;

const FeatureContent = styled.div`
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }

  p {
    color: #64748b;
    line-height: 1.6;
  }
`;

// Showcase Section
const ShowcaseSection = styled.section`
  padding: 6rem 0;
  background: #f8fafc;

  @media (max-width: 768px) {
    padding: 4rem 0;
  }
`;

const CarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
`;

const CarCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  }
`;

const CarImage = styled.div`
  position: relative;
  height: 250px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const CarOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${CarCard}:hover & {
    opacity: 1;
  }
`;

const ViewDetailsButton = styled(Link)`
  background: #3b82f6;
  color: white;
  padding: 1rem 2rem;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: #2563eb;
    transform: scale(1.05);
  }
`;

const CarContent = styled.div`
  padding: 2rem;

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

const CarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const CarModel = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const CarPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;

  span {
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 400;
  }
`;

const CarSeries = styled.p`
  color: #64748b;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const CarFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const FeatureTag = styled.span`
  background: #f1f5f9;
  color: #475569;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const BookButton = styled(Link)`
  display: block;
  width: 100%;
  background: #10b981;
  color: white;
  text-align: center;
  padding: 1rem;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: #059669;
    transform: translateY(-2px);
  }
`;

const ViewAllButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #3b82f6;
  color: white;
  padding: 1rem 2rem;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
  margin: 0 auto;
  display: block;
  width: fit-content;

  &:hover {
    background: #2563eb;
    transform: translateY(-2px);
  }
`;

// Discount Section
const DiscountSection = styled.section`
  padding: 6rem 0;
  background: linear-gradient(135deg, #1e293b 0%, #374151 100%);

  @media (max-width: 768px) {
    padding: 4rem 0;
  }
`;

const DiscountCard = styled.div`
  background: white;
  border-radius: 30px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const DiscountContent = styled.div`
  padding: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 3rem 2rem;
  }

  @media (max-width: 480px) {
    padding: 2rem 1.5rem;
  }
`;

const DiscountBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 2rem;
  width: fit-content;
`;

const DiscountTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

const DiscountHighlight = styled.span`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const DiscountDescription = styled.p`
  font-size: 1.1rem;
  color: #64748b;
  margin-bottom: 2rem;
  line-height: 1.6;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const DiscountFeatures = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2.5rem;
`;

const DiscountFeature = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #374151;

  svg {
    color: #10b981;
    flex-shrink: 0;
  }

  span {
    font-weight: 500;
  }
`;

const DiscountActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const DiscountButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  justify-content: center;

  ${(props) =>
    props.primary
      ? `
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
    }
  `
      : `
    background: transparent;
    color: #3b82f6;
    border: 2px solid #3b82f6;

    &:hover {
      background: #3b82f6;
      color: white;
      transform: translateY(-2px);
    }
  `}

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const DiscountTerms = styled.p`
  font-size: 0.8rem;
  color: #94a3b8;
  line-height: 1.4;
`;

const DiscountVisual = styled.div`
  position: relative;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

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
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.9) 0%,
    rgba(29, 78, 216, 0.9) 100%
  );
`;

const DiscountStats = styled.div`
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  text-align: center;
  color: white;

  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

const DiscountStat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

// CTA Section
const CTASection = styled.section`
  padding: 6rem 0;
  background: linear-gradient(135deg, #1e293b 0%, #374151 100%);

  @media (max-width: 768px) {
    padding: 4rem 0;
  }
`;

const CTACard = styled.div`
  background: white;
  border-radius: 30px;
  padding: 4rem;
  display: flex;
  align-items: center;
  gap: 3rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 3rem 2rem;
    gap: 2rem;
  }

  @media (max-width: 480px) {
    padding: 2rem 1.5rem;
    border-radius: 20px;
  }
`;

const CTAContent = styled.div`
  flex: 1;

  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1rem;

    @media (max-width: 768px) {
      font-size: 2rem;
    }

    @media (max-width: 480px) {
      font-size: 1.75rem;
    }
  }

  p {
    font-size: 1.1rem;
    color: #64748b;
    margin-bottom: 2rem;
    line-height: 1.6;

    @media (max-width: 480px) {
      font-size: 1rem;
    }
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const CTAIllustration = styled.div`
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 4rem;

  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
    font-size: 3rem;
  }

  @media (max-width: 480px) {
    width: 120px;
    height: 120px;
    font-size: 2.5rem;
  }
`;

export default HomePage;
