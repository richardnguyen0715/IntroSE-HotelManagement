import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Feature5.css';
import { useReports } from './ReportContext';

function RevenueReport() {
    const navigate = useNavigate();
    const { reports, deleteReports } = useReports();
    const [selectedReports, setSelectedReports] = useState([]);

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleCheckboxChange = (month, id) => {
        const key = `${month}-${id}`;
        setSelectedReports(prev => {
            if (prev.includes(key)) {
                return prev.filter(item => item !== key);
            }
            return [...prev, key];
        });
    };

    const handleAdd = () => {
        navigate('/feature5/revenue/add');
    };

    const handleEdit = () => {
        const [month, id] = selectedReports[0].split('-');
        const report = reports.find(r => r.month === month)?.items.find(item => item.id === parseInt(id));

        if (report) {
            navigate('/feature5/revenue/edit', {
                state: {
                    month,
                    id: parseInt(id),
                    roomType: report.roomType,
                    revenue: report.revenue,
                    rentDays: report.rentDays
                }
            });
        }
    };

    const handleDelete = () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa các báo cáo đã chọn?')) {
            deleteReports(selectedReports);
            setSelectedReports([]);
        }
    };

    return (
        <div className="app">
            {/* Header */}
            <header className="app-header">
                <div className="header-left">
                    <h1>HotelManager</h1>
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

            {/* Main Content */}
            <main className="main-content">
                <div className="header-container">
                    <h2>Báo cáo doanh thu theo loại phòng</h2>
                    <button onClick={handleGoBack} className="back-button">
                        <img src="/icons/Navigate.png" alt="Back" />
                    </button>
                </div>

                <div className="reports-container">
                    {reports.length === 0 ? (
                        <div className="no-data">
                            <p>Chưa có báo cáo nào. Vui lòng thêm báo cáo mới.</p>
                        </div>
                    ) : (
                        reports.map((monthReport) => (
                            <div key={monthReport.month} className="revenue-report">
                                <table className="report-table">
                                    <thead>
                                        <tr>
                                            <th colSpan="6" style={{ textAlign: 'center' }}>
                                                Tháng {monthReport.month}
                                            </th>
                                        </tr>
                                        <tr>
                                            <th></th>
                                            <th>STT</th>
                                            <th>Loại phòng</th>
                                            <th>Doanh thu</th>
                                            <th>Số ngày thuê</th>
                                            <th>Tỉ lệ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {monthReport.items.map((report) => (
                                            <tr key={report.id}>
                                                <td className="checkbox-cell">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedReports.includes(`${monthReport.month}-${report.id}`)}
                                                        onChange={() => handleCheckboxChange(monthReport.month, report.id)}
                                                    />
                                                </td>
                                                <td>{report.id}</td>
                                                <td>{report.roomType}</td>
                                                <td data-type="currency">{report.revenue}</td>
                                                <td>{report.rentDays}</td>
                                                <td data-type="percentage">{report.percentage}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))
                    )}

                    <div className="report-actions">
                        <button className="action-button add-button" onClick={handleAdd}>Thêm</button>
                        <button
                            className="action-button edit-button"
                            onClick={handleEdit}
                            disabled={selectedReports.length !== 1}
                        >
                            Sửa
                        </button>
                        <button
                            className="action-button delete-button"
                            onClick={handleDelete}
                            disabled={selectedReports.length === 0}
                        >
                            Xóa
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default RevenueReport; 