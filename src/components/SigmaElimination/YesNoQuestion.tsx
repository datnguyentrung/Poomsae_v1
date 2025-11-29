import './YesNoQuestion.scss'
import React from 'react';
import type { PoomsaeHistory } from '@/types/Tournament/Poomsae';
import type { SparringHistory } from '@/types/Tournament/Sparring';
import { createPoomsaeEliminationWinner, deletePoomsaeHistoryForElimination } from '@/services/tournament/Poomsae/PoomsaeHistoryService';
import { createPortal } from 'react-dom';
import { createSparringWinner, deleteSparringHistory } from '@/services/tournament/Sparring/SparringHistoryService';

type ModalMode = 'winner' | 'delete';

type Props = {
    isOpen: boolean;
    mode: ModalMode;
    player: PoomsaeHistory | SparringHistory | null;
    participants?: number;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function YesNoQuestion({ isOpen, mode, player, participants, onConfirm, onCancel }: Props) {
    // Xử lý phím ESC để đóng modal
    React.useEffect(() => {
        const handleEscapeKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onCancel();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
            // Ngăn scroll body khi modal mở
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onCancel]);

    if (!isOpen || !player) return null;

    const handleConfirm = async () => {
        try {
            if ('idPoomsaeHistory' in player) {
                // player là PoomsaeHistory
                if (mode === 'winner') {
                    await createPoomsaeEliminationWinner(participants || 0, player);
                    console.log('Poomsae winner confirmed:', player.referenceInfo?.name);
                } else if (mode === 'delete') {
                    await deletePoomsaeHistoryForElimination(player.idPoomsaeHistory, participants || 0);
                    console.log('Poomsae node deletion confirmed for:', player.referenceInfo?.name);
                }
            }
            else if ('idSparringHistory' in player) {
                // player là SparringHistory
                if (mode === 'winner') {
                    await createSparringWinner(participants || 0, player);
                    console.log('Sparring winner confirmed:', player.referenceInfo?.name);
                } else if (mode === 'delete') {
                    await deleteSparringHistory(player.idSparringHistory, participants || 0);
                    console.log('Sparring node deletion confirmed for:', player.referenceInfo?.name);
                }
            }

            onConfirm();
        } catch (error) {
            console.error('Error in handleConfirm:', error);
        }
    };

    // Tạo nội dung động dựa trên mode
    const getModalContent = () => {
        if (mode === 'winner') {
            return {
                title: 'Xác nhận người chiến thắng',
                message: `Bạn có chắc chắn muốn chọn ${player.referenceInfo?.name} là người chiến thắng không?`,
                confirmText: 'Xác nhận',
                confirmClass: 'btn-confirm-winner'
            };
        } else {
            return {
                title: 'Xác nhận xóa node',
                message: `Bạn có chắc chắn muốn xóa node của ${player.referenceInfo?.name} không?`,
                confirmText: 'Xóa',
                confirmClass: 'btn-confirm-delete'
            };
        }
    };

    const modalContent = getModalContent();

    // Xử lý click outside để đóng modal
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    return createPortal(
        <div className="yes-no-modal-overlay" onClick={handleOverlayClick}>
            <div className={`yes-no-modal ${mode === 'delete' ? 'delete-mode' : 'winner-mode'}`}>
                <div className="modal-header">
                    <h3>{modalContent.title}</h3>
                </div>

                <div className="modal-content">
                    <p>{modalContent.message}</p>

                    <div className="player-info">
                        <div className="player-details">
                            <span className="player-name">{player.referenceInfo?.name}</span>
                            <span className="player-id">
                                ID:{' '}
                                {'idPoomsaeHistory' in player
                                    ? player.idPoomsaeHistory
                                    : player.idSparringHistory}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="btn-cancel" onClick={onCancel}>
                        Hủy
                    </button>
                    <button className={`btn-confirm ${modalContent.confirmClass}`} onClick={handleConfirm}>
                        {modalContent.confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}