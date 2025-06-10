import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { RoomProvider } from '../Feature1/RoomContext';
import AddForm from './AddForm';
import './Feature4.css';

// Separate inner component to use context
function Feature4Content() {
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [bills, setBills] = useState([]);
  const [selectedBills, setSelectedBills] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resetCheckboxes, setResetCheckboxes] = useState(0);
  const API_URL = 'http://localhost:5000/api';

  // Các state bộ lọc
  const [filterCustomer, setFilterCustomer] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'paid', 'unpaid'
  const [filterMinPrice, setFilterMinPrice] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  // Kiểm tra người dùng đã đăng nhập
  const { userInfo, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Lấy thông tin về các phòng đã chọn từ Feature2
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

  // Update selectedRooms when location.state changes
  useEffect(() => {
    if (location.state?.selectedRooms) {
      setSelectedRooms(location.state.selectedRooms);
    }
  }, [location.state]);

  // Gọi API để lấy danh sách hóa đơn
  const fetchBills = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        setError("Bạn cần đăng nhập để tiếp tục");
        return;
      }
      const response = await fetch(`${API_URL}/invoices`, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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

  // Xử lý sự kiện khi chọn hoặc bỏ chọn hóa đơn
  const handleBillSelection = (bill) => {
    if (selectedBills.some(b => b._id === bill._id)) {
      setSelectedBills(selectedBills.filter(b => b._id !== bill._id));
    } else {
      setSelectedBills([...selectedBills, bill]);
    }
  };

  // Xử lý thanh toán hóa đơn
  const handlePay = async () => {
    if (selectedUnpaidBills.length === 0) return;

    let token = userInfo.token;
    if (!window.confirm(`Bạn có chắc chắn muốn thanh toán ${selectedUnpaidBills.length} hóa đơn đã chọn không?`)) {
      return;
    }

    let successCount = 0;
    let failCount = 0;
    let failMessages = [];

    // Sao chép bills để cập nhật trạng thái
    let updatedBills = [...bills];

    try {
      for (const billToPay of selectedUnpaidBills) {  
        try {
          const response = await fetch(`${API_URL}/invoices/${billToPay._id}/confirm-payment`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` 
            },
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

      // Thông báo kết quả
      let alertMessage = `Thanh toán thành công ${successCount} hóa đơn.`;
      if (failCount > 0) {
        alertMessage += `\n${failCount} hóa đơn lỗi\n` + failMessages.join('\n');
      }
      alert(alertMessage);
    } finally {
      // Reset selectedBills và force re-render checkboxes
      setSelectedBills([]);
      setResetCheckboxes(prev => prev + 1);
    }
  };

  // Xử lý xóa hóa đơn
  const handleDelete = async () => {
    if (selectedBills.length === 0) return;

    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedBills.length} hóa đơn đã chọn không?`)) {
      return;
    }

    try {
      // Gọi API xóa lần lượt từng hóa đơn đã chọn
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        setError("Bạn cần đăng nhập để thực hiện xóa");
        return;
      }

      for (const bill of selectedBills) {
        const response = await fetch(`${API_URL}/invoices/${bill._id}`, {
          method: 'DELETE',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Lỗi khi xóa hóa đơn');
        }
      }

      // Nếu xóa thành công tất cả
      setBills(prev => prev.filter(bill => !selectedBills.some(sb => sb._id === bill._id)));
      alert('Xóa hóa đơn thành công!');

    } catch (error) {
      alert(`Lỗi khi xóa: ${error.message}`);
    } finally {
      // Reset selectedBills và force re-render checkboxes
      setSelectedBills([]);
      setResetCheckboxes(prev => prev + 1);
    }
  };

  // Render bảng hóa đơn
  const renderBillTable = (bill) => {
    return (
      <div className={`rental-card bill-status ${bill.status === 'paid' ? 'paid' : 'unpaid'}`}>
        <div className={`rental-header bill-status ${bill.status === 'paid' ? 'paid' : 'unpaid'}`}>
          <div className="rental-checkbox">
            <input
              type="checkbox"
              key={`checkbox-${bill._id}-${resetCheckboxes}`}
              onChange={e => {
                e.stopPropagation();
                handleBillSelection(bill);
              }}
              onClick={e => e.stopPropagation()}
            />
            <span className="rental-id">ID: {bill._id}</span>
          </div>
          <span className={"rental-status"}>{bill.status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
        </div>

        <div className="rental-details">
          <div className="rental-info-row rental-info-row-first">
            <div className="rental-info-item">
              <strong>Khách hàng/Cơ quan:</strong> {bill.customer}
            </div>

            <div className="rental-info-item rental-info-item-after">
              <strong>Địa chỉ:</strong> {bill.address}
            </div>
          </div>

          <div className="rental-info-row">
            <div className="rental-info-item">
              <strong>Thành tiền:</strong> {(bill.totalValue ?? 0).toLocaleString('vi-VN')} VNĐ
            </div>

            <div className="rental-info-item rental-info-item-after">
              <strong>Ngày tạo:</strong> {new Date(bill.issueDate).toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>

        <div className="rental-customers">
          <h4>Danh sách phòng</h4>
          <table className="customer-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Phòng</th>
                <th>Số ngày thuê</th>
                <th>Đơn giá (VNĐ)</th>
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

  const selectedUnpaidBills = bills.filter(
    bill => selectedBills.some(selected => selected._id === bill._id) && bill.status !== 'paid'
  );

  // Thêm hàm resetFilters
  const resetFilters = () => {
    setFilterCustomer('');
    setFilterStatus('all');
    setFilterMinPrice('');
    setFilterMaxPrice('');
    setFilterStartDate('');
    setFilterEndDate('');
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <Link to="/HomePage">
            <h1>HotelManager</h1>
          </Link>
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
                <button className="logout-button" onClick={logout}>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="header-container">
          <h2>Lập Hóa đơn thanh toán</h2>
          <Link to="/HomePage" className="back-button">
            <img src="/icons/Navigate.png" alt="Back" />
          </Link>
        </div>
        
        <div className="feature-content">
          <h3>Danh sách các hóa đơn</h3>
          {/* Filter */}
          <div className="filter-section">
            <h4>BỘ LỌC</h4>
            <div className="filter-container">
              <div className="filter-item">
                <label htmlFor="filterCustomer">Khách hàng</label>
                <input
                  id="filterCustomer"
                  type="text"
                  placeholder="Tìm theo khách hàng"
                  value={filterCustomer}
                  onChange={e => setFilterCustomer(e.target.value)}
                />
              </div>

              <div className="filter-item">
                <label htmlFor="filterStartDate">Ngày bắt đầu</label>
                <input
                  id="filterStartDate"
                  type="date"
                  value={filterStartDate}
                  onChange={e => setFilterStartDate(e.target.value)}
                />
              </div>

              <div className="filter-item">
                <label htmlFor="filterMinPrice">Giá min (VNĐ)</label>
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
                <label htmlFor="filterStatus">Trạng thái</label>
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
                <label htmlFor="filterEndDate">Ngày kết thúc</label>
                <input
                  id="filterEndDate"
                  type="date"
                  value={filterEndDate}
                  onChange={e => setFilterEndDate(e.target.value)}
                />
              </div>

              <div className="filter-item">
                <label htmlFor="filterMaxPrice">Giá max (VNĐ)</label>
                <input
                  id="filterMaxPrice"
                  type="number"
                  placeholder="Giá max"
                  value={filterMaxPrice}
                  onChange={e => setFilterMaxPrice(e.target.value)}
                  min="0"
                />
              </div>
            </div>
            <button className="filter-button reset" id='reset-filter-feature4' onClick={resetFilters}>
              Xóa bộ lọc
            </button>
          </div>

          <div className="table-section">
            {loading && <p>Đang tải hóa đơn...</p>}
            {error && <p className="error">{error}</p>}
            {!loading && !error && filteredBills.map(renderBillTable)}
          </div>

          <div className="button-container">
            <button className="action-button add" onClick={() => setShowAddPopup(true)}>Thêm</button>
            <button className={`action-button delete ${selectedBills.length > 0 ? "clickable" : ""}`}
              disabled={selectedBills.length === 0} 
              onClick={handleDelete}>Xóa</button>
            <button
              className={`action-button booking ${selectedUnpaidBills.length > 0 ? "clickable" : ""}`}
              disabled={selectedUnpaidBills.length === 0}
              onClick={handlePay}
            >
              Thanh toán
            </button>
          </div>
        </div>
          
        {showAddPopup && (
        <AddForm
          onClose={() => {
            setShowAddPopup(false);
            setSelectedRooms([]); // Reset selected rooms when closing
          }}
          onSave={(newInvoice) => {
            setBills(prev => [...prev, newInvoice]);
            setShowAddPopup(false);
          }}
          initialRooms={selectedRooms}
        />
        )}
      </main>
    </div>
  );
}

// Wrapper component that provides the RoomContext
function Feature4Main() {
  return (
    <RoomProvider>
      <Feature4Content />
    </RoomProvider>
  );
}

export default Feature4Main; 
