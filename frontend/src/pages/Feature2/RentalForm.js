import React, { useState, useEffect } from "react";
import { useRentals } from "./RentalContext";
import { useRooms } from "../Feature1/RoomContext";
import { formatDateForUI } from "../../services/bookings";

const API_URL = "http://localhost:5000/api";
function RentalForm({ rental, onClose, onSuccess }) {
  const { addRental, updateRental } = useRentals();
  const { rooms, syncRoomStatusWithBookings } = useRooms();
  const [formData, setFormData] = useState(getInitialFormData());
  const [availableRooms, setAvailableRooms] = useState([]);
  //const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null); // Thêm state để xử lý lỗi
  const isEditMode = rental && !rental.isNew; // Biến để kiểm tra có phải đang edit không
  const [maxCustomers, setMaxCustomers] = useState(4);
  const [customerTypeMap, setCustomerTypeMap] = useState({});
  const [customerTypes, setCustomerTypes] = useState([]);
  //const [loading, setLoading] = useState(true);
  // Đầu tiên lấy mapping của loại khách
  useEffect(() => {
    fetch(`${API_URL}/mapper`)
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải dữ liệu mapper");
        return res.json();
      })
      .then((data) => {
        setCustomerTypeMap(data);
      })
      .catch((err) => setError(err.message));
  }, []);

  // Sau đó lấy policy sau khi có mapper
  useEffect(() => {
    if (Object.keys(customerTypeMap).length === 0) return;

    fetch(`${API_URL}/policy`)
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải dữ liệu quy định");
        return res.json();
      })
      .then((data) => {
        // Lưu maxCapacity từ API
        setMaxCustomers(data.maxCapacity || 4);

        // Lọc và xử lý các loại khách từ dữ liệu policy
        const types = Object.entries(data)
          .filter(
            ([key]) => key.endsWith("Policy") && key !== "surchargePolicy"
          )
          .map(([key, coefficient]) => ({
            id: key.replace("Policy", ""),
            type: customerTypeMap[key] || key,
            coefficient: coefficient,
          }));

        setCustomerTypes(types);
        console.log("Các loại khách từ API:", types);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu policy:", err);
        setError("Không thể lấy thông tin quy định. Vui lòng thử lại sau.");
      });
    //.finally(() => setLoading(false));
  }, [customerTypeMap]);
  // useEffect(() => {
  //   const fetchMaxCustomers = async () => {
  //     try {
  //       const response = await fetch("http://localhost:5000/api/policy/");
  //       const data = await response.json();
  //       setMaxCustomers(data.maxCapacity || 4); // Gán maxCustomers từ API
  //     } catch (error) {
  //       console.error("Error fetching maxCustomers:", error);
  //       setError(
  //         "Không thể lấy thông tin số lượng khách. Vui lòng thử lại sau."
  //       );
  //     }
  //   };

  //   fetchMaxCustomers();
  // }, []);
  function getInitialFormData() {
    // Nếu là edit với phòng được chọn từ Feature1
    if (rental && rental.isNew && rental.initialRoom) {
      return {
        room: rental.initialRoom.roomNumber || "",
        roomType: rental.initialRoom.type || "",
        email: "",
        checkInDate: formatDate(new Date()),
        checkOutDate: formatDate(new Date(Date.now() + 86400000)), // Default to next day
        totalPrice: 0,
        status: "confirmed",
        paymentStatus: "pending",
        customers: Array(1) // Bắt đầu với 1 khách
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

    // Nếu là edit một phiếu thuê đã tồn tại
    if (rental && !rental.isNew) {
      return {
        id: rental.id,
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
        // Sử dụng khách hàng hiện tại hoặc tạo mới nếu không có
        customers:
          rental.customers && rental.customers.length > 0
            ? [...rental.customers]
            : Array(1)
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
      customers: Array(1) // Bắt đầu với 1 khách
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

  // Đồng bộ trạng thái phòng khi component mount
  useEffect(() => {
    const initializeRooms = async () => {
      try {
        // Đồng bộ trạng thái phòng một lần
        await syncRoomStatusWithBookings();

        console.log("Filtering rooms. Total rooms:", rooms.length);
        let filteredRooms = [];

        if (rental && !rental.isNew && rental.room) {
          // Khi sửa phiếu thuê hiện có: hiển thị phòng hiện tại + phòng trống
          filteredRooms = rooms.filter(
            (room) =>
              room.status === "available" || room.roomNumber === rental.room
          );
        } else {
          // Khi tạo phiếu thuê mới: chỉ hiển thị phòng trống
          filteredRooms = rooms.filter((room) => room.status === "available");
        }

        console.log("Available rooms:", filteredRooms.length);
        setAvailableRooms(filteredRooms);
        //setIsLoaded(true);
      } catch (error) {
        console.error("Error initializing rooms:", error);
        setError("Không thể tải danh sách phòng. Vui lòng thử lại sau.");
        //setIsLoaded(true);
      }
    };

    initializeRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if (formData.customers.length <= 1) {
      setError("Phải có ít nhất một khách hàng.");
      return;
    }

    const newCustomers = formData.customers.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      customers: newCustomers,
    });
  };

  const handleAddCustomer = () => {
    // Kiểm tra quy định chung về số lượng khách tối đa
    if (formData.customers.length >= (maxCustomers || 4)) {
      setError(
        `Số lượng khách không được vượt quá ${
          maxCustomers || 4
        } người (quy định chung)`
      );
      return;
    }

    // Tìm thông tin phòng hiện tại
    const selectedRoom = availableRooms.find(
      (room) => room.roomNumber === formData.room
    );

    // Nếu đã chọn phòng và phòng có giới hạn capacity
    if (selectedRoom && selectedRoom.capacity) {
      // Kiểm tra nếu số khách hiện tại đã đạt giới hạn capacity của phòng
      if (formData.customers.length >= selectedRoom.capacity) {
        setError(
          `Không thể thêm khách. Phòng ${selectedRoom.roomNumber} chỉ có sức chứa tối đa ${selectedRoom.capacity} người.`
        );
        return;
      }
    }

    // Nếu thỏa mãn các điều kiện, thêm khách mới
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

    // Xóa thông báo lỗi nếu có
    setError(null);
  };

  // Thêm hàm reset customers
  const handleResetCustomers = () => {
    const newCustomers = Array(1) // Bắt đầu với 1 khách
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

    setError(null); // Xóa thông báo lỗi hiện tại nếu có
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Kiểm tra phòng đã được chọn chưa
    if (!formData.room) {
      setError("Vui lòng chọn phòng trước khi lưu");
      return;
    }

    // Kiểm tra số lượng khách
    const validCustomers = formData.customers.filter(
      (customer) => customer.name && customer.idNumber
    );

    if (validCustomers.length === 0) {
      setError("Vui lòng nhập thông tin ít nhất một khách hàng");
      return;
    }

    // Kiểm tra sức chứa phòng
    const selectedRoom = availableRooms.find(
      (room) => room.roomNumber === formData.room
    );
    if (
      selectedRoom &&
      selectedRoom.capacity &&
      validCustomers.length > selectedRoom.capacity
    ) {
      setError(
        `Số lượng khách (${validCustomers.length}) vượt quá sức chứa phòng ${selectedRoom.roomNumber} (${selectedRoom.capacity} người)`
      );
      return;
    }
    try {
      // Đảm bảo dữ liệu phù hợp với API
      const finalData = {
        ...formData,
        room: formData.room.trim(), // roomNumber string
        customers: validCustomers,
      };

      console.log("Dữ liệu gửi đi:", finalData);

      let result;
      if (isEditMode) {
        result = await updateRental(finalData.id, finalData);
      } else {
        result = await addRental(finalData);
      }

      if (result && result.success) {
        onSuccess(
          isEditMode
            ? "Cập nhật phiếu thuê thành công!"
            : "Thêm phiếu thuê mới thành công!"
        );
        onClose();
      } else {
        setError(
          result?.message || "Không thể lưu phiếu thuê. Vui lòng thử lại."
        );
      }
    } catch (error) {
      console.error("Error submitting rental:", error);
      setError(`Lỗi: ${error.message || "Không thể lưu phiếu thuê"}`);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>
          {isEditMode ? "Chỉnh sửa phiếu thuê phòng" : "Tạo phiếu thuê phòng"}
        </h3>

        {/* Hiển thị lỗi nếu có */}
        {error && <div className="error-message">{error}</div>}

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
                <>
                  {availableRooms.length === 0 ? (
                    <div className="no-rooms-message">Không có phòng trống</div>
                  ) : (
                    <select
                      value={formData.room}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          room: e.target.value,
                          roomType: e.target.value
                            ? e.target.value.charAt(0)
                            : "",
                        })
                      }
                      required
                    >
                      <option value="">Chọn phòng</option>
                      {availableRooms.map((room) => (
                        <option key={room.roomNumber} value={room.roomNumber}>
                          {room.roomNumber} - Loại {room.type}- Sức chứa:{" "}
                          {room.capacity || "?"} người
                        </option>
                      ))}
                    </select>
                  )}
                </>
              )}

              {/* Nếu đang edit một phiếu thuê đã tồn tại */}
              {/* {isEditMode && (
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
                      {room.roomNumber} - Loại {room.type} -{" "}
                      {room.status === "available" ? "Trống" : "Đã đặt"}
                    </option>
                  ))}
                </select>
              )} */}
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
              <h4>Danh sách khách hàng (Tối đa {maxCustomers || 4} khách)</h4>
              {isEditMode && (
                <button
                  type="button"
                  onClick={handleResetCustomers}
                  className="reset-button"
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
                        {customerTypes && customerTypes.length > 0 ? (
                          customerTypes.map((customerType) => (
                            <option
                              key={customerType.id}
                              value={customerType.id}
                            >
                              {customerType.type}
                            </option>
                          ))
                        ) : (
                          <>
                            {/* Fallback nếu không tải được dữ liệu */}
                            <option value="domestic">Nội địa</option>
                            <option value="foreign">Nước ngoài</option>
                          </>
                        )}
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
              disabled={formData.customers.length >= (maxCustomers || 4)}
            >
              Thêm khách hàng
            </button>
          </div>

          <div className="form-buttons">
            <button type="submit" className="save-button">
              {isEditMode ? "Cập nhật" : "Tạo phiếu thuê"}
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
