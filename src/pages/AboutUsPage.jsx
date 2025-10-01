import React, { useRef } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from "framer-motion";

// Icons
import {
  FaAward,
  FaUsers,
  FaCar,
  FaMapMarkerAlt,
  FaStar,
  FaHeart,
  FaShieldAlt,
  FaCheckCircle,
  FaArrowRight,
  FaQuoteLeft,
  FaPlay,
} from "react-icons/fa";

// Custom SEO Hook
import usePageTitle from "../hooks/usePageTitle";
import { ROUTE_CONFIG, PATHS } from "../routes/routePaths";

const AboutPage = () => {
  const seoConfig = ROUTE_CONFIG[PATHS.ABOUT];

  // Use the custom SEO hook
  usePageTitle(seoConfig.title, seoConfig.description);

  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);
  const statsRef = useRef(null);
  const missionRef = useRef(null);

  const heroInView = useInView(heroRef, { threshold: 0.5 });
  const storyInView = useInView(storyRef, { threshold: 0.3 });
  const valuesInView = useInView(valuesRef, { threshold: 0.3 });
  const teamInView = useInView(teamRef, { threshold: 0.3 });
  const statsInView = useInView(statsRef, { threshold: 0.3 });
  const missionInView = useInView(missionRef, { threshold: 0.3 });

  // Team data
  const teamMembers = [
    {
      id: 1,
      name: "Alexander Schmidt",
      role: "Founder & CEO",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
      bio: "Former Mercedes-Benz executive with 15+ years in luxury automotive industry",
    },
    {
      id: 2,
      name: "Sophia Müller",
      role: "Operations Director",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
      bio: "Hospitality and luxury service expert with a passion for exceptional customer experiences",
    },
    {
      id: 3,
      name: "Marcus Weber",
      role: "Fleet Manager",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      bio: "Automotive engineer ensuring our fleet maintains Mercedes-Benz excellence standards",
    },
    {
      id: 4,
      name: "Elena Richter",
      role: "Customer Experience",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      bio: "Dedicated to creating unforgettable luxury rental experiences for our clients",
    },
  ];

  // Values data
  const values = [
    {
      icon: FaStar,
      title: "Excellence",
      description:
        "We strive for perfection in every detail, from vehicle maintenance to customer service.",
    },
    {
      icon: FaShieldAlt,
      title: "Trust & Safety",
      description:
        "Your safety is our priority with comprehensive insurance and rigorous vehicle inspections.",
    },
    {
      icon: FaHeart,
      title: "Passion",
      description:
        "Genuine love for Mercedes-Benz craftsmanship and delivering exceptional experiences.",
    },
    {
      icon: FaUsers,
      title: "Customer First",
      description:
        "Every decision is made with our customers' satisfaction and comfort in mind.",
    },
  ];

  // Stats data
  const stats = [
    { number: "500+", label: "Happy Customers" },
    { number: "50+", label: "Premium Vehicles" },
    { number: "99%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Support" },
  ];

  return (
    <Wrapper>
      {/* Hero Section */}
      <HeroSection ref={heroRef}>
        <HeroBackground>
          <BackgroundImage
            src="https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1600&q=80"
            alt="Mercedes-Benz Luxury Fleet"
          />
          <Overlay />
        </HeroBackground>

        <HeroContent>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <HeroBadge>
              <FaAward />
              About BenzFlex
            </HeroBadge>

            <HeroTitle>
              Redefining <GradientText>Luxury Mobility</GradientText>
            </HeroTitle>

            <HeroDescription>
              Where German engineering meets exceptional service. Experience the
              pinnacle of automotive excellence with our exclusive Mercedes-Benz
              fleet, curated for those who demand perfection.
            </HeroDescription>
          </motion.div>
        </HeroContent>
      </HeroSection>

      {/* Story Section */}
      <StorySection ref={storyRef}>
        <Container>
          <StoryGrid>
            <StoryContent>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={storyInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
              >
                <SectionSubtitle>Our Journey</SectionSubtitle>
                <SectionTitle>The BenzFlex Story</SectionTitle>

                <StoryText>
                  Founded in 2018 by a team of Mercedes-Benz enthusiasts and
                  hospitality experts, BenzFlex emerged from a simple vision: to
                  make premium automotive experiences accessible without
                  compromise.
                </StoryText>

                <StoryText>
                  What started as a single S-Class sedan has grown into Munich's
                  premier luxury vehicle rental service, featuring an exclusive
                  fleet of the latest Mercedes-Benz models. Our commitment to
                  excellence has earned us the trust of corporate clients,
                  luxury travelers, and automotive enthusiasts alike.
                </StoryText>

                <StoryFeatures>
                  <StoryFeature>
                    <FaCheckCircle />
                    <span>Founded by Mercedes-Benz industry experts</span>
                  </StoryFeature>
                  <StoryFeature>
                    <FaCheckCircle />
                    <span>
                      Exclusive partnership with Mercedes-Benz Deutschland
                    </span>
                  </StoryFeature>
                  <StoryFeature>
                    <FaCheckCircle />
                    <span>Award-winning customer service since 2018</span>
                  </StoryFeature>
                </StoryFeatures>
              </motion.div>
            </StoryContent>

            <StoryVisual>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={storyInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <StoryImage
                  src="https://images.unsplash.com/photo-1563720223182-8e41e09c2396?auto=format&fit=crop&w=800&q=80"
                  alt="BenzFlex Founding Story"
                />
                <StoryCard>
                  <StoryCardIcon>
                    <FaAward />
                  </StoryCardIcon>
                  <StoryCardContent>
                    <StoryCardNumber>5+</StoryCardNumber>
                    <StoryCardLabel>Years of Excellence</StoryCardLabel>
                  </StoryCardContent>
                </StoryCard>
              </motion.div>
            </StoryVisual>
          </StoryGrid>
        </Container>
      </StorySection>

      {/* Mission & Vision */}
      <MissionSection ref={missionRef}>
        <Container>
          <MissionGrid>
            <MissionCard>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={missionInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                <MissionIcon>
                  <FaStar />
                </MissionIcon>
                <MissionTitle>Our Mission</MissionTitle>
                <MissionDescription>
                  To provide unparalleled luxury mobility solutions that combine
                  German engineering excellence with white-glove service,
                  creating unforgettable experiences for every journey.
                </MissionDescription>
              </motion.div>
            </MissionCard>

            <MissionCard $accent={true}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={missionInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <MissionIcon>
                  <FaCar />
                </MissionIcon>
                <MissionTitle>Our Vision</MissionTitle>
                <MissionDescription>
                  To become the world's most trusted luxury mobility platform,
                  setting new standards in premium vehicle rental through
                  innovation, sustainability, and exceptional service.
                </MissionDescription>
              </motion.div>
            </MissionCard>
          </MissionGrid>
        </Container>
      </MissionSection>

      {/* Values Section */}
      <ValuesSection ref={valuesRef}>
        <Container>
          <SectionHeader $center={true}>
            <SectionSubtitle>What Drives Us</SectionSubtitle>
            <SectionTitle>Our Core Values</SectionTitle>
          </SectionHeader>

          <ValuesGrid>
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ValueCard>
                  <ValueIcon>
                    <value.icon />
                  </ValueIcon>
                  <ValueTitle>{value.title}</ValueTitle>
                  <ValueDescription>{value.description}</ValueDescription>
                </ValueCard>
              </motion.div>
            ))}
          </ValuesGrid>
        </Container>
      </ValuesSection>

      {/* Stats Section */}
      <StatsSection ref={statsRef}>
        <Container>
          <StatsGrid>
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0, opacity: 0 }}
                animate={statsInView ? { scale: 1, opacity: 1 } : {}}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  delay: index * 0.1,
                }}
              >
                <StatCard>
                  <StatNumber>{stat.number}</StatNumber>
                  <StatLabel>{stat.label}</StatLabel>
                </StatCard>
              </motion.div>
            ))}
          </StatsGrid>
        </Container>
      </StatsSection>

      {/* Team Section */}
      <TeamSection ref={teamRef}>
        <Container>
          <SectionHeader $center={true}>
            <SectionSubtitle>Meet Our Team</SectionSubtitle>
            <SectionTitle>Leadership & Expertise</SectionTitle>
          </SectionHeader>

          <TeamGrid>
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                animate={teamInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <TeamCard>
                  <TeamImage>
                    <img src={member.image} alt={member.name} />
                    <TeamOverlay>
                      <TeamSocial>
                        <SocialLink href="#">LinkedIn</SocialLink>
                      </TeamSocial>
                    </TeamOverlay>
                  </TeamImage>
                  <TeamContent>
                    <TeamName>{member.name}</TeamName>
                    <TeamRole>{member.role}</TeamRole>
                    <TeamBio>{member.bio}</TeamBio>
                  </TeamContent>
                </TeamCard>
              </motion.div>
            ))}
          </TeamGrid>
        </Container>
      </TeamSection>

      {/* CTA Section */}
      <CTASection>
        <Container>
          <CTACard>
            <CTAContent>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <CTATitle>
                  Ready to Experience <GradientText>Mercedes-Benz</GradientText>{" "}
                  Excellence?
                </CTATitle>
                <CTADescription>
                  Join thousands of satisfied customers who trust BenzFlex for
                  their luxury mobility needs. Experience the difference of
                  premium service and German engineering.
                </CTADescription>
                <CTAButtons>
                  <PrimaryButton to="/models">
                    Explore Our Fleet
                    <FaArrowRight />
                  </PrimaryButton>
                  <SecondaryButton to="/contact">Contact Us</SecondaryButton>
                </CTAButtons>
              </motion.div>
            </CTAContent>
          </CTACard>
        </Container>
      </CTASection>
    </Wrapper>
  );
};

// Styled Components (keep all your existing styled components exactly as they are)
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
  height: 70vh;
  min-height: 500px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 60vh;
    min-height: 400px;
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
  object-position: center;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.8) 0%,
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

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
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

const HeroTitle = styled.h1`
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
`;

const GradientText = styled.span`
  background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeroDescription = styled.p`
  font-size: 1.25rem;
  opacity: 0.9;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

// Story Section
const StorySection = styled.section`
  padding: 6rem 0;
  background: white;

  @media (max-width: 768px) {
    padding: 4rem 0;
  }
`;

const StoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const StoryContent = styled.div`
  @media (max-width: 968px) {
    order: 2;
  }
`;

const StoryVisual = styled.div`
  position: relative;

  @media (max-width: 968px) {
    order: 1;
  }
`;

const StoryImage = styled.img`
  width: 100%;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const StoryCard = styled.div`
  position: absolute;
  bottom: -2rem;
  left: -2rem;
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    position: relative;
    bottom: auto;
    left: auto;
    margin-top: 1rem;
  }
`;

const StoryCardIcon = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
`;

const StoryCardContent = styled.div``;

const StoryCardNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
`;

const StoryCardLabel = styled.div`
  font-size: 0.9rem;
  color: #64748b;
`;

const StoryText = styled.p`
  font-size: 1.1rem;
  color: #64748b;
  line-height: 1.7;
  margin-bottom: 1.5rem;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const StoryFeatures = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`;

const StoryFeature = styled.div`
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

// Section Components
const SectionHeader = styled.div`
  text-align: ${(props) => (props.$center ? "center" : "left")};
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    margin-bottom: 3rem;
  }
`;

const SectionSubtitle = styled.div`
  color: #d32f2f;
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

// Mission Section
const MissionSection = styled.section`
  padding: 4rem 0;
  background: #f8fafc;
`;

const MissionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const MissionCard = styled.div`
  background: ${(props) =>
    props.$accent
      ? "linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)"
      : "white"};
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  color: ${(props) => (props.$accent ? "white" : "inherit")};

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const MissionIcon = styled.div`
  width: 60px;
  height: 60px;
  background: ${(props) =>
    props.$accent
      ? "rgba(255, 255, 255, 0.1)"
      : "linear-gradient(135deg, #d32f2f20 0%, #b71c1c20 100%)"};
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.$accent ? "white" : "#d32f2f")};
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
`;

const MissionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: inherit;
`;

const MissionDescription = styled.p`
  line-height: 1.7;
  opacity: ${(props) => (props.$accent ? 0.9 : 0.8)};
  font-size: 1.1rem;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

// Values Section
const ValuesSection = styled.section`
  padding: 6rem 0;
  background: white;

  @media (max-width: 768px) {
    padding: 4rem 0;
  }
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const ValueCard = styled.div`
  padding: 2.5rem;
  background: #f8fafc;
  border-radius: 20px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 480px) {
    padding: 2rem;
  }
`;

const ValueIcon = styled.div`
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  margin: 0 auto 1.5rem;
`;

const ValueTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
`;

const ValueDescription = styled.p`
  color: #64748b;
  line-height: 1.6;
`;

// Stats Section
const StatsSection = styled.section`
  padding: 4rem 0;
  background: linear-gradient(135deg, #1e293b 0%, #374151 100%);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const StatCard = styled.div`
  text-align: center;
  color: white;
  padding: 2rem 1rem;

  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
  }
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const StatLabel = styled.div`
  font-size: 1rem;
  opacity: 0.9;
  font-weight: 500;
`;

// Team Section
const TeamSection = styled.section`
  padding: 6rem 0;
  background: #f8fafc;

  @media (max-width: 768px) {
    padding: 4rem 0;
  }
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const TeamCard = styled.div`
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

const TeamImage = styled.div`
  position: relative;
  height: 300px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  ${TeamCard}:hover & img {
    transform: scale(1.05);
  }
`;

const TeamOverlay = styled.div`
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

  ${TeamCard}:hover & {
    opacity: 1;
  }
`;

const TeamSocial = styled.div``;

const SocialLink = styled.a`
  color: white;
  text-decoration: none;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border: 2px solid white;
  border-radius: 5px;
  transition: all 0.2s;

  &:hover {
    background: white;
    color: #1e293b;
  }
`;

const TeamContent = styled.div`
  padding: 2rem;

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

const TeamName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const TeamRole = styled.div`
  color: #d32f2f;
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const TeamBio = styled.p`
  color: #64748b;
  line-height: 1.6;
  font-size: 0.9rem;
`;

// CTA Section
const CTASection = styled.section`
  padding: 6rem 0;
  background: white;

  @media (max-width: 768px) {
    padding: 4rem 0;
  }
`;

const CTACard = styled.div`
  background: linear-gradient(135deg, #1e293b 0%, #374151 100%);
  border-radius: 30px;
  padding: 4rem;
  text-align: center;
  color: white;

  @media (max-width: 768px) {
    padding: 3rem 2rem;
  }

  @media (max-width: 480px) {
    padding: 2rem 1.5rem;
    border-radius: 20px;
  }
`;

const CTAContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

const CTADescription = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 2.5rem;
  line-height: 1.6;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`;

// Button Components
const BaseButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  justify-content: center;
  font-family: inherit;

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 480px) {
    width: 100%;
    max-width: 280px;
  }
`;

const PrimaryButton = styled(BaseButton)`
  background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
  color: white;

  &:hover {
    box-shadow: 0 10px 25px rgba(211, 47, 47, 0.3);
  }
`;

const SecondaryButton = styled(BaseButton)`
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

export default AboutPage;
