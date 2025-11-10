import React, { Component } from "react";
import styled from "styled-components";
import { FiAlertCircle, FiRefreshCw, FiHome } from "react-icons/fi";
import { PrimaryButton, SecondaryButton } from "../../components/ui/Button";
import { devices } from "../../styles/GlobalStyles";

// ErrorBoundary component for React error handling

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
  text-align: center;
  animation: fadeIn 0.3s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  color: ${({ theme }) => theme.colors.error || "#ef4444"};
  margin-bottom: 1.5rem;
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
  }
`;

const ErrorTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text || "#1f2937"};
  margin-bottom: 1rem;

  @media ${devices.sm} {
    font-size: 1.5rem;
  }
`;

const ErrorMessage = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.textMuted || "#6b7280"};
  margin-bottom: 2rem;
  max-width: 600px;
  line-height: 1.6;
`;

const ErrorDetails = styled.details`
  margin-top: 2rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background || "#f9fafb"};
  border-radius: 8px;
  max-width: 800px;
  width: 100%;
  text-align: left;

  summary {
    cursor: pointer;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text || "#1f2937"};
    margin-bottom: 0.5rem;
    user-select: none;

    &:hover {
      color: ${({ theme }) => theme.colors.primary || "#3b82f6"};
    }
  }

  pre {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.textMuted || "#6b7280"};
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;

  @media ${devices.sm} {
    flex-direction: column;
    width: 100%;
  }
`;

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    // Log to Sentry if available
    try {
      const { getSentry } = require("../../utils/sentry");
      const Sentry = getSentry();
      if (Sentry && Sentry.captureException) {
        Sentry.captureException(error, {
          contexts: {
            react: {
              componentStack: errorInfo.componentStack,
            },
          },
        });
      }
    } catch (e) {
      // Sentry not available, continue
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo } = this.state;
      const isDevelopment = process.env.NODE_ENV === "development";

      return (
        <ErrorContainer>
          <ErrorIcon>
            <FiAlertCircle />
          </ErrorIcon>
          <ErrorTitle>Something went wrong</ErrorTitle>
          <ErrorMessage>
            We're sorry, but something unexpected happened. Please try refreshing the page or return to the homepage.
          </ErrorMessage>

          <ButtonGroup>
            <PrimaryButton onClick={this.handleReset} aria-label="Try again">
              <FiRefreshCw style={{ marginRight: "0.5rem" }} />
              Try Again
            </PrimaryButton>
            <SecondaryButton onClick={this.handleGoHome} aria-label="Go to homepage">
              <FiHome style={{ marginRight: "0.5rem" }} />
              Go Home
            </SecondaryButton>
          </ButtonGroup>

          {isDevelopment && error && (
            <ErrorDetails>
              <summary>Error Details (Development Only)</summary>
              <pre>{error.toString()}</pre>
              {errorInfo && <pre>{errorInfo.componentStack}</pre>}
            </ErrorDetails>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

