import React, { useState } from 'react';
import { useRooms } from './RoomContext';
import RoomForm from './RoomForm';
import './Feature1.css';

function Feature1Main() {
    const { rooms, deleteRooms } = useRooms();
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const handleCheckboxChange = (roomId) => {
        setSelectedRooms(prev => {
            if (prev.includes(roomId)) {
                return prev.filter(id => id !== roomId);
            } else {
                return [...prev, roomId];
            }
        });
    };

    const handleDelete = () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa các phòng đã chọn?')) {
            deleteRooms(selectedRooms);
            setSelectedRooms([]);
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
    };

    return (
        <div className="feature-content">
            <h3>Danh sách các phòng</h3>

            <div className="table-section">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Phòng</th>
                            <th>Loại phòng</th>
                            <th>Đơn giá</th>
                            <th>Ghi chú</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map((room, index) => (
                            <tr key={room.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedRooms.includes(room.id)}
                                        onChange={() => handleCheckboxChange(room.id)}
                                    />
                                    {index + 1}
                                </td>
                                <td>{room.roomNumber}</td>
                                <td>{room.roomType}</td>
                                <td>{room.price}</td>
                                <td></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="button-container">
                <button
                    className="action-button add"
                    onClick={() => setShowForm(true)}
                >
                    Thêm
                </button>
                <button
                    className="action-button delete"
                    onClick={handleDelete}
                    disabled={selectedRooms.length === 0}
                >
                    Xóa
                </button>
            </div>

            {showForm && (
                <RoomForm
                    onClose={handleCloseForm}
                />
            )}
        </div>
    );
}

export default Feature1Main; 