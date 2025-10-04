import './NodeGroup.scss'
import Node from "./Node";
import type { PoomsaeHistory } from '../../types/types';
import { ArrowBigRight } from 'lucide-react';

type Props = {
    player1?: PoomsaeHistory,
    player2?: PoomsaeHistory,
    numberMatch?: number,
    targetNode?: number,
}

export default function NodeGroup({ player1, player2, numberMatch, targetNode }: Props) {
    if (player1?.sourceNode === 2) console.log("Player 1 in NodeGroup:", player1);
    if (player2?.sourceNode === 2) console.log("Player 2 in NodeGroup:", player2);
    return (
        <div className='node-group-container'>
            {targetNode !== undefined && targetNode !== 0 && numberMatch !== undefined && (
                <div>
                    Trận {numberMatch}
                </div>
            )}

            <div className='node-group'>
                <div className='node-pair'>
                    <Node player={player1} hasWon={false} />
                    <div className='vs' />
                    <Node player={player2} hasWon={false} />
                </div>
                <ArrowBigRight />
                <Node hasWon={true} targetNode={targetNode} />
            </div>
        </div>
    )
}