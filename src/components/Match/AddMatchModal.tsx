import { useState } from 'react';
import './AddMatchModal.scss';
import type { TournamentMatchDTO } from '@/types/Tournament/TournamentMatch';
import type { PoomsaeHistory } from '@/types/Tournament/Poomsae';
import type { SparringHistory } from '@/types/Tournament/Sparring';
import { X, Plus, ArrowDown } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    tournamentMatches: TournamentMatchDTO[];
    poomsaeMap: Map<string, PoomsaeHistory[]>;
    sparringMap: Map<string, SparringHistory[]>;
    onAddMatch: (insertAfterMatch?: TournamentMatchDTO) => void;
    currentMatch: TournamentMatchDTO | null;
}

export default function AddMatchModal({
    isOpen,
    onClose,
    tournamentMatches,
    poomsaeMap,
    sparringMap,
    onAddMatch,
    currentMatch
}: Props) {
    const [isCustomPosition, setIsCustomPosition] = useState(false);
    const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

    // Lọc các match đã có relation
    const displayedMatches = tournamentMatches.filter(match =>
        match.relationInfo.leftMatch !== null
        || match.relationInfo.rightMatch !== null
        || match.keyInfo.firstNode
    );

    const handleAddDefault = () => {
        // Thêm vào cuối danh sách (sau match cuối cùng)
        // const lastMatch = displayedMatches[displayedMatches.length - 1];
        // console.log('displayedMatches:', displayedMatches);
        onAddMatch();
        onClose();
    };

    const handleAddCustom = () => {
        if (!selectedMatchId) return;

        const selectedMatch = displayedMatches.find(match =>
            `${match.keyInfo.tournament}-${match.keyInfo.idCombination}-${match.keyInfo.targetNode}` === selectedMatchId
        );

        if (selectedMatch) {
            onAddMatch(selectedMatch);
            onClose();
        }
    };

    const handleClose = () => {
        setIsCustomPosition(false);
        setSelectedMatchId(null);
        onClose();
    };

    const getMatchDisplayName = (match: TournamentMatchDTO, index: number) => {
        const { idCombination, targetNode } = match.keyInfo;
        let contentName = '';

        if (match.matchInfo.tournamentType === 'POOMSAE') {
            const players = poomsaeMap
                .get(idCombination)
                ?.filter(p => p.nodeInfo.targetNode === targetNode) ?? [];
            const category = players[0]?.referenceInfo.poomsaeCategory;
            contentName = `Poomsae - ${category?.contentName || 'N/A'}`;
        } else if (match.matchInfo.tournamentType === 'SPARRING') {
            const players = sparringMap
                .get(idCombination)
                ?.filter(s => s.nodeInfo.targetNode === targetNode) ?? [];
            const category = players[0]?.referenceInfo.sparringCategory;
            contentName = `Sparring - ${category?.gender || 'N/A'} ${category?.weightClass || ''}`;
        }

        return `#${index + 1} - ${contentName}`;
    };

    if (!isOpen) return null;

    return (
        <div className="add-match-modal-overlay">
            <div className="add-match-modal">
                <div className="modal-header">
                    <h3>Thêm trận đấu mới</h3>
                    <button className="close-btn" onClick={handleClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-content">
                    <div className="current-match-info">
                        <h4>Trận đấu hiện tại:</h4>
                        <div className="match-card">
                            {currentMatch ? getMatchDisplayName(currentMatch, 0) : 'N/A'}
                        </div>
                    </div>

                    <div className="position-options">
                        <div className="option">
                            <label>
                                <input
                                    type="radio"
                                    name="position"
                                    checked={!isCustomPosition}
                                    onChange={() => setIsCustomPosition(false)}
                                />
                                <span className="option-title">Thêm vào cuối danh sách</span>
                                <span className="option-desc">Trận đấu mới sẽ được thêm sau trận cuối cùng</span>
                            </label>
                        </div>

                        <div className="option">
                            <label>
                                <input
                                    type="radio"
                                    name="position"
                                    checked={isCustomPosition}
                                    onChange={() => setIsCustomPosition(true)}
                                />
                                <span className="option-title">Chọn vị trí tùy chỉnh</span>
                                <span className="option-desc">Chọn trận đấu để thêm mới phía sau</span>
                            </label>
                        </div>
                    </div>

                    {isCustomPosition && (
                        <div className="custom-position">
                            <h4>Chọn vị trí thêm:</h4>
                            <div className="matches-list">
                                {displayedMatches.map((match, index) => {
                                    const matchId = `${match.keyInfo.tournament}-${match.keyInfo.idCombination}-${match.keyInfo.targetNode}`;
                                    return (
                                        <div
                                            key={matchId}
                                            className={`match-item ${selectedMatchId === matchId ? 'selected' : ''}`}
                                            onClick={() => setSelectedMatchId(matchId)}
                                        >
                                            <div className="match-info">
                                                {getMatchDisplayName(match, index)}
                                            </div>
                                            {selectedMatchId === matchId && (
                                                <div className="insert-indicator">
                                                    <ArrowDown size={16} />
                                                    <span>Thêm trận mới ở đây</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-actions">
                    <button className="cancel-btn" onClick={handleClose}>
                        Hủy
                    </button>
                    <button
                        className="add-btn"
                        onClick={isCustomPosition ? handleAddCustom : handleAddDefault}
                        disabled={isCustomPosition && !selectedMatchId}
                    >
                        <Plus size={16} />
                        Thêm trận đấu
                    </button>
                </div>
            </div>
        </div>
    );
}