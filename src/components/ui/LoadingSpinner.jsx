// src/components/ui/States.jsx
import styled, { keyframes } from "styled-components";
import { FaExclamationTriangle, FaInfoCircle, FaCar } from "react-icons/fa";

// Animations using global transition variables
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const fadeIn = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

// Loading Spinner Component with global styles
export const LoadingSpinner = styled.div`
  display: inline-block;
  width: ${({ size = "md" }) => {
    switch (size) {
      case "sm":
        return "20px";
      case "lg":
        return "40px";
      case "xl":
        return "60px";
      default:
        return "30px";
    }
  }};
  height: ${({ size = "md" }) => {
    switch (size) {
      case "sm":
        return "20px";
      case "lg":
        return "40px";
      case "xl":
        return "60px";
      default:
        return "30px";
    }
  }};
  border: 2px solid var(--gray-300);
  border-top: 2px solid var(--primary);
  border-radius: 50%;
  animation: ${spin} var(--transition-slow) linear infinite;
`;

// Skeleton Loading Component
export const Skeleton = styled.div`
  background: linear-gradient(
    90deg,
    var(--gray-200) 25%,
    var(--gray-300) 50%,
    var(--gray-200) 75%
  );
  background-size: 200% 100%;
  animation: ${pulse} 2s infinite;
  border-radius: var(--radius-md);

  ${({ width = "100%" }) => `width: ${width};`}
  ${({ height = "1rem" }) => `height: ${height};`}
  ${({ circle }) => circle && "border-radius: 50%;"}
`;

// Empty State Component
export const EmptyState = ({
  icon = <FaCar />,
  title = "No data found",
  message = "There's nothing to display at the moment.",
  action,
  ...props
}) => {
  return (
    <EmptyStateWrapper {...props}>
      <EmptyStateIcon>{icon}</EmptyStateIcon>
      <EmptyStateTitle>{title}</EmptyStateTitle>
      <EmptyStateMessage>{message}</EmptyStateMessage>
      {action && <EmptyStateAction>{action}</EmptyStateAction>}
    </EmptyStateWrapper>
  );
};

const EmptyStateWrapper = styled.div`
  text-align: center;
  padding: var(--space-2xl);
  color: var(--text-muted);
  animation: ${fadeIn} var(--transition-normal) ease-out;
  max-width: 400px;
  margin: 0 auto;
  font-family: var(--font-body);
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: var(--space-lg);
  opacity: 0.5;
  animation: ${float} 3s var(--transition-bounce) infinite;
  color: var(--primary);
`;

const EmptyStateTitle = styled.h3`
  color: var(--text-secondary);
  margin-bottom: var(--space-sm);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  font-family: var(--font-heading);
`;

const EmptyStateMessage = styled.p`
  color: var(--text-muted);
  margin-bottom: var(--space-xl);
  font-size: var(--text-base);
  font-family: var(--font-body);
  line-height: 1.6;
`;

const EmptyStateAction = styled.div`
  margin-top: var(--space-lg);
`;

// Error State Component
export const ErrorState = ({
  icon = <FaExclamationTriangle />,
  title = "Something went wrong",
  message = "We encountered an error while loading the data.",
  action,
  ...props
}) => {
  return (
    <ErrorStateWrapper {...props}>
      <ErrorStateIcon>{icon}</ErrorStateIcon>
      <ErrorStateTitle>{title}</ErrorStateTitle>
      <ErrorStateMessage>{message}</ErrorStateMessage>
      {action && <ErrorStateAction>{action}</ErrorStateAction>}
    </ErrorStateWrapper>
  );
};

const ErrorStateWrapper = styled(EmptyStateWrapper)`
  color: var(--error);
`;

const ErrorStateIcon = styled(EmptyStateIcon)`
  color: var(--error);
`;

const ErrorStateTitle = styled(EmptyStateTitle)`
  color: var(--error);
`;

const ErrorStateMessage = styled(EmptyStateMessage)`
  color: var(--text-secondary);
`;

const ErrorStateAction = styled(EmptyStateAction)``;

// Success State Component
export const SuccessState = ({
  icon = <FaInfoCircle />,
  title = "Success!",
  message = "The operation was completed successfully.",
  action,
  ...props
}) => {
  return (
    <SuccessStateWrapper {...props}>
      <SuccessStateIcon>{icon}</SuccessStateIcon>
      <SuccessStateTitle>{title}</SuccessStateTitle>
      <SuccessStateMessage>{message}</SuccessStateMessage>
      {action && <SuccessStateAction>{action}</SuccessStateAction>}
    </SuccessStateWrapper>
  );
};

const SuccessStateWrapper = styled(EmptyStateWrapper)`
  color: var(--success);
`;

const SuccessStateIcon = styled(EmptyStateIcon)`
  color: var(--success);
`;

const SuccessStateTitle = styled(EmptyStateTitle)`
  color: var(--success);
`;

const SuccessStateMessage = styled(EmptyStateMessage)`
  color: var(--text-secondary);
`;

const SuccessStateAction = styled(EmptyStateAction)``;

// Loading State Component - Perfect for route loading
export const LoadingState = ({
  message = "Loading...",
  size = "lg",
  ...props
}) => {
  return (
    <LoadingStateWrapper {...props}>
      <LoadingSpinner size={size} />
      <LoadingMessage>{message}</LoadingMessage>
    </LoadingStateWrapper>
  );
};

const LoadingStateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-2xl);
  gap: var(--space-lg);
  text-align: center;
  animation: ${fadeIn} var(--transition-normal) ease-out;
  min-height: 200px;
  font-family: var(--font-body);
`;

const LoadingMessage = styled.p`
  color: var(--text-secondary);
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  font-family: var(--font-body);
  margin: 0;
`;

// Skeleton Grid Component
export const SkeletonGrid = ({
  count = 6,
  itemHeight = "200px",
  gap = "var(--space-md)",
  ...props
}) => {
  return (
    <SkeletonGridWrapper $gap={gap} {...props}>
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} height={itemHeight} />
      ))}
    </SkeletonGridWrapper>
  );
};

const SkeletonGridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ $gap }) => $gap};
  width: 100%;
`;

// Skeleton Card Component
export const SkeletonCard = ({ ...props }) => {
  return (
    <SkeletonCardWrapper {...props}>
      <Skeleton height="200px" />
      <SkeletonCardContent>
        <Skeleton width="70%" height="24px" />
        <Skeleton width="50%" height="16px" />
        <Skeleton width="90%" height="14px" />
        <Skeleton width="90%" height="14px" />
        <Skeleton width="60%" height="14px" />
        <Skeleton width="100%" height="40px" />
      </SkeletonCardContent>
    </SkeletonCardWrapper>
  );
};

const SkeletonCardWrapper = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-200);
`;

const SkeletonCardContent = styled.div`
  padding: var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

// Progress Bar Component
export const ProgressBar = ({
  progress = 0,
  color = "var(--primary)",
  height = "8px",
  ...props
}) => {
  return (
    <ProgressBarWrapper $height={height} {...props}>
      <ProgressBarFill $progress={progress} $color={color} />
    </ProgressBarWrapper>
  );
};

const ProgressBarWrapper = styled.div`
  width: 100%;
  height: ${({ $height }) => $height};
  background: var(--gray-200);
  border-radius: var(--radius-full);
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  width: ${({ $progress }) => `${$progress}%`};
  background: ${({ $color }) => $color};
  border-radius: var(--radius-full);
  transition: width var(--transition-normal) ease;
  background: ${({ $color }) =>
    $color === "var(--primary)" ? "var(--gradient-primary)" : $color};
`;

// Export all components
export default {
  LoadingSpinner,
  Skeleton,
  EmptyState,
  ErrorState,
  SuccessState,
  LoadingState,
  SkeletonGrid,
  SkeletonCard,
  ProgressBar,
};
