import React, { useRef, useEffect, useMemo } from "react";
import styled from "styled-components";
import { motion, useInView, useAnimation } from "framer-motion";
import { devices } from "../../styles/GlobalStyles";

// Import reusable components
import HeroSection from "../../components/ui/HeroSection";
import SectionHeader from "../../components/ui/SectionHeader";
import StatsGrid from "../../components/ui/StatsGrid";
import CarCard from "../../features/cars/CarCard";
import FeatureCard from "../../features/cars/FeatureCard";
import Container from "../../components/layout/Container";
import CarGrid from "../../components/layout/CarGrid";

// Import buttons
import {
  PrimaryButton,
  SecondaryButton,
  AccentButton,
  ButtonLink,
  SecondaryButtonLink,
} from "../../components/ui/Button";

// Import hooks and utilities
import { useGetCars } from "../cars/useCar";
import { getRandomItems } from "../../utils/helper";
import { ROUTE_CONFIG, PATHS } from "../../config/constants";
import usePageTitle from "../../app/hooks/usePageTitle";

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

  const heroControls = useAnimation();
  const featuresControls = useAnimation();
  const showcaseControls = useAnimation();
  const statsControls = useAnimation();
  const discountControls = useAnimation();
  const ctaControls = useAnimation();

  const heroInView = useInView(heroRef, { threshold: 0.5 });
  const featuresInView = useInView(featuresRef, { threshold: 0.3 });
  const showcaseInView = useInView(showcaseRef, { threshold: 0.2 });
  const statsInView = useInView(statsRef, { threshold: 0.3 });
  const discountInView = useInView(discountRef, { threshold: 0.3 });
  const ctaInView = useInView(ctaRef, { threshold: 0.4 });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => { if (heroInView) heroControls.start("visible"); }, [heroInView, heroControls]);
  useEffect(() => { if (featuresInView) featuresControls.start("visible"); }, [featuresInView, featuresControls]);
  useEffect(() => { if (showcaseInView) showcaseControls.start("visible"); }, [showcaseInView, showcaseControls]);
  useEffect(() => { if (statsInView) statsControls.start("visible"); }, [statsInView, statsControls]);
  useEffect(() => { if (discountInView) discountControls.start("visible"); }, [discountInView, discountControls]);
  useEffect(() => { if (ctaInView) ctaControls.start("visible"); }, [ctaInView, ctaControls]);

  // 🔗 Opens React Native app (Dev + iOS + Android)
  const openMobileApp = () => {
    // 👇 Replace with your LAN IP (shown in Expo terminal)
    const localIp = window.location.hostname === "localhost"
      ? "192.168.100.58"
      : window.location.hostname;

    const expoDevUrl = `exp://${localIp}:8081`; // For Expo Go
    const rnDevUrl = `myapp://open`; // For RN CLI custom scheme

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const isDev = process.env.NODE_ENV === "development";

    if (isDev) {
      console.log("🚀 Opening React Native app in dev mode...");
      window.location.href = expoDevUrl;

      setTimeout(() => {
        alert(
          "If the app didn’t open, make sure your Expo/React Native app is running and your device is on the same Wi-Fi network."
        );
      }, 1200);
      return;
    }

    // Production fallback logic
    const appUrl = rnDevUrl;
    const androidFallback = "https://play.google.com/store/apps/details?id=com.benzflex";
    const iosFallback = "https://apps.apple.com/app/id1234567890";
    const fallbackUrl = isIOS ? iosFallback : androidFallback;
    const now = Date.now();

    window.location.href = appUrl;
    setTimeout(() => {
      if (Date.now() - now < 1500) {
        window.location.href = fallbackUrl;
      }
    }, 1000);
  };

  // Featured cars data
  const featuredCars = useMemo(() => {
    if (cars && cars.length > 0) {
      return getRandomItems(cars, 6).map((car, index) => ({
        id: car._id || index + 1,
        model: car.model || "Mercedes-Benz Model",
        series: car.series || "Premium Series",
        price: car.price || 199,
        status: car.status || "available",
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
            backgroundVideo="/benzflex.mp4"
            badge={
              <>
                <FaStar size={16} /> Premium Luxury Rentals
              </>
            }
            title={
              <>
                <WhiteText>Experience</WhiteText>{" "}
                <GradientText>Benzflex</GradientText>{" "}
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

        {/* Showcase Section */}
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
                {featuredCars.map((car, index) => (
                  <motion.div key={car.id} variants={carCardVariants} custom={index}>
                    <CarCard car={car} />
                  </motion.div>
                ))}
              </CarGrid>
              <ViewAllWrapper>
                <SecondaryButtonLink to="/models" $size="lg">
                  View All Vehicles <FaArrowRight size={18} />
                </SecondaryButtonLink>
              </ViewAllWrapper>
            </motion.div>
          </Container>
        </ShowcaseSection>

        {/* CTA Section */}
        <CTASection ref={ctaRef}>
          <Container>
            <motion.div initial="hidden" animate={ctaControls} variants={ctaVariants}>
              <CTACard className="luxury-card">
                <CTAContent>
                  <h2>Ready to Experience Luxury?</h2>
                  <p>
                    Join thousands of satisfied customers who&apos;ve chosen BenzRent for their premium mobility needs.
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
                    {/* 🚀 Open Mobile App Button */}
                    <SecondaryButton as="button" $size="lg" onClick={openMobileApp}>
                      Open Mobile App
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
  visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.2 } },
};
const featureVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const carCardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};
const ctaVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

// Styled components
const Wrapper = styled.div`margin-top: 4rem; overflow-x: hidden;`;
const HeroContainer = styled.div`width: 100%; overflow: hidden;`;
const StatsSection = styled.section`padding: var(--space-2xl) 0; background: var(--surface);`;
const FeaturesSection = styled.section`padding: var(--space-2xl) 0; background: var(--white);`;
const FeaturesGrid = styled.div`display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-lg); @media ${devices.md} { grid-template-columns: 1fr; }`;
const ShowcaseSection = styled.section`padding: var(--space-2xl) 0; background: var(--surface);`;
const ViewAllWrapper = styled.div`display: flex; justify-content: center; margin-top: var(--space-xl);`;
const CTASection = styled.section`padding: var(--space-2xl) 0; background: var(--gradient-luxury);`;
const CTACard = styled.div`background: var(--white); border-radius: var(--radius-3xl); padding: var(--space-2xl); display: flex; align-items: center; gap: var(--space-xl);`;
const CTAContent = styled.div`flex: 1;`;
const CTAButtons = styled.div`display: flex; gap: var(--space-md); flex-wrap: wrap;`;
const CTAIllustration = styled.div`width: 200px; height: 200px; background: var(--gradient-primary); border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; color: var(--white);`;
const GradientText = styled.span`background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent;`;
const WhiteText = styled.span`color: var(--white);`;

export default HomePage;
