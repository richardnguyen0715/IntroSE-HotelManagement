import React, { useState } from 'react';
import { useRentals } from './RentalContext';
import RentalForm from './RentalForm';
import './Feature2.css';

function Feature2Main() {
    const { rentals, deleteRentals } = useRentals();
    const [selectedRentals, setSelectedRentals] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingRental, setEditingRental] = useState(null);

    const handleCheckboxChange = (rentalId) => {
        setSelectedRentals(prev => {
            if (prev.includes(rentalId)) {
                return prev.filter(id => id !== rentalId);
            } else {
                return [...prev, rentalId];
            }
        });
    };

    const handleAdd = () => {
        setEditingRental(null);
        setShowForm(true);
    };

    const handleEdit = () => {
        const rentalToEdit = rentals.find(rental => rental.id === selectedRentals[0]);
        setEditingRental(rentalToEdit);
        setShowForm(true);
    };

    const handleDelete = () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa các phiếu thuê đã chọn?')) {
            deleteRentals(selectedRentals);
            setSelectedRentals([]);
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingRental(null);
    };

    return (
        <div className="feature-content">
            <h3>Danh sách các phiếu thuê phòng</h3>

            <div className="table-section">
                {rentals.map(rental => (
                    <div key={rental.id} className="rental-card">
                        <div className="rental-header">
                            <div className="rental-room">
                                <span>Phòng: {rental.roomNumber}</span>
                                <input
                                    type="checkbox"
                                    checked={selectedRentals.includes(rental.id)}
                                    onChange={() => handleCheckboxChange(rental.id)}
                                />
                            </div>
                            <span>Ngày bắt đầu thuê: {rental.startDate}</span>
                        </div>
                        <table className="customer-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Khách hàng</th>
                                    <th>Loại khách</th>
                                    <th>CMND</th>
                                    <th>Địa chỉ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rental.customers.map((customer, index) => (
                                    <tr key={customer.id}>
                                        <td>{index + 1}</td>
                                        <td>{customer.name}</td>
                                        <td>{customer.type}</td>
                                        <td>{customer.idNumber}</td>
                                        <td>{customer.address}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>

            <div className="button-container">
                <button
                    className="action-button add clickable"
                    onClick={handleAdd}
                >
                    Thêm
                </button>
                <button
                    className={`action-button edit ${selectedRentals.length === 1 ? 'clickable' : 'disabled'}`}
                    onClick={handleEdit}
                    disabled={selectedRentals.length !== 1}
                >
                    Sửa
                </button>
                <button
                    className={`action-button delete ${selectedRentals.length > 0 ? 'clickable' : 'disabled'}`}
                    onClick={handleDelete}
                    disabled={selectedRentals.length === 0}
                >
                    Xóa
                </button>
            </div>

            {showForm && (
                <RentalForm
                    rental={editingRental}
                    onClose={handleCloseForm}
                />
            )}
        </div>
    );
}

export default Feature2Main; 