import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import "./Feature4.css";

function Feature4Main() {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

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

    useEffect(() => {
        // Kiểm tra token theo thứ tự ưu tiên
        let token = localStorage.getItem("token");
        let savedUserInfo = localStorage.getItem("userInfo");
    
        // Nếu không có trong localStorage, kiểm tra sessionStorage
        if (!token) {
            token = sessionStorage.getItem("token");
            savedUserInfo = sessionStorage.getItem("userInfo");
        }
    
        if (!token) {
            // Nếu không có token ở cả 2 nơi -> chuyển về login
            navigate("/login", { replace: true });
            return;
        }
    
        if (savedUserInfo) {
            setUserInfo(JSON.parse(savedUserInfo));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);
    
    const handleLogout = () => {
        // Xóa token và userInfo ở cả localStorage và sessionStorage
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userInfo");
        navigate("/login", { replace: true });
    };

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
                    <h1>HotelManager</h1>
                </div>

                <div className="header-right">
                    <Link to="/about">Về chúng tôi</Link>
                    <img
                        src="/icons/VietnamFlag.png"
                        alt="Vietnam Flag"
                        className="flag"
                    />
                    <div className="user-menu">
                        <div
                            className="user-avatar"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <img src="/icons/User.png" alt="User" />
                        </div>

                        {isDropdownOpen && (
                            <div className="user-dropdown">
                                <div className="user-info">
                                    <h3>Thông tin người dùng</h3>
                                    <p>Họ tên: {userInfo?.name}</p>
                                    <p>Email: {userInfo?.email}</p>
                                    <p>Vai trò: {userInfo?.role}</p>
                                </div>
                                <button className="logout-button" onClick={handleLogout}>
                                    Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="main-content">
                <div className="header-container">
                    <h2>Lập hóa đơn</h2>
                    <Link to="/HomePage" className="back-button">
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
}

export default Feature4Main; 