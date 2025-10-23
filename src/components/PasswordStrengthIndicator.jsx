/* eslint-disable react/prop-types */
// src/components/ui/PasswordStrengthIndicator.jsx
import React from 'react';
import styled from 'styled-components';

const PasswordStrengthIndicator = ({ password }) => {
  if (!password) return null;

  const hasMinLength = password.length >= 6;
  const hasCapitalLetter = /(?=.*[A-Z])/.test(password);

  const getStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (hasMinLength) strength += 1;
    if (hasCapitalLetter) strength += 1;
    return strength;
  };

  const strength = getStrength();
  const strengthText =
    strength === 0
      ? "Very Weak"
      : strength === 1
      ? "Weak"
      : strength === 2
      ? "Good"
      : "Strong";

  const strengthColor =
    strength === 0
      ? "var(--error)"
      : strength === 1
      ? "var(--warning)"
      : strength === 2
      ? "var(--success)"
      : "var(--success)";

  return (
    <StrengthIndicator>
      <StrengthBar>
        <StrengthFill $strength={strength} $color={strengthColor} />
      </StrengthBar>
      <StrengthText $color={strengthColor}>
        Password Strength: {strengthText}
        {!hasMinLength && " • Min 6 characters"}
        {!hasCapitalLetter && " • Capital letter"}
      </StrengthText>
    </StrengthIndicator>
  );
};

const StrengthIndicator = styled.div`
  margin-top: var(--space-sm);
`;

const StrengthBar = styled.div`
  height: 4px;
  background: var(--gray-200);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--space-xs);
`;

const StrengthFill = styled.div`
  height: 100%;
  width: ${(props) => {
    switch (props.$strength) {
      case 0:
        return "25%";
      case 1:
        return "50%";
      case 2:
        return "100%";
      default:
        return "0%";
    }
  }};
  background: ${(props) => props.$color};
  border-radius: var(--radius-full);
  transition: all var(--transition-normal);
`;

const StrengthText = styled.div`
  font-size: var(--text-xs);
  color: ${(props) => props.$color};
  font-weight: var(--font-medium);
`;

export default PasswordStrengthIndicator;