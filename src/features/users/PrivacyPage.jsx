import React from 'react';
import styled from 'styled-components';
import { devices } from '../../styles/GlobalStyles';

const PrivacyContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-xl);
  line-height: 1.6;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: var(--text-base);

  @media ${devices.md} {
    padding: var(--space-lg);
  }

  @media ${devices.sm} {
    padding: var(--space-md);
  }
`;

const PrivacyHeader = styled.h1`
  text-align: center;
  margin-bottom: var(--space-xl);
  border-bottom: 2px solid var(--gray-200);
  padding-bottom: var(--space-md);
  font-family: var(--font-heading);
  color: var(--secondary);
  font-size: var(--text-4xl);
  font-weight: var(--font-semibold);

  @media ${devices.sm} {
    font-size: var(--text-3xl);
    margin-bottom: var(--space-lg);
  }
`;

const Section = styled.section`
  margin-bottom: var(--space-xl);
`;

const SectionTitle = styled.h2`
  color: var(--secondary);
  margin-bottom: var(--space-md);
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);

  @media ${devices.sm} {
    font-size: var(--text-xl);
  }
`;

const SubSectionTitle = styled.h3`
  color: var(--gray-700);
  margin-bottom: var(--space-sm);
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
`;

const Text = styled.p`
  margin-bottom: var(--space-md);
  color: var(--text-secondary);
  line-height: 1.7;
  font-family: var(--font-body);
  font-weight: var(--font-normal);
`;

const List = styled.ul`
  padding-left: var(--space-lg);
  margin-bottom: var(--space-md);
`;

const ListItem = styled.li`
  margin-bottom: var(--space-xs);
  color: var(--text-secondary);
  line-height: 1.6;
  font-family: var(--font-body);

  &::marker {
    color: var(--primary);
  }
`;

const ContactSection = styled(Section)`
  background: var(--surface);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-200);
  margin-bottom: var(--space-xl);
`;

const ContactInfo = styled.div`
  margin: var(--space-md) 0;
  padding: var(--space-md);
  background: var(--white);
  border-radius: var(--radius-md);
  border: 1px solid var(--gray-100);
`;

const StyledLink = styled.a`
  color: var(--primary);
  text-decoration: none;
  transition: color var(--transition-fast);
  font-weight: var(--font-medium);

  &:hover {
    color: var(--primary-dark);
    text-decoration: underline;
  }
`;

const Footer = styled.footer`
  margin-top: var(--space-2xl);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--gray-200);
  text-align: center;
  font-size: var(--text-sm);
  color: var(--text-muted);
  font-style: italic;
`;

const EffectiveDate = styled.p`
  font-style: italic;
  margin-bottom: var(--space-xl);
  color: var(--text-muted);
  font-weight: var(--font-medium);
`;

function PrivacyPage() {
    return (
        <PrivacyContainer>
            <PrivacyHeader>Privacy Policy</PrivacyHeader>
            
            <EffectiveDate>
                <strong>Effective Date: February 3, 2025</strong>
            </EffectiveDate>

            <Section>
                <SectionTitle>Introduction</SectionTitle>
                <Text>
                    BenzFlex LLC (&quot;BenzFlex,&quot; &quot;we, &quot;our,&quot; or &quot;us&quot;) values your privacy and is committed to 
                    protecting your personal information. This Privacy Policy explains how we handle your 
                    information when you interact with our luxury car rental services in St. Louis, Missouri.
                </Text>
            </Section>

            <Section>
                <SectionTitle>Scope</SectionTitle>
                <Text>This policy applies to information we collect when you:</Text>
                <List>
                    <ListItem>Use our website or mobile applications</ListItem>
                    <ListItem>Rent vehicles from BenzFlex</ListItem>
                    <ListItem>Contact our customer service team</ListItem>
                    <ListItem>Participate in our marketing programs</ListItem>
                    <ListItem>Visit our St. Louis location</ListItem>
                </List>
            </Section>

            <Section>
                <SectionTitle>Information Collection</SectionTitle>
                
                <SubSectionTitle>Information You Provide</SubSectionTitle>
                <Text>When using our services, you may share:</Text>
                <List>
                    <ListItem>Personal details (name, contact information)</ListItem>
                    <ListItem>Driver&quot;s license and identification documents</ListItem>
                    <ListItem>Payment and billing information</ListItem>
                    <ListItem>Rental preferences and history</ListItem>
                    <ListItem>Communication records with our team</ListItem>
                </List>

                <SubSectionTitle>Automated Information Collection</SubSectionTitle>
                <Text>Our systems automatically gather:</Text>
                <List>
                    <ListItem>Device and browser characteristics</ListItem>
                    <ListItem>IP address and general location data</ListItem>
                    <ListItem>Website usage patterns and interactions</ListItem>
                    <ListItem>Vehicle telematics and location data during rentals</ListItem>
                    <ListItem>Security camera footage at our facilities</ListItem>
                </List>

                <SubSectionTitle>Information from Third Parties</SubSectionTitle>
                <Text>We may receive information from:</Text>
                <List>
                    <ListItem>Credit reporting agencies (for rental approvals)</ListItem>
                    <ListItem>Insurance providers</ListItem>
                    <ListItem>Marketing partners</ListItem>
                    <ListItem>Payment processors</ListItem>
                </List>
            </Section>

            <Section>
                <SectionTitle>How We Use Your Information</SectionTitle>
                
                <SubSectionTitle>Service Delivery</SubSectionTitle>
                <List>
                    <ListItem>Processing rental agreements and payments</ListItem>
                    <ListItem>Vehicle location monitoring and recovery</ListItem>
                    <ListItem>Customer support and communication</ListItem>
                    <ListItem>Account management and billing</ListItem>
                </List>

                <SubSectionTitle>Business Operations</SubSectionTitle>
                <List>
                    <ListItem>Improving our services and customer experience</ListItem>
                    <ListItem>Marketing and promotional communications (with consent)</ListItem>
                    <ListItem>Fraud prevention and security measures</ListItem>
                    <ListItem>Legal compliance and regulatory requirements</ListItem>
                </List>

                <SubSectionTitle>Vehicle Management</SubSectionTitle>
                <List>
                    <ListItem>Maintenance scheduling and safety monitoring</ListItem>
                    <ListItem>Location tracking for stolen vehicle recovery</ListItem>
                    <ListItem>Usage pattern analysis for fleet optimization</ListItem>
                </List>
            </Section>

            <Section>
                <SectionTitle>Information Sharing</SectionTitle>
                
                <SubSectionTitle>Service Providers</SubSectionTitle>
                <Text>We work with trusted partners who help us:</Text>
                <List>
                    <ListItem>Process payments securely</ListItem>
                    <ListItem>Manage customer communications</ListItem>
                    <ListItem>Provide IT infrastructure and support</ListItem>
                    <ListItem>Conduct marketing activities</ListItem>
                </List>

                <SubSectionTitle>Legal Requirements</SubSectionTitle>
                <Text>We may disclose information when required by:</Text>
                <List>
                    <ListItem>Court orders or legal proceedings</ListItem>
                    <ListItem>Law enforcement requests</ListItem>
                    <ListItem>Regulatory compliance obligations</ListItem>
                </List>

                <SubSectionTitle>Business Transfers</SubSectionTitle>
                <Text>
                    In the event of mergers, acquisitions, or business sales, customer information 
                    may be transferred as a business asset.
                </Text>
            </Section>

            <Section>
                <SectionTitle>Data Security</SectionTitle>
                <Text>We implement comprehensive security measures including:</Text>
                <List>
                    <ListItem>Encrypted data transmission and storage</ListItem>
                    <ListItem>Secure facility access controls</ListItem>
                    <ListItem>Regular security assessments</ListItem>
                    <ListItem>Employee privacy training</ListItem>
                </List>
                <Text style={{ fontStyle: 'italic' }}>
                    While we take reasonable precautions, no system can guarantee absolute security.
                </Text>
            </Section>

            <Section>
                <SectionTitle>Your Rights and Choices</SectionTitle>
                
                <SubSectionTitle>Access and Correction</SubSectionTitle>
                <Text>You may:</Text>
                <List>
                    <ListItem>Review your personal information we hold</ListItem>
                    <ListItem>Update inaccurate or incomplete data</ListItem>
                    <ListItem>Request account closure</ListItem>
                </List>

                <SubSectionTitle>Marketing Preferences</SubSectionTitle>
                <List>
                    <ListItem>Opt-out of promotional communications</ListItem>
                    <ListItem>Adjust notification settings in your account</ListItem>
                    <ListItem>Unsubscribe from email campaigns</ListItem>
                </List>

                <SubSectionTitle>Data Retention</SubSectionTitle>
                <Text>We retain your information only as long as necessary for:</Text>
                <List>
                    <ListItem>Active rental agreements</ListItem>
                    <ListItem>Legal compliance requirements</ListItem>
                    <ListItem>Business operations needs</ListItem>
                    <ListItem>Dispute resolution</ListItem>
                </List>
                <Text style={{ fontStyle: 'italic', marginTop: 'var(--space-sm)' }}>
                    Typically, we maintain records for 3-7 years depending on the information type and legal requirements.
                </Text>
            </Section>

            <Section>
                <SectionTitle>Missouri-Specific Provisions</SectionTitle>
                <Text>
                    As a Missouri-based company serving St. Louis residents, we adhere to:
                </Text>
                <List>
                    <ListItem>Missouri data protection regulations</ListItem>
                    <ListItem>Local consumer protection laws</ListItem>
                    <ListItem>Industry-standard privacy practices</ListItem>
                </List>
            </Section>

            <Section>
                <SectionTitle>Children&apos;s Privacy</SectionTitle>
                <Text>
                    Our services are not intended for individuals under 18 years of age. 
                    We do not knowingly collect information from minors.
                </Text>
            </Section>

            <Section>
                <SectionTitle>Updates to This Policy</SectionTitle>
                <Text>We may update this policy periodically. Significant changes will be communicated through:</Text>
                <List>
                    <ListItem>Website notifications</ListItem>
                    <ListItem>Email announcements</ListItem>
                    <ListItem>Account dashboard alerts</ListItem>
                </List>
            </Section>

            <ContactSection>
                <SectionTitle>Contact Information</SectionTitle>
                <Text>For privacy-related inquiries, please contact:</Text>
                
                <ContactInfo>
                    <strong>BenzFlex Privacy Team</strong><br />
                    Email: privacy@benzflex.com<br />
                    Phone: [St. Louis Office Number]<br />
                    Address: [BenzFlex St. Louis Location]
                </ContactInfo>
                
                <Text>
                    For data access or deletion requests: <strong>data-request@benzflex.com</strong>
                </Text>
            </ContactSection>

            <Section>
                <SectionTitle>Additional Missouri Resources</SectionTitle>
                <Text>
                    <strong>Missouri Attorney General&apos;s Office</strong><br />
                    Consumer Protection Division<br />
                    <StyledLink href="https://ago.mo.gov/app/consumercomplaint">
                        https://ago.mo.gov/app/consumercomplaint
                    </StyledLink>
                </Text>
            </Section>

            <Footer>
                <Text>
                    This Privacy Policy is designed to comply with applicable Missouri laws and 
                    industry best practices for car rental companies operating in St. Louis.
                </Text>
            </Footer>
        </PrivacyContainer>
    );
}

export default PrivacyPage;
