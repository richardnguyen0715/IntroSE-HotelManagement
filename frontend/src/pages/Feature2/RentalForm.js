import React, { useState, useEffect } from "react";
import { useRentals } from "./RentalContext";
import { useRooms } from "../Feature1/RoomContext";
import { useRegulation } from "../Feature6/RegulationContext";
import { formatDateForUI } from "../../services/bookings";

function RentalForm({ rental, onClose, onSuccess }) {
  const { addRental, updateRental } = useRentals();
  const { rooms } = useRooms();
  const { maxCustomers } = useRegulation();
  const [formData, setFormData] = useState(getInitialFormData());

  function getInitialFormData() {
    // Nếu là edit với phòng được chọn từ Feature1
    if (rental && rental.isNew && rental.initialRoom) {
      return {
        room: rental.initialRoom.roomNumber || "",
        roomType: rental.initialRoom.type || "",
        email: "",
        checkInDate: formatDate(new Date()),
        checkOutDate: "",
        totalPrice: 0,
        status: "confirmed",
        paymentStatus: "pending",
        customers: Array(maxCustomers || 3)
          .fill()
          .map((_, index) => ({
            id: Date.now() + index,
            name: "",
            type: "Nội địa",
            idNumber: "",
            address: "",
          })),
      };
    }

    // Nếu là edit một phiếu thuê đã tồn tại - RESET CUSTOMERS
    if (rental && !rental.isNew) {
      return {
        room: rental.room || "",
        roomType: rental.roomType || "",
        email: rental.email || "",
        checkInDate: rental.checkInDate
          ? formatDateForUI(rental.checkInDate)
          : "",
        checkOutDate: rental.checkOutDate
          ? formatDateForUI(rental.checkOutDate)
          : "",
        totalPrice: rental.totalPrice || 0,
        status: rental.status || "confirmed",
        paymentStatus: rental.paymentStatus || "pending",
        // QUAN TRỌNG: Tạo customers mới hoàn toàn, xóa customers cũ
        customers: Array(maxCustomers || 3)
          .fill()
          .map((_, index) => ({
            id: Date.now() + index,
            name: "",
            type: "Nội địa",
            idNumber: "",
            address: "",
          })),
      };
    }

    // Form tạo mới thông thường
    return {
      room: "",
      roomType: "",
      email: "",
      checkInDate: formatDate(new Date()),
      checkOutDate: formatDate(new Date(Date.now() + 86400000)), // Default to next day
      totalPrice: 0,
      status: "confirmed",
      paymentStatus: "pending",
      customers: Array(maxCustomers || 3)
        .fill()
        .map((_, index) => ({
          id: Date.now() + index,
          name: "",
          type: "Nội địa",
          idNumber: "",
          address: "",
        })),
    };
  }

  // Lấy danh sách phòng trống hoặc phòng đang được chỉnh sửa
  const [availableRooms, setAvailableRooms] = useState([]);

  useEffect(() => {
    // Lọc phòng trống (status === 'available')
    let roomList = [];

    // Nếu đang chỉnh sửa, cho phép chọn phòng hiện tại
    if (rental && !rental.isNew && rental.room) {
      roomList = rooms.filter(
        (room) => room.status === "available" || room.roomNumber === rental.room
      );
    } else {
      roomList = rooms.filter((room) => room.status === "available");
    }

    setAvailableRooms(roomList);
  }, [rooms, rental]);

  // Flag để biết nếu rental được tạo với nhiều phòng từ Feature1
  const hasMultipleRoomsOption =
    rental?.isNew && rental?.initialRooms && rental.initialRooms.length > 1;

  // Hiển thị dropdown phòng trống khi tạo mới mà không có phòng được chọn sẵn
  const showAvailableRoomsDropdown =
    !rental?.initialRoom && !rental?.initialRooms && (!rental || rental.isNew);

  // Format date to DD/MM/YYYY
  function formatDate(date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Parse date string DD/MM/YYYY to Date object
  function parseDateString(dateString) {
    const [day, month, year] = dateString.split("/");
    return new Date(year, month - 1, day);
  }

  useEffect(() => {
    if (formData.room && !formData.roomType) {
      setFormData({
        ...formData,
        roomType: formData.room.charAt(0),
      });
    }
  }, [formData.room]);

  // XÓA useEffect gây duplicate customers
  // useEffect cũ đã được xóa để tránh tích lũy customers

  const handleCustomerChange = (index, field, value) => {
    const newCustomers = [...formData.customers];
    newCustomers[index] = {
      ...newCustomers[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      customers: newCustomers,
    });
  };

  const handleRemoveCustomer = (index) => {
    const newCustomers = formData.customers.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      customers: newCustomers,
    });
  };

  const handleAddCustomer = () => {
    if (formData.customers.length >= maxCustomers) {
      alert(`Số lượng khách không được vượt quá ${maxCustomers} người`);
      return;
    }

    const newCustomers = [
      ...formData.customers,
      {
        id: Date.now(),
        name: "",
        type: "Nội địa",
        idNumber: "",
        address: "",
      },
    ];
    setFormData({
      ...formData,
      customers: newCustomers,
    });
  };

  // Thêm hàm reset customers
  const handleResetCustomers = () => {
    const newCustomers = Array(maxCustomers || 3)
      .fill()
      .map((_, index) => ({
        id: Date.now() + index,
        name: "",
        type: "Nội địa",
        idNumber: "",
        address: "",
      }));

    setFormData({
      ...formData,
      customers: newCustomers,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Debug log trước khi gửi
      console.log("=== DEBUG BEFORE SUBMIT ===");
      console.log("formData.customers:", formData.customers);
      console.log("formData.customers.length:", formData.customers.length);

      // Filter out empty customer entries
      const validCustomers = formData.customers.filter(
        (c) => c.name && c.idNumber && c.address
      );

      console.log("validCustomers:", validCustomers);
      console.log("validCustomers.length:", validCustomers.length);

      if (validCustomers.length === 0) {
        alert("Vui lòng nhập thông tin ít nhất một khách hàng");
        return;
      }

      if (validCustomers.length > maxCustomers) {
        alert(`Số lượng khách không được vượt quá ${maxCustomers} người`);
        return;
      }

      // Email validation
      if (!formData.email || !formData.email.includes("@")) {
        alert("Vui lòng nhập email hợp lệ");
        return;
      }

      // Chuẩn bị dữ liệu gửi lên API
      const rentalData = {
        ...formData,
        customers: validCustomers,
      };

      console.log("Final rentalData being sent:", rentalData);

      // Gọi API tạo hoặc cập nhật
      let success = false;
      if (rental && !rental.isNew) {
        console.log("Updating rental with ID:", rental.id);
        success = await updateRental(rental.id, rentalData);
        if (success) {
          if (onSuccess) onSuccess("Cập nhật phiếu thuê phòng thành công!");
          onClose(); // Đảm bảo form được đóng
        }
      } else {
        console.log("Creating new rental");
        success = await addRental(rentalData);
        if (success) {
          if (onSuccess) onSuccess("Đặt phòng thành công!");
          onClose(); // Đảm bảo form được đóng
        }
      }
    } catch (error) {
      console.error("Lỗi khi xử lý form:", error);
      alert("Có lỗi xảy ra: " + error.message);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>
          {rental && !rental.isNew
            ? "Chỉnh sửa phiếu thuê phòng"
            : "Tạo phiếu thuê phòng"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email liên hệ:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="email@example.com"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phòng:</label>
              {/* Nếu đã có 1 phòng được chọn từ Feature1 */}
              {rental?.initialRoom && (
                <input
                  type="text"
                  value={rental.initialRoom.roomNumber}
                  readOnly
                  className="readonly-input"
                />
              )}

              {/* Nếu có nhiều phòng được chọn từ Feature1 */}
              {hasMultipleRoomsOption && (
                <select
                  value={formData.room}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      room: e.target.value,
                      roomType: e.target.value.charAt(0),
                    })
                  }
                  required
                >
                  <option value="">Chọn phòng</option>
                  {rental.initialRooms.map((room) => (
                    <option key={room.roomNumber} value={room.roomNumber}>
                      {room.roomNumber} - Loại {room.type}
                    </option>
                  ))}
                </select>
              )}

              {/* Nếu tạo mới không có phòng được chọn sẵn */}
              {showAvailableRoomsDropdown && (
                <select
                  value={formData.room}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      room: e.target.value,
                      roomType: e.target.value ? e.target.value.charAt(0) : "",
                    })
                  }
                  required
                >
                  <option value="">Chọn phòng</option>
                  {availableRooms.map((room) => (
                    <option key={room.roomNumber} value={room.roomNumber}>
                      {room.roomNumber} - Loại {room.type}
                    </option>
                  ))}
                </select>
              )}

              {/* Nếu đang edit một phiếu thuê đã tồn tại */}
              {rental && !rental.isNew && (
                <select
                  value={formData.room}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      room: e.target.value,
                      roomType: e.target.value.charAt(0),
                    })
                  }
                  required
                >
                  <option value="">Chọn phòng</option>
                  {availableRooms.map((room) => (
                    <option key={room.roomNumber} value={room.roomNumber}>
                      {room.roomNumber} - Loại {room.type}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="form-group">
              <label>Ngày bắt đầu thuê:</label>
              <input
                type="text"
                value={formData.checkInDate}
                onChange={(e) =>
                  setFormData({ ...formData, checkInDate: e.target.value })
                }
                placeholder="DD/MM/YYYY"
                required
              />
            </div>
          </div>

          <div className="customers-section">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h4>Danh sách khách hàng (Tối đa {maxCustomers} khách)</h4>
              {rental && !rental.isNew && (
                <button
                  type="button"
                  onClick={handleResetCustomers}
                  className="reset-button"
                  style={{
                    marginLeft: "10px",
                    padding: "5px 10px",
                    fontSize: "12px",
                    backgroundColor: "#f0f0f0",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Reset Customers
                </button>
              )}
            </div>
            <table className="customer-form-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Khách Hàng</th>
                  <th>Loại Khách</th>
                  <th>CMND</th>
                  <th>Địa Chỉ</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {formData.customers.map((customer, index) => (
                  <tr key={customer.id} className="customer-form-row">
                    <td>{index + 1}</td>
                    <td>
                      <input
                        type="text"
                        value={customer.name}
                        onChange={(e) =>
                          handleCustomerChange(index, "name", e.target.value)
                        }
                        placeholder="Tên khách hàng"
                      />
                    </td>
                    <td>
                      <select
                        value={customer.type}
                        onChange={(e) =>
                          handleCustomerChange(index, "type", e.target.value)
                        }
                      >
                        <option value="Nội địa">Nội địa</option>
                        <option value="Nước ngoài">Nước ngoài</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={customer.idNumber}
                        onChange={(e) =>
                          handleCustomerChange(
                            index,
                            "idNumber",
                            e.target.value
                          )
                        }
                        placeholder="Số CMND"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={customer.address}
                        onChange={(e) =>
                          handleCustomerChange(index, "address", e.target.value)
                        }
                        placeholder="Địa chỉ"
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomer(index)}
                        className="remove-button"
                      >
                        X
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              type="button"
              onClick={handleAddCustomer}
              className="add-customer-button"
              disabled={formData.customers.length >= maxCustomers}
            >
              Thêm khách hàng
            </button>
          </div>

          <div className="form-buttons">
            <button type="submit" className="save-button">
              {rental && !rental.isNew ? "Cập nhật" : "Tạo phiếu thuê"}
            </button>
            <button type="button" onClick={onClose} className="cancel-button">
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RentalForm;
