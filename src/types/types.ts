export interface Player {
    id: number;
    name: string;
}

export interface Match {
    id: string;
    player1?: Player;
    player2?: Player;
    winner?: Player;
    round: number;
    matchIndex: number;
}

export interface TournamentBracketProps {
    playerCount: number;
    players: Player[];
    onPlayersChange: (players: Player[]) => void;
}

export interface MatchCardProps {
    player1?: Player;
    player2?: Player;
    onPlayer1Change?: (name: string) => void;
    onPlayer2Change?: (name: string) => void;
    roundIndex: number;
    matchIndex?: number;
    isFirstRound: boolean;
    onAdvanceWinner?: (winner: Player) => void;
}

export interface Node {
    parentNodeId: number;
    childNodeId: number;
    levelNode: number;
    bracketNodes: number[];
    participants: number;
}

export interface NodeInfo {
    sourceNode: number;
    targetNode: number;
    levelNode: number;
}

export interface ReferenceInfo {
    name: string;

    poomsaeList?: string;
    poomsaeCombination?: string;

    sparringList?: string;
    sparringCombination?: string;
}

export interface SigmaData {
    childNode: number;
    parentNode: number | null;
    round: string;
    match: number;
    participants?: number;
    bracketNodes?: number[];
}