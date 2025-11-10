/* eslint-disable react/prop-types */
// src/components/ui/Pagination.js
import React from "react";
import styled from "styled-components";
import { FaChevronLeft, FaChevronRight, FaEllipsisH } from "react-icons/fa";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  isLoading = false,
  showInfo = true,
}) => {
  // Calculate display range
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        end = 4;
      }

      if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }

      if (start > 2) {
        pages.push("ellipsis-start");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("ellipsis-end");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (totalPages <= 1) return null;

  return (
    <PaginationContainer>
      {showInfo && (
        <PaginationInfoMobile>
          Showing {startIndex}-{endIndex} of {totalItems} items
        </PaginationInfoMobile>
      )}

      <PaginationStyled>
        <PaginationButton
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          $disabled={currentPage === 1 || isLoading}
        >
          <FaChevronLeft />
          Previous
        </PaginationButton>

        <PageNumbers>
          {getPageNumbers().map((page, index) => {
            if (page === "ellipsis-start" || page === "ellipsis-end") {
              return (
                <Ellipsis key={`ellipsis-${index}`}>
                  <FaEllipsisH />
                </Ellipsis>
              );
            }

            return (
              <PageNumber
                key={page}
                $active={currentPage === page}
                onClick={() => handlePageChange(page)}
                disabled={isLoading}
                $disabled={isLoading}
              >
                {isLoading && currentPage === page ? (
                  <LoadingSpinner $size="xs" />
                ) : (
                  page
                )}
              </PageNumber>
            );
          })}
        </PageNumbers>

        <PaginationButton
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          $disabled={currentPage === totalPages || isLoading}
        >
          Next
          <FaChevronRight />
        </PaginationButton>
      </PaginationStyled>
    </PaginationContainer>
  );
};

export default Pagination;

// Styled Components
const PaginationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-xl);
  background: var(--white);
  border-top: 1px solid var(--gray-200);

  @media (max-width: 768px) {
    padding: var(--space-lg);
  }
`;

const PaginationInfoMobile = styled.span`
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-family: var(--font-body);
  text-align: center;

  @media (min-width: 769px) {
    display: none;
  }
`;

const PaginationStyled = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 768px) {
    gap: var(--space-xs);
  }
`;

const PaginationButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: var(--white);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  transition: all var(--transition-normal);
  font-family: var(--font-body);

  &:hover:not(:disabled) {
    background: var(--primary);
    color: var(--white);
    border-color: var(--primary);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: var(--space-xs) var(--space-sm);
    font-size: var(--text-xs);
  }
`;

const PageNumbers = styled.div`
  display: flex;
  gap: var(--space-xs);
  align-items: center;

  @media (max-width: 768px) {
    gap: 2px;
  }
`;

const PageNumber = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  padding: var(--space-xs);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  background: ${(props) => (props.$active ? "var(--primary)" : "var(--white)")};
  color: ${(props) => (props.$active ? "var(--white)" : "var(--text-primary)")};
  font-size: var(--text-sm);
  font-weight: ${(props) =>
    props.$active ? "var(--font-semibold)" : "var(--font-normal)"};
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  transition: all var(--transition-normal);
  font-family: var(--font-body);

  &:hover:not(:disabled) {
    background: ${(props) =>
      props.$active ? "var(--primary)" : "var(--gray-100)"};
    border-color: ${(props) =>
      props.$active ? "var(--primary)" : "var(--gray-400)"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    min-width: 36px;
    height: 36px;
    font-size: var(--text-xs);
  }
`;

const Ellipsis = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  color: var(--text-muted);
  font-size: var(--text-sm);
  font-family: var(--font-body);

  @media (max-width: 768px) {
    min-width: 36px;
    height: 36px;
    font-size: var(--text-xs);
  }
`;
