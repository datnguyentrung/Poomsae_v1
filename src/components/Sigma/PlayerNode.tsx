import React from 'react';
import { Delete } from 'lucide-react';
import Node from './Node';
import './PlayerNode.scss';
import type { PoomsaeHistory } from '@/types/Tournament/Poomsae';
import type { SparringHistory } from '@/types/Tournament/Sparring';
import { PoomsaeSigmaLocalStorage } from '@/utils/PoomsaeSigmaStorage';

interface PlayerNodeProps {
    /** Player data for the node */
    player?: PoomsaeHistory | SparringHistory;
    /** Visual status of the node ('chung', 'hong', 'waiting', etc.) */
    nodeStatus: string;
    /** Number of participants in the tournament */
    participants?: number;
    /** Callback when a winner is chosen */
    onChooseWinner: (player: PoomsaeHistory | SparringHistory) => void;
    /** Callback when a player node is deleted */
    onDeleteNode: (player: PoomsaeHistory | SparringHistory) => void;
    /** Poomsae content for context (if applicable) */
    content?: string;
    /** Callback to refresh data after changes */
    onRefresh?: () => Promise<void>;
}

/**
 * PlayerNode component represents a player in the tournament bracket
 * with optional delete functionality based on tournament structure
 */
const PlayerNode: React.FC<PlayerNodeProps> = React.memo(({
    player,
    nodeStatus,
    participants,
    onChooseWinner,
    onDeleteNode,
    content,
    onRefresh
}) => {
    const [canDelete, setCanDelete] = React.useState<boolean>(false);

    React.useEffect(() => {
        const checkDeletability = async () => {
            if (!player?.nodeInfo.sourceNode) {
                setCanDelete(false);
                return;
            }

            try {
                let sigmaData: import('@/types/types').SigmaData | null = null;

                if (participants) {
                    // Tìm trong bảng participants cụ thể
                    sigmaData = PoomsaeSigmaLocalStorage.findByChildNodeInParticipants(player.nodeInfo.sourceNode, participants);
                } else {
                    // Fallback: tìm trong tất cả bảng (cách cũ)
                    sigmaData = PoomsaeSigmaLocalStorage.findByChildNode(player.nodeInfo.sourceNode);
                }

                // console.log(`Sigma Data for deletability check (participants: ${participants}):`, sigmaData);
                // console.log("Bracket Nodes Length:", sigmaData?.bracketNodes?.length);
                setCanDelete(sigmaData?.bracketNodes?.length !== 1);
            } catch (error) {
                console.error("Error checking player deletability:", error);
                setCanDelete(false);
            }
        };

        // Add a small delay to prevent excessive API calls
        const timeoutId = setTimeout(checkDeletability, 100);

        return () => clearTimeout(timeoutId);
    }, [player?.nodeInfo.sourceNode, participants]);

    const handleDeleteClick = React.useCallback(() => {
        if (player) {
            onDeleteNode(player);
        }
    }, [player, onDeleteNode]);

    return (
        <div className="player-node-container">
            <Node
                player={player}
                nodeStatus={nodeStatus}
                participants={participants}
                onChooseWinner={onChooseWinner}
                content={content}
                onRefresh={onRefresh}
            />
            {canDelete && player && (
                <Delete
                    className="player-delete-icon"
                    onClick={handleDeleteClick}
                    size={16}
                    aria-label={`Xóa ${player.referenceInfo?.name || 'người chơi'}`}
                />
            )}
        </div>
    );
});

PlayerNode.displayName = 'PlayerNode';

export default PlayerNode;