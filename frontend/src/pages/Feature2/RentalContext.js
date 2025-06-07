import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getBookings,
  createBooking,
  //updateBooking,
  deleteBooking,
  mapRentalToBooking,
  // formatDateForAPI,
  // convertCustomerTypeToAPI,
} from "../../services/bookings";

const RentalContext = createContext();

export function RentalProvider({ children }) {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch rentals when component mounts
  useEffect(() => {
    let lastFocusTime = 0;
    const focusInterval = 300000; // 5 phút = 300000ms

    const handleFocus = () => {
      const now = Date.now();
      // Chỉ gọi fetchRentals nếu đã qua khoảng thời gian tối thiểu
      if (now - lastFocusTime > focusInterval) {
        fetchRentals();
        lastFocusTime = now;
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Fetch all rentals from the API
  // Sửa hàm fetchRentals để hỗ trợ bộ lọc
  const fetchRentals = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await getBookings(filters);
      setRentals(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching rentals:", err);
      setError(err.message || "Có lỗi xảy ra khi tải danh sách phiếu thuê");
    } finally {
      setLoading(false);
    }
  };

  // Update an existing booking
  // const updateRental = async (id, rentalData) => {
  //   try {
  //     setLoading(true);

  //     // Kiểm tra roomNumber
  //     if (!rentalData.room) {
  //       console.error("Missing room in updateRental", rentalData);
  //       throw new Error("Thiếu thông tin phòng khi cập nhật");
  //     }

  //     console.log(
  //       "Sending data to API for update (ID: " + id + "):",
  //       rentalData
  //     );
  //     const result = await updateBooking(id, rentalData);

  //     if (result.success) {
  //       // Cập nhật phiếu thuê trong danh sách local
  //       setRentals((prevRentals) =>
  //         prevRentals.map((rental) =>
  //           rental.id === id ? { ...result.data, id } : rental
  //         )
  //       );
  //       console.log("Successfully updated rental with ID:", id);
  //       return result;
  //     } else {
  //       // Xử lý lỗi từ API
  //       console.error("API error during update:", result.message);
  //       setError(result.message || "Lỗi khi cập nhật phiếu thuê");
  //       return result;
  //     }
  //   } catch (error) {
  //     console.error("Error updating rental:", error);
  //     setError(error.message || "Lỗi khi cập nhật phiếu thuê");
  //     return { success: false, message: error.message };
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const addRental = async (rentalData) => {
    try {
      setLoading(true);
      setError(null);

      // Validate data before sending
      if (!rentalData.room) {
        console.error("Missing room in addRental", rentalData);
        throw new Error("Thiếu thông tin phòng khi tạo mới");
      }

      // Convert field names to match API format
      const apiData = mapRentalToBooking(rentalData);
      console.log("Sending data to API:", apiData);

      const response = await createBooking(apiData);
      console.log("API response:", response);

      if (response.success) {
        // Refresh the list after successful creation
        await fetchRentals();
        return {
          success: true,
          message: "Tạo phiếu thuê thành công",
        };
      } else {
        // Handle API error
        console.error("API error during creation:", response.message);
        setError(response.message || "Lỗi khi tạo phiếu thuê");
        return {
          success: false,
          message: response.message || "Không thể tạo phiếu thuê mới",
        };
      }
    } catch (error) {
      console.error("Error creating rental:", error);
      setError(error.message || "Lỗi khi tạo phiếu thuê");
      return {
        success: false,
        message: error.message || "Không thể tạo phiếu thuê mới",
      };
    } finally {
      setLoading(false);
    }
  };

  // Delete multiple bookings
  const deleteRentals = async (ids) => {
    try {
      setLoading(true);
      setError(null);

      // Delete each booking one by one
      const deletePromises = ids.map((id) => deleteBooking(id));
      const results = await Promise.all(deletePromises);

      // Check if all deletes were successful
      const allSuccess = results.every((result) => result.success);

      if (allSuccess) {
        await fetchRentals(); // Refresh the list
        return true;
      } else {
        const errorMessages = results
          .filter((result) => !result.success)
          .map((result) => result.message)
          .join(", ");
        setError(`Không thể xóa tất cả phiếu thuê: ${errorMessages}`);
        await fetchRentals(); // Refresh to sync with server state
        return false;
      }
    } catch (err) {
      console.error("Error deleting rentals:", err);
      setError(err.message || "Có lỗi xảy ra khi xóa phiếu thuê");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <RentalContext.Provider
      value={{
        rentals,
        loading,
        error,
        fetchRentals,
        addRental,
        //updateRental,
        deleteRentals,
      }}
    >
      {children}
    </RentalContext.Provider>
  );
}

export function useRentals() {
  return useContext(RentalContext);
}
