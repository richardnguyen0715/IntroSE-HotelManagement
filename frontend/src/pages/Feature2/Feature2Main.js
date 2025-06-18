import React, { useState, useEffect } from "react";
import { useRooms } from "../Feature1/RoomContext";
import { useRentals } from "./RentalContext";
import { useLocation, useNavigate } from "react-router-dom";
import RentalForm from "./RentalForm";
import { formatDateForUI } from "../../services/bookings";
import "./Feature2.css";

function Feature2Main() {
  const navigate = useNavigate();
  const { rentals, fetchRentals, deleteRentals, loading } = useRentals();
  const [selectedRentals, setSelectedRentals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRental, setEditingRental] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { fetchRooms, rooms, syncRoomStatusWithBookings } = useRooms();
  const location = useLocation();

  // Lấy danh sách phòng rồi truyền qua feature4
  const handleCreateInvoice = () => {
    // Lấy mảng số phòng từ selectedRentals
    const selectedRooms = selectedRentals
      .map((id) => {
        const rental = rentals.find((r) => r.id === id);
        return rental ? rental.room : null;
      })
      .filter(Boolean); // loại bỏ null

    // Chuyển sang trang Feature4 với dữ liệu phòng
    navigate("/feature4", {
      state: {
        selectedRooms,
      },
    });
  };

  // Thêm trường checkInDate vào filters
  const [filters, setFilters] = useState({
    room: "",
    checkInDate: "",
    status: "",
  });
  const [filteredRentals, setFilteredRentals] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());

  // Refresh rentals when component mounts (chỉ chạy một lần)
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchRentals();
      await fetchAllRooms();
    };

    loadInitialData();

    // Thiết lập một interval để cập nhật theo lịch trình
    const intervalId = setInterval(() => {
      const now = Date.now();
      if (now - lastFetchTime > 300000) {
        // 5 phút = 300000ms
        console.log("Scheduled refresh - updating rentals...");
        fetchRentals();
        setLastFetchTime(now);
      }
    }, 300000); // Kiểm tra mỗi 5 phút

    // Cleanup khi component unmount
    return () => {
      clearInterval(intervalId);
      console.log("Feature2Main unmounted, interval cleared");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Mảng dependencies rỗng - chỉ chạy một lần khi mount

  // Fetch tất cả phòng để hiển thị trong dropdown
  const fetchAllRooms = async () => {
    try {
      // Hạn chế gọi API fetchRooms - chỉ gọi khi cần thiết
      if (rooms.length === 0) {
        await fetchRooms();
      }

      // Tạo danh sách các phòng từ cả hai nguồn mà không gây re-render liên tục
      const roomsFromRentals = rentals
        .map((rental) => rental.room)
        .filter(Boolean);

      const roomsFromRooms = rooms
        .map((room) => room.roomNumber)
        .filter(Boolean);

      // Kết hợp hai danh sách và loại bỏ trùng lặp
      const uniqueRoomNumbers = Array.from(
        new Set([...roomsFromRentals, ...roomsFromRooms])
      ).sort();

      console.log("Combined room list:", uniqueRoomNumbers.length);
      setAllRooms(uniqueRoomNumbers);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phòng:", error);
    }
  };

  // Cập nhật filteredRentals khi trạng thái lọc thay đổi
  useEffect(() => {
    if (!isFiltering) {
      setFilteredRentals(rentals);
      return;
    }

    filterRentals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, isFiltering, rentals]);

  // Cập nhật allRooms khi rentals thay đổi - với debounce để tránh quá nhiều request
  useEffect(() => {
    const updateRoomsDebounced = setTimeout(() => {
      if (rentals && rentals.length > 0) {
        // Chỉ cập nhật allRooms nếu danh sách phòng thay đổi
        const roomsFromRentals = rentals
          .map((rental) => rental.room)
          .filter(Boolean);

        const roomsFromRooms = rooms
          .map((room) => room.roomNumber)
          .filter(Boolean);

        const uniqueRoomNumbers = Array.from(
          new Set([...roomsFromRentals, ...roomsFromRooms])
        ).sort();

        setAllRooms(uniqueRoomNumbers);
      }
    }, 1000); // Debounce 1 giây

    return () => clearTimeout(updateRoomsDebounced);
  }, [rentals, rooms]);

  // Hàm xử lý thay đổi bộ lọc
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Hàm xử lý lọc phiếu thuê (cải thiện)
  const filterRentals = () => {
    const { room, checkInDate, status } = filters;

    let result = [...rentals];
    console.log("Filtering rentals:", rentals.length);

    // Lọc theo phòng
    if (room) {
      result = result.filter((rental) => rental.room === room);
    }
    // Lọc theo trạng thái
    if (status) {
      result = result.filter((rental) => rental.status === status);
    }
    if (checkInDate) {
      // Lọc theo ngày nhận phòng
      const filterDate = new Date(checkInDate);
      filterDate.setHours(0, 0, 0, 0);

      result = result.filter((rental) => {
        if (!rental.checkInDate) return false;

        let rentalDate;

        // Nếu là dạng DD/MM/YYYY (chứa dấu "/")
        if (rental.checkInDate.includes("/")) {
          const parts = rental.checkInDate.split("/").map(Number);
          if (parts[0] > 12) {
            // Chắc chắn là DD/MM/YYYY
            const [day, month, year] = parts;
            rentalDate = new Date(year, month - 1, day);
          } else {
            // Có thể là MM/DD/YYYY
            const [month, day, year] = parts;
            rentalDate = new Date(year, month - 1, day);
          }
        } else {
          // ISO string hoặc timestamp
          rentalDate = new Date(rental.checkInDate);
        }

        rentalDate.setHours(0, 0, 0, 0);
        return rentalDate.getTime() === filterDate.getTime();
      });
    }

    setFilteredRentals(result);
  };

  const applyFilters = () => {
    setIsFiltering(true);
    setSelectedRentals([]); // Xóa các checkbox đã chọn

    // Chuẩn bị API filters
    const apiFilters = {};

    // Chuyển đổi filters UI sang API filters
    if (filters.room) {
      apiFilters.roomNumber = filters.room;
    }

    if (filters.checkInDate) {
      // Chuyển đổi từ định dạng input date (YYYY-MM-DD) sang định dạng API
      apiFilters.startDate = filters.checkInDate;
    }
    if (filters.status) {
      apiFilters.status = filters.status;
    }
    // Gọi API với bộ lọc
    fetchRentals(apiFilters);
  };

  // Cập nhật hàm resetFilters
  const resetFilters = () => {
    setFilters({
      room: "",
      checkInDate: "",
      status: "",
    });
    setIsFiltering(false);
    setSelectedRentals([]); // Xóa các checkbox đã chọn
    fetchRentals(); // Gọi API không có filter
  };

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

  // Hiển thị thông báo thành công trong 3 giây
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

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
    // Refresh room status before showing form - với promise để đảm bảo hoàn tất
    syncRoomStatusWithBookings().then(() => {
      setEditingRental({ isNew: true });
      setShowForm(true);
    });
  };

  // const handleEdit = () => {
  //   if (selectedRentals.length !== 1) return;

  //   const rentalToEdit = rentals.find(
  //     (rental) => rental.id === selectedRentals[0]
  //   );

  //   if (rentalToEdit) {
  //     setEditingRental({
  //       ...rentalToEdit,
  //       isNew: false,
  //     });
  //     setShowForm(true);
  //   }
  // };

  const handleDelete = async () => {
    if (selectedRentals.length === 0) return;

    if (window.confirm("Bạn có chắc chắn muốn xóa các phiếu thuê đã chọn?")) {
      const success = await deleteRentals(selectedRentals);
      setSelectedRentals([]); // Xóa các checkbox đã chọn
      if (success) {
        setSuccessMessage("Xóa phiếu thuê thành công!");
        // Thêm độ trễ để tránh gọi API liên tiếp
        setTimeout(() => {
          fetchAllRooms();
        }, 1000);
      } else {
        setErrorMessage("Có lỗi xảy ra khi xóa phiếu thuê!");
      }
    }
  };

  const handleSuccess = (message) => {
    setSuccessMessage(message);
    // Tạo độ trễ lớn hơn để tránh nhiều lệnh gọi API liên tiếp
    setTimeout(() => {
      fetchRentals();
      setTimeout(() => {
        fetchAllRooms();
      }, 1000);
    }, 1000);
  };

  // Sử dụng filteredRentals nếu đang lọc, ngược lại sử dụng rentals
  const displayRentals = isFiltering ? filteredRentals : rentals;

  return (
    <div className="feature-content">
      <h3>Danh sách các phiếu thuê phòng</h3>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="error-message-feature2">{errorMessage}</div>
      )}

      {/* Phần bộ lọc */}
      <div className="filter-section">
        <h4>Lọc phiếu thuê</h4>
        <div className="filter-controls">
          <div className="filter-group">
            <label id="label-1">Phòng</label>
            <select
              name="room"
              value={filters.room}
              onChange={handleFilterChange}
            >
              <option value="">Tất cả phòng</option>
              {allRooms.map((room) => (
                <option key={room} value={room}>
                  {room}
                </option>
              ))}
            </select>
          </div>

          {/* Thêm trường ngày nhận phòng */}
          <div className="filter-group">
            <label id="label-2">Ngày nhận phòng</label>
            <input
              type="date"
              name="checkInDate"
              value={filters.checkInDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-group">
            <label>Trạng thái</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">Tất cả</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Đã xác nhận</option>
              <option value="inPayment">Chờ thanh toán</option>
            </select>
          </div>
          <div className="filter-buttons">
            <button className="filter-button apply" onClick={applyFilters}>
              Lọc
            </button>
            <button className="filter-button reset" onClick={resetFilters}>
              Xóa bộ lọc
            </button>
          </div>
        </div>

        {isFiltering && (
          <div className="filter-status">
            <p>
              Đang hiển thị {filteredRentals.length} kết quả
              {filters.room && ` cho phòng ${filters.room}`}
              {/* {filters.email && ` với email chứa "${filters.email}"`} */}
              {filters.checkInDate &&
                ` nhận phòng vào ngày ${filters.checkInDate}`}{" "}
              (năm/tháng/ngày)
            </p>
          </div>
        )}
      </div>

      {loading && <div className="loading-message">Đang tải dữ liệu...</div>}

      <div className="table-section">
        {!loading && displayRentals.length === 0 ? (
          <p className="empty-message">
            Không tìm thấy phiếu thuê phòng phù hợp.
          </p>
        ) : (
          displayRentals.map((rental) => (
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
              </div>

              <div className="rental-details">
                <div className="rental-info-row rental-info-row-first">
                  <div className="rental-info-item">
                    <strong>Phòng:</strong> {rental.room}
                  </div>
                  <div className="rental-info-item rental-info-item-after">
                    <strong>Ngày bắt đầu thuê:</strong>{" "}
                    {formatDateForUI(rental.checkInDate)}
                  </div>
                </div>

                <div className="rental-info-row">
                  <div className="rental-info-item">
                    <strong>Trạng thái: </strong>
                    {rental.status}
                  </div>

                  <div className="rental-info-item rental-info-item-after">
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
                        <th>Khách Hàng</th>
                        <th>Loại Khách</th>
                        <th>CMND</th>
                        <th>Địa Chỉ</th>
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
        {/* <button
          className={`action-button edit ${
            selectedRentals.length === 1 ? "clickable" : "disabled"
          }`}
          onClick={selectedRentals.length === 1 ? handleEdit : undefined}
          style={{
            cursor: selectedRentals.length === 1 ? "pointer" : "not-allowed",
          }}
          disabled={selectedRentals.length !== 1}
        >
          Sửa
        </button> */}
        <button
          className={`action-button delete ${
            selectedRentals.length > 0 ? "clickable" : "disabled"
          }`}
          onClick={selectedRentals.length > 0 ? handleDelete : undefined}
          style={{
            cursor: selectedRentals.length > 0 ? "pointer" : "not-allowed",
          }}
          disabled={selectedRentals.length === 0}
        >
          Xóa
        </button>

        <button
          className="action-button refresh clickable"
          onClick={() => {
            const now = Date.now();
            // Chỉ refresh nếu đã qua 3 giây kể từ lần cuối
            if (now - lastFetchTime > 3000) {
              fetchRentals();
              setLastFetchTime(now);
            } else {
              console.log("Refresh throttled - please wait");
            }
          }}
          disabled={loading}
        >
          Làm mới
        </button>

        <button
          className="action-button add clickable"
          id="invoice-button"
          onClick={handleCreateInvoice}
        >
          Lập Hóa đơn
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
