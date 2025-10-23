/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import styled, {css, keyframes} from "styled-components";

 const StatusBadgeComponent = ({ booking, getStatusConfig }) => {
  const statusConfig = getStatusConfig(booking.status);
  const StatusIconComponent = statusConfig.icon;

  return (
    <StatusBadge
      color={statusConfig.color}
      bgColor={statusConfig.bgColor}
      $isAnimated={statusConfig.animated}
    >
      <StatusIconComponent />
      {statusConfig.animated ? (
        <>
          {statusConfig.label}
          <AnimatedDots>
            <span></span>
            <span></span>
            <span></span>
          </AnimatedDots>
        </>
      ) : booking.status === "completed" ? (
        // Special case for completed status
        <TripCompletedContent>
          <strong>Trip Completed</strong>
          <small>Thank you for doing business with us!</small>
        </TripCompletedContent>
      ) : (
        
        statusConfig.label
      )}
    </StatusBadge>
  );
};

export default StatusBadgeComponent;

const dotPulse = keyframes`
  0%, 20% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
  80%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
`;

const AnimatedDots = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin-left: 2px;
  
  span {
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: currentColor;
    animation: ${dotPulse} 1.4s ease-in-out infinite both;
    
    &:nth-child(1) {
      animation-delay: -0.32s;
    }
    
    &:nth-child(2) {
      animation-delay: -0.16s;
    }
    
    &:nth-child(3) {
      animation-delay: 0s;
    }
  }
`;

// Updated StatusBadge component with animation support
const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.color || 'var(--text-primary)'};
  background: ${props => props.bgColor || 'var(--gray-200)'};
  transition: all 0.3s ease;
  
  ${props => props.$isAnimated && css`
    animation: pulse 2s infinite;
    
    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 ${props.bgColor}80;
      }
      70% {
        box-shadow: 0 0 0 6px ${props.bgColor}00;
      }
      100% {
        box-shadow: 0 0 0 0 ${props.bgColor}00;
      }
    }
  `}
`;
const TripCompletedContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  
  strong {
    font-size: var(--text-sm);
  }
  
  small {
    font-size: var(--text-xs);
    opacity: 0.8;
  }
`;
