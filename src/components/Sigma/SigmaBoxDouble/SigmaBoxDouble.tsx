import './SigmaBoxDouble.scss'
import SigmaBox from '../SigmaBox/SigmaBox';
import type { MatchCardProps, Player } from "../../../types/types";

export default function SigmaBoxDouble({
    player1,
    player2,
    onPlayer1Change,
    onPlayer2Change,
    roundIndex,
    isFirstRound,
    onAdvanceWinner
}: MatchCardProps) {

    const handlePlayerClick = (player: Player | undefined) => {
        if (player && onAdvanceWinner) {
            onAdvanceWinner(player);
        }
    };

    return (
        <div className="sigmaBoxDoubleContainer">
            <div className="sigmaBoxDoubleContent">
                <div
                    className="sigmaBoxDoubleItem"
                    onClick={() => handlePlayerClick(player1)}
                    style={{ cursor: onAdvanceWinner ? 'pointer' : 'default' }}
                >
                    <SigmaBox player={player1} />
                </div>
                <div className="sigmaBoxDoubleLine" />
                <div
                    className="sigmaBoxDoubleItem"
                    onClick={() => handlePlayerClick(player2)}
                    style={{ cursor: onAdvanceWinner ? 'pointer' : 'default' }}
                >
                    <SigmaBox player={player2} />
                </div>
            </div>

            {onAdvanceWinner && (
                <div className="winnerInstruction">
                    Click on a player to advance them to the next round
                </div>
            )}
        </div>
    );
}