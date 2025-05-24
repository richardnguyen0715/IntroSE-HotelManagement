import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Feature4.css';

const Feature4Add = ({ bills, setBills }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        customer: '',
        address: '',
        rooms: [{ roomNumber: '', roomType: '', days: '', price: '' }]
    });

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const newRooms = [...formData.rooms];
        newRooms[index] = {
            ...newRooms[index],
            [name]: value
        };
        setFormData({ ...formData, rooms: newRooms });
    };

    const addRoom = () => {
        setFormData({
            ...formData,
            rooms: [...formData.rooms, { roomNumber: '', roomType: '', days: '', price: '' }]
        });
    };

    const removeRoom = (index) => {
        const newRooms = formData.rooms.filter((_, i) => i !== index);
        setFormData({ ...formData, rooms: newRooms });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newBill = {
            id: Date.now(),
            customer: formData.customer,
            address: formData.address,
            status: 'unpaid',
            totalAmount: formData.rooms.reduce((sum, room) => sum + room.days * room.price, 0).toLocaleString('vi-VN') + ' VND',
            rooms: formData.rooms
        };
        setBills([...bills, newBill]);
        navigate('/feature4');
    };

    return (
        <div className="app">
            <header className="app-header">
                <div className="header-left">
                    <h1>HotelManager</h1>
                </div>
            </header>

            <main className="main-content">
                <div className="header-container">
                    <h2>Thêm Hóa đơn mới</h2>
                    <button onClick={() => navigate('/feature4')} className="back-button">
                        Quay lại
                    </button>
                </div>

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

                    <div className="rooms-section">
                        <h3>Thông tin phòng</h3>
                        {formData.rooms.map((room, index) => (
                            <div key={index} className="room-inputs">
                                <div className="form-group">
                                    <label>Số phòng:</label>
                                    <input
                                        type="text"
                                        name="roomNumber"
                                        value={room.roomNumber}
                                        onChange={(e) => handleInputChange(e, index)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Loại phòng:</label>
                                    <input
                                        type="text"
                                        name="roomType"
                                        value={room.roomType}
                                        onChange={(e) => handleInputChange(e, index)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Số ngày thuê:</label>
                                    <input
                                        type="number"
                                        name="days"
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
                                        name="price"
                                        value={room.price}
                                        onChange={(e) => handleInputChange(e, index)}
                                        min="0"
                                        required
                                    />
                                </div>
                                {formData.rooms.length > 1 && (
                                    <button type="button" onClick={() => removeRoom(index)}>
                                        Xóa phòng
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addRoom}>
                            + Thêm phòng
                        </button>
                    </div>

                    <button type="submit" className="submit-button">
                        Thêm hóa đơn
                    </button>
                </form>
            </main>
        </div>
    );
};

export default Feature4Add;