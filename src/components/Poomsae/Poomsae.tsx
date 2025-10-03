import React from 'react';
import Sigma from '../Sigma/Sigma';
import type { Player } from '../../types/types';

// Dữ liệu ban đầu - có thể thay đổi số lượng players
const initialPlayers: Player[] = [
    { id: 1, name: 'Player 1' },
    { id: 2, name: 'Player 2' },
    { id: 3, name: 'Player 3' },
    { id: 4, name: 'Player 4' },
    { id: 5, name: 'Player 5' },
    { id: 6, name: 'Player 6' },
    { id: 7, name: 'Player 7' },
    { id: 8, name: 'Player 8' },
    { id: 9, name: 'Player 9' },
    // { id: 10, name: 'Player 10' },
    // { id: 11, name: 'Player 11' },
    // { id: 12, name: 'Player 12' },
    // { id: 13, name: 'Player 13' },
    // { id: 14, name: 'Player 14' },
    // { id: 15, name: 'Player 15' },
    // { id: 16, name: 'Player 16' },
    // { id: 17, name: 'Player 17' },
    // { id: 18, name: 'Player 18' },
];

export default function Poomsae() {
    const [playerCount, setPlayerCount] = React.useState(9);
    const [players, setPlayers] = React.useState<Player[]>(initialPlayers);

    return (
        <div>
            Poomsae works!
            <div>
                <h2>Player Count</h2>
                <input
                    type="number"
                    value={playerCount}
                    onChange={(e) => setPlayerCount(Number(e.target.value))}
                />
            </div>

            <Sigma
                playerCount={playerCount + 1}
                players={players}
                onPlayersChange={setPlayers}
            />
        </div>
    )
}