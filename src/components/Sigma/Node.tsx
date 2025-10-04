import './Node.scss'
import type { PoomsaeHistory, SigmaData } from '@/types/types';
import { PoomsaeSigmaLocalStorage } from '@/utils/PoomsaeSigmaStorage';
import React from 'react';

type Props = {
    player?: PoomsaeHistory,
    hasWon: boolean,
    targetNode?: number,
}

export default function Node({ player, hasWon, targetNode }: Props) {
    const [goalNode, setGoalNode] = React.useState<SigmaData | null>(null);
    React.useEffect(() => {
        if (hasWon) {
            const fetchGoalNode = async () => {
                if (targetNode !== undefined) {
                    const node = await PoomsaeSigmaLocalStorage.findByChildNode(targetNode);
                    setGoalNode(node);
                }
            }
            fetchGoalNode();
        }
    }, [hasWon, targetNode]);

    return (
        <div className={`${hasWon ? 'node-won' : ''}`}>
            <div>
                {hasWon && goalNode && (
                    <div>{goalNode.round} {targetNode !== undefined && targetNode !== 0 ? `- Trận ${goalNode.match}` : ''}</div>
                )}
            </div>
            <div className={`node ${hasWon ? 'node-won' : ''}`}>
                {player ? player.name : 'Đang chờ...'}
            </div>
        </div>
    )
}