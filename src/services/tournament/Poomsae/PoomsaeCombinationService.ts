import type { PoomsaeCombination } from "@/types/Tournament/Poomsae";
import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";

export const getAllPoomsaeCombinations = async (): Promise<PoomsaeCombination[]> => {
    try {
        const response = await axiosInstance.get(endpoints.poomsaeCombination.list);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching poomsae combinations:", error);
        throw error;
    }
};

export const changePoomsaeCombinationActiveStatus = async (idPoomsaeCombination: string, isActive: boolean) => {
    try {
        const response = await axiosInstance.post(endpoints.poomsaeCombination.changeActive, {
            params: { idPoomsaeCombination, isActive }
        });
        return response.data.data;
    } catch (error) {
        console.error("Error changing poomsae combination active status:", error);
        throw error;
    }
};
