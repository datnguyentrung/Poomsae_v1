import './Sigma.scss';
import NodeGroup from "./NodeGroup";
import { getTournamentStructure, getTotalPlayersNeeded, getLabelForMatch } from "../../utils/NodeUtils";
import type { Node as BracketNode } from '@/types/types';
import type { PoomsaeHistory } from '@/types/Tournament/Poomsae';
import type { SparringHistory } from '@/types/Tournament/Sparring';
import { getBracketNodesByParticipants } from '@/services/BracketNode';
import type { SigmaData } from '@/types/types';
import { PoomsaeSigmaLocalStorage } from '@/utils/PoomsaeSigmaStorage';
import React from 'react';

type Props = {
    players?: PoomsaeHistory[] | SparringHistory[],
    participants?: number,
    content?: string, // Thêm prop poomsaeContent
    onRefresh?: () => Promise<void>,
}

// const data1 = {
//     idPoomsaeHistory: "player-1",
//     nodeInfo: { sourceNode: 5, targetNode: -1, levelNode: -1 },
//     referenceInfo: { name: "Trần Thị B", poomsaeList: "taegeuk-2", poomsaeCombination: "combo-2" },
//     hasWon: false
// }

// const data2 = {
//     idPoomsaeHistory: "bronze-player-2",
//     nodeInfo: { sourceNode: 14, targetNode: -1, levelNode: -1 },
//     referenceInfo: { name: "Hoàng Thị F", poomsaeList: "taegeuk-6", poomsaeCombination: "combo-6" },
//     hasWon: false
// }

export default function Sigma({ players, participants, content, onRefresh }: Props) {
    const [bracketNodes, setBracketNodes] = React.useState<BracketNode[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [cachedParticipants, setCachedParticipants] = React.useState<number | null>(null);

    // Memoize structure calculation để tránh tính lại không cần thiết  
    const structure = React.useMemo(() => {
        if (bracketNodes.length > 0) {
            const nodeStructure = getTournamentStructure(bracketNodes);
            const matchCount = getTotalPlayersNeeded(participants || players?.length || 0);
            // Convert to expected format
            // console.log(nodeStructure);
            return {
                level: nodeStructure.map(n => n.level),
                totalRounds: matchCount,
                round: nodeStructure,
            };
        }
        return { level: [], totalRounds: 0, round: [] };
    }, [bracketNodes, participants, players?.length]);

    console.log("Tournament Structure:", structure);

    /**
     * Creates Sigma data structure from bracket nodes
     * @param bracketNodes - Array of bracket nodes from the tournament structure
     * @param currentParticipants - Number of participants in the tournament
     * @returns Array of SigmaData containing tournament structure information
     */
    const createSigmaData = React.useCallback((bracketNodes: BracketNode[], currentParticipants: number): SigmaData[] => {
        if (!bracketNodes.length || currentParticipants <= 0) {
            return [];
        }
        // console.log('bracketNode: ', bracketNodes);

        const sigmaData: SigmaData[] = [];
        const nodeStructure = getTournamentStructure(bracketNodes);

        nodeStructure.forEach((levelData) => {
            const roundIndex = nodeStructure.length - levelData.level;
            const roundLabel = getLabelForMatch({
                roundIndex,
                totalRounds: nodeStructure.length
            });

            Object.entries(levelData.parents).forEach(([parentIdStr, children], matchIndex) => {
                const parentNode = parentIdStr === 'null' ? null : parseInt(parentIdStr, 10);

                children.forEach(childId => {
                    // Chỉ tìm node có childNodeId khớp chính xác với childId
                    const correspondingBracketNode = bracketNodes.find(node =>
                        node.childNodeId === childId
                    );
                    // console.log('childId:', childId, 'found node:', correspondingBracketNode, 'bracketNodes length:', correspondingBracketNode?.bracketNodes?.length);

                    sigmaData.push({
                        childNode: childId,
                        parentNode,
                        round: roundLabel,
                        match: matchIndex + 1,
                        participants: currentParticipants,
                        bracketNodes: correspondingBracketNode?.bracketNodes ?? []
                    });
                });
            });
        });

        return sigmaData;
    }, []);

    React.useEffect(() => {
        const fetchBracketNodes = async () => {
            const currentParticipants = participants || players?.length || 0;

            // Chỉ gọi API nếu:
            // 1. Có participants/players
            // 2. Chưa loading
            // 3. Participants khác với cached value
            if (currentParticipants > 0 && !loading && currentParticipants !== cachedParticipants) {
                setLoading(true);
                try {
                    // console.log(`🔄 Fetching bracket nodes for ${currentParticipants} participants`);
                    const data = await getBracketNodesByParticipants(currentParticipants);
                    // console.log('data: ', data);
                    setBracketNodes(data);
                    setCachedParticipants(currentParticipants);

                    // Tạo và save PoomsaeSigma data vào localStorage
                    const sigmaData = createSigmaData(data, currentParticipants);
                    // console.log('PoomsaeSigma data to save:', sigmaData);

                    // Lưu vào localStorage sử dụng utility class
                    PoomsaeSigmaLocalStorage.save(currentParticipants, sigmaData);
                } catch (error) {
                    console.error("Error fetching bracket nodes:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchBracketNodes();
    }, [participants, players?.length, loading, cachedParticipants, createSigmaData])

    if (loading) {
        return (
            <div className='sigma'>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    🔄 Đang tải bracket nodes...
                </div>
            </div>
        );
    }

    const renderBronzeMatch = () => {
        const player = players ? players
            .filter(p => p.nodeInfo.levelNode === -1 && p.nodeInfo.targetNode === -1)
            .sort((a, b) => a.nodeInfo.sourceNode - b.nodeInfo.sourceNode)
            : [];
        if (player.length < 1) return null; // Chỉ hiển thị nếu có đúng 2 người chơi cho trận tranh hạng 3
        // console.log("Bronze match players:", player.length);
        return (
            <div className='bronze-match'>
                <h3>
                    {getLabelForMatch({ roundIndex: structure.totalRounds + 1, totalRounds: structure.totalRounds })}
                </h3>
                <NodeGroup
                    player1={player[0]}
                    player2={player[1]}
                    targetNode={-1} // Sử dụng -1 để biểu thị node tranh hạng 3
                    participants={participants}
                    content={content}
                    onRefresh={onRefresh}
                />
            </div>
        )
    }

    return (
        <div className='sigma'>
            <div className='round-container'>
                {structure.level
                    .sort((a, b) => b - a)
                    .map((round, roundIndex) => {
                        // console.log('structure: ', structure);
                        if (round === 0) return null; // Skip the first round (level 0) if needed
                        return (
                            <div key={roundIndex} className='round-section'>
                                <h3>
                                    {getLabelForMatch({ roundIndex, totalRounds: structure.totalRounds })}
                                </h3>
                                <div>
                                    {structure.round && structure.round
                                        .filter(s => s.level === round)
                                        .map((roundData, roundDataIndex) =>
                                            Object.entries(roundData.parents)
                                                .map(([parentId, children], matchIndex) => {
                                                    // Sắp xếp children tăng dần
                                                    const sortedChildren = [...children].sort((a, b) => a - b);
                                                    // Mỗi parent có 2 children nodes, tạo thành 1 trận đấu
                                                    const player1 = players ? players.filter(p =>
                                                        p.nodeInfo.sourceNode === sortedChildren[0]
                                                        && p.nodeInfo.targetNode.toString() === parentId)[0] : undefined;
                                                    const player2 = players ? players.filter(p =>
                                                        p.nodeInfo.sourceNode === sortedChildren[1]
                                                        && p.nodeInfo.targetNode.toString() === parentId)[0] : undefined;
                                                    // console.log("Children nodes:", children);
                                                    // console.log("Player 1:", player1);
                                                    // console.log("Player 2:", player2);
                                                    return (
                                                        <NodeGroup
                                                            key={`${roundDataIndex}-${parentId}-${matchIndex}`}
                                                            player1={player1}
                                                            player2={player2}
                                                            numberMatch={matchIndex + 1}
                                                            targetNode={parseInt(parentId)}
                                                            participants={participants}
                                                            content={content}
                                                            onRefresh={onRefresh}
                                                        />
                                                    );
                                                })
                                        )}
                                </div>
                            </div>
                        )
                    })}
            </div>

            {renderBronzeMatch()}
        </div>
    )
}