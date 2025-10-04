import React from 'react';
import type { PoomsaeHistory } from '@/types/types';
import Sigma from '../Sigma/Sigma';
import { getAllPoomsaeHistories } from '@/services/PoomsaeHistoryService';
// Dữ liệu ban đầu - có thể thay đổi số lượng players

export default function PoomsaeSigma() {
    const [poomsaeHistories, setPoomsaeHistories] = React.useState<PoomsaeHistory[]>([]);

    React.useEffect(() => {
        const fetchPoomsaeHistories = async () => {
            const histories = await getAllPoomsaeHistories();
            setPoomsaeHistories(histories);
        };

        fetchPoomsaeHistories();
    }, [])

    // console.log("Players:", players);

    return (
        <div>
            <div>
                <h2>Player Count</h2>
                <pre>{poomsaeHistories.length}</pre>
            </div>
            <Sigma players={poomsaeHistories} participants={poomsaeHistories.length} />
        </div>
    )
}