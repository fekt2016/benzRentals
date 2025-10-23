import React from 'react';
import styled from 'styled-components';
import { devices } from '../styles/GlobalStyles';

const PoliciesContainer = styled.div`
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

const PoliciesHeader = styled.h1`
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

const FeeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
`;

const FeeCategory = styled.div`
  margin-bottom: var(--space-lg);
`;

const FeeItem = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-md);
  padding: var(--space-sm);
  border-bottom: 1px solid var(--gray-200);
  
  @media ${devices.sm} {
    grid-template-columns: 1fr;
    gap: var(--space-xs);
  }
`;

const FeeDescription = styled.div`
  color: var(--text-secondary);
`;

const FeeAmount = styled.div`
  color: var(--primary);
  font-weight: var(--font-semibold);
  text-align: right;
  
  @media ${devices.sm} {
    text-align: left;
  }
`;

const Note = styled.p`
  font-style: italic;
  color: var(--text-muted);
  font-size: var(--text-sm);
  margin-top: var(--space-xs);
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

function GeneralPoliciesPage() {
    return (
        <PoliciesContainer>
            <PoliciesHeader>General Policies</PoliciesHeader>
            
            <LastUpdated>
                <strong>Last updated May 20, 2025</strong>
            </LastUpdated>

            <Section>
                <SectionTitle>Eligibility Policy</SectionTitle>
                <Text>
                    To rent a vehicle from BenzFlex, renters must meet and continue to meet the following 
                    minimum requirements for the entire duration of the rental:
                </Text>
                <List>
                    <ListItem><strong>Age:</strong> Renters must be at least 21 years old.</ListItem>
                    <ListItem><strong>Driver&apos;s License:</strong> A valid U.S. driver&apos;s license is required at the time of rental and must remain valid throughout the rental period. Expired, suspended, or revoked licenses will result in immediate termination of the rental. International driver&apos;s licenses are not accepted.</ListItem>
                    <ListItem><strong>Soft Credit Check:</strong> A soft credit check will be required to qualify for rental approval.</ListItem>
                    <ListItem><strong>Payment Method:</strong> A single credit or debit card must be provided at the time of booking and must remain valid for the entire reservation. Switching or using multiple cards during the rental period is not permitted.</ListItem>
                    <ListItem><strong>Driving Record:</strong> Renters must have a clean driving record with no recent major violations, suspensions, or excessive traffic infractions.</ListItem>
                </List>
                <Text>
                    BenzFlex reserves the right to deny or terminate rental services at its sole discretion 
                    if any eligibility criteria are not met or if any condition changes during the rental period.
                </Text>
            </Section>

            <Section>
                <SectionTitle>Cancellation Policy</SectionTitle>
                <Text>
                    BenzFlex reserves the right to cancel a reservation at any time and at its sole discretion. 
                    Reasons for cancellation may include, but are not limited to, suspicious activity, fraud, 
                    forged insurance documents, invalid credit cards, reckless driving, or non-payment.
                </Text>
                <Text>
                    Renters may cancel their reservation at any time by calling or texting BenzFlex. Please 
                    refer to our Refund Policy below for further details.
                </Text>
            </Section>

            <Section>
                <SectionTitle>Refund Policy</SectionTitle>
                <Text>
                    Renters may cancel their reservation without penalty up to 24 hours before the scheduled 
                    start of their trip. Cancellations made within 24 hours of the trip start time may be 
                    eligible for a partial refund at BenzFlex&apos;s discretion.
                </Text>
                <Text>
                    If BenzFlex cancels a reservation and the renter has not violated any policies or agreements, 
                    a refund will be issued for the unused portion of the trip. The cancellation time will be 
                    determined as the later of:
                </Text>
                <List>
                    <ListItem>The time the vehicle is returned to the designated return location, or</ListItem>
                    <ListItem>The time BenzFlex is notified by call or text of the renter&apos;s intent to cancel the remaining portion of the trip and the vehicle is successfully returned to the designated return location.</ListItem>
                </List>
                <Text>
                    If a renter returns the vehicle early, any refund for the unused portion of the rental will 
                    be at BenzFlex&apos;s discretion. The decision will consider factors such as the notice provided, 
                    the reason for early return, and the ability to re-rent the vehicle.
                </Text>
            </Section>

            <Section>
                <SectionTitle>Extensions and Modifications Policy</SectionTitle>
                <Text>
                    If a renter wishes to extend their reservation, approval will be at BenzFlex&apos;s sole discretion. 
                    BenzFlex may require the renter to exchange the vehicle for a different one or undergo an 
                    inspection by a BenzFlex team member before the extension is granted.
                </Text>
                <Text>
                    Factors such as vehicle availability, condition, and the renter&apos;s compliance with rental 
                    policies will be considered. Renters are encouraged to request extensions as early as 
                    possible to allow sufficient time for any necessary arrangements.
                </Text>
            </Section>

            <WarningSection>
                <SectionTitle>Collections Policy</SectionTitle>
                <WarningText>
                    When a renter&apos;s account is unpaid and forwarded to a collection agency, additional collection 
                    costs, collection fees and/or collection expenses will be incurred, the precise amount of 
                    which is difficult or impossible to know at that time.
                </WarningText>
                <WarningText>
                    Therefore, the renter agrees that upon placement with a collection agency the renter will 
                    pay an additional 25% of the unpaid debt after default as liquidated damages. Additionally, 
                    in the event BenzFlex utilizes an attorney to assist in our recovery of the debt, the renter 
                    agrees to pay reasonable attorney fees of at least 15% of the unpaid debt after default, in 
                    addition to the debt and collection costs/fees/expenses.
                </WarningText>
                <WarningText>
                    Renters who dispute valid charges paid during their reservation will be subject to 1st party 
                    collections efforts as permitted by law, including being reported to the credit bureaus.
                </WarningText>
            </WarningSection>

            <Section>
                <SectionTitle>No Show Policy</SectionTitle>
                <Text>
                    A renter will be considered a no-show if they fail to cancel their reservation and do not 
                    arrive within 3 hours of the scheduled trip start time, or if the provided documentation 
                    is insufficient for verification purposes.
                </Text>
                <Text>
                    BenzFlex will not accommodate requests to delay the start time. Exceptions may be made at 
                    BenzFlex&apos;s discretion for circumstances beyond the renter&apos;s control, such as delayed flights. 
                    Renters must notify BenzFlex if they anticipate arriving later than 3 hours after the 
                    scheduled start time.
                </Text>
            </Section>

            <Section>
                <SectionTitle>Fee Policy</SectionTitle>
                <SubSectionTitle>Violations:</SubSectionTitle>
                <FeeGrid>
                    <FeeCategory>
                        <FeeItem>
                            <FeeDescription>Smoking Fee</FeeDescription>
                            <FeeAmount>$350 / one time</FeeAmount>
                        </FeeItem>
                        
                        <FeeItem>
                            <FeeDescription>Re-charge Fee</FeeDescription>
                            <FeeAmount>$25 - $80 / one time</FeeAmount>
                        </FeeItem>
                        <Note>Applies to vehicles returned with less than 80% charge. $25 (51%-75% battery), $40 (21%-50% battery), $80 (0%-20% battery)</Note>
                        
                        <FeeItem>
                            <FeeDescription>Cleaning Fee</FeeDescription>
                            <FeeAmount>$350 / one time</FeeAmount>
                        </FeeItem>
                        <Note>Applies to vehicles returned with excessive garbage, dirt, hair, stains, spills, food waste, etc.</Note>
                        
                        <FeeItem>
                            <FeeDescription>Biohazard Cleaning Fee</FeeDescription>
                            <FeeAmount>$75 / one time</FeeAmount>
                        </FeeItem>
                        <Note>Applies to any bodily fluids, illicit drugs, paraphernalia, etc.</Note>
                        
                        <FeeItem>
                            <FeeDescription>Late Fee</FeeDescription>
                            <FeeAmount>$50 + additional rental rate</FeeAmount>
                        </FeeItem>
                        <Note>Applies to vehicles returned more than 30 minutes after your scheduled return time.</Note>
                        
                        <FeeItem>
                            <FeeDescription>Missing J1772 Charging Adapter Fee</FeeDescription>
                            <FeeAmount>$75 / one time</FeeAmount>
                        </FeeItem>
                        
                        <FeeItem>
                            <FeeDescription>Missing Physical Key</FeeDescription>
                            <FeeAmount>$250 / one time</FeeAmount>
                        </FeeItem>
                        <Note>Applies to vehicles returned without the physical key, if applicable.</Note>
                        
                        <FeeItem>
                            <FeeDescription>Ticket Administration Fee</FeeDescription>
                            <FeeAmount>$15 / per occurrence</FeeAmount>
                        </FeeItem>
                        <Note>This fee is charged for our internal processing of any state, federal, or municipal tickets, including traffic and parking fines, that are reported or linked to the rental period. Please note, this is strictly an administrative processing fee. Renters are independently responsible for addressing and settling all associated fees, penalties, and fines directly with the issuing authorities.</Note>
                        
                        <FeeItem>
                            <FeeDescription>Relocation Fee</FeeDescription>
                            <FeeAmount>$50 + $5/mile</FeeAmount>
                        </FeeItem>
                        <Note>This fee is charged when the vehicle is dropped off in a different BenzFlex lot than the designated return location. You will incur $5/mile fee for every mile between the return location and the place where the vehicle is returned.</Note>
                        
                        <FeeItem>
                            <FeeDescription>Abandonment Fee</FeeDescription>
                            <FeeAmount>$500 + cost</FeeAmount>
                        </FeeItem>
                        <Note>This fee is charged when the vehicle is dropped off in a non BenzFlex lot. You will incur a flat $500 fee and will reimburse our cost to return the vehicle to the proper return location.</Note>
                        
                        <FeeItem>
                            <FeeDescription>Mileage Overage</FeeDescription>
                            <FeeAmount>$0.50/mile</FeeAmount>
                        </FeeItem>
                        <Note>Each rental day has a mileage allowance of 250 miles, averaged out over the duration of the rental period. We charge excessive mileage at a rate of $0.50 per mile.</Note>
                    </FeeCategory>

                    <FeeCategory>
                        <SubSectionTitle>Additionals:</SubSectionTitle>
                        <FeeItem>
                            <FeeDescription>Delivery Fee</FeeDescription>
                            <FeeAmount>$75 / one time</FeeAmount>
                        </FeeItem>
                        <Note>Required for all airport locations and is not available or applicable at all locations.</Note>
                        
                        <FeeItem>
                            <FeeDescription>Underage Driver</FeeDescription>
                            <FeeAmount>$100/day</FeeAmount>
                        </FeeItem>
                        <Note>Required for all drivers under the age of 25.</Note>
                    </FeeCategory>

                    <FeeCategory>
                        <SubSectionTitle>Add-ons:</SubSectionTitle>
                        <FeeItem>
                            <FeeDescription>Damage Waiver</FeeDescription>
                            <FeeAmount>$20-$30/day</FeeAmount>
                        </FeeItem>
                        <Note>The rate is determined at the time of purchase based on the number of days in your original reservation. It does not adjust based on the total accumulated days of your trip.</Note>
                        
                        <FeeItem>
                            <FeeDescription>Unlimited Mileage</FeeDescription>
                            <FeeAmount>$9/day</FeeAmount>
                        </FeeItem>
                        
                        <FeeItem>
                            <FeeDescription>Prepaid Re-charge</FeeDescription>
                            <FeeAmount>$35 / one time</FeeAmount>
                        </FeeItem>
                        <Note>Return your Tesla at any charge level over 10% to avoid the Re-charge Fee.</Note>
                    </FeeCategory>

                    <FeeCategory>
                        <SubSectionTitle>Incidentals:</SubSectionTitle>
                        <FeeItem>
                            <FeeDescription>Roadside Assistance</FeeDescription>
                            <FeeAmount>$250 / one time + cost</FeeAmount>
                        </FeeItem>
                        
                        <FeeItem>
                            <FeeDescription>Repossession Fee</FeeDescription>
                            <FeeAmount>$250 / one time + cost</FeeAmount>
                        </FeeItem>
                        
                        <FeeItem>
                            <FeeDescription>Recovery Fee</FeeDescription>
                            <FeeAmount>$250 / one time + mileage fee + expenses</FeeAmount>
                        </FeeItem>
                        
                        <FeeItem>
                            <FeeDescription>Flat Tire</FeeDescription>
                            <FeeAmount>Variable + cost</FeeAmount>
                        </FeeItem>
                        
                        <FeeItem>
                            <FeeDescription>Toll Fee</FeeDescription>
                            <FeeAmount>25% of tolls + cost</FeeAmount>
                        </FeeItem>
                    </FeeCategory>

                    <FeeCategory>
                        <SubSectionTitle>Security Deposit:</SubSectionTitle>
                        <FeeItem>
                            <FeeDescription>Rental Deposit</FeeDescription>
                            <FeeAmount>$200 / one time</FeeAmount>
                        </FeeItem>
                        <Note>Before your trip begins, a $200 security deposit will be authorized on your card on file. This deposit will be released after the vehicle is returned and all incidentals are applied, minus any outstanding balance.</Note>
                        
                        <FeeItem>
                            <FeeDescription>Supercharging Deposit</FeeDescription>
                            <FeeAmount>$1 / one time</FeeAmount>
                        </FeeItem>
                        <Note>In order to access your digital key, a $1 security deposit will be authorized on the card you provide on the opening the digital key. This deposit will be released after the vehicle is returned minus any outstanding supercharging balance.</Note>
                    </FeeCategory>
                </FeeGrid>
            </Section>

            <Section>
                <SectionTitle>Service Animal and Cleaning Policy</SectionTitle>
                <Text>
                    We welcome service animals in all our rental vehicles in compliance with ADA regulations, 
                    and no additional fees will be charged for their presence. However, if the vehicle is 
                    returned in a condition that requires cleaning beyond normal wear and tear, including the 
                    removal of pet hair, an additional cleaning fee of $350 may be applied.
                </Text>
                <Text>
                    Any excessive cleaning needs or damage caused by the service animal will be assessed and 
                    charged according to our standard damage and cleaning policies.
                </Text>
            </Section>

            <Section>
                <SectionTitle>Communications Policy</SectionTitle>
                <Text>
                    A renter must maintain the same phone number from the pre-reservation stage through the 
                    post-reservation stage, as this number is linked to their rental profile and serves as 
                    BenzFlex&apos;s primary method of communication.
                </Text>
                <Text>
                    BenzFlex provides a digital key that can only be sent to and accessed by the phone number 
                    on the reservation. Changes to the phone number associated with the reservation or profile 
                    are not permitted and may result in BenzFlex canceling the reservation or complications 
                    with the rental process.
                </Text>
            </Section>

            <InfoSection>
                <SectionTitle>Policy Notice</SectionTitle>
                <Text>
                    The policies outlined above are provided for the convenience of our renters and do not 
                    limit or restrict any rights, powers, or discretion that BenzFlex may have under the 
                    rental agreement or applicable law. BenzFlex reserves all rights and remedies available 
                    to it under the rental agreement and the law.
                </Text>
            </InfoSection>

            <Footer>
                <Text>
                    These policies are subject to change without prior notice. For the most current policies, 
                    please refer to our website or contact customer service.
                </Text>
            </Footer>
        </PoliciesContainer>
    );
}

export default GeneralPoliciesPage;