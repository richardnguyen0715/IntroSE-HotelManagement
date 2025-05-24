import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useRegulation } from '../Feature6/RegulationContext';
import './Feature3.css';
import '../App.css';

function Feature3() {
    const navigate = useNavigate();
    const [searchRoom, setSearchRoom] = useState('');
    const { roomTypes } = useRegulation();

    // Tạo danh sách phòng từ roomTypes
    const rooms = roomTypes.flatMap(type =>
        Array(type.quantity).fill().map((_, index) => ({
            id: `${type.id}-${index + 1}`,
            roomNumber: `${type.type}${index + 1}`,
            type: type.type,
            price: type.price,
            status: 'Trống'  // Mặc định là trống, có thể cập nhật sau khi có chức năng quản lý trạng thái phòng
        }))
    );

    const [searchResults, setSearchResults] = useState(null);

    const handleSearch = () => {
        if (!searchRoom) {
            setSearchResults(null);
            return;
        }
        const results = rooms.filter(room =>
            room.roomNumber.toLowerCase().includes(searchRoom.toLowerCase())
        );
        setSearchResults(results);
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const displayRooms = searchResults || rooms;

    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN');
    };

    return (
        <div className="app">
            {/* Header */}
            <header className="app-header">
                <div className="header-left">
                    <Link to="/">
                        <h1>HotelManager</h1>
                    </Link>
                </div>

                <nav className="header-right">
                    <Link to="/about">Về chúng tôi</Link>
                    <img src="/icons/VietnamFlag.png" alt="Vietnam Flag" className="flag" />
                    <Link to="/register">
                        <button className="button-reg">Đăng ký</button>
                    </Link>
                    <Link to='/login'>
                        <button className="button-log">Đăng nhập</button>
                    </Link>
                </nav>
            </header>

            {/* Main Content */}
            <main className="main-content">
                <div className="header-container">
                    <h2>Tra cứu phòng</h2>
                    <button onClick={handleGoBack} className="back-button">
                        <img src="/icons/Navigate.png" alt="Back" />
                    </button>
                </div>

                <div className="search-container">
                    <h3 className="section-title">Nhập số phòng</h3>
                    <div className="search-input">
                        <input
                            type="text"
                            value={searchRoom}
                            onChange={(e) => setSearchRoom(e.target.value)}
                            placeholder="Nhập số phòng..."
                        />
                        <button className="search-button" onClick={handleSearch}>
                            Tra cứu
                        </button>
                    </div>

                    <h3 className="section-title">
                        {searchResults ? 'Kết quả tra cứu' : 'Danh sách các phòng'}
                    </h3>
                    <table className="room-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Phòng</th>
                                <th>Loại phòng</th>
                                <th>Đơn giá (VNĐ)</th>
                                <th>Tình trạng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayRooms.map((room, index) => (
                                <tr key={room.id}>
                                    <td>{index + 1}</td>
                                    <td>{room.roomNumber}</td>
                                    <td>{room.type}</td>
                                    <td>{formatPrice(room.price)}</td>
                                    <td className={room.status === 'Trống' ? 'status-available' : 'status-occupied'}>
                                        {room.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

export default Feature3; 