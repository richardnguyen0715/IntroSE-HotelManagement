import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRegulation } from './RegulationContext';
import './Feature6.css';

const Regulation2 = () => {
    const { customerTypes, maxCustomers, updateCustomerTypes, updateMaxCustomers } = useRegulation();
    const [selectedCustomerTypes, setSelectedCustomerTypes] = useState([]);
    const [isEditingMaxCustomers, setIsEditingMaxCustomers] = useState(false);
    const [newMaxCustomers, setNewMaxCustomers] = useState(maxCustomers);
    const [showCustomerTypeForm, setShowCustomerTypeForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [customerTypeForm, setCustomerTypeForm] = useState({
        id: null,
        type: '',
        coefficient: 1
    });
    // Xử lý chọn/bỏ chọn loại khách
    const handleCustomerTypeSelection = (customerTypeId) => {
        if (selectedCustomerTypes.includes(customerTypeId)) {
            setSelectedCustomerTypes(selectedCustomerTypes.filter(id => id !== customerTypeId));
        } else {
            setSelectedCustomerTypes([...selectedCustomerTypes, customerTypeId]);
        }
    };

    // Xử lý thêm loại khách mới
    const handleAddCustomerType = () => {
        setIsEditing(false);
        setCustomerTypeForm({
            id: null,
            type: '',
            coefficient: 1
        });
        setShowCustomerTypeForm(true);
    };

    // Xử lý chỉnh sửa loại khách
    const handleEditCustomerType = () => {
        if (selectedCustomerTypes.length === 1) {
            const customerType = customerTypes.find(ct => ct.id === selectedCustomerTypes[0]);
            setIsEditing(true);
            setCustomerTypeForm({
                id: customerType.id,
                type: customerType.type,
                coefficient: customerType.coefficient
            });
            setShowCustomerTypeForm(true);
        }
    };
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setCustomerTypeForm({
            ...customerTypeForm,
            [name]: name === 'coefficient' ? parseFloat(value) : value
        });
    };
    const handleFormSubmit = (e) => {
        e.preventDefault();
    
        if (isEditing) {
            // Cập nhật loại khách hiện có
            const updatedCustomerTypes = customerTypes.map(ct => 
                ct.id === customerTypeForm.id ? customerTypeForm : ct
            );
            updateCustomerTypes(updatedCustomerTypes);
        } else {
            // Thêm loại khách mới
            const newCustomerType = {
                ...customerTypeForm,
                id: Date.now() // Tạo id đơn giản
            };
            updateCustomerTypes([...customerTypes, newCustomerType]);
        }
    
    // Reset form và đóng modal
        setShowCustomerTypeForm(false);
        setSelectedCustomerTypes([]);
    };
    // Xử lý xóa loại khách
    const handleDeleteCustomerType = () => {
        if (selectedCustomerTypes.length > 0) {
            // Thêm hộp thoại xác nhận
            if (window.confirm('Bạn có chắc chắn muốn xóa các loại khách đã chọn?')) {
                const updatedCustomerTypes = customerTypes.filter(
                    customerType => !selectedCustomerTypes.includes(customerType.id)
                );
                updateCustomerTypes(updatedCustomerTypes);
                setSelectedCustomerTypes([]);
            }
        }
    };

    // Xử lý chỉnh sửa số khách tối đa
    const handleEditMaxCustomers = () => {
        setIsEditingMaxCustomers(true);
    };

    // Xử lý lưu số khách tối đa mới
    const handleSaveMaxCustomers = () => {
    // Đảm bảo giá trị là số và tối thiểu là 1
        const maxValue = newMaxCustomers === '' ? 1 : parseInt(newMaxCustomers) || 1;
        updateMaxCustomers(maxValue);
        setIsEditingMaxCustomers(false);
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
                </nav>
            </header>

            <main className="main-content">
                <div className="header-container">
                    <h2>Quy định 2</h2>
                    <Link to="/feature6" className="back-button">
                        <img src="/icons/Navigate.png" alt="Back" />
                    </Link>
                </div>

                <div className="regulation-container">
                    <h3>Số khách tối đa</h3>
                    <div>
                        <p>Số khách tối đa mỗi phòng: {maxCustomers} {" "}
                            {!isEditingMaxCustomers ? (
                                <button 
                                    className="edit-button-small" 
                                    onClick={handleEditMaxCustomers}
                                >
                                    CHỈNH SỬA
                                </button>
                            ) : (
                                <>
                                    <input 
                                        type="number" 
                                        value={newMaxCustomers}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setNewMaxCustomers(value === '' ? '' : parseInt(value) || maxCustomers);
                                        }}
                                        min="1"
                                        max="10"
                                    />
                                    <button 
                                        className="save-button-small"
                                        onClick={handleSaveMaxCustomers}
                                    >
                                        LƯU
                                    </button>
                                </>
                            )}
                        </p>
                    </div>

                    <h3>Danh sách loại khách</h3>

                    <div className="room-types-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Loại khách</th>
                                    <th>Hệ số</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customerTypes.map((customerType, index) => (
                                    <tr key={customerType.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedCustomerTypes.includes(customerType.id)}
                                                onChange={() => handleCustomerTypeSelection(customerType.id)}
                                            />
                                            {index + 1}
                                        </td>
                                        <td>{customerType.type}</td>
                                        <td>{customerType.coefficient}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="button-container">
                        <button 
                            className="action-button add clickable"
                            onClick={handleAddCustomerType}
                        >
                            THÊM
                        </button>
                        <button 
                            className={`action-button edit ${selectedCustomerTypes.length === 1 ? 'clickable' : 'disabled'}`}
                            onClick={handleEditCustomerType}
                            disabled={selectedCustomerTypes.length !== 1}
                        >
                            SỬA
                        </button>
                        <button 
                            className={`action-button delete ${selectedCustomerTypes.length > 0 ? 'clickable' : 'disabled'}`}
                            onClick={handleDeleteCustomerType}
                            disabled={selectedCustomerTypes.length === 0}
                        >
                            XÓA
                        </button>
                    </div>
                    {showCustomerTypeForm && (
                        <div className="modal">
                            <div className="modal-content">
                                <h3>{isEditing ? 'Sửa loại khách' : 'Thêm loại khách'}</h3>
                                <form onSubmit={handleFormSubmit}>
                                    <div className="form-group">
                                        <label>Loại khách:</label>
                                        <input
                                            type="text"
                                            name="type"
                                            value={customerTypeForm.type}
                                            onChange={handleFormChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Hệ số:</label>
                                        <input
                                            type="number"
                                            name="coefficient"
                                            value={customerTypeForm.coefficient}
                                            onChange={handleFormChange}
                                            step="0.1"
                                            min="0.1"
                                            required
                                        />
                                    </div>
                                    <div className="form-actions">
                                        <button 
                                            type="button" 
                                            className="cancel-button" 
                                            onClick={() => setShowCustomerTypeForm(false)}
                                        >               
                                            Hủy
                                        </button>
                                        <button type="submit" className="confirm-button">
                                            {isEditing ? 'Cập nhật' : 'Thêm'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Regulation2;