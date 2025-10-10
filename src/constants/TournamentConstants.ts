export const PoomsaeContentMap = {
    MALE_INDIVIDUAL: 'Cá Nhân Nam',
    FEMALE_INDIVIDUAL: 'Cá Nhân Nữ',
    PAIR: 'Đôi Nam Nữ',
    MIXED_TEAM: 'Đồng Đội Nam Nữ',
} as const;

export const BeltGroupMap = {
    'Belt Group 1': 'Nhóm đai 1',
    'Belt Group 2': 'Nhóm đai 2',
    'Belt Group 3': 'Nhóm đai 3',
    'Belt Group 4': 'Nhóm đai 4',
} as const;

export const AgeGroupMap = {
    'Age Group 1': 'Lứa tuổi 1',
    'Age Group 2': 'Lứa tuổi 2',
    'Age Group 3': 'Lứa tuổi 3',
    'Age Group 4': 'Lứa tuổi 4',
} as const;

export const GenderMap = {
    'MALE': 'Nam',
    'FEMALE': 'Nữ',
}

export const getDisplayName = (map: object | undefined, key: string) =>
    (map && (map as Record<string, string>)[key]) || key;

export default { PoomsaeContentMap, BeltGroupMap, getDisplayName, AgeGroupMap, GenderMap };
