// // src/components/BookingUpdateModal.jsx
// import React, { useState } from "react";
// import styled from "styled-components";
// // import { useVerifyDocuments } from "../../hooks/useBooking";

// const BookingUpdateModal = ({ booking, onClose }) => {
//   const [formData, setFormData] = useState({
//     status: booking.status,
//     insuranceVerified: booking.insurance?.verified || false,
//     driverLicenseVerified: booking.driverLicense?.verified || false,
//   });

//   // const { mutate: verifyDocuments } = useVerifyDocuments(booking._id);
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = () => {
//     // console.log("Submitting updated booking data:", formData);
//     // verifyDocuments(formData);
//     // onClose();
//   };

//   return (
//     <ModalOverlay>
//       <ModalContainer>
//         <h2>Update Booking</h2>

//         <Field>
//           <label>Status</label>
//           <select name="status" value={formData.status} onChange={handleChange}>
//             <option value="pending">Pending</option>
//             <option value="confirmed">Confirmed</option>
//             <option value="cancelled">Cancelled</option>
//             <option value="payment_pending">Payment Pending</option>
//             <option value="completed">Completed</option>
//           </select>
//         </Field>

//         <Field>
//           <label>
//             <input
//               type="checkbox"
//               name="insuranceVerified"
//               checked={formData.insuranceVerified}
//               onChange={handleChange}
//             />
//             Insurance Verified
//           </label>
//         </Field>

//         <Field>
//           <label>
//             <input
//               type="checkbox"
//               name="driverLicenseVerified"
//               checked={formData.driverLicenseVerified}
//               onChange={handleChange}
//             />
//             Driver License Verified
//           </label>
//         </Field>

//         <ButtonRow>
//           <Button onClick={onClose}>Cancel</Button>
//           <Button variant="primary" onClick={handleSubmit}>
//             Save
//           </Button>
//         </ButtonRow>
//       </ModalContainer>
//     </ModalOverlay>
//   );
// };

// export default BookingUpdateModal;

// const ModalOverlay = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background: rgba(0, 0, 0, 0.5);
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

// const ModalContainer = styled.div`
//   background: ${({ theme }) => theme.colors.background};
//   color: ${({ theme }) => theme.colors.text};
//   padding: 2rem;
//   border-radius: ${({ theme }) => theme.radius.md};
//   width: 500px;
//   max-width: 95%;
// `;

// const Field = styled.div`
//   margin-bottom: 1rem;
//   label {
//     display: block;
//     font-weight: 600;
//     margin-bottom: 0.4rem;
//   }
//   input,
//   select {
//     width: 100%;
//     padding: 0.6rem;
//     border: 1px solid ${({ theme }) => theme.colors.border};
//     border-radius: ${({ theme }) => theme.radius.sm};
//     background: ${({ theme }) => theme.colors.input};
//     color: ${({ theme }) => theme.colors.text};
//   }
// `;

// const ButtonRow = styled.div`
//   display: flex;
//   justify-content: flex-end;
//   gap: 1rem;
//   margin-top: 1.5rem;
// `;

// const Button = styled.button`
//   padding: 0.6rem 1.2rem;
//   border: none;
//   border-radius: ${({ theme }) => theme.radius.sm};
//   background: ${({ theme, variant }) =>
//     variant === "primary" ? theme.colors.primary : theme.colors.secondary};
//   color: #fff;
//   font-weight: 600;
//   cursor: pointer;

//   &:hover {
//     opacity: 0.9;
//   }
// `;
