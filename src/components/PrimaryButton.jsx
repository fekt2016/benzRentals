import styled from "styled-components";

const PrimaryButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: 12px 24px;
  border-radius: ${({ theme }) => theme.radius.medium};
  font-weight: 600;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.button};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;
export default PrimaryButton;
