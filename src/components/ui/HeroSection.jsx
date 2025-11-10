/* eslint-disable react/prop-types */
// src/components/sections/HeroSection.jsx
import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { ButtonLink, SecondaryButton } from "../ui/Button";
import { devices } from "../../styles/GlobalStyles";

const HeroSection = ({
  backgroundVideo = "/videos/benzflex.mp4", // Default video path
  badge,
  title,
  description,
  primaryButton,
  secondaryButton,
  scrollText = "Scroll to Explore",
  onBackgroundError,
  className = "",
  height = "90vh",
  minHeight = "600px",
}) => {
  const videoRef = useRef(null);

  // Ensure video plays and loops properly
  useEffect(() => {
    const video = videoRef.current;
    let playVideoHandler = null;
    
    if (video) {
      video.play().catch(error => {
        console.log("Video autoplay failed:", error);
        // Fallback: try playing with user interaction
        playVideoHandler = () => {
          video.play();
          document.removeEventListener('click', playVideoHandler);
          playVideoHandler = null;
        };
        document.addEventListener('click', playVideoHandler);
      });
    }
    
    // Cleanup function
    return () => {
      if (playVideoHandler) {
        document.removeEventListener('click', playVideoHandler);
      }
    };
  }, []);

  return (
    <HeroWrapper className={className} $height={height} $minHeight={minHeight}>
      <HeroBackground>
        <BackgroundVideo
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          onError={onBackgroundError}
        >
          <source src={backgroundVideo} type="video/mp4" />
          {/* Fallback image in case video doesn't load */}
          <FallbackImage 
            src="/images/hero-fallback.jpg" 
            alt="Hero Background Fallback"
          />
        </BackgroundVideo>
        <Overlay />
      </HeroBackground>

      <HeroContent>
        <motion.div initial="hidden" animate="visible" variants={heroVariants}>
          {badge && (
            <motion.div variants={heroItemVariants}>
              <HeroBadge>{badge}</HeroBadge>
            </motion.div>
          )}

          <motion.h1 variants={heroItemVariants}>{title}</motion.h1>

          <motion.p variants={heroItemVariants}>{description}</motion.p>

          {(primaryButton || secondaryButton) && (
            <motion.div variants={heroItemVariants}>
              <HeroButtons>
                {primaryButton && (
                  <ButtonLink to={primaryButton.to} $size="lg">
                    {primaryButton.text}
                    {primaryButton.icon && <primaryButton.icon />}
                  </ButtonLink>
                )}
                {secondaryButton && (
                  <SecondaryButton
                    as={secondaryButton.to ? "a" : "button"}
                    $size="lg"
                    onClick={secondaryButton.onClick}
                    href={secondaryButton.to}
                  >
                    {secondaryButton.text}
                    {secondaryButton.icon && <secondaryButton.icon />}
                  </SecondaryButton>
                )}
              </HeroButtons>
            </motion.div>
          )}
        </motion.div>
      </HeroContent>

      {scrollText && (
        <ScrollIndicator>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {scrollText}
          </motion.div>
        </ScrollIndicator>
      )}
    </HeroWrapper>
  );
};

const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.8,
    },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const HeroWrapper = styled.section`
  height: ${(props) => props.$height};
  min-height: ${(props) => props.$minHeight};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  @media ${devices.md} {
    height: 80vh;
    min-height: 500px;
  }

  @media ${devices.sm} {
    height: 70vh;
    min-height: 400px;
  }
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const BackgroundVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  
  /* Ensure video covers the entire container */
  min-width: 100%;
  min-height: 100%;
  
  /* Improve performance */
  transform: translateX(-50%) translateY(-50%);
  position: absolute;
  top: 50%;
  left: 50%;
`;

const FallbackImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  position: absolute;
  top: 0;
  left: 0;
  
  /* Only show if video fails to load */
  display: none;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--gradient-overlay);
  z-index: 2;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 3; /* Higher than overlay */
  text-align: center;
  color: var(--white);
  max-width: 800px;
  padding: 0 var(--space-lg);

  h1 {
    font-size: var(--text-6xl);
    font-weight: var(--font-semibold);
    margin-bottom: var(--space-md);
    line-height: 1.1;
    font-family: var(--font-heading);

    @media ${devices.md} {
      font-size: var(--text-5xl);
    }

    @media ${devices.sm} {
      font-size: var(--text-4xl);
    }
  }

  p {
    font-size: var(--text-xl);
    margin-bottom: var(--space-2xl);
    opacity: 0.9;
    line-height: 1.6;
    font-family: var(--font-body);

    @media ${devices.md} {
      font-size: var(--text-lg);
    }

    @media ${devices.sm} {
      font-size: var(--text-base);
    }
  }
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-full);
  margin-bottom: var(--space-xl);
  font-weight: var(--font-semibold);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: var(--text-sm);
  font-family: var(--font-body);

  @media ${devices.sm} {
    padding: var(--space-xs) var(--space-md);
    font-size: var(--text-xs);
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  flex-wrap: wrap;

  @media ${devices.sm} {
    flex-direction: column;
    align-items: center;
  }
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: var(--space-lg);
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  color: var(--white);
  opacity: 0.7;
  font-size: var(--text-sm);
  font-family: var(--font-body);

  @media ${devices.md} {
    bottom: var(--space-md);
  }
`;

export default HeroSection;