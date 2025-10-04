import './Sigma.scss';
import NodeGroup from "./NodeGroup";
import { getTournamentStructure, getTotalPlayersNeeded, getLabelForMatch } from "../../utils/NodeUtils";
import type { Node as BracketNode, PoomsaeHistory } from '@/types/types';
import { getBracketNodesByParticipants } from '@/services/BracketNode';
import type { SigmaData } from '@/types/types';
import { PoomsaeSigmaLocalStorage } from '@/utils/PoomsaeSigmaStorage';
import React from 'react';

export default function Sigma({ players, participants }: { players?: PoomsaeHistory[], participants?: number }) {
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

    // console.log("Tournament Structure:", structure);

    // Function để tạo PoomsaeSigma data từ bracket structure
    const createSigmaData = React.useCallback((bracketNodes: BracketNode[], currentParticipants: number): SigmaData[] => {
        const sigmaData: SigmaData[] = [];
        const nodeStructure = getTournamentStructure(bracketNodes);

        // console.log("Node Structure for Sigma Data:", nodeStructure);

        nodeStructure.forEach((levelData) => {
            const roundIndex = nodeStructure.length - levelData.level; // Reverse để có đúng round order
            const roundLabel = getLabelForMatch({ roundIndex, totalRounds: nodeStructure.length });

            Object.entries(levelData.parents).forEach(([parentIdStr, children], matchIndex) => {
                const parentId = parentIdStr === 'null' ? null : parseInt(parentIdStr);

                // Tạo record cho mỗi child node
                children.forEach(childId => {
                    sigmaData.push({
                        childNode: childId,
                        parentNode: parentId,
                        round: roundLabel,
                        match: matchIndex + 1,
                        participants: currentParticipants
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

    return (
        <div className='sigma'>
            <div className='round-container'>
                {structure.level
                    .sort((a, b) => b - a)
                    .map((round, roundIndex) => {
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
                                            Object.entries(roundData.parents).map(([parentId, children], matchIndex) => {
                                                // Mỗi parent có 2 children nodes, tạo thành 1 trận đấu
                                                const player1 = players ? players.filter(p => p.sourceNode === children[0])[0] : { name: `Player ${children[0] || 'TBD1'}` };
                                                const player2 = players ? players.filter(p => p.sourceNode === children[1])[0] : { name: `Player ${children[1] || 'TBD2'}` };
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
                                                    />
                                                );
                                            })
                                        )}
                                </div>
                            </div>
                        )
                    })}
            </div>
            {/* <NodeGroup
                player1={players && players[0] ? players[0] : { id: 0, name: 'TBD1' }}
                player2={players && players[1] ? players[1] : { id: 0, name: 'TBD2' }}
            /> */}
        </div>
    )
}