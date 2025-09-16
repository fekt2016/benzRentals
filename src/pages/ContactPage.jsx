// pages/ContactPage.js
import React, { useState } from "react";
import styled from "styled-components";

const ContactContainer = styled.div`
  padding: 2rem 0;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ContactForm = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  input,
  textarea,
  select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 0.375rem;
    font-family: inherit;
  }

  textarea {
    min-height: 150px;
    resize: vertical;
  }
`;

const ContactInfo = styled.div`
  background: #f8fafc;
  border-radius: 0.5rem;
  padding: 2rem;

  h3 {
    margin-bottom: 1rem;
    color: ${(props) => props.theme.colors.primary};
  }

  p {
    margin-bottom: 0.5rem;
  }
`;

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit the form data
    alert("Thank you for your message! We will get back to you soon.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <ContactContainer className="container">
      <div className="section">
        <h1 className="section-title">Contact Us</h1>
        <p style={{ textAlign: "center", marginBottom: "2rem" }}>
          Have questions? We're here to help. Reach out to us through any of the
          channels below.
        </p>

        <ContactGrid>
          <ContactForm>
            <h2>Send us a Message</h2>
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <label>Subject</label>
                <select
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
                  <option value="other">Other</option>
                </select>
              </FormGroup>

              <FormGroup>
                <label>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <button type="submit" className="btn btn-primary">
                Send Message
              </button>
            </form>
          </ContactForm>

          <div>
            <ContactInfo>
              <h3>Contact Information</h3>
              <p>
                <strong>Phone:</strong> 1-800-DRIVE-RENT
              </p>
              <p>
                <strong>Email:</strong> info@driverent.com
              </p>
              <p>
                <strong>Address:</strong> 123 Rental Ave, Car City, CC 12345
              </p>
            </ContactInfo>

            <ContactInfo style={{ marginTop: "2rem" }}>
              <h3>Customer Support Hours</h3>
              <p>
                <strong>Monday-Friday:</strong> 8:00 AM - 10:00 PM EST
              </p>
              <p>
                <strong>Saturday-Sunday:</strong> 9:00 AM - 8:00 PM EST
              </p>
            </ContactInfo>

            <ContactInfo style={{ marginTop: "2rem" }}>
              <h3>Emergency Roadside Assistance</h3>
              <p>
                <strong>Phone:</strong> 1-800-HELP-NOW
              </p>
              <p>Available 24/7 for all rental customers</p>
            </ContactInfo>
          </div>
        </ContactGrid>
      </div>
    </ContactContainer>
  );
};

export default ContactPage;
