
import React from 'react'
import SparringCompetition from './SparringCompetition'
import SparringList from './SparringList'
import './SparringLayout.scss'
import { Trophy } from 'lucide-react'

import type {
    SparringCombination as SparringCombinationType,
    SparringList as SparringListType
} from '@/types/Tournament/Sparring'

import { getSparringListsByTournament } from '@/services/achievement/SparringListService'


export default function SparringLayout() {
    const [selectedCombination, setSelectedCombination] = React.useState<SparringCombinationType | null>(null)
    const [listSparringLists, setListSparringLists] = React.useState<SparringListType[]>([])
    const fetchSparringData = React.useCallback(async () => {
        try {
            const data = await getSparringListsByTournament('a8d5c830-c275-41b0-a251-294eb61c007f')
            // console.log('Sparring Lists Data:', data)
            setListSparringLists(data)
        } catch (error) {
            console.error('Error fetching sparring data:', error)
        }
    }, [])

    React.useEffect(() => {
        fetchSparringData()
    }, [fetchSparringData])

    return (
        <div className='sparring-layout-container'>
            {/* Header */}
            <div className='header'>
                <div className='header-content'>
                    <div className='header-title'>
                        <Trophy className='trophy-icon' />
                        <div>
                            <h1>Quản Lý Thi Đấu Đối Kháng Taekwondo</h1>
                            <p className='header-subtitle'>Hệ thống quản lý thi đấu chuyên nghiệp</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className='main-content'>
                <SparringCompetition
                    selectedCombination={selectedCombination}
                    setSelectedCombination={setSelectedCombination}
                    onRefreshData={fetchSparringData}
                    listSparringLists={listSparringLists}
                />
                <SparringList
                    selectedCombination={selectedCombination}
                    listSparringDTO={listSparringLists}
                />
            </div>
        </div>
    )
}