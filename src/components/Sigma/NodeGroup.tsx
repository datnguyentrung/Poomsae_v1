import './NodeGroup.scss'
import Node from "./Node";
import PlayerNode from "./PlayerNode";
import type { PoomsaeHistory } from '@/types/Tournament/Poomsae';
import type { SparringHistory } from '@/types/Tournament/Sparring';
import { ArrowBigRight } from 'lucide-react';
import YesNoQuestion from './YesNoQuestion';
import React from 'react';

interface NodeGroupProps {
    player1?: PoomsaeHistory | SparringHistory;
    player2?: PoomsaeHistory | SparringHistory;
    numberMatch?: number;
    targetNode?: number;
    participants?: number;
}

type ModalMode = 'winner' | 'delete';

export default function NodeGroup({ player1, player2, numberMatch, targetNode, participants }: NodeGroupProps) {
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
    const handleConfirmAction = React.useCallback(() => {
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
    }, [modalMode, selectedPlayer]);

    /**
     * Handles cancellation of modal
     */
    const handleCancelSelection = React.useCallback(() => {
        setShowConfirmModal(false);
        setSelectedPlayer(null);
    }, []);

    /**
     * Renders the match number if applicable
     */
    const renderMatchNumber = () => {
        if (targetNode !== undefined && targetNode !== 0 && numberMatch !== undefined) {
            return (
                <div className="match-number">
                    Trận {numberMatch}
                </div>
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
            />
        );
    };

    return (
        <div className='node-group-container'>
            {renderMatchNumber()}

            <div className='node-group'>
                <div className='node-pair'>
                    <PlayerNode
                        player={player1}
                        nodeStatus={player1 ? 'chung' : 'waiting'}
                        participants={participants}
                        onChooseWinner={handleChooseWinner}
                        onDeleteNode={handleDeleteNode}
                    />

                    <div className='vs' />

                    <PlayerNode
                        player={player2}
                        nodeStatus={player2 ? 'hong' : 'waiting'}
                        participants={participants}
                        onChooseWinner={handleChooseWinner}
                        onDeleteNode={handleDeleteNode}
                    />
                </div>

                <ArrowBigRight />

                {renderWinnerNode()}
            </div>

            {/* Test buttons cho demo 2 modes */}
            {/* <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                {player1 && (
                    <button
                        onClick={() => handleDeleteNode(player1)}
                        style={{ padding: '0.5rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.8rem' }}
                    >
                        Xóa {player1.referenceInfo?.name}
                    </button>
                )}
                {player2 && (
                    <button
                        onClick={() => handleDeleteNode(player2)}
                        style={{ padding: '0.5rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.8rem' }}
                    >
                        Xóa {player2.referenceInfo?.name}
                    </button>
                )}
            </div> */}

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
}