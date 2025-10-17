import './Node.scss'
import type { SigmaData } from '@/types/types';
import type { PoomsaeHistory } from '@/types/Tournament/Poomsae';
import type { SparringHistory } from '@/types/Tournament/Sparring';
import { PoomsaeSigmaLocalStorage } from '@/utils/PoomsaeSigmaStorage';
import React from 'react';
import { Edit2, Trash2, Eye, Crown, UserPlus } from 'lucide-react';
import ContextMenu, { type ContextMenuItem } from '@/utils/ContextMenu';

type Props = {
    player?: PoomsaeHistory | SparringHistory,
    nodeStatus: string, // 'won', 'chung', 'hong', 'waiting'
    targetNode?: number,
    participants?: number,
    onChooseWinner?: (player: PoomsaeHistory | SparringHistory) => void,
    onDeleteNode?: (player: PoomsaeHistory | SparringHistory) => void,
    content?: string,
    onRefresh?: () => Promise<void>,
}

const Node = React.memo(function Node({ player, nodeStatus, targetNode, participants, onChooseWinner, onDeleteNode, content, onRefresh }: Props) {
    const [goalNode, setGoalNode] = React.useState<SigmaData | null>(null);
    const [useTextIndicator, setUseTextIndicator] = React.useState(false); // Toggle between icon and text

    // console.log('PLayer in Node component:', player);

    // Kiểm tra xem có phải là content đôi nam nữ hoặc đồng đội nam nữ không
    const isTeamContent = content && (
        content.toLowerCase().includes('đôi nam nữ') ||
        content.toLowerCase().includes('đồng đội nam nữ')
    );

    // Context Menu Handlers
    const handleViewPlayer = () => {
        if (player) {
            console.log("Xem thông tin player:", player.referenceInfo.name);
            // TODO: Implement view player details modal
        }
    };

    const handleEditPlayer = () => {
        if (player) {
            console.log("Chỉnh sửa player:", player.referenceInfo.name);
            // TODO: Implement edit player modal
        }
    };

    const handleSetWinner = React.useCallback(async () => {
        if (player && onChooseWinner) {
            onChooseWinner(player);
            console.log("Đặt làm người thắng:", player.referenceInfo.name);

            // Re-fetch data sau khi thay đổi
            if (onRefresh) {
                await onRefresh();
            }
        }
    }, [player, onChooseWinner, onRefresh]);

    const handleRemovePlayer = React.useCallback(async () => {
        if (player && onDeleteNode) {
            console.log("Xóa player:", player.referenceInfo.name);
            onDeleteNode(player);

            // Re-fetch data sau khi xóa
            if (onRefresh) {
                await onRefresh();
            }
        }
    }, [player, onDeleteNode, onRefresh]);

    const handleAddPlayer = () => {
        console.log("Thêm player vào node");
        // TODO: Implement add player modal
    };

    const toggleLeaderIndicator = () => {
        setUseTextIndicator(!useTextIndicator);
    };

    // Menu items dựa trên trạng thái của node
    const menuItems: ContextMenuItem[] = [
        ...(player ? [
            {
                label: "Xem thông tin",
                onClick: handleViewPlayer,
                icon: <Eye size={16} />,
                hint: "Ctrl+I"
            },
            {
                label: "Chỉnh sửa thông tin",
                onClick: handleEditPlayer,
                icon: <Edit2 size={16} />,
                hint: "F2"
            },
            ...(nodeStatus !== 'won' && onChooseWinner ? [{
                label: "Đặt làm người thắng",
                onClick: handleSetWinner,
                icon: <Crown size={16} />,
                hint: "Enter"
            }] : []),
            ...(isTeamContent ? [{
                label: useTextIndicator ? "Hiển thị dạng huy hiệu" : "Hiển thị dạng chữ nổi",
                onClick: toggleLeaderIndicator,
                icon: <Crown size={16} />,
                hint: "Ctrl+L"
            }] : []),
            { type: "divider" as const, label: "" },
            {
                label: "Xóa khỏi trận đấu",
                onClick: handleRemovePlayer,
                icon: <Trash2 size={16} />,
                hint: "Del"
            },
        ] : [
            {
                label: "Thêm vận động viên",
                onClick: handleAddPlayer,
                icon: <UserPlus size={16} />,
                hint: "Ctrl+N"
            }
        ])
    ];

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
        <div className='node-container'>
            {/* Note: Winner selection is now only available through Context Menu → "Đặt làm người thắng" */}
            {nodeStatus !== 'won' && <div>{player?.nodeInfo.sourceNode}</div>}
            <ContextMenu items={menuItems}>
                <div className={`${nodeStatus === 'won' ? 'node-won' : ''}`}>
                    <div>
                        {nodeStatus === 'won' && goalNode && (
                            <div>{goalNode.round} {targetNode !== undefined && targetNode !== 0 ? `- Trận ${goalNode.match}` : ''}</div>
                        )}
                    </div>
                    <div className={`node ${nodeStatus === 'won'
                        ? 'node-won' : nodeStatus === 'chung'
                            ? 'node-chung' : nodeStatus === 'hong'
                                ? 'node-hong' : nodeStatus === 'waiting' ? 'node-waiting' : ''} ${isTeamContent ? 'node-team' : ''}`}>
                        {/* Leader indicator cho content đôi nam nữ hoặc đồng đội nam nữ */}
                        {isTeamContent && player && (
                            <>
                                {useTextIndicator ? (
                                    <div className="node-leader-text">
                                        Trưởng nhóm
                                    </div>
                                ) : (
                                    <div className="node-leader-indicator">
                                        <span className="leader-text">Trưởng nhóm</span>
                                    </div>
                                )}
                            </>
                        )}

                        {/* {player && player.name ? player.name : 'Nhập họ và tên' ?  : 'Đang chờ...'} */}
                        {!player
                            ? 'Đang chờ...'
                            : !player.referenceInfo.name || player.referenceInfo.name.trim() === ''
                                ? 'Nhập họ và tên'
                                : player.referenceInfo.name}
                    </div>
                </div>
            </ContextMenu>
        </div>
    )
});

export default Node;