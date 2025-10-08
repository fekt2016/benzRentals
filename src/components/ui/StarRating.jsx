import { FaStar, FaRegStar } from "react-icons/fa";
import styled from "styled-components";

function StarRating({ rating, onRatingChange, readonly = false }) {
  return (
    <StarsContainer>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarButton
          key={star}
          onClick={() => !readonly && onRatingChange(star)}
          $readonly={readonly}
        >
          {star <= rating ? <FaStar /> : <FaRegStar />}
        </StarButton>
      ))}
    </StarsContainer>
  );
}

export default StarRating;
const StarsContainer = styled.div`
  display: flex;
  gap: var(--space-sm);
  margin: var(--space-sm) 0;
`;
const StarButton = styled.button`
  background: none;
  border: none;
  cursor: ${(props) => (props.$readonly ? "default" : "pointer")};
  color: var(--warning);
  font-size: var(--text-lg);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: ${(props) => (props.$readonly ? "none" : "scale(1.2)")};
  }
`;
