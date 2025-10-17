import './MatchSession.scss'
import { Sun, Moon } from 'lucide-react';

type Props = {
    selectedSessionForAdd: 'AM' | 'PM';
    setSelectedSessionForAdd: (session: 'AM' | 'PM') => void;
}

const SessionOptions = {
    AM: 'Buổi sáng',
    PM: 'Buổi chiều',
}

export default function MatchSession({ selectedSessionForAdd, setSelectedSessionForAdd }: Props) {
    return (
        <div className="match-session-container">
            <div className="session-header">
                <h3>Chọn ca thi đấu</h3>
            </div>

            <div className="session-options">
                <button
                    className={`session-btn session-am ${selectedSessionForAdd === 'AM' ? 'active' : ''}`}
                    onClick={() => setSelectedSessionForAdd('AM')}
                >
                    <div className="session-icon">
                        <Sun size={20} />
                    </div>
                    <div className="session-info">
                        <span className="session-title">{SessionOptions.AM}</span>
                        <span className="session-time">08:00 - 12:00</span>
                    </div>
                </button>

                <button
                    className={`session-btn session-pm ${selectedSessionForAdd === 'PM' ? 'active' : ''}`}
                    onClick={() => setSelectedSessionForAdd('PM')}
                >
                    <div className="session-icon">
                        <Moon size={20} />
                    </div>
                    <div className="session-info">
                        <span className="session-title">{SessionOptions.PM}</span>
                        <span className="session-time">13:00 - 17:00</span>
                    </div>
                </button>
            </div>
        </div>
    );
}