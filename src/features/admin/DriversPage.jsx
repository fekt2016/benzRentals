 
import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaEye, FaFilter, FaSearch, FaIdCard, FaCheck, FaTimes, FaPlus } from "react-icons/fa";
import { FiTruck, FiShield } from "react-icons/fi";

import { useGetDrivers, useVerifyDriver } from "../../features/drivers/useDriver";
import { useGetProfessionalDrivers } from "../../features/drivers/hooks/useProfessionalDrivers";
import { useGetDriverAvailability } from "../../features/drivers/hooks/useGetDriverAvailability";
import ProfessionalDriverTable from "../../features/drivers/components/ProfessionalDriverTable";
import ProfessionalDriverForm from "../../features/drivers/components/ProfessionalDriverForm";

import Pagination from "../../components/ui/Pagination";
import AdminDocumentModal from "../../components/ui/AdminDocumentModel";

import { PrimaryButton, GhostButton } from "../../components/ui/Button";
import { EmptyState, LoadingState } from "../../components/ui/LoadingSpinner";

// If you have route SEO helpers, you can wire them here; otherwise omit
import usePageTitle from "../../app/hooks/usePageTitle";
import { ADMIN_ROUTE_CONFIG, ADMIN_PATHS } from "../../config/constants";

/**
 * DriversPage Component
 * 
 * Admin page for managing drivers with two tabs:
 * - Rental Drivers: Customer's own drivers (driverType: "rental")
 * - Professional Drivers: Chauffeurs/professional drivers (driverType: "professional")
 */
const DriversPage = () => {
  const navigate = useNavigate();
  
  // Optional SEO hook
  const seoConfig = ADMIN_ROUTE_CONFIG[ADMIN_PATHS.DRIVERS];
  usePageTitle(seoConfig.description);

  // Tab state: "rental" or "professional"
  const [activeDriverTab, setActiveDriverTab] = useState("professional");

  // Fetch driver availability summary (only for professional drivers tab)
  const {
    data: availabilityData,
    isLoading: isLoadingAvailability,
    error: availabilityError,
  } = useGetDriverAvailability();

  // Debug logging for availability data
  useEffect(() => {
    if (activeDriverTab === "professional") {
      console.log("[DriversPage] Availability data:", availabilityData);
      console.log("[DriversPage] Availability loading:", isLoadingAvailability);
      console.log("[DriversPage] Availability error:", availabilityError);
    }
  }, [activeDriverTab, availabilityData, isLoadingAvailability, availabilityError]);

  // Fetch rental drivers only when rental tab is active
  const {
    data: driversData,
    isLoading,
    error,
  } = useGetDrivers(
    { driverType: "rental" }, // Filter for rental drivers only
    {
      enabled: activeDriverTab === "rental", // Only fetch when rental tab is active
    }
  );

  // Fetch professional drivers only when professional tab is active (using admin route)
  const {
    data: professionalDriversData,
    isLoading: isLoadingProfessional,
    error: professionalError,
    refetch: refetchProfessionalDrivers,
  } = useGetProfessionalDrivers(
    { useAdminRoute: true }, // Use admin route for full access
    {
      enabled: activeDriverTab === "professional", // Only fetch when professional tab is active
      refetchInterval: activeDriverTab === "professional" ? 1000 * 15 : false, // Poll every 15 seconds when tab is active
    }
  );
  
  // Extract drivers from response
  // Backend returns: { status: "success", results: number, data: [...] }
  // Service returns response.data, so driversData = { status: "success", results: number, data: [...] }
  const drivers = useMemo(() => {
    if (!driversData) return [];
    
    // Check if data is directly an array
    if (Array.isArray(driversData.data)) {
      return driversData.data;
    }
    
    // Check if data is nested
    if (driversData.data?.data && Array.isArray(driversData.data.data)) {
      return driversData.data.data;
    }
    
    return [];
  }, [driversData]);
  
  // Admin route returns: { status: "success", data: [...], ... }
  // Service returns response.data, so professionalDriversData = { status: "success", data: [...], ... }
  // With new unified Driver model, professional drivers are fetched with driverType: "professional"
  const professionalDrivers = useMemo(() => {
    if (!professionalDriversData) return [];
    
    // Admin route structure: { status: "success", data: [...], ... }
    if (professionalDriversData.data && Array.isArray(professionalDriversData.data)) {
      return professionalDriversData.data;
    }
    
    // Fallback: check if data is nested
    if (professionalDriversData.data?.data && Array.isArray(professionalDriversData.data.data)) {
      return professionalDriversData.data.data;
    }
    
    return [];
  }, [professionalDriversData]);
  
  // Debug logging
  useEffect(() => {
    if (activeDriverTab === "professional") {
      console.log("[DriversPage] Professional drivers raw data:", professionalDriversData);
      console.log("[DriversPage] Professional drivers extracted:", professionalDrivers);
      console.log("[DriversPage] Loading:", isLoadingProfessional);
      console.log("[DriversPage] Error:", professionalError);
    }
    if (activeDriverTab === "rental") {
      console.log("[DriversPage] Rental drivers raw data:", driversData);
      console.log("[DriversPage] Rental drivers extracted:", drivers);
      console.log("[DriversPage] Loading:", isLoading);
      console.log("[DriversPage] Error:", error);
    }
  }, [activeDriverTab, professionalDriversData, professionalDrivers, isLoadingProfessional, professionalError, driversData, drivers, isLoading, error]);

  // Modal state for professional driver form (optional - for manually adding drivers)
  const [isProfessionalFormOpen, setIsProfessionalFormOpen] = useState(false);
  const [editingProfessionalDriver, setEditingProfessionalDriver] = useState(null);

  // filters, pagination
  const [filters, setFilters] = useState({
    status: "all", // active | suspended | pending | all
    verification: "all", // all | verified | pending | unverified
    search: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // modal state for rental driver documents
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("license"); // 'license' | 'insurance'
  const [selectedDriver, setSelectedDriver] = useState(null);

  // action hook (verify/reject/update/activate/suspend)
  const { mutate: driverAction, isPending: isActing } = useVerifyDriver(selectedDriver?._id);

  // keep page reset when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.status, filters.verification, filters.search]);

  // Filter logic for rental drivers (only show rental type)
  const filteredDrivers = useMemo(() => {
    if (!drivers.length) return [];

    const term = filters.search.trim().toLowerCase();

    return drivers.filter((d) => {
      // Only show rental drivers
      if (d.driverType && d.driverType !== "rental") return false;

      const user = d.user || {};
      const userName = (user.fullName || d.name || "").toLowerCase();
      const userEmail = (user.email || "").toLowerCase();
      const matchesSearch =
        !term ||
        userName.includes(term) ||
        userEmail.includes(term) ||
        (d.license?.number || "").toLowerCase().includes(term);

      // status filter
      const matchesStatus =
        filters.status === "all" ? true : (d.status || "pending") === filters.status;

      // verification filter
      const lic = !!d.license?.verified;
      const ins = !!d.insurance?.verified;
      const allVerified = lic && ins;
      const allUnverified = !lic && !ins;
      const somePending = !allVerified;

      let matchesVerification = true;
      if (filters.verification === "verified") matchesVerification = allVerified;
      else if (filters.verification === "unverified") matchesVerification = allUnverified;
      else if (filters.verification === "pending") matchesVerification = somePending;

      return matchesSearch && matchesStatus && matchesVerification;
    });
  }, [drivers, filters]);

  // pagination calc
  const { totalPages, startIndex, endIndex, currentDrivers } = useMemo(() => {
    const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentDrivers = filteredDrivers.slice(startIndex, endIndex);
    return { totalPages, startIndex, endIndex, currentDrivers };
  }, [filteredDrivers, currentPage]);

  // handlers
  const handleFilterChange = useCallback((type, value) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ status: "all", verification: "all", search: "" });
  }, []);

  // Format last available time
  const formatLastAvailable = useCallback((driver) => {
    if (!driver?.lastAvailable) return "Never";
    
    const isOnline = driver.status === "available" || driver.status === "active" || driver.status === "busy";
    const lastAvailableDate = new Date(driver.lastAvailable);
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
  }, []);

  const openModal = useCallback((driver, tab = "license") => {
    setSelectedDriver(driver);
    setActiveTab(tab);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedDriver(null);
  }, []);

  const handleActivate = useCallback((driverId) => {
    driverAction({ action: "activate", driverId });
  }, [driverAction]);

  const handleSuspend = useCallback((driverId) => {
    driverAction({ action: "suspend", driverId });
  }, [driverAction]);

  // Professional driver form handlers
  // Note: Professional drivers are now created automatically during signup when user selects driver role
  // This form is optional for manually adding drivers if needed
  const handleAddProfessionalDriver = useCallback(() => {
    setEditingProfessionalDriver(null);
    setIsProfessionalFormOpen(true);
  }, []);

  const handleViewProfessionalDriver = useCallback(
    (driver) => {
      navigate(`/admin/drivers/professional/${driver._id}`);
    },
    [navigate]
  );

  const handleCloseProfessionalForm = useCallback(() => {
    setIsProfessionalFormOpen(false);
    setEditingProfessionalDriver(null);
  }, []);

  // Determine which data to show based on active tab
  const isLoadingCurrent = activeDriverTab === "rental" ? isLoading : isLoadingProfessional;
  const errorCurrent = activeDriverTab === "rental" ? error : professionalError;
  const hasData = activeDriverTab === "rental" ? drivers.length > 0 : professionalDrivers.length > 0;

  // loading & error UX
  if (isLoadingCurrent) {
    return (
      <PageWrapper>
        <LoadingState message="Loading drivers..." size="lg" />
      </PageWrapper>
    );
  }

  if (errorCurrent) {
    return (
      <PageWrapper>
        <Header>
          <Title>Drivers</Title>
        </Header>
        <EmptyState
          title="Failed to load drivers"
          message="Please refresh the page to try again."
          action={<PrimaryButton onClick={() => window.location.reload()}>Refresh</PrimaryButton>}
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* Header */}
      <Header>
        <HeaderLeft>
          <Title>Drivers</Title>
          <Subtitle>Manage driver accounts, documents, and status</Subtitle>
        </HeaderLeft>
        {activeDriverTab === "professional" && (
          <HeaderActions>
            <PrimaryButton onClick={handleAddProfessionalDriver}>
              <FaPlus style={{ marginRight: "var(--space-xs)" }} />
              Add Professional Driver
            </PrimaryButton>
          </HeaderActions>
        )}
      </Header>

      {/* Availability Stats (Professional Drivers Only) */}
      {activeDriverTab === "professional" && (
        <>
          {isLoadingAvailability && (
            <div style={{ padding: "var(--space-lg)", textAlign: "center" }}>
              Loading availability stats...
            </div>
          )}
          {availabilityError && (
            <div style={{ padding: "var(--space-lg)", color: "var(--error)", textAlign: "center" }}>
              Error loading availability: {availabilityError?.message || "Unknown error"}
            </div>
          )}
          {availabilityData && !isLoadingAvailability && !availabilityError && (
        <StatsGrid>
          <StatCard>
            <StatIcon $color="var(--green-500)">
              <FiShield size={24} />
            </StatIcon>
            <StatContent>
              <StatValue>{availabilityData.stats?.available || 0}</StatValue>
              <StatLabel>Available</StatLabel>
            </StatContent>
          </StatCard>
          <StatCard>
            <StatIcon $color="var(--blue-500)">
              <FiTruck size={24} />
            </StatIcon>
            <StatContent>
              <StatValue>{availabilityData.stats?.onTrip || 0}</StatValue>
              <StatLabel>On Trip</StatLabel>
            </StatContent>
          </StatCard>
          <StatCard>
            <StatIcon $color="var(--gray-500)">
              <FiShield size={24} />
            </StatIcon>
            <StatContent>
              <StatValue>{availabilityData.stats?.offline || 0}</StatValue>
              <StatLabel>Offline</StatLabel>
            </StatContent>
          </StatCard>
          <StatCard>
            <StatIcon $color="var(--primary)">
              <FiShield size={24} />
            </StatIcon>
            <StatContent>
              <StatValue>{availabilityData.totalDrivers || 0}</StatValue>
              <StatLabel>Total Drivers</StatLabel>
            </StatContent>
          </StatCard>
        </StatsGrid>
          )}
        </>
      )}

      {/* Tabs */}
      <TabsContainer>
        <TabsList>
          <TabButton
            $active={activeDriverTab === "professional"}
            onClick={() => setActiveDriverTab("professional")}
          >
            <FiShield />
            Professional Drivers
            {professionalDrivers.length > 0 && (
              <TabBadge $active={activeDriverTab === "professional"}>
                {professionalDrivers.length}
              </TabBadge>
            )}
          </TabButton>
          <TabButton
            $active={activeDriverTab === "rental"}
            onClick={() => setActiveDriverTab("rental")}
          >
            <FiTruck />
            Rental Drivers
            {drivers.length > 0 && (
              <TabBadge $active={activeDriverTab === "rental"}>{drivers.length}</TabBadge>
            )}
          </TabButton>
        </TabsList>
      </TabsContainer>

      {/* Tab Content */}
      {activeDriverTab === "rental" ? (
        <>
          {/* Rental Drivers Content */}
          {!drivers.length ? (
            <EmptyState
              icon={<FaIdCard />}
              title="No rental drivers yet"
              message="Rental drivers added by customers will appear here."
            />
          ) : (
            <>
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
                      placeholder="Search by name, email, or license number..."
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
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="pending">Pending</option>
                    </Select>
                  </FilterGroup>

                  <FilterGroup>
                    <FilterLabel>Verification</FilterLabel>
                    <Select
                      value={filters.verification}
                      onChange={(e) => handleFilterChange("verification", e.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="verified">Fully Verified</option>
                      <option value="pending">Pending Verification</option>
                      <option value="unverified">Not Verified</option>
                    </Select>
                  </FilterGroup>
                </FilterGrid>

                <ActiveFilters>
                  {filters.status !== "all" && (
                    <ActiveFilterChip>
                      Status: {filters.status}
                      <RemoveFilter onClick={() => handleFilterChange("status", "all")}>
                        ×
                      </RemoveFilter>
                    </ActiveFilterChip>
                  )}
                  {filters.verification !== "all" && (
                    <ActiveFilterChip>
                      Verification: {filters.verification}
                      <RemoveFilter
                        onClick={() => handleFilterChange("verification", "all")}
                      >
                        ×
                      </RemoveFilter>
                    </ActiveFilterChip>
                  )}
                  {filters.search && (
                    <ActiveFilterChip>
                      Search: {filters.search}
                      <RemoveFilter onClick={() => handleFilterChange("search", "")}>
                        ×
                      </RemoveFilter>
                    </ActiveFilterChip>
                  )}
                </ActiveFilters>
              </FilterSection>

              {/* Header Info for Rental Drivers */}
              <HeaderInfo>
                <CountPill>
                  {filteredDrivers.length} of {drivers.length} rental drivers
                </CountPill>
                <HeaderRange>
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredDrivers.length)} of{" "}
                  {filteredDrivers.length}
                </HeaderRange>
              </HeaderInfo>

              {/* Desktop Table */}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader>Driver</TableHeader>
                      <TableHeader>Contact</TableHeader>
                      <TableHeader>License</TableHeader>
                      <TableHeader>Insurance</TableHeader>
                      <TableHeader>Status</TableHeader>
                      <TableHeader>Last Available</TableHeader>
                      <TableHeader>Actions</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentDrivers.map((d) => {
                      const user = d.user || {};
                      const isLic = !!d.license?.verified;
                      const isIns = !!d.insurance?.verified;

                      return (
                        <TableRow key={d._id}>
                          <TableCell>
                            <DriverCell>
                              <Avatar>{(d.name || "D").charAt(0).toUpperCase()}</Avatar>
                              <DriverMeta>
                                <DriverName>{d.name || "Unknown Driver"}</DriverName>
                                <DriverJoin>
                                  Joined {new Date(d.createdAt).toLocaleDateString()}
                                </DriverJoin>
                              </DriverMeta>
                            </DriverCell>
                          </TableCell>

                          <TableCell>
                            <ContactCol>
                              <ContactLine>{user.email || "No email"}</ContactLine>
                              <ContactSub>{user.fullName ? "Acc. Owner" : "—"}</ContactSub>
                            </ContactCol>
                          </TableCell>

                          <TableCell>
                            <MiniDoc>
                              <DocPill $ok={isLic}>{isLic ? "Verified" : "Pending"}</DocPill>
                              <DocSub>{d.license?.number || "No number"}</DocSub>
                            </MiniDoc>
                          </TableCell>

                          <TableCell>
                            <MiniDoc>
                              <DocPill $ok={isIns}>{isIns ? "Verified" : "Pending"}</DocPill>
                              <DocSub>{d.insurance?.policyNumber || "No policy"}</DocSub>
                            </MiniDoc>
                          </TableCell>

                          <TableCell>
                            <StatusPill $status={d.status || "pending"}>
                              {(d.status || "pending").toUpperCase()}
                            </StatusPill>
                          </TableCell>

                          <TableCell>
                            <LastAvailableText>
                              {formatLastAvailable(d)}
                            </LastAvailableText>
                          </TableCell>

                          <TableCell>
                            <Actions>
                              <IconButton
                                onClick={() => openModal(d, "license")}
                                title="View & verify documents"
                              >
                                <FaEye />
                              </IconButton>
                              {d.status === "active" ? (
                                <IconButton
                                  $variant="danger"
                                  onClick={() => handleSuspend(d._id)}
                                  title="Suspend driver"
                                  disabled={isActing}
                                >
                                  <FaTimes />
                                </IconButton>
                              ) : (
                                <IconButton
                                  $variant="success"
                                  onClick={() => handleActivate(d._id)}
                                  title="Activate driver"
                                  disabled={isActing}
                                >
                                  <FaCheck />
                                </IconButton>
                              )}
                            </Actions>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Mobile Cards */}
              <MobileContainer>
                {currentDrivers.map((d) => (
                  <DriverCard key={d._id}>
                    <CardHeader>
                      <Avatar lg>
                        {(d.user?.fullName || d.name || "D").charAt(0).toUpperCase()}
                      </Avatar>
                      <CardHeaderText>
                        <DriverName>{d.user?.fullName || d.name || "Unknown Driver"}</DriverName>
                        <DriverJoin>
                          Joined {new Date(d.createdAt).toLocaleDateString()}
                        </DriverJoin>
                      </CardHeaderText>
                    </CardHeader>

                    <CardGrid>
                      <CardGroup>
                        <CardLabel>Email</CardLabel>
                        <CardValue>{d.user?.email || "No email"}</CardValue>
                      </CardGroup>

                      <CardGroup>
                        <CardLabel>Status</CardLabel>
                        <StatusPill $status={d.status || "pending"} tight>
                          {(d.status || "pending").toUpperCase()}
                        </StatusPill>
                      </CardGroup>

                      <CardGroup>
                        <CardLabel>Last Available</CardLabel>
                        <CardValue>{formatLastAvailable(d)}</CardValue>
                      </CardGroup>

                      <CardGroup>
                        <CardLabel>License</CardLabel>
                        <DocPill $ok={!!d.license?.verified}>
                          {d.license?.verified ? "Verified" : "Pending"}
                        </DocPill>
                        <DocHint>{d.license?.number || "No number"}</DocHint>
                      </CardGroup>

                      <CardGroup>
                        <CardLabel>Insurance</CardLabel>
                        <DocPill $ok={!!d.insurance?.verified}>
                          {d.insurance?.verified ? "Verified" : "Pending"}
                        </DocPill>
                        <DocHint>{d.insurance?.policyNumber || "No policy"}</DocHint>
                      </CardGroup>
                    </CardGrid>

                    <CardActions>
                      <PrimaryButton onClick={() => openModal(d, "license")}>
                        <FaEye style={{ marginRight: "var(--space-xs)" }} />
                        View
                      </PrimaryButton>

                      {d.status === "active" ? (
                        <GhostButton
                          $size="md"
                          onClick={() => handleSuspend(d._id)}
                          disabled={isActing}
                        >
                          <FaTimes style={{ marginRight: "var(--space-xs)" }} />
                          Suspend
                        </GhostButton>
                      ) : (
                        <GhostButton
                          $size="md"
                          onClick={() => handleActivate(d._id)}
                          disabled={isActing}
                        >
                          <FaCheck style={{ marginRight: "var(--space-xs)" }} />
                          Activate
                        </GhostButton>
                      )}
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
                  <ClearFiltersButton onClick={clearFilters}>Clear All Filters</ClearFiltersButton>
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
            </>
          )}
        </>
      ) : (
        <>
          {/* Professional Drivers Content */}
          {!professionalDrivers.length ? (
            <EmptyState
              icon={<FiShield />}
              title="No professional drivers yet"
              message="Add professional drivers (chauffeurs) to manage them here."
              action={
                <PrimaryButton onClick={handleAddProfessionalDriver}>
                  <FaPlus style={{ marginRight: "var(--space-xs)" }} />
                  Add Professional Driver
                </PrimaryButton>
              }
            />
          ) : (
            <ProfessionalDriverTable
              drivers={professionalDrivers}
              isLoading={isLoadingProfessional}
              error={professionalError}
              onView={handleViewProfessionalDriver}
            />
          )}
        </>
      )}

      {/* Rental Driver Document Modal */}
      {isModalOpen && selectedDriver && (
        <AdminDocumentModal
          driver={selectedDriver}
          onClose={closeModal}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}

      {/* Professional Driver Form Modal */}
      {isProfessionalFormOpen && (
        <ProfessionalDriverForm
          driver={editingProfessionalDriver}
          onClose={handleCloseProfessionalForm}
        />
      )}
    </PageWrapper>
  );
};

export default DriversPage;

/* ======================= Styles ======================= */

const PageWrapper = styled.div`
  padding: 0;
  background: var(--background);
  min-height: 100vh;
`;

const Header = styled.div`
  background: var(--white);
  padding: var(--space-xl);
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-lg);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0 0 var(--space-sm) 0;
  font-family: var(--font-heading);
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
  margin: 0 0 var(--space-md) 0;
  font-size: var(--text-base);
  font-family: var(--font-body);
`;

const HeaderInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-md);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-sm);
  }
`;

const CountPill = styled.span`
  background: var(--gray-200);
  color: var(--text-secondary);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  font-family: var(--font-body);
`;

const HeaderRange = styled.span`
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-family: var(--font-body);

  @media (max-width: 768px) {
    display: none;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`;

const HeaderActions = styled.div`
  display: flex;
  gap: var(--space-md);
  align-items: center;
`;

/* Tabs */
const TabsContainer = styled.div`
  background: var(--white);
  border-bottom: 1px solid var(--gray-200);
  padding: 0 var(--space-xl);
`;

const TabsList = styled.div`
  display: flex;
  gap: var(--space-md);
  border-bottom: 2px solid var(--gray-200);
`;

const TabButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  color: var(--text-secondary);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  font-family: var(--font-body);
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
  margin-bottom: -2px;

  &:hover {
    color: var(--primary);
    background: var(--primary-light);
  }

  ${(props) =>
    props.$active &&
    `
    color: var(--primary);
    border-bottom-color: var(--primary);
    font-weight: var(--font-semibold);
  `}

  svg {
    font-size: var(--text-lg);
  }
`;

const TabBadge = styled.span`
  background: ${(props) => (props.$active ? "var(--primary)" : "var(--gray-300)")};
  color: ${(props) => (props.$active ? "var(--white)" : "var(--text-secondary)")};
  padding: 2px var(--space-xs);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  min-width: 20px;
  text-align: center;
`;

/* Filters */

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
  margin-bottom: var(--space-lg);

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

  &::placeholder {
    color: var(--text-muted);
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

const ActiveFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
`;

const ActiveFilterChip = styled.span`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  background: var(--primary-light);
  color: var(--primary-dark);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  font-family: var(--font-body);
`;

const RemoveFilter = styled.button`
  background: none;
  border: none;
  color: var(--primary-dark);
  cursor: pointer;
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%;

  &:hover { background: var(--primary); color: var(--white); }
`;

/* Desktop table */

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
  padding: var(--space-sm);
  text-align: left;
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--gray-200);
  font-family: var(--font-body);
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
  padding: var(--space-sm);
  vertical-align: middle;
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
  display: flex; align-items: center; justify-content: center;
  font-weight: var(--font-bold);
  font-size: var(--text-sm);
  flex-shrink: 0;
`;

const DriverMeta = styled.div`
  display: flex; flex-direction: column; gap: 2px;
`;

const DriverName = styled.div`
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  font-size: var(--text-base);
  font-family: var(--font-body);
`;

const DriverJoin = styled.div`
  color: var(--text-muted);
  font-size: var(--text-xs);
`;

const ContactCol = styled.div`
  display: flex; flex-direction: column; gap: 2px;
`;

const ContactLine = styled.div`
  font-weight: var(--font-medium);
  color: var(--text-primary);
  font-size: var(--text-sm);
  font-family: var(--font-body);
`;

const ContactSub = styled.div`
  color: var(--text-muted);
  font-size: var(--text-xs);
`;

const MiniDoc = styled.div`
  display: flex; flex-direction: column; gap: 4px;
`;

const DocPill = styled.span`
  display: inline-flex; align-items: center; justify-content: center;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs); font-weight: var(--font-semibold);
  color: var(--white);
  background: ${({ $ok }) => ($ok ? "var(--success)" : "var(--warning)")};
  min-width: 86px; text-align: center;
`;

const DocSub = styled.div`
  color: var(--text-muted); font-size: var(--text-xs);
`;

const StatusPill = styled.div`
  display: inline-flex; align-items: center; justify-content: center;
  padding: 0.35rem 0.7rem;
  border-radius: var(--radius-full);
  font-size: var(--text-xs); font-weight: var(--font-semibold);
  color: var(--white);
  background: ${({ $status }) => {
    switch ($status) {
      case "active": return "var(--success)";
      case "suspended": return "var(--error)";
      case "pending": return "var(--warning)";
      default: return "var(--gray-400)";
    }
  }};
  ${({ tight }) => tight && "width: fit-content;"}
  text-transform: uppercase;
`;

const Actions = styled.div`
  display: flex; gap: var(--space-sm);
`;

const IconButton = styled(GhostButton)`
  && {
    padding: var(--space-sm);
    min-width: auto;
    width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;

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
  }
`;

/* Mobile cards */

const MobileContainer = styled.div`
  display: none;
  padding: var(--space-md);
  gap: var(--space-md);
  @media (max-width: 768px) {
    display: flex; flex-direction: column;
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
  display: flex; align-items: center; gap: var(--space-md);
  margin-bottom: var(--space-md);
`;

const CardHeaderText = styled.div`
  display: flex; flex-direction: column;
`;

const CardGrid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
  margin-bottom: var(--space-md);

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

const CardGroup = styled.div`
  display: flex; flex-direction: column; gap: 6px;
`;

const CardLabel = styled.div`
  font-size: var(--text-xs); color: var(--text-muted);
`;

const CardValue = styled.div`
  font-size: var(--text-sm); color: var(--text-primary);
`;

const DocHint = styled.div`
  font-size: var(--text-xs); color: var(--text-muted);
`;

const CardActions = styled.div`
  display: flex; gap: var(--space-sm);
`;

/* No results */

const NoResults = styled.div`
  text-align: center; padding: var(--space-2xl);
  background: var(--white); margin: var(--space-xl);
  border-radius: var(--radius-xl); border: 1px solid var(--gray-200);
`;

const NoResultsIcon = styled.div`
  font-size: 3rem; margin-bottom: var(--space-lg);
`;

const NoResultsTitle = styled.h3`
  font-size: var(--text-xl); color: var(--text-primary);
  margin: 0 0 var(--space-sm) 0; font-weight: var(--font-semibold);
  font-family: var(--font-heading);
`;

const NoResultsText = styled.p`
  color: var(--text-secondary); margin: 0 0 var(--space-lg) 0; font-size: var(--text-base);
  font-family: var(--font-body);
`;

const LastAvailableText = styled.div`
  font-size: var(--text-sm);
  color: var(--text-primary);
  font-weight: var(--font-medium);
  font-family: var(--font-body);
`;

/* Stats Grid */
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-2xl);
`;

const StatCard = styled.div`
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  padding: var(--space-lg);
  display: flex;
  align-items: center;
  gap: var(--space-md);
`;

const StatIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: var(--radius-lg);
  background: ${({ $color }) => $color || "var(--primary)"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

const StatContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatValue = styled.div`
  font-weight: var(--font-bold);
  font-size: var(--text-2xl);
  color: var(--text-primary);
`;

const StatLabel = styled.div`
  color: var(--text-muted);
  font-size: var(--text-sm);
`;
