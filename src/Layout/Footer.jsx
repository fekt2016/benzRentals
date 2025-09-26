// src/components/Footer.js
import styled, { keyframes } from "styled-components";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaArrowRight,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterWrapper>
      {/* Main Footer Content */}
      <MainFooter>
        <FooterContainer>
          {/* Brand Column */}
          <BrandColumn>
            <BrandLogo>
              <CarIcon>🚗</CarIcon>
              <BrandName>Mercedes-Benz Rentals</BrandName>
            </BrandLogo>
            <BrandDescription>
              Experience unparalleled luxury and performance with our premium
              Mercedes-Benz fleet. Your journey to excellence starts here.
            </BrandDescription>
            <ContactInfo>
              <ContactItem>
                <FaMapMarkerAlt />
                <span>123 Luxury Avenue, Premium City</span>
              </ContactItem>
              <ContactItem>
                <FaPhone />
                <span>+1 (555) 123-4567</span>
              </ContactItem>
              <ContactItem>
                <FaEnvelope />
                <span>info@mercedes-rentals.com</span>
              </ContactItem>
            </ContactInfo>
          </BrandColumn>

          {/* Quick Links */}
          <LinksColumn>
            <ColumnTitle>Quick Links</ColumnTitle>
            <LinksList>
              <LinkItem>
                <LinkArrow>
                  <FaArrowRight />
                </LinkArrow>
                <a href="/models">Our Fleet</a>
              </LinkItem>
              <LinkItem>
                <LinkArrow>
                  <FaArrowRight />
                </LinkArrow>
                <a href="/locations">Locations</a>
              </LinkItem>
              <LinkItem>
                <LinkArrow>
                  <FaArrowRight />
                </LinkArrow>
                <a href="/pricing">Pricing</a>
              </LinkItem>
              <LinkItem>
                <LinkArrow>
                  <FaArrowRight />
                </LinkArrow>
                <a href="/testimonials">Testimonials</a>
              </LinkItem>
            </LinksList>
          </LinksColumn>

          {/* Services */}
          <LinksColumn>
            <ColumnTitle>Our Services</ColumnTitle>
            <LinksList>
              <LinkItem>
                <LinkArrow>
                  <FaArrowRight />
                </LinkArrow>
                <a href="/luxury-rentals">Luxury Rentals</a>
              </LinkItem>
              <LinkItem>
                <LinkArrow>
                  <FaArrowRight />
                </LinkArrow>
                <a href="/chauffeur">Chauffeur Service</a>
              </LinkItem>
              <LinkItem>
                <LinkArrow>
                  <FaArrowRight />
                </LinkArrow>
                <a href="/corporate">Corporate Programs</a>
              </LinkItem>
              <LinkItem>
                <LinkArrow>
                  <FaArrowRight />
                </LinkArrow>
                <a href="/events">Event Transportation</a>
              </LinkItem>
            </LinksList>
          </LinksColumn>

          {/* Newsletter */}
          <NewsletterColumn>
            <ColumnTitle>Stay Updated</ColumnTitle>
            <NewsletterText>
              Subscribe to get special offers and luxury driving tips
            </NewsletterText>
            <NewsletterForm>
              <NewsletterInput type="email" placeholder="Enter your email" />
              <SubscribeButton>
                <FaArrowRight />
              </SubscribeButton>
            </NewsletterForm>
            <SocialSection>
              <SocialTitle>Follow Us</SocialTitle>
              <SocialIcons>
                <SocialLink href="#" aria-label="Facebook">
                  <FaFacebookF />
                  <HoverEffect />
                </SocialLink>
                <SocialLink href="#" aria-label="Twitter">
                  <FaTwitter />
                  <HoverEffect />
                </SocialLink>
                <SocialLink href="#" aria-label="Instagram">
                  <FaInstagram />
                  <HoverEffect />
                </SocialLink>
                <SocialLink href="#" aria-label="LinkedIn">
                  <FaLinkedinIn />
                  <HoverEffect />
                </SocialLink>
              </SocialIcons>
            </SocialSection>
          </NewsletterColumn>
        </FooterContainer>
      </MainFooter>

      {/* Copyright Section */}
      <CopyrightSection>
        <CopyrightContainer>
          <CopyrightText>
            © {currentYear} Mercedes-Benz Premium Rentals. All rights reserved.
          </CopyrightText>
          <LegalLinks>
            <LegalLink href="/privacy">Privacy Policy</LegalLink>
            <LegalLink href="/terms">Terms of Service</LegalLink>
            <LegalLink href="/cookies">Cookie Policy</LegalLink>
          </LegalLinks>
        </CopyrightContainer>
      </CopyrightSection>

      {/* Floating CTA */}
      <FloatingCTA>
        <CTAText>Ready to experience luxury?</CTAText>
        <CTAButton href="/booking">Book Now</CTAButton>
      </FloatingCTA>
    </FooterWrapper>
  );
};

export default Footer;

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled Components
const FooterWrapper = styled.footer`
  position: relative;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  background-size: 200% 200%;
  animation: ${gradientShift} 10s ease infinite;
  color: white;
  margin-top: auto;
`;

const MainFooter = styled.div`
  padding: 5rem 2rem 3rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 3rem 1rem 2rem;
  }
`;

const FooterContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 3rem;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
`;

const BrandColumn = styled.div`
  animation: ${slideUp} 0.6s ease-out;
`;

const BrandLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const CarIcon = styled.div`
  font-size: 2.5rem;
  animation: ${float} 3s ease-in-out infinite;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
`;

const BrandName = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
`;

const BrandDescription = styled.p`
  color: #cbd5e1;
  line-height: 1.6;
  margin-bottom: 2rem;
  font-size: 1.4rem;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #cbd5e1;
  font-size: 1.3rem;
  transition: color 0.3s ease;

  &:hover {
    color: #60a5fa;
  }

  svg {
    color: #3b82f6;
    width: 16px;
  }
`;

const LinksColumn = styled.div`
  animation: ${slideUp} 0.6s ease-out 0.2s both;
`;

const ColumnTitle = styled.h4`
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #f8fafc;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 40px;
    height: 2px;
    background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
    border-radius: 2px;
  }
`;

const LinksList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const LinkArrow = styled.span`
  position: absolute;
  left: -1.5rem;
  top: 50%;
  transform: translateY(-50%) translateX(-5px);
  opacity: 0;
  transition: all 0.3s ease;
  color: #3b82f6;
  font-size: 0.8rem;

  a:hover + & {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
`;

const LinkItem = styled.li`
  margin-bottom: 1rem;
  position: relative;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateX(5px);

    ${LinkArrow} {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const NewsletterColumn = styled.div`
  animation: ${slideUp} 0.6s ease-out 0.4s both;
`;

const NewsletterText = styled.p`
  color: #cbd5e1;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  line-height: 1.5;
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  position: relative;
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 1rem 1.5rem;
  border: 1px solid #334155;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 1.3rem;
  transition: all 0.3s ease;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SubscribeButton = styled.button`
  padding: 1rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SocialSection = styled.div`
  margin-top: 2rem;
`;

const SocialTitle = styled.h5`
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: #f8fafc;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialLink = styled.a`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  color: #cbd5e1;
  text-decoration: none;
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    transform: translateY(-3px);
    color: white;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
  }

  svg {
    position: relative;
    z-index: 2;
    font-size: 1.2rem;
  }
`;

const HoverEffect = styled.div`
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s ease;

  ${SocialLink}:hover & {
    left: 100%;
  }
`;

const CopyrightSection = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem 0;
  background: rgba(0, 0, 0, 0.2);
`;

const CopyrightContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    padding: 0 1rem;
  }
`;

const CopyrightText = styled.p`
  color: #94a3b8;
  font-size: 1.2rem;
  margin: 0;
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const LegalLink = styled.a`
  color: #94a3b8;
  text-decoration: none;
  font-size: 1.2rem;
  transition: color 0.3s ease;

  &:hover {
    color: #60a5fa;
  }
`;

const FloatingCTA = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  padding: 1rem 1.5rem;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3);
  animation: ${pulse} 2s infinite;
  z-index: 1000;

  @media (max-width: 768px) {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    justify-content: center;
  }
`;

const CTAText = styled.span`
  color: white;
  font-weight: 600;
  font-size: 1.3rem;
  white-space: nowrap;
`;

const CTAButton = styled.a`
  background: white;
  color: #3b82f6;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.3rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

// Add global link styles for all footer links
const GlobalLink = styled.a`
  color: #cbd5e1;
  text-decoration: none;
  font-size: 1.3rem;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    color: #60a5fa;
  }

  &::after {
    content: "";
    position: absolute;
    width: 0;
    height: 1px;
    bottom: -2px;
    left: 0;
    background: #60a5fa;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

// Apply GlobalLink to all anchor tags within LinkItems
export { GlobalLink as FooterLink };
