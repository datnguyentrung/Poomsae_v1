export const saveAccessToken = (token: string) => {
    localStorage.setItem('accessToken', token);
};

export const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};

export const clearToken = () => {
    localStorage.removeItem('accessToken');
};

// Decode JWT token
export const decodeJWT = (token: string) => {
    try {
        if (!token) return null;

        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid token format');
        }

        const payload = parts[1];
        const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
        const decoded = JSON.parse(atob(paddedPayload));

        return decoded;
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
};

// Lấy thông tin user từ token
export const getCurrentUser = () => {
    const token = getAccessToken();
    if (!token) return null;

    const decoded = decodeJWT(token);
    return decoded ? decoded.user : null;
};

// Lấy role từ token
export const getCurrentUserRole = () => {
    const token = getAccessToken();
    if (!token) return null;

    const decoded = decodeJWT(token);
    return decoded ? decoded.role : null;
};

// Kiểm tra token còn hạn không
export const isTokenExpired = () => {
    const token = getAccessToken();
    if (!token) return true;

    const decoded = decodeJWT(token);
    if (!decoded) return true;

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
};
