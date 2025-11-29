import './SigmaRoundRobin.scss';
import type { PoomsaeHistory } from '@/types/Tournament/Poomsae';
import RoundRobinManager from './RoundRobinManager';
import React from 'react';

type Props = {
    players?: PoomsaeHistory[],
    participants?: number,
    content?: string,
    onRefresh?: () => Promise<void>,
    combinationId?: string | null
}

export default function SigmaRoundRobin({ players, participants, content, onRefresh, combinationId }: Props) {
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        // Simulate loading for consistency
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [participants, players?.length]);

    if (loading) {
        return (
            <div className='sigma-round-robin'>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    🔄 Đang tải Round Robin tournament...
                </div>
            </div>
        );
    }

    return (
        <div className='sigma-round-robin'>
            <RoundRobinManager
                players={players}
                participants={participants}
                content={content}
                onRefresh={onRefresh}
                combinationId={combinationId}
            />
        </div>
    );
}