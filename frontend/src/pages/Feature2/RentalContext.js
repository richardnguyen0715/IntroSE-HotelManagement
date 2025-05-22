import React, { createContext, useContext, useState } from 'react';

const RentalContext = createContext();

export function RentalProvider({ children }) {
    const [rentals, setRentals] = useState([
        {
            id: 1,
            roomNumber: '301',
            startDate: '14/02/2025',
            customers: [
                { id: 1, name: 'Nguyễn Văn A', type: 'Nội địa', idNumber: '0xxxxxxxxxx', address: 'TPHCM' },
                { id: 2, name: 'Trần Thị B', type: 'Nội địa', idNumber: '0xxxxxxxxxx', address: 'Hà Nội' }
            ]
        },
        {
            id: 2,
            roomNumber: '302',
            startDate: '14/03/2025',
            customers: [
                { id: 1, name: 'Nguyễn Văn A', type: 'Nội địa', idNumber: '0xxxxxxxxxx', address: 'TPHCM' },
                { id: 2, name: 'Trần Thị B', type: 'Nội địa', idNumber: '0xxxxxxxxxx', address: 'Hà Nội' }
            ]
        }
    ]);

    const addRental = (rental) => {
        setRentals([...rentals, { ...rental, id: rentals.length + 1 }]);
    };

    const updateRental = (id, updatedRental) => {
        setRentals(rentals.map(rental =>
            rental.id === id ? { ...updatedRental, id } : rental
        ));
    };

    const deleteRentals = (ids) => {
        setRentals(rentals.filter(rental => !ids.includes(rental.id)));
    };

    return (
        <RentalContext.Provider value={{ rentals, addRental, updateRental, deleteRentals }}>
            {children}
        </RentalContext.Provider>
    );
}

export function useRentals() {
    const context = useContext(RentalContext);
    if (!context) {
        throw new Error('useRentals must be used within a RentalProvider');
    }
    return context;
} 