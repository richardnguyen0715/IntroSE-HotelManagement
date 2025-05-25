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
        roomNumber: rental.initialRoom.roomNumber || "",
        roomType: rental.initialRoom.type || "",
        startDate: formatDate(new Date()),
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
        roomNumber: rental.roomNumber,
        roomType: rental.roomType || "",
        startDate: rental.startDate,
        customers: rental.customers.map((c) => ({ ...c })),
      };
    }

    // Form tạo mới thông thường
    return {
      roomNumber: "",
      roomType: "",
      startDate: formatDate(new Date()),
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
      if (response.success) {
        // Filter only available rooms
        const availableRooms = response.data.filter(
          (room) => room.status === "available"
        );
        setAvailableRooms(availableRooms);
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

  // Thêm customers để đảm bảo có đủ số lượng tối đa cho maxCustomers
  useEffect(() => {
    if (rental && maxCustomers) {
      let currentCustomers = [];

      // Lấy danh sách khách hàng hiện tại
      if (rental.isNew) {
        currentCustomers = formData.customers;
      } else {
        currentCustomers = rental.customers.map((c) => ({ ...c }));
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

    const rentalData = {
      ...formData,
      customers: validCustomers,
    };

    let success = false;

    if (rental && !rental.isNew) {
      success = await updateRental(rental.id, rentalData);
      if (success && onSuccess)
        onSuccess("Cập nhật phiếu thuê phòng thành công!");
    } else {
      success = await addRental(rentalData);
      if (success && onSuccess) onSuccess("Đặt phòng thành công!");
    }

    if (success) {
      onClose();
    }
  };

  const handleRoomChange = (e) => {
    const selectedRoomNumber = e.target.value;

    // Nếu đang hiển thị dropdown phòng trống
    if (showAvailableRoomsDropdown) {
      const selectedRoom = availableRooms.find(
        (room) => room.roomNumber === selectedRoomNumber
      );
      if (selectedRoom) {
        setFormData({
          ...formData,
          roomNumber: selectedRoomNumber,
          roomType: selectedRoom.type || "",
        });
      } else {
        setFormData({
          ...formData,
          roomNumber: selectedRoomNumber,
        });
      }
    } else {
      setFormData({
        ...formData,
        roomNumber: selectedRoomNumber,
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
            <label>Phòng:</label>
            {showRoomDropdown ? (
              <select
                value={formData.roomNumber}
                onChange={(e) => {
                  // Tìm thông tin loại phòng từ danh sách phòng được chọn
                  const selectedRoom = rental.initialRooms.find(
                    (room) => room.roomNumber === e.target.value
                  );
                  setFormData({
                    ...formData,
                    roomNumber: e.target.value,
                    roomType: selectedRoom?.type || "",
                  });
                }}
                required
              >
                <option value="">-- Chọn phòng --</option>
                {rental.initialRooms.map((room) => (
                  <option key={room.roomNumber} value={room.roomNumber}>
                    {room.roomNumber} (Loại: {room.type})
                  </option>
                ))}
              </select>
            ) : showAvailableRoomsDropdown ? (
              <select
                value={formData.roomNumber}
                onChange={handleRoomChange}
                required
              >
                <option value="">-- Chọn phòng --</option>
                {availableRooms.map((room) => (
                  <option key={room._id} value={room.roomNumber}>
                    {room.roomNumber} (Loại: {room.type})
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={formData.roomNumber}
                onChange={handleRoomChange}
                disabled={rental?.isNew && rental?.initialRoom}
                required
              />
            )}
          </div>

          <div className="form-group">
            <label>Loại phòng:</label>
            <input
              type="text"
              value={formData.roomType}
              onChange={(e) =>
                setFormData({ ...formData, roomType: e.target.value })
              }
              disabled={rental?.isNew && rental?.initialRoom}
            />
          </div>

          <div className="form-group">
            <label>Ngày bắt đầu thuê:</label>
            <input
              type="text"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              placeholder="DD/MM/YYYY"
              required
            />
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
