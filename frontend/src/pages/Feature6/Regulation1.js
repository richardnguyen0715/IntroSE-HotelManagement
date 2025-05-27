import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRegulation } from './RegulationContext';
import './Feature6.css';

const Regulation1 = () => {
    const { roomTypes, updateRoomTypes } = useRegulation();
    const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        type: '',
        price: 0
    });

    // Xử lý chọn/bỏ chọn loại phòng
    const handleRoomTypeSelection = (roomTypeId) => {
        if (selectedRoomTypes.includes(roomTypeId)) {
            setSelectedRoomTypes(selectedRoomTypes.filter(id => id !== roomTypeId));
        } else {
            setSelectedRoomTypes([...selectedRoomTypes, roomTypeId]);
        }
    };

    // Xử lý thêm loại phòng mới
    const handleAddRoomType = () => {
        setIsEditing(false);
        setFormData({
            id: null,
            type: '',
            price: 0
        });
        setShowForm(true);
    };

    // Xử lý chỉnh sửa loại phòng
    const handleEditRoomType = () => {
        if (selectedRoomTypes.length === 1) {
            const roomType = roomTypes.find(rt => rt.id === selectedRoomTypes[0]);
            setIsEditing(true);
            setFormData({
                id: roomType.id,
                type: roomType.type,
                price: roomType.price
            });
            setShowForm(true);
        }
    };

    // Xử lý xóa loại phòng
    const handleDeleteRoomType = () => {
        if (selectedRoomTypes.length > 0) {
            if (window.confirm('Bạn có chắc chắn muốn xóa các loại phòng đã chọn?')) {
                const updatedRoomTypes = roomTypes.filter(
                    roomType => !selectedRoomTypes.includes(roomType.id)
                );
                updateRoomTypes(updatedRoomTypes);
                setSelectedRoomTypes([]);
            }
        }
    };

    // Xử lý submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Kiểm tra loại phòng đã tồn tại
        const isDuplicate = roomTypes.some(rt => 
            rt.type.toLowerCase() === formData.type.toLowerCase() && 
            (!isEditing || rt.id !== formData.id)
        );

        if (isDuplicate) {
            alert('Loại phòng này đã tồn tại!');
            return;
        }

        if (isEditing) {
            // Cập nhật loại phòng hiện có
            const updatedRoomTypes = roomTypes.map(rt => 
                rt.id === formData.id ? formData : rt
            );
            updateRoomTypes(updatedRoomTypes);
        } else {
            // Thêm loại phòng mới
            const newRoomType = {
                ...formData,
                id: Date.now()
            };
            updateRoomTypes([...roomTypes, newRoomType]);
        }
        setShowForm(false);
        setSelectedRoomTypes([]);
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
                    <Link to="/login">
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
                    {!showForm ? (
                        <>
                            <h3>Danh sách loại phòng</h3>
                            <div className="room-types-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Loại phòng</th>
                                            <th>Đơn giá (VND)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roomTypes.map((roomType, index) => (
                                            <tr key={roomType.id}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedRoomTypes.includes(roomType.id)}
                                                        onChange={() => handleRoomTypeSelection(roomType.id)}
                                                    />
                                                    {index + 1}
                                                </td>
                                                <td>{roomType.type}</td>
                                                <td>{roomType.price.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="button-container">
                                <button 
                                    className="action-button add clickable"
                                    onClick={handleAddRoomType}
                                >
                                    THÊM
                                </button>
                                <button 
                                    className={`action-button edit ${selectedRoomTypes.length === 1 ? 'clickable' : 'disabled'}`}
                                    onClick={handleEditRoomType}
                                    disabled={selectedRoomTypes.length !== 1}
                                >
                                    SỬA
                                </button>
                                <button 
                                    className={`action-button delete ${selectedRoomTypes.length > 0 ? 'clickable' : 'disabled'}`}
                                    onClick={handleDeleteRoomType}
                                    disabled={selectedRoomTypes.length === 0}
                                >
                                    XÓA
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="room-form">
                            <h3>{isEditing ? 'Sửa loại phòng' : 'Thêm loại phòng mới'}</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Loại phòng:</label>
                                    <input
                                        type="text"
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Đơn giá (VND):</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                                        min="0"
                                        step="1000"
                                        required
                                    />
                                </div>
                                <div className="form-actions">
                                    <button 
                                        type="button" 
                                        className="cancel-button" 
                                        onClick={() => setShowForm(false)}
                                    >
                                        Hủy
                                    </button>
                                    <button type="submit" className="confirm-button">
                                        {isEditing ? 'Cập nhật' : 'Thêm'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Regulation1;