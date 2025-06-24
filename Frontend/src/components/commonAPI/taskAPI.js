
import axios from "axios";

import { BASE_URL } from "../../../config";


export const createTask = async (data) => {
    try {
        const response = await axios.post(
            `${BASE_URL}task/createTask`,
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

export const getAllTasks = async (data) => {
    try {
        const response = await axios.post(
            `${BASE_URL}task/getTasks`,
            data,
            {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            }
        );
        return response?.data;

    } catch (error) {
        console.error("err", error)
        throw error
    }
}


export const updateTask = async (id, data) => {
    try {
        const response = await axios.put(
            `${BASE_URL}task/updateTask/${id}`,
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

export const deleteTask = async (id) => {
    try {
        const response = await axios.delete(
            `${BASE_URL}task/deleteTask/${id}`,
            
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