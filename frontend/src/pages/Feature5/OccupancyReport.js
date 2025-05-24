import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Feature5.css';
import { useReports } from './ReportContext';

function OccupancyReport() {
    const navigate = useNavigate();
    const { occupancyReports, deleteOccupancyReports } = useReports();
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
        navigate('/feature5/occupancy/add');
    };

    const handleEdit = () => {
        const [month, id] = selectedReports[0].split('-');
        const report = occupancyReports.find(r => r.month === month)?.items.find(item => item.id === parseInt(id));

        if (report) {
            navigate('/feature5/occupancy/edit', {
                state: {
                    month,
                    id: parseInt(id),
                    roomType: report.roomType,
                    occupancy: report.occupancy,
                    rentDays: report.rentDays
                }
            });
        }
    };

    const handleDelete = () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa các báo cáo đã chọn?')) {
            deleteOccupancyReports(selectedReports);
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
                    <h2>Báo cáo mật độ sử dụng phòng</h2>
                    <button onClick={handleGoBack} className="back-button">
                        <img src="/icons/Navigate.png" alt="Back" />
                    </button>
                </div>

                <div className="reports-container">
                    {occupancyReports.length === 0 ? (
                        <div className="no-data">
                            <p>Chưa có báo cáo nào. Vui lòng thêm báo cáo mới.</p>
                        </div>
                    ) : (
                        occupancyReports.map((monthReport) => (
                            <div key={monthReport.month} className="revenue-report">
                                <table className="report-table">
                                    <thead>
                                        <tr>
                                            <th colSpan="5" style={{ textAlign: 'center' }}>
                                                Tháng {monthReport.month}
                                            </th>
                                        </tr>
                                        <tr>
                                            <th></th>
                                            <th>STT</th>
                                            <th>Loại phòng</th>
                                            <th>Tỉ lệ</th>
                                            <th>Số ngày thuê</th>
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
                                                <td data-type="percentage">{report.occupancy}%</td>
                                                <td>{report.rentDays}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))
                    )}

                    <div className="report-actions">
                        <button 
                            className="action-button add-button"
                            onClick={handleAdd}
                        >
                            Thêm
                        </button>
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

export default OccupancyReport; 