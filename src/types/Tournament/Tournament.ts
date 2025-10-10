import type { Student } from './../training/Student';

export interface AgeGroup {
    idAgeGroup: number;
    ageGroupName: string;
    isActive: boolean;
    ageDivisions: string[]; // U6, U7, ...
}

export interface AgeGroupDTO {
    ageGroupName: string;
    ageDivisions: string[]; // U6, U7, ...
}

export interface BeltGroup {
    idBeltGroup: number;
    beltGroupName: string;
    isActive: boolean;
    beltLevels: string[]; // White, Yellow, ...
}

export interface BeltGroupDTO {
    beltGroupName: string;
    beltLevels: string[]; // White, Yellow, ...
}

export interface CompetitorDTO {
    personalAcademicInfo: Student;
    medal?: string;
    competition: CompetitionDTO
}

export interface CompetitionDTO {
    idTournament?: string;
    idPoomsaeCombination?: string;
    idSparringCombination?: string;
}