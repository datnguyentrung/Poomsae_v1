import React from 'react'
import './PoomsaeCompetition.scss'
import type {
    PoomsaeCombination as PoomsaeCombinationType,
    PoomsaeContent as PoomsaeContentType,
    PoomsaeList as PoomsaeListType
} from '@/types/Tournament/Poomsae'
import type {
    AgeGroup as AgeGroupType,
    BeltGroup as BeltGroupType,
    CompetitorDTO as CompetitorDTOType,
} from '@/types/Tournament/Tournament'
import { getDisplayName, PoomsaeContentMap, BeltGroupMap, AgeGroupMap } from '@/constants/TournamentConstants'
import { getAllAgeGroups } from '@/services/tournament/AgeGroupService'
import { getAllBeltGroups } from '@/services/tournament/BeltGroupService'
import { getAllPoomsaeCombinations } from '@/services/tournament/Poomsae/PoomsaeCombinationService'
import { getAllPoomsaeContents } from '@/services/tournament/Poomsae/PoomsaeContentService'
import { createPoomsaeLists } from '@/services/achievement/PoomsaeListService'

import StudentSelectionModal from './StudentSelectionModal'

import { Plus, Filter, ChevronDown } from 'lucide-react'
import { toast } from 'react-toastify'

type Props = {
    selectedCombination: PoomsaeCombinationType | null;
    setSelectedCombination: React.Dispatch<React.SetStateAction<PoomsaeCombinationType | null>>;
    onRefreshData: () => Promise<void>;
    listPoomsaeLists: PoomsaeListType[];
}

export default function PoomsaeCompetition({
    selectedCombination,
    setSelectedCombination,
    onRefreshData,
    listPoomsaeLists
}: Props) {
    const [ageGroups, setAgeGroups] = React.useState<AgeGroupType>()
    const [beltGroups, setBeltGroups] = React.useState<BeltGroupType>()
    const [poomsaeContents, setPoomsaeContents] = React.useState<PoomsaeContentType>()

    const [allAgeGroups, setAllAgeGroups] = React.useState<AgeGroupType[]>([])
    const [allBeltGroups, setAllBeltGroups] = React.useState<BeltGroupType[]>([])
    // const [allPoomsaeContents, setAllPoomsaeContents] = React.useState<PoomsaeContentType[]>([])
    const [allPoomsaeCombinations, setAllPoomsaeCombinations] = React.useState<PoomsaeCombinationType[]>([])

    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    React.useEffect(() => {
        const fetchData = async () => {
            const [fetchedAgeGroups, fetchedBeltGroups, fetchedPoomsaeCombinations, fetchedPoomsaeContents] = await Promise.all([
                getAllAgeGroups(),
                getAllBeltGroups(),
                getAllPoomsaeCombinations(),
                getAllPoomsaeContents()
            ])

            setAllAgeGroups(fetchedAgeGroups)
            setAllBeltGroups(fetchedBeltGroups)
            setAllPoomsaeCombinations(fetchedPoomsaeCombinations)
            // setAllPoomsaeContents(fetchedPoomsaeContents)

            // Mặc định chọn phần tử đầu tiên nếu có dữ liệu
            if (fetchedAgeGroups.length > 0) setAgeGroups(fetchedAgeGroups[0])
            if (fetchedBeltGroups.length > 0) setBeltGroups(fetchedBeltGroups[0])
            if (fetchedPoomsaeContents.length > 0) setPoomsaeContents(fetchedPoomsaeContents[0])
        }

        fetchData()
    }, [])

    React.useEffect(() => {
        if (beltGroups && ageGroups && poomsaeContents) {
            const combination = allPoomsaeCombinations.find(combination =>
                combination.ageGroup.idAgeGroup === ageGroups.idAgeGroup
                && combination.beltGroup.idBeltGroup === beltGroups.idBeltGroup
                && combination.poomsaeContent.idPoomsaeContent === poomsaeContents.idPoomsaeContent
            )
            setSelectedCombination(combination || null)
        }
    }, [beltGroups, ageGroups, poomsaeContents, allPoomsaeCombinations, setSelectedCombination])

    const handleBeltGroupSelect = (belt: BeltGroupType) => {
        setBeltGroups(belt)
        setIsDropdownOpen(false)
    }

    const handleContentSelect = (content: PoomsaeContentType) => {
        setPoomsaeContents(content)
    }

    const handleAgeGroupSelect = (age: AgeGroupType) => {
        setAgeGroups(age)
    }

    const handleOpenModal = () => {
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    const handleAddStudents = async (competitorDTOType: CompetitorDTOType[]) => {
        console.log('Added students:', competitorDTOType)
        try {
            await createPoomsaeLists(competitorDTOType);
            console.log('Created Poomsae Lists:', competitorDTOType);

            competitorDTOType.forEach(element => {
                toast.success(`Đã thêm vận động viên: ${element.personalAcademicInfo.personalInfo.name}`);
            });

            // Refresh data sau khi thêm thành công
            await onRefreshData();

        } catch (error) {
            console.error('Error creating Poomsae Lists:', error);
            toast.error('Có lỗi xảy ra khi thêm vận động viên');
        }
    }

    return (
        <div className='poomsae-competition-container'>
            {/* Controls Container */}
            <div className='controls-container'>
                <div className='group-controls'>
                    {/* Belt Group Dropdown */}
                    <div className='belt-group-container'>
                        <Filter className='filter-icon' />
                        <label className='dropdown-label'>Nhóm đai:</label>
                        <div className='belt-dropdown' ref={dropdownRef}>
                            <div
                                className='dropdown-trigger'
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <span>
                                    {beltGroups?.beltGroupName
                                        ? getDisplayName(BeltGroupMap, beltGroups.beltGroupName)
                                        : 'Chọn nhóm đai'}
                                </span>
                                <ChevronDown size={16} style={{
                                    transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.2s ease'
                                }} />
                            </div>
                            {isDropdownOpen && (
                                <div className='dropdown-content'>
                                    {allBeltGroups.map((belt) => (
                                        <div
                                            key={belt.idBeltGroup}
                                            className={`dropdown-item ${beltGroups?.idBeltGroup === belt.idBeltGroup ? 'selected' : ''}`}
                                            onClick={() => handleBeltGroupSelect(belt)}
                                        >
                                            {getDisplayName(BeltGroupMap, belt.beltGroupName)}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Age Group Buttons */}
                    <div className='age-group-container'>
                        <div className='age-group-buttons'>
                            {allAgeGroups.map((age) => (
                                <button
                                    key={age.idAgeGroup}
                                    className={`age-group-item ${ageGroups?.idAgeGroup === age.idAgeGroup ? 'active' : ''}`}
                                    onClick={() => handleAgeGroupSelect(age)}
                                >
                                    {getDisplayName(AgeGroupMap, age.ageGroupName)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Add Athlete Button */}
                <button className='add-athlete-button category-male' onClick={handleOpenModal}>
                    <Plus className='plus-icon' />
                    <span>Thêm vận động viên</span>
                </button>
            </div>

            {/* Poomsae Content Selection */}
            <div className='poomsae-content-container'>
                {(() => {
                    const filteredCombinations = allPoomsaeCombinations
                        .filter(combination => combination.ageGroup.idAgeGroup === ageGroups?.idAgeGroup
                            && combination.beltGroup.idBeltGroup === beltGroups?.idBeltGroup
                            && combination.isActive
                        )
                        .sort((a, b) => a.poomsaeContent.contentName.localeCompare(b.poomsaeContent.contentName));

                    if (filteredCombinations.length === 0) {
                        return (
                            <div className="no-content-message">
                                <div className="no-content-icon">📋</div>
                                <div className="no-content-text">
                                    Không có nội dung cho{' '}
                                    <strong>
                                        {ageGroups ? getDisplayName(AgeGroupMap, ageGroups.ageGroupName) : 'lứa tuổi'} - {beltGroups ? getDisplayName(BeltGroupMap, beltGroups.beltGroupName) : 'nhóm đai'}
                                    </strong>
                                </div>
                            </div>
                        );
                    }

                    return filteredCombinations.map((combination) => {
                        // console.log('Rendering content item for:', combination.poomsaeContent);
                        console.log(combination)
                        return (
                            <div
                                key={combination.poomsaeContent.idPoomsaeContent}
                                className={`poomsae-content-item ${poomsaeContents?.idPoomsaeContent === combination.poomsaeContent.idPoomsaeContent ? 'active' : ''}`}
                                onClick={() => handleContentSelect(combination.poomsaeContent)}
                            >
                                {getDisplayName(PoomsaeContentMap, combination.poomsaeContent.contentName)}
                            </div>
                        )
                    });
                })()}
            </div>

            {/* Student Selection Modal */}
            <StudentSelectionModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onAddStudents={handleAddStudents}
                selectedCombination={selectedCombination}
                listPoomsaeLists={listPoomsaeLists.filter(item => item.competitor.competition?.idPoomsaeCombination === selectedCombination?.idPoomsaeCombination)} // Filtered lists
            />
        </div>
    )
}