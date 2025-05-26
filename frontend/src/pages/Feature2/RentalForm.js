import React, { useState, useEffect } from "react";
import { useRentals } from "./RentalContext";
import { useRegulation } from "../Feature6/RegulationContext";
import { getRooms } from "../../services/rooms";
import { formatDateForUI } from "../../services/bookings";

function RentalForm({ rental, onClose, onSuccess }) {
  const { addRental, updateRental } = useRentals();
  const { maxCustomers } = useRegulation();
  const [availableRooms, setAvailableRooms] = useState([]);
  const [formData, setFormData] = useState(() => {
    // Nếu là form tạo mới từ Feature1 có sẵn thông tin phòng
    if (rental?.isNew && rental?.initialRoom) {
      return {
        room: rental.initialRoom.roomNumber || "",
        roomType: rental.initialRoom.type || "",
        email: "",
        checkInDate: formatDate(new Date()),
        checkOutDate: formatDate(new Date(Date.now() + 86400000)), // +1 ngày
        totalPrice: 0,
        status: "confirmed",
        paymentStatus: "pending",
        customers: [
          {
            id: Date.now(),
            name: "",
            type: "Nội địa",
            idNumber: "",
            address: "",
          },
        ],
      };
    }

    // Nếu là edit một phiếu thuê đã tồn tại
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
        customers: rental.customers?.map((c) => ({ ...c })) || [],
      };
    }

    // Form tạo mới thông thường
    return {
      room: "",
      roomType: "",
      email: "",
      checkInDate: formatDate(new Date()),
      checkOutDate: formatDate(new Date(Date.now() + 86400000)), // +1 ngày
      totalPrice: 0,
      status: "confirmed",
      paymentStatus: "pending",
      customers: [
        {
          id: Date.now(),
          name: "",
          type: "Nội địa",
          idNumber: "",
          address: "",
        },
      ],
    };
  });

  // Fetch available rooms when creating a new rental
  useEffect(() => {
    if (
      !rental?.initialRoom &&
      !rental?.initialRooms &&
      (!rental || rental.isNew)
    ) {
      fetchAvailableRooms();
    }
  }, [rental]);

  // Fetch available rooms from API
  const fetchAvailableRooms = async () => {
    try {
      const response = await getRooms();
      console.log("Available rooms response:", response); // Debug log

      if (response.success) {
        // Lọc các phòng trống và đảm bảo mỗi phòng có đúng cấu trúc dữ liệu
        const availableRooms = response.data
          .filter((room) => room.status === "available")
          .map((room) => ({
            ...room,
            roomNumber: room.roomNumber || room.room || "",
            type:
              room.type ||
              (room.roomNumber ? room.roomNumber.charAt(0) : "") ||
              (room.room ? room.room.charAt(0) : ""),
          }));

        console.log("Filtered available rooms:", availableRooms); // Debug log
        setAvailableRooms(availableRooms);
      } else {
        console.error("Error getting rooms:", response.message);
      }
    } catch (error) {
      console.error("Error fetching available rooms:", error);
    }
  };

  // Kiểm tra xem có hiển thị dropdown chọn phòng hay không
  const showRoomDropdown =
    rental?.isNew && rental?.initialRooms && rental.initialRooms.length > 1;

  // Hiển thị dropdown phòng trống khi tạo mới mà không có phòng được chọn sẵn
  const showAvailableRoomsDropdown =
    !rental?.initialRoom && !rental?.initialRooms && (!rental || rental.isNew);

  // Format date to DD/MM/YYYY
  function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Tính toán số ngày và cập nhật giá
  useEffect(() => {
    if (formData.checkInDate && formData.checkOutDate && formData.roomType) {
      // Tính số ngày thuê
      try {
        const checkIn = parseDateString(formData.checkInDate);
        const checkOut = parseDateString(formData.checkOutDate);
        const diffTime = Math.abs(checkOut - checkIn);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Giá theo loại phòng (đây là giả định, bạn cần thay đổi theo logic thực tế)
        let pricePerDay = 0;
        switch (formData.roomType.toUpperCase()) {
          case "A":
            pricePerDay = 150000;
            break;
          case "B":
            pricePerDay = 170000;
            break;
          case "C":
            pricePerDay = 200000;
            break;
          default:
            pricePerDay = 150000;
        }

        // Cập nhật tổng tiền
        if (diffDays > 0) {
          setFormData({
            ...formData,
            totalPrice: pricePerDay * diffDays,
          });
        }
      } catch (e) {
        console.error("Lỗi khi tính toán giá:", e);
      }
    }
  }, [formData.checkInDate, formData.checkOutDate, formData.roomType]);

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
  // Thêm customers để đảm bảo có đủ số lượng tối đa cho maxCustomers
  useEffect(() => {
    if (rental && maxCustomers) {
      let currentCustomers = [];

      // Lấy danh sách khách hàng hiện tại
      if (rental.isNew) {
        currentCustomers = formData.customers;
      } else {
        currentCustomers = rental.customers?.map((c) => ({ ...c })) || [];
      }

      // Thêm khách hàng trống nếu chưa đủ số lượng tối đa
      if (currentCustomers.length < maxCustomers) {
        const emptyCustomers = Array(maxCustomers - currentCustomers.length)
          .fill()
          .map((_, i) => ({
            id: Date.now() + i + 1,
            name: "",
            type: "Nội địa",
            idNumber: "",
            address: "",
          }));

        setFormData((prev) => ({
          ...prev,
          customers: [...currentCustomers, ...emptyCustomers],
        }));
      }
    }
  }, [rental, maxCustomers]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Filter out empty customer entries
      const validCustomers = formData.customers.filter(
        (c) => c.name && c.idNumber && c.address
      );

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

      // Gọi API tạo hoặc cập nhật
      let success = false;
      if (rental && !rental.isNew) {
        success = await updateRental(rental.id, rentalData);
        if (success) {
          if (onSuccess) onSuccess("Cập nhật phiếu thuê phòng thành công!");
          onClose(); // Đảm bảo form được đóng
        }
      } else {
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

  const handleRoomChange = (e) => {
    const selectedRoomNumber = e.target.value;

    console.log("Selected room:", selectedRoomNumber); // Debug log

    // Nếu đang hiển thị dropdown phòng trống
    if (showAvailableRoomsDropdown) {
      const selectedRoom = availableRooms.find(
        (room) => room.roomNumber === selectedRoomNumber
      );

      console.log("Found room:", selectedRoom); // Debug log

      if (selectedRoom) {
        setFormData({
          ...formData,
          room: selectedRoomNumber,
          roomType: selectedRoom.type || selectedRoomNumber.charAt(0) || "",
        });
      } else {
        setFormData({
          ...formData,
          room: selectedRoomNumber,
          roomType: selectedRoomNumber.charAt(0) || "",
        });
      }
    } else {
      setFormData({
        ...formData,
        room: selectedRoomNumber,
        roomType: selectedRoomNumber.charAt(0) || "",
      });
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

          <div className="form-group">
            <label>Phòng:</label>
            {showRoomDropdown ? (
              <select
                value={formData.room || ""}
                onChange={(e) => {
                  const selectedRoomNumber = e.target.value;
                  console.log(
                    "Selected room from dropdown 1:",
                    selectedRoomNumber
                  );
                  if (selectedRoomNumber) {
                    const roomType = selectedRoomNumber.charAt(0);
                    setFormData({
                      ...formData,
                      room: selectedRoomNumber,
                      roomType: roomType,
                    });
                  }
                }}
                required
              >
                <option value="">-- Chọn phòng --</option>
                {rental.initialRooms.map((room) => (
                  <option key={room.roomNumber} value={room.roomNumber}>
                    {room.roomNumber} (Loại:{" "}
                    {room.type || room.roomNumber.charAt(0)})
                  </option>
                ))}
              </select>
            ) : showAvailableRoomsDropdown ? (
              <select
                value={formData.room || ""}
                onChange={(e) => {
                  const selectedRoomNumber = e.target.value;
                  console.log(
                    "Selected room from dropdown 2:",
                    selectedRoomNumber
                  );
                  if (selectedRoomNumber) {
                    const roomType = selectedRoomNumber.charAt(0);
                    setFormData({
                      ...formData,
                      room: selectedRoomNumber,
                      roomType: roomType,
                    });
                  }
                }}
                required
              >
                <option value="">-- Chọn phòng --</option>
                {availableRooms.map((room) => (
                  <option
                    key={room._id || room.id || room.roomNumber}
                    value={room.roomNumber}
                  >
                    {room.roomNumber} (Loại:{" "}
                    {room.type || room.roomNumber.charAt(0)})
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={formData.room || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({
                    ...formData,
                    room: value,
                    roomType: value ? value.charAt(0) : "",
                  });
                }}
                disabled={rental?.isNew && rental?.initialRoom}
                required
              />
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ngày nhận phòng:</label>
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

            <div className="form-group">
              <label>Ngày trả phòng:</label>
              <input
                type="text"
                value={formData.checkOutDate}
                onChange={(e) =>
                  setFormData({ ...formData, checkOutDate: e.target.value })
                }
                placeholder="DD/MM/YYYY"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tổng tiền:</label>
              <input
                type="number"
                value={formData.totalPrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalPrice: parseInt(e.target.value) || 0,
                  })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Trạng thái đặt phòng:</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="confirmed">Đã xác nhận</option>
                <option value="pending">Đang chờ</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>

            <div className="form-group">
              <label>Trạng thái thanh toán:</label>
              <select
                value={formData.paymentStatus}
                onChange={(e) =>
                  setFormData({ ...formData, paymentStatus: e.target.value })
                }
              >
                <option value="pending">Chưa thanh toán</option>
                <option value="paid">Đã thanh toán</option>
              </select>
            </div>
          </div>

          <div className="customers-section">
            <h4>Danh sách khách hàng (Tối đa {maxCustomers} khách)</h4>
            {formData.customers.map((customer, index) => (
              <div key={customer.id} className="customer-form">
                <div className="form-group">
                  <label>Khách hàng {index + 1}:</label>
                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) =>
                      handleCustomerChange(index, "name", e.target.value)
                    }
                    placeholder="Tên khách hàng"
                  />
                </div>
                <div className="form-group">
                  <label>Loại khách:</label>
                  <select
                    value={customer.type}
                    onChange={(e) =>
                      handleCustomerChange(index, "type", e.target.value)
                    }
                  >
                    <option value="Nội địa">Nội địa</option>
                    <option value="Nước ngoài">Nước ngoài</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>CMND:</label>
                  <input
                    type="text"
                    value={customer.idNumber}
                    onChange={(e) =>
                      handleCustomerChange(index, "idNumber", e.target.value)
                    }
                    placeholder="Số CMND"
                  />
                </div>
                <div className="form-group">
                  <label>Địa chỉ:</label>
                  <input
                    type="text"
                    value={customer.address}
                    onChange={(e) =>
                      handleCustomerChange(index, "address", e.target.value)
                    }
                    placeholder="Địa chỉ"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="confirm-button">
              {rental && !rental.isNew ? "Cập nhật" : "Xác nhận đặt phòng"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RentalForm;
