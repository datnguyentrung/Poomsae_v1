import './Match.scss';
import dayjs from 'dayjs';
import {
    getAllTournamentMatchesByTournamentId, updateMatchRelations,
    deleteMatchRelations, deleteTournamentMatch
} from '@/services/tournament/TournamentMatch';
import { getPoomsaeHistoryByIdTournament } from '@/services/tournament/Poomsae/PoomsaeHistoryService';
import { getSparringHistoryByIdTournament } from '@/services/tournament/Sparring/SparringHistoryService';
import React, { useEffect, useState, useMemo } from 'react';

import type { TournamentMatchDTO } from '@/types/Tournament/TournamentMatch';
import type { PoomsaeHistory } from '@/types/Tournament/Poomsae';
import type { SparringHistory } from '@/types/Tournament/Sparring';

import { PoomsaeSigmaLocalStorage } from '@/utils/PoomsaeSigmaStorage';
import { AgeGroupMap, BeltGroupMap, getDisplayName, PoomsaeContentMap, GenderMap } from '@/constants/TournamentConstants';
import Node from '@/components/SigmaElimination/Node';
import ContextMenu from '@/utils/ContextMenu';
import YesNoQuestion from '../SigmaElimination/YesNoQuestion';

import { toast } from 'react-toastify';

const TOURNAMENT_ID = 'a8d5c830-c275-41b0-a251-294eb61c007f'; // Thay thế bằng ID giải đấu thực tế
type ModalMode = 'winner' | 'delete';

import MatchPending from './MatchPending';
import AddMatchModal from './AddMatchModal';
import { traverseMatchLinkedList, findTailMatch, validateLinkedList } from '@/utils/LinkedListUtils';
import MatchSession from './MatchSession';
import { Eraser, Grip, Trash } from 'lucide-react';
import type { ContextMenuItem } from '@/utils/ContextMenu';

const startTimeMorning = dayjs().hour(8).minute(0).second(0);
const startTimeAfternoon = dayjs().hour(13).minute(0).second(0);

export default function Match() {
    const [poomsaeHistories, setPoomsaeHistories] = useState<PoomsaeHistory[]>([]);
    const [sparringHistories, setSparringHistories] = useState<SparringHistory[]>([]);
    const [tournamentMatches, setTournamentMatches] = useState<TournamentMatchDTO[]>([]);
    const [showConfirmModal, setShowConfirmModal] = React.useState<boolean>(false);
    const [selectedPlayer, setSelectedPlayer] = React.useState<PoomsaeHistory | SparringHistory | null>(null);
    const [modalMode, setModalMode] = React.useState<ModalMode>('winner');
    const [showAddModal, setShowAddModal] = React.useState<boolean>(false);
    const [selectedMatchForAdd, setSelectedMatchForAdd] = React.useState<TournamentMatchDTO | null>(null);
    const [selectedSessionForAdd, setSelectedSessionForAdd] = React.useState<'AM' | 'PM'>('AM');

    // Loading and error states
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);

    // Drag and Drop states
    const [draggedMatch, setDraggedMatch] = React.useState<TournamentMatchDTO | null>(null);
    const [dropPosition, setDropPosition] = React.useState<number | null>(null);
    const [isDragging, setIsDragging] = React.useState<boolean>(false);
    const [tempOrderedMatches, setTempOrderedMatches] = React.useState<TournamentMatchDTO[]>([]);
    const [showReorderConfirm, setShowReorderConfirm] = React.useState<boolean>(false);

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

        try {
            setError(null);

            if (modalMode === 'winner') {
                // Implement winner logic
                console.log("Winner confirmed:", selectedPlayer.referenceInfo.name);

                // TODO: Update winner in the tournament system
                // This might involve:
                // 1. Advancing winner to next round
                // 2. Updating match results
                // 3. Creating new matches for next round if needed

                // Example API call (implement based on your backend):
                // await updateMatchWinner(selectedPlayer, currentMatch);

            } else if (modalMode === 'delete') {
                // Implement delete logic
                console.log("Node deletion confirmed:", selectedPlayer.referenceInfo.name);

                // TODO: Remove player from tournament
                // This might involve:
                // 1. Removing player from current match
                // 2. Updating bracket structure
                // 3. Possibly removing empty matches

                // Example API call (implement based on your backend):
                // await removePlayerFromTournament(selectedPlayer);
            }

            setShowConfirmModal(false);
            setSelectedPlayer(null);

            // Re-fetch data after changes
            const [poomsaeData, sparringData, matchData] = await Promise.all([
                getPoomsaeHistoryByIdTournament(TOURNAMENT_ID),
                getSparringHistoryByIdTournament(TOURNAMENT_ID),
                getAllTournamentMatchesByTournamentId(TOURNAMENT_ID)
            ]);
            setPoomsaeHistories(poomsaeData);
            setSparringHistories(sparringData);
            setTournamentMatches(matchData);

        } catch (error) {
            console.error(`Error ${modalMode === 'winner' ? 'setting winner' : 'deleting player'}:`, error);
            setError(`Không thể ${modalMode === 'winner' ? 'chọn người thắng' : 'xóa người chơi'}. Vui lòng thử lại.`);
        }
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
                setIsLoading(true);
                setError(null);

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
                setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [selectedSessionForAdd]); // ✅ Added missing dependency

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
        const validation = validateLinkedList(tournamentMatches.filter(m => m.matchInfo.session === selectedSessionForAdd));
        if (!validation.isValid) {
            console.warn('Tournament matches linked list validation failed:', validation.errors);
        }

        // Traverse linked list to get correct order
        return traverseMatchLinkedList(tournamentMatches.filter(m => m.matchInfo.session === selectedSessionForAdd));
    }, [tournamentMatches, selectedSessionForAdd]);

    // Lọc các match để hiển thị (có relation hoặc là firstNode)
    const displayMatches = useMemo(() => {
        return orderedMatches.filter(match =>
            match.relationInfo!.leftMatch !== null
            || match.relationInfo!.rightMatch !== null
            || match.keyInfo.firstNode
        );
    }, [orderedMatches]);

    // Lọc các match pending (không có relation và không phải firstNode)
    const pendingMatches = useMemo(() => {
        return tournamentMatches.filter(match =>
            match.relationInfo!.leftMatch === null
            && match.relationInfo!.rightMatch === null
            && !match.keyInfo.firstNode
        );
    }, [tournamentMatches]);

    /**
     * Drag and Drop handlers
     */
    const handleDragStart = React.useCallback((e: React.DragEvent, match: TournamentMatchDTO) => {
        setDraggedMatch(match);
        setIsDragging(true);
        e.dataTransfer.effectAllowed = 'move';
    }, []);

    const handleDragEnd = React.useCallback(() => {
        setIsDragging(false);
        setDropPosition(null);
    }, []);

    const handleDragOver = React.useCallback((e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDropPosition(index);
    }, []);

    const handleDrop = React.useCallback((e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();

        if (!draggedMatch) return;

        const currentMatches = tempOrderedMatches.length > 0 ? tempOrderedMatches : displayMatches;
        const dragIndex = currentMatches.findIndex(m =>
            m.keyInfo.tournament === draggedMatch.keyInfo.tournament &&
            m.keyInfo.idCombination === draggedMatch.keyInfo.idCombination &&
            m.keyInfo.targetNode === draggedMatch.keyInfo.targetNode
        );

        if (dragIndex === -1 || dragIndex === dropIndex) {
            setDraggedMatch(null);
            setDropPosition(null);
            setIsDragging(false);
            return;
        }

        // Create new array with reordered items
        const newMatches = [...currentMatches];
        const [removed] = newMatches.splice(dragIndex, 1);
        newMatches.splice(dropIndex, 0, removed);

        setTempOrderedMatches(newMatches);
        setShowReorderConfirm(true);
        setDraggedMatch(null);
        setDropPosition(null);
        setIsDragging(false);
    }, [draggedMatch, tempOrderedMatches, displayMatches]);

    const handleConfirmReorder = React.useCallback(async () => {
        try {
            // TODO: Implement API call to update match relations based on new order
            console.log('Saving new order:', tempOrderedMatches);

            // Update relations for each match based on new positions
            for (let i = 0; i < tempOrderedMatches.length; i++) {
                const currentMatch = tempOrderedMatches[i];
                const leftMatch = i > 0 ? tempOrderedMatches[i - 1] : null;
                const rightMatch = i < tempOrderedMatches.length - 1 ? tempOrderedMatches[i + 1] : null;

                currentMatch!.relationInfo!.leftMatch = leftMatch?.keyInfo || null;
                currentMatch!.relationInfo!.rightMatch = rightMatch?.keyInfo || null;

                await updateMatchRelations(currentMatch);
            }

            // Refresh data after successful update
            const matchData = await getAllTournamentMatchesByTournamentId(TOURNAMENT_ID);
            setTournamentMatches(matchData);

            setTempOrderedMatches([]);
            setShowReorderConfirm(false);
        } catch (error) {
            console.error('Error updating match order:', error);
        }
    }, [tempOrderedMatches]);

    const handleCancelReorder = React.useCallback(() => {
        setTempOrderedMatches([]);
        setShowReorderConfirm(false);
    }, []);

    /**
     * Parse duration (ISO 8601 string or number) to minutes
     */
    const parseDurationToMinutes = (duration: string | number): number => {
        if (!duration) return 0;

        // If it's a string (ISO 8601 format like PT5M, PT15M)
        if (typeof duration === 'string') {
            const regex = /^PT(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?$/;
            const matches = duration.match(regex);

            if (!matches) return 0;

            const hours = parseFloat(matches[1] || '0');
            const minutes = parseFloat(matches[2] || '0');
            const seconds = parseFloat(matches[3] || '0');

            return Math.floor(hours * 60 + minutes + seconds / 60);
        }

        // If it's a number, assume it's already in minutes or convert from seconds
        if (typeof duration === 'number') {
            // If number is very large, assume it's in nanoseconds/milliseconds
            if (duration > 1000) {
                return Math.floor(duration / 60); // Convert seconds to minutes
            }
            return duration; // Already in minutes
        }

        return 0;
    };

    /**
     * Calculate time for each match based on start time and duration
     */
    const calculateMatchTimes = useMemo(() => {
        const currentMatches = tempOrderedMatches.length > 0 ? tempOrderedMatches : displayMatches;
        const startTime = selectedSessionForAdd === 'AM' ? startTimeMorning : startTimeAfternoon;

        return currentMatches.reduce((acc, match, index) => {
            let matchTime = startTime;

            // Add durations of all previous matches
            for (let i = 0; i < index; i++) {
                const prevMatch = currentMatches[i];
                if (prevMatch.matchInfo.duration) {
                    const durationInMinutes = parseDurationToMinutes(prevMatch.matchInfo.duration);
                    matchTime = matchTime.add(durationInMinutes, 'minute');
                }
            }

            acc.set(`${match.keyInfo.tournament}-${match.keyInfo.idCombination}-${match.keyInfo.targetNode}`, matchTime);
            return acc;
        }, new Map<string, dayjs.Dayjs>());
    }, [tempOrderedMatches, displayMatches, selectedSessionForAdd]);

    /**
     * Handles adding new match
     */
    const handleAddMatch = React.useCallback(async (insertAfterMatch?: TournamentMatchDTO) => {
        try {
            if (!selectedMatchForAdd) {
                console.error('No match selected for addition');
                return;
            }

            // Logic để tạo match mới:
            if (!insertAfterMatch) {
                // Nếu không chỉ định vị trí, thêm vào cuối danh sách
                const tailMatch = findTailMatch(displayMatches);
                console.log('Adding to tail after:', tailMatch);

                if (selectedMatchForAdd.relationInfo) {
                    selectedMatchForAdd.relationInfo.leftMatch = tailMatch?.keyInfo || null;
                    selectedMatchForAdd.matchInfo.session = selectedSessionForAdd;
                    console.log('selectedMatchForAdd to add at tail:', selectedMatchForAdd);
                    await updateMatchRelations(selectedMatchForAdd);
                }
            } else {
                // Thêm sau match được chỉ định
                console.log('Adding after specific match:', insertAfterMatch.keyInfo);

                if (selectedMatchForAdd.relationInfo) {
                    // 1. Set leftMatch của new match = insertAfterMatch.keyInfo
                    selectedMatchForAdd.relationInfo.leftMatch = insertAfterMatch.keyInfo;

                    // 2. Set rightMatch của new match = insertAfterMatch.relationInfo.rightMatch
                    selectedMatchForAdd.relationInfo.rightMatch = insertAfterMatch.relationInfo!.rightMatch;

                    // 3. Update insertAfterMatch.relationInfo.rightMatch = newMatch.keyInfo
                    insertAfterMatch!.relationInfo!.rightMatch = selectedMatchForAdd!.keyInfo;

                    selectedMatchForAdd!.matchInfo!.session = selectedSessionForAdd;

                    // Update both matches
                    await Promise.all([
                        updateMatchRelations(selectedMatchForAdd),
                        updateMatchRelations(insertAfterMatch)
                    ]);

                    // 4. Nếu có match tiếp theo, update leftMatch của nó = newMatch.keyInfo
                    if (selectedMatchForAdd.relationInfo.rightMatch) {
                        const nextMatch = displayMatches.find(m =>
                            m.keyInfo.tournament === selectedMatchForAdd!.relationInfo!.rightMatch?.tournament &&
                            m.keyInfo.idCombination === selectedMatchForAdd!.relationInfo!.rightMatch?.idCombination &&
                            m.keyInfo.targetNode === selectedMatchForAdd!.relationInfo!.rightMatch?.targetNode
                        );

                        if (nextMatch && nextMatch.relationInfo) {
                            nextMatch.relationInfo.leftMatch = selectedMatchForAdd!.keyInfo;
                            await updateMatchRelations(nextMatch);
                        }
                    }
                }
            }

            // Sau khi thêm thành công, refresh data
            const matchData = await getAllTournamentMatchesByTournamentId(TOURNAMENT_ID);
            setTournamentMatches(matchData);

            handleCloseAddModal();
        } catch (error) {
            console.error('Error adding match:', error);
        }
    }, [handleCloseAddModal, displayMatches, selectedMatchForAdd, selectedSessionForAdd]);

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

    const handleDeleteTournamentMatch = React.useCallback(async (match: TournamentMatchDTO) => {
        try {
            if (match.keyInfo.firstNode) {
                toast.error("Không thể xoá trận đấu đầu tiên trong nhánh");
                return;
            }
            // Xoá trận đấu
            await deleteTournamentMatch(match);

            // Refresh data after successful deletion
            const matchData = await getAllTournamentMatchesByTournamentId(TOURNAMENT_ID);
            setTournamentMatches(matchData);
        } catch (error) {
            console.error("Error deleting tournament match:", error);
        }
    }, []);

    const handleDeleteRelations = React.useCallback(async (match: TournamentMatchDTO) => {
        try {
            if (match.keyInfo.firstNode) {
                toast.error("Không thể xoá trận đấu đầu tiên trong nhánh");
                return;
            }
            // Xoá các relation của trận đấu
            await deleteMatchRelations(match);

            // Refresh data after successful deletion
            const matchData = await getAllTournamentMatchesByTournamentId(TOURNAMENT_ID);
            setTournamentMatches(matchData);
        } catch (error) {
            console.error("Error deleting match relations:", error);
        }
    }, []);

    // Create menu items factory function
    const createMenuItems = React.useCallback((match: TournamentMatchDTO): ContextMenuItem[] => [
        {
            label: 'Xoá liên kết trận đấu',
            onClick: () => handleDeleteRelations(match),
            icon: <Eraser size={16} />,
            hint: 'Ngắt liên kết với các trận bên cạnh'
        },
        {
            label: 'Xoá trận đấu',
            onClick: () => handleDeleteTournamentMatch(match),
            icon: <Trash size={16} />,
            hint: 'Xoá trận đấu khỏi danh sách'
        }
    ], [handleDeleteRelations, handleDeleteTournamentMatch]);


    if (isLoading) {
        return (
            <div className="tournament-match-container">
                <div className="match-loading">
                    <div className="loading-spinner">⏳</div>
                    <div className="loading-message">Đang tải dữ liệu trận đấu...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="tournament-match-container">
                <div className="match-error">
                    <div className="error-icon">⚠️</div>
                    <div className="error-message">{error}</div>
                    <button
                        className="retry-button"
                        onClick={() => window.location.reload()}
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

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
            <div>
                <MatchSession
                    selectedSessionForAdd={selectedSessionForAdd}
                    setSelectedSessionForAdd={setSelectedSessionForAdd}
                />

                <div className="tournament-match-list">
                    {(tempOrderedMatches.length > 0 ? tempOrderedMatches : displayMatches).map((match, index) => {
                        const { tournament, idCombination, targetNode } = match.keyInfo;
                        const parentNodeData = PoomsaeSigmaLocalStorage.findByParentNodeInParticipants(targetNode, match.keyInfo.participants);

                        let player1: PoomsaeHistory | SparringHistory | undefined;
                        let player2: PoomsaeHistory | SparringHistory | undefined;
                        let contentName = '';
                        const checked: boolean = match.matchInfo?.categoryName?.contentName === 'PAIR' || match.matchInfo?.categoryName?.contentName === 'MIXED_TEAM'
                            || match.matchInfo?.categoryName?.contentName === 'MALE_TEAM' || match.matchInfo?.categoryName?.contentName === 'FEMALE_TEAM';
                        if (checked) {
                            contentName = `${getDisplayName(PoomsaeContentMap, match.matchInfo?.categoryName?.contentName || '')} - 
                                ${getDisplayName(BeltGroupMap, match.matchInfo?.categoryName?.beltGroupName || '')} - 
                                ${getDisplayName(AgeGroupMap, match.matchInfo?.categoryName?.ageGroupName || '')}`;
                        } else if (match.matchInfo.tournamentType === 'POOMSAE') {
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
                                className={`${getMatchClass(targetNode, match.matchInfo.tournamentType)} ${isDragging ? 'dragging-active' : ''} ${dropPosition === index ? 'drop-target' : ''}`}
                                key={`${tournament}-${idCombination}-${targetNode}`}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDrop={(e) => handleDrop(e, index)}
                            >
                                <div className="match-number">#{index + 1}</div>

                                <div className="match-category" style={{ cursor: 'pointer' }}>
                                    <ContextMenu items={createMenuItems(match)}>
                                        {contentName}
                                    </ContextMenu>
                                </div>

                                {player1 && player2 && (
                                    <>
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
                                    </>
                                )}
                                <div className="round-info">
                                    {checked ? 'Chung kết'
                                        : parentNodeData?.round ? parentNodeData.round : 'Tranh đồng'}
                                </div>
                                <div className='time'>
                                    {(() => {
                                        const matchKey = `${match.keyInfo.tournament}-${match.keyInfo.idCombination}-${match.keyInfo.targetNode}`;
                                        const matchTime = calculateMatchTimes.get(matchKey);
                                        const duration = match.matchInfo.duration;

                                        if (matchTime) {
                                            const startTime = matchTime.format('HH:mm');
                                            if (duration) {
                                                const durationInMinutes = parseDurationToMinutes(duration);
                                                const endTime = matchTime.add(durationInMinutes, 'minute').format('HH:mm');
                                                return (
                                                    <div className="time-display">
                                                        <div className="start-time">{startTime}</div>
                                                        <div className="duration">({durationInMinutes}p)</div>
                                                        <div className="end-time">→ {endTime}</div>
                                                    </div>
                                                );
                                            } else {
                                                return <div className="start-time">{startTime}</div>;
                                            }
                                        }
                                        return '--:--';
                                    })()}
                                </div>

                                <div
                                    className="grip-icon"
                                    draggable={true}
                                    onDragStart={(e) => handleDragStart(e, match)}
                                    onDragEnd={handleDragEnd}
                                >
                                    <Grip size={16} />
                                </div>
                            </div>
                        );
                    })}
                </div>
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

            {/* Reorder Confirmation Modal */}
            {
                showReorderConfirm && (
                    <div className="modal-overlay" onClick={handleCancelReorder}>
                        <div className="reorder-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Xác nhận thay đổi thứ tự</h3>
                            </div>
                            <div className="modal-content">
                                <p>Bạn có muốn lưu thay đổi thứ tự trận đấu không?</p>
                                <p className="modal-warning">Thao tác này sẽ cập nhật quan hệ liên kết giữa các trận đấu.</p>
                            </div>
                            <div className="modal-actions">
                                <button
                                    className="btn-cancel"
                                    onClick={handleCancelReorder}
                                >
                                    Hủy
                                </button>
                                <button
                                    className="btn-confirm"
                                    onClick={handleConfirmReorder}
                                >
                                    Lưu thay đổi
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    )
}