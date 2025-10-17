import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";
import type { TournamentMatchDTO } from "@/types/Tournament/TournamentMatch";
import { toast } from "react-toastify";

export const getAllTournamentMatchesByTournamentId = async (tournamentId: string) => {
    try {
        const response = await axiosInstance.get(endpoints.tournamentMatch.tournament(tournamentId));
        return response.data.data;
    } catch (error) {
        console.error("Error fetching tournament matches:", error);
        throw error;
    }
};

export const createTournamentMatch = async (tournamentMatch: TournamentMatchDTO) => {
    try {
        const response = await axiosInstance.post(endpoints.tournamentMatch.create, tournamentMatch);
        return response.data.data;
    } catch (error) {
        console.error("Error creating tournament match:", error);
        throw error;
    }
};

export const updateMatchRelations = async (TournamentMatchDTO: TournamentMatchDTO) => {
    try {
        const response = await axiosInstance.put(endpoints.tournamentMatch.updateRelations, TournamentMatchDTO);
        toast.success("Cập nhật quan hệ trận đấu thành công");
        return response.data.data;
    } catch (error) {
        console.error("Error updating match relations:", error);
        throw error;
    }
};