import React from 'react'
import { Link } from "react-router-dom";
import { BeltGroupMap, getDisplayName, PoomsaeContentMap, AgeGroupMap } from '@/constants/TournamentConstants'
import { Edit, Trash2 } from 'lucide-react'
import './PoomsaeList.scss'
import type {
    PoomsaeList as PoomsaeListType,
    PoomsaeCombination as PoomsaeCombinationType
} from '@/types/Tournament/Poomsae'
import { createPoomsaeHistory } from "@/services/tournament/Poomsae/PoomsaeHistoryService";

type Props = {
    selectedCombination: PoomsaeCombinationType | null;
    listPoomsaeDTO?: PoomsaeListType[];
}

export default function PoomsaeList({ selectedCombination, listPoomsaeDTO }: Props) {
    const [filteredList, setFilteredList] = React.useState<PoomsaeListType[]>([]);
    const handleEdit = (index: number) => {
        console.log('Edit athlete:', index);
    };

    const handleDelete = (index: number) => {
        console.log('Delete athlete:', index);
    };

    React.useEffect(() => {
        if (listPoomsaeDTO && selectedCombination) {
            const filtered = listPoomsaeDTO.filter(item =>
                item.competitor.competition?.idPoomsaeCombination === selectedCombination?.idPoomsaeCombination
            );
            setFilteredList(filtered);
        } else {
            setFilteredList([]);
        }
    }, [listPoomsaeDTO, selectedCombination]);

    const handleCreatePoomsaeHistory = () => {
        createPoomsaeHistory(filteredList.map(item => item.idPoomsaeList));
    }

    console.log('Filtered List:', filteredList.map(item => item.idPoomsaeList));

    return (
        <div className='poomsae-list-container'>
            <div className='athletes-table'>
                <div className='table-header'>
                    <div>
                        <h2 className='table-title'>
                            {getDisplayName(PoomsaeContentMap, selectedCombination?.poomsaeContent.contentName || '')} - {getDisplayName(BeltGroupMap, selectedCombination?.beltGroup.beltGroupName || '')} - {getDisplayName(AgeGroupMap, selectedCombination?.ageGroup.ageGroupName || '')}
                        </h2>
                        <p className='table-subtitle'>
                            {filteredList.length} vận động viên
                        </p>
                    </div>

                    {selectedCombination?.idPoomsaeCombination ? (
                        <Link
                            to={`/poomsae/sigma?${new URLSearchParams({
                                combination: selectedCombination.idPoomsaeCombination,
                                participants: filteredList.length.toString(),
                            })}`}
                        >
                            <button>Xem sơ đồ thi đấu</button>
                        </Link>
                    ) : (
                        <button disabled title="Vui lòng chọn combination trước">
                            Xem sơ đồ thi đấu
                        </button>
                    )}

                    <button onClick={handleCreatePoomsaeHistory}>Tạo sơ đồ thi đấu</button>
                </div>
                <div className='table-content'>
                    <table>
                        <thead>
                            <tr>
                                <th>Vị trí sơ đồ thi đấu</th>
                                <th>Sàn đấu</th>
                                <th>Họ tên</th>
                                <th>Cấp đai</th>
                                <th>Cơ sở</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredList.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className='empty-state'>
                                        Chưa có vận động viên nào trong nhóm này
                                    </td>
                                </tr>
                            ) : (
                                filteredList.map((item, index) => {
                                    const student = item.competitor.personalAcademicInfo;
                                    return (
                                        <tr key={index}>
                                            <td>Tứ kết - Trận {index + 1}</td>
                                            <td>
                                                <span className={`court-badge court-chung`}>
                                                    <span className='court-dot'></span>
                                                    Chung
                                                </span>
                                            </td>
                                            <td>{student?.personalInfo?.name || 'N/A'}</td>
                                            <td>{student?.academicInfo?.beltLevel || 'N/A'}</td>
                                            <td>Cơ sở {student?.academicInfo?.idBranch || 'N/A'}</td>
                                            <td>
                                                <div className='action-buttons'>
                                                    <button
                                                        className='action-button edit-button'
                                                        onClick={() => handleEdit(index)}
                                                    >
                                                        <Edit className='action-icon' />
                                                    </button>
                                                    <button
                                                        className='action-button delete-button'
                                                        onClick={() => handleDelete(index)}
                                                    >
                                                        <Trash2 className='action-icon' />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}