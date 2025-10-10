import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";

export const getBracketNodesByParticipants = async (participants: number) => {
    try {
        const response = await axiosInstance.get(endpoints.bracketNode.nodesByParticipants(participants));
        return response.data.data;
    } catch (error) {
        console.error("Error fetching bracket nodes by participants:", error);
        throw error;
    }
};

export const createBracketNodeByParticipants = async (participants: number) => {
    try {
        const response = await axiosInstance.post(endpoints.bracketNode.createByParticipants, participants);
        return response.data.data;
    } catch (error) {
        console.error("Error creating bracket node by participants:", error);
        throw error;
    }
};
