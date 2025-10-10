import React from 'react'
import './SparringSelectionModal.scss'
import { X, Search, Plus, Trash2 } from 'lucide-react'
import { getAllStudents } from '@/services/training/studentsService'
import type { Student as StudentType } from '@/types/training/Student'
import type {
    SparringCombination as SparringCombinationType,
    SparringList as SparringListType
} from '@/types/Tournament/Sparring'
import type { CompetitorDTO as CompetitorDTOType } from '@/types/Tournament/Tournament'
import { AgeGroupMap, GenderMap, getDisplayName } from '@/constants/TournamentConstants'

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onAddStudents: (students: CompetitorDTOType[]) => void;
    selectedCombination: SparringCombinationType | null;
    listSparringLists: SparringListType[];
}

export default function SparringSelectionModal({ isOpen, onClose, onAddStudents, selectedCombination, listSparringLists }: Props) {
    const [searchTerm, setSearchTerm] = React.useState('')
    // list of selected students
    const [selectedStudents, setSelectedStudents] = React.useState<StudentType[]>([])
    // list of sparring DTOs
    const [listSparringDTO, setListSparringDTO] = React.useState<CompetitorDTOType[]>([])
    // list of all students
    const [listStudents, setListStudents] = React.useState<StudentType[]>([])


    React.useEffect(() => {
        const fetchStudents = async () => {
            try {
                const students = await getAllStudents()
                setListStudents(students)
            } catch (error) {
                console.error('Error fetching students:', error)
            }
        }

        fetchStudents()
    }, [])

    // Filter students based on search term
    const filteredStudents = listStudents
        .filter(student =>
            student.personalInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.academicInfo.beltLevel.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.academicInfo.idBranch.toString().includes(searchTerm.toLowerCase())
        )
        .filter(student =>
            // Chưa được chọn
            !selectedStudents.find(s => s.personalInfo.idAccount === student.personalInfo.idAccount) &&
            // Nếu có selectedCombination thì kiểm tra không nằm trong listSparringLists
            (selectedCombination
                ? !listSparringLists.find(dto =>
                    dto.competitor.personalAcademicInfo.personalInfo.idAccount === student.personalInfo.idAccount
                )
                : true)
        );

    const handleAddStudent = (student: StudentType) => {
        setSelectedStudents(prev => [...prev, student])
        setListSparringDTO(prev => [...prev, {
            personalAcademicInfo: student,
            competition: {
                idSparringCombination: selectedCombination?.idSparringCombination ?? '',
            }
        }])
    }

    const handleRemoveStudent = (studentId: string) => {
        setSelectedStudents(prev => prev.filter(s => s.personalInfo.idAccount !== studentId))
        setListSparringDTO(prev => prev.filter(dto => dto.personalAcademicInfo.personalInfo.idAccount !== studentId))
    }

    const handleSubmit = () => {
        onAddStudents(listSparringDTO)
        setSelectedStudents([])
        setListSparringDTO([])
        setSearchTerm('')
        onClose()
    }

    const handleClose = () => {
        setSelectedStudents([])
        setListSparringDTO([])
        setSearchTerm('')
        onClose()
    }

    if (!isOpen) return null

    const renderedSelectedCombination = selectedCombination
        ? [
            selectedCombination.sparringContent?.weightClass ?? '',
            getDisplayName(AgeGroupMap, selectedCombination.ageGroup?.ageGroupName ?? ''),
            getDisplayName(GenderMap, selectedCombination.gender ?? '')
        ]
            .filter(Boolean) // loại bỏ giá trị rỗng
            .join(' - ')     // nối thành chuỗi, ví dụ: "60kg - U12 - Nam"
        : '';


    return (
        <div className="modal-overlay">
            <div className="modal-container">
                {/* Modal Header */}
                <div className="modal-header">
                    <h2>Chọn Vận Động Viên</h2>
                    <div />
                    <span>{renderedSelectedCombination}</span>
                    <button className="close-button" onClick={handleClose}>
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="modal-body">
                    {/* Left Side - Available Students */}
                    <div className="left-panel">
                        <div className="search-container">
                            <div className="search-input-wrapper">
                                <Search className="search-icon" size={20} />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm học sinh..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                            </div>
                        </div>

                        <div className="students-list">
                            <h3>Danh sách học sinh ({filteredStudents.filter(student => student.personalInfo.isActive === true).length})</h3>
                            <div className="students-grid">
                                {filteredStudents
                                    .filter(student => student.personalInfo.isActive === true)
                                    .map((student) => (
                                        <div key={student.personalInfo.idAccount} className="student-card">
                                            <div className="student-info">
                                                <div className="student-name">{student.personalInfo.name}</div>
                                                <div className="student-details">
                                                    <span className="belt-level">Cấp đai: {student.academicInfo.beltLevel}</span>
                                                    <span className="facility">Cơ sở: {student.academicInfo.idBranch}</span>
                                                </div>
                                            </div>
                                            <button
                                                className="add-student-btn"
                                                onClick={() => handleAddStudent(student)}
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    ))}
                                {filteredStudents.length === 0 && (
                                    <div className="empty-state">
                                        Không tìm thấy học sinh nào
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Selected Students */}
                    <div className="right-panel">
                        <div className="selected-header">
                            <h3>Đã chọn ({selectedStudents.length})</h3>
                        </div>
                        <div className="selected-students">
                            {selectedStudents.map((student) => (
                                <div key={student.personalInfo.idAccount} className="selected-student-item">
                                    <div className="student-info">
                                        <div className="student-name">{student.personalInfo.name}</div>
                                        <div className="student-details">
                                            <span className="belt-level">Cấp đai: {student.academicInfo.beltLevel}</span>
                                            <span className="facility">Cơ sở: {student.academicInfo.idBranch}</span>
                                        </div>
                                    </div>
                                    <button
                                        className="remove-student-btn"
                                        onClick={() => handleRemoveStudent(student.personalInfo.idAccount)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            {selectedStudents.length === 0 && (
                                <div className="empty-state">
                                    Chưa chọn học sinh nào
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="modal-footer">
                    <button className="cancel-btn" onClick={handleClose}>
                        Hủy
                    </button>
                    <button
                        className="submit-btn"
                        onClick={handleSubmit}
                        disabled={selectedStudents.length === 0}
                    >
                        Thêm {selectedStudents.length} học sinh
                    </button>
                </div>
            </div>
        </div>
    )
}
