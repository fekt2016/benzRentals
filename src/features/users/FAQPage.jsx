import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { FiSearch, FiHelpCircle, FiChevronDown, FiChevronUp } from "react-icons/fi";
import Container from "../../components/layout/Container";
import { devices } from "../../styles/GlobalStyles";
import usePageTitle from "../../app/hooks/usePageTitle";

const FAQContainer = styled(Container)`
  max-width: 900px;
  padding: 2rem 1rem;

  @media ${devices.sm} {
    padding: 1rem 0.5rem;
  }
`;

const FAQHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text || "#1f2937"};
    margin: 0 0 1rem 0;

    @media ${devices.sm} {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.125rem;
    color: ${({ theme }) => theme.colors.textMuted || "#6b7280"};
    margin: 0;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  input {
    width: 100%;
    padding: 1rem 1rem 1rem 3rem;
    border: 2px solid ${({ theme }) => theme.colors.border || "#e5e7eb"};
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary || "#3b82f6"};
    }
  }

  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.textMuted || "#6b7280"};
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const CategoryTab = styled.button`
  padding: 0.75rem 1.5rem;
  border: 2px solid ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.border)};
  background: ${({ theme, $active }) => ($active ? theme.colors.primary : "transparent")};
  color: ${({ theme, $active }) => ($active ? "#ffffff" : theme.colors.text)};
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.primaryLight)};
  }
`;

const FAQSection = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text || "#1f2937"};
  margin-bottom: 1.5rem;
`;

const FAQItem = styled.div`
  background: ${({ theme }) => theme.colors.background || "#ffffff"};
  border: 1px solid ${({ theme }) => theme.colors.border || "#e5e7eb"};
  border-radius: 8px;
  margin-bottom: 1rem;
  overflow: hidden;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const FAQQuestion = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text || "#1f2937"};

  &:hover {
    background: ${({ theme }) => theme.colors.backgroundLight || "#f9fafb"};
  }

  svg {
    flex-shrink: 0;
    margin-left: 1rem;
    color: ${({ theme }) => theme.colors.textMuted || "#6b7280"};
  }
`;

const FAQAnswer = styled.div`
  padding: 0 1.25rem ${({ $isOpen }) => ($isOpen ? "1.25rem" : "0")};
  max-height: ${({ $isOpen }) => ($isOpen ? "1000px" : "0")};
  overflow: hidden;
  transition: all 0.3s ease;
  color: ${({ theme }) => theme.colors.textMuted || "#6b7280"};
  line-height: 1.6;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.colors.textMuted || "#6b7280"};
`;

const faqData = {
  booking: [
    {
      question: "How do I book a car?",
      answer: "Browse our fleet, select a car, choose your dates and pickup location, fill in your details, and complete the payment. You'll receive a confirmation email with all the details.",
    },
    {
      question: "Can I modify or cancel my booking?",
      answer: "Yes, you can modify or cancel your booking from the 'My Bookings' page. Cancellation policies vary based on how close to the pickup date you cancel. Check your booking confirmation for specific terms.",
    },
    {
      question: "What documents do I need to rent a car?",
      answer: "You'll need a valid driver's license, a credit card for the security deposit, and proof of insurance if you're not using our insurance coverage.",
    },
    {
      question: "Can I add additional drivers?",
      answer: "Yes, you can add additional drivers during the booking process. Each driver must meet our age and license requirements and will need to provide their driver's license information.",
    },
    {
      question: "What is the minimum age to rent a car?",
      answer: "The minimum age to rent a car is 21 years old. Drivers under 25 may be subject to additional fees.",
    },
  ],
  payment: [
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express) and debit cards. Payment is processed securely through Stripe.",
    },
    {
      question: "When is payment charged?",
      answer: "Payment is charged when you complete your booking. A security deposit hold may be placed on your card, which will be released after the rental period ends.",
    },
    {
      question: "Do you offer refunds?",
      answer: "Refunds are available according to our cancellation policy. Full refunds are available for cancellations made more than 48 hours before pickup. Partial refunds may apply for cancellations made within 48 hours.",
    },
    {
      question: "Can I use a discount code?",
      answer: "Yes, you can apply discount codes during checkout. Enter your code in the promo code field and click 'Apply' to see the discount applied to your total.",
    },
    {
      question: "What is the security deposit?",
      answer: "A security deposit is a temporary hold on your card to cover any potential damages or additional charges. The amount varies by vehicle type and will be released after the rental period ends, provided there are no issues.",
    },
  ],
  account: [
    {
      question: "How do I create an account?",
      answer: "Click 'Sign Up' on the homepage, enter your phone number or email, verify with the OTP code sent to you, and complete your profile information.",
    },
    {
      question: "I forgot my password. How do I reset it?",
      answer: "Click 'Forgot Password' on the login page, enter your email address, and follow the instructions in the reset email we send you.",
    },
    {
      question: "How do I update my profile information?",
      answer: "Go to your Profile page and click 'Edit Profile'. You can update your personal information, contact details, and profile picture.",
    },
    {
      question: "How do I change my notification preferences?",
      answer: "Go to Settings from your profile menu. You can toggle email notifications, SMS notifications, booking reminders, and marketing communications.",
    },
    {
      question: "Can I delete my account?",
      answer: "Yes, you can delete your account from the Settings page. This action is permanent and will delete all your data, including booking history.",
    },
  ],
};

const FAQPage = () => {
  usePageTitle("FAQ - BenzFlex", "Frequently asked questions about car rentals and bookings");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openItems, setOpenItems] = useState({});

  const categories = [
    { id: "all", label: "All" },
    { id: "booking", label: "Booking" },
    { id: "payment", label: "Payment" },
    { id: "account", label: "Account" },
  ];

  const filteredFAQs = useMemo(() => {
    let faqs = [];

    if (activeCategory === "all") {
      Object.values(faqData).forEach((categoryFAQs) => {
        faqs = [...faqs, ...categoryFAQs];
      });
    } else {
      faqs = faqData[activeCategory] || [];
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      faqs = faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query)
      );
    }

    return faqs;
  }, [searchQuery, activeCategory]);

  const toggleItem = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <FAQContainer>
      <FAQHeader>
        <FiHelpCircle size={48} style={{ marginBottom: "1rem", color: "#3b82f6" }} />
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about booking, payments, and your account</p>
      </FAQHeader>

      <SearchContainer>
        <FiSearch size={20} />
        <input
          type="text"
          placeholder="Search FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search FAQs"
        />
      </SearchContainer>

      <CategoryTabs>
        {categories.map((category) => (
          <CategoryTab
            key={category.id}
            $active={activeCategory === category.id}
            onClick={() => setActiveCategory(category.id)}
            aria-label={`Filter by ${category.label}`}
          >
            {category.label}
          </CategoryTab>
        ))}
      </CategoryTabs>

      {activeCategory === "all" ? (
        Object.entries(faqData).map(([category, faqs]) => {
          const filtered = searchQuery
            ? faqs.filter(
                (faq) =>
                  faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
              )
            : faqs;

          if (filtered.length === 0) return null;

          return (
            <FAQSection key={category}>
              <SectionTitle>
                <FiHelpCircle />
                {categories.find((c) => c.id === category)?.label || category}
              </SectionTitle>
              {filtered.map((faq, index) => {
                const itemKey = `${category}-${index}`;
                const isOpen = openItems[itemKey];

                return (
                  <FAQItem key={itemKey}>
                    <FAQQuestion onClick={() => toggleItem(itemKey)} aria-expanded={isOpen}>
                      {faq.question}
                      {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                    </FAQQuestion>
                    <FAQAnswer $isOpen={isOpen}>{faq.answer}</FAQAnswer>
                  </FAQItem>
                );
              })}
            </FAQSection>
          );
        })
      ) : (
        <FAQSection>
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, index) => {
              const itemKey = `${activeCategory}-${index}`;
              const isOpen = openItems[itemKey];

              return (
                <FAQItem key={itemKey}>
                  <FAQQuestion onClick={() => toggleItem(itemKey)} aria-expanded={isOpen}>
                    {faq.question}
                    {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                  </FAQQuestion>
                  <FAQAnswer $isOpen={isOpen}>{faq.answer}</FAQAnswer>
                </FAQItem>
              );
            })
          ) : (
            <EmptyState>
              <FiHelpCircle size={48} style={{ marginBottom: "1rem", opacity: 0.5 }} />
              <p>No FAQs found matching your search.</p>
            </EmptyState>
          )}
        </FAQSection>
      )}
    </FAQContainer>
  );
};

export default FAQPage;

