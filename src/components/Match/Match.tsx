import './Match.scss';
import { getAllTournamentMatchesByTournamentId, updateMatchRelations } from '@/services/tournament/TournamentMatch';
import { getPoomsaeHistoryByIdTournament } from '@/services/tournament/Poomsae/PoomsaeHistoryService';
import { getSparringHistoryByIdTournament } from '@/services/tournament/Sparring/SparringHistoryService';
import React, { useEffect, useState, useMemo } from 'react';

import type { TournamentMatchDTO } from '@/types/Tournament/TournamentMatch';
import type { PoomsaeHistory } from '@/types/Tournament/Poomsae';
import type { SparringHistory } from '@/types/Tournament/Sparring';

import { PoomsaeSigmaLocalStorage } from '@/utils/PoomsaeSigmaStorage';
import { AgeGroupMap, BeltGroupMap, getDisplayName, PoomsaeContentMap, GenderMap } from '@/constants/TournamentConstants';
import Node from '@/components/Sigma/Node';
import YesNoQuestion from '../Sigma/YesNoQuestion';

import { formatDurationHM } from '@/utils/Format';

const TOURNAMENT_ID = 'a8d5c830-c275-41b0-a251-294eb61c007f'; // Thay thế bằng ID giải đấu thực tế
type ModalMode = 'winner' | 'delete';

import MatchPending from './MatchPending';
import AddMatchModal from './AddMatchModal';
import { traverseMatchLinkedList, findTailMatch, validateLinkedList } from '@/utils/LinkedListUtils';

export default function Match() {
    const [poomsaeHistories, setPoomsaeHistories] = useState<PoomsaeHistory[]>([]);
    const [sparringHistories, setSparringHistories] = useState<SparringHistory[]>([]);
    const [tournamentMatches, setTournamentMatches] = useState<TournamentMatchDTO[]>([]);
    const [showConfirmModal, setShowConfirmModal] = React.useState<boolean>(false);
    const [selectedPlayer, setSelectedPlayer] = React.useState<PoomsaeHistory | SparringHistory | null>(null);
    const [modalMode, setModalMode] = React.useState<ModalMode>('winner');
    const [showAddModal, setShowAddModal] = React.useState<boolean>(false);
    const [selectedMatchForAdd, setSelectedMatchForAdd] = React.useState<TournamentMatchDTO | null>(null);

    /**
     * Handles winner selection for a player
     */
    const handleChooseWinner = React.useCallback((player: PoomsaeHistory | SparringHistory) => {
        setSelectedPlayer(player);
        setModalMode('winner');
        setShowConfirmModal(true);
    }, []);

    /**
     * Handles delete request for a player
     */
    const handleDeleteNode = React.useCallback((player: PoomsaeHistory | SparringHistory) => {
        setSelectedPlayer(player);
        setModalMode('delete');
        setShowConfirmModal(true);
    }, []);

    /**
     * Handles confirmation of winner or delete action
     */
    const handleConfirmAction = React.useCallback(async () => {
        if (!selectedPlayer) return;

        if (modalMode === 'winner') {
            // TODO: Implement winner logic
            console.log("Winner confirmed:", selectedPlayer.referenceInfo.name);
        } else {
            // TODO: Implement delete logic
            console.log("Node deletion confirmed:", selectedPlayer.referenceInfo.name);
        }

        setShowConfirmModal(false);
        setSelectedPlayer(null);

        // Re-fetch data sau khi thay đổi
        // TODO: Implement refresh logic if needed
    }, [modalMode, selectedPlayer]);

    /**
     * Handles cancellation of modal
     */
    const handleCancelSelection = React.useCallback(() => {
        setShowConfirmModal(false);
        setSelectedPlayer(null);
    }, []);

    /**
     * Handles opening add match modal
     */
    const handleOpenAddModal = React.useCallback((match: TournamentMatchDTO) => {
        setSelectedMatchForAdd(match);
        setShowAddModal(true);
    }, []);

    /**
     * Handles closing add match modal
     */
    const handleCloseAddModal = React.useCallback(() => {
        setShowAddModal(false);
        setSelectedMatchForAdd(null);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [poomsaeData, sparringData, matchData] = await Promise.all([
                    getPoomsaeHistoryByIdTournament(TOURNAMENT_ID),
                    getSparringHistoryByIdTournament(TOURNAMENT_ID),
                    getAllTournamentMatchesByTournamentId(TOURNAMENT_ID)
                ]);
                setPoomsaeHistories(poomsaeData);
                setSparringHistories(sparringData);
                setTournamentMatches(matchData);
                // console.log('Poomsae Histories:', poomsaeData);
                // console.log('Sparring Histories:', sparringData);
                // console.log('Tournament Matches:', matchData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [])

    // Chuẩn bị map trước để lookup nhanh
    // ✅ Dùng useMemo để tránh tái tạo map khi component re-render
    const poomsaeMap = useMemo(() => {
        const map = new Map<string, PoomsaeHistory[]>();

        // Loại bỏ duplicate dựa trên idPoomsaeHistory
        const uniqueHistories = poomsaeHistories.filter((history, index, self) =>
            index === self.findIndex(h => h.idPoomsaeHistory === history.idPoomsaeHistory)
        );

        uniqueHistories.forEach(p => {
            const key = p.referenceInfo.poomsaeCombination || '';
            if (!map.has(key)) map.set(key, []);

            // Kiểm tra xem player này đã tồn tại trong array chưa (double check)
            const existingArray = map.get(key)!;
            const isDuplicate = existingArray.some(existing =>
                existing.idPoomsaeHistory === p.idPoomsaeHistory
            );

            if (!isDuplicate) {
                existingArray.push(p);
            }
        });

        return map;
    }, [poomsaeHistories]);

    // console.log('Poomsae Map:', poomsaeMap);

    const sparringMap = useMemo(() => {
        const map = new Map<string, SparringHistory[]>();

        // Loại bỏ duplicate dựa trên idSparringHistory
        const uniqueHistories = sparringHistories.filter((history, index, self) =>
            index === self.findIndex(h => h.idSparringHistory === history.idSparringHistory)
        );

        uniqueHistories.forEach(p => {
            const key = p.referenceInfo.sparringCombination || '';
            if (!map.has(key)) map.set(key, []);

            // Kiểm tra xem player này đã tồn tại trong array chưa (double check)
            const existingArray = map.get(key)!;
            const isDuplicate = existingArray.some(existing =>
                existing.idSparringHistory === p.idSparringHistory
            );

            if (!isDuplicate) {
                existingArray.push(p);
            }
        });

        return map;
    }, [sparringHistories]);

    // Sắp xếp tournament matches theo linked list order
    const orderedMatches = useMemo(() => {
        // Validate linked list first
        const validation = validateLinkedList(tournamentMatches);
        if (!validation.isValid) {
            console.warn('Tournament matches linked list validation failed:', validation.errors);
        }

        // Traverse linked list to get correct order
        return traverseMatchLinkedList(tournamentMatches);
    }, [tournamentMatches]);

    // Lọc các match để hiển thị (có relation hoặc là firstNode)
    const displayMatches = useMemo(() => {
        return orderedMatches.filter(match =>
            match.relationInfo.leftMatch !== null
            || match.relationInfo.rightMatch !== null
            || match.keyInfo.firstNode
        );
    }, [orderedMatches]);

    // Lọc các match pending (không có relation và không phải firstNode)
    const pendingMatches = useMemo(() => {
        return tournamentMatches.filter(match =>
            match.relationInfo.leftMatch === null
            && match.relationInfo.rightMatch === null
            && !match.keyInfo.firstNode
        );
    }, [tournamentMatches]);

    /**
     * Handles adding new match
     */
    const handleAddMatch = React.useCallback(async (insertAfterMatch?: TournamentMatchDTO) => {
        // TODO: Implement API call to add new match
        console.log('Adding new match after:', insertAfterMatch);

        // Logic để tạo match mới:
        if (!insertAfterMatch) {
            // Nếu không chỉ định vị trí, thêm vào cuối danh sách
            const tailMatch = findTailMatch(displayMatches);
            // console.log('Adding to tail after:', tailMatch);
            if (selectedMatchForAdd && selectedMatchForAdd.relationInfo) {
                selectedMatchForAdd.relationInfo.leftMatch = tailMatch?.keyInfo || null;
                await updateMatchRelations(selectedMatchForAdd);
            }

            // TODO: Create new match với leftMatch = tailMatch.keyInfo
        } else {
            // Thêm sau match được chỉ định
            console.log('Adding after specific match:', insertAfterMatch.keyInfo);

            // TODO: 
            // 1. Create new match với leftMatch = insertAfterMatch.keyInfo
            // 2. Set rightMatch của new match = insertAfterMatch.relationInfo.rightMatch
            // 3. Update insertAfterMatch.relationInfo.rightMatch = newMatch.keyInfo
            // 4. Nếu có match tiếp theo, update leftMatch của nó = newMatch.keyInfo
        }

        // Sau khi thêm thành công, refresh data
        // await fetchData();

        handleCloseAddModal();
    }, [handleCloseAddModal, displayMatches, selectedMatchForAdd]);

    // Helper function để xác định class đặc biệt cho trận đấu
    const getMatchClass = (targetNode: number, tournamentType: string) => {
        let baseClass = 'tournament-match-item';

        // Thêm class cho tournament type
        if (tournamentType === 'POOMSAE') {
            baseClass += ' poomsae-match';
        } else if (tournamentType === 'SPARRING') {
            baseClass += ' sparring-match';
        }

        // Thêm class cho các trận đặc biệt
        if (targetNode === 0) {
            baseClass += ' final-match';
        } else if (targetNode === -1) {
            baseClass += ' bronze-match';
        }

        return baseClass;
    };

    if (tournamentMatches.length === 0) {
        return (
            <div className="tournament-match-container">
                <div className="match-empty">
                    <div className="empty-icon">🏆</div>
                    <div className="empty-message">Chưa có trận đấu nào được tạo</div>
                </div>
            </div>
        );
    }

    return (
        <div className="tournament-match-container">
            <div className="tournament-match-list">
                {displayMatches.map((match, index) => {
                    const { tournament, idCombination, targetNode } = match.keyInfo;
                    const parentNodeData = PoomsaeSigmaLocalStorage.findByParentNodeInParticipants(targetNode, match.keyInfo.participants);

                    let player1: PoomsaeHistory | SparringHistory | undefined;
                    let player2: PoomsaeHistory | SparringHistory | undefined;
                    let contentName = '';

                    if (match.matchInfo.tournamentType === 'POOMSAE') {
                        const players = poomsaeMap
                            .get(idCombination)
                            ?.filter(p => p.nodeInfo.targetNode === targetNode)
                            .sort((a, b) => (a.nodeInfo.sourceNode || 0) - (b.nodeInfo.sourceNode || 0)) ?? [];

                        // console.log(JSON.stringify(players, null, 2));

                        [player1, player2] = players; // destructuring an array safely

                        const category =
                            player1?.referenceInfo.poomsaeCategory || player2?.referenceInfo.poomsaeCategory;

                        contentName = `${getDisplayName(PoomsaeContentMap, category?.contentName || '')} - 
                                ${getDisplayName(BeltGroupMap, category?.beltGroupName || '')} - 
                                ${getDisplayName(AgeGroupMap, category?.ageGroupName || '')}`;
                    } else if (match.matchInfo.tournamentType === 'SPARRING') {
                        const players = sparringMap
                            .get(idCombination)
                            ?.filter(s => s.nodeInfo.targetNode === targetNode)
                            .sort((a, b) => (a.nodeInfo.sourceNode || 0) - (b.nodeInfo.sourceNode || 0)) ?? [];
                        [player1, player2] = players;

                        const category = player1?.referenceInfo.sparringCategory || player2?.referenceInfo.sparringCategory;
                        contentName = `${getDisplayName(GenderMap, category?.gender || '')} - 
                            ${getDisplayName(AgeGroupMap, category?.ageGroupName || '')} -
                            ${category?.weightClass || ''}`;
                    }

                    // console.log('match.matchInfo.duration: ', match.matchInfo.duration);
                    return (
                        <div
                            className={getMatchClass(targetNode, match.matchInfo.tournamentType)}
                            key={`${tournament}-${idCombination}-${targetNode}`}>
                            <div className="match-number">#{index + 1}</div>
                            <div className="match-category">{contentName}</div>
                            <div className="player1-container">
                                <Node
                                    player={player1}
                                    nodeStatus='chung'
                                    targetNode={targetNode}
                                    participants={match.keyInfo.participants}
                                    onChooseWinner={handleChooseWinner}
                                    onDeleteNode={handleDeleteNode}
                                    content={player1?.referenceInfo.poomsaeCategory?.contentName || ''}
                                />
                            </div>
                            <div className="vs-divider">VS</div>
                            <div className="player2-container">
                                <Node
                                    player={player2}
                                    nodeStatus='hong'
                                    targetNode={targetNode}
                                    participants={match.keyInfo.participants}
                                    onChooseWinner={handleChooseWinner}
                                    onDeleteNode={handleDeleteNode}
                                    content={player2?.referenceInfo.poomsaeCategory?.contentName || ''}
                                />
                            </div>
                            <div className="round-info">{parentNodeData?.round ? parentNodeData.round : 'Tranh đồng'}</div>
                            <div className='time'>
                                {match.matchInfo.duration ? formatDurationHM(match.matchInfo.duration) : '--:--'}
                            </div>
                        </div>
                    );
                })}
            </div>

            <MatchPending
                tournamentMatches={pendingMatches}
                poomsaeMap={poomsaeMap}
                sparringMap={sparringMap}
                onAddMatch={handleOpenAddModal}
            />

            <YesNoQuestion
                isOpen={showConfirmModal}
                mode={modalMode}
                player={selectedPlayer}
                participants={tournamentMatches[0]?.keyInfo.participants || 0}
                onConfirm={handleConfirmAction}
                onCancel={handleCancelSelection}
            />

            <AddMatchModal
                isOpen={showAddModal}
                onClose={handleCloseAddModal}
                tournamentMatches={displayMatches}
                poomsaeMap={poomsaeMap}
                sparringMap={sparringMap}
                onAddMatch={handleAddMatch}
                currentMatch={selectedMatchForAdd}
            />
        </div>
    )
}