import React from 'react'
import PoomsaeCompetition from './PoomsaeCompetition'
import PoomsaeList from './PoomsaeList'
import './PoomsaeLayout.scss'
import { Trophy } from 'lucide-react'

import type {
    PoomsaeCombination as PoomsaeCombinationType,
    PoomsaeList as PoomsaeListType
} from '@/types/Tournament/Poomsae'

import { getPoomsaeListsByTournament } from '@/services/achievement/PoomsaeListService'


export default function PoomsaeLayout() {
    const [selectedCombination, setSelectedCombination] = React.useState<PoomsaeCombinationType | null>(null)
    const [listPoomsaeLists, setListPoomsaeLists] = React.useState<PoomsaeListType[]>([])
    const fetchPoomsaeData = React.useCallback(async () => {
        try {
            const data = await getPoomsaeListsByTournament('a8d5c830-c275-41b0-a251-294eb61c007f')
            // console.log('Poomsae Lists Data:', data)
            setListPoomsaeLists(data)
        } catch (error) {
            console.error('Error fetching poomsae data:', error)
        }
    }, [])

    React.useEffect(() => {
        fetchPoomsaeData()
    }, [fetchPoomsaeData])

    return (
        <div className='poomsae-layout-container'>
            {/* Header */}
            <div className='header'>
                <div className='header-content'>
                    <div className='header-title'>
                        <Trophy className='trophy-icon' />
                        <div>
                            <h1>Quản Lý Thi Đấu Quyền Taekwondo</h1>
                            <p className='header-subtitle'>Hệ thống quản lý thi đấu chuyên nghiệp</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className='main-content'>
                <PoomsaeCompetition
                    selectedCombination={selectedCombination}
                    setSelectedCombination={setSelectedCombination}
                    onRefreshData={fetchPoomsaeData}
                    listPoomsaeLists={listPoomsaeLists}
                />
                <PoomsaeList
                    selectedCombination={selectedCombination}
                    listPoomsaeDTO={listPoomsaeLists}
                />
            </div>
        </div>
    )
}