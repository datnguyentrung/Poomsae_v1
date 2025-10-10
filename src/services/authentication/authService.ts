import axiosInstance from "@/api/axiosInstance";
import { endpoints } from "@/api/endpoints";
import type { UserBase } from "@/types/authentication/AuthTypes";

// Đăng nhập → Trả về access_token và backend set cookie refresh_token
export const login = async ({ idAccount, password, idDevice }: UserBase) => {
    const response = await axiosInstance.post(endpoints.auth.login, {
        idAccount,
        password,
        idDevice
    }, {
        withCredentials: true // ⬅️ để backend set refresh_token cookie
    });

    return response.data;
};

// Refresh access_token từ refresh_token trong cookie
export const refreshToken = async () => {
    const response = await axiosInstance.get(endpoints.auth.refreshToken, {
        withCredentials: true // ⬅️ phải có để gửi cookie refresh_token
    });

    return response.data;
};

// Lấy thông tin người dùng từ access_token
export const getAccount = async () => {
    const response = await axiosInstance.get(endpoints.auth.account);
    return response.data;
};

// Logout và xoá cookie refresh_token
export const logout = async () => {
    await axiosInstance.post(endpoints.auth.logout, {}, {
        withCredentials: true // ⬅️ cần gửi để backend biết xoá cookie
    });
};
