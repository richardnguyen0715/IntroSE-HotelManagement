import React, { createContext, useState, useContext } from 'react';

const BillContext = createContext();

export const BillProvider = ({ children }) => {
    const [regulations, setRegulations] = useState({
        basePrice: 100, // Đơn giá cơ bản cho 2 khách
        thirdPersonSurcharge: 0.25, // Phụ thu 25% cho người thứ 3
        foreignerCoefficient: 1.5, // Hệ số 1.5 cho khách nước ngoài
    });

    const calculateRoomPrice = (basePrice, numGuests, hasForeigner) => {
        let total = basePrice;

        // Tính phụ thu cho người thứ 3
        if (numGuests > 2) {
            total += basePrice * regulations.thirdPersonSurcharge;
        }

        // Áp dụng hệ số cho khách nước ngoài
        if (hasForeigner) {
            total *= regulations.foreignerCoefficient;
        }

        return total;
    };

    const updateRegulation = (type, value) => {
        setRegulations(prev => ({
            ...prev,
            [type]: value
        }));
    };

    return (
        <BillContext.Provider value={{
            regulations,
            calculateRoomPrice,
            updateRegulation
        }}>
            {children}
        </BillContext.Provider>
    );
};

export const useBill = () => {
    const context = useContext(BillContext);
    if (!context) {
        throw new Error('useBill must be used within a BillProvider');
    }
    return context;
};

export default BillContext; 