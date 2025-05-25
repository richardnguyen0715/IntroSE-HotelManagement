import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Feature1.css';

const Feature1 = () => {
    const [rooms, setRooms] = useState([
        { id: 1, roomNumber: '101', type: 'A', status: 'Trống', note: '' },
        { id: 2, roomNumber: '102', type: 'B', status: 'Đang thuê', note: 'Khách check-in 15/03/2024' },
        { id: 3, roomNumber: '201', type: 'A', status: 'Đang dọn', note: 'Cần kiểm tra thiết bị' }
    ]);

    const [selectedRooms, setSelectedRooms] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        roomNumber: '',
        type: '',
        status: 'Trống',
        note: ''
    });

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
        setFormData({
            roomNumber: '',
            type: '',
            status: 'Trống',
            note: ''
        });
        setShowForm(true);
    };

    const handleEdit = () => {
        const roomToEdit = rooms.find(room => room.id === selectedRooms[0]);
        if (roomToEdit) {
            setFormData(roomToEdit);
            setShowForm(true);
        }
    };

    const handleDelete = () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
            setRooms(rooms.filter(room => !selectedRooms.includes(room.id)));
            setSelectedRooms([]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedRooms.length === 1) {
            // Edit existing room
            setRooms(rooms.map(room =>
                room.id === selectedRooms[0]
                    ? { ...formData, id: room.id }
                    : room
            ));
        } else {
            // Add new room
            const newId = Math.max(...rooms.map(room => room.id), 0) + 1;
            setRooms([...rooms, { ...formData, id: newId }]);
        }
        setShowForm(false);
        setSelectedRooms([]);
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
                    <h2>Quản lý phòng</h2>
                    <Link to="/" className="back-button">
                        <img src="/icons/Navigate.png" alt="Back" />
                    </Link>
                </div>

                <div className="content-container">
                    {!showForm ? (
                        <>
                            <div className="room-list">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Số phòng</th>
                                            <th>Loại phòng</th>
                                            <th>Tình trạng</th>
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
                                                <td>{room.status}</td>
                                                <td>{room.note}</td>
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
                                    THÊM
                                </button>
                                <button
                                    className="action-button edit"
                                    onClick={handleEdit}
                                    disabled={selectedRooms.length !== 1}
                                >
                                    SỬA
                                </button>
                                <button
                                    className="action-button delete"
                                    onClick={handleDelete}
                                    disabled={selectedRooms.length === 0}
                                >
                                    XÓA
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="room-form">
                            <h3>{selectedRooms.length === 1 ? 'Sửa thông tin phòng' : 'Thêm phòng mới'}</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Số phòng:</label>
                                    <input
                                        type="text"
                                        value={formData.roomNumber}
                                        onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Loại phòng:</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        required
                                    >
                                        <option value="">Chọn loại phòng</option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Tình trạng:</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        required
                                    >
                                        <option value="Trống">Trống</option>
                                        <option value="Đang thuê">Đang thuê</option>
                                        <option value="Đang dọn">Đang dọn</option>
                                        <option value="Đang sửa chữa">Đang sửa chữa</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Ghi chú:</label>
                                    <textarea
                                        value={formData.note}
                                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                        rows="3"
                                    />
                                </div>

                                <div className="button-container">
                                    <button type="button" onClick={() => setShowForm(false)} className="action-button delete">
                                        HỦY
                                    </button>
                                    <button type="submit" className="action-button add">
                                        {selectedRooms.length === 1 ? 'CẬP NHẬT' : 'THÊM'}
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

export default Feature1;