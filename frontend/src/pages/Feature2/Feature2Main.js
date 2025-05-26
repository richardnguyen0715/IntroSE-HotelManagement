import React, { useState, useEffect } from "react";
import { useRooms } from "../Feature1/RoomContext";
import { useRentals } from "./RentalContext";
import { useLocation } from "react-router-dom";
import RentalForm from "./RentalForm";
import { formatDateForUI } from "../../services/bookings";
import "./Feature2.css";

function Feature2Main() {
  const { rentals, fetchRentals, deleteRentals, loading, error } = useRentals();
  const [selectedRentals, setSelectedRentals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRental, setEditingRental] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const { fetchRooms } = useRooms();
  const location = useLocation();

  // Refresh rentals when component mounts
  useEffect(() => {
    fetchRentals();
  }, []);

  // Kiểm tra dữ liệu từ Feature1 khi component mount
  useEffect(() => {
    const roomData = location.state;

    // Kiểm tra xem có dữ liệu phòng từ Feature1 không
    if (roomData && (roomData.selectedRooms || roomData.roomNumbers)) {
      // Nếu có room array data được chuyển từ Feature1
      if (roomData.roomNumbers && roomData.roomNumbers.length > 0) {
        // Lấy thông tin đầy đủ của các phòng (bao gồm roomNumber và type)
        const selectedRoomData =
          roomData.selectedRoomsData ||
          roomData.roomNumbers.map((roomNumber, index) => ({
            roomNumber,
            type: roomData.roomTypes ? roomData.roomTypes[index] : "",
          }));

        if (selectedRoomData.length === 1) {
          // Nếu chỉ chọn 1 phòng, hiển thị form với phòng đó
          handleAddWithRoom(selectedRoomData[0]);
        } else if (selectedRoomData.length > 1) {
          // Nếu chọn nhiều phòng, hiển thị form với dropdown
          handleAddWithRooms(selectedRoomData);
        }
      }
    }
  }, [location.state]);

  // Hiển thị thông báo thành công trong 3 giây
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Khi component unmount, refresh lại room status
  useEffect(() => {
    return () => {
      fetchRooms();
    };
  }, [fetchRooms]);

  // Xử lý khi chỉ có 1 phòng được chuyển từ Feature1
  const handleAddWithRoom = (roomData) => {
    setEditingRental({
      isNew: true,
      initialRoom: roomData,
    });
    setShowForm(true);
  };

  // Xử lý khi có nhiều phòng được chuyển từ Feature1
  const handleAddWithRooms = (roomsData) => {
    setEditingRental({
      isNew: true,
      initialRooms: roomsData,
    });
    setShowForm(true);
  };

  const handleCheckboxChange = (rentalId) => {
    setSelectedRentals((prev) => {
      if (prev.includes(rentalId)) {
        return prev.filter((id) => id !== rentalId);
      } else {
        return [...prev, rentalId];
      }
    });
  };

  const handleAdd = () => {
    setEditingRental({
      isNew: true,
    });
    setShowForm(true);
  };

  const handleEdit = () => {
    if (selectedRentals.length !== 1) return;

    const rentalToEdit = rentals.find(
      (rental) => rental.id === selectedRentals[0]
    );

    if (rentalToEdit) {
      setEditingRental({
        ...rentalToEdit,
        isNew: false,
      });
      setShowForm(true);
    }
  };

  const handleDelete = async () => {
    if (selectedRentals.length === 0) return;

    if (window.confirm("Bạn có chắc chắn muốn xóa các phiếu thuê đã chọn?")) {
      const success = await deleteRentals(selectedRentals);
      if (success) {
        setSelectedRentals([]);
        setSuccessMessage("Xóa phiếu thuê thành công!");
        // Refresh room status after deletion
        fetchRooms();
      } else {
        setSuccessMessage("Có lỗi xảy ra khi xóa phiếu thuê!");
      }
    }
  };

  const handleSuccess = (message) => {
    setSuccessMessage(message);
    // Refresh rentals & rooms after successful operation
    fetchRentals();
    fetchRooms();
  };

  // Function to format VND price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Function to get status text in Vietnamese
  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Đang chờ";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  // Function to get payment status text in Vietnamese
  const getPaymentStatusText = (status) => {
    switch (status) {
      case "paid":
        return "Đã thanh toán";
      case "pending":
        return "Chưa thanh toán";
      default:
        return status;
    }
  };

  return (
    <div className="feature-content">
      <h3>Danh sách các phiếu thuê phòng</h3>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">Đang tải dữ liệu...</div>}

      <div className="table-section">
        {!loading && rentals.length === 0 ? (
          <p className="empty-message">Chưa có phiếu thuê phòng nào.</p>
        ) : (
          rentals.map((rental) => (
            <div key={rental.id} className="rental-card">
              <div className="rental-header">
                <div className="rental-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedRentals.includes(rental.id)}
                    onChange={() => handleCheckboxChange(rental.id)}
                  />
                  <span className="rental-id">ID: {rental.id}</span>
                </div>
                <span>Email: {rental.email}</span>
              </div>

              <div className="rental-details">
                <div className="rental-info-row">
                  <div className="rental-info-item">
                    <strong>Phòng:</strong> {rental.room}
                  </div>
                  <div className="rental-info-item">
                    <strong>Loại phòng:</strong>{" "}
                    {rental.room ? rental.room.charAt(0) : ""}
                  </div>
                  <div className="rental-info-item">
                    <strong>Tổng tiền:</strong> {formatPrice(rental.totalPrice)}
                  </div>
                </div>

                <div className="rental-info-row">
                  <div className="rental-info-item">
                    <strong>Ngày nhận:</strong>{" "}
                    {formatDateForUI(rental.checkInDate)}
                  </div>
                  <div className="rental-info-item">
                    <strong>Ngày trả:</strong>{" "}
                    {formatDateForUI(rental.checkOutDate)}
                  </div>
                </div>

                <div className="rental-info-row">
                  <div className="rental-info-item">
                    <strong>Trạng thái:</strong>{" "}
                    <span className={`status-${rental.status}`}>
                      {getStatusText(rental.status)}
                    </span>
                  </div>
                  <div className="rental-info-item">
                    <strong>Thanh toán:</strong>{" "}
                    <span className={`payment-${rental.paymentStatus}`}>
                      {getPaymentStatusText(rental.paymentStatus)}
                    </span>
                  </div>
                </div>

                <div className="rental-info-row">
                  <div className="rental-info-item">
                    <strong>Ngày tạo:</strong>{" "}
                    {formatDateForUI(rental.createdAt)}
                  </div>
                </div>
              </div>

              {rental.customers && rental.customers.length > 0 && (
                <div className="rental-customers">
                  <h4>Danh sách khách hàng</h4>
                  <table className="customer-table">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Họ tên</th>
                        <th>Loại khách</th>
                        <th>CMND/Passport</th>
                        <th>Địa chỉ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rental.customers.map((customer, index) => (
                        <tr key={customer.id || customer._id || index}>
                          <td>{index + 1}</td>
                          <td>{customer.name}</td>
                          <td>{customer.type}</td>
                          <td>{customer.idNumber}</td>
                          <td>{customer.address}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="button-container">
        <button className="action-button add clickable" onClick={handleAdd}>
          Thêm
        </button>
        <button
          className={`action-button edit ${
            selectedRentals.length === 1 ? "clickable" : "disabled"
          }`}
          onClick={handleEdit}
          disabled={selectedRentals.length !== 1}
        >
          Sửa
        </button>
        <button
          className={`action-button delete ${
            selectedRentals.length > 0 ? "clickable" : "disabled"
          }`}
          onClick={handleDelete}
          disabled={selectedRentals.length === 0}
        >
          Xóa
        </button>

        <button
          className="action-button refresh clickable"
          onClick={fetchRentals}
          disabled={loading}
        >
          Làm mới
        </button>
      </div>

      {showForm && (
        <RentalForm
          rental={editingRental}
          onClose={() => {
            setShowForm(false);
            setEditingRental(null);
          }}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

export default Feature2Main;
