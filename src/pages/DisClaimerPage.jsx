import React from 'react';
import styled from 'styled-components';
import { devices } from '../styles/GlobalStyles';



function DisclaimerPage() {
    return (
        <DisclaimerContainer>
            <DisclaimerHeader>Legal Disclaimers</DisclaimerHeader>
            
            <LastUpdated>
                <strong>Last updated March 1, 2025</strong>
            </LastUpdated>

            <WarningSection>
                <SectionTitle>Important Notice</SectionTitle>
                <WarningText>
                    Please read these disclaimers carefully before renting any vehicle from BenzFlex. 
                    By proceeding with a rental, you acknowledge and agree to all terms outlined below.
                </WarningText>
            </WarningSection>

            <Section>
                <SectionTitle>Vehicle Information & Verification</SectionTitle>
                <Text>
                    <HighlightText>BenzFlex has not independently verified</HighlightText> any of the statistics, 
                    specifications, or safety ratings provided for the vehicles on this website. BenzFlex 
                    is not liable for any personal injury or damages that may result from relying on 
                    these ratings or vehicle information.
                </Text>
                <Text>
                    Additionally, BenzFlex does not guarantee the quality of the products or services 
                    provided by the vehicle manufacturer or any third-party. BenzFlex is not responsible 
                    for any defects or performance issues that may arise with any vehicle rented from us.
                </Text>
            </Section>

            <Section>
                <SectionTitle>Vehicle Availability & Specifications</SectionTitle>
                <Text>
                    All vehicles are subject to availability and may change on short notice. 
                    <HighlightText> BenzFlex does not guarantee</HighlightText> the make, model, year, color, 
                    or any other specific feature of the vehicle you reserve.
                </Text>
                <Text>
                    Similarly, accessories provided with the vehicle, including but not limited to 
                    third-party adapters, chargers, or any other add-ons, are also subject to 
                    availability and may not always be provided as expected. Mileage is approximate, 
                    only periodically updated, and may vary based on usage.
                </Text>
            </Section>

            <Section>
                <SectionTitle>Vehicle Technologies & Safety Features</SectionTitle>
                <Text>
                    By renting a vehicle from BenzFlex, the customer acknowledges and assumes all risks 
                    associated with advanced vehicle technologies (including current and future recalls), 
                    including autopilot and self-driving features where applicable.
                </Text>
                <Text>
                    <HighlightText>BenzFlex is not liable</HighlightText> for any issues, including performance 
                    or safety concerns, arising from these technologies or recalls. Customers are advised 
                    to use these features at their own discretion and peril, and agree to indemnify 
                    BenzFlex against any claims or damages resulting from their use.
                </Text>
            </Section>

            <Section>
                <SectionTitle>Vehicle Performance & External Factors</SectionTitle>
                <Text>
                    Customers should be aware that weather conditions and the utilization of third-party 
                    services may adversely impact the vehicle&apos;s performance, including miles per charge 
                    for electric vehicles.
                </Text>
                <Text>
                    Factors such as temperature extremes, terrain, and the use of external services and 
                    accessories can affect the overall efficiency and performance of the vehicle. 
                    <HighlightText> BenzFlex is not responsible</HighlightText> for any reduction in performance 
                    due to these external factors.
                </Text>
            </Section>

            <InfoSection>
                <SectionTitle>Payment Processing & Security</SectionTitle>
                <Text>
                    <strong>Credit Card Payments:</strong> All credit card payments are securely processed through 
                    Stripe, our trusted payment processor. By providing your payment information, you 
                    acknowledge and agree to the following:
                </Text>
                <List>
                    <ListItem>
                        Your payment information is encrypted and processed securely by Stripe
                    </ListItem>
                    <ListItem>
                        BenzFlex does not store your complete credit card information on our servers
                    </ListItem>
                    <ListItem>
                        Stripe may charge processing fees in accordance with their terms of service
                    </ListItem>
                    <ListItem>
                        You authorize BenzFlex to charge the credit card on file for all rental fees, 
                        additional charges, and any applicable penalties
                    </ListItem>
                    <ListItem>
                        In the event of failed payments, you consent to BenzFlex retrying the charge 
                        and/or charging alternative payment methods on file
                    </ListItem>
                </List>
                <Text>
                    Your payment information will be handled according to Stripe&apos;s (
                    <StyledLink href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">
                        https://stripe.com/privacy
                    </StyledLink>
                    ) and BenzFlex&apos;s Privacy Policies. By providing your payment details, you agree to 
                    these terms and authorize the described payment processing.
                </Text>
            </InfoSection>

            <Section>
                <SectionTitle>Additional Charges & Fees</SectionTitle>
                <Text>
                    You acknowledge and agree that additional charges may apply for:
                </Text>
                <List>
                    <ListItem>Extended rental periods beyond agreed timeframe</ListItem>
                    <ListItem>Mileage overages beyond included limits</ListItem>
                    <ListItem>Cleaning fees for excessive dirt or stains</ListItem>
                    <ListItem>Fuel or charging costs not replenished</ListItem>
                    <ListItem>Traffic and parking violations during rental period</ListItem>
                    <ListItem>Damage to the vehicle beyond normal wear and tear</ListItem>
                    <ListItem>Late return fees</ListItem>
                    <ListItem>Administrative fees for payment processing issues</ListItem>
                </List>
                <Text>
                    These charges will be automatically processed through Stripe to the credit card 
                    on file following the completion of your rental period.
                </Text>
            </Section>

            <Section>
                <SectionTitle>Customer Responsibilities</SectionTitle>
                <Text>
                    As a customer, you are responsible for:
                </Text>
                <List>
                    <ListItem>Verifying vehicle specifications before rental</ListItem>
                    <ListItem>Understanding and properly using all vehicle features</ListItem>
                    <ListItem>Considering external factors that may affect vehicle performance</ListItem>
                    <ListItem>Maintaining appropriate insurance coverage</ListItem>
                    <ListItem>Operating the vehicle in a safe and lawful manner</ListItem>
                    <ListItem>Providing accurate payment information and maintaining valid payment methods</ListItem>
                    <ListItem>Reporting any issues with the vehicle immediately</ListItem>
                    <ListItem>Returning the vehicle in the same condition as received (minus normal wear)</ListItem>
                </List>
            </Section>

            <WarningSection>
                <SectionTitle>Acknowledgement of Risks</SectionTitle>
                <WarningText>
                    By renting a vehicle from BenzFlex, you acknowledge that you have read, understood, 
                    and agree to all disclaimers outlined above. You understand that vehicle rental 
                    involves certain inherent risks and that BenzFlex&apos;s liability is limited as described 
                    in these disclaimers and our rental agreement.
                </WarningText>
                <WarningText>
                    You also acknowledge and consent to the use of Stripe for payment processing and 
                    authorize all charges as described in this disclaimer and the rental agreement.
                </WarningText>
                <WarningText>
                    If you do not agree with any part of these disclaimers, you should not proceed with 
                    renting a vehicle from BenzFlex.
                </WarningText>
            </WarningSection>

            <Footer>
                <Text>
                    This Disclaimer page is provided for informational purposes only and does not 
                    constitute legal advice. For specific legal concerns, please consult with a 
                    qualified legal professional.
                </Text>
                <Text>
                    BenzFlex reserves the right to update these disclaimers at any time without 
                    prior notice.
                </Text>
            </Footer>
        </DisclaimerContainer>
    );
}

export default DisclaimerPage;


const DisclaimerContainer = styled.div`
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

const DisclaimerHeader = styled.h1`
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

const LastUpdated = styled.p`
  font-style: italic;
  margin-bottom: var(--space-xl);
  color: var(--text-muted);
  font-weight: var(--font-medium);
  text-align: center;
`;

const HighlightText = styled.span`
  color: var(--error);
  font-weight: var(--font-semibold);
`;