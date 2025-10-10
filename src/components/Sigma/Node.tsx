import './Node.scss'
import type { SigmaData } from '@/types/types';
import type { PoomsaeHistory } from '@/types/Tournament/Poomsae';
import type { SparringHistory } from '@/types/Tournament/Sparring';
import { PoomsaeSigmaLocalStorage } from '@/utils/PoomsaeSigmaStorage';
import React from 'react';

type Props = {
    player?: PoomsaeHistory | SparringHistory,
    nodeStatus: string, // 'won', 'chung', 'hong', 'waiting'
    targetNode?: number,
    participants?: number,
    onChooseWinner?: (player: PoomsaeHistory | SparringHistory) => void,
}

export default function Node({ player, nodeStatus, targetNode, participants, onChooseWinner }: Props) {
    const [goalNode, setGoalNode] = React.useState<SigmaData | null>(null);
    React.useEffect(() => {
        if (nodeStatus === 'won') {
            const fetchGoalNode = async () => {
                if (targetNode !== undefined) {
                    let node: SigmaData | null = null;

                    if (participants) {
                        // Tìm trong bảng participants cụ thể
                        node = PoomsaeSigmaLocalStorage.findByChildNodeInParticipants(targetNode, participants);
                    } else {
                        // Fallback: tìm trong tất cả bảng (cách cũ)
                        node = PoomsaeSigmaLocalStorage.findByChildNode(targetNode);
                    }

                    setGoalNode(node);
                }
            }
            fetchGoalNode();
        }
    }, [nodeStatus, targetNode, participants]);

    return (
        <div className='node-container' onClick={() => {
            if (player && onChooseWinner) {
                onChooseWinner(player);
            }
        }}>
            {nodeStatus !== 'won' && <div>{player?.nodeInfo.sourceNode}</div>}
            <div className={`${nodeStatus === 'won' ? 'node-won' : ''}`}>
                <div>
                    {nodeStatus === 'won' && goalNode && (
                        <div>{goalNode.round} {targetNode !== undefined && targetNode !== 0 ? `- Trận ${goalNode.match}` : ''}</div>
                    )}
                </div>
                <div className={`node ${nodeStatus === 'won'
                    ? 'node-won' : nodeStatus === 'chung'
                        ? 'node-chung' : nodeStatus === 'hong'
                            ? 'node-hong' : nodeStatus === 'waiting' ? 'node-waiting' : ''}`}>
                    {/* {player && player.name ? player.name : 'Nhập họ và tên' ?  : 'Đang chờ...'} */}
                    {!player
                        ? 'Đang chờ...'
                        : !player.referenceInfo.name || player.referenceInfo.name.trim() === ''
                            ? 'Nhập họ và tên'
                            : player.referenceInfo.name}
                </div>
            </div>
        </div>
    )
}