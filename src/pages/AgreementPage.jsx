import React from 'react';
import styled from 'styled-components';
import { devices } from '../styles/GlobalStyles';

const AgreementContainer = styled.div`
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

const AgreementHeader = styled.h1`
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

function RentalAgreementPage() {
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <AgreementContainer>
            <AgreementHeader>Rental Agreement</AgreementHeader>
            
            <LastUpdated>
                <strong>Last Updated August 27, 2025</strong>
            </LastUpdated>

            <TableOfContents>
                <TocTitle>Table of Contents</TocTitle>
                <TocList>
                    <TocItem><a href="#definitions" onClick={() => scrollToSection('definitions')}>Definitions</a></TocItem>
                    <TocItem><a href="#rental-indemnity" onClick={() => scrollToSection('rental-indemnity')}>Rental, Indemnity and Warranties</a></TocItem>
                    <TocItem><a href="#condition-return" onClick={() => scrollToSection('condition-return')}>Condition and Return of Vehicle</a></TocItem>
                    <TocItem><a href="#responsibility-damage" onClick={() => scrollToSection('responsibility-damage')}>Responsibility for Damage or Loss</a></TocItem>
                    <TocItem><a href="#breach-agreement" onClick={() => scrollToSection('breach-agreement')}>Breach of Agreement</a></TocItem>
                    <TocItem><a href="#insurance" onClick={() => scrollToSection('insurance')}>Insurance</a></TocItem>
                    <TocItem><a href="#charges" onClick={() => scrollToSection('charges')}>Charges</a></TocItem>
                    <TocItem><a href="#deposit" onClick={() => scrollToSection('deposit')}>Deposit</a></TocItem>
                    <TocItem><a href="#your-property" onClick={() => scrollToSection('your-property')}>Your Property</a></TocItem>
                    <TocItem><a href="#modifications" onClick={() => scrollToSection('modifications')}>Modifications</a></TocItem>
                    <TocItem><a href="#miscellaneous" onClick={() => scrollToSection('miscellaneous')}>Miscellaneous</a></TocItem>
                    <TocItem><a href="#continuation" onClick={() => scrollToSection('continuation')}>Continuation of Agreement</a></TocItem>
                    <TocItem><a href="#data-protection" onClick={() => scrollToSection('data-protection')}>Data Protection and Vehicle Tracking</a></TocItem>
                    <TocItem><a href="#general-policies" onClick={() => scrollToSection('general-policies')}>General Policies</a></TocItem>
                    <TocItem><a href="#electronic-consent" onClick={() => scrollToSection('electronic-consent')}>Electronic Consent and Communication</a></TocItem>
                    <TocItem><a href="#dispute-resolution" onClick={() => scrollToSection('dispute-resolution')}>Dispute Resolution</a></TocItem>
                </TocList>
            </TableOfContents>

            <Section id="definitions">
                <SectionTitle>1. Definitions</SectionTitle>
                <Text>
                    &quot;Agreement&quot; means all terms and conditions found on both sides of this form. &quot;You&quot; or &quot;your&quot; 
                    means the person identified as the customer elsewhere in this Agreement, any person signing 
                    this Agreement, any Authorized Driver and any person or organization to whom charges are 
                    billed by us at its or the customer&apos;s direction.
                </Text>
                <Text>
                    &quot;We&quot;, &quot;our&quot; or &quot;us&quot; means BenzFlex. &quot;Authorized Driver&quot; means the renter and any additional 
                    driver listed by us on this Agreement, provided that person has a valid driver&apos;s license and 
                    is at least age 21. Only Authorized Drivers may operate the Vehicle.
                </Text>
                <Text>
                    &quot;Vehicle&quot; means the automobile or truck identified in this Agreement and any vehicle we 
                    substitute for it, and all its tires, tools, accessories, equipment, keys and vehicle documents.
                </Text>
            </Section>

            <Section id="rental-indemnity">
                <SectionTitle>2. Rental, Indemnity and Warranties</SectionTitle>
                <Text>
                    This is a contract for the rental of the Vehicle. We may repossess the Vehicle at your expense 
                    without notice to you, if the Vehicle is abandoned or used in violation of law or this Agreement.
                </Text>
                <Text>
                    You agree to indemnify us, defend us and hold us harmless from all claims, liability, costs 
                    and attorney fees we incur resulting from, or arising out of, this rental and your use of the Vehicle.
                </Text>
                <Text>
                    We make no warranties, express, implied or apparent, regarding the vehicle, no warranty of 
                    merchantability and no warranty that the vehicle is fit for a particular purpose.
                </Text>
                <Text>
                    Because the customer is providing automobile insurance, we are not. The owner does not extend 
                    any of its motor vehicle financial responsibility or provide public liability insurance coverage 
                    to the renter, authorized drivers, or any other drivers.
                </Text>
            </Section>

            <Section id="condition-return">
                <SectionTitle>3. Condition and Return of Vehicle</SectionTitle>
                <Text>
                    You must return the Vehicle to our rental office on the date and time specified in this Agreement, 
                    and in the same condition that you received it, except for ordinary wear.
                </Text>
                <Text>
                    If the Vehicle is returned after closing hours, you remain responsible for the safety of, and 
                    any damage to, or loss of, the Vehicle until we inspect it upon our next opening for business.
                </Text>
                <Text>
                    Service to the Vehicle or replacement of parts or accessories during the rental must have our 
                    prior approval. You must check and maintain all fluid levels.
                </Text>
            </Section>

            <Section id="responsibility-damage">
                <SectionTitle>4. Responsibility for Damage or Loss; Reporting to Police</SectionTitle>
                <Text>
                    You are responsible for all loss or theft of, or damage to, the Vehicle, which includes the 
                    cost of repair, or the actual cash retail value of the Vehicle on the date of the loss if the 
                    Vehicle is not repairable or if we elect not to repair the vehicle, plus loss of use, diminished 
                    value of the Vehicle caused by damage to it or repair of it, and our administrative expenses 
                    incurred processing the claim.
                </Text>
                <Text>
                    You must report all accidents or incidents of theft and vandalism to us and the police as 
                    soon as you discover them.
                </Text>
            </Section>

            <WarningSection id="breach-agreement">
                <SectionTitle>5. Breach of Agreement</SectionTitle>
                <WarningText>
                    The acts listed here are prohibited uses of the rental vehicle. Any loss or damage that:
                </WarningText>
                <List>
                    <ListItem>Is caused by anyone who is not an Authorized Driver</ListItem>
                    <ListItem>Is caused by anyone under the influence of prescription or nonprescription drugs or alcohol</ListItem>
                    <ListItem>Is caused by anyone who obtained the Vehicle by giving us false, fraudulent or misleading information</ListItem>
                    <ListItem>Occurs while the Vehicle is used in furtherance of any illegal purpose</ListItem>
                    <ListItem>Occurs while carrying persons or property for hire</ListItem>
                    <ListItem>Occurs while pushing or towing anything</ListItem>
                    <ListItem>Occurs in any race, speed test or contest</ListItem>
                    <ListItem>Occurs while teaching anyone to drive</ListItem>
                    <ListItem>Occurs while carrying dangerous or hazardous items or illegal material</ListItem>
                    <ListItem>Occurs when it is loaded beyond its capacity</ListItem>
                    <ListItem>Occurs as a result of driving the Vehicle on unpaved roads</ListItem>
                </List>
                <SubSectionTitle>Prohibited Uses of Vehicle:</SubSectionTitle>
                <WarningText>
                    In addition to the above, the Vehicle shall NOT, under any circumstances, be used for any 
                    of the following purposes:
                </WarningText>
                <List>
                    <ListItem>By anyone without first obtaining rental company&apos;s written consent</ListItem>
                    <ListItem>By anyone under age 25</ListItem>
                    <ListItem>By anyone who is not a qualified and licensed driver</ListItem>
                    <ListItem>To carry persons or property for hire</ListItem>
                    <ListItem>To propel or tow any vehicle, trailer, or other object</ListItem>
                    <ListItem>In any race, test, or contest</ListItem>
                    <ListItem>For any illegal purpose or in the commission of a crime</ListItem>
                    <ListItem>While under the influence of alcohol or other intoxicants</ListItem>
                    <ListItem>On other than a paved road or graded private road or driveway</ListItem>
                    <ListItem>In an unsafe, reckless, grossly negligent, or wanton manner</ListItem>
                </List>
                <SubSectionTitle>Consequences of Prohibited Use:</SubSectionTitle>
                <WarningText>
                    VIOLATING ANY PROHIBITED USE OF THE VEHICLE VOIDS ANY COLLISION DAMAGE WAIVER AGREEMENT, 
                    ALL LIABILITY, AND OTHER INSURANCE COVERAGE, MAKES THE VEHICLE SUBJECT TO IMMEDIATE RECOVERY, 
                    AND MAKES THE RENTER RESPONSIBLE FOR ALL LOSS OF OR DAMAGE TO THE VEHICLE.
                </WarningText>
            </WarningSection>

            <Section id="insurance">
                <SectionTitle>6. Insurance</SectionTitle>
                <Text>
                    Customer agrees to maintain automobile insurance during the term of this rental agreement, 
                    providing the owner, the renter, and any other person using or operating the rental vehicle 
                    with the following primary coverage:
                </Text>
                <List>
                    <ListItem>Bodily injury and property damage liability coverage</ListItem>
                    <ListItem>Personal injury protection, no-fault, or similar coverage where required</ListItem>
                    <ListItem>Uninsured / underinsured coverage where required</ListItem>
                    <ListItem>Comprehensive and collision damage coverage extending to the rental vehicle</ListItem>
                </List>
                <Text>
                    Customer&apos;s insurance will provide at least the minimum limits of coverage required by the 
                    financial responsibility laws of the state where the loss occurs.
                </Text>
                <Text>
                    Because the customer is providing automobile insurance, we are not. In states where the law 
                    requires us to provide insurance we will provide excess insurance only, up to the minimum 
                    limits required by the financial responsibility laws.
                </Text>
            </Section>

            <Section id="charges">
                <SectionTitle>7. Charges</SectionTitle>
                <Text>
                    You will pay us, or the appropriate government authorities, on demand all charges due us 
                    under this Agreement, including, but not limited to:
                </Text>
                <List>
                    <ListItem>Time and mileage for the period you keep the Vehicle</ListItem>
                    <ListItem>Charges for additional drivers</ListItem>
                    <ListItem>Optional products and services you purchased</ListItem>
                    <ListItem>Charge, if you return the Vehicle with less charge than when rented</ListItem>
                    <ListItem>Applicable taxes</ListItem>
                    <ListItem>All parking, speeding, red light camera, or similar tickets incurred during the rental period</ListItem>
                    <ListItem>All toll-related charges</ListItem>
                    <ListItem>Relocation and recovery expenses if you fail to return the Vehicle properly</ListItem>
                    <ListItem>All costs, including attorney fees, we incur collecting payment from you</ListItem>
                    <ListItem>A 2% per month late payment fee on all amounts past due</ListItem>
                    <ListItem>Returned check fees</ListItem>
                    <ListItem>Cleaning fees if Vehicle is returned substantially less clean than when rented</ListItem>
                </List>
                <SubSectionTitle>7A. Payment Authorization and Credit Card Storage</SubSectionTitle>
                <Text>
                    By entering into this Agreement, you authorize BenzFlex to store your credit card information 
                    for future rental transactions. You agree that any credit card provided by you may be charged 
                    for amounts due under this Agreement.
                </Text>
                <Text>
                    You understand that BenzFlex uses Stripe, a third-party payment processor, for the secure 
                    handling of your payment information. BenzFlex does not store your credit card details directly 
                    but relies on Stripe&apos;s secure system to manage your payment information.
                </Text>
                <SubSectionTitle>7B. Tolling Policy</SubSectionTitle>
                <Text>
                    To simplify toll payments, BenzFlex offers a convenient tolling service. If you plan to use 
                    toll roads, you must notify us when booking your vehicle. This service costs $4 per day you 
                    use toll roads, plus the cost of the tolls.
                </Text>
            </Section>

            <Section id="deposit">
                <SectionTitle>8. Deposit</SectionTitle>
                <Text>
                    We may use your deposit to pay any amounts owed to us under this Agreement.
                </Text>
            </Section>

            <Section id="your-property">
                <SectionTitle>9. Your Property</SectionTitle>
                <Text>
                    You release us, our agents and employees from all claims for loss of, or damage to, your 
                    personal property or that of any other person, that we received, handled or stored, or that 
                    was left or carried in or on the Vehicle or in any service vehicle or in our offices.
                </Text>
            </Section>

            <Section id="modifications">
                <SectionTitle>10. Modifications</SectionTitle>
                <Text>
                    No term of this Agreement can be waived or modified except by a writing that we have signed. 
                    If you wish to extend the rental period, you must return the Vehicle to our rental office for 
                    inspection and written amendment by us of the due-in date.
                </Text>
                <Text>
                    This Agreement constitutes the entire agreement between you and us. All prior representations 
                    and agreements between you and us regarding this rental are void.
                </Text>
            </Section>

            <Section id="miscellaneous">
                <SectionTitle>11. Miscellaneous</SectionTitle>
                <Text>
                    A waiver by us of any breach of this Agreement is not a waiver of any additional breach or 
                    waiver of the performance of your obligations under this Agreement.
                </Text>
                <Text>
                    Unless prohibited by law, you release us from any liability for consequential, special or 
                    punitive damages in connection with this rental or the reservation of a vehicle.
                </Text>
                <SubSectionTitle>11.1 Right to Refuse Service</SubSectionTitle>
                <Text>
                    We reserve the right to deny rental services to any individual who has:
                </Text>
                <List>
                    <ListItem>Previously caused damage to our vehicles</ListItem>
                    <ListItem>Violated any terms of this Agreement</ListItem>
                    <ListItem>Failed to make timely payments for prior rentals</ListItem>
                    <ListItem>Engaged in any conduct deemed by us to pose a risk to our vehicles, property, or business operations</ListItem>
                </List>
            </Section>

            <Section id="continuation">
                <SectionTitle>12. Continuation of Agreement</SectionTitle>
                <Text>
                    By signing this Agreement, you acknowledge and agree that the terms and conditions of this 
                    Agreement, as well as BenzFlex&apos;s Terms of Service, Privacy Policy, and General Policies 
                    located on its website, shall apply to and cover all subsequent rental transactions between you and BenzFlex.
                </Text>
                <Text>&apos;s Terms of Service, Privacy Policy, and General 
                    Policies for updates or changes. By continuing to access or use our services after any updates 
                    or changes to these terms or policies, you agree to be bound by such updates or changes.
                </Text>
            </Section>

            <InfoSection id="data-protection">
                <SectionTitle>13. Data Protection and Vehicle Tracking</SectionTitle>
                <Text>
                    By signing this Agreement, you acknowledge and consent to the collection, use, storage, and 
                    disclosure of your personal information as outlined in BenzFlex&apos;s Privacy Policy.
                </Text>
                <Text>
                    You acknowledge that we may, for the purpose of ensuring the safety and integrity of our 
                    vehicles and compliance with the terms of this agreement, employ certain tracking technology 
                    to monitor the location and use of our rented vehicles.
                </Text>
                <SubSectionTitle>13.1 Credit Information Retention and Use</SubSectionTitle>
                <Text>
                    By signing this Agreement, you consent to BenzFlex storing and utilizing information obtained 
                    through soft credit checks or pre-qualification processes for as long as you maintain a BenzFlex account.
                </Text>
                <Text>
                    This information may be used solely for purposes permitted under the Fair Credit Reporting 
                    Act (FCRA), including underwriting future rentals, assessing rental risk, and dynamically 
                    adjusting rental prices based on risk trends.
                </Text>
            </InfoSection>

            <Section id="general-policies">
                <SectionTitle>14. General Policies</SectionTitle>
                <Text>
                    By entering into this Agreement, you agree to comply with BenzFlex&apos;s General Policies, 
                    including but not limited to the Cancellation Policy, Refund Policy, Fee Policy, and No-show 
                    Policy, which are incorporated herein by reference.
                </Text>
                <Text>
                    These General Policies may be updated from time to time and are available on BenzFlex&apos;s website. 
                    In the event of a conflict between this Agreement and the General Policies, this Agreement 
                    shall govern, except as otherwise provided.
                </Text>
            </Section>

            <Section id="electronic-consent">
                <SectionTitle>15. Electronic Consent and Communication</SectionTitle>
                <Text>
                    By signing this Agreement, you agree that your electronic signature is the legal equivalent 
                    of your manual signature. You consent to be legally bound by this Agreement&apos;s terms and 
                    conditions as if actually signed by you in writing.
                </Text>
                <Text>
                    You agree that we may communicate with you by electronic means, including email and SMS, 
                    and that standard SMS rates may apply.
                </Text>
                <SubSectionTitle>15A. Pre-Qualification and Credit Check Consent</SubSectionTitle>
                <Text>
                    By entering into this Agreement, you provide written instructions&quot; under the Fair Credit 
                    Reporting Act (FCRA), authorizing BenzFlex to obtain information from your personal credit 
                    profile and other information from Equifax, TransUnion, and/or Experian for the purpose of 
                    conducting a pre-qualification for credit as part of the rental process.
                </Text>
                <Text>
                    This pre-qualification will not affect your credit score.
                </Text>
            </Section>

            <Section id="dispute-resolution">
                <SectionTitle>16. Dispute Resolution</SectionTitle>
                <Text>
                    Any dispute, claim or controversy arising out of or relating to this Agreement or the breach, 
                    termination, enforcement, interpretation or validity thereof, including the determination 
                    of the scope or applicability of this agreement to arbitrate, shall be determined by arbitration.
                </Text>
                <Text>
                    The arbitration shall be administered by the American Arbitration Association (AAA) pursuant 
                    to its Comprehensive Arbitration Rules and Procedures. Judgment on the Award may be entered 
                    in any court having jurisdiction.
                </Text>
            </Section>

            <Footer>
                <Text>
                    This Rental Agreement is provided for informational purposes only and does not constitute 
                    legal advice. For specific legal concerns, please consult with a qualified legal professional.
                </Text>
                <Text>
                    BenzFlex reserves the right to update this agreement at any time without prior notice.
                </Text>
            </Footer>
        </AgreementContainer>
    );
}

export default RentalAgreementPage;
