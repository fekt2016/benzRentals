// import React from "react";
// import styled from "styled-components";
// import {
//   FaEdit,
//   FaTrash,
//   FaUser,
//   FaCar,
//   FaCalendarAlt,
//   FaMapMarkerAlt,
//   FaDollarSign,
// } from "react-icons/fa";

// // Import reusable buttons
// import { GhostButton, SecondaryButton } from "../components/Button";

// const BookingCardList = ({ bookings, onEdit, onDelete }) => {
//   const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

//   const handleDelete = (booking) => {
//     if (
//       window.confirm(
//         `Are you sure you want to delete booking #BF-${booking._id.slice(18)}?`
//       )
//     ) {
//       onDelete(booking._id);
//     }
//   };

//   return (
//     <>
//       {bookings.map((booking) => (
//         <Card key={booking._id}>
//           <CardHeader>
//             <div>
//               <strong>#BF-{booking._id.slice(18)}</strong>
//               <Status status={booking.status}>{booking.status}</Status>
//             </div>
//             <ActionButtons>
//               <EditButton
//                 onClick={() => onEdit(booking)}
//                 $size="sm"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <FaEdit />
//                 Edit
//               </EditButton>
//               <DeleteButton
//                 onClick={() => handleDelete(booking)}
//                 $size="sm"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <FaTrash />
//                 Delete
//               </DeleteButton>
//             </ActionButtons>
//           </CardHeader>

//           <CardRow>
//             <FaUser />
//             <div>
//               <div className="label">Customer</div>
//               <div className="value">{booking.user?.fullName || "N/A"}</div>
//             </div>
//           </CardRow>

//           <CardRow>
//             <FaCar />
//             <div>
//               <div className="label">Vehicle</div>
//               <div className="value">{booking.car?.model || "N/A"}</div>
//             </div>
//           </CardRow>

//           <CardRow>
//             <FaCalendarAlt />
//             <div>
//               <div className="label">Pickup</div>
//               <div className="value">
//                 {formatDate(booking.pickupDate)} at{" "}
//                 {booking.pickupTime || "N/A"}
//               </div>
//             </div>
//           </CardRow>

//           <CardRow>
//             <FaMapMarkerAlt />
//             <div>
//               <div className="label">Location</div>
//               <div className="value">{booking.pickupLocation || "N/A"}</div>
//             </div>
//           </CardRow>

//           <CardRow>
//             <FaDollarSign />
//             <div>
//               <div className="label">Total</div>
//               <div className="value">${booking.totalPrice || "0"}</div>
//             </div>
//           </CardRow>

//           <CardRow>
//             <div className="label">Driver License</div>
//             <Badge verified={booking.driverLicense?.verified}>
//               {booking.driverLicense?.verified ? "Verified" : "Pending"}
//             </Badge>
//           </CardRow>

//           <CardRow>
//             <div className="label">Insurance</div>
//             <Badge verified={booking.insurance?.verified}>
//               {booking.insurance?.verified ? "Verified" : "Pending"}
//             </Badge>
//           </CardRow>
//         </Card>
//       ))}
//     </>
//   );
// };

// export default BookingCardList;

// /* -------------------- STYLES -------------------- */
// const Card = styled.div`
//   background: white;
//   padding: 1.5rem;
//   border-radius: 12px;
//   box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
//   margin-bottom: 1rem;
//   display: none;
//   border: 1px solid #e2e8f0;
//   transition: all 0.3s ease;

//   &:hover {
//     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//     transform: translateY(-2px);
//   }

//   @media (max-width: 1024px) {
//     display: block;
//   }
// `;

// const CardHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: flex-start;
//   margin-bottom: 1rem;
//   flex-wrap: wrap;
//   gap: 1rem;
// `;

// const ActionButtons = styled.div`
//   display: flex;
//   gap: 0.5rem;
//   flex-wrap: wrap;
// `;

// const EditButton = styled(GhostButton)`
//   && {
//     display: flex;
//     align-items: center;
//     gap: 0.5rem;
//     padding: 0.5rem 0.75rem;
//     border-radius: 8px;
//     font-size: 0.875rem;
//     font-weight: 500;
//     border: 1px solid #f59e0b;
//     color: #f59e0b;

//     &:hover {
//       background: #fef3c7;
//       border-color: #d97706;
//       color: #d97706;
//     }
//   }
// `;

// const DeleteButton = styled(SecondaryButton)`
//   && {
//     display: flex;
//     align-items: center;
//     gap: 0.5rem;
//     padding: 0.5rem 0.75rem;
//     border-radius: 8px;
//     font-size: 0.875rem;
//     font-weight: 500;
//     border: 1px solid #ef4444;
//     color: #ef4444;
//     background: transparent;

//     &:hover {
//       background: #fef2f2;
//       border-color: #dc2626;
//       color: #dc2626;
//     }
//   }
// `;

// const CardRow = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 0.75rem;
//   margin-bottom: 0.75rem;
//   padding: 0.5rem 0;

//   .label {
//     font-weight: 600;
//     color: #64748b;
//     font-size: 0.875rem;
//     min-width: 100px;
//   }

//   .value {
//     color: #334155;
//     font-size: 0.9rem;
//     font-weight: 500;
//   }

//   svg {
//     color: #3b82f6;
//     flex-shrink: 0;
//   }
// `;

// const Status = styled.span`
//   padding: 0.25rem 0.75rem;
//   margin-left: 0.5rem;
//   border-radius: 20px;
//   font-size: 0.75rem;
//   font-weight: 600;
//   text-transform: uppercase;

//   ${({ status }) => {
//     switch (status) {
//       case "confirmed":
//         return "background: #d1fae5; color: #065f46;";
//       case "pending":
//         return "background: #fef3c7; color: #92400e;";
//       case "cancelled":
//         return "background: #fee2e2; color: #991b1b;";
//       case "completed":
//         return "background: #e0e7ff; color: #3730a3;";
//       default:
//         return "background: #f3f4f6; color: #374151;";
//     }
//   }}
// `;

// const Badge = styled.span`
//   display: inline-flex;
//   padding: 0.25rem 0.75rem;
//   background: ${({ verified }) => (verified ? "#d1fae5" : "#fef3c7")};
//   color: ${({ verified }) => (verified ? "#065f46" : "#92400e")};
//   border-radius: 12px;
//   font-size: 0.75rem;
//   font-weight: 600;
//   text-transform: uppercase;
// `;
