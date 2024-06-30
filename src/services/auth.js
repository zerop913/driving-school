import { jwtDecode } from "jwt-decode";
import api from "./api";

export const login = async (username, password) => {
  const response = await api.post("/login", { username, password });
  localStorage.setItem("token", response.data.token);
  localStorage.setItem("role", response.data.role);
  localStorage.setItem("fullName", response.data.fullName);
  return response.data;
};

export const register = async (username, password, fullName, role) => {
  const response = await api.post("/register", {
    username,
    password,
    fullName,
    role,
  });
  return response.data;
};

export const getRole = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = jwtDecode(token);
    return decoded.role;
  }
  return null;
};

export const getFullName = () => {
  const fullName = localStorage.getItem("fullName");
  return fullName;
};
