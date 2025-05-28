import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegulation } from './RegulationContext';
import './Feature6.css';

const RegulationForm = () => {
    const navigate = useNavigate();
    const { regulations, updateRegulation } = useRegulation();
    const [formData, setFormData] = useState({
        maxCustomers: regulations?.maxCustomers || 3,
        surchargeRate: regulations?.surchargeRate || 25,
        foreignSurcharge: regulations?.foreignSurcharge || 1.5
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        updateRegulation({
            ...regulations,
            ...formData
        });
        navigate('/feature6');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: Number(value)
        }));
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
                    <h2>Quy định 4: Phụ thu theo số lượng khách</h2>
                    <Link to="/feature6" className="back-button">
                        <img src="/icons/Navigate.png" alt="Back" />
                    </Link>
                </div>

                <form className="regulation-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="maxCustomers">Số khách tối đa trong phòng:</label>
                        <input
                            type="number"
                            id="maxCustomers"
                            name="maxCustomers"
                            value={formData.maxCustomers}
                            onChange={handleChange}
                            min="1"
                            max="3"
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="surchargeRate">Tỷ lệ phụ thu khách thứ 3 (%):</label>
                        <input
                            type="number"
                            id="surchargeRate"
                            name="surchargeRate"
                            value={formData.surchargeRate}
                            onChange={handleChange}
                            min="0"
                            max="100"
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="foreignSurcharge">Hệ số phụ thu khách nước ngoài:</label>
                        <input
                            type="number"
                            id="foreignSurcharge"
                            name="foreignSurcharge"
                            value={formData.foreignSurcharge}
                            onChange={handleChange}
                            min="1"
                            step="0.1"
                            className="form-input"
                        />
                    </div>

                    <div className="form-actions">
                        <Link to="/feature6">
                            <button type="button" className="action-button cancel">Hủy</button>
                        </Link>
                        <button type="submit" className="action-button confirm">
                            Lưu thay đổi
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default RegulationForm; 