// pages/HelpCenterPage.js
import React, { useState } from "react";
import styled from "styled-components";

const HelpContainer = styled.div`
  padding: 2rem 0;
`;

const SearchSection = styled.div`
  background: #f8fafc;
  padding: 2rem;
  border-radius: 0.5rem;
  text-align: center;
  margin-bottom: 2rem;
`;

const SearchInput = styled.div`
  max-width: 600px;
  margin: 0 auto;
  position: relative;

  input {
    width: 100%;
    padding: 1rem;
    padding-right: 50px;
    border: 1px solid #ddd;
    border-radius: 2rem;
    font-size: 1rem;
  }

  button {
    position: absolute;
    right: 5px;
    top: 5px;
    bottom: 5px;
    background: ${(props) => props.theme.colors.primary};
    color: white;
    border: none;
    border-radius: 2rem;
    padding: 0 1.5rem;
    cursor: pointer;
  }
`;

const FaqSection = styled.div`
  margin-top: 3rem;
`;

const FaqItem = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  overflow: hidden;
`;

const FaqQuestion = styled.div`
  padding: 1.5rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;

  &:hover {
    background: #f8fafc;
  }
`;

const FaqAnswer = styled.div`
  padding: 0 1.5rem;
  max-height: ${(props) => (props.isOpen ? "500px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
  background: #f8fafc;

  ${(props) =>
    props.isOpen &&
    `
    padding: 1.5rem;
  `}
`;

const HelpTopics = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const TopicCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    color: ${(props) => props.theme.colors.primary};
    margin-bottom: 1rem;
  }
`;

const HelpCenterPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: "What do I need to rent a car?",
      answer:
        "To rent a car, you need a valid driver's license, a credit card in your name, and proof of insurance. Renters must be at least 21 years old (25 for certain vehicle classes).",
    },
    {
      question: "Can I modify or cancel my reservation?",
      answer:
        "Yes, you can modify or cancel your reservation free of charge up to 24 hours before your scheduled pickup time. Please log into your account or contact our customer service team.",
    },
    {
      question: "What is your fuel policy?",
      answer:
        'Our standard fuel policy is "full-to-full". You will receive the car with a full tank and should return it with a full tank. If you return it with less fuel, we will charge for the missing fuel plus a refueling service fee.',
    },
    {
      question: "Can I add an additional driver?",
      answer:
        "Yes, you can add additional drivers for a small daily fee. All additional drivers must meet the same requirements as the primary driver and must be present at the time of rental with their driver's license.",
    },
    {
      question: "What happens if I return the car late?",
      answer:
        "If you return the car later than the scheduled return time, you will be charged for the additional time at the standard daily rate. We allow a 29-minute grace period, after which late fees apply.",
    },
    {
      question: "Do you offer roadside assistance?",
      answer:
        "Yes, we provide 24/7 roadside assistance for all our rentals. This service includes lockout assistance, jump-starts, flat tire changes, and towing if necessary. The contact number is provided with your rental documents.",
    },
  ];

  const topics = [
    {
      title: "Booking Process",
      description: "Learn how to make, modify, or cancel reservations",
    },
    {
      title: "Requirements",
      description: "Understand what you need to rent a vehicle",
    },
    {
      title: "Pricing & Payments",
      description: "Information about rates, fees, and payment methods",
    },
    {
      title: "Insurance Options",
      description: "Details about coverage and protection plans",
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <HelpContainer className="container">
      <div className="section">
        <h1 className="section-title">Help Center</h1>

        <SearchSection>
          <h2>How can we help you?</h2>
          <SearchInput>
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button>Search</button>
          </SearchInput>
        </SearchSection>

        <HelpTopics>
          {topics.map((topic, index) => (
            <TopicCard key={index}>
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
              <button className="btn btn-primary" style={{ marginTop: "1rem" }}>
                Learn More
              </button>
            </TopicCard>
          ))}
        </HelpTopics>

        <FaqSection>
          <h2 className="section-title">Frequently Asked Questions</h2>
          {faqs.map((faq, index) => (
            <FaqItem key={index}>
              <FaqQuestion onClick={() => toggleFaq(index)}>
                {faq.question}
                <span>{openFaq === index ? "−" : "+"}</span>
              </FaqQuestion>
              <FaqAnswer isOpen={openFaq === index}>{faq.answer}</FaqAnswer>
            </FaqItem>
          ))}
        </FaqSection>

        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <h2>Still need help?</h2>
          <p>Our customer support team is available to assist you</p>
          <button className="btn btn-primary" style={{ marginTop: "1rem" }}>
            Contact Support
          </button>
        </div>
      </div>
    </HelpContainer>
  );
};

export default HelpCenterPage;
