const API_PREFIX = "/api/v1";

export const endpoints = {
    auth: {
        login: `${API_PREFIX}/auth/login`,
        register: `${API_PREFIX}/auth/register`,
        refreshToken: `${API_PREFIX}/auth/refresh`,
    },
    user: {
        list: `${API_PREFIX}/users/`,  // ✅ Thêm trailing slash
        update: `${API_PREFIX}/users/update`,
        me: `${API_PREFIX}/users/me`,
    },
    bracketNode: {
        nodesByParticipants: (participants: number) => `${API_PREFIX}/bracket-node/participants/${participants}`,
    },
    poomsaeHistory: {
        list: `${API_PREFIX}/poomsae-histories`,  // ✅ Thêm trailing slash
    }
};