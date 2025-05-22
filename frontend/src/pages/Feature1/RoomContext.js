import { createContext, useState, useContext } from 'react';

const RoomContext = createContext();

export function RoomProvider({ children }) {
    const [rooms, setRooms] = useState([
        { id: 1, roomNumber: '101', roomType: 'A', price: '150,000' },
        { id: 2, roomNumber: '102', roomType: 'B', price: '170,000' },
        { id: 3, roomNumber: '103', roomType: 'C', price: '200,000' }
    ]);

    const validateRoom = (room) => {
        // Validate room number (non-empty)
        if (!room.roomNumber.trim()) {
            throw new Error('Số phòng không được để trống');
        }

        // Validate room type (A-Z)
        const roomTypeRegex = /^[A-Z]$/;
        if (!roomTypeRegex.test(room.roomType)) {
            throw new Error('Loại phòng không hợp lệ. Chỉ chấp nhận một ký tự từ A-Z');
        }

        // Validate price (numbers only, can include commas)
        const priceRegex = /^[0-9,]+$/;
        if (!priceRegex.test(room.price)) {
            throw new Error('Giá phòng không hợp lệ. Chỉ chấp nhận số và dấu phẩy');
        }
    };

    const addRoom = (newRoom) => {
        try {
            validateRoom(newRoom);

            // Check if room number already exists
            if (rooms.some(room => room.roomNumber === newRoom.roomNumber)) {
                throw new Error('Số phòng này đã tồn tại');
            }

            const newId = Math.max(...rooms.map(room => room.id)) + 1;
            setRooms([...rooms, { ...newRoom, id: newId }]);
        } catch (error) {
            throw error;
        }
    };

    const editRoom = (id, updatedRoom) => {
        try {
            validateRoom(updatedRoom);

            // Check if room number already exists in other rooms
            const hasConflict = rooms.some(room =>
                room.id !== id && room.roomNumber === updatedRoom.roomNumber
            );
            if (hasConflict) {
                throw new Error('Số phòng này đã tồn tại');
            }

            const updatedRooms = rooms.map(room =>
                room.id === id ? { ...room, ...updatedRoom } : room
            );
            setRooms(updatedRooms);
        } catch (error) {
            throw error;
        }
    };

    const deleteRooms = (selectedRooms) => {
        try {
            const updatedRooms = rooms.filter(room => !selectedRooms.includes(room.id));
            setRooms(updatedRooms);
        } catch (error) {
            throw error;
        }
    };

    return (
        <RoomContext.Provider value={{
            rooms,
            addRoom,
            editRoom,
            deleteRooms
        }}>
            {children}
        </RoomContext.Provider>
    );
}

export function useRooms() {
    return useContext(RoomContext);
} 