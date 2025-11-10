import api from "../../services/apiClient";

const userApi = {
  getUsers: async () => {
    const response = await api.get("/users");
    return response;
  },
  createUser: async (payload)=>{
    const response = await api.post('/users',payload);
    return response;
},
getUserById : async (id)=>{
  const response = await api.get(`/users/${id}`)
  return response;
},
toggleRole: async () => {
  const response = await api.patch('/users/toggle-role');
  return response.data; // Return response.data to match backend structure
},
// Settings endpoints
getSettings: async () => {
  const response = await api.get("/users/settings");
  return response.data;
},
updateSettings: async (settings) => {
  const response = await api.patch("/users/settings", settings);
  return response.data;
},
deleteAccount: async () => {
  const response = await api.delete("/users/account");
  return response.data;
},
// Favorites/Wishlist endpoints
getFavorites: async () => {
  const response = await api.get("/users/favorites");
  return response.data;
},
toggleFavorite: async (carId) => {
  const response = await api.post(`/users/favorites/${carId}`);
  return response.data;
},
// Referral endpoints
getReferrals: async () => {
  const response = await api.get("/users/referrals");
  return response.data;
},
redeemReferralReward: async (amount) => {
  const response = await api.post("/users/referrals/redeem", { amount });
  return response.data;
},
}
export default userApi;
