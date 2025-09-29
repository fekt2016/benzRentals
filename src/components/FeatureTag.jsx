import styled from "styled-components";
import { Badge } from "lucide-react";

export const FeatureTag = styled(Badge)`
  background: ${({ theme }) => theme.colors.gray[100]};
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  text-transform: none;
  letter-spacing: normal;
`;
