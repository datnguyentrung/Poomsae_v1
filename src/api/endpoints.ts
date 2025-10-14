const API_PREFIX = "/api/v1";

export const endpoints = {
    auth: {
        login: `${API_PREFIX}/auth/login`,
        register: `${API_PREFIX}/auth/register`,
        refreshToken: `${API_PREFIX}/auth/refresh`,
        account: `${API_PREFIX}/auth/account`,
        logout: `${API_PREFIX}/auth/logout`,
    },
    user: {
        list: `${API_PREFIX}/users/`,  // ✅ Thêm trailing slash
        update: `${API_PREFIX}/users/update`,
        me: `${API_PREFIX}/users/me`,
    },
    bracketNode: {
        nodesByParticipants: (participants: number) => `${API_PREFIX}/bracket-node/participants/${participants}`,
        createByParticipants: `${API_PREFIX}/bracket-node/participants`,
    },
    poomsaeList: {
        list: `${API_PREFIX}/poomsae-lists`,  // ✅ Thêm trailing slash
        create: `${API_PREFIX}/poomsae-lists`,
        tournament: (idTournament: string) => `${API_PREFIX}/poomsae-lists/tournament/${idTournament}`,
    },
    poomsaeHistory: {
        list: `${API_PREFIX}/poomsae-histories`,  // ✅ Thêm trailing slash
        create: `${API_PREFIX}/poomsae-histories`,
        poomsaeCombination: (idPoomsaeCombination: string) => `${API_PREFIX}/poomsae-histories/combination/${idPoomsaeCombination}`,
        winner: `${API_PREFIX}/poomsae-histories/winner`,
        delete: `${API_PREFIX}/poomsae-histories`,  // DELETE with body and params
    },
    poomsaeContent: {
        list: `${API_PREFIX}/poomsae-contents`,  // ✅ Thêm trailing slash
        create: `${API_PREFIX}/poomsae-contents`,
        detail: (id: number) => `${API_PREFIX}/poomsae-contents/${id}`,
        update: `${API_PREFIX}/poomsae-contents`,
        delete: (id: number) => `${API_PREFIX}/poomsae-contents/${id}`,
    },
    poomsaeCombination: {
        list: `${API_PREFIX}/poomsae-combinations`,  // ✅ Thêm trailing slash
        changeActive: `${API_PREFIX}/poomsae-combinations/change-active`
    },

    sparringList: {
        list: `${API_PREFIX}/sparring-lists`,  // ✅ Thêm trailing slash
        create: `${API_PREFIX}/sparring-lists`,
        tournament: (idTournament: string) => `${API_PREFIX}/sparring-lists/tournament/${idTournament}`,
    },
    sparringHistory: {
        list: `${API_PREFIX}/sparring-histories`,  // ✅ Thêm trailing slash
        create: `${API_PREFIX}/sparring-histories`,
        sparringCombination: (idSparringCombination: string) => `${API_PREFIX}/sparring-histories/combination/${idSparringCombination}`,
        winner: `${API_PREFIX}/sparring-histories/winner`,
        delete: `${API_PREFIX}/sparring-histories`,  // DELETE with body and params
    },
    sparringContent: {
        list: `${API_PREFIX}/sparring-contents`,  // ✅ Thêm trailing slash
        create: `${API_PREFIX}/sparring-contents`,
        detail: (id: number) => `${API_PREFIX}/sparring-contents/${id}`,
        update: `${API_PREFIX}/sparring-contents`,
        delete: (id: number) => `${API_PREFIX}/sparring-contents/${id}`,
    },
    sparringCombination: {
        list: `${API_PREFIX}/sparring-combinations`,  // ✅ Thêm trailing slash
    },

    ageGroup: {
        list: `${API_PREFIX}/age-groups`,  // ✅ Thêm trailing slash
        create: `${API_PREFIX}/age-groups`,
        update: `${API_PREFIX}/age-groups`,
        detail: (id: number) => `${API_PREFIX}/age-groups/${id}`,
        delete: (id: number) => `${API_PREFIX}/age-groups/${id}`,
    },
    beltGroup: {
        list: `${API_PREFIX}/belt-groups`,  // ✅ Thêm trailing slash
        create: `${API_PREFIX}/belt-groups`,
        update: `${API_PREFIX}/belt-groups`,
        detail: (id: number) => `${API_PREFIX}/belt-groups/${id}`,
        delete: (id: number) => `${API_PREFIX}/belt-groups/${id}`,
    },
    students: {
        list: `${API_PREFIX}/students`,  // ✅ Thêm trailing slash
        detail: (id: string | number) => `${API_PREFIX}/students/${id}`,
        branch: (id: string | number) => `${API_PREFIX}/students/branch/${id}`,
        classSession: (id: string | number) => `${API_PREFIX}/students/class-session/${id}`,
    },
    branch: {
        list: `${API_PREFIX}/branches`,  // ✅ Thêm trailing slash
    },
    classSessions: {
        list: `${API_PREFIX}/class-sessions`,  // ✅ Thêm trailing slash
    }
};