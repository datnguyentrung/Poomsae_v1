import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";

export const getAllPoomsaeHistories = async () => {
    try {
        const response = await axiosInstance.get(endpoints.poomsaeHistory.list);
        console.log('Fetched poomsae histories:', response.data.data);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching poomsae histories:", error);
        throw error;
    }
};
