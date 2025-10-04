import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";

export const getBracketNodesByParticipants = async (participants: number) => {
    try {
        const response = await axiosInstance.get(endpoints.bracketNode.nodesByParticipants(participants));
        // console.log('Fetched bracket nodes:', response.data);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching bracket nodes by participants:", error);
        throw error;
    }
};
