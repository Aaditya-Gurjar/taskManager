import axios from "axios";
import { BASE_URL } from "../../../config";

export const loginUser = async (data) => {
  try {
    const response = await axios.post(
      `${BASE_URL}user/login`,
      data,
      {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true // 👈 optional: for cookies/session-based auth
      }
    );

    return response.data; // ✅ axios already parses JSON
  } catch (error) {
    console.error("Error logging in:", error.response?.data || error.message);
    throw error;
  }
};


export const logoutUser = async (data) => {
  try {
    const response = await axios.get(
      `${BASE_URL}user/logout`,

      {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true // 👈 optional: for cookies/session-based auth
      }
    );

    return response?.data; // ✅ axios already parses JSON
  } catch (error) {
    console.error("Error logging in:", error.response?.data || error.message);
    throw error;
  }
};




