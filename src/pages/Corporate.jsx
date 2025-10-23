// src/pages/CorporatePage.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  LuxuryCard, 
 
} from '../components/Cards/Card'
import { 
  PrimaryButton, 
  SecondaryButton,
 
} from '../components/ui/Button';
import {
 
} from '../components/ui/LoadingSpinner';
import { 
  FaAward, 
  FaUsers, 
  FaCar, 
  FaGlobeAmericas,
  FaShieldAlt,
  FaLeaf,
  FaArrowRight,
  
  FaStar,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaLinkedin,
  FaTwitter,
  FaInstagram
} from 'react-icons/fa';

// Mock data
const COMPANY_STATS = [
  { icon: FaCar, number: "500+", label: "Luxury Vehicles", suffix: "Fleet" },
  { icon: FaUsers, number: "50,000+", label: "Satisfied", suffix: "Clients" },
  { icon: FaGlobeAmericas, number: "25+", label: "Countries", suffix: "Worldwide" },
  { icon: FaAward, number: "15", label: "Industry", suffix: "Awards" }
];

const COMPANY_VALUES = [
  {
    icon: FaShieldAlt,
    title: "Excellence & Quality",
    description: "Uncompromising standards in every vehicle and service we provide.",
    color: "var(--primary)"
  },
  {
    icon: FaUsers,
    title: "Customer First",
    description: "Building lasting relationships through exceptional customer experiences.",
    color: "var(--accent)"
  },
  {
    icon: FaLeaf,
    title: "Sustainability",
    description: "Commitment to eco-friendly practices and sustainable luxury.",
    color: "var(--success)"
  },
  {
    icon: FaGlobeAmericas,
    title: "Global Excellence",
    description: "World-class service standards across all our locations.",
    color: "var(--info)"
  }
];

const LEADERSHIP_TEAM = [
  {
    name: "Alexander von Hardenberg",
    position: "Chief Executive Officer",
    image: "/api/placeholder/300/300",
    bio: "Former Mercedes-Benz executive with 20+ years in luxury automotive industry.",
    achievements: ["20+ Years Experience", "Luxury Auto Pioneer", "Global Expansion Leader"]
  },
  {
    name: "Isabella Romano",
    position: "Chief Operations Officer",
    image: "/api/placeholder/300/300",
    bio: "Operations specialist with background in luxury hospitality and fleet management.",
    achievements: ["Process Optimization", "Quality Assurance", "Team Leadership"]
  },
  {
    name: "James Chen",
    position: "Chief Technology Officer",
    image: "/api/placeholder/300/300",
    bio: "Tech innovator focused on enhancing digital luxury experiences.",
    achievements: ["Digital Innovation", "System Architecture", "Customer Experience"]
  },
  {
    name: "Sophie Laurent",
    position: "Head of Customer Experience",
    image: "/api/placeholder/300/300",
    bio: "Luxury service expert with background in premium hospitality.",
    achievements: ["Service Excellence", "Client Relations", "Training & Development"]
  }
];

const COMPANY_TIMELINE = [
  {
    year: "2010",
    title: "Foundation",
    description: "BenzFlex founded with a vision to redefine luxury car rentals.",
    milestone: "First Mercedes-Benz S-Class added to fleet"
  },
  {
    year: "2014",
    title: "Global Expansion",
    description: "Expanded operations to 10 international destinations.",
    milestone: "Opened flagship location in Dubai"
  },
  {
    year: "2018",
    title: "Digital Transformation",
    description: "Launched proprietary booking platform and mobile app.",
    milestone: "1M+ app downloads in first year"
  },
  {
    year: "2022",
    title: "Sustainability Initiative",
    description: "Introduced electric and hybrid luxury vehicles to fleet.",
    milestone: "50+ electric vehicles added"
  },
  {
    year: "2024",
    title: "Industry Leadership",
    description: "Recognized as top luxury car rental service globally.",
    milestone: "15 industry awards received"
  }
];

const AWARDS = [
  {
    year: "2024",
    title: "Luxury Travel Awards",
    award: "Best Premium Car Rental Service",
    category: "Global Luxury"
  },
  {
    year: "2023",
    title: "Business Excellence Awards",
    award: "Innovation in Customer Experience",
    category: "Technology"
  },
  {
    year: "2023",
    title: "Sustainable Business Awards",
    award: "Green Fleet Initiative",
    category: "Environmental"
  },
  {
    year: "2022",
    title: "International Auto Awards",
    award: "Luxury Service Provider of the Year",
    category: "Service Excellence"
  }
];

const CorporatePage = () => {
  const [activeTab, setActiveTab] = useState("mission");
//   const [videoPlaying, setVideoPlaying] = useState(false);

  return (
    <CorporateContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroBackground>
          <HeroOverlay />
          <HeroPattern />
        </HeroBackground>
        <HeroContent>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <HeroBadge>Corporate Excellence</HeroBadge>
            <HeroTitle>
              Redefining <span className="gradient-text">Luxury Mobility</span>
            </HeroTitle>
            <HeroDescription>
              BenzFlex stands at the intersection of automotive excellence and unparalleled service, 
              delivering premium mobility solutions to discerning clients worldwide.
            </HeroDescription>
            <HeroStats>
              {COMPANY_STATS.map((stat, index) => (
                <StatItem
                  key={stat.label}
                  as={motion.div}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <stat.icon />
                  <StatNumber>{stat.number}</StatNumber>
                  <StatLabel>{stat.label}</StatLabel>
                  <StatSuffix>{stat.suffix}</StatSuffix>
                </StatItem>
              ))}
            </HeroStats>
          </motion.div>
        </HeroContent>
      </HeroSection>

      {/* Mission & Vision Section */}
      <Section>
        <Container>
          <SectionHeader>
            <SectionTitle>Our Purpose & Vision</SectionTitle>
            <SectionSubtitle>
              Driving the future of luxury mobility with innovation and excellence
            </SectionSubtitle>
          </SectionHeader>

          <TabNavigation>
            <TabButton 
              $active={activeTab === "mission"} 
              onClick={() => setActiveTab("mission")}
            >
              Our Mission
            </TabButton>
            <TabButton 
              $active={activeTab === "vision"} 
              onClick={() => setActiveTab("vision")}
            >
              Our Vision
            </TabButton>
            <TabButton 
              $active={activeTab === "values"} 
              onClick={() => setActiveTab("values")}
            >
              Our Values
            </TabButton>
          </TabNavigation>

          <TabContent>
            {activeTab === "mission" && (
              <MissionVisionCard>
                <MissionContent>
                  <MissionTitle>Our Mission</MissionTitle>
                  <MissionText>
                    To provide unparalleled luxury mobility experiences by combining 
                    the finest automotive engineering with exceptional service, creating 
                    moments that exceed expectations and build lasting relationships with 
                    our discerning clientele.
                  </MissionText>
                  <MissionHighlights>
                    <HighlightItem>
                      <FaStar />
                      Premium vehicle selection and maintenance
                    </HighlightItem>
                    <HighlightItem>
                      <FaStar />
                      Personalized concierge services
                    </HighlightItem>
                    <HighlightItem>
                      <FaStar />
                      Global network with local expertise
                    </HighlightItem>
                    <HighlightItem>
                      <FaStar />
                      Sustainable luxury practices
                    </HighlightItem>
                  </MissionHighlights>
                </MissionContent>
                <MissionVisual>
                  <MissionImage src="/api/placeholder/500/400" alt="Mission" />
                </MissionVisual>
              </MissionVisionCard>
            )}

            {activeTab === "vision" && (
              <MissionVisionCard>
                <MissionContent>
                  <MissionTitle>Our Vision</MissionTitle>
                  <MissionText>
                    To be the world&apos;s most trusted and innovative luxury mobility partner, 
                    setting new standards in sustainable premium transportation while 
                    continuously enhancing the customer experience through technology and 
                    personalized service.
                  </MissionText>
                  <VisionGoals>
                    <GoalItem>
                      <GoalNumber>01</GoalNumber>
                      <GoalContent>
                        <GoalTitle>Global Leadership</GoalTitle>
                        <GoalDescription>
                          Expand to 50+ countries while maintaining premium service standards
                        </GoalDescription>
                      </GoalContent>
                    </GoalItem>
                    <GoalItem>
                      <GoalNumber>02</GoalNumber>
                      <GoalContent>
                        <GoalTitle>Sustainable Innovation</GoalTitle>
                        <GoalDescription>
                          Transition 80% of fleet to electric/hybrid by 2030
                        </GoalDescription>
                      </GoalContent>
                    </GoalItem>
                    <GoalItem>
                      <GoalNumber>03</GoalNumber>
                      <GoalContent>
                        <GoalTitle>Digital Excellence</GoalTitle>
                        <GoalDescription>
                          Pioneer AI-driven personalized mobility solutions
                        </GoalDescription>
                      </GoalContent>
                    </GoalItem>
                  </VisionGoals>
                </MissionContent>
                <MissionVisual>
                  <MissionImage src="/api/placeholder/500/400" alt="Vision" />
                </MissionVisual>
              </MissionVisionCard>
            )}

            {activeTab === "values" && (
              <ValuesGrid>
                {COMPANY_VALUES.map((value, index) => (
                  <ValueCard
                    key={value.title}
                    as={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <ValueIcon $color={value.color}>
                      <value.icon />
                    </ValueIcon>
                    <ValueTitle>{value.title}</ValueTitle>
                    <ValueDescription>{value.description}</ValueDescription>
                  </ValueCard>
                ))}
              </ValuesGrid>
            )}
          </TabContent>
        </Container>
      </Section>

      {/* Leadership Team Section */}
      <Section $dark>
        <Container>
          <SectionHeader>
            <SectionTitle>Leadership Team</SectionTitle>
            <SectionSubtitle>
              Experienced professionals driving innovation in luxury mobility
            </SectionSubtitle>
          </SectionHeader>

          <TeamGrid>
            {LEADERSHIP_TEAM.map((member, index) => (
              <TeamCard
                key={member.name}
                as={motion.div}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <TeamImage>
                  <img src={member.image} alt={member.name} />
                  <TeamOverlay>
                    <SecondaryButton $size="sm">
                      View Profile <FaArrowRight />
                    </SecondaryButton>
                  </TeamOverlay>
                </TeamImage>
                <TeamContent>
                  <TeamName>{member.name}</TeamName>
                  <TeamPosition>{member.position}</TeamPosition>
                  <TeamBio>{member.bio}</TeamBio>
                  <TeamAchievements>
                    {member.achievements.map(achievement => (
                      <Achievement key={achievement}>
                        <FaStar />
                        {achievement}
                      </Achievement>
                    ))}
                  </TeamAchievements>
                </TeamContent>
              </TeamCard>
            ))}
          </TeamGrid>
        </Container>
      </Section>

      {/* Company Timeline */}
      <Section>
        <Container>
          <SectionHeader>
            <SectionTitle>Our Journey</SectionTitle>
            <SectionSubtitle>
              Milestones in our pursuit of luxury mobility excellence
            </SectionSubtitle>
          </SectionHeader>

          <Timeline>
            {COMPANY_TIMELINE.map((item, index) => (
              <TimelineItem
                key={item.year}
                as={motion.div}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <TimelineYear>{item.year}</TimelineYear>
                <TimelineContent $align={index % 2 === 0 ? 'left' : 'right'}>
                  <TimelineTitle>{item.title}</TimelineTitle>
                  <TimelineDescription>{item.description}</TimelineDescription>
                  <TimelineMilestone>
                    <FaAward />
                    {item.milestone}
                  </TimelineMilestone>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Container>
      </Section>

      {/* Awards & Recognition */}
      <Section $dark>
        <Container>
          <SectionHeader>
            <SectionTitle>Awards & Recognition</SectionTitle>
            <SectionSubtitle>
              Industry recognition for our commitment to excellence
            </SectionSubtitle>
          </SectionHeader>

          <AwardsGrid>
            {AWARDS.map((award, index) => (
              <AwardCard
                key={award.title}
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <AwardYear>{award.year}</AwardYear>
                <AwardTitle>{award.title}</AwardTitle>
                <AwardName>{award.award}</AwardName>
                <AwardCategory>{award.category}</AwardCategory>
                <AwardIcon>
                  <FaAward />
                </AwardIcon>
              </AwardCard>
            ))}
          </AwardsGrid>
        </Container>
      </Section>

      {/* Contact Section */}
      <Section>
        <Container>
          <ContactGrid>
            <ContactContent>
              <SectionTitle>Corporate Headquarters</SectionTitle>
              <ContactDescription>
                Connect with our leadership team for partnership opportunities, 
                media inquiries, or corporate services.
              </ContactDescription>
              
              <ContactInfo>
                <ContactItem>
                  <FaMapMarkerAlt />
                  <div>
                    <ContactLabel>Address</ContactLabel>
                    <ContactText>
                      BenzFlex Tower<br />
                      123 Luxury Avenue<br />
                      Monaco, MC 98000
                    </ContactText>
                  </div>
                </ContactItem>
                
                <ContactItem>
                  <FaPhone />
                  <div>
                    <ContactLabel>Phone</ContactLabel>
                    <ContactText>+1 (555) 123-LUXURY</ContactText>
                  </div>
                </ContactItem>
                
                <ContactItem>
                  <FaEnvelope />
                  <div>
                    <ContactLabel>Email</ContactLabel>
                    <ContactText>corporate@benzflex.com</ContactText>
                  </div>
                </ContactItem>
              </ContactInfo>

              <SocialLinks>
                <SocialLink>
                  <FaLinkedin />
                </SocialLink>
                <SocialLink>
                  <FaTwitter />
                </SocialLink>
                <SocialLink>
                  <FaInstagram />
                </SocialLink>
              </SocialLinks>
            </ContactContent>

            <ContactFormCard>
              <ContactFormTitle>Corporate Inquiry</ContactFormTitle>
              <ContactForm>
                <FormRow>
                  <FormGroup>
                    <FormLabel>Full Name</FormLabel>
                    <FormInput type="text" placeholder="Enter your name" />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Company</FormLabel>
                    <FormInput type="text" placeholder="Your company" />
                  </FormGroup>
                </FormRow>
                <FormGroup>
                  <FormLabel>Email</FormLabel>
                  <FormInput type="email" placeholder="corporate@company.com" />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Subject</FormLabel>
                  <FormSelect>
                    <option>Partnership Opportunities</option>
                    <option>Media Inquiry</option>
                    <option>Corporate Services</option>
                    <option>Investment</option>
                    <option>Other</option>
                  </FormSelect>
                </FormGroup>
                <FormGroup>
                  <FormLabel>Message</FormLabel>
                  <FormTextarea placeholder="Tell us about your inquiry..." rows="5" />
                </FormGroup>
                <PrimaryButton $size="lg">
                  Send Message <FaArrowRight />
                </PrimaryButton>
              </ContactForm>
            </ContactFormCard>
          </ContactGrid>
        </Container>
      </Section>
    </CorporateContainer>
  );
};

// Styled Components
const CorporateContainer = styled.div`
  min-height: 100vh;
  background: var(--background);
`;

const HeroSection = styled.section`
  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-secondary);
  color: var(--white);
  overflow: hidden;
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(13, 13, 13, 0.9) 0%, rgba(26, 26, 26, 0.7) 100%);
`;

const HeroPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(92, 206, 251, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(251, 137, 92, 0.1) 0%, transparent 50%),
    url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-3xl) var(--space-lg);
  text-align: center;
`;

const HeroBadge = styled.div`
  display: inline-block;
  background: var(--gradient-primary);
  color: var(--white);
  padding: var(--space-xs) var(--space-lg);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: var(--space-xl);
`;

const HeroTitle = styled.h1`
  font-size: var(--text-6xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-lg);
  line-height: 1.1;
  
  @media ${props => props.theme.devices?.lg} {
    font-size: var(--text-5xl);
  }
  
  @media ${props => props.theme.devices?.md} {
    font-size: var(--text-4xl);
  }
`;

const HeroDescription = styled.p`
  font-size: var(--text-xl);
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0 auto var(--space-2xl);
  line-height: 1.6;
`;

const HeroStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-xl);
  max-width: 800px;
  margin: 0 auto;
`;

const StatItem = styled.div`
  text-align: center;
  color: var(--white);
  
  svg {
    font-size: var(--text-2xl);
    color: var(--primary-light);
    margin-bottom: var(--space-sm);
  }
`;

const StatNumber = styled.div`
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-xs);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatLabel = styled.div`
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-xs);
`;

const StatSuffix = styled.div`
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const Section = styled.section`
  padding: var(--space-3xl) 0;
  background: ${props => props.$dark ? 'var(--gradient-luxury)' : 'transparent'};
  color: ${props => props.$dark ? 'var(--white)' : 'inherit'};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: var(--space-2xl);
`;

const SectionTitle = styled.h2`
  font-size: var(--text-4xl);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-sm);
  color: ${props => props.theme.colors?.white || 'var(--secondary)'};
`;

const SectionSubtitle = styled.p`
  font-size: var(--text-lg);
  color: ${props => props.theme.colors?.white ? 'rgba(255, 255, 255, 0.8)' : 'var(--text-secondary)'};
  max-width: 600px;
  margin: 0 auto;
`;

const TabNavigation = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-2xl);
  flex-wrap: wrap;
`;

const TabButton = styled.button`
  padding: var(--space-md) var(--space-xl);
  background: ${props => props.$active ? 'var(--gradient-primary)' : 'transparent'};
  color: ${props => props.$active ? 'var(--white)' : 'var(--text-secondary)'};
  border: 2px solid ${props => props.$active ? 'transparent' : 'var(--gray-300)'};
  border-radius: var(--radius-full);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  transition: all var(--transition-normal);
  cursor: pointer;
  
  &:hover {
    border-color: ${props => props.$active ? 'transparent' : 'var(--primary)'};
    color: ${props => props.$active ? 'var(--white)' : 'var(--primary)'};
    transform: translateY(-1px);
  }
`;

const TabContent = styled.div`
  margin-bottom: var(--space-2xl);
`;

const MissionVisionCard = styled(LuxuryCard)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2xl);
  padding: var(--space-2xl);
  
  @media ${props => props.theme.devices?.lg} {
    grid-template-columns: 1fr;
  }
`;

const MissionContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const MissionTitle = styled.h3`
  font-size: var(--text-3xl);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-lg);
  color: var(--secondary);
`;

const MissionText = styled.p`
  font-size: var(--text-lg);
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: var(--space-xl);
`;

const MissionHighlights = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const HighlightItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--text-base);
  color: var(--text-secondary);
  
  svg {
    color: var(--accent);
    font-size: var(--text-sm);
  }
`;

const MissionVisual = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MissionImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: var(--radius-xl);
`;

const VisionGoals = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
`;

const GoalItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-lg);
  padding: var(--space-lg);
  background: var(--gray-50);
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--primary);
`;

const GoalNumber = styled.div`
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--primary);
  min-width: 60px;
`;

const GoalContent = styled.div`
  flex: 1;
`;

const GoalTitle = styled.h4`
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-xs);
  color: var(--secondary);
`;

const GoalDescription = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-xl);
`;

const ValueCard = styled(LuxuryCard)`
  padding: var(--space-2xl);
  text-align: center;
  transition: all var(--transition-normal);
`;

const ValueIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto var(--space-lg);
  background: ${props => props.$color};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-2xl);
  color: var(--white);
`;

const ValueTitle = styled.h4`
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-md);
  color: var(--secondary);
`;

const ValueDescription = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-2xl);
`;

const TeamCard = styled(LuxuryCard)`
  overflow: hidden;
  transition: all var(--transition-normal);
`;

const TeamImage = styled.div`
  position: relative;
  height: 300px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-slow);
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
  transition: opacity var(--transition-normal);
  
  ${TeamCard}:hover & {
    opacity: 1;
  }
`;

const TeamContent = styled.div`
  padding: var(--space-xl);
`;

const TeamName = styled.h4`
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-xs);
  color: var(--white);
`;

const TeamPosition = styled.div`
  color: var(--primary-light);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  margin-bottom: var(--space-md);
`;

const TeamBio = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: var(--space-lg);
`;

const TeamAchievements = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const Achievement = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.7);
  
  svg {
    color: var(--accent);
    font-size: var(--text-xs);
  }
`;

const Timeline = styled.div`
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--gradient-primary);
    transform: translateX(-50%);
    
    @media ${props => props.theme.devices?.md} {
      left: 30px;
    }
  }
`;

const TimelineItem = styled.div`
  position: relative;
  margin-bottom: var(--space-2xl);
  
  @media ${props => props.theme.devices?.md} {
    padding-left: 80px;
  }
`;

const TimelineYear = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: var(--gradient-primary);
  color: var(--white);
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-full);
  font-weight: var(--font-bold);
  font-size: var(--text-lg);
  z-index: 2;
  
  @media ${props => props.theme.devices?.md} {
    left: 0;
    transform: none;
  }
`;

const TimelineContent = styled.div`
  background: var(--white);
  padding: var(--space-xl);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--gray-200);
  width: calc(50% - 60px);
  ${props => props.$align === 'left' ? 'margin-right: auto; margin-left: 0;' : 'margin-left: auto; margin-right: 0;'}
  
  @media ${props => props.theme.devices?.md} {
    width: 100%;
    margin: var(--space-lg) 0 0 0;
  }
`;

const TimelineTitle = styled.h4`
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-sm);
  color: var(--secondary);
`;

const TimelineDescription = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-md);
`;

const TimelineMilestone = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--text-sm);
  color: var(--primary);
  font-weight: var(--font-medium);
  
  svg {
    font-size: var(--text-xs);
  }
`;

const AwardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-xl);
`;

const AwardCard = styled(LuxuryCard)`
  padding: var(--space-2xl);
  text-align: center;
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--white);
`;

const AwardYear = styled.div`
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  color: var(--accent-light);
  margin-bottom: var(--space-sm);
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const AwardTitle = styled.h4`
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-sm);
`;

const AwardName = styled.div`
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-xs);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const AwardCategory = styled.div`
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const AwardIcon = styled.div`
  position: absolute;
  top: var(--space-xl);
  right: var(--space-xl);
  font-size: var(--text-2xl);
  color: rgba(255, 255, 255, 0.1);
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2xl);
  
  @media ${props => props.theme.devices?.lg} {
    grid-template-columns: 1fr;
  }
`;

const ContactContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ContactDescription = styled.p`
  font-size: var(--text-lg);
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-2xl);
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  margin-bottom: var(--space-2xl);
`;

const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-lg);
  
  svg {
    font-size: var(--text-xl);
    color: var(--primary);
    margin-top: 2px;
  }
`;

const ContactLabel = styled.div`
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: var(--space-xs);
`;

const ContactText = styled.div`
  font-size: var(--text-base);
  color: var(--text-primary);
  line-height: 1.5;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: var(--space-md);
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: var(--gray-100);
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  transition: all var(--transition-normal);
  cursor: pointer;
  
  &:hover {
    background: var(--primary);
    color: var(--white);
    transform: translateY(-2px);
  }
  
  svg {
    font-size: var(--text-lg);
  }
`;

const ContactFormCard = styled(LuxuryCard)`
  padding: var(--space-2xl);
`;

const ContactFormTitle = styled.h3`
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-xl);
  color: var(--secondary);
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
  
  @media ${props => props.theme.devices?.sm} {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const FormLabel = styled.label`
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-secondary);
`;

const FormInput = styled.input`
  padding: var(--space-md) var(--space-lg);
  border: 2px solid var(--gray-300);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  transition: all var(--transition-normal);
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(92, 206, 251, 0.1);
  }
  
  &::placeholder {
    color: var(--text-light);
  }
`;

const FormSelect = styled.select`
  padding: var(--space-md) var(--space-lg);
  border: 2px solid var(--gray-300);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  background: var(--white);
  transition: all var(--transition-normal);
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(92, 206, 251, 0.1);
  }
`;

const FormTextarea = styled.textarea`
  padding: var(--space-md) var(--space-lg);
  border: 2px solid var(--gray-300);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-family: inherit;
  resize: vertical;
  transition: all var(--transition-normal);
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(92, 206, 251, 0.1);
  }
  
  &::placeholder {
    color: var(--text-light);
  }
`;

export default CorporatePage;