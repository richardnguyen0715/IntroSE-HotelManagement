import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRegulation } from './RegulationContext';
import './Feature6.css';

function Regulation1() {
    const { roomTypes, updateRoomTypes } = useRegulation();
    const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);

    const handleRoomTypeCheckboxChange = (id) => {
        setSelectedRoomTypes(prev => {
            if (prev.includes(id)) {
                return prev.filter(typeId => typeId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const handleDeleteRoomTypes = () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa các loại phòng đã chọn?')) {
            const updatedRoomTypes = roomTypes.filter(room => !selectedRoomTypes.includes(room.id));
            updateRoomTypes(updatedRoomTypes);
            setSelectedRoomTypes([]);
        }
    };

    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN');
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
                    <h2>Quy định 1</h2>
                    <Link to="/feature6" className="back-button">
                        <img src="/icons/Navigate.png" alt="Back" />
                    </Link>
                </div>

                <div className="regulation-container">
                    <div className="regulation-section">
                        <h3>Danh sách loại phòng</h3>
                        <div className="table-section">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Loại phòng</th>
                                        <th>Đơn giá (VNĐ)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roomTypes.map((type, index) => (
                                        <tr key={type.id}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRoomTypes.includes(type.id)}
                                                    onChange={() => handleRoomTypeCheckboxChange(type.id)}
                                                />
                                                {index + 1}
                                            </td>
                                            <td>{type.type}</td>
                                            <td>{formatPrice(type.price)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="button-container">
                            <Link to="/feature6/regulation1/add">
                                <button className="action-button add">Thêm</button>
                            </Link>
                            <Link
                                to={selectedRoomTypes.length === 1 ? `/feature6/regulation1/edit` : '#'}
                                state={{ roomId: selectedRoomTypes[0] }}
                            >
                                <button
                                    className="action-button edit"
                                    disabled={selectedRoomTypes.length !== 1}
                                >
                                    Sửa
                                </button>
                            </Link>
                            <button
                                className="action-button delete"
                                onClick={handleDeleteRoomTypes}
                                disabled={selectedRoomTypes.length === 0}
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Regulation1; 