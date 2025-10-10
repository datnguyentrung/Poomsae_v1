import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";

export const getAllBranches = async () => {
    // Debug logging
    // console.log('🔧 Debug Info:', {
    //     baseURL: axiosInstance.defaults.baseURL,
    //     endpoint: endpoints.branch.list,
    //     fullURL: `${axiosInstance.defaults.baseURL}${endpoints.branch.list}`
    // });

    try {
        const response = await axiosInstance.get(endpoints.branch.list);
        // console.log("Branch List Response:", response.data);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching branch list:", error);
        throw error;
    }
};