import type { AgeGroup, CompetitorDTO } from "./Tournament";
import type { NodeInfo, ReferenceInfo } from "@/types/types";

export interface SparringContent {
    idSparringContent: number;
    weightClass: string;
    isActive: boolean;
}

export interface SparringCombination {
    idSparringCombination: string;
    sparringContent: SparringContent;
    ageGroup: AgeGroup;
    gender: string;
    active: boolean;
}

export interface SparringList {
    idSparringList: string;
    competitor: CompetitorDTO;
}

export interface SparringHistory {
    idSparringHistory: string;
    nodeInfo: NodeInfo;
    referenceInfo: ReferenceInfo;
    hasWon?: boolean;
}