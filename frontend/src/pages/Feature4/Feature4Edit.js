import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './Feature4.css';

const Feature4Edit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        customer: '',
        address: '',
        status: 'unpaid',
        rooms: []
    });

    useEffect(() => {
        // Giả lập lấy dữ liệu từ API
        const mockBill = {
            id: 1,
            customer: 'Nguyễn Văn A',
            address: 'Quận 1, TPHCM',
            status: 'unpaid',
            rooms: [
                { roomNumber: '301', days: 2, price: 150000 },
                { roomNumber: '302', days: 5, price: 170000 }
            ]
        };
        setFormData(mockBill);
    }, [id]);

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
            rooms: [...formData.rooms, { roomNumber: '', days: '', price: '' }]
        });
    };

    const removeRoom = (index) => {
        const newRooms = formData.rooms.filter((_, i) => i !== index);
        setFormData({ ...formData, rooms: newRooms });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý cập nhật hóa đơn vào cơ sở dữ liệu
        navigate('/feature4');
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
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Địa chỉ:</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Trạng thái:</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
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