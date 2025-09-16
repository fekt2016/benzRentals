// src/components/Footer.js
import styled from "styled-components";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterContainer>
        <FooterColumn>
          <h3>About Us</h3>
          <p>
            Mercedes-Benz Premium Rentals provides top-tier luxury vehicles for
            an unparalleled driving experience.
          </p>
        </FooterColumn>

        <FooterColumn>
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/models">Models</a>
            </li>
            <li>
              <a href="/locations">Locations</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </FooterColumn>

        <FooterColumn>
          <h3>Support</h3>
          <ul>
            <li>
              <a href="/help-center">Help Center</a>
            </li>
            <li>
              <a href="/bookings">Bookings</a>
            </li>
            <li>
              <a href="/terms">Terms & Conditions</a>
            </li>
            <li>
              <a href="/privacy">Privacy Policy</a>
            </li>
          </ul>
        </FooterColumn>

        <FooterColumn>
          <h3>Connect</h3>
          <SocialIcons>
            <a href="#">
              <FaFacebookF />
            </a>
            <a href="#">
              <FaTwitter />
            </a>
            <a href="#">
              <FaInstagram />
            </a>
            <a href="#">
              <FaLinkedinIn />
            </a>
          </SocialIcons>
        </FooterColumn>
      </FooterContainer>

      <Copyright>
        &copy; {new Date().getFullYear()} Mercedes-Benz Premium Rentals. All
        rights reserved.
      </Copyright>
    </FooterWrapper>
  );
};

export default Footer;

// ---------------- Styled ---------------- //
const FooterWrapper = styled.footer`
  background: ${({ theme }) => theme.colors.secondary || "#111"};
  color: ${({ theme }) => theme.colors.white};
  padding: 4rem 2rem 2rem;
  font-size: 1.4rem;
`;

const FooterContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2.5rem;
  margin-bottom: 2rem;
`;

const FooterColumn = styled.div`
  h3 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.primary};
  }

  p {
    color: ${({ theme }) => theme.colors.gray};
    line-height: 1.6;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      margin-bottom: 0.8rem;

      a {
        color: ${({ theme }) => theme.colors.gray};
        text-decoration: none;
        transition: color 0.3s;

        &:hover {
          color: ${({ theme }) => theme.colors.primary};
        }
      }
    }
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: ${({ theme }) => theme.colors.white}10;
    color: ${({ theme }) => theme.colors.white};
    border-radius: 50%;
    transition: all 0.3s;

    &:hover {
      background: ${({ theme }) => theme.colors.primary};
      color: #fff;
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  border-top: 1px solid ${({ theme }) => theme.colors.white}20;
  padding-top: 1rem;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.gray};
`;
