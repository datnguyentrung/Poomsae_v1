import React from 'react'
import './SparringCompetition.scss'
import type {
    SparringCombination as SparringCombinationType,
    SparringContent as SparringContentType,
    SparringList as SparringListType
} from '@/types/Tournament/Sparring'
import type {
    AgeGroup as AgeGroupType,
    CompetitorDTO as CompetitorDTOType,
} from '@/types/Tournament/Tournament'
import { getDisplayName, GenderMap, AgeGroupMap } from '@/constants/TournamentConstants'
import { getAllAgeGroups } from '@/services/tournament/AgeGroupService'
import { getAllSparringCombinations } from '@/services/tournament/Sparring/SparringCombinationService'
import { getAllSparringContents } from '@/services/tournament/Sparring/SparringContentService'
import { createSparringLists } from '@/services/achievement/SparringListService'

import SparringSelectionModal from './SparringSelectionModal'

import { Plus, Filter, ChevronDown } from 'lucide-react'
import { toast } from 'react-toastify'

type Props = {
    selectedCombination: SparringCombinationType | null;
    setSelectedCombination: React.Dispatch<React.SetStateAction<SparringCombinationType | null>>;
    onRefreshData: () => Promise<void>;
    listSparringLists: SparringListType[];
}

export default function SparringCompetition({
    selectedCombination,
    setSelectedCombination,
    onRefreshData,
    listSparringLists
}: Props) {
    const [ageGroups, setAgeGroups] = React.useState<AgeGroupType>()
    const [gender, setGender] = React.useState<string>('MALE') // Default to MALE
    const [sparringContents, setSparringContents] = React.useState<SparringContentType>()

    const [allAgeGroups, setAllAgeGroups] = React.useState<AgeGroupType[]>([])
    const [allGenders] = React.useState<string[]>(['MALE', 'FEMALE'])
    // const [allSparringContents, setAllSparringContents] = React.useState<SparringContentType[]>([])
    const [allSparringCombinations, setAllSparringCombinations] = React.useState<SparringCombinationType[]>([])

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
            const [fetchedAgeGroups, fetchedSparringCombinations, fetchedSparringContents] = await Promise.all([
                getAllAgeGroups(),
                getAllSparringCombinations(),
                getAllSparringContents()
            ])

            setAllAgeGroups(fetchedAgeGroups)
            setAllSparringCombinations(fetchedSparringCombinations)

            // Mặc định chọn phần tử đầu tiên nếu có dữ liệu
            if (fetchedAgeGroups.length > 0) setAgeGroups(fetchedAgeGroups[0])
            if (fetchedSparringContents.length > 0) setSparringContents(fetchedSparringContents[0])
        }

        fetchData()
    }, [])

    React.useEffect(() => {
        if (gender && ageGroups && sparringContents) {
            const combination = allSparringCombinations.find(combination =>
                combination.ageGroup.idAgeGroup === ageGroups.idAgeGroup
                && combination.gender === gender
                && combination.sparringContent.idSparringContent === sparringContents.idSparringContent
            )
            console.log('Selected Combination:', combination)
            setSelectedCombination(combination || null)
        }
    }, [gender, ageGroups, sparringContents, allSparringCombinations, setSelectedCombination])

    const handleGenderSelect = (selectedGender: string) => {
        setGender(selectedGender)
        setIsDropdownOpen(false)
    }

    const handleContentSelect = (content: SparringContentType) => {
        setSparringContents(content)
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
            await createSparringLists(competitorDTOType);
            console.log('Created Sparring Lists:', competitorDTOType);

            competitorDTOType.forEach(element => {
                toast.success(`Đã thêm vận động viên: ${element.personalAcademicInfo.personalInfo.name}`);
            });

            // Refresh data sau khi thêm thành công
            await onRefreshData();

        } catch (error) {
            console.error('Error creating Sparring Lists:', error);
            toast.error('Có lỗi xảy ra khi thêm vận động viên');
        }
    }

    return (
        <div className='sparring-competition-container'>
            {/* Controls Container */}
            <div className='controls-container'>
                <div className='group-controls'>
                    {/* Gender Dropdown */}
                    <div className='gender-group-container'>
                        <Filter className='filter-icon' />
                        <label className='dropdown-label'>Giới tính:</label>
                        <div className='gender-dropdown' ref={dropdownRef}>
                            <div
                                className='dropdown-trigger'
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <span>
                                    {gender
                                        ? getDisplayName(GenderMap, gender)
                                        : 'Chọn giới tính'}
                                </span>
                                <ChevronDown size={16} style={{
                                    transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.2s ease'
                                }} />
                            </div>
                            {isDropdownOpen && (
                                <div className='dropdown-content'>
                                    {allGenders.map((genderOption) => (
                                        <div
                                            key={genderOption}
                                            className={`dropdown-item ${gender === genderOption ? 'selected' : ''}`}
                                            onClick={() => handleGenderSelect(genderOption)}
                                        >
                                            {getDisplayName(GenderMap, genderOption)}
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

            {/* Sparring Content Selection */}
            <div className='sparring-content-container'>
                {(() => {
                    const filteredCombinations = allSparringCombinations
                        .filter(combination => combination.ageGroup.idAgeGroup === ageGroups?.idAgeGroup
                            && combination.gender === gender
                            && combination.active
                        )
                        .sort((a, b) => parseFloat(a.sparringContent.weightClass) - parseFloat(b.sparringContent.weightClass));

                    if (filteredCombinations.length === 0) {
                        return (
                            <div className="no-content-message">
                                <div className="no-content-icon">⚖️</div>
                                <div className="no-content-text">
                                    Không có hạng cân cho{' '}
                                    <strong>
                                        {ageGroups ? getDisplayName(AgeGroupMap, ageGroups.ageGroupName) : 'lứa tuổi'} - {gender ? getDisplayName(GenderMap, gender) : 'giới tính'}
                                    </strong>
                                </div>
                            </div>
                        );
                    }

                    return filteredCombinations.map((combination) => {
                        console.log('allSparringCombinations: ', combination)
                        return (
                            <div
                                key={combination.sparringContent.idSparringContent}
                                className={`sparring-content-item ${sparringContents?.idSparringContent === combination.sparringContent.idSparringContent ? 'active' : ''}`}
                                onClick={() => handleContentSelect(combination.sparringContent)}
                            >
                                {combination.sparringContent.weightClass} kg
                            </div>
                        )
                    });
                })()}
            </div>

            {/* Student Selection Modal */}
            <SparringSelectionModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onAddStudents={handleAddStudents}
                selectedCombination={selectedCombination}
                listSparringLists={listSparringLists}
            />
        </div>
    )
}
