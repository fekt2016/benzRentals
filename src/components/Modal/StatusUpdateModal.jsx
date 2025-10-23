// // components/StatusUpdateModal.js
// import React, { useState } from "react";
// import styled from "styled-components";

// const StatusUpdateModal = ({ booking, onClose, onStatusUpdate }) => {
//   const [selectedStatus, setSelectedStatus] = useState(booking.status);

//   // Define the status progression workflow
//   const getNextAvailableStatuses = (currentStatus) => {
//     const statusFlow = {
//       pending: ["confirmed", "cancelled"],
//       confirmed: ["payment_pending", "completed", "cancelled"],
//       payment_pending: ["completed", "cancelled"],
//       completed: [], // No further status changes after completed
//       cancelled: [], // No further status changes after cancelled
//     };

//     return statusFlow[currentStatus] || [];
//   };

//   const availableStatuses = getNextAvailableStatuses(booking.status);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onStatusUpdate(booking._id, selectedStatus);
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: "#f59e0b",
//       confirmed: "#3b82f6",
//       payment_pending: "#8b5cf6",
//       completed: "#10b981",
//       cancelled: "#ef4444",
//     };
//     return colors[status] || "#6b7280";
//   };

//   return (
//     <ModalOverlay>
//       <ModalContent>
//         <ModalHeader>
//           <h2>Update Booking Status</h2>
//           <CloseButton onClick={onClose}>×</CloseButton>
//         </ModalHeader>

//         <Form onSubmit={handleSubmit}>
//           <BookingInfo>
//             <h3>Booking: {booking._id}</h3>
//             <p>Car: {booking.car?.model}</p>
//             <p>Customer: {booking.user?.fullName}</p>
//             <CurrentStatus color={getStatusColor(booking.status)}>
//               Current Status: <strong>{booking.status}</strong>
//             </CurrentStatus>
//           </BookingInfo>

//           <Section>
//             <label htmlFor="status">Update Status To:</label>
//             <StatusSelect
//               id="status"
//               value={selectedStatus}
//               onChange={(e) => setSelectedStatus(e.target.value)}
//             >
//               <option value={booking.status}>Keep as {booking.status}</option>
//               {availableStatuses.map((status) => (
//                 <option key={status} value={status}>
//                   {status.charAt(0).toUpperCase() +
//                     status.slice(1).replace("_", " ")}
//                 </option>
//               ))}
//             </StatusSelect>

//             {availableStatuses.length === 0 && (
//               <NoChangesMessage>
//                 This booking cannot be updated further.
//               </NoChangesMessage>
//             )}

//             {/* Status progression explanation */}
//             <StatusHelp>
//               <strong>Workflow:</strong> Pending → Confirmed → Payment Pending →
//               Completed
//             </StatusHelp>
//           </Section>

//           <ButtonGroup>
//             <CancelButton type="button" onClick={onClose}>
//               Cancel
//             </CancelButton>
//             <SubmitButton
//               type="submit"
//               disabled={
//                 selectedStatus === booking.status ||
//                 availableStatuses.length === 0
//               }
//             >
//               Update Status
//             </SubmitButton>
//           </ButtonGroup>
//         </Form>
//       </ModalContent>
//     </ModalOverlay>
//   );
// };

// export default StatusUpdateModal;

// // Styled Components
// const ModalOverlay = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background: rgba(0, 0, 0, 0.5);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   z-index: 1000;
// `;

// const ModalContent = styled.div`
//   background: white;
//   border-radius: 12px;
//   padding: 2rem;
//   width: 90%;
//   max-width: 500px;
// `;

// const ModalHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 1.5rem;

//   h2 {
//     margin: 0;
//     color: #1e293b;
//   }
// `;

// const CloseButton = styled.button`
//   background: none;
//   border: none;
//   font-size: 2rem;
//   cursor: pointer;
//   color: #6b7280;
// `;

// const Form = styled.form`
//   display: flex;
//   flex-direction: column;
//   gap: 1.5rem;
// `;

// const BookingInfo = styled.div`
//   background: #f8fafc;
//   padding: 1rem;
//   border-radius: 8px;

//   h3 {
//     margin: 0 0 0.5rem 0;
//     font-size: 1.1rem;
//   }

//   p {
//     margin: 0.25rem 0;
//     color: #4b5563;
//   }
// `;

// const CurrentStatus = styled.p`
//   color: ${(props) => props.color};
//   font-weight: 600;
//   margin: 0.5rem 0 0 0 !important;
//   padding: 0.25rem 0.5rem;
//   background: ${(props) => props.color}15;
//   border-radius: 4px;
//   display: inline-block;
// `;

// const Section = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 0.5rem;
// `;

// const StatusSelect = styled.select`
//   padding: 0.75rem;
//   border: 1px solid #d1d5db;
//   border-radius: 8px;
//   font-size: 1rem;

//   &:focus {
//     outline: none;
//     border-color: #3b82f6;
//   }
// `;

// const NoChangesMessage = styled.p`
//   color: #6b7280;
//   font-style: italic;
//   margin: 0.5rem 0 0 0;
// `;

// const StatusHelp = styled.p`
//   font-size: 0.875rem;
//   color: #6b7280;
//   margin: 0.5rem 0 0 0;
// `;

// const ButtonGroup = styled.div`
//   display: flex;
//   gap: 1rem;
//   justify-content: flex-end;
// `;

// const CancelButton = styled.button`
//   padding: 0.75rem 1.5rem;
//   border: 1px solid #d1d5db;
//   border-radius: 8px;
//   background: white;
//   color: #374151;
//   cursor: pointer;
//   font-weight: 600;

//   &:hover {
//     background: #f9fafb;
//   }
// `;

// const SubmitButton = styled.button`
//   padding: 0.75rem 1.5rem;
//   border: none;
//   border-radius: 8px;
//   background: #3b82f6;
//   color: white;
//   cursor: pointer;
//   font-weight: 600;

//   &:hover:not(:disabled) {
//     background: #2563eb;
//   }

//   &:disabled {
//     background: #9ca3af;
//     cursor: not-allowed;
//   }
// `;
