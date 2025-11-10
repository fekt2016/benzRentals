import React from "react";
import styled, { keyframes } from "styled-components";
import { devices } from "../../styles/GlobalStyles";

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.background || "#f3f4f6"} 0%,
    ${({ theme }) => theme.colors.backgroundLight || "#e5e7eb"} 50%,
    ${({ theme }) => theme.colors.background || "#f3f4f6"} 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: ${({ $radius = "8px" }) => $radius};
`;

// Skeleton Card - for car cards, booking cards
export const SkeletonCard = styled(SkeletonBase)`
  width: 100%;
  height: ${({ $height = "400px" }) => $height};
  border-radius: 12px;
  overflow: hidden;
`;

// Skeleton Image - for car images, avatars
export const SkeletonImage = styled(SkeletonBase)`
  width: ${({ $width = "100%" }) => $width};
  height: ${({ $height = "200px" }) => $height};
  border-radius: ${({ $radius = "8px" }) => $radius};
`;

// Skeleton Text - for titles, descriptions
export const SkeletonText = styled(SkeletonBase)`
  height: ${({ $height = "16px" }) => $height};
  width: ${({ $width = "100%" }) => $width};
  margin-bottom: ${({ $marginBottom = "0.5rem" }) => $marginBottom};
`;

// Skeleton List - for lists of items
export const SkeletonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

// Skeleton List Item
export const SkeletonListItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background || "#ffffff"};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border || "#e5e7eb"};
`;

// Skeleton Avatar
export const SkeletonAvatar = styled(SkeletonBase)`
  width: ${({ $size = "48px" }) => $size};
  height: ${({ $size = "48px" }) => $size};
  border-radius: 50%;
  flex-shrink: 0;
`;

// Skeleton Button
export const SkeletonButton = styled(SkeletonBase)`
  height: 40px;
  width: ${({ $width = "120px" }) => $width};
  border-radius: 6px;
`;

// Pre-built skeleton components for common use cases
export const CarCardSkeleton = () => (
  <SkeletonCard $height="450px">
    <SkeletonImage $height="250px" $radius="12px 12px 0 0" />
    <div style={{ padding: "1rem" }}>
      <SkeletonText $width="80%" $height="24px" $marginBottom="0.75rem" />
      <SkeletonText $width="60%" $height="20px" $marginBottom="0.5rem" />
      <SkeletonText $width="90%" $height="16px" $marginBottom="0.5rem" />
      <SkeletonText $width="70%" $height="16px" $marginBottom="1rem" />
      <SkeletonButton $width="100%" />
    </div>
  </SkeletonCard>
);

export const BookingCardSkeleton = () => (
  <SkeletonCard $height="300px">
    <div style={{ padding: "1rem" }}>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <SkeletonImage $width="120px" $height="80px" />
        <div style={{ flex: 1 }}>
          <SkeletonText $width="70%" $height="20px" $marginBottom="0.5rem" />
          <SkeletonText $width="50%" $height="16px" $marginBottom="0.5rem" />
          <SkeletonText $width="60%" $height="16px" />
        </div>
      </div>
      <SkeletonText $width="100%" $height="16px" $marginBottom="0.5rem" />
      <SkeletonText $width="80%" $height="16px" $marginBottom="1rem" />
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <SkeletonButton $width="100px" />
        <SkeletonButton $width="100px" />
      </div>
    </div>
  </SkeletonCard>
);

export const ListSkeleton = ({ count = 5 }) => (
  <SkeletonList>
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonListItem key={index}>
        <SkeletonAvatar />
        <div style={{ flex: 1 }}>
          <SkeletonText $width="60%" $height="18px" $marginBottom="0.5rem" />
          <SkeletonText $width="80%" $height="14px" $marginBottom="0.25rem" />
          <SkeletonText $width="40%" $height="14px" />
        </div>
      </SkeletonListItem>
    ))}
  </SkeletonList>
);

export const DashboardSkeleton = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonCard key={i} $height="150px" />
      ))}
    </div>
    <SkeletonCard $height="400px" />
  </div>
);

