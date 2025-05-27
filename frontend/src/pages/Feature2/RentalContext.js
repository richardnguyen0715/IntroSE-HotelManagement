import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  mapRentalToBooking,
  formatDateForAPI,
  convertCustomerTypeToAPI,
} from "../../services/bookings";

const RentalContext = createContext();

export function RentalProvider({ children }) {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch rentals when component mounts
  useEffect(() => {
    fetchRentals();
  }, []);

  // Fetch all rentals from the API
  const fetchRentals = async () => {
    setLoading(true);
    try {
      const data = await getBookings();
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
  const updateRental = async (id, updatedData) => {
    try {
      setLoading(true);
      setError(null);

      // Convert field names to match API format
      const apiData = mapRentalToBooking(updatedData);

      console.log("Sending data to API for update (ID:", id, "):", apiData);
      const response = await updateBooking(id, apiData);
      console.log("API response:", response);

      if (response.success) {
        await fetchRentals(); // Refresh the list to get updated data
        return true;
      } else {
        setError(response.message || "Không thể cập nhật phiếu thuê");
        return false;
      }
    } catch (err) {
      console.error("Error updating rental:", err);
      setError(err.message || "Có lỗi xảy ra khi cập nhật phiếu thuê");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Add a new booking
  const addRental = async (rentalData) => {
    try {
      setLoading(true);
      setError(null);

      // Validate data before sending
      if (!rentalData.room) {
        setError("Thiếu thông tin phòng");
        setLoading(false);
        return false;
      }

      if (!rentalData.email) {
        setError("Thiếu thông tin email");
        setLoading(false);
        return false;
      }

      if (!rentalData.customers || rentalData.customers.length === 0) {
        setError("Vui lòng nhập thông tin ít nhất một khách hàng");
        setLoading(false);
        return false;
      }

      // Convert field names to match API format
      const apiData = mapRentalToBooking(rentalData);
      console.log("Sending data to API:", apiData);

      const response = await createBooking(apiData);
      console.log("API response:", response);

      if (response.success) {
        // Thêm độ trễ nhỏ để đảm bảo API đã lưu dữ liệu
        await new Promise((resolve) => setTimeout(resolve, 500));
        await fetchRentals(); // Refresh the list
        return true;
      } else {
        const errorMessage = response.message || "Không thể tạo phiếu thuê mới";
        setError(errorMessage);

        // Log additional debug info
        if (response.rawResponse) {
          console.error("Raw API response:", response.rawResponse);
        }
        return false;
      }
    } catch (err) {
      console.error("Error adding rental:", err);
      setError(err.message || "Có lỗi xảy ra khi tạo phiếu thuê");
      return false;
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
        updateRental,
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
