import './Sigma.scss';

type Player = {
    id: number;
    name: string;
}

type Match = {
    id: number;
    player1?: Player;
    player2?: Player;
    winner?: Player;
    round: number;
}

// Dữ liệu mẫu cho 8 người chơi (có thể mở rộng lên 16, 32...)
const initialPlayers: Player[] = [
    { id: 1, name: 'Player 1' },
    { id: 2, name: 'Player 2' },
    { id: 3, name: 'Player 3' },
    { id: 4, name: 'Player 4' },
    { id: 5, name: 'Player 5' },
    { id: 6, name: 'Player 6' },
    { id: 7, name: 'Player 7' },
    { id: 8, name: 'Player 8' },
];

// Tạo bracket tự động
const createBracket = (players: Player[]): Match[] => {
    const matches: Match[] = [];
    let matchId = 1;

    // Round 1: Tạo các trận đấu đầu tiên
    const round1Matches: Match[] = [];
    for (let i = 0; i < players.length; i += 2) {
        const match: Match = {
            id: matchId++,
            player1: players[i],
            player2: players[i + 1],
            winner: i === 0 ? players[i + 1] : players[i], // Mẫu winner
            round: 1
        };
        round1Matches.push(match);
        matches.push(match);
    }

    // Tạo các round tiếp theo
    let currentRoundMatches = round1Matches;
    let round = 2;

    while (currentRoundMatches.length > 1) {
        const nextRoundMatches: Match[] = [];

        for (let i = 0; i < currentRoundMatches.length; i += 2) {
            const match1 = currentRoundMatches[i];
            const match2 = currentRoundMatches[i + 1];

            const match: Match = {
                id: matchId++,
                player1: match1.winner,
                player2: match2?.winner,
                winner: match1.winner, // Mẫu winner
                round: round
            };

            nextRoundMatches.push(match);
            matches.push(match);
        }

        currentRoundMatches = nextRoundMatches;
        round++;
    }

    return matches;
};

export default function SigmaTest() {
    const matches = createBracket(initialPlayers);
    const maxRound = Math.max(...matches.map(m => m.round));

    // Nhóm matches theo round
    const roundsData: { [key: number]: Match[] } = {};
    matches.forEach(match => {
        if (!roundsData[match.round]) {
            roundsData[match.round] = [];
        }
        roundsData[match.round].push(match);
    });

    return (
        <div className="sigmaContainer">
            <h1 className='sigmaTitle'>Tournament Bracket</h1>
            <div className='bracket'>
                {Array.from({ length: maxRound }, (_, i) => i + 1).map(round => (
                    <div key={round} className='round'>
                        <h3 className='roundTitle'>
                            {round === maxRound ? 'Final' : `Round ${round}`}
                        </h3>
                        <div className='matches'>
                            {roundsData[round]?.map(match => (
                                <div key={match.id} className='match'>
                                    <div className={`player ${match.winner?.id === match.player1?.id ? 'winner' : ''}`}>
                                        {match.player1?.name || 'TBD'}
                                    </div>
                                    <div className='connector'></div>
                                    <div className={`player ${match.winner?.id === match.player2?.id ? 'winner' : ''}`}>
                                        {match.player2?.name || 'TBD'}
                                    </div>
                                    <div className='bracket-line'></div>
                                    <div className='winner-display'>
                                        {match.winner?.name || 'TBD'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}