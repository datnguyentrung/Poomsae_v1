export interface PersonalInfo {
    name: string;
    idAccount: string;
    idNational: string;
    birthDate: Date;
    isActive: boolean;
}

export interface AcademicInfo {
    idBranch: number;
    beltLevel: string;
    classSessions: string[];
}

export interface Student {
    personalInfo: PersonalInfo;
    academicInfo: AcademicInfo;
}