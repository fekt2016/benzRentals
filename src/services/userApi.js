import api from "./api";

const userApi = {
  getUsers: async () => {
    const response = await api.get("/users");
    return response;
  },
};

export default userApi;
