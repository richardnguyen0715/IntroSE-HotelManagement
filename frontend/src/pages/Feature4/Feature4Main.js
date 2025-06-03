import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AddForm from './AddForm';
import './Feature4.css';

const Feature4Main = () => {
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [bills, setBills] = useState([]);
  const [selectedBills, setSelectedBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter states
  const [filterCustomer, setFilterCustomer] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'paid', 'unpaid'
  const [filterMinPrice, setFilterMinPrice] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  // Token and user info check
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    const savedUserInfo =
      localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');

    if (token && savedUserInfo) {
      setUserInfo(JSON.parse(savedUserInfo));
    } else {
      setUserInfo(null);
    }
  }, []);

  // Get the current pathname to determine if we are on the Feature4 page
  const location = useLocation();
  const selectedRoomsFromFeature2 = useMemo(() => {
    return location.state?.selectedRooms || [];
  }, [location.state]);
  // automatically show the popup if there are selected rooms from Feature2
  useEffect(() => {
    if (selectedRoomsFromFeature2.length > 0) {
      setShowAddPopup(true);
    }
  }, [selectedRoomsFromFeature2]);

  // Call API to fetch bills
  const fetchBills = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/invoices', {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Lỗi khi gọi API');
      const data = await response.json();
      setBills(data.data || []);
    } catch (err) {
      setError('Không thể tải danh sách hóa đơn');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // Filter logic
  const filteredBills = bills.filter(bill => {
    if (filterCustomer && !bill.customer.toLowerCase().includes(filterCustomer.toLowerCase())) {
      return false;
    }
    if (filterStatus !== 'all') {
      // Nếu filterStatus là unpaid, thì chấp nhận tất cả trạng thái chưa thanh toán (pending, unpaid, ...)
      if (filterStatus === 'unpaid') {
        const unpaidStates = ['unpaid', 'pending', 'waiting']; // danh sách trạng thái chưa thanh toán
        if (!unpaidStates.includes(bill.status.trim().toLowerCase())) {
          return false;
        }
      } else {
        // Nếu filterStatus là paid thì chỉ lấy những hóa đơn paid
        if (bill.status.trim().toLowerCase() !== filterStatus.trim().toLowerCase()) {
          return false;
        }
      }
    }
    if (filterMinPrice && (bill.totalValue ?? 0) < parseInt(filterMinPrice, 10)) {
      return false;
    }
    if (filterMaxPrice && (bill.totalValue ?? 0) > parseInt(filterMaxPrice, 10)) {
      return false;
    }
    
    if (filterStartDate) {
      const billDate = new Date(bill.issueDate);
      const startDate = new Date(filterStartDate);
      if (billDate < startDate) return false;
    }
    
    if (filterEndDate) {
      const billDate = new Date(bill.issueDate);
      const endDate = new Date(filterEndDate);
      // Để ngày kết thúc là hết ngày, bạn có thể set giờ về 23:59:59
      endDate.setHours(23, 59, 59, 999);
      if (billDate > endDate) return false;
    }

    return true;
  });

  // Handle bill selection
  const handleBillSelection = (bill) => {
    if (selectedBills.some(b => b._id === bill._id)) {
      setSelectedBills(selectedBills.filter(b => b._id !== bill._id));
    } else {
      setSelectedBills([...selectedBills, bill]);
    }
  };

  // Handle payment
  const handlePay = async () => {
    if (selectedBills.length === 0) return;

    if (!window.confirm(`Bạn có chắc chắn muốn thanh toán ${selectedBills.length} hóa đơn đã chọn không?`)) {
      return;
    }

    let successCount = 0;
    let failCount = 0;
    let failMessages = [];

    // Sao chép bills để cập nhật trạng thái
    let updatedBills = [...bills];

    for (const billToPay of selectedBills) {
      try {
        const response = await fetch(`http://localhost:5000/api/invoices/${billToPay._id}/confirm-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          failCount++;
          failMessages.push(`Hoá đơn của khách hàng ${billToPay.customer}: ${result.message || 'Lỗi thanh toán'}`);
          continue;
        }

        successCount++;

        // Cập nhật hóa đơn trong danh sách bills
        const updatedBill = result.data;
        updatedBills = updatedBills.map(bill => bill._id === updatedBill._id ? updatedBill : bill);

      } catch (error) {
        failCount++;
        failMessages.push(`${billToPay.customer}: ${error.message}`);
      }
    }

    // Cập nhật lại danh sách bills state
    setBills(updatedBills);
    setSelectedBills([]);

    // Thông báo kết quả
    let alertMessage = `Thanh toán thành công ${successCount} hóa đơn.`;
    if (failCount > 0) {
      alertMessage += `\n${failCount} hóa đơn lỗi\n` + failMessages.join('\n');
    }
    alert(alertMessage);
  };

  // Handle payment
  const handleDelete = async () => {
    if (selectedBills.length === 0) return;

    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedBills.length} hóa đơn đã chọn không?`)) {
      return;
    }

    try {
      // Gọi API xóa lần lượt từng hóa đơn đã chọn
      for (const bill of selectedBills) {
        const response = await fetch(`http://localhost:5000/api/invoices/${bill._id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Lỗi khi xóa hóa đơn');
        }
      }

      // Nếu xóa thành công tất cả
      setBills(prev => prev.filter(bill => !selectedBills.some(sb => sb._id === bill._id)));
      setSelectedBills([]);
      alert('Xóa hóa đơn thành công!');

    } catch (error) {
      alert(`Lỗi khi xóa: ${error.message}`);
    }
  };

  // Render each bill table
    const renderBillTable = (bill) => {
    const isSelected = selectedBills.some(b => b._id === bill._id);
        return (
            <div
                className={`bill-section ${isSelected ? 'selected' : ''}`}
        key={bill._id}
        onClick={(e) => {
          e.stopPropagation();
          handleBillSelection(bill);
        }}
            >
                <div className={`bill-status ${bill.status === 'paid' ? 'paid' : 'unpaid'}`}>
                    <div className="status-header">
                        <h3>Trạng thái</h3>
            <span className="status-text">{bill.status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
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
              <span className="value">{(bill.totalValue ?? 0).toLocaleString('vi-VN')} VND</span>
            </div>
            <div className="info-row">
              <span className="label">Ngày tạo:</span>
              <span className="value">{new Date(bill.issueDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                    </div>
                    <table className="bill-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Phòng</th>
                                <th>Số ngày thuê</th>
                                <th>Đơn giá</th>
                                <th>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
              {(bill.rentals ?? []).map((rental, idx) => (
                <tr key={rental._id}>
                  <td>{idx + 1}</td>
                  <td>{rental.roomNumber || 'N/A'}</td>
                  <td>{rental.numberOfDays || 0}</td>
                  <td>{rental.pricePerDay ? rental.pricePerDay.toLocaleString('vi-VN') : '0'}</td>
                  <td>{(rental.total ?? 0).toLocaleString('vi-VN')}</td>
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
          <div className="user-menu">
            <div
              className="user-avatar"
              onClick={() => setShowUserDropdown(prev => !prev)}
            >
              <img src="/icons/User.png" alt="User" />
            </div>

            {showUserDropdown && userInfo && (
              <div className="user-dropdown">
                <div className="user-info">
                  <h3>Thông tin người dùng</h3>
                  <p>Họ tên: {userInfo.name}</p>
                  <p>Email: {userInfo.email}</p>
                  <p>Vai trò: {userInfo.role}</p>
                </div>
                <button
                  className="logout-button"
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userInfo');
                    setUserInfo(null);
                    navigate('/login');
                  }}
                >
                  Đăng xuất
                </button>
              </div>
            )}

            {!userInfo && (
              <>
                <Link to="/register">
                  <button className="button-reg">Đăng ký</button>
                </Link>
                <Link to="/login">
                  <button className="button-log">Đăng nhập</button>
                </Link>
              </>
            )}
          </div>

                </nav>
            </header>

            <main className="main-content">
                <div className="header-container">
                    <h2>Lập Hóa đơn thanh toán</h2>
          <Link to="/" className="back-button"><img src="/icons/Navigate.png" alt="Back" /></Link>
        </div>

        {/* Filter */}
        <div className="filter-title">Bộ lọc</div>
        <div className="filter-container">
          <div className="filter-item">
            <label htmlFor="filterCustomer">Khách hàng:</label>
            <input
              id="filterCustomer"
              type="text"
              placeholder="Tìm theo khách hàng"
              value={filterCustomer}
              onChange={e => setFilterCustomer(e.target.value)}
            />
          </div>

          <div className="filter-item">
            <label htmlFor="filterStatus">Trạng thái:</label>
            <select
              id="filterStatus"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="paid">Đã thanh toán</option>
              <option value="unpaid">Chưa thanh toán</option>
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="filterMinPrice">Giá min (VND):</label>
            <input
              id="filterMinPrice"
              type="number"
              placeholder="Giá min"
              value={filterMinPrice}
              onChange={e => setFilterMinPrice(e.target.value)}
              min="0"
            />
          </div>

          <div className="filter-item">
            <label htmlFor="filterMaxPrice">Giá max (VND):</label>
            <input
              id="filterMaxPrice"
              type="number"
              placeholder="Giá max"
              value={filterMaxPrice}
              onChange={e => setFilterMaxPrice(e.target.value)}
              min="0"
            />
          </div>

          <div className="filter-item">
            <label htmlFor="filterStartDate">Ngày bắt đầu:</label>
            <input
              id="filterStartDate"
              type="date"
              value={filterStartDate}
              onChange={e => setFilterStartDate(e.target.value)}
            />
          </div>

          <div className="filter-item">
            <label htmlFor="filterEndDate">Ngày kết thúc:</label>
            <input
              id="filterEndDate"
              type="date"
              value={filterEndDate}
              onChange={e => setFilterEndDate(e.target.value)}
            />
          </div>
                </div>

        <div className="bills-container" onClick={() => setSelectedBills([])}>
                    <h3>Danh sách các hóa đơn thanh toán</h3>
          {loading && <p>Đang tải hóa đơn...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && filteredBills.map(renderBillTable)}

                    <div className="actions-container">
            <button className="action-button add" onClick={() => setShowAddPopup(true)}>Thêm</button>
            <button className="action-button pay" disabled={selectedBills.length === 0} onClick={handlePay}>Thanh toán</button>
            <button className="action-button delete" disabled={selectedBills.length === 0} onClick={handleDelete}>Xóa</button>
                    </div>
                </div>
            </main>

      {showAddPopup && (
      <AddForm
        onClose={() => setShowAddPopup(false)}
        onSave={(newInvoice) => {
          setBills(prev => [...prev, newInvoice]);
          setShowAddPopup(false);
        }}
        initialRooms={selectedRoomsFromFeature2} // truyền mảng số phòng cho AddForm
      />
    )}
        </div>
    );
};

export default Feature4Main; 
