import React from 'react';
import { useSearchParams } from 'react-router-dom';
import type { PoomsaeHistory } from '@/types/Tournament/Poomsae';
import Sigma from '../Sigma/Sigma';
import { getAllPoomsaeHistories } from '@/services/tournament/Poomsae/PoomsaeHistoryService';
import './PoomsaeSigma.scss';
// Dữ liệu ban đầu - có thể thay đổi số lượng players

const initialBeltGroup: Record<string, string> = {
    'Nhóm đai 1': 'Cấp đai trắng - vàng',
    'Nhóm đai 2': 'Cấp đai xanh lá - xanh dương',
    'Nhóm đai 3': 'Cấp đai đỏ 1 - đỏ 2',
    'Nhóm đai 4': 'Cấp đai đỏ 3 - đỏ 4',
};

export default function PoomsaeSigma() {
    const [searchParams] = useSearchParams();
    const [poomsaeHistories, setPoomsaeHistories] = React.useState<PoomsaeHistory[]>([]);
    const [filteredHistories, setFilteredHistories] = React.useState<PoomsaeHistory[]>([]);
    const [isDataFetched, setIsDataFetched] = React.useState(false);

    const combinationId = searchParams.get('combination');

    const participants = Number(searchParams.get('participants')) || 0; // Số vận động viên tham gia, có thể thay đổi tùy theo yêu cầu

    const poomsaeContent = searchParams.get('poomsaeContent') || '';
    const beltGroup = searchParams.get('beltGroup') || '';
    const ageGroup = searchParams.get('ageGroup') || '';

    const fetchPoomsaeHistories = React.useCallback(async () => {
        try {
            const histories = await getAllPoomsaeHistories();
            setPoomsaeHistories(histories);
            setIsDataFetched(true); // Đánh dấu đã fetch xong
        } catch (error) {
            console.error('Error fetching poomsae histories:', error);
        }
    }, []);

    const handleRefresh = React.useCallback(async () => {
        console.log('Refreshing Poomsae data...');
        await fetchPoomsaeHistories();
    }, [fetchPoomsaeHistories]);

    React.useEffect(() => {
        if (isDataFetched) return; // Ngăn gọi lại nếu đã fetch
        fetchPoomsaeHistories();
    }, [isDataFetched, fetchPoomsaeHistories])

    React.useEffect(() => {
        if (combinationId && poomsaeHistories.length > 0) {
            // Filter histories by combination ID
            const filtered = poomsaeHistories.filter(history =>
                history.referenceInfo?.poomsaeCombination === combinationId
            );
            setFilteredHistories(filtered);
            // console.log(`Filtered histories for combination ${combinationId}:`, filtered);
        } else {
            // If no combination ID, show all histories
            setFilteredHistories(poomsaeHistories);
        }
    }, [combinationId, poomsaeHistories]);

    // console.log("All Players:", poomsaeHistories);
    // console.log("Filtered Players:", filteredHistories);

    return (
        <div className="poomsae-sigma__container">
            {combinationId && (
                <div className="poomsae-sigma__header">
                    <h2 className="poomsae-sigma__title">
                        Sơ đồ thi đấu Poomsae
                    </h2>

                    <div className="poomsae-sigma__combination">
                        {poomsaeContent} - {beltGroup} - {ageGroup}
                    </div>

                    <div className="poomsae-sigma__info">
                        <div className="poomsae-sigma__info-item">
                            <div className="poomsae-sigma__info-icon">
                                🏆
                            </div>
                            <div className="poomsae-sigma__info-content">
                                <div className="label">Nhóm đai</div>
                                <div className="value">{initialBeltGroup[beltGroup]}</div>
                            </div>
                        </div>

                        <div className="poomsae-sigma__info-item">
                            <div className="poomsae-sigma__info-icon">
                                👥
                            </div>
                            <div className="poomsae-sigma__info-content">
                                <div className="label">Số vận động viên</div>
                                <div className="value">{participants} người</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="poomsae-sigma__sigma-container">
                {filteredHistories.length > 0 ? (
                    <Sigma players={filteredHistories} participants={participants} content={poomsaeContent} onRefresh={handleRefresh} />
                ) : (
                    <div className="poomsae-sigma__no-data">
                        <div className="icon">📊</div>
                        <div className="message">Chưa có dữ liệu thi đấu</div>
                    </div>
                )}
            </div>
        </div>
    )
}