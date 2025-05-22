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

    const updateRoomTypes = (newRoomTypes) => {
        setRoomTypes(newRoomTypes);
    };

    const updateCustomerTypes = (newCustomerTypes) => {
        setCustomerTypes(newCustomerTypes);
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