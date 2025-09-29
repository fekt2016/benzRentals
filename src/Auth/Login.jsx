// src/pages/LoginPage.jsx
import React, { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import OtpModal from "../components/Modal/OtpModal";
import { PrimaryButton } from "../components/Button";
import { useSendOtp, useRegister } from "../hooks/useAuth";

// Enhanced Animations
const gradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const bounceIn = keyframes`
  0% { 
    opacity: 0;
    transform: scale(0.3) translateY(100px);
  }
  50% { 
    opacity: 0.9;
    transform: scale(1.05) translateY(-10px);
  }
  80% { 
    opacity: 1;
    transform: scale(0.95) translateY(5px);
  }
  100% { 
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

const slideInRight = keyframes`
  0% {
    opacity: 0;
    transform: translateX(100px) rotateY(90deg);
  }
  100% {
    opacity: 1;
    transform: translateX(0) rotateY(0deg);
  }
`;

const slideInLeft = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-100px) rotateY(-90deg);
  }
  100% {
    opacity: 1;
    transform: translateX(0) rotateY(0deg);
  }
`;

const typewriter = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

// const blink = keyframes`
//   0%, 100% { opacity: 1; }
//   50% { opacity: 0; }
// `;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.7); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(79, 70, 229, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(79, 70, 229, 0); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(79, 70, 229, 0.5); }
  50% { box-shadow: 0 0 20px rgba(79, 70, 229, 0.8); }
`;

const ripple = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
`;

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [fullName, setFullName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [isOtpOpen, setOtpOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeInput, setActiveInput] = useState(null);

  const sendOtp = useSendOtp();
  const register = useRegister();

  // Trigger animation when mode changes
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 800);
    return () => clearTimeout(timer);
  }, [isRegistering]);

  // Auto-focus first input on mode change
  useEffect(() => {
    if (isRegistering) {
      const firstInput = document.getElementById("fullName");
      if (firstInput) firstInput.focus();
    }
  }, [isRegistering]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (isRegistering) {
      if (password !== passwordConfirm) {
        setError("Passwords do not match");
        setIsLoading(false);
        // Add shake animation to error
        document.querySelector("form").style.animation = `${shake} 0.5s ease`;
        setTimeout(() => {
          document.querySelector("form").style.animation = "";
        }, 500);
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        setIsLoading(false);
        return;
      }

      const payload = { fullName, phone, email, password, passwordConfirm };
      register.mutate(payload, {
        onSuccess: (data) => {
          console.log("Registered", data);
          setOtpOpen(true);
          setIsLoading(false);
        },
        onError: (err) => {
          setError(err.message || "Registration failed");
          setIsLoading(false);
        },
      });
    } else {
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        setIsLoading(false);
        return;
      }

      const payload = { phone, password };
      sendOtp.mutate(payload, {
        onSuccess: (data) => {
          console.log("OTP sent", data);
          setOtpOpen(true);
          setIsLoading(false);
        },
        onError: (err) => {
          setError(err.message || "Login failed");
          setIsLoading(false);
        },
      });
    }
  };

  const toggleMode = () => {
    setIsRegistering((prev) => !prev);
    setError("");
    setPhone("");
    setEmail("");
    setPassword("");
    setPasswordConfirm("");
    setFullName("");
  };

  const handleInputFocus = (inputName) => {
    setActiveInput(inputName);
  };

  const handleInputBlur = () => {
    setActiveInput(null);
  };

  return (
    <PageWrapper>
      {/* Animated Background Elements */}
      <BackgroundDecoration>
        <FloatingShape
          type="circle"
          size="80px"
          top="10%"
          left="5%"
          delay="0s"
          color="#ff6b6b"
        />
        <FloatingShape
          type="triangle"
          size="120px"
          top="60%"
          left="10%"
          delay="2s"
          color="#4ecdc4"
        />
        <FloatingShape
          type="square"
          size="60px"
          top="30%"
          right="8%"
          delay="1s"
          color="#45b7d1"
        />
        <FloatingShape
          type="circle"
          size="100px"
          bottom="15%"
          right="15%"
          delay="3s"
          color="#96ceb4"
        />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <Particle key={i} index={i} />
        ))}
      </BackgroundDecoration>

      <Container>
        <LeftSection>
          <HeroContent>
            <AnimatedTitle>
              <TypewriterText>Drive Your </TypewriterText>
              <GradientText delay="1.5s">Dream Car</GradientText>
              <TypewriterText delay="3s"> Today</TypewriterText>
            </AnimatedTitle>

            <HeroSubtitle>
              <AnimatedSubtitle>
                Join thousands of satisfied customers who trust us for their car
                rental needs. Experience luxury, reliability, and exceptional
                service.
              </AnimatedSubtitle>
            </HeroSubtitle>

            <FeaturesList>
              <Feature delay="0.2s">🚗 1000+ Luxury Vehicles</Feature>
              <Feature delay="0.4s">⭐ 4.8/5 Customer Rating</Feature>
              <Feature delay="0.6s">🔐 Secure & Insured</Feature>
              <Feature delay="0.8s">📱 Easy Booking Process</Feature>
            </FeaturesList>

            <CarAnimation>
              <CarIcon>🚗</CarIcon>
              <RoadLine />
            </CarAnimation>
          </HeroContent>
        </LeftSection>

        <RightSection>
          <FormCard
            $isAnimating={isAnimating}
            $mode={isRegistering ? "register" : "login"}
          >
            <FormHeader>
              <AnimatedIcon $mode={isRegistering ? "register" : "login"}>
                {isRegistering ? "👋" : "🔑"}
              </AnimatedIcon>
              <FormTitle $isAnimating={isAnimating}>
                {isRegistering ? "Create Account" : "Welcome Back"}
              </FormTitle>
              <FormSubtitle $isAnimating={isAnimating}>
                {isRegistering
                  ? "Join our community today"
                  : "Sign in to your account"}
              </FormSubtitle>
            </FormHeader>

            {error && (
              <ErrorMessage $show={!!error}>
                <ErrorIcon>⚠️</ErrorIcon>
                {error}
              </ErrorMessage>
            )}

            <Form onSubmit={handleSubmit} $isAnimating={isAnimating}>
              {isRegistering && (
                <>
                  <InputGroup>
                    <AnimatedInput
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onFocus={() => handleInputFocus("fullName")}
                      onBlur={handleInputBlur}
                      placeholder="Full Name"
                      required
                      $active={activeInput === "fullName"}
                      delay="0.1s"
                    />
                    <InputIcon>👤</InputIcon>
                  </InputGroup>

                  <InputGroup>
                    <AnimatedInput
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => handleInputFocus("email")}
                      onBlur={handleInputBlur}
                      placeholder="Email Address"
                      required
                      $active={activeInput === "email"}
                      delay="0.2s"
                    />
                    <InputIcon>📧</InputIcon>
                  </InputGroup>
                </>
              )}

              <InputGroup>
                <AnimatedInput
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onFocus={() => handleInputFocus("phone")}
                  onBlur={handleInputBlur}
                  placeholder="Phone Number"
                  required
                  $active={activeInput === "phone"}
                  delay={isRegistering ? "0.3s" : "0.1s"}
                />
                <InputIcon>📱</InputIcon>
              </InputGroup>

              <InputGroup>
                <AnimatedInput
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => handleInputFocus("password")}
                  onBlur={handleInputBlur}
                  placeholder={
                    isRegistering ? "Create Password" : "Enter Password"
                  }
                  required
                  $active={activeInput === "password"}
                  delay={isRegistering ? "0.4s" : "0.2s"}
                />
                <InputIcon>🔒</InputIcon>
              </InputGroup>

              {isRegistering && (
                <InputGroup>
                  <AnimatedInput
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    onFocus={() => handleInputFocus("passwordConfirm")}
                    onBlur={handleInputBlur}
                    placeholder="Confirm Password"
                    required
                    $active={activeInput === "passwordConfirm"}
                    delay="0.5s"
                  />
                  <InputIcon>✅</InputIcon>
                </InputGroup>
              )}

              <SubmitButton
                type="submit"
                disabled={isLoading}
                isLoading={isLoading}
                $pulse={!isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    <RippleContainer>
                      <Ripple />
                      <Ripple delay="0.3s" />
                      <Ripple delay="0.6s" />
                    </RippleContainer>
                    {isRegistering ? "Creating Account..." : "Signing In..."}
                  </>
                ) : (
                  <>{isRegistering ? "🚀 Create Account" : "🔑 Sign In"}</>
                )}
              </SubmitButton>
            </Form>

            <ToggleSection $isAnimating={isAnimating}>
              <ToggleText>
                {isRegistering
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </ToggleText>
              <ToggleButton onClick={toggleMode} type="button" $glow>
                {isRegistering ? "Sign In" : "Sign Up"}
              </ToggleButton>
            </ToggleSection>

            <PrivacyNote>
              By continuing, you agree to our Terms of Service and Privacy
              Policy
            </PrivacyNote>
          </FormCard>
        </RightSection>
      </Container>

      <OtpModal
        isOpen={isOtpOpen}
        onClose={() => setOtpOpen(false)}
        phone={phone}
      />
    </PageWrapper>
  );
};

export default LoginPage;

// Enhanced Styled Components with Animations
const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: ${gradient} 15s ease infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
  overflow: hidden;
`;

const BackgroundDecoration = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const FloatingShape = styled.div`
  position: absolute;
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  background: ${(props) => props.color}20;
  border: 2px solid ${(props) => props.color};
  border-radius: ${(props) =>
    props.type === "circle"
      ? "50%"
      : props.type === "triangle"
      ? "50% 50% 0 50%"
      : "20%"};
  animation: ${float} 6s ease-in-out infinite;
  animation-delay: ${(props) => props.delay};
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  right: ${(props) => props.right};
  bottom: ${(props) => props.bottom};
  filter: blur(${(props) => (props.type === "circle" ? "0px" : "1px")});
`;

const Particle = styled.div`
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  top: ${() => Math.random() * 100}%;
  left: ${() => Math.random() * 100}%;
  animation: ${float} ${() => 3 + Math.random() * 4}s ease-in-out infinite;
  animation-delay: ${() => Math.random() * 5}s;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1200px;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(20px);
  animation: ${bounceIn} 1s ease-out;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    max-width: 450px;
  }
`;

const LeftSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 4rem 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
  overflow: hidden;

  @media (max-width: 968px) {
    padding: 3rem 2rem;
    display: none;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
`;

const AnimatedTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  overflow: hidden;
`;

const TypewriterText = styled.span`
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  animation: ${typewriter} 2s steps(40, end) ${(props) => props.delay || "0s"}
    both;
`;

const GradientText = styled.span`
  background: linear-gradient(45deg, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
  animation: ${pulse} 2s infinite ${(props) => props.delay || "0s"};
`;

const HeroSubtitle = styled.div`
  margin-bottom: 2rem;
`;

const AnimatedSubtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0;
  line-height: 1.6;
  animation: ${slideInLeft} 1s ease-out 2s forwards;
`;

const FeaturesList = styled.div`
  display: grid;
  gap: 1rem;
  text-align: left;
  margin-bottom: 2rem;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  opacity: 0;
  transform: translateX(-50px);
  animation: ${slideInLeft} 0.6s ease-out ${(props) => props.delay} forwards;
`;

const CarAnimation = styled.div`
  position: relative;
  margin-top: 2rem;
`;

const CarIcon = styled.div`
  font-size: 3rem;
  animation: ${float} 3s ease-in-out infinite;
`;

const RoadLine = styled.div`
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.5);
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    width: 50px;
    height: 2px;
    background: white;
    animation: ${typewriter} 2s linear infinite;
  }
`;

const RightSection = styled.div`
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 400px;
  animation: ${(props) =>
    props.$isAnimating
      ? css`
          ${slideInRight} 0.8s ease-out
        `
      : "none"};
  transform-style: preserve-3d;
  perspective: 1000px;
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const AnimatedIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: ${bounceIn} 0.8s ease-out,
    ${(props) =>
      props.$mode === "register"
        ? css`
            ${pulse} 2s infinite 1s
          `
        : "none"};
`;

const FormTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
  animation: ${(props) =>
    props.$isAnimating
      ? css`
          ${bounceIn} 0.6s ease-out
        `
      : "none"};
`;

const FormSubtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
  animation: ${(props) =>
    props.$isAnimating
      ? css`
          ${slideInRight} 0.8s ease-out
        `
      : "none"};
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  animation: ${(props) =>
    props.$show
      ? css`
          ${bounceIn} 0.5s ease-out, ${shake} 0.5s ease-out
        `
      : "none"};
`;

const ErrorIcon = styled.span`
  font-size: 1.2rem;
  animation: ${pulse} 1s infinite;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  animation: ${(props) =>
    props.$isAnimating
      ? css`
          ${bounceIn} 0.6s ease-out
        `
      : "none"};
`;

const InputGroup = styled.div`
  position: relative;
`;

const AnimatedInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid ${(props) => (props.$active ? "#4f46e5" : "#e5e7eb")};
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  color: #1f2937;
  animation: ${slideInRight} 0.6s ease-out ${(props) => props.delay} both;
  transform-origin: left;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);

    + span {
      color: #4f46e5;
      transform: scale(1.2);
    }
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const InputIcon = styled.span`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: #6b7280;
  transition: all 0.3s ease;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  background: ${(props) =>
    props.isLoading
      ? "#9ca3af"
      : "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: ${(props) => (props.isLoading ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
  position: relative;
  overflow: hidden;
  animation: ${(props) =>
    props.$pulse
      ? css`
          ${pulse} 2s infinite
        `
      : "none"};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(79, 70, 229, 0.4);
  }

  &:disabled {
    opacity: 0.7;
  }
`;

const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const RippleContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Ripple = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ${ripple} 1.5s linear infinite;
  animation-delay: ${(props) => props.delay || "0s"};
`;

const ToggleSection = styled.div`
  text-align: center;
  margin: 2rem 0 1rem;
  padding: 1.5rem 0;
  border-top: 1px solid #e5e7eb;
  animation: ${(props) =>
    props.$isAnimating
      ? css`
          ${slideInRight} 0.8s ease-out
        `
      : "none"};
`;

const ToggleText = styled.span`
  color: #6b7280;
  font-size: 0.95rem;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #4f46e5;
  font-weight: 600;
  cursor: pointer;
  margin-left: 0.5rem;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  animation: ${(props) =>
    props.$glow
      ? css`
          ${glow} 2s infinite
        `
      : "none"};

  &:hover {
    color: #3730a3;
    transform: scale(1.1);
  }
`;
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const PrivacyNote = styled.p`
  text-align: center;
  font-size: 0.8rem;
  color: #9ca3af;
  margin-top: 1rem;
  line-height: 1.4;
  animation: ${fadeIn} 1s ease-out 3s both;
`;
