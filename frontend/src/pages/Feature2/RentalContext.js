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
        // Format data for frontend use
        const formattedData = response.data.map((booking) => ({
          id: booking._id,
          roomNumber: booking.room?.roomNumber || "",
          roomType: booking.roomType || booking.room?.type || "",
          startDate: booking.startDate,
          customers: booking.customers || [],
        }));

        setRentals(formattedData);
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

      const response = await createBooking(rentalData);

      if (response.success) {
        const newBooking = response.data;

        const newRental = {
          id: newBooking._id,
          roomNumber: newBooking.room?.roomNumber || rentalData.roomNumber,
          roomType:
            newBooking.roomType || newBooking.room?.type || rentalData.roomType,
          startDate: newBooking.startDate,
          customers: newBooking.customers,
        };

        setRentals([...rentals, newRental]);
        return true;
      } else {
        setError(response.message || "Không thể tạo phiếu thuê mới");
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

      const response = await updateBooking(id, updatedData);

      if (response.success) {
        const updatedBooking = response.data;

        const updatedRental = {
          id: updatedBooking._id,
          roomNumber: updatedBooking.room?.roomNumber || updatedData.roomNumber,
          roomType:
            updatedBooking.roomType ||
            updatedBooking.room?.type ||
            updatedData.roomType,
          startDate: updatedBooking.startDate,
          customers: updatedBooking.customers,
        };

        setRentals(
          rentals.map((rental) => (rental.id === id ? updatedRental : rental))
        );
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

      // Update local state after successful deletion
      setRentals(rentals.filter((rental) => !ids.includes(rental.id)));
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
