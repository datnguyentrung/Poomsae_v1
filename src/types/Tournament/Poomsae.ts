import type { AgeGroup, BeltGroup, CompetitorDTO } from "./Tournament";
import type { NodeInfo, ReferenceInfo } from "@/types/types";

export interface PoomsaeContent {
    idPoomsaeContent: number;
    contentName: string;
    isActive: boolean;
}

export interface PoomsaeCombination {
    idPoomsaeCombination: string;
    poomsaeContent: PoomsaeContent;
    ageGroup: AgeGroup;
    beltGroup: BeltGroup;
    isActive: boolean;
}

export interface PoomsaeList {
    idPoomsaeList: string;
    competitor: CompetitorDTO;
}

export interface PoomsaeHistory {
    idPoomsaeHistory: string;
    nodeInfo: NodeInfo;
    referenceInfo: ReferenceInfo;
    hasWon?: boolean;
}