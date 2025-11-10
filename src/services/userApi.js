import api from "./api";

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
}
}
export default userApi;
