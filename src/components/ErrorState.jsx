/* eslint-disable react/prop-types */
// components/ui/ErrorState.jsx
import React from 'react';
import styled from 'styled-components';
import { FiXCircle, } from 'react-icons/fi';
import { PrimaryButton, SecondaryButton, GhostButton } from './ui/Button';

const ErrorState = ({ 
  icon = FiXCircle,
  title = "Something went wrong",
  message,
  actions = [],
  size = "lg",
  centered = true,
  className 
}) => {
  const IconComponent = icon;
  
  return (
    <ErrorContainer $centered={centered} className={className}>
      <ErrorIcon>
        <IconComponent />
      </ErrorIcon>
      <ErrorTitle>{title}</ErrorTitle>
      <ErrorMessage>{message}</ErrorMessage>
      
      {actions.length > 0 && (
        <ActionButtons>
          {actions.map((action, index) => {
            const ActionIcon = action.icon;
            let ButtonComponent;
            
            switch (action.variant) {
              case 'primary':
                ButtonComponent = PrimaryButton;
                break;
              case 'secondary':
                ButtonComponent = SecondaryButton;
                break;
              case 'ghost':
              default:
                ButtonComponent = GhostButton;
                break;
            }
            
            return (
              <ButtonComponent
                key={index}
                onClick={action.onClick}
                $size={size}
                disabled={action.disabled}
              >
                {action.icon && <ActionIcon />}
                {action.text}
              </ButtonComponent>
            );
          })}
        </ActionButtons>
      )}
    </ErrorContainer>
  );
};

// Styled components
const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$centered ? 'center' : 'flex-start'};
  justify-content: ${props => props.$centered ? 'center' : 'flex-start'};
  text-align: ${props => props.$centered ? 'center' : 'left'};
  gap: var(--space-xl);
  padding: var(--space-2xl);
  min-height: ${props => props.$centered ? '60vh' : 'auto'};
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  color: var(--error);
  opacity: 0.8;
`;

const ErrorTitle = styled.h2`
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--error);
  margin: 0;
  font-family: var(--font-heading);
`;

const ErrorMessage = styled.p`
  font-size: var(--text-lg);
  color: var(--text-secondary);
  margin: 0;
  max-width: 500px;
  line-height: 1.6;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`;

export default ErrorState;