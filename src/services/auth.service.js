import apiClient from "@/lib/axios";

export const loginUser = async (username, password) => {
  const response = await apiClient.post("/auth/login", {
    username,
    password,
  });

  return response.data;
};