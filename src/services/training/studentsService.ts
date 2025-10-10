import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";

export const getAllStudents = async () => {
    // Debug logging
    // console.log('🔧 Debug Info:', {
    //     baseURL: axiosInstance.defaults.baseURL,
    //     endpoint: endpoints.students.list,
    //     fullURL: `${axiosInstance.defaults.baseURL}${endpoints.students.list}`
    // });

    try {
        const response = await axiosInstance.get(endpoints.students.list);
        // console.log("Student List Response:", response.data);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching student list:", error);
        throw error;
    }
};

export const getStudentDetail = async (id: string | number) => {
    // console.log('🔧 Debug Info:', {
    //     baseURL: axiosInstance.defaults.baseURL,
    //     endpoint: endpoints.students.detail(id),
    //     fullURL: `${axiosInstance.defaults.baseURL}${endpoints.students.detail(id)}`
    // });

    try {
        const response = await axiosInstance.get(endpoints.students.detail(id));
        return response.data;
    } catch (error) {
        console.error("Error fetching student detail:", error);
        throw error;
    }
};

export const getStudentByBranch = async (id: number | string) => {
    // console.log('🔧 Debug Info:', {
    //     baseURL: axiosInstance.defaults.baseURL,
    //     endpoint: endpoints.students.branch(id),
    //     fullURL: `${axiosInstance.defaults.baseURL}${endpoints.students.branch(id)}`
    // });

    try {
        const response = await axiosInstance.get(endpoints.students.branch(id));
        // console.log("Students by Branch Response:", response.data);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching students by branch:", error);
        throw error;
    }
};

export const getStudentByClassSession = async (id: number | string) => {
    // console.log('🔧 Debug Info:', {
    //     baseURL: axiosInstance.defaults.baseURL,
    //     endpoint: endpoints.students.classSession(id),
    //     fullURL: `${axiosInstance.defaults.baseURL}${endpoints.students.classSession(id)}`
    // });

    try {
        const response = await axiosInstance.get(endpoints.students.classSession(id));
        // console.log("Students by Class Session Response:", response.data);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching students by class session:", error);
        throw error;
    }
};
