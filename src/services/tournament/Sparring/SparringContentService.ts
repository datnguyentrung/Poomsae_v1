import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";
import type { SparringContent } from "@/types/Tournament/Sparring";

export const getAllSparringContents = async () => {
    try {
        const response = await axiosInstance.get(endpoints.sparringContent.list);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching Sparring contents:", error);
        throw error;
    }
};

export const createSparringContent = async (contentName: string) => {
    try {
        const response = await axiosInstance.post(endpoints.sparringContent.create, null, {
            params: { contentName }
        });
        return response.data.data;
    } catch (error) {
        console.error("Error creating Sparring content:", error);
        throw error;
    }
};

export const updateSparringContent = async (SparringContent: SparringContent) => {
    try {
        const response = await axiosInstance.put(endpoints.sparringContent.update, SparringContent);
        return response.data.data;
    } catch (error) {
        console.error("Error updating Sparring content:", error);
        throw error;
    }
};

export const deleteSparringContent = async (id: number) => {
    try {
        const response = await axiosInstance.delete(endpoints.sparringContent.delete(id));
        return response.data.data;
    } catch (error) {
        console.error("Error deleting Sparring content:", error);
        throw error;
    }
};