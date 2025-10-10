import React from 'react';
import { useSearchParams } from 'react-router-dom';
import type { SparringHistory } from '@/types/Tournament/Sparring';
import Sigma from '../Sigma/Sigma';
import { getAllSparringHistories } from '@/services/tournament/Sparring/SparringHistoryService';
// Dữ liệu ban đầu - có thể thay đổi số lượng players

export default function SparringSigma() {
    const [searchParams] = useSearchParams();
    const [sparringHistories, setSparringHistories] = React.useState<SparringHistory[]>([]);
    const [filteredHistories, setFilteredHistories] = React.useState<SparringHistory[]>([]);
    const [isDataFetched, setIsDataFetched] = React.useState(false);

    const combinationId = searchParams.get('combination');

    const participants = Number(searchParams.get('participants')) || 0; // Số vận động viên tham gia, có thể thay đổi tùy theo yêu cầu

    React.useEffect(() => {
        if (isDataFetched) return; // Ngăn gọi lại nếu đã fetch

        const fetchSparringHistories = async () => {
            try {
                const histories = await getAllSparringHistories();
                setSparringHistories(histories);
                setIsDataFetched(true); // Đánh dấu đã fetch xong
            } catch (error) {
                console.error('Error fetching sparring histories:', error);
            }
        };

        fetchSparringHistories();
    }, [isDataFetched])

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
        <div>
            {combinationId && (
                <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', marginBottom: '1rem', borderRadius: '0.5rem' }}>
                    {/* <p>Hiển thị sơ đồ thi đấu cho nội dung: <strong>{participants}</strong></p> */}
                    <p>Số vận động viên: <strong>{participants}</strong></p>
                </div>
            )}
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Sigma players={filteredHistories as any} participants={participants} />
        </div>
    )
}