import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Debug environment
const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.100.4:8000';
console.log('🔧 API_URL:', API_URL);

// Tạo axios instance với config cơ bản
const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor - thêm token tự động
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Thêm accessToken tự động nếu có
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor - xử lý response và lỗi
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    async (error) => {
        const { response, config } = error;

        console.error(`❌ API Error: ${response?.status} ${config?.url}`, {
            status: response?.data.status,
            data: response?.data.data,
            message: response?.data.message,
        });

        // Xử lý các lỗi phổ biến
        switch (response?.status) {
            case 401:
                // Token expired - redirect to login
                console.log('🔒 Unauthorized - Token expired');
                localStorage.removeItem('access_token');
                // window.location.href = '/login';
                break;
            case 403:
                console.log('🚫 Forbidden - Insufficient permissions');
                break;
            case 404:
                console.log('🔍 Not Found');
                break;
            case 500:
                console.log('🔥 Server Error');
                break;
            default:
                console.log('🌐 Network or Unknown Error');
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
