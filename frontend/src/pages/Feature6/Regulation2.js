import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRegulation } from './RegulationContext';
import './Feature6.css';

function Regulation2() {
    const { customerTypes, updateCustomerTypes, maxCustomers, updateMaxCustomers } = useRegulation();
    const [selectedCustomerTypes, setSelectedCustomerTypes] = useState([]);
    const [editingCustomerType, setEditingCustomerType] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCustomerType, setNewCustomerType] = useState({ type: '', surcharge: 0 });

    const handleCustomerTypeCheckboxChange = (id) => {
        setSelectedCustomerTypes(prev => {
            if (prev.includes(id)) {
                return prev.filter(typeId => typeId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const handleDeleteCustomerTypes = () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa các loại khách đã chọn?')) {
            const updatedCustomerTypes = customerTypes.filter(type => !selectedCustomerTypes.includes(type.id));
            updateCustomerTypes(updatedCustomerTypes);
            setSelectedCustomerTypes([]);
        }
    };

    const handleAddCustomerType = (e) => {
        e.preventDefault();
        const newType = {
            id: Date.now().toString(),
            ...newCustomerType
        };
        updateCustomerTypes([...customerTypes, newType]);
        setNewCustomerType({ type: '', surcharge: 0 });
        setShowAddForm(false);
    };

    const handleEditClick = () => {
        const selectedType = customerTypes.find(type => type.id === selectedCustomerTypes[0]);
        setEditingCustomerType(selectedType);
        setShowEditForm(true);
    };

    const handleEditCustomerType = (e) => {
        e.preventDefault();
        const updatedCustomerTypes = customerTypes.map(type =>
            type.id === editingCustomerType.id ? editingCustomerType : type
        );
        updateCustomerTypes(updatedCustomerTypes);
        setShowEditForm(false);
        setSelectedCustomerTypes([]);
    };

    const handleMaxCustomersChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value > 0) {
            updateMaxCustomers(value);
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
                    <h2>Quy định 2</h2>
                    <Link to="/feature6" className="back-button">
                        <img src="/icons/Navigate.png" alt="Back" />
                    </Link>
                </div>

                <div className="regulation-container">
                    <div className="regulation-section">
                        <h3>Số khách tối đa</h3>
                        <div className="max-customers-input">
                            <label>Số khách tối đa mỗi phòng:</label>
                            <input
                                type="number"
                                value={maxCustomers}
                                onChange={handleMaxCustomersChange}
                                min="1"
                            />
                        </div>

                        <h3>Danh sách loại khách</h3>
                        <div className="table-section">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Loại khách</th>
                                        <th>Hệ số</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customerTypes.map((type, index) => (
                                        <tr key={type.id}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCustomerTypes.includes(type.id)}
                                                    onChange={() => handleCustomerTypeCheckboxChange(type.id)}
                                                />
                                                {index + 1}
                                            </td>
                                            <td>{type.type}</td>
                                            <td>{type.surcharge}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="button-container">
                            <button
                                className="action-button add"
                                onClick={() => setShowAddForm(true)}
                            >
                                Thêm
                            </button>
                            <button
                                className="action-button edit"
                                onClick={handleEditClick}
                                disabled={selectedCustomerTypes.length !== 1}
                            >
                                Sửa
                            </button>
                            <button
                                className="action-button delete"
                                onClick={handleDeleteCustomerTypes}
                                disabled={selectedCustomerTypes.length === 0}
                            >
                                Xóa
                            </button>
                        </div>

                        {showAddForm && (
                            <div className="modal">
                                <div className="modal-content">
                                    <h3>Thêm loại khách</h3>
                                    <form onSubmit={handleAddCustomerType}>
                                        <div className="form-group">
                                            <label>Loại khách:</label>
                                            <input
                                                type="text"
                                                value={newCustomerType.type}
                                                onChange={(e) => setNewCustomerType({
                                                    ...newCustomerType,
                                                    type: e.target.value
                                                })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Hệ số:</label>
                                            <input
                                                type="number"
                                                value={newCustomerType.surcharge}
                                                onChange={(e) => setNewCustomerType({
                                                    ...newCustomerType,
                                                    surcharge: parseFloat(e.target.value)
                                                })}
                                                min="0"
                                                step="0.1"
                                                required
                                            />
                                        </div>
                                        <div className="button-container">
                                            <button type="submit" className="action-button add">
                                                Lưu
                                            </button>
                                            <button
                                                type="button"
                                                className="action-button cancel"
                                                onClick={() => setShowAddForm(false)}
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {showEditForm && (
                            <div className="modal">
                                <div className="modal-content">
                                    <h3>Sửa loại khách</h3>
                                    <form onSubmit={handleEditCustomerType}>
                                        <div className="form-group">
                                            <label>Loại khách:</label>
                                            <input
                                                type="text"
                                                value={editingCustomerType.type}
                                                onChange={(e) => setEditingCustomerType({
                                                    ...editingCustomerType,
                                                    type: e.target.value
                                                })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Hệ số:</label>
                                            <input
                                                type="number"
                                                value={editingCustomerType.surcharge}
                                                onChange={(e) => setEditingCustomerType({
                                                    ...editingCustomerType,
                                                    surcharge: parseFloat(e.target.value)
                                                })}
                                                min="0"
                                                step="0.1"
                                                required
                                            />
                                        </div>
                                        <div className="button-container">
                                            <button type="submit" className="action-button add">
                                                Lưu
                                            </button>
                                            <button
                                                type="button"
                                                className="action-button cancel"
                                                onClick={() => {
                                                    setShowEditForm(false);
                                                    setSelectedCustomerTypes([]);
                                                }}
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Regulation2; 