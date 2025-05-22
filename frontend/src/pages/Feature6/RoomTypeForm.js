import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useRegulation } from './RegulationContext';
import './Feature6.css';

function RoomTypeForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const { roomTypes, updateRoomTypes } = useRegulation();

    const [formData, setFormData] = useState({
        type: '',
        price: '',
        quantity: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (location.state?.roomId) {
            const roomToEdit = roomTypes.find(room => room.id === location.state.roomId);
            if (roomToEdit) {
                setFormData({
                    type: roomToEdit.type,
                    price: roomToEdit.price.toString(),
                    quantity: roomToEdit.quantity.toString()
                });
            }
        }
    }, [location.state, roomTypes]);

    const validateForm = () => {
        const newErrors = {};

        // Validate room type (A-Z)
        if (!formData.type) {
            newErrors.type = 'Vui lòng nhập loại phòng';
        } else if (!/^[A-Z]$/.test(formData.type)) {
            newErrors.type = 'Loại phòng phải là một chữ cái in hoa (A-Z)';
        }

        // Validate price
        if (!formData.price) {
            newErrors.price = 'Vui lòng nhập đơn giá';
        } else if (isNaN(formData.price) || parseInt(formData.price) <= 0) {
            newErrors.price = 'Đơn giá phải là số dương';
        }

        // Validate quantity
        if (!formData.quantity) {
            newErrors.quantity = 'Vui lòng nhập số lượng phòng';
        } else if (isNaN(formData.quantity) || parseInt(formData.quantity) <= 0) {
            newErrors.quantity = 'Số lượng phòng phải là số dương';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const roomTypeData = {
            type: formData.type,
            price: parseInt(formData.price),
            quantity: parseInt(formData.quantity)
        };

        if (location.state?.roomId) {
            // Edit existing room type
            const updatedRoomTypes = roomTypes.map(room =>
                room.id === location.state.roomId
                    ? { ...room, ...roomTypeData }
                    : room
            );
            updateRoomTypes(updatedRoomTypes);
        } else {
            // Add new room type
            const newId = Math.max(...roomTypes.map(room => room.id), 0) + 1;
            updateRoomTypes([...roomTypes, { id: newId, ...roomTypeData }]);
        }

        navigate('/feature6/regulation1');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
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
                    <h2>{location.state?.roomId ? 'Sửa loại phòng' : 'Thêm loại phòng'}</h2>
                    <Link to="/feature6/regulation1" className="back-button">
                        <img src="/icons/Navigate.png" alt="Back" />
                    </Link>
                </div>

                <form className="room-type-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="type">Loại phòng:</label>
                        <input
                            type="text"
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            placeholder="Nhập loại phòng (A-Z)"
                        />
                        {errors.type && <div className="error-message">{errors.type}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="price">Đơn giá (VNĐ):</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Nhập đơn giá"
                        />
                        {errors.price && <div className="error-message">{errors.price}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="quantity">Số lượng phòng:</label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            placeholder="Nhập số lượng phòng"
                        />
                        {errors.quantity && <div className="error-message">{errors.quantity}</div>}
                    </div>

                    <div className="form-actions">
                        <Link to="/feature6/regulation1">
                            <button type="button" className="action-button cancel">Hủy</button>
                        </Link>
                        <button type="submit" className="action-button confirm">
                            {location.state?.roomId ? 'Cập nhật' : 'Thêm'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default RoomTypeForm; 