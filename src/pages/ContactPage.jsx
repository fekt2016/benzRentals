// pages/ContactPage.js
import React, { useState } from "react";
import styled from "styled-components";

// Import UI Components
import { PrimaryButton, SecondaryButton } from "../components/ui/Button";
import { Card, LuxuryCard } from "../components/Cards/Card";
import {
  FormGroup,
  Label,
  Input,
  TextArea,
  Select,
  ErrorMessage,
  SuccessMessage,
} from "../components/forms/Form";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, this would submit the form data to an API
      console.log("Form submitted:", formData);

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.log(error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ContactContainer>
      <PageHeader>
        <PageTitle>Contact Us</PageTitle>
        <PageSubtitle>
          Have questions? We're here to help. Reach out to us through any of the
          channels below.
        </PageSubtitle>
      </PageHeader>

      <ContactGrid>
        <ContactFormCard>
          <FormHeader>
            <FormTitle>Send us a Message</FormTitle>
            <FormDescription>
              Fill out the form below and we'll get back to you as soon as
              possible.
            </FormDescription>
          </FormHeader>

          {submitStatus === "success" && (
            <SuccessMessage>
              ✅ Thank you for your message! We will get back to you soon.
            </SuccessMessage>
          )}

          {submitStatus === "error" && (
            <ErrorMessage>
              ❌ There was an error sending your message. Please try again.
            </ErrorMessage>
          )}

          <Form onSubmit={handleSubmit}>
            <FormRow>
              <FormGroup>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  required
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="subject">Subject *</Label>
                <Select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="booking">Booking Inquiry</option>
                  <option value="support">Customer Support</option>
                  <option value="complaint">Complaint</option>
                  <option value="suggestion">Suggestion</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </Select>
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label htmlFor="message">Message *</Label>
              <TextArea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us how we can help you..."
                rows={6}
                required
              />
            </FormGroup>

            <SubmitButton type="submit" disabled={isSubmitting} $size="lg">
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  Sending Message...
                </>
              ) : (
                "Send Message"
              )}
            </SubmitButton>
          </Form>
        </ContactFormCard>

        <ContactInfoSection>
          <ContactInfoCard>
            <InfoIcon>📞</InfoIcon>
            <InfoContent>
              <InfoTitle>Contact Information</InfoTitle>
              <InfoList>
                <InfoItem>
                  <strong>Phone:</strong> 1-800-DRIVE-RENT
                </InfoItem>
                <InfoItem>
                  <strong>Email:</strong> info@luxuryrentals.com
                </InfoItem>
                <InfoItem>
                  <strong>Address:</strong> 123 Luxury Ave, Premium City, PC
                  12345
                </InfoItem>
              </InfoList>
            </InfoContent>
          </ContactInfoCard>

          <ContactInfoCard>
            <InfoIcon>🕒</InfoIcon>
            <InfoContent>
              <InfoTitle>Customer Support Hours</InfoTitle>
              <InfoList>
                <InfoItem>
                  <strong>Monday-Friday:</strong> 8:00 AM - 10:00 PM EST
                </InfoItem>
                <InfoItem>
                  <strong>Saturday-Sunday:</strong> 9:00 AM - 8:00 PM EST
                </InfoItem>
                <InfoItem>
                  <em>24/7 online booking available</em>
                </InfoItem>
              </InfoList>
            </InfoContent>
          </ContactInfoCard>

          <ContactInfoCard $accent>
            <InfoIcon>🚨</InfoIcon>
            <InfoContent>
              <InfoTitle>Emergency Roadside Assistance</InfoTitle>
              <InfoList>
                <InfoItem>
                  <strong>Phone:</strong> 1-800-HELP-NOW
                </InfoItem>
                <InfoItem>Available 24/7 for all rental customers</InfoItem>
                <InfoItem>
                  <EmergencyNote>
                    For accidents, breakdowns, or lockouts
                  </EmergencyNote>
                </InfoItem>
              </InfoList>
            </InfoContent>
          </ContactInfoCard>

          <FAQSection>
            <InfoTitle>Quick Links</InfoTitle>
            <QuickLinks>
              <QuickLink href="/faq">FAQ</QuickLink>
              <QuickLink href="/booking-help">Booking Help</QuickLink>
              <QuickLink href="/terms">Terms & Conditions</QuickLink>
              <QuickLink href="/privacy">Privacy Policy</QuickLink>
            </QuickLinks>
          </FAQSection>
        </ContactInfoSection>
      </ContactGrid>
    </ContactContainer>
  );
};

export default ContactPage;

// Styled Components using Global Styles
const ContactContainer = styled.div`
  padding: var(--space-2xl) 0;
  max-width: 1200px;
  margin: 0 auto;
  font-family: var(--font-body);
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: var(--space-2xl);
  padding: 0 var(--space-lg);
`;

const PageTitle = styled.h1`
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-md);
  font-family: var(--font-heading);

  @media (max-width: 768px) {
    font-size: var(--text-3xl);
  }
`;

const PageSubtitle = styled.p`
  font-size: var(--text-lg);
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: var(--space-xl);
  padding: 0 var(--space-lg);

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }

  @media (max-width: 768px) {
    padding: 0 var(--space-md);
  }
`;

const ContactFormCard = styled(LuxuryCard)`
  padding: var(--space-2xl);
  background: var(--white);

  @media (max-width: 768px) {
    padding: var(--space-xl);
  }
`;

const FormHeader = styled.div`
  margin-bottom: var(--space-xl);
  text-align: center;
`;

const FormTitle = styled.h2`
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
  font-family: var(--font-heading);
`;

const FormDescription = styled.p`
  color: var(--text-muted);
  font-size: var(--text-base);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SubmitButton = styled(PrimaryButton)`
  margin-top: var(--space-md);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
`;

const ContactInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
`;

const ContactInfoCard = styled(Card)`
  padding: var(--space-xl);
  background: ${(props) => (props.$accent ? "var(--surface)" : "var(--white)")};
  border-left: ${(props) =>
    props.$accent ? "4px solid var(--error)" : "none"};
  display: flex;
  align-items: flex-start;
  gap: var(--space-lg);
  transition: all var(--transition-normal);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

const InfoIcon = styled.div`
  font-size: 2rem;
  flex-shrink: 0;
  margin-top: var(--space-xs);
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoTitle = styled.h3`
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-md);
  font-family: var(--font-heading);
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const InfoItem = styled.li`
  color: var(--text-secondary);
  margin-bottom: var(--space-sm);
  line-height: 1.5;
  font-family: var(--font-body);

  &:last-child {
    margin-bottom: 0;
  }

  strong {
    color: var(--text-primary);
    font-weight: var(--font-semibold);
  }

  em {
    color: var(--text-muted);
    font-style: italic;
  }
`;

const EmergencyNote = styled.span`
  color: var(--error);
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
`;

const FAQSection = styled.div`
  padding: var(--space-xl);
  background: var(--surface);
  border-radius: var(--radius-lg);
  text-align: center;
`;

const QuickLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  justify-content: center;
  margin-top: var(--space-md);
`;

const QuickLink = styled.a`
  color: var(--primary);
  text-decoration: none;
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  transition: all var(--transition-normal);
  font-family: var(--font-body);

  &:hover {
    background: var(--primary);
    color: var(--white);
    border-color: var(--primary);
    transform: translateY(-1px);
  }
`;
