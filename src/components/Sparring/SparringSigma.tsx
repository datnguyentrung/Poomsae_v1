import React from 'react';
import { useSearchParams } from 'react-router-dom';
import type { SparringHistory } from '@/types/Tournament/Sparring';
import Sigma from '../Sigma/Sigma';
import { getAllSparringHistories } from '@/services/tournament/Sparring/SparringHistoryService';
import './SparringSigma.scss';
// Dữ liệu ban đầu - có thể thay đổi số lượng players

export default function SparringSigma() {
    const [searchParams] = useSearchParams();
    const [sparringHistories, setSparringHistories] = React.useState<SparringHistory[]>([]);
    const [filteredHistories, setFilteredHistories] = React.useState<SparringHistory[]>([]);
    const [isDataFetched, setIsDataFetched] = React.useState(false);

    const combinationId = searchParams.get('combination');

    const participants = Number(searchParams.get('participants')) || 0; // Số vận động viên tham gia, có thể thay đổi tùy theo yêu cầu

    const ageGroup = searchParams.get('ageGroup') || '';
    const weightClass = searchParams.get('weightClass') || '';

    const fetchSparringHistories = React.useCallback(async () => {
        try {
            const histories = await getAllSparringHistories();
            setSparringHistories(histories);
            setIsDataFetched(true); // Đánh dấu đã fetch xong
        } catch (error) {
            console.error('Error fetching sparring histories:', error);
        }
    }, []);

    const handleRefresh = React.useCallback(async () => {
        console.log('Refreshing Sparring data...');
        await fetchSparringHistories();
    }, [fetchSparringHistories]);

    React.useEffect(() => {
        if (isDataFetched) return; // Ngăn gọi lại nếu đã fetch
        fetchSparringHistories();
    }, [isDataFetched, fetchSparringHistories])

    React.useEffect(() => {
        if (combinationId && sparringHistories.length > 0) {
            // Filter histories by combination ID
            const filtered = sparringHistories.filter(history =>
                history.referenceInfo?.sparringCombination === combinationId
            );
            setFilteredHistories(filtered);
            // console.log(`Filtered histories for combination ${combinationId}:`, filtered);
        } else {
            // If no combination ID, show all histories
            setFilteredHistories(sparringHistories);
        }
    }, [combinationId, sparringHistories]);

    // console.log("All Players:", sparringHistories);
    // console.log("Filtered Players:", filteredHistories);

    return (
        <div className="sparring-sigma__container">
            {combinationId && (
                <div className="sparring-sigma__header">
                    <h2 className="sparring-sigma__title">
                        Sơ đồ thi đấu Đối kháng
                    </h2>
                    
                    <div className="sparring-sigma__combination">
                        {ageGroup} - {weightClass}
                    </div>
                    
                    <div className="sparring-sigma__info">
                        <div className="sparring-sigma__info-item">
                            <div className="sparring-sigma__info-icon">
                                🏆
                            </div>
                            <div className="sparring-sigma__info-content">
                                <div className="label">Nhóm tuổi</div>
                                <div className="value">{ageGroup}</div>
                            </div>
                        </div>
                        
                        <div className="sparring-sigma__info-item">
                            <div className="sparring-sigma__info-icon">
                                ⚖️
                            </div>
                            <div className="sparring-sigma__info-content">
                                <div className="label">Hạng cân</div>
                                <div className="value">{weightClass}</div>
                            </div>
                        </div>
                        
                        <div className="sparring-sigma__info-item">
                            <div className="sparring-sigma__info-icon">
                                👥
                            </div>
                            <div className="sparring-sigma__info-content">
                                <div className="label">Số vận động viên</div>
                                <div className="value">{participants} người</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="sparring-sigma__sigma-container">
                {filteredHistories.length > 0 ? (
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    <Sigma players={filteredHistories as any} participants={participants} onRefresh={handleRefresh} />
                ) : (
                    <div className="sparring-sigma__no-data">
                        <div className="icon">📊</div>
                        <div className="message">Chưa có dữ liệu thi đấu</div>
                    </div>
                )}
            </div>
        </div>
    )
}