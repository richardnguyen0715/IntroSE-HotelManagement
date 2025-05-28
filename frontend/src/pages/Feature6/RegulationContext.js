import React, { createContext, useContext, useState } from 'react';

const RegulationContext = createContext();

export function RegulationProvider({ children }) {
    const [roomTypes, setRoomTypes] = useState([
        { id: 1, type: 'A', price: 150000, quantity: 5 },
        { id: 2, type: 'B', price: 170000, quantity: 5 },
        { id: 3, type: 'C', price: 200000, quantity: 5 }
    ]);

    const [customerTypes, setCustomerTypes] = useState([
        { id: 1, type: 'Nội địa', coefficient: 1 },
        { id: 2, type: 'Nước ngoài', coefficient: 1.5 }
    ]);

    const [maxCustomers, setMaxCustomers] = useState(3);
    const [surchargeRate, setSurchargeRate] = useState(0.25);
    const [surcharges, setSurcharges] = useState({
        extraGuestSurcharge: 25,
        foreignGuestSurcharge: 50
    });
    const updateRoomTypes = (newRoomTypes) => {
        setRoomTypes(newRoomTypes);
    };
    

    const updateCustomerTypes = (newCustomerTypes) => {
        setCustomerTypes(newCustomerTypes);
    };
    const updateSurcharge = (newSurcharge) => {
    // Trong trường hợp thực tế, bạn sẽ gọi API để cập nhật dữ liệu
    setSurcharges(newSurcharge);
    
    // Lưu dữ liệu vào localStorage hoặc gọi API
    try {
        // Giả lập lưu dữ liệu
        console.log("Đã cập nhật quy định phụ thu:", newSurcharge);
        // Trong trường hợp thực tế: await axios.put('/api/regulations/surcharges', newSurcharge);
    } catch (error) {
        console.error("Lỗi khi cập nhật quy định phụ thu:", error);
    }
    };
    const updateMaxCustomers = (newMaxCustomers) => {
        setMaxCustomers(newMaxCustomers);
    };

    const updateSurchargeRate = (newRate) => {
        setSurchargeRate(newRate);
    };

    return (
        <RegulationContext.Provider value={{
            roomTypes,
            customerTypes,
            maxCustomers,
            surchargeRate,
            surcharges,
            updateSurcharge,
            updateRoomTypes,
            updateCustomerTypes,
            updateMaxCustomers,
            updateSurchargeRate
        }}>
            {children}
        </RegulationContext.Provider>
    );
}

export function useRegulation() {
    const context = useContext(RegulationContext);
    if (!context) {
        throw new Error('useRegulation must be used within a RegulationProvider');
    }
    return context;
} 