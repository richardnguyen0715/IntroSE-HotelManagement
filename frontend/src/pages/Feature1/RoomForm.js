import React, { useState, useEffect } from 'react';
import { useRooms } from './RoomContext';
import './Feature1.css';

function RoomForm({ room, onClose }) {
    const { addRoom, editRoom } = useRooms();
    const [formData, setFormData] = useState({
        roomNumber: '',
        roomType: '',
        price: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (room) {
            setFormData({
                roomNumber: room.roomNumber,
                roomType: room.roomType,
                price: room.price
            });
        }
    }, [room]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            if (room) {
                editRoom(room.id, formData);
            } else {
                addRoom(formData);
            }
            onClose();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{room ? 'Sửa Phòng' : 'Thêm Phòng Mới'}</h3>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Số Phòng:</label>
                        <input
                            type="text"
                            name="roomNumber"
                            value={formData.roomNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Loại Phòng:</label>
                        <input
                            type="text"
                            name="roomType"
                            value={formData.roomType}
                            onChange={handleChange}
                            placeholder="A, B, C"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Đơn Giá:</label>
                        <input
                            type="text"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="VD: 150,000"
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="button-group">
                        <button type="submit" className="btn-save">
                            {room ? 'Cập Nhật' : 'Thêm'}
                        </button>
                        <button type="button" onClick={onClose} className="btn-cancel">
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RoomForm; 