/* eslint-disable react/prop-types */
// src/components/OtpInput.jsx
import React from "react";
import styled from "styled-components";

const OtpInput = ({ value, onChange, length = 6 }) => {
  const handleChange = (e, i) => {
    const val = e.target.value.replace(/\D/g, "");
    if (!val) return;
    const newOtp = value.split("");
    newOtp[i] = val[val.length - 1];
    onChange(newOtp.join(""));
    if (e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
  };

  return (
    <Wrapper>
      {Array.from({ length }).map((_, i) => (
        <Input
          key={i}
          type="text"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(e, i)}
        />
      ))}
    </Wrapper>
  );
};

export default OtpInput;

// ---- Styled Components ---- //
const Wrapper = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  width: 3rem;
  height: 3.5rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: var(--radius-md);
  background: ${({ theme }) => theme.colors.inputBg};
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primarySoft};
  }
`;
