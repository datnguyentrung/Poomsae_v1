import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";
import type { PoomsaeHistory } from "@/types/Tournament/Poomsae";
import { toast } from "react-toastify";

export const getAllPoomsaeHistories = async () => {
    try {
        const response = await axiosInstance.get(endpoints.poomsaeHistory.list);
        // console.log('Fetched poomsae histories:', response.data.data);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching poomsae histories:", error);
        throw error;
    }
};

export const createPoomsaeHistory = async (idPoomsaeList: string[]) => {
    try {
        const response = await axiosInstance.post(endpoints.poomsaeHistory.create, idPoomsaeList);
        console.log('Created poomsae history:', response.data.data);
        toast.success("Thêm danh sách vận động viên thành công!");
        return response.data.data;
    } catch (error) {
        console.error("Error creating poomsae history:", error);
        toast.error("Thêm danh sách vận động viên thất bại!");
        throw error;
    }
};

export const getPoomsaeHistoriesByCombination = async (idPoomsaeCombination: string) => {
    try {
        const response = await axiosInstance.get(endpoints.poomsaeHistory.poomsaeCombination(idPoomsaeCombination));
        console.log(`Fetched poomsae histories for combination ${idPoomsaeCombination}:`, response.data.data);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching poomsae histories for combination ${idPoomsaeCombination}:`, error);
        throw error;
    }
};

export const createPoomsaeWinner = async (participants: number, poomsaeHistoryDTO: PoomsaeHistory) => {
    try {
        const response = await axiosInstance.post(
            endpoints.poomsaeHistory.winner,
            poomsaeHistoryDTO,
            { params: { participants } }
        );
        console.log('Created poomsae winner:', response.data);
        return response.data.data;
    } catch (error) {
        console.error("Error creating poomsae winner:", error);
        throw error;
    }
};

export const deletePoomsaeHistory = async (idPoomsaeHistory: string, participants: number) => {
    try {
        const response = await axiosInstance.delete(
            endpoints.poomsaeHistory.delete,
            {
                params: { idPoomsaeHistory, participants } // ✅ dùng params, không dùng data
            }
        );
        console.log('Deleted poomsae history:', response.data);
        return response.data;
    } catch (error) {
        console.error("Error deleting poomsae history:", error);
        throw error;
    }
};

export const deletePoomsaeHistoryByCombination = async (idPoomsaeCombination: string) => {
    try {
        const response = await axiosInstance.delete(
            endpoints.poomsaeHistory.delete,
            {
                params: { idPoomsaeCombination } // ✅ dùng params, không dùng data
            }
        );
        console.log('Deleted poomsae history by combination:', response.data);
        return response.data;
    } catch (error) {
        console.error("Error deleting poomsae history by combination:", error);
        throw error;
    }
};

export const getPoomsaeHistoryByIdTournament = async (idTournament: string) => {
    try {
        const response = await axiosInstance.get(endpoints.poomsaeHistory.tournament(idTournament));
        return response.data.data;
    } catch (error) {
        console.error("Error fetching poomsae history by tournament ID:", error);
        throw error;
    }
};
