import type { CompetitorDTO } from "@/types/Tournament/Tournament";
import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";

export const getAllPoomsaeLists = async (): Promise<CompetitorDTO[]> => {
    try {
        const response = await axiosInstance.get(endpoints.poomsaeList.list);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching poomsae lists:", error);
        throw error;
    }
};

export const createPoomsaeLists = async (poomsaeLists: CompetitorDTO[]): Promise<CompetitorDTO[]> => {
    try {
        const response = await axiosInstance.post(endpoints.poomsaeList.create, poomsaeLists);
        return response.data.data;
    } catch (error) {
        console.error("Error creating poomsae list:", error);
        throw error;
    }
};

export const getPoomsaeListsByTournament = async (idTournament: string) => {
    try {
        const response = await axiosInstance.get(endpoints.poomsaeList.tournament(idTournament));
        return response.data.data;
    } catch (error) {
        console.error("Error filtering poomsae lists:", error);
        throw error;
    }
};
