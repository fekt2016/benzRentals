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
import { PrimaryButton, AccentButtonLink } from "../components/ui/Button";
import { Link } from "react-router-dom";

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
                <FooterLink to="/models">Our Fleet</FooterLink>
              </LinkItem>
              <LinkItem>
                <LinkArrow>
                  <FaArrowRight />
                </LinkArrow>
                <FooterLink to="/locations">Locations</FooterLink>
              </LinkItem>
              <LinkItem>
                <LinkArrow>
                  <FaArrowRight />
                </LinkArrow>
                <FooterLink to="/pricing">Pricing</FooterLink>
              </LinkItem>
              <LinkItem>
                <LinkArrow>
                  <FaArrowRight />
                </LinkArrow>
                <FooterLink to="/testimonials">Testimonials</FooterLink>
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
                <FooterLink to="/luxury-rentals">Luxury Rentals</FooterLink>
              </LinkItem>
              <LinkItem>
                <LinkArrow>
                  <FaArrowRight />
                </LinkArrow>
                <FooterLink to="/chauffeur">Chauffeur Service</FooterLink>
              </LinkItem>
              <LinkItem>
                <LinkArrow>
                  <FaArrowRight />
                </LinkArrow>
                <FooterLink to="/corporate">Corporate Programs</FooterLink>
              </LinkItem>
              <LinkItem>
                <LinkArrow>
                  <FaArrowRight />
                </LinkArrow>
                <FooterLink to="/events">Event Transportation</FooterLink>
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
              <SubscribeButton
                $size="sm"
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
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
            <LegalLink to="/privacy">Privacy Policy</LegalLink>
            <LegalLink to="/terms">Terms of Service</LegalLink>
            <LegalLink to="/cookies">Cookie Policy</LegalLink>
          </LegalLinks>
        </CopyrightContainer>
      </CopyrightSection>

      {/* Floating CTA */}
      <FloatingCTA>
        <CTAText>Ready to experience luxury?</CTAText>
        <CTAButton
          to="/booking"
          $size="sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Book Now
        </CTAButton>
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
    box-shadow: 0 0 0 0 rgba(211, 47, 47, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(211, 47, 47, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(211, 47, 47, 0);
  }
`;

// const gradientShift = keyframes`
//   0% { background-position: 0% 50%; }
//   50% { background-position: 100% 50%; }
//   100% { background-position: 0% 50%; }
// `;

// Styled Components
const FooterWrapper = styled.footer`
  position: relative;
  background: var(--gradient-secondary);
  color: var(--white);
  margin-top: auto;
`;

const MainFooter = styled.div`
  padding: var(--space-2xl) var(--space-lg) var(--space-xl);
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: var(--space-xl) var(--space-md) var(--space-lg);
  }
`;

const FooterContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: var(--space-xl);
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-lg);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }
`;

const BrandColumn = styled.div`
  animation: ${slideUp} 0.6s ease-out;
`;

const BrandLogo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
`;

const CarIcon = styled.div`
  font-size: 2.5rem;
  animation: ${float} 3s ease-in-out infinite;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
`;

const BrandName = styled.h3`
  font-size: var(--text-3xl);
  font-weight: var(--font-semibold);
  font-family: var(--font-heading);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
`;

const BrandDescription = styled.p`
  color: var(--text-light);
  line-height: 1.6;
  margin-bottom: var(--space-lg);
  font-size: var(--text-base);
  font-family: var(--font-body);
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--text-light);
  font-size: var(--text-base);
  transition: color var(--transition-normal);
  font-family: var(--font-body);

  &:hover {
    color: var(--accent);
  }

  svg {
    color: var(--primary);
    width: 16px;
    flex-shrink: 0;
  }
`;

const LinksColumn = styled.div`
  animation: ${slideUp} 0.6s ease-out 0.2s both;
`;

const ColumnTitle = styled.h4`
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  font-family: var(--font-heading);
  margin-bottom: var(--space-md);
  color: var(--white);
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 40px;
    height: 2px;
    background: var(--gradient-primary);
    border-radius: 2px;
  }
`;

const LinksList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;
const LinkItem = styled.li`
  margin-bottom: var(--space-sm);
  position: relative;
  transition: transform var(--transition-normal);

  &:hover {
    transform: translateX(5px);
  }
`;
const LinkArrow = styled.span`
  position: absolute;
  left: -1.5rem;
  top: 50%;
  transform: translateY(-50%) translateX(-5px);
  opacity: 0;
  transition: all var(--transition-normal);
  color: var(--primary);
  font-size: var(--text-sm);

  ${LinkItem}:hover & {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
`;

const FooterLink = styled(Link)`
  color: var(--text-light);
  text-decoration: none;
  font-size: var(--text-base);
  transition: all var(--transition-normal);
  position: relative;
  font-family: var(--font-body);

  &:hover {
    color: var(--accent);
  }

  &::after {
    content: "";
    position: absolute;
    width: 0;
    height: 1px;
    bottom: -2px;
    left: 0;
    background: var(--accent);
    transition: width var(--transition-normal);
  }

  &:hover::after {
    width: 100%;
  }
`;

const NewsletterColumn = styled.div`
  animation: ${slideUp} 0.6s ease-out 0.4s both;
`;

const NewsletterText = styled.p`
  color: var(--text-light);
  margin-bottom: var(--space-md);
  font-size: var(--text-base);
  line-height: 1.5;
  font-family: var(--font-body);
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: var(--space-xs);
  margin-bottom: var(--space-lg);
  position: relative;
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--gray-600);
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  color: var(--white);
  font-size: var(--text-base);
  font-family: var(--font-body);
  transition: all var(--transition-normal);

  &::placeholder {
    color: var(--text-muted);
  }

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
  }
`;

const SubscribeButton = styled(PrimaryButton)`
  padding: var(--space-sm);
  min-width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SocialSection = styled.div`
  margin-top: var(--space-lg);
`;

const SocialTitle = styled.h5`
  font-size: var(--text-lg);
  margin-bottom: var(--space-sm);
  color: var(--white);
  font-family: var(--font-heading);
`;

const SocialIcons = styled.div`
  display: flex;
  gap: var(--space-sm);
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
  border-radius: var(--radius-lg);
  color: var(--text-light);
  text-decoration: none;
  transition: all var(--transition-normal);
  overflow: hidden;

  &:hover {
    transform: translateY(-3px);
    color: var(--white);
    background: var(--gradient-primary);
    box-shadow: var(--shadow-gold);
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
  padding: var(--space-lg) 0;
  background: rgba(0, 0, 0, 0.2);
`;

const CopyrightContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--space-sm);
    text-align: center;
    padding: 0 var(--space-md);
  }
`;

const CopyrightText = styled.p`
  color: var(--text-muted);
  font-size: var(--text-sm);
  margin: 0;
  font-family: var(--font-body);
`;

const LegalLinks = styled.div`
  display: flex;
  gap: var(--space-lg);

  @media (max-width: 480px) {
    flex-direction: column;
    gap: var(--space-xs);
  }
`;

const LegalLink = styled(Link)`
  color: var(--text-muted);
  text-decoration: none;
  font-size: var(--text-sm);
  transition: color var(--transition-normal);
  font-family: var(--font-body);

  &:hover {
    color: var(--accent);
  }
`;

const FloatingCTA = styled.div`
  position: fixed;
  bottom: var(--space-lg);
  right: var(--space-lg);
  background: var(--gradient-primary);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  box-shadow: var(--shadow-lg);
  animation: ${pulse} 2s infinite;
  z-index: 1000;

  @media (max-width: 768px) {
    bottom: var(--space-md);
    right: var(--space-md);
    left: var(--space-md);
    justify-content: center;
  }
`;

const CTAText = styled.span`
  color: var(--white);
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  white-space: nowrap;
  font-family: var(--font-body);
`;

const CTAButton = styled(AccentButtonLink)`
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
  text-decoration: none;
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
`;
