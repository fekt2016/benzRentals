// src/components/ui/Typography.jsx
import styled from "styled-components";

export const Heading = styled.h1`
  font-family: ${({ theme }) => theme.typography.fonts.heading};
  font-weight: ${({ theme, weight = "semibold" }) =>
    theme.typography.fontWeights["Cormorant Garamond"][weight]};
  font-size: ${({ size = "3xl" }) => `var(--text-${size})`};
  color: ${({ theme, color = "secondary" }) => theme.colors[color]};
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  ${({ centered }) => centered && `text-align: center;`}
  ${({ gradient }) =>
    gradient &&
    `
    background: ${({ theme }) => theme.gradients.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  `}
`;

export const Text = styled.p`
  font-family: ${({ theme }) => theme.typography.fonts.body};
  font-weight: ${({ theme, weight = "normal" }) =>
    theme.typography.fontWeights["Plus Jakarta Sans"][weight]};
  font-size: ${({ size = "base" }) => `var(--text-${size})`};
  color: ${({ theme, color = "text.secondary" }) => {
    const colorPath = color.split(".");
    return colorPath.reduce((obj, key) => obj[key], theme.colors);
  }};
  line-height: ${({ theme, lineHeight = "relaxed" }) =>
    theme.typography.lineHeights[lineHeight]};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  ${({ centered }) => centered && `text-align: center;`}
`;

export const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-bottom: ${({ theme }) => theme.spacing.xl};
  }
`;

export const SectionTitle = styled(Heading).attrs({ as: "h2" })`
  font-size: ${({ theme }) => theme.typography.sizes["4xl"]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const SectionSubtitle = styled(Text)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) =>
    theme.typography.fontWeights["Plus Jakarta Sans"].semibold};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;
