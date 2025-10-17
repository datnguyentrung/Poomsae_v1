import './NodeGroup.scss'
import Node from "./Node";
import PlayerNode from "./PlayerNode";
import type { PoomsaeHistory } from '@/types/Tournament/Poomsae';
import type { SparringHistory } from '@/types/Tournament/Sparring';
import type { ContextMenuItem } from '@/utils/ContextMenu';
import type { TournamentMatchDTO } from '@/types/Tournament/TournamentMatch';

import { ArrowBigRight, UserPlus } from 'lucide-react';
import YesNoQuestion from './YesNoQuestion';
import React from 'react';
import { isPoomsaeHistory } from '@/utils/PoomsaeCheck';
import ContextMenu from '@/utils/ContextMenu';

import { createTournamentMatch } from '@/services/tournament/TournamentMatch';
import { toast } from 'react-toastify';

interface NodeGroupProps {
    player1?: PoomsaeHistory | SparringHistory;
    player2?: PoomsaeHistory | SparringHistory;
    numberMatch?: number;
    targetNode?: number;
    participants?: number;
    content?: string;
    onRefresh?: () => Promise<void>;
}

type ModalMode = 'winner' | 'delete';

const NodeGroup = React.memo(function NodeGroup({ player1, player2, numberMatch, targetNode, participants, content, onRefresh }: NodeGroupProps) {
    const [showConfirmModal, setShowConfirmModal] = React.useState<boolean>(false);
    const [selectedPlayer, setSelectedPlayer] = React.useState<PoomsaeHistory | SparringHistory | null>(null);
    const [modalMode, setModalMode] = React.useState<ModalMode>('winner');

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
        if (onRefresh) {
            await onRefresh();
        }
    }, [modalMode, selectedPlayer, onRefresh]);

    /**
     * Handles cancellation of modal
     */
    const handleCancelSelection = React.useCallback(() => {
        setShowConfirmModal(false);
        setSelectedPlayer(null);
    }, []);


    const handleAddMatch = () => {
        const isPoomsae = isPoomsaeHistory(player1 ? player1 : player2 ? player2 : null);
        const newMatch: TournamentMatchDTO = {
            keyInfo: {
                tournament: 'a8d5c830-c275-41b0-a251-294eb61c007f', // Thay thế bằng ID giải đấu thực tế
                idCombination: isPoomsae
                    ? (player1?.referenceInfo.poomsaeCombination ?? player2?.referenceInfo.poomsaeCombination ?? '')
                    : (player1?.referenceInfo.sparringCombination ?? player2?.referenceInfo.sparringCombination ?? ''),
                targetNode: targetNode !== undefined ? targetNode : 0,
                participants: participants !== undefined ? participants : 0,
            },
            matchInfo: {
                tournamentType: isPoomsae ? 'POOMSAE' : 'SPARRING',
                startTime: null,
            }
        };
        try {
            createTournamentMatch(newMatch).then((createdMatch) => {
                console.log("Match added to queue:", createdMatch);
                toast.success('Đã thêm trận đấu vào danh sách chờ', { position: "top-right", autoClose: 3000, theme: "colored" });
            }).catch((error) => {
                console.error("Error adding match:", error);
                toast.error('Lỗi khi thêm trận đấu vào danh sách chờ', { position: "top-right", autoClose: 3000, theme: "colored" });
            });
        } catch (error) {
            console.error("Error adding match:", error);
            toast.error('Lỗi khi thêm trận đấu vào danh sách chờ', { position: "top-right", autoClose: 3000, theme: "colored" });
        }
    }

    const menuItems: ContextMenuItem[] = [
        {
            label: 'Thêm trận đấu',
            onClick: handleAddMatch,
            icon: <UserPlus size={16} />,
            hint: 'Thêm trận đấu vào danh sách chờ'
        },
    ]

    /**
     * Renders the match number if applicable
     */
    const renderMatchNumber = () => {
        if (targetNode !== undefined) {
            return (
                <ContextMenu items={menuItems}>
                    <div className="match-number" style={{ cursor: 'pointer' }}>
                        {targetNode === -1 ? `Trận tranh Huy Chương Đồng`
                            : targetNode === 0 ? `Trận tranh Huy Chương Vàng`
                                : `Trận ${numberMatch}`}
                    </div>
                </ContextMenu>
            );
        }
        return null;
    };

    /**
     * Renders the winner node
     */
    const renderWinnerNode = () => {
        const winner = player1?.hasWon ? player1 : player2?.hasWon ? player2 : undefined;
        return (
            <Node
                nodeStatus="won"
                targetNode={targetNode}
                participants={participants}
                player={winner}
                onRefresh={onRefresh}
            />
        );
    };

    // Tạo class CSS động dựa trên targetNode
    const getNodeGroupClass = () => {
        let baseClass = 'node-group-container';

        if (targetNode === -1) {
            baseClass += ' bronze-match-highlight'; // Tranh đồng hạng 3
        } else if (targetNode === 0) {
            baseClass += ' final-match-highlight';  // Chung kết tranh vàng
        }

        return baseClass;
    };

    return (
        <div className={getNodeGroupClass()} >
            {renderMatchNumber()}

            <div className='node-group'>
                <div className='node-pair'>
                    <PlayerNode
                        player={player1}
                        nodeStatus={player1 ? 'chung' : 'waiting'}
                        participants={participants}
                        onChooseWinner={handleChooseWinner}
                        onDeleteNode={handleDeleteNode}
                        content={content}
                        onRefresh={onRefresh}
                    />

                    <div className='vs' />

                    <PlayerNode
                        player={player2}
                        nodeStatus={player2 ? 'hong' : 'waiting'}
                        participants={participants}
                        onChooseWinner={handleChooseWinner}
                        onDeleteNode={handleDeleteNode}
                        content={content}
                        onRefresh={onRefresh}
                    />
                </div>

                <ArrowBigRight />

                {renderWinnerNode()}
            </div>

            <YesNoQuestion
                isOpen={showConfirmModal}
                mode={modalMode}
                player={selectedPlayer}
                participants={participants}
                onConfirm={handleConfirmAction}
                onCancel={handleCancelSelection}
            />
        </div>
    )
});

export default NodeGroup;