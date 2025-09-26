import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";

export const getAuthToken = () => {
  const token = Cookies.get("token");
  console.log("token", token);
  console.log("Raw token from cookies:", token);

  if (!token) return null;

  try {
    // const decoded = jwtDecode(token);
    // console.log("Decoded token:", decoded);
    // return { token, role: decoded.role };
  } catch (err) {
    console.error("Error decoding token:", err.message);
    return null;
  }
};
