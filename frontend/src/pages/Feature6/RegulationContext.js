import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getHotelPolicy,
  partialUpdateHotelPolicy,
} from "../../services/hotelPolicies";

const RegulationContext = createContext();

export function RegulationProvider({ children }) {
  // States lưu trữ dữ liệu quy định
  const [roomTypes, setRoomTypes] = useState([
    { id: 1, type: "A", price: 150000, quantity: 5 },
    { id: 2, type: "B", price: 170000, quantity: 5 },
    { id: 3, type: "C", price: 200000, quantity: 5 },
  ]);

  const [customerTypes, setCustomerTypes] = useState([
    { id: 1, type: "Nội địa", coefficient: 1 },
    { id: 2, type: "Nước ngoài", coefficient: 1.5 },
  ]);

  const [maxCustomers, setMaxCustomers] = useState(5);
  const [surchargeRate, setSurchargeRate] = useState(0.25);
  const [surcharges, setSurcharges] = useState({
    extraGuestSurcharge: 25,
    foreignGuestSurcharge: 50,
  });

  // States cho trạng thái loading và lỗi
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [policyId, setPolicyId] = useState(null);

  // Lấy dữ liệu quy định khi component được mount
  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        setLoading(true);
        const response = await getHotelPolicy();
        const policyData = response.data || response;

        console.log("Fetched policy data:", policyData);

        if (policyData) {
          // Lưu policy ID để sử dụng khi cập nhật
          setPolicyId(policyData._id);

          // Cập nhật state với dữ liệu từ backend
          setMaxCustomers(policyData.maxCapacity || 5);
          setSurchargeRate(policyData.surchargePolicy);

          // Cập nhật loại khách hàng
          setCustomerTypes([
            { id: 1, type: "Nội địa", coefficient: policyData.domesticPolicy },
            {
              id: 2,
              type: "Nước ngoài",
              coefficient: policyData.foreignPolicy,
            },
          ]);

          // Cập nhật phụ thu
          setSurcharges({
            extraGuestSurcharge: policyData.surchargePolicy * 100, // Chuyển sang phần trăm
            foreignGuestSurcharge: (policyData.foreignPolicy - 1) * 100, // Chuyển sang phần trăm tăng
          });
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching policy:", err);
        setError("Không thể tải quy định từ máy chủ");
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
  }, []);

  // Các functions cập nhật dữ liệu và đồng bộ với backend
  const updateRoomTypes = (newRoomTypes) => {
    setRoomTypes(newRoomTypes);
    // Loại phòng không phải là một phần của policy model trong backend
  };

  const updateMaxCustomers = async (newMaxCustomers) => {
    try {
      setMaxCustomers(newMaxCustomers);

      if (policyId) {
        await partialUpdateHotelPolicy(policyId, {
          maxUser: newMaxCustomers,
          // Không cần các trường khác, hàm partialUpdateHotelPolicy đã xử lý
        });
        console.log("Đã cập nhật số khách tối đa thành công");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật số khách tối đa:", error);
      throw error;
    }
  };

  const updateCustomerTypes = async (newCustomerTypes) => {
    try {
      setCustomerTypes(newCustomerTypes);

      // Tìm hệ số cho khách nội địa và nước ngoài
      const domesticType = newCustomerTypes.find((ct) => ct.type === "Nội địa");
      const foreignType = newCustomerTypes.find(
        (ct) => ct.type === "Nước ngoài"
      );

      if (domesticType && foreignType && policyId) {
        await partialUpdateHotelPolicy(policyId, {
          domesticPolicy: domesticType.coefficient,
          foreignPolicy: foreignType.coefficient,
          // Không cần các trường khác, hàm partialUpdateHotelPolicy đã xử lý
        });
        console.log("Đã cập nhật hệ số loại khách thành công");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật hệ số loại khách:", error);
      throw error;
    }
  };

  const updateSurchargeRate = async (newRate) => {
    try {
      setSurchargeRate(newRate);

      if (policyId) {
        await partialUpdateHotelPolicy(policyId, {
          surchargePolicy: newRate,
          // Không cần các trường khác, hàm partialUpdateHotelPolicy đã xử lý
        });
        console.log("Đã cập nhật tỷ lệ phụ thu thành công");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật tỷ lệ phụ thu:", error);
      throw error;
    }
  };

  const updateSurcharge = async (newSurcharge) => {
    try {
      setSurcharges(newSurcharge);

      // Đảm bảo surcharge là số thập phân nhỏ hơn 1
      // Nếu đầu vào là 30 (tức 30%), đầu ra sẽ là 0.3
      const surchargeDecimal = newSurcharge.extraGuestSurcharge / 100;

      if (policyId) {
        console.log("Đang gửi dữ liệu đến API:", {
          surchargePolicy: surchargeDecimal,
        });

        await partialUpdateHotelPolicy(policyId, {
          surchargePolicy: surchargeDecimal,
        });
        console.log("Đã cập nhật quy định phụ thu thành công");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật quy định phụ thu:", error);
      throw error; // Re-throw để component có thể xử lý
    }
  };

  return (
    <RegulationContext.Provider
      value={{
        roomTypes,
        customerTypes,
        maxCustomers,
        surchargeRate,
        surcharges,
        updateSurcharge,
        updateRoomTypes,
        updateCustomerTypes,
        updateMaxCustomers,
        updateSurchargeRate,
        loading,
        error,
      }}
    >
      {children}
    </RegulationContext.Provider>
  );
}

export function useRegulation() {
  const context = useContext(RegulationContext);
  if (!context) {
    throw new Error("useRegulation must be used within a RegulationProvider");
  }
  return context;
}
