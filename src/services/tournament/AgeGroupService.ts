import type { AgeGroupDTO, AgeGroup } from "@/types/Tournament/Tournament";
import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";

export const getAllAgeGroups = async (): Promise<AgeGroup[]> => {
    try {
        const response = await axiosInstance.get(endpoints.ageGroup.list);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching age groups:", error);
        throw error;
    }
};

export const createAgeGroup = async (ageGroup: AgeGroupDTO): Promise<AgeGroup> => {
    try {
        const response = await axiosInstance.post(endpoints.ageGroup.create, ageGroup);
        return response.data.data;
    } catch (error) {
        console.error("Error creating age group:", error);
        throw error;
    }
};

export const updateAgeGroup = async (ageGroup: AgeGroup): Promise<AgeGroup> => {
    try {
        const response = await axiosInstance.put(endpoints.ageGroup.update, ageGroup);
        return response.data.data;
    } catch (error) {
        console.error("Error updating age group:", error);
        throw error;
    }
};

export const deleteAgeGroup = async (id: number): Promise<void> => {
    try {
        await axiosInstance.delete(endpoints.ageGroup.delete(id));
    } catch (error) {
        console.error("Error deleting age group:", error);
        throw error;
    }
};

export const getAgeGroupById = async (id: number): Promise<AgeGroup> => {
    try {
        const response = await axiosInstance.get(endpoints.ageGroup.detail(id));
        return response.data.data;
    } catch (error) {
        console.error("Error fetching age group by ID:", error);
        throw error;
    }
};
