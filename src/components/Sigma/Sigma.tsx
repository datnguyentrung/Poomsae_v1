import './Sigma.scss'
import SigmaBoxDouble from "./SigmaBoxDouble/SigmaBoxDouble"
import type { Player, TournamentBracketProps } from '../../types/types';


export default function Sigma({ playerCount, players, onPlayersChange }: TournamentBracketProps) {

    const getTournamentStructure = () => {
        const totalRounds = Math.ceil(Math.log2(playerCount));
        const firstRoundMatches = Math.floor(playerCount / 2);

        return {
            totalRounds,
            firstRoundMatches,
            matchesPerRound: Array.from({ length: totalRounds },
                (_, i) => Math.ceil(firstRoundMatches / Math.pow(2, i))
            )
        }
    }

    const structure = getTournamentStructure();

    // Tạo mảng players đủ cho tất cả các rounds
    const getTotalPlayersNeeded = () => {
        let total = 0;
        structure.matchesPerRound.forEach(matchCount => {
            total += matchCount * 2;
        });
        return total;
    };

    // Khởi tạo mảng players đầy đủ nếu cần
    const ensurePlayersArray = () => {
        const totalNeeded = getTotalPlayersNeeded();
        if (players.length < totalNeeded) {
            const extendedPlayers = [...players];
            // Thêm các placeholder players cho các rounds sau
            for (let i = players.length; i < totalNeeded; i++) {
                extendedPlayers.push({ id: i + 1, name: '' });
            }
            onPlayersChange(extendedPlayers);
            return extendedPlayers;
        }
        return players;
    };

    const handlePlayerNameChange = (index: number, name: string) => {
        const currentPlayersArray = ensurePlayersArray();
        const updatedPlayers = [...currentPlayersArray];
        updatedPlayers[index] = { ...updatedPlayers[index], name };
        onPlayersChange(updatedPlayers);
    }

    const advanceWinner = (roundIndex: number, matchIndex: number, winner: Player) => {
        console.log(`Advancing winner: ${winner.name} from Round ${roundIndex + 1}, Match ${matchIndex + 1}`);

        // Logic để đưa winner vào round tiếp theo
        if (roundIndex < structure.totalRounds - 1) {
            const currentPlayersArray = ensurePlayersArray();
            const updatedPlayers = [...currentPlayersArray];

            // Tính target index cho round tiếp theo
            const nextRoundStartIndex = getStartIndexForRound(roundIndex + 1);
            const targetIndex = nextRoundStartIndex + Math.floor(matchIndex / 2);

            console.log('targetIndex:', targetIndex, 'nextRoundStartIndex:', nextRoundStartIndex, 'matchIndex:', matchIndex);

            // Đảm bảo targetIndex hợp lệ
            if (targetIndex < updatedPlayers.length) {
                updatedPlayers[targetIndex] = winner;
                onPlayersChange(updatedPlayers);
                console.log('updated players: ', updatedPlayers);
            } else {
                console.warn(`targetIndex ${targetIndex} vượt quá chiều dài players (${updatedPlayers.length})`);
            }
        }
    }

    // Helper function để tính start index cho mỗi round
    const getStartIndexForRound = (roundIndex: number) => {
        let startIndex = 0;
        for (let i = 0; i < roundIndex; i++) {
            startIndex += structure.matchesPerRound[i] * 2;
        }
        return startIndex;
    }

    // console.log('Tournament Structure:', structure);

    return (
        <div className="sigmaContainer">
            <h1 className='sigmaTitle'>Tournament Bracket</h1>
            <div className='sigmaBracket'>
                {structure.matchesPerRound.map((matchCount, roundIndex) => {
                    const roundStart = getStartIndexForRound(roundIndex);
                    return (
                        <div key={roundIndex} className="sigmaRound">
                            <div>
                                <h3>
                                    {roundIndex === structure.totalRounds - 1
                                        ? 'Chung kết'
                                        : roundIndex === structure.totalRounds - 2
                                            ? 'Bán kết'
                                            : roundIndex === structure.totalRounds - 3
                                                ? 'Tứ kết'
                                                : `Vòng ${roundIndex + 1}`}
                                </h3>
                            </div>
                            <div>
                                {Array.from({ length: matchCount }, (_, matchIndex) => {
                                    const currentPlayersArray = ensurePlayersArray();
                                    const player1Index = roundStart + matchIndex * 2;
                                    const player2Index = roundStart + matchIndex * 2 + 1;

                                    // console.log('matchCount: ', matchCount)
                                    // console.log(`Round ${roundIndex + 1}, Match ${matchIndex + 1}: Player1 Index = ${player1Index}, Player2 Index = ${player2Index}`);
                                    return (
                                        <SigmaBoxDouble
                                            key={`${roundIndex}-${matchIndex}`}
                                            player1={player1Index >= 0 && player1Index < currentPlayersArray.length ? currentPlayersArray[player1Index] : undefined}
                                            player2={player2Index >= 0 && player2Index < currentPlayersArray.length ? currentPlayersArray[player2Index] : undefined}
                                            onPlayer1Change={
                                                player1Index >= 0 && player1Index < currentPlayersArray.length
                                                    ? (name) => handlePlayerNameChange(player1Index, name)
                                                    : undefined
                                            }
                                            onPlayer2Change={
                                                player2Index >= 0 && player2Index < currentPlayersArray.length
                                                    ? (name) => handlePlayerNameChange(player2Index, name)
                                                    : undefined
                                            }
                                            roundIndex={roundIndex}
                                            matchIndex={matchIndex}
                                            isFirstRound={roundIndex === 0}
                                            onAdvanceWinner={(winner) => advanceWinner(roundIndex, matchIndex, winner)}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}