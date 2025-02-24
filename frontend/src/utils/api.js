import axios from "axios";

// Base API instance
const API = axios.create({
    baseURL: "http://localhost:5000/api",
});

// User Authentication API Calls
export const loginUser = (email, password) => API.post("/users/login", { email, password });
export const registerUser = (name, email, password) => API.post("/users/register", { name, email, password });

// Future API calls can be added here...