import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRegulation } from '../Feature6/RegulationContext';
import './Feature1.css';

function Feature1() {
    const { roomTypes } = useRegulation();
    const [selectedRooms, setSelectedRooms] = useState([]);

    // Tạo danh sách phòng từ roomTypes
    const rooms = roomTypes.flatMap(type =>
        Array(type.quantity).fill().map((_, index) => ({
            id: `${type.id}-${index + 1}`,
            type: type.type,
            price: type.price,
            roomNumber: `${type.type}${index + 1}`,
            status: 'Trống'
        }))
    );

    const handleCheckboxChange = (roomId) => {
        setSelectedRooms(prev => {
            if (prev.includes(roomId)) {
                return prev.filter(id => id !== roomId);
            } else {
                return [...prev, roomId];
            }
        });
    };

    const handleAdd = () => {
        // TODO: Implement add functionality
        alert('Chức năng đang được phát triển');
    };

    const handleEdit = () => {
        // TODO: Implement edit functionality
        alert('Chức năng đang được phát triển');
    };

    const handleDelete = () => {
        // TODO: Implement delete functionality
        alert('Chức năng đang được phát triển');
    };

    return (
        <div className="app">
            <header className="app-header">
                <div className="header-left">
                    <Link to="/">
                        <h1>HotelManager</h1>
                    </Link>
                </div>

                <nav className="header-right">
                    <Link to="/about">Về chúng tôi</Link>
                    <img src="/icons/VietnamFlag.png" alt="Vietnam Flag" className="flag" />
                    <Link to="/register">
                        <button className="button-reg">Đăng ký</button>
                    </Link>
                    <Link to='/login'>
                        <button className="button-log">Đăng nhập</button>
                    </Link>
                </nav>
            </header>

            <main className="main-content">
                <div className="header-container">
                    <h2>Lập danh mục phòng</h2>
                    <Link to="/" className="back-button">
                        <img src="/icons/Navigate.png" alt="Back" />
                    </Link>
                </div>

                <div className="feature-content">
                    <h3>Danh sách phòng</h3>
                    <div className="table-section">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Phòng</th>
                                    <th>Loại phòng</th>
                                    <th>Đơn giá (VNĐ)</th>
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
                                        <td>{room.type}</td>
                                        <td>{room.price.toLocaleString('vi-VN')}</td>
                                        <td>{room.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="button-container">
                        <button
                            className="action-button add"
                            onClick={handleAdd}
                        >
                            Thêm
                        </button>
                        <button
                            className="action-button edit"
                            onClick={handleEdit}
                            disabled={selectedRooms.length !== 1}
                        >
                            Sửa
                        </button>
                        <button
                            className="action-button delete"
                            onClick={handleDelete}
                            disabled={selectedRooms.length === 0}
                        >
                            Xóa
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Feature1;