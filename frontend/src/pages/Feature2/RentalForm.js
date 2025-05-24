import React, { useState, useEffect } from 'react';
import { useRentals } from './RentalContext';
import { useRegulation } from '../Feature6/RegulationContext';

function RentalForm({ rental, onClose }) {
    const { addRental, updateRental } = useRentals();
    const { maxCustomers } = useRegulation();
    const [formData, setFormData] = useState({
        roomNumber: '',
        startDate: '',
        customers: Array(maxCustomers).fill().map((_, index) => ({
            id: index + 1,
            name: '',
            type: 'Nội địa',
            idNumber: '',
            address: ''
        }))
    });

    useEffect(() => {
        if (rental) {
            setFormData({
                ...rental,
                customers: [
                    ...rental.customers,
                    ...Array(maxCustomers - rental.customers.length).fill().map((_, i) => ({
                        id: rental.customers.length + i + 1,
                        name: '',
                        type: 'Nội địa',
                        idNumber: '',
                        address: ''
                    }))
                ]
            });
        }
    }, [rental, maxCustomers]);

    const handleCustomerChange = (index, field, value) => {
        const newCustomers = [...formData.customers];
        newCustomers[index] = {
            ...newCustomers[index],
            [field]: value
        };
        setFormData({
            ...formData,
            customers: newCustomers
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Filter out empty customer entries
        const validCustomers = formData.customers.filter(c => c.name && c.idNumber && c.address);

        if (validCustomers.length === 0) {
            alert('Vui lòng nhập thông tin ít nhất một khách hàng');
            return;
        }

        if (validCustomers.length > maxCustomers) {
            alert(`Số lượng khách không được vượt quá ${maxCustomers} người`);
            return;
        }

        const rentalData = {
            ...formData,
            customers: validCustomers
        };

        if (rental) {
            updateRental(rental.id, rentalData);
        } else {
            addRental(rentalData);
        }
        onClose();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h3>{rental ? 'Chỉnh sửa phiếu thuê phòng' : 'Tạo phiếu thuê phòng'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Phòng:</label>
                        <input
                            type="text"
                            value={formData.roomNumber}
                            onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Ngày bắt đầu thuê:</label>
                        <input
                            type="text"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            placeholder="DD/MM/YYYY"
                            required
                        />
                    </div>

                    <div className="customers-section">
                        <h4>Danh sách khách hàng (Tối đa {maxCustomers} khách)</h4>
                        {formData.customers.map((customer, index) => (
                            <div key={customer.id} className="customer-form">
                                <div className="form-group">
                                    <label>Khách hàng {index + 1}:</label>
                                    <input
                                        type="text"
                                        value={customer.name}
                                        onChange={(e) => handleCustomerChange(index, 'name', e.target.value)}
                                        placeholder="Tên khách hàng"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Loại khách:</label>
                                    <select
                                        value={customer.type}
                                        onChange={(e) => handleCustomerChange(index, 'type', e.target.value)}
                                    >
                                        <option value="Nội địa">Nội địa</option>
                                        <option value="Nước ngoài">Nước ngoài</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>CMND:</label>
                                    <input
                                        type="text"
                                        value={customer.idNumber}
                                        onChange={(e) => handleCustomerChange(index, 'idNumber', e.target.value)}
                                        placeholder="Số CMND"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Địa chỉ:</label>
                                    <input
                                        type="text"
                                        value={customer.address}
                                        onChange={(e) => handleCustomerChange(index, 'address', e.target.value)}
                                        placeholder="Địa chỉ"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-button" onClick={onClose}>
                            Hủy
                        </button>
                        <button type="submit" className="confirm-button">
                            {rental ? 'Cập nhật' : 'Xác nhận'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RentalForm; 