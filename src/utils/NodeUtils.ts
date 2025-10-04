import type { Node } from "../types/types";

// export const getTournamentStructure = (playerCount: number) => {
//     // if (playerCount % 2 !== 0 || playerCount < 2) {
//     //     playerCount += 1; // Làm tròn lên số chẵn gần nhất
//     // }

//     const totalRounds = Math.ceil(Math.log2(playerCount));
//     const firstRoundMatches = Math.floor(playerCount / 2);

//     return {
//         totalRounds,
//         firstRoundMatches,
//         matchesPerRound: Array.from({ length: totalRounds },
//             (_, i) => Math.ceil(firstRoundMatches / Math.pow(2, i))
//         )
//     }
// }

export const getTotalPlayersNeeded = (playerCount: number) => {
    return Math.ceil(Math.log2(playerCount));
}

export const getTournamentStructure = (nodeList: Node[]) => {
    const uniqueLevels = [...new Set(nodeList.map(node => node.levelNode))];
    return uniqueLevels.map(level => {
        // Lấy các node cùng level
        const nodesAtLevel = nodeList.filter(n => n.levelNode === level);

        // Gom theo parentNodeId để xác định số trận đấu
        const parents = nodesAtLevel.reduce<Record<number, number[]>>((acc, node) => {
            if (!acc[node.parentNodeId]) {
                acc[node.parentNodeId] = [];
            }
            acc[node.parentNodeId].push(node.childNodeId);
            return acc;
        }, {});

        return {
            level,
            parents
        };
    });
};


export const getLabelForMatch = ({ roundIndex, totalRounds }: { roundIndex: number, totalRounds: number }) => {
    switch (roundIndex) {
        case totalRounds:
            return "🏆"
        case totalRounds - 1:
            return "Chung kết";
        case totalRounds - 2:
            return "Bán kết";
        case totalRounds - 3:
            return "Tứ kết";
        case totalRounds - 4:
            return "Vòng loại";
        default:
            return `Vòng ${roundIndex + 1}`;
    }
}