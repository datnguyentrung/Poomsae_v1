import './SigmaBox.scss'
import type { Player } from '../../../types/types';

export default function SigmaBox({ player }: { player?: Player }) {
    return (
        <div className="sigmaBoxContainer">
            {player ? (
                <div className='sigmaBoxPlayerInfo'>
                    <div>{player.name}</div>
                    <div>ID: {player.id}</div>
                </div>
            ) : (
                <span>No player selected</span>
            )}
        </div>
    )
}