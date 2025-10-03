import emailjs from "@emailjs/browser";

export const sendOtpEmail = async (data) => {
  const user = data?.data.user;
  const otp = data?.data.otp;
  console.log(user, otp);
  try {
    const templateParams = {
      email: user.email,
      name: user.name, // optional if you want personalization
      otp: otp, // the OTP generated in your backend or frontend
    };
    console.log("temp", templateParams);
    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
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
