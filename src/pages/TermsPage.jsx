import React from 'react';
import styled from 'styled-components';
import { devices } from '../styles/GlobalStyles';


function TermsOfUsePage() {
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <TermsContainer>
            <TermsHeader>Terms of Use</TermsHeader>
            
            <LastUpdated>
                <strong>Last updated Feb 3, 2025</strong>
            </LastUpdated>

            <TableOfContents>
                <TocTitle>Table of Contents</TocTitle>
                <TocList>
                    <TocItem><a href="#agreement" onClick={() => scrollToSection('agreement')}>Agreement to Terms</a></TocItem>
                    <TocItem><a href="#intellectual-property" onClick={() => scrollToSection('intellectual-property')}>Intellectual Property Rights</a></TocItem>
                    <TocItem><a href="#user-representations" onClick={() => scrollToSection('user-representations')}>User Representations</a></TocItem>
                    <TocItem><a href="#prohibited-activities" onClick={() => scrollToSection('prohibited-activities')}>Prohibited Activities</a></TocItem>
                    <TocItem><a href="#user-contributions" onClick={() => scrollToSection('user-contributions')}>User Generated Contributions</a></TocItem>
                    <TocItem><a href="#contribution-license" onClick={() => scrollToSection('contribution-license')}>Contribution License</a></TocItem>
                    <TocItem><a href="#submissions" onClick={() => scrollToSection('submissions')}>Submissions</a></TocItem>
                    <TocItem><a href="#site-management" onClick={() => scrollToSection('site-management')}>Site Management</a></TocItem>
                    <TocItem><a href="#term-termination" onClick={() => scrollToSection('term-termination')}>Term and Termination</a></TocItem>
                    <TocItem><a href="#modifications" onClick={() => scrollToSection('modifications')}>Modifications and Interruptions</a></TocItem>
                    <TocItem><a href="#governing-law" onClick={() => scrollToSection('governing-law')}>Governing Law</a></TocItem>
                    <TocItem><a href="#dispute-resolution" onClick={() => scrollToSection('dispute-resolution')}>Dispute Resolution</a></TocItem>
                    <TocItem><a href="#corrections" onClick={() => scrollToSection('corrections')}>Corrections</a></TocItem>
                    <TocItem><a href="#disclaimer" onClick={() => scrollToSection('disclaimer')}>Disclaimer</a></TocItem>
                    <TocItem><a href="#limitations" onClick={() => scrollToSection('limitations')}>Limitations of Liability</a></TocItem>
                    <TocItem><a href="#indemnification" onClick={() => scrollToSection('indemnification')}>Indemnification</a></TocItem>
                    <TocItem><a href="#user-data" onClick={() => scrollToSection('user-data')}>User Data</a></TocItem>
                    <TocItem><a href="#electronic-communications" onClick={() => scrollToSection('electronic-communications')}>Electronic Communications</a></TocItem>
                    <TocItem><a href="#miscellaneous" onClick={() => scrollToSection('miscellaneous')}>Miscellaneous</a></TocItem>
                    <TocItem><a href="#refuse-service" onClick={() => scrollToSection('refuse-service')}>Right to Refuse Service</a></TocItem>
                    <TocItem><a href="#legal-disclaimers" onClick={() => scrollToSection('legal-disclaimers')}>Additional Legal Disclaimers</a></TocItem>
                    <TocItem><a href="#promotional-codes" onClick={() => scrollToSection('promotional-codes')}>Promotional Codes</a></TocItem>
                    <TocItem><a href="#contact" onClick={() => scrollToSection('contact')}>Contact Us</a></TocItem>
                </TocList>
            </TableOfContents>

            <Section id="agreement">
                <SectionTitle>1. Agreement to Terms</SectionTitle>
                <Text>
                    These Terms of Use constitute a legally binding agreement made between you, whether personally 
                    or on behalf of any entity (&quot;you&quot;) and BenzFlex LLC (doing business as BenzFlex) (&quot;BenzFlex&quot; 
                    &quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), concerning your access to and use of the BenzFlex website 
                    as well as any other media form, media channel, mobile website or mobile application related, 
                    linked, or otherwise connected thereto (collectively, the &quot;Site&quot;). You agree that by accessing 
                    the Site, you have read, understood, and agreed to be bound by all of the terms in the Terms of Use.
                </Text>
                <Text>
                    Supplemental terms and conditions or documents that may be posted on the Site from time to 
                    time are hereby expressly incorporated herein by reference. We reserve the right, in our sole 
                    discretion, to make changes or modifications to the Terms of Use at any time and for any reason.
                </Text>
            </Section>

            <Section id="intellectual-property">
                <SectionTitle>2. Intellectual Property Rights</SectionTitle>
                <Text>
                    Unless otherwise indicated, the Site is our proprietary property and all source code, databases, 
                    functionality, software, website designs, audio, video, text, photographs, and graphics on the 
                    Site (collectively, the &quot;ontent&quot;) and the trademarks, service marks, and logos contained therein 
                    (the &quot;Marks&quot;) are owned or controlled by us or licensed to us, and are protected by copyright and 
                    trademark laws and various other intellectual property rights.
                </Text>
            </Section>

            <Section id="user-representations">
                <SectionTitle>3. User Representations</SectionTitle>
                <Text>
                    By using the Site, you represent and warrant that:
                </Text>
                <List>
                    <ListItem>You have the legal capacity and you agree to comply with these Terms of Use</ListItem>
                    <ListItem>You are not a minor in the jurisdiction in which you reside</ListItem>
                    <ListItem>You will not access the Site through automated or non-human means</ListItem>
                    <ListItem>You will not use the Site for any illegal or unauthorized purpose</ListItem>
                    <ListItem>Your use of the Site will not violate any applicable law or regulation</ListItem>
                </List>
            </Section>

            <Section id="prohibited-activities">
                <SectionTitle>4. Prohibited Activities</SectionTitle>
                <Text>
                    You may not access or use the Site for any purpose other than that for which we make the Site 
                    available. As a user of the Site, you agree not to:
                </Text>
                <List>
                    <ListItem>Systematically retrieve data or other content from the Site without written permission</ListItem>
                    <ListItem>Trick, defraud, or mislead us and other users</ListItem>
                    <ListItem>Circumvent, disable, or otherwise interfere with security-related features</ListItem>
                    <ListItem>Disparage, tarnish, or otherwise harm us and/or the Site</ListItem>
                    <ListItem>Use information from the Site to harass, abuse, or harm another person</ListItem>
                    <ListItem>Make improper use of our support services</ListItem>
                    <ListItem>Engage in unauthorized framing of or linking to the Site</ListItem>
                    <ListItem>Upload or transmit viruses or other malicious material</ListItem>
                    <ListItem>Engage in any automated use of the system</ListItem>
                    <ListItem>Interfere with, disrupt, or create an undue burden on the Site</ListItem>
                </List>
            </Section>

            <Section id="user-contributions">
                <SectionTitle>5. User Generated Contributions</SectionTitle>
                <Text>
                    The Site may provide you with the opportunity to create, submit, post, display, transmit, 
                    perform, publish, distribute, or broadcast content and materials to us or on the Site. 
                    Contributions may be viewable by other users of the Site and through third-party websites.
                </Text>
            </Section>

            <Section id="contribution-license">
                <SectionTitle>6. Contribution License</SectionTitle>
                <Text>
                    You agree that we may access, store, process, and use any information and personal data 
                    that you provide following the terms of the Privacy Policy and your choices.
                </Text>
            </Section>

            <Section id="submissions">
                <SectionTitle>7. Submissions</SectionTitle>
                <Text>
                    You acknowledge and agree that any questions, comments, suggestions, ideas, feedback, or 
                    other information regarding the Site (&quot;Submissions&quot;) provided by you to us are non-confidential 
                    and shall become our sole property.
                </Text>
            </Section>

            <Section id="site-management">
                <SectionTitle>8. Site Management</SectionTitle>
                <Text>
                    We reserve the right, but not the obligation, to monitor the Site for violations of these 
                    Terms of Use and take appropriate legal action against anyone who violates the law or these Terms.
                </Text>
            </Section>

            <Section id="term-termination">
                <SectionTitle>9. Term and Termination</SectionTitle>
                <Text>
                    These Terms of Use shall remain in full force and effect while you use the Site. We reserve 
                    the right to deny access to and use of the Site to any person for any reason or for no reason.
                </Text>
            </Section>

            <Section id="modifications">
                <SectionTitle>10. Modifications and Interruptions</SectionTitle>
                <Text>
                    We reserve the right to change, modify, or remove the contents of the Site at any time or 
                    for any reason at our sole discretion without notice. We cannot guarantee the Site will be 
                    available at all times.
                </Text>
            </Section>

            <Section id="governing-law">
                <SectionTitle>11. Governing Law</SectionTitle>
                <Text>
                    These Terms shall be governed by and defined following the laws of Missouri. You irrevocably 
                    consent that the courts of Missouri shall have exclusive jurisdiction to resolve any dispute 
                    which may arise in connection with these terms.
                </Text>
            </Section>

            <WarningSection id="dispute-resolution">
                <SectionTitle>12. Dispute Resolution</SectionTitle>
                <WarningText>
                    YOU WAIVE YOUR RIGHT TO A JURY TRIAL OR TO PARTICIPATE IN A CLASS ACTION. YOU AGREE TO 
                    ARBITRATE ANY AND ALL CLAIMS AGAINST BENZFLEX INCLUDING BUT NOT LIMITED TO CLAIMS ARISING 
                    OUT OF OR RELATING TO THIS AGREEMENT, THE SITE, BENZFLEX&apos;S PRODUCTS AND SERVICES, CHARGES, 
                    ADVERTISINGS, OR RENTAL VEHICLES.
                </WarningText>
            </WarningSection>

            <Section id="corrections">
                <SectionTitle>13. Corrections</SectionTitle>
                <Text>
                    There may be information on the Site that contains typographical errors, inaccuracies, or 
                    omissions. We reserve the right to correct any errors, inaccuracies, or omissions and to 
                    change or update the information on the Site at any time, without prior notice.
                </Text>
            </Section>

            <Section id="disclaimer">
                <SectionTitle>14. Disclaimer</SectionTitle>
                <Text>
                    THE SITE IS PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE 
                    SITE AND OUR SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, 
                    WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED.
                </Text>
            </Section>

            <Section id="limitations">
                <SectionTitle>15. Limitations of Liability</SectionTitle>
                <Text>
                    In no event will we or our directors, owners, employees, contractors, affiliated companies, 
                    parent company, employees, or agents be liable to you or any third party for any direct, 
                    indirect, consequential, exemplary, incidental, special or punitive damages.
                </Text>
            </Section>

            <Section id="indemnification">
                <SectionTitle>16. Indemnification</SectionTitle>
                <Text>
                    You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, 
                    and all of our respective officers, agents, partners, owners, and employees, from and against 
                    any loss, damage, liability, claim, or demand.
                </Text>
            </Section>

            <Section id="user-data">
                <SectionTitle>17. User Data</SectionTitle>
                <Text>
                    We will maintain certain data that you transmit to the Site for the purpose of managing the 
                    performance of the Site. You are solely responsible for all data that you transmit or that 
                    relates to any activity you have undertaken using the Site.
                </Text>
            </Section>

            <Section id="electronic-communications">
                <SectionTitle>18. Electronic Communications, Transactions, and Signatures</SectionTitle>
                <Text>
                    Visiting the Site, sending us emails, and completing online forms constitute electronic 
                    communications. You consent to receive electronic communications, and you agree that all 
                    agreements, notices, disclosures, and other communications we provide to you electronically 
                    satisfy any legal requirement that such communication be in writing.
                </Text>
            </Section>

            <Section id="miscellaneous">
                <SectionTitle>19. Miscellaneous</SectionTitle>
                <Text>
                    These Terms of Use and any policies or operating rules posted by us on the Site constitute 
                    the entire agreement and understanding between you and us.
                </Text>
            </Section>

            <Section id="refuse-service">
                <SectionTitle>20. Right to Refuse Service</SectionTitle>
                <Text>
                    We reserve the right to deny rental services to individuals who have previously caused damage 
                    to our vehicles, violated the terms of this Agreement, failed to make timely payments for 
                    prior rentals, or engaged in conduct that we determine poses a risk to our vehicles, property, 
                    or business operations.
                </Text>
            </Section>

            <Section id="legal-disclaimers">
                <SectionTitle>21. Additional Legal Disclaimers</SectionTitle>
                <Text>
                    All disclaimers listed on our website are fully incorporated into these Terms of Service by 
                    reference. By agreeing to these Terms of Service, you acknowledge and agree to be bound by 
                    the conditions and stipulations outlined in our disclaimers.
                </Text>
            </Section>

            <Section id="promotional-codes">
                <SectionTitle>22. Promotional Codes</SectionTitle>
                <Text>
                    Promotional codes are valid for single use only and cannot be combined with other promotional 
                    offers or discounts. We reserve the right to modify, waive, or make exceptions to these terms. 
                    All promotional offers are subject to change or termination at any time without prior notice.
                </Text>
            </Section>

            <InfoSection id="contact">
                <SectionTitle>23. Contact Us</SectionTitle>
                <Text>
                    In order to resolve a complaint regarding the Site or to receive further information regarding 
                    use of the Site, please contact us at: <strong>admin@benzflex.com</strong>
                </Text>
            </InfoSection>

            <Footer>
                <Text>
                    This Terms of Use page is provided for informational purposes only and does not constitute 
                    legal advice. For specific legal concerns, please consult with a qualified legal professional.
                </Text>
                <Text>
                    BenzFlex reserves the right to update these terms at any time without prior notice.
                </Text>
            </Footer>
        </TermsContainer>
    );
}

export default TermsOfUsePage;

const TermsContainer = styled.div`
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

const TermsHeader = styled.h1`
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

// const SubSectionTitle = styled.h3`
//   color: var(--gray-700);
//   margin-bottom: var(--space-sm);
//   font-family: var(--font-body);
//   font-size: var(--text-lg);
//   font-weight: var(--font-medium);
// `;

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

const WarningSection = styled(Section)`
  background: #FEF2F2;
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--error);
  margin-bottom: var(--space-xl);
`;

const WarningText = styled(Text)`
  color: #991B1B;
  font-weight: var(--font-medium);
`;

const InfoSection = styled(Section)`
  background: var(--gray-50);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-300);
  margin-bottom: var(--space-xl);
`;

// const StyledLink = styled.a`
//   color: var(--primary);
//   text-decoration: none;
//   transition: color var(--transition-fast);
//   font-weight: var(--font-medium);

//   &:hover {
//     color: var(--primary-dark);
//     text-decoration: underline;
//   }
// `;

const Footer = styled.footer`
  margin-top: var(--space-2xl);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--gray-200);
  text-align: center;
  font-size: var(--text-sm);
  color: var(--text-muted);
  font-style: italic;
`;

const LastUpdated = styled.p`
  font-style: italic;
  margin-bottom: var(--space-xl);
  color: var(--text-muted);
  font-weight: var(--font-medium);
  text-align: center;
`;

const TableOfContents = styled.nav`
  background: var(--surface);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-200);
  margin-bottom: var(--space-xl);
`;

const TocTitle = styled.h3`
  color: var(--secondary);
  margin-bottom: var(--space-md);
  font-family: var(--font-heading);
`;

const TocList = styled.ol`
  padding-left: var(--space-lg);
  columns: 2;
  
  @media ${devices.sm} {
    columns: 1;
  }
`;

const TocItem = styled.li`
  margin-bottom: var(--space-xs);
  
  a {
    color: var(--primary);
    text-decoration: none;
    transition: color var(--transition-fast);
    
    &:hover {
      color: var(--primary-dark);
      text-decoration: underline;
    }
  }
`;