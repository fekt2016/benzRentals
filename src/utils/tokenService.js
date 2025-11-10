
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const getAuthToken = () => {

  const token = Cookies.get("token");
   if (!token || typeof token !== "string") {
      return { token: null, role: null };
    }
   const decoded = jwtDecode(token);
   const role = decoded.role || null


  

  return { token, role };
};
