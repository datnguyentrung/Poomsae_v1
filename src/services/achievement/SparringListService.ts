import type { CompetitorDTO } from "@/types/Tournament/Tournament";
import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";

export const getAllSparringLists = async (): Promise<CompetitorDTO[]> => {
    try {
        const response = await axiosInstance.get(endpoints.sparringList.list);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching sparring lists:", error);
        throw error;
    }
};

export const createSparringLists = async (sparringLists: CompetitorDTO[]): Promise<CompetitorDTO[]> => {
    try {
        const response = await axiosInstance.post(endpoints.sparringList.create, sparringLists);
        return response.data.data;
    } catch (error) {
        console.error("Error creating sparring list:", error);
        throw error;
    }
};

export const getSparringListsByTournament = async (idTournament: string) => {
    try {
        const response = await axiosInstance.get(endpoints.sparringList.tournament(idTournament));
        return response.data.data;
    } catch (error) {
        console.error("Error filtering sparring lists:", error);
        throw error;
    }
};