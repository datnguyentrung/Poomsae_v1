export interface KeyInfo {
    tournament: string;
    idCombination: string;
    targetNode: number;
    participants: number;
    firstNode: boolean;
}

export interface MatchInfo {
    tournamentType: 'POOMSAE' | 'SPARRING';
    duration: number;
    session: 'AM' | 'PM';
}

export interface RelationInfo {
    leftMatch: KeyInfo | null;
    rightMatch: KeyInfo | null;
}

export interface TournamentMatchDTO {
    keyInfo: KeyInfo;
    matchInfo: MatchInfo;
    relationInfo: RelationInfo;
}