import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getAllBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  formatDateForUI,
} from "../../services/bookings";

const RentalContext = createContext();

export function RentalProvider({ children }) {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all bookings when component mounts
  useEffect(() => {
    fetchRentals();
  }, []);

  // Fetch all bookings from API
  const fetchRentals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllBookings();
      if (response.success) {
        // Không cần format lại dữ liệu vì đã chuẩn hóa tên trường
        setRentals(
          response.data.map((booking) => ({
            id: booking._id,
            room: booking.room,
            email: booking.email,
            roomType: booking.roomType,
            checkInDate: booking.checkInDate,
            checkOutDate: booking.checkOutDate,
            totalPrice: booking.totalPrice,
            status: booking.status,
            paymentStatus: booking.paymentStatus,
            createdAt: booking.createdAt,
            customers: booking.customers || [],
          }))
        );
      } else {
        setError("Không thể lấy danh sách phiếu thuê phòng");
      }
    } catch (err) {
      console.error("Error fetching rentals:", err);
      setError("Không thể tải dữ liệu phiếu thuê phòng");
    } finally {
      setLoading(false);
    }
  };

  // Add a new booking
  const addRental = async (rentalData) => {
    try {
      setLoading(true);
      setError(null);

      // Đảm bảo roomType là chữ cái đầu nếu chưa có
      const roomType =
        rentalData.roomType ||
        (rentalData.room ? rentalData.room.charAt(0) : "");

      // Convert field names to match API if needed
      const apiData = {
        email: rentalData.email,
        room: rentalData.room,
        roomType: roomType,
        checkInDate: rentalData.checkInDate,
        checkOutDate: rentalData.checkOutDate,
        totalPrice: rentalData.totalPrice,
        status: rentalData.status || "confirmed",
        paymentStatus: rentalData.paymentStatus || "pending",
        customers: rentalData.customers || [],
      };

      console.log("Sending data to API:", apiData);

      try {
        const response = await createBooking(apiData);
        console.log("API response:", response);

        if (response.success) {
          await fetchRentals(); // Refresh the list to get updated data
          return true;
        } else {
          setError(response.message || "Không thể tạo phiếu thuê mới");
          return false;
        }
      } catch (apiError) {
        console.error("API Error:", apiError);
        setError("Lỗi kết nối API: " + (apiError.message || "Unknown error"));
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

  // Update an existing booking
  const updateRental = async (id, updatedData) => {
    try {
      setLoading(true);
      setError(null);

      // Convert field names to match API if needed
      const apiData = {
        email: updatedData.email,
        room: updatedData.room,
        roomType: updatedData.room ? updatedData.room.charAt(0) : "", // Lấy chữ cái đầu của mã phòng
        checkInDate: updatedData.checkInDate,
        checkOutDate: updatedData.checkOutDate,
        totalPrice: updatedData.totalPrice,
        status: updatedData.status,
        paymentStatus: updatedData.paymentStatus,
        customers: updatedData.customers,
      };

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

  // Delete bookings
  const deleteRentals = async (ids) => {
    try {
      setLoading(true);
      setError(null);

      // Delete each booking one by one
      for (const id of ids) {
        const response = await deleteBooking(id);
        if (!response.success) {
          throw new Error(`Không thể xóa phiếu thuê có ID: ${id}`);
        }
      }

      await fetchRentals(); // Refresh the list
      return true;
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
  const context = useContext(RentalContext);
  if (!context) {
    throw new Error("useRentals must be used within a RentalProvider");
  }
  return context;
}
