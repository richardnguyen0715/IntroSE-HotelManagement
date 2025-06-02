import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Feature4.css';

const Feature4Main = () => {
    const [bills, setBills] = useState([
        {
            id: 1,
            status: 'paid',
            customer: 'Nguyễn Văn A',
            address: 'Quận 1, TPHCM',
            totalAmount: '1,150,000 VND',
            rooms: [
                { id: 1, roomNumber: '301', days: 2, price: 150000, total: 300000 },
                { id: 2, roomNumber: '302', days: 5, price: 170000, total: 850000 }
            ]
        },
        {
            id: 2,
            status: 'unpaid',
            customer: 'Lê Văn B',
            address: 'Quận 12, TPHCM',
            totalAmount: '2,500,000 VND',
            rooms: [
                { id: 1, roomNumber: '101', days: 10, price: 150000, total: 1500000 },
                { id: 2, roomNumber: '103', days: 5, price: 200000, total: 1000000 }
            ]
        }
    ]);

    const [selectedBill, setSelectedBill] = useState(null);

    // Xử lý xóa hóa đơn
    const handleDelete = () => {
        if (selectedBill && window.confirm(`Bạn có chắc chắn muốn xóa hóa đơn của khách hàng "${selectedBill.customer}" không?`)) {
            setBills(bills.filter(bill => bill.id !== selectedBill.id));
            setSelectedBill(null);
        }
    };

    const renderBillTable = (bill) => {
        const isSelected = selectedBill && selectedBill.id === bill.id;

        return (
            <div
                className={`bill-section ${isSelected ? 'selected' : ''}`}
                key={bill.id}
                onClick={() => setSelectedBill(isSelected ? null : bill)}
            >
                <div className={`bill-status ${bill.status === 'paid' ? 'paid' : 'unpaid'}`}>
                    <div className="status-header">
                        <h3>Trạng thái</h3>
                        <span className="status-text">
                            {bill.status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        </span>
                    </div>
                </div>

                <div className="bill-info">
                    <div className="customer-info">
                        <div className="info-row">
                            <span className="label">Khách hàng/Cơ quan:</span>
                            <span className="value">{bill.customer}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Địa chỉ:</span>
                            <span className="value">{bill.address}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Trị giá:</span>
                            <span className="value">
                                {bill.rooms.reduce((sum, room) => sum + room.days * room.price, 0).toLocaleString('vi-VN')} VND
                            </span>
                        </div>
                    </div>

                    <table className="bill-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Phòng</th>
                                <th>Loại phòng</th>
                                <th>Số ngày thuê</th>
                                <th>Đơn giá</th>
                                <th>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bill.rooms.map((room, index) => (
                                <tr key={room.id}>
                                    <td>{index + 1}</td>
                                    <td>{room.roomNumber}</td>
                                    <td>{room.roomType || 'N/A'}</td>
                                    <td>{room.days}</td>
                                    <td>{room.price.toLocaleString('vi-VN')}</td>
                                    <td>{(room.days * room.price).toLocaleString('vi-VN')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
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
                    <h2>Lập Hóa đơn thanh toán</h2>
                    <Link to="/" className="back-button">
                        <img src="/icons/Navigate.png" alt="Back" />
                    </Link>
                </div>

                <div className="bills-container">
                    <h3>Danh sách các hóa đơn thanh toán</h3>
                    {bills.map(bill => renderBillTable(bill))}

                    <div className="actions-container">
                        <Link to="/feature4/add">
                            <button className="action-button add">
                                Thêm
                            </button>
                        </Link>
                        <Link
                            to={`/feature4/edit/${selectedBill.id}`}
                            state={{ bill: selectedBill }}
                        >
                            <button
                                className="action-button edit"
                                disabled={!selectedBill}
                            >
                                Chỉnh sửa
                            </button>
                        </Link>
                        <button
                            className="action-button delete"
                            onClick={handleDelete}
                            disabled={!selectedBill}
                        >
                            Xóa
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Feature4Main; 