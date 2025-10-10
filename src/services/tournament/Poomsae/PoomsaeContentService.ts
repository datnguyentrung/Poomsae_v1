import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";
import type { PoomsaeContent } from "@/types/Tournament/Poomsae";

export const getAllPoomsaeContents = async () => {
    try {
        const response = await axiosInstance.get(endpoints.poomsaeContent.list);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching poomsae contents:", error);
        throw error;
    }
};

export const createPoomsaeContent = async (contentName: string) => {
    try {
        const response = await axiosInstance.post(endpoints.poomsaeContent.create, null, {
            params: { contentName }
        });
        return response.data.data;
    } catch (error) {
        console.error("Error creating poomsae content:", error);
        throw error;
    }
};

export const updatePoomsaeContent = async (poomsaeContent: PoomsaeContent) => {
    try {
        const response = await axiosInstance.put(endpoints.poomsaeContent.update, poomsaeContent);
        return response.data.data;
    } catch (error) {
        console.error("Error updating poomsae content:", error);
        throw error;
    }
};

export const deletePoomsaeContent = async (id: number) => {
    try {
        const response = await axiosInstance.delete(endpoints.poomsaeContent.delete(id));
        return response.data.data;
    } catch (error) {
        console.error("Error deleting poomsae content:", error);
        throw error;
    }
};