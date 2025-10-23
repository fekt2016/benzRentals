import emailjs from "@emailjs/browser";

export const sendOtpEmail = async (email, name, otp) => {
  try {
    const templateParams = {
      email,
      name, // optional if you want personalization
      otp, // the OTP generated in your backend or frontend
    };
 
    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_ONE_TIME_PASSWORD,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );

    console.log("✅ SUCCESS!", response.status, response.text);
    return response;
  } catch (error) {
    console.error("❌ FAILED...", error);
    throw error;
  }
};



export const sendBookingConfirmationEmail = async (bookingData, paymentStatus) => {
  try {
console.log(new Date(bookingData?.returnDate),new Date(bookingData?.pickupDate))
     const daysDifference = (new Date(bookingData?.returnDate) - new Date(bookingData?.pickupDate)) / (1000 * 60 * 60 * 24);

    
    const templateParams = {
      // Customer Information
      paymentStatus,
      name: bookingData.user.fullName,
      email: bookingData.user.email,
      phone: bookingData.user.phone,
      
      // Booking Information
      order_id: bookingData._id.slice(-6),
      booking_date: new Date(bookingData.createdAt
).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      pickup_date: new Date(bookingData.pickupDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      return_date: new Date(bookingData.returnDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      rental_days: daysDifference,
      
      // Vehicle Information
      vehicle_model: bookingData.car.model,
      // vehicle_year: bookingData.car.year,
      // vehicle_type: bookingData.car.type,
      vehicle_image: bookingData.car.images[0],
      // vehicle_features: bookingData.car.features?.join(', ') || 'Premium Features Included',
      // license_plate: bookingData.car.licensePlate || 'To be assigned',
      
      // Location Information
      pickup_location: bookingData.pickupLocation,
      return_location: bookingData.returnLocation,
      special_instructions: bookingData.specialInstructions || 'None',
      
      // Pricing Information
      base_rate: bookingData.basePrice,
      // insurance_fee: bookingData.pricing.insuranceFee,
      // delivery_fee: bookingData.pricing.deliveryFee,
      tax_amount: bookingData.taxAmount,
      total_amount: bookingData.totalPrice,
      security_deposit: 200,
      
      // Concierge Information
      // concierge_name: bookingData.concierge?.name || 'Your Personal Concierge',
      // concierge_phone: bookingData.concierge?.phone || '1-800-BENZFLEX',
      // concierge_email: bookingData.concierge?.email || 'concierge@benzflex.com',
      
      // Additional Details
      booking_status: 'Confirmed',
      confirmation_time: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    console.log("📧 Sending booking confirmation:", templateParams);

    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_BOOKING_CONFIRM,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );

    console.log("✅ Booking confirmation sent successfully!", response.status, response.text);
    return response;
  } catch (error) {
    console.error("❌ Failed to send booking confirmation:", error);
    throw error;
  }
};

export const sendPaymentSuccessEmail = async (paymentData) => {
  try {
    // Calculate rental days
    const daysDifference = Math.ceil(
      (new Date(paymentData.booking.returnDate) - new Date(paymentData.booking.pickupDate)) / (1000 * 60 * 60 * 24)
    );

    const templateParams = {
      // Customer Information
      customer_name: paymentData.booking.user.fullName,
      customer_email: paymentData.booking.user.email,
      customer_phone: paymentData.booking.user.phone,
      
      // Payment Information
      payment_id: paymentData.paymentId || paymentData._id?.slice(-8) || 'N/A',
      payment_date: new Date(paymentData.paidAt || paymentData.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      payment_method: paymentData.paymentMethod || 'Credit Card',
      payment_status: paymentData.status || 'Completed',
      transaction_id: paymentData.transactionId || 'N/A',
      
      // Booking Information
      booking_id: paymentData.booking._id.slice(-6),
      booking_date: new Date(paymentData.booking.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      pickup_date: new Date(paymentData.booking.pickupDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      return_date: new Date(paymentData.booking.returnDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      rental_days: daysDifference,
      
      // Vehicle Information
      vehicle_model: paymentData.booking.car.model,
      vehicle_image: paymentData.booking.car.images[0],
      vehicle_category: paymentData.booking.car.category || 'Luxury Vehicle',
      
      // Location Information
      pickup_location: paymentData.booking.pickupLocation,
      return_location: paymentData.booking.returnLocation,
      
      // Payment Breakdown
      base_rate: paymentData.booking.basePrice,
      tax_amount: paymentData.booking.taxAmount,
      total_amount: paymentData.amount || paymentData.booking.totalPrice,
      security_deposit: paymentData.securityDeposit || 200,
      amount_paid: paymentData.amount || paymentData.booking.totalPrice,
      
      // Additional Services
      insurance_type: paymentData.insurance?.type || 'Premium Coverage Included',
      additional_services: paymentData.additionalServices?.join(', ') || 'Standard Package',
      
      // Next Steps
      next_steps: `
        • Your vehicle is being prepared for delivery
        • Concierge will contact you within 2 hours
        • Please have your driver's license ready
        • Review rental agreement terms
      `,
      
      // Support Information
      support_phone: '+1 (800) BENZFLEX',
      support_email: 'support@benzflex.com',
      concierge_contact: 'Your personal concierge will contact you shortly',
      
      // Timestamps
      confirmation_time: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    console.log("💰 Sending payment success email:", templateParams);

    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_PAYMENT_SUCCESS_TEMPLATE_ID, // You'll need to create this template in EmailJS
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );

    console.log("✅ Payment success email sent successfully!", response.status, response.text);
    return response;
  } catch (error) {
    console.error("❌ Failed to send payment success email:", error);
    throw error;
  }
};

// Helper function to format currency
// const formatCurrency = (amount) => {
//   return new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'USD'
//   }).format(amount);
// };

// Example usage with sample data
// 