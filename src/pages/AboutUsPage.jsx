import React, { useRef } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
 
import { motion, useInView } from "framer-motion";
import { devices } from "../styles/GlobalStyles";
import { PrimaryButton, SecondaryButton } from "../components/ui/Button";

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
                  src="/images/ben23.jpg"
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
  margin-top: var(--space-2xl);
  overflow-x: hidden;
`;

const Container = styled.div`
  max-width: 120rem;
  margin: 0 auto;
  padding: 0 var(--space-lg);

  @media ${devices.md} {
    padding: 0 var(--space-sm);
  }
`;

// Hero Section
const HeroSection = styled.section`
  height: 70vh;
  min-height: 50rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  @media ${devices.md} {
    height: 60vh;
    min-height: 40rem;
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
  background: var(--gradient-overlay);
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  color: var(--white);
  max-width: 80rem;
  padding: 0 var(--space-lg);

  @media ${devices.md} {
    padding: 0 var(--space-sm);
  }
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: var(--space-xs) var(--space-md);
  border-radius: 50px;
  margin-bottom: 2rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 0.9rem;

  @media ${devices.xs1} {
    padding: var(--space-xs) var(--space-md);
    font-size: 0.8rem;
  }
`;

const HeroTitle = styled.h1`
  font-size: var(--text-7xl);
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  color: var(--white);

  @media ${devices.md} {
    font-size: var(--text-4xl);
  }

  @media (max-width: 480px) {
    font-size: var(--text-4xl);
  }
`;

const GradientText = styled.span`
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeroDescription = styled.p`
  font-size: var(--text-xl);
  color: var(--white);
  opacity: 0.9;
  line-height: 1.6;
  max-width: 60rem;
  margin: 0 auto;

  @media ${devices.md} {
    font-size: var(--text-lg);
  }

  @media ${devices.xs1} {
    font-size: var(--text-base);
  }
`;

// Story Section
const StorySection = styled.section`
  /* padding: 6rem 0; */
  padding: var(--space-3xl);
  background: var(--white);

  @media ${devices.md} {
    padding: var(--space-2x) 0;
  }
`;

const StoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media ${devices.md2} {
    margin-top: var(--space-lg);
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const StoryContent = styled.div`
  @media ${devices.md2} {
    order: 2;
  }
`;

const StoryVisual = styled.div`
  position: relative;

  @media ${devices.md2} {
    order: 1;
  }
`;

const StoryImage = styled.img`
  width: 100%;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
`;

const StoryCard = styled.div`
  position: absolute;
  bottom: -2rem;
  left: -2rem;
  background: var(--accent);
  padding: var(--space-lg);
  border-radius: 15px;
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  gap: var(--space-sm);

  @media ${devices.md} {
    position: relative;
    bottom: auto;
    left: auto;
    margin-top: var(--space-sm);
  }
`;

const StoryCardIcon = styled.div`
  width: 50px;
  height: 50px;
  background: var(--gradient-primary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  font-size: var(--text-xl);
`;

const StoryCardContent = styled.div``;

const StoryCardNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-dark);
`;

const StoryCardLabel = styled.div`
  font-size: var(--text-sm);
  color: var(--primary-dark);
`;

const StoryText = styled.p`
  font-size: var(--text-lg);
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: var(--space-md);

  @media ${devices.xs1} {
    font-size: var(--text-base);
  }
`;

const StoryFeatures = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-top: var(--space-lg);
`;

const StoryFeature = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--text-secondary);

  svg {
    color: var(--success);
    flex-shrink: 0;
  }

  span {
    font-weight: var(--font-medium);
  }
`;

// Section Components
const SectionHeader = styled.div`
  text-align: ${(props) => (props.$center ? "center" : "left")};
  margin-bottom: var(--space-2xl);

  @media ${devices.md} {
    margin-bottom: var(--space-xl);
  }
`;

const SectionSubtitle = styled.div`
  color: var(--primary);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: var(--space-sm);
  font-size: var(--text-sm);
`;

const SectionTitle = styled.h2`
  font-size: var(--text-5xl);
  font-weight: var(--font-bold);
  color: var(--secondary);
  margin-bottom: var(--space-sm);
  @media ${devices.md} {
    font-size: var(--text-5xl);
  }

  @media ${devices.xs1} {
    font-size: var(--text-3xl);
  }
`;

// Mission Section
const MissionSection = styled.section`
  padding: 4rem 0;
  background: var(--white);
`;

const MissionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }
`;

const MissionCard = styled.div`
  background: ${(props) =>
    props.$accent ? "var(--gradient-accent)" : "white"};
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  color: ${(props) => (props.$accent ? "var(--primary-dark)" : "inherit")};

  @media ${devices.md} {
    padding: var(--space-lg);
  }
`;

const MissionIcon = styled.div`
  width: 6rem;
  height: 6rem;
  background: ${(props) =>
    props.$accent ? "rgba(255, 255, 255, 0.1)" : "var(--gradient-primary)"};
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.$accent ? "var(--white)" : "var(--accent)")};
  font-size: var(--text-2xl);
  margin-bottom: var(--space-md);
`;

const MissionTitle = styled.h3`
  font-size: var(--text-3xl);
  font-weight: var(--font-semibold);
  margin-bottom: 1rem;
  color: inherit;
`;

const MissionDescription = styled.p`
  line-height: 1.7;
  opacity: ${(props) => (props.$accent ? 0.9 : 0.8)};
  font-size: var(--text-xl);

  @media ${devices.xs1} {
    font-size: var(--text-base);
  }
`;

// Values Section
const ValuesSection = styled.section`
  padding: var(--space-3xl) 0;
  background: var(--white);

  @media ${devices.md} {
    padding: var(--space-2xl) 0;
  }
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;

  @media ${devices.md} {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }
`;

const ValueCard = styled.div`
  padding: var(--space-lg);
  background: var(--white);
  border-radius: var(--radius-xl);
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }

  @media ${devices.xs1} {
    padding: var(--space-lg);
  }
`;

const ValueIcon = styled.div`
  width: 7rem;
  height: 7rem;
  background: var(--gradient-accent);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  font-size: 1.5rem;
  margin: 0 auto var(--space-md);
`;

const ValueTitle = styled.h3`
  font-size: var(--text-3xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
`;

const ValueDescription = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
`;

// Stats Section
const StatsSection = styled.section`
  padding: var(--space-2xl) 0;
  background: var(--gradient-accent);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-lg);

  @media ${devices.md} {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-md);
  }

  @media ${devices.xs1} {
    grid-template-columns: 1fr;
    gap: var(--space-sm);
  }
`;

const StatCard = styled.div`
  text-align: center;
  color: var(--white);
  padding: var(--space-lg) var(--space-sm);

  @media ${devices.xs1} {
    padding: 1.5rem 1rem;
  }
`;

const StatNumber = styled.div`
  font-size: var(--text-5xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-xs);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media ${devices.md} {
    font-size: var(--text-4xl);
  }
`;

const StatLabel = styled.div`
  font-size: var(--text-base);
  opacity: 0.9;
  font-weight: --font-medium;
`;

// Team Section
const TeamSection = styled.section`
  padding: 6rem 0;
  background: var(--white);

  @media ${devices.md} {
    padding: var(--space-2xl) 0;
  }
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-lg);

  @media ${devices.lg} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${devices.sm} {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }
`;

const TeamCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-xl);
  }
`;

const TeamImage = styled.div`
  position: relative;
  height: 30rem;
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
  color: var(--white);
  text-decoration: none;
  font-weight: var(--font-semibold);
  padding: var(--space-xs) var(--space-sm);
  border: 2px solid white;
  border-radius: var(--radius-sm);
  transition: all 0.2s;

  &:hover {
    background: var(--white);
    color: var(--secondary);
  }
`;

const TeamContent = styled.div`
  padding: var(--space-lg);

  @media ${devices.xs1} {
    padding: var(--space-md);
  }
`;

const TeamName = styled.h3`
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--secondary-light);
  margin-bottom: var(--space-xs);
`;

const TeamRole = styled.div`
  color: var(--accent);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-sm);
  font-size: var(--text-sm);
`;

const TeamBio = styled.p`
  color: var(--secondary-light);
  line-height: 1.6;
  font-size: var(--text-sm);
`;

// CTA Section
const CTASection = styled.section`
  padding: 6rem 0;
  background: var(--white);

  @media ${devices.md} {
    padding: var(--space-2xl) 0;
  }
`;

const CTACard = styled.div`
  background: var(--gradient-luxury);
  border-radius: var(--radius-3xl);
  padding: var(--space-2xl);
  text-align: center;
  color: var(--white);

  @media ${devices.md} {
    padding: var(--space-xl) var(--space-lg);
  }

  @media (max-width: 480px) {
    padding: var(--space-lg) var(--space-md);
    border-radius: var(--radius-xl);
  }
`;

const CTAContent = styled.div`
  max-width: 60rem;
  margin: 0 auto;
`;

const CTATitle = styled.h2`
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-m) d;
  line-height: 1.2;

  @media ${devices.md} {
    font-size: var(--text-4xl);
  }

  @media ${devices.xs1} {
    font-size: var(--text-3xl);
  }
`;

const CTADescription = styled.p`
  font-size: var(--text-lg);
  opacity: 0.9;
  margin-bottom: var(--space-lg);
  line-height: 1.6;

  @media ${devices.xs1} {
    font-size: var(--text-base);
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: var(--space-sm);
  justify-content: center;
  flex-wrap: wrap;

  @media ${devices.xs1} {
    flex-direction: column;
    align-items: center;
  }
`;

export default AboutPage;
