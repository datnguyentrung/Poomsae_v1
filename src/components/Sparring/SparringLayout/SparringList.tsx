import React from 'react'
import { Link } from "react-router-dom";
import { GenderMap, getDisplayName, AgeGroupMap } from '@/constants/TournamentConstants'
import { Edit, Trash2 } from 'lucide-react'
import './SparringList.scss'
import type {
    SparringList as SparringListType,
    SparringCombination as SparringCombinationType
} from '@/types/Tournament/Sparring'
import { createSparringHistory } from "@/services/tournament/Sparring/SparringHistoryService";

type Props = {
    selectedCombination: SparringCombinationType | null;
    listSparringDTO?: SparringListType[];
}

export default function SparringList({ selectedCombination, listSparringDTO }: Props) {
    const [filteredList, setFilteredList] = React.useState<SparringListType[]>([]);
    const handleEdit = (index: number) => {
        console.log('Edit athlete:', index);
    };

    const handleDelete = (index: number) => {
        console.log('Delete athlete:', index);
    };

    React.useEffect(() => {
        if (listSparringDTO && selectedCombination) {
            const filtered = listSparringDTO.filter(item =>
                item.competitor.competition?.idSparringCombination === selectedCombination?.idSparringCombination
            );
            setFilteredList(filtered);
        } else {
            setFilteredList([]);
        }
    }, [listSparringDTO, selectedCombination]);

    const handleCreateSparringHistory = () => {
        createSparringHistory(filteredList.map(item => item.idSparringList));
    }

    console.log('Filtered List:', filteredList.map(item => item.idSparringList));

    return (
        <div className='sparring-list-container'>
            <div className='athletes-table'>
                <div className='table-header'>
                    <div>
                        <h2 className='table-title'>
                            {selectedCombination?.sparringContent?.weightClass || ''} - {getDisplayName(GenderMap, selectedCombination?.gender || '')} - {getDisplayName(AgeGroupMap, selectedCombination?.ageGroup?.ageGroupName || '')}
                        </h2>
                        <p className='table-subtitle'>
                            {filteredList.length} vận động viên
                        </p>
                    </div>

                    {selectedCombination?.idSparringCombination ? (
                        <Link
                            to={`/sparring/sigma?${new URLSearchParams({
                                combination: selectedCombination.idSparringCombination,
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

                    <button onClick={handleCreateSparringHistory}>Tạo sơ đồ thi đấu</button>
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
