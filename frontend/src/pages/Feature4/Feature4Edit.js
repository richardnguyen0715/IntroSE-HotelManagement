import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import './Feature4.css';

const Feature4Edit = ({ setBills }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const { bill } = location.state || {};

    const [formData, setFormData] = useState({
        customer: '',
        address: '',
        status: 'unpaid',
        rooms: []
    });

    useEffect(() => {
        if (!bill || bill.id !== parseInt(id)) {
            navigate('/feature4');
            return;
        }
        setFormData({ ...bill });
    }, [bill, id, navigate]);

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        if (name.startsWith('room')) {
            const field = name.split('-')[1];
            const newRooms = [...formData.rooms];
            newRooms[index] = {
                ...newRooms[index],
                [field]: value
            };
            setFormData({ ...formData, rooms: newRooms });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const addRoom = () => {
        setFormData({
            ...formData,
            rooms: [...formData.rooms, { roomNumber: '', roomType: '', days: '', price: '' }]
        });
    };

    const removeRoom = (index) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa phòng này không?')) {
            const newRooms = formData.rooms.filter((_, i) => i !== index);
            setFormData({ ...formData, rooms: newRooms });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (window.confirm('Bạn có chắc chắn muốn lưu thay đổi?')) {
            const updatedBill = {
                ...formData,
                rooms: formData.rooms.map(room => ({
                    ...room,
                    days: parseInt(room.days),
                    price: parseInt(room.price),
                    total: parseInt(room.days) * parseInt(room.price)
                })),
                totalAmount: `${formData.rooms.reduce((sum, room) =>
                    sum + parseInt(room.days) * parseInt(room.price), 0).toLocaleString('vi-VN')} VND`
            };

            setBills(prev =>
                prev.map(b => (b.id === updatedBill.id ? updatedBill : b))
            );
            navigate('/feature4');
        }
    };

    return (
        <div className="app">
            <header className="app-header">
                <div className="header-left">
                    <Link to="/"><h1>HotelManager</h1></Link>
                </div>
                <nav className="header-right">
                    <Link to="/about">Về chúng tôi</Link>
                    <img src="/icons/VietnamFlag.png" alt="Vietnam Flag" className="flag" />
                    <Link to="/register"><button className="button-reg">Đăng ký</button></Link>
                    <Link to="/login"><button className="button-log">Đăng nhập</button></Link>
                </nav>
            </header>

            <main className="main-content">
                <div className="header-container">
                    <h2>Chỉnh sửa Hóa đơn</h2>
                    <Link to="/feature4" className="back-button">
                        <img src="/icons/Navigate.png" alt="Back" />
                    </Link>
                </div>

                <div className="form-container">
                    <form onSubmit={handleSubmit} className="bill-form">
                        <div className="form-group">
                            <label>Khách hàng/Cơ quan:</label>
                            <input
                                type="text"
                                name="customer"
                                value={formData.customer}
                                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Địa chỉ:</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Trạng thái:</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="status-select"
                            >
                                <option value="unpaid">Chưa thanh toán</option>
                                <option value="paid">Đã thanh toán</option>
                            </select>
                        </div>

                        <div className="rooms-section">
                            <h3>Thông tin phòng</h3>
                            {formData.rooms.map((room, index) => (
                                <div key={index} className="room-inputs">
                                    <div className="form-group">
                                        <label>Số phòng:</label>
                                        <input
                                            type="text"
                                            name={`room-roomNumber`}
                                            value={room.roomNumber}
                                            onChange={(e) => handleInputChange(e, index)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Loại phòng:</label>
                                        <input
                                            type="text"
                                            name={`room-roomType`}
                                            value={room.roomType || ''}
                                            onChange={(e) => handleInputChange(e, index)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Số ngày thuê:</label>
                                        <input
                                            type="number"
                                            name={`room-days`}
                                            value={room.days}
                                            onChange={(e) => handleInputChange(e, index)}
                                            min="1"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Đơn giá (VND):</label>
                                        <input
                                            type="number"
                                            name={`room-price`}
                                            value={room.price}
                                            onChange={(e) => handleInputChange(e, index)}
                                            min="0"
                                            required
                                        />
                                    </div>
                                    {formData.rooms.length > 1 && (
                                        <button
                                            type="button"
                                            className="remove-room"
                                            onClick={() => removeRoom(index)}
                                        >
                                            Xóa phòng
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button type="button" className="add-room" onClick={addRoom}>
                                + Thêm phòng
                            </button>
                        </div>

                        <div className="actions-container">
                            <Link to="/feature4">
                                <button type="button" className="action-button delete">
                                    Hủy
                                </button>
                            </Link>
                            <button type="submit" className="action-button add">
                                Lưu thay đổi
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Feature4Edit;
