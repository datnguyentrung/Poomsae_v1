import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";
import type { SparringHistory } from "@/types/Tournament/Sparring";

export const getAllSparringHistories = async () => {
    try {
        const response = await axiosInstance.get(endpoints.sparringHistory.list);
        // console.log('Fetched Sparring histories:', response.data.data);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching Sparring histories:", error);
        throw error;
    }
};

export const createSparringHistory = async (idSparringList: string[]) => {
    try {
        const response = await axiosInstance.post(endpoints.sparringHistory.create, idSparringList);
        console.log('Created Sparring history:', response.data.data);
        return response.data.data;
    } catch (error) {
        console.error("Error creating Sparring history:", error);
        throw error;
    }
};

export const getSparringHistoriesByCombination = async (idSparringCombination: string) => {
    try {
        const response = await axiosInstance.get(endpoints.sparringHistory.sparringCombination(idSparringCombination));
        console.log(`Fetched Sparring histories for combination ${idSparringCombination}:`, response.data.data);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching Sparring histories for combination ${idSparringCombination}:`, error);
        throw error;
    }
};

export const createSparringWinner = async (participants: number, SparringHistoryDTO: SparringHistory) => {
    try {
        const response = await axiosInstance.post(
            endpoints.sparringHistory.winner,
            SparringHistoryDTO,
            { params: { participants } }
        );
        console.log('Created Sparring winner:', response.data);
        return response.data.data;
    } catch (error) {
        console.error("Error creating Sparring winner:", error);
        throw error;
    }
};

export const deleteSparringHistory = async (idSparringHistory: string, participants: number) => {
    try {
        const response = await axiosInstance.delete(
            endpoints.sparringHistory.delete,
            {
                params: { idSparringHistory, participants } // ✅ dùng params, không dùng data
            }
        );
        console.log('Deleted Sparring history:', response.data);
        return response.data;
    } catch (error) {
        console.error("Error deleting Sparring history:", error);
        throw error;
    }
};

export const getSparringHistoryByIdTournament = async (idTournament: string) => {
    try {
        const response = await axiosInstance.get(endpoints.sparringHistory.tournament(idTournament));
        return response.data.data;
    } catch (error) {
        console.error("Error fetching Sparring history by tournament ID:", error);
        throw error;
    }
};
