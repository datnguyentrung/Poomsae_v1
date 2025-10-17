import './MatchPending.scss';
import type { TournamentMatchDTO } from '@/types/Tournament/TournamentMatch';
import type { PoomsaeHistory } from '@/types/Tournament/Poomsae';
import type { SparringHistory } from '@/types/Tournament/Sparring';
import { AgeGroupMap, BeltGroupMap, getDisplayName, PoomsaeContentMap, GenderMap } from '@/constants/TournamentConstants';
import { PoomsaeSigmaLocalStorage } from '@/utils/PoomsaeSigmaStorage';
import { CopyPlus } from 'lucide-react';

type Props = {
    tournamentMatches: TournamentMatchDTO[];
    poomsaeMap?: Map<string, PoomsaeHistory[]>;
    sparringMap?: Map<string, SparringHistory[]>;
    onAddMatch?: (match: TournamentMatchDTO) => void;
}

export default function MatchPending({
    tournamentMatches,
    poomsaeMap = new Map(),
    sparringMap = new Map(),
    onAddMatch,
}: Props) {
    return (
        <div className="match-pending-section">
            <div className="pending-header">
                <h3>Trận đấu chờ lịch ({tournamentMatches.length})</h3>
            </div>

            {tournamentMatches.length === 0 ? (
                <div className="pending-empty">
                    <div className="empty-icon">⏰</div>
                    <div className="empty-text">Không có trận đấu nào chờ lịch</div>
                </div>
            ) : (
                <div className="pending-list">
                    {tournamentMatches.map((match, index) => {
                        const { targetNode, idCombination } = match.keyInfo;
                        const parentNodeData = PoomsaeSigmaLocalStorage.findByParentNodeInParticipants(targetNode, match.keyInfo.participants);

                        let player1: PoomsaeHistory | SparringHistory | undefined;
                        let player2: PoomsaeHistory | SparringHistory | undefined;
                        let contentName = '';

                        if (match.matchInfo.tournamentType === 'POOMSAE') {
                            const players = poomsaeMap
                                .get(idCombination)
                                ?.filter(p => p.nodeInfo.targetNode === targetNode)
                                .sort((a, b) => (a.nodeInfo.sourceNode || 0) - (b.nodeInfo.sourceNode || 0)) ?? [];
                            [player1, player2] = players;

                            const category = player1?.referenceInfo.poomsaeCategory || player2?.referenceInfo.poomsaeCategory;
                            contentName = `${getDisplayName(PoomsaeContentMap, category?.contentName || '')} - 
                            ${getDisplayName(BeltGroupMap, category?.beltGroupName || '')} - 
                            ${getDisplayName(AgeGroupMap, category?.ageGroupName || '')}`;

                        } else if (match.matchInfo.tournamentType === 'SPARRING') {
                            const players = sparringMap.get(idCombination) || [];
                            [player1, player2] = players;

                            const category = player1?.referenceInfo.sparringCategory || player2?.referenceInfo.sparringCategory;
                            contentName = `${getDisplayName(GenderMap, category?.gender || '')} - 
                            ${getDisplayName(AgeGroupMap, category?.ageGroupName || '')} -
                            ${category?.weightClass || ''}`;
                        }

                        return (
                            <div key={`pending-${index}`} className="pending-item">
                                <div className="pending-category">
                                    <span>{contentName}</span>
                                    <CopyPlus
                                        size={16}
                                        onClick={() => onAddMatch?.(match)}
                                    />
                                </div>
                                <div className="pending-players">
                                    <div className="pending-player player-chung">
                                        {player1?.referenceInfo.name || 'Chờ xác định'}
                                    </div>
                                    <div className="vs-separator">VS</div>
                                    <div className="pending-player player-hong">
                                        {player2?.referenceInfo.name || 'Chờ xác định'}
                                    </div>
                                </div>
                                <div className="pending-round">{parentNodeData?.round || 'Chưa xác định'}</div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    )
}