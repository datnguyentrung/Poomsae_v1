import type { SparringCombination } from "@/types/Tournament/Sparring";
import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";

export const getAllSparringCombinations = async (): Promise<SparringCombination[]> => {
    try {
        const response = await axiosInstance.get(endpoints.sparringCombination.list);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching sparring combinations:", error);
        throw error;
    }
};
