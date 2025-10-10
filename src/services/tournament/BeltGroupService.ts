import type { BeltGroup, BeltGroupDTO } from "@/types/Tournament/Tournament";
import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";

export const getAllBeltGroups = async (): Promise<BeltGroup[]> => {
    try {
        const response = await axiosInstance.get(endpoints.beltGroup.list);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching belt groups:", error);
        throw error;
    }
};

export const createBeltGroup = async (beltGroup: BeltGroupDTO): Promise<BeltGroup> => {
    try {
        const response = await axiosInstance.post(endpoints.beltGroup.create, beltGroup);
        return response.data.data;
    } catch (error) {
        console.error("Error creating belt group:", error);
        throw error;
    }
};

export const updateBeltGroup = async (beltGroup: BeltGroup): Promise<BeltGroup> => {
    try {
        const response = await axiosInstance.put(endpoints.beltGroup.update, beltGroup);
        return response.data.data;
    } catch (error) {
        console.error("Error updating belt group:", error);
        throw error;
    }
};

export const deleteBeltGroup = async (id: number): Promise<void> => {
    try {
        await axiosInstance.delete(endpoints.beltGroup.delete(id));
    } catch (error) {
        console.error("Error deleting belt group:", error);
        throw error;
    }
};