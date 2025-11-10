// src/features/drivers/components/ProfessionalDriverTable.jsx
import React, { useMemo, useState, useCallback } from "react";
import styled from "styled-components";
import { FaEye, FaFilter, FaSearch } from "react-icons/fa";
import { FiStar, FiPhone, FiMail, FiCircle } from "react-icons/fi";
import { PrimaryButton, GhostButton } from "../../../components/ui/Button";
import { EmptyState, LoadingState } from "../../../components/ui/LoadingSpinner";
import Pagination from "../../../components/ui/Pagination";

/**
 * ProfessionalDriverTable Component
 * 
 * Displays a table/card list of professional drivers (chauffeurs) for admin management.
 * - Desktop table view and mobile card view
 * - Search and filter functionality
 * - Actions: View details only
 * - Uses global design system styles
 * 
 * @param {Array} drivers - Array of professional drivers to display
 * @param {boolean} isLoading - Loading state
 * @param {Object} error - Error object if fetch failed
 * @param {Function} onView - Callback when view button is clicked
 */

const ProfessionalDriverTable = ({ drivers = [], isLoading = false, error = null, onView }) => {
  const [filters, setFilters] = useState({
    status: "all",
    verification: "all",
    search: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Check if driver is currently available/online
  // Uses new availability fields: isOnline, currentStatus, or falls back to status
  const isDriverAvailable = useCallback((driver) => {
    if (!driver) return false;
    // Check new availability fields first
    if (driver.isOnline === true) return true;
    if (driver.currentStatus === "available" || driver.currentStatus === "on-trip") return true;
    // Fallback to legacy status field
    const status = driver.status || "offline";
    return status === "available" || status === "active" || status === "busy";
  }, []);

  // Format last available time
  // Uses new lastActiveAt field or falls back to lastAvailable
  const formatLastAvailable = useCallback((driver) => {
    // Prefer lastActiveAt (new field), fallback to lastAvailable (legacy)
    const lastActiveTime = driver?.lastActiveAt || driver?.lastAvailable;
    if (!lastActiveTime) return "Never";
    
    const isOnline = isDriverAvailable(driver);
    const lastAvailableDate = new Date(lastActiveTime);
    const now = new Date();
    const diffInSeconds = Math.floor((now - lastAvailableDate) / 1000);
    
    // If driver is currently online and lastAvailable is recent, show "Currently online"
    if (isOnline && diffInSeconds < 300) { // Within 5 minutes
      return "Currently online";
    }
    
    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} min ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hr ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      if (days === 1) {
        return "Yesterday";
      } else if (days < 7) {
        return `${days} days ago`;
      } else {
        return lastAvailableDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: lastAvailableDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
        });
      }
    }
  }, [isDriverAvailable]);

  // Filter logic
  const filteredDrivers = useMemo(() => {
    if (!drivers.length) return [];

    const term = filters.search.trim().toLowerCase();

    return drivers.filter((d) => {
      // Professional drivers use fullName (from signup), with fallback to name
      const driverName = d.fullName || d.name || "";
      const matchesSearch =
        !term ||
        driverName.toLowerCase().includes(term) ||
        (d.email || "").toLowerCase().includes(term) ||
        (d.phone || "").toLowerCase().includes(term) ||
        (d.licenseNumber || "").toLowerCase().includes(term);

      const matchesStatus =
        filters.status === "all" ? true : (d.status || "offline") === filters.status;

      const matchesVerification =
        filters.verification === "all"
          ? true
          : filters.verification === "verified"
          ? d.verified === true
          : filters.verification === "unverified"
          ? d.verified === false
          : !d.verified;

      return matchesSearch && matchesStatus && matchesVerification;
    });
  }, [drivers, filters]);

  // Pagination
  const { totalPages, startIndex, endIndex, currentDrivers } = useMemo(() => {
    const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentDrivers = filteredDrivers.slice(startIndex, endIndex);
    return { totalPages, startIndex, endIndex, currentDrivers };
  }, [filteredDrivers, currentPage]);

  const handleFilterChange = useCallback((type, value) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ status: "all", verification: "all", search: "" });
  }, []);

  if (isLoading) {
    return (
      <TableWrapper>
        <LoadingState message="Loading professional drivers..." size="lg" />
      </TableWrapper>
    );
  }

  if (error) {
    return (
      <TableWrapper>
        <EmptyState
          title="Failed to load professional drivers"
          message="Please refresh the page to try again."
          action={
            <PrimaryButton onClick={() => window.location.reload()}>
              Refresh
            </PrimaryButton>
          }
        />
      </TableWrapper>
    );
  }

  if (!drivers.length) {
    return (
      <TableWrapper>
        <EmptyState
          title="No professional drivers yet"
          message="Add professional drivers to get started."
        />
      </TableWrapper>
    );
  }

  return (
    <TableWrapper>
      {/* Filters */}
      <FilterSection>
        <FilterHeader>
          <FilterTitle>
            <FaFilter />
            Filter Drivers
          </FilterTitle>
          {(filters.status !== "all" ||
            filters.verification !== "all" ||
            filters.search) && (
            <ClearFiltersButton onClick={clearFilters}>Clear All</ClearFiltersButton>
          )}
        </FilterHeader>

        <FilterGrid>
          <FilterGroup>
            <FilterLabel>
              <FaSearch />
              Search
            </FilterLabel>
            <SearchInput
              type="text"
              placeholder="Search by name, email, phone, or license..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Status</FilterLabel>
            <Select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="offline">Offline</option>
              <option value="suspended">Suspended</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Verification</FilterLabel>
            <Select
              value={filters.verification}
              onChange={(e) => handleFilterChange("verification", e.target.value)}
            >
              <option value="all">All</option>
              <option value="verified">Verified</option>
              <option value="unverified">Not Verified</option>
            </Select>
          </FilterGroup>
        </FilterGrid>
      </FilterSection>

      {/* Desktop Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Driver</TableHeader>
              <TableHeader>Contact</TableHeader>
              <TableHeader>License</TableHeader>
              <TableHeader>Rating</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Last Available</TableHeader>
              <TableHeader>Verification</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentDrivers.map((d) => (
              <TableRow key={d._id}>
                <TableCell>
                  <DriverCell>
                    <Avatar>
                      {(d.fullName || d.name || "D").charAt(0).toUpperCase()}
                    </Avatar>
                    <DriverMeta>
                      <DriverNameRow>
                        <DriverName>{d.fullName || d.name || "Unknown Driver"}</DriverName>
                        {isDriverAvailable(d) && (
                          <AvailabilityIndicator $available={true} title="Currently available">
                            <FiCircle />
                          </AvailabilityIndicator>
                        )}
                      </DriverNameRow>
                      <DriverJoin>
                        {d.totalRides || 0} rides • Joined{" "}
                        {new Date(d.createdAt).toLocaleDateString()}
                      </DriverJoin>
                    </DriverMeta>
                  </DriverCell>
                </TableCell>

                <TableCell>
                  <ContactCol>
                    <ContactLine>
                      <FiMail style={{ marginRight: "4px" }} />
                      {d.email || "No email"}
                    </ContactLine>
                    <ContactSub>
                      <FiPhone style={{ marginRight: "4px" }} />
                      {d.phone || "No phone"}
                    </ContactSub>
                  </ContactCol>
                </TableCell>

                <TableCell>
                  <LicenseCol>
                    <LicenseNumber>{d.licenseNumber || d.license?.number || "No license"}</LicenseNumber>
                    <LicenseExpiry>
                      Exp: {d.license?.expiryDate ? new Date(d.license.expiryDate).toLocaleDateString() : "N/A"}
                    </LicenseExpiry>
                  </LicenseCol>
                </TableCell>

                <TableCell>
                  <RatingCol>
                    <RatingStars>
                      <FiStar
                        style={{
                          color: d.rating >= 1 ? "var(--warning)" : "var(--gray-300)",
                        }}
                      />
                      <FiStar
                        style={{
                          color: d.rating >= 2 ? "var(--warning)" : "var(--gray-300)",
                        }}
                      />
                      <FiStar
                        style={{
                          color: d.rating >= 3 ? "var(--warning)" : "var(--gray-300)",
                        }}
                      />
                      <FiStar
                        style={{
                          color: d.rating >= 4 ? "var(--warning)" : "var(--gray-300)",
                        }}
                      />
                      <FiStar
                        style={{
                          color: d.rating >= 5 ? "var(--warning)" : "var(--gray-300)",
                        }}
                      />
                    </RatingStars>
                    <RatingValue>
                      {d.rating?.toFixed(1) || "0.0"} ({d.totalRides || 0})
                    </RatingValue>
                  </RatingCol>
                </TableCell>

                <TableCell>
                  <StatusCell>
                    <StatusPill $status={d.currentStatus || d.status || "offline"}>
                      {(d.currentStatus || d.status || "offline").toUpperCase()}
                    </StatusPill>
                    {isDriverAvailable(d) ? (
                      <AvailableLabel>
                        {d.currentStatus === "on-trip" ? "On Trip" : "Available"}
                      </AvailableLabel>
                    ) : (
                      <LastAvailableText>
                        Last: {formatLastAvailable(d)}
                      </LastAvailableText>
                    )}
                  </StatusCell>
                </TableCell>

                <TableCell>
                  <LastAvailableText>
                    {isDriverAvailable(d) ? "Currently available" : formatLastAvailable(d)}
                  </LastAvailableText>
                </TableCell>

                <TableCell>
                  <VerificationPill $verified={d.verified}>
                    {d.verified ? "Verified" : "Pending"}
                  </VerificationPill>
                </TableCell>

                <TableCell>
                  <Actions>
                    <IconButton
                      onClick={() => onView && onView(d)}
                      title="View details"
                    >
                      <FaEye />
                    </IconButton>
                  </Actions>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Mobile Cards */}
      <MobileContainer>
        {currentDrivers.map((d) => (
          <DriverCard key={d._id}>
            <CardHeader>
              <Avatar lg>
                {(d.fullName || d.name || "D").charAt(0).toUpperCase()}
              </Avatar>
              <CardHeaderText>
                <DriverNameRow>
                  <DriverName>{d.fullName || d.name || "Unknown Driver"}</DriverName>
                  {isDriverAvailable(d) && (
                    <AvailabilityIndicator $available={true} title="Currently available">
                      <FiCircle />
                    </AvailabilityIndicator>
                  )}
                </DriverNameRow>
                <DriverJoin>
                  {d.totalRides || 0} rides • {d.rating?.toFixed(1) || "0.0"} ⭐
                </DriverJoin>
              </CardHeaderText>
            </CardHeader>

            <CardGrid>
              <CardGroup>
                <CardLabel>Email</CardLabel>
                <CardValue>{d.email || "No email"}</CardValue>
              </CardGroup>
              <CardGroup>
                <CardLabel>Phone</CardLabel>
                <CardValue>{d.phone || "No phone"}</CardValue>
              </CardGroup>
              <CardGroup>
                <CardLabel>Status</CardLabel>
                <StatusCell>
                  <StatusPill $status={d.currentStatus || d.status || "offline"} tight>
                    {(d.currentStatus || d.status || "offline").toUpperCase()}
                  </StatusPill>
                  {isDriverAvailable(d) ? (
                    <AvailableLabel>
                      {d.currentStatus === "on-trip" ? "On Trip" : "Available"}
                    </AvailableLabel>
                  ) : (
                    <LastAvailableText style={{ fontSize: "var(--text-xs)", marginTop: "4px" }}>
                      Last: {formatLastAvailable(d)}
                    </LastAvailableText>
                  )}
                </StatusCell>
              </CardGroup>
              <CardGroup>
                <CardLabel>Last Available</CardLabel>
                <CardValue>
                  {isDriverAvailable(d) ? "Currently available" : formatLastAvailable(d)}
                </CardValue>
              </CardGroup>
              <CardGroup>
                <CardLabel>Verification</CardLabel>
                <VerificationPill $verified={d.verified}>
                  {d.verified ? "Verified" : "Pending"}
                </VerificationPill>
              </CardGroup>
            </CardGrid>

            <CardActions>
              <PrimaryButton onClick={() => onView && onView(d)}>
                <FaEye style={{ marginRight: "var(--space-xs)" }} />
                View
              </PrimaryButton>
            </CardActions>
          </DriverCard>
        ))}
      </MobileContainer>

      {/* No Results */}
      {filteredDrivers.length === 0 && drivers.length > 0 && (
        <NoResults>
          <NoResultsIcon>🔍</NoResultsIcon>
          <NoResultsTitle>No drivers found</NoResultsTitle>
          <NoResultsText>Try changing your filters or search</NoResultsText>
          <ClearFiltersButton onClick={clearFilters}>
            Clear All Filters
          </ClearFiltersButton>
        </NoResults>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredDrivers.length}
          itemsPerPage={itemsPerPage}
          showInfo
        />
      )}
    </TableWrapper>
  );
};

export default ProfessionalDriverTable;

/* ======================= Styles ======================= */

const TableWrapper = styled.div`
  padding: 0;
  background: var(--background);
`;

const FilterSection = styled.div`
  background: var(--white);
  padding: var(--space-xl);
  border-bottom: 1px solid var(--gray-200);
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
`;

const FilterTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--text-lg);
  color: var(--text-primary);
  margin: 0;
  font-weight: var(--font-semibold);
  font-family: var(--font-heading);
`;

const ClearFiltersButton = styled.button`
  background: transparent;
  color: var(--primary);
  border: 1px solid var(--primary);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--transition-normal);
  font-family: var(--font-body);

  &:hover {
    background: var(--primary);
    color: var(--white);
  }
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: var(--space-lg);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const FilterLabel = styled.label`
  font-size: var(--text-sm);
  color: var(--text-primary);
  font-weight: var(--font-medium);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-family: var(--font-body);
`;

const SearchInput = styled.input`
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-family: var(--font-body);
  transition: all var(--transition-normal);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px var(--primary-light);
  }
`;

const Select = styled.select`
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-family: var(--font-body);
  background: var(--white);
  cursor: pointer;
  transition: all var(--transition-normal);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px var(--primary-light);
  }
`;

const TableContainer = styled.div`
  background: var(--white);
  margin: 0;
  padding: var(--space-xl);
  display: block;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: var(--white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
`;

const TableHead = styled.thead`
  background: var(--surface);
`;

const TableHeader = styled.th`
  padding: var(--space-xs) var(--space-sm);
  text-align: left;
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--gray-200);
  font-family: var(--font-body);
  
  &:last-child {
    padding: var(--space-xs);
    text-align: center;
  }
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid var(--gray-100);
  transition: background var(--transition-normal);

  &:hover {
    background: var(--surface);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: var(--space-xs) var(--space-sm);
  vertical-align: middle;
  
  &:last-child {
    padding: var(--space-xs);
  }
`;

const DriverCell = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`;

const Avatar = styled.div`
  width: ${({ lg }) => (lg ? "52px" : "40px")};
  height: ${({ lg }) => (lg ? "52px" : "40px")};
  border-radius: var(--radius-full);
  background: var(--gradient-primary);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-bold);
  font-size: var(--text-sm);
  flex-shrink: 0;
`;

const DriverMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const DriverNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
`;

const DriverName = styled.div`
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  font-size: var(--text-base);
  font-family: var(--font-body);
`;

const AvailabilityIndicator = styled.span`
  display: inline-flex;
  align-items: center;
  color: ${({ $available }) => ($available ? "var(--success)" : "var(--gray-400)")};
  font-size: 8px;
  
  svg {
    fill: ${({ $available }) => ($available ? "var(--success)" : "transparent")};
    stroke: ${({ $available }) => ($available ? "var(--success)" : "var(--gray-400)")};
  }
`;

const StatusCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  align-items: flex-start;
`;

const AvailableLabel = styled.span`
  font-size: var(--text-xs);
  color: var(--success);
  font-weight: var(--font-medium);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  
  &::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--success);
    display: inline-block;
  }
`;

const DriverJoin = styled.div`
  color: var(--text-muted);
  font-size: var(--text-xs);
`;

const ContactCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ContactLine = styled.div`
  font-weight: var(--font-medium);
  color: var(--text-primary);
  font-size: var(--text-sm);
  font-family: var(--font-body);
  display: flex;
  align-items: center;
`;

const ContactSub = styled.div`
  color: var(--text-muted);
  font-size: var(--text-xs);
  display: flex;
  align-items: center;
`;

const LicenseCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const LicenseNumber = styled.div`
  font-weight: var(--font-medium);
  color: var(--text-primary);
  font-size: var(--text-sm);
  font-family: var(--font-body);
`;

const LicenseExpiry = styled.div`
  color: var(--text-muted);
  font-size: var(--text-xs);
`;

const RatingCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const RatingStars = styled.div`
  display: flex;
  gap: 2px;
  align-items: center;
`;

const RatingValue = styled.div`
  color: var(--text-muted);
  font-size: var(--text-xs);
`;

const LastAvailableText = styled.div`
  font-size: var(--text-sm);
  color: var(--text-primary);
  font-weight: var(--font-medium);
  font-family: var(--font-body);
`;

const StatusPill = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.7rem;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--white);
  background: ${({ $status }) => {
    switch ($status) {
      case "available":
        return "var(--success)";
      case "busy":
        return "var(--warning)";
      case "suspended":
        return "var(--error)";
      case "offline":
        return "var(--gray-400)";
      default:
        return "var(--gray-400)";
    }
  }};
  ${({ tight }) => tight && "width: fit-content;"}
  text-transform: uppercase;
`;

const VerificationPill = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--white);
  background: ${({ $verified }) =>
    $verified ? "var(--success)" : "var(--warning)"};
`;

const Actions = styled.div`
  display: flex;
  gap: var(--space-xs);
  justify-content: center;
  flex-wrap: wrap;
`;

const IconButton = styled(GhostButton)`
  && {
    padding: var(--space-xs);
    min-width: auto;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    ${(p) =>
      p.$variant === "danger" &&
      `
      color: var(--error);
      border-color: var(--error);
      &:hover:not(:disabled) { background: var(--error); color: var(--white); }
    `}

    ${(p) =>
      p.$variant === "success" &&
      `
      color: var(--success);
      border-color: var(--success);
      &:hover:not(:disabled) { background: var(--success); color: var(--white); }
    `}

    ${(p) =>
      p.$variant === "primary" &&
      `
      color: var(--primary);
      border-color: var(--primary);
      &:hover:not(:disabled) { background: var(--primary); color: var(--white); }
    `}
  }
`;

const MobileContainer = styled.div`
  display: none;
  padding: var(--space-md);
  gap: var(--space-md);
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

const DriverCard = styled.div`
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  padding: var(--space-lg);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
`;

const CardHeaderText = styled.div`
  display: flex;
  flex-direction: column;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
  margin-bottom: var(--space-md);

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

const CardGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const CardLabel = styled.div`
  font-size: var(--text-xs);
  color: var(--text-muted);
`;

const CardValue = styled.div`
  font-size: var(--text-sm);
  color: var(--text-primary);
`;

const CardActions = styled.div`
  display: flex;
  gap: var(--space-sm);
`;

const NoResults = styled.div`
  text-align: center;
  padding: var(--space-2xl);
  background: var(--white);
  margin: var(--space-xl);
  border-radius: var(--radius-xl);
  border: 1px solid var(--gray-200);
`;

const NoResultsIcon = styled.div`
  font-size: 3rem;
  margin-bottom: var(--space-lg);
`;

const NoResultsTitle = styled.h3`
  font-size: var(--text-xl);
  color: var(--text-primary);
  margin: 0 0 var(--space-sm) 0;
  font-weight: var(--font-semibold);
  font-family: var(--font-heading);
`;

const NoResultsText = styled.p`
  color: var(--text-secondary);
  margin: 0 0 var(--space-lg) 0;
  font-size: var(--text-base);
  font-family: var(--font-body);
`;

