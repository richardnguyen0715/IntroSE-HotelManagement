import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "../Feature6/Feature6.css";

const API_URL = "http://localhost:5000/api";

const Regulation2 = () => {
  const [initialMaxCapacity, setInitialMaxCapacity] = useState(3);
  const [maxCustomersValue, setMaxCustomersValue] = useState(3);
  const [maxEditMode, setMaxEditMode] = useState(false);
  const [editingCustomerTypes, setEditingCustomerTypes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    id: null,
    type: "",
    coefficient: "1",
  });
  const [selectedCustomerTypes, setSelectedCustomerTypes] = useState([]);
  const [error, setError] = useState(null);
  const [customerTypeMap, setCustomerTypeMap] = useState({});
  const { userInfo, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch mapping
  const fetchCustomerTypeMap = useCallback(async () => {
    try {
      const token = userInfo.token;
      const res = await fetch(`${API_URL}/mapper`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Không thể tải dữ liệu mapper");
      const data = await res.json();
      setCustomerTypeMap(data);
    } catch (err) {
      setError(err.message);
    }
  }, [userInfo.token]);

  // Fetch policy sau khi có mapper
  const fetchPolicy = useCallback(async () => {
    if (Object.keys(customerTypeMap).length === 0) return;

    try {
      const token = userInfo.token;
      const res = await fetch(`${API_URL}/policy`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Không thể tải dữ liệu quy định");
      const data = await res.json();
      
      setMaxCustomersValue(data.maxCapacity);
      setInitialMaxCapacity(data.maxCapacity);
      const types = Object.entries(data)
        .filter(([key]) => key.endsWith("Policy") && key !== "surchargePolicy")
        .map(([key, coefficient]) => ({
          id: key,
          type: customerTypeMap[key] || key,
          coefficient: coefficient.toString(),
        }));
      setEditingCustomerTypes(types);
    } catch (err) {
      setError(err.message);
    }
  }, [customerTypeMap, userInfo.token]);

  useEffect(() => {
    fetchCustomerTypeMap();
  }, [fetchCustomerTypeMap]);

  useEffect(() => {
    fetchPolicy();
  }, [fetchPolicy]);

  // Hàm xử lý thay đổi số lượng khách tối đa
  const handleMaxCustomersChange = (e) => {
    setMaxCustomersValue(parseInt(e.target.value));
  };

  // Hàm xử lý đăng ký loại khách
  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá loại khách này?")) return;
    const token = userInfo.token;

    try {
      for (const id of selectedCustomerTypes) {
        const res = await fetch(`${API_URL}/policy/field/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error(`Xoá thất bại: ${id}`);
      }

      setEditingCustomerTypes((prev) =>
        prev.filter((ct) => !selectedCustomerTypes.includes(ct.id))
      );
      setSelectedCustomerTypes([]);
    } catch (err) {
      alert("Đã xảy ra lỗi khi xoá: " + err.message);
    }
  };

  // Hàm lưu số lượng khách tối đa
  const saveMaxCustomers = async () => {
    const token = userInfo.token;
    try {
      const res = await fetch(`${API_URL}/policy/field/maxCapacity`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fieldValue: maxCustomersValue }),
      });
      if (!res.ok) throw new Error("Cập nhật thất bại");
      setInitialMaxCapacity(maxCustomersValue);
      setMaxEditMode(false);
    } catch (err) {
      alert("Lỗi khi cập nhật số lượng khách tối đa: " + err.message);
    }
  };

  // Hàm chuyển đổi tên tiếng Việt sang key tiếng Anh
  const convertVietnameseToKey = (text) => {
    return (
      text
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/\s+/g, "")
        .toLowerCase() + "Policy"
    );
  };

  // Mở modal thêm loại khách
  const openAddModal = () => {
    setIsEditing(false);
    setEditForm({ id: null, type: "", coefficient: "1" });
    setModalVisible(true);
  };

  // Mở modal sửa loại khách
  const openEditModal = () => {
    if (selectedCustomerTypes.length === 1) {
      const target = editingCustomerTypes.find(
        (c) => c.id === selectedCustomerTypes[0]
      );
      setIsEditing(true);
      setEditForm({ ...target });
      setModalVisible(true);
    }
  };

  // Hàm xử lý chọn loại khách
  const handleRowSelection = (id) => {
    setSelectedCustomerTypes((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Hàm xử lý gửi form trong modal
  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const token = userInfo.token;

    try {
      const vietnameseName = editForm.type;
      const englishKey = convertVietnameseToKey(vietnameseName);
      const value = parseFloat(editForm.coefficient);

      if (isNaN(value) || value <= 0) {
        alert("Hệ số không hợp lệ");
        return;
      }

      if (isEditing) {
        const updates = {};
        editingCustomerTypes.forEach((ct) => {
          if (ct.id === editForm.id) {
            ct.coefficient = editForm.coefficient;
            updates[editForm.id] = value;
          }
        });

        await fetch(`${API_URL}/policy/field/${editForm.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ fieldValue: value }),
        });
      } else {
        // 1. Gửi lên policy
        await fetch(`${API_URL}/policy/add-field`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fieldName: englishKey,
            fieldValue: value,
          }),
        });

        // 2. Gửi lên mapper
        await fetch(`${API_URL}/mapper/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            engkey: englishKey,
            vnkey: vietnameseName,
          }),
        });

        // 3. Cập nhật UI
        setEditingCustomerTypes((prev) => [
          ...prev,
          {
            id: englishKey,
            type: vietnameseName,
            coefficient: editForm.coefficient,
          },
        ]);
      }

      setModalVisible(false);
      setSelectedCustomerTypes([]);
    } catch (err) {
      alert("Cập nhật lỗi: " + err.message);
    }
  };

  if (error) return <div className="error">Lỗi: {error}</div>;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <Link to="/HomePage">
            <h1>HotelManager</h1>
          </Link>
        </div>

        <div className="header-right">
          <Link to="/about">Về chúng tôi</Link>
          <img
            src="/icons/VietnamFlag.png"
            alt="Vietnam Flag"
            className="flag"
          />
          <div className="user-menu">
            <div
              className="user-avatar"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img src="/icons/User.png" alt="User" />
            </div>

            {isDropdownOpen && (
              <div className="user-dropdown">
                <div className="user-info">
                  <h3>Thông tin người dùng</h3>
                  <p>Họ tên: {userInfo?.name}</p>
                  <p>Email: {userInfo?.email}</p>
                  <p>Vai trò: {userInfo?.role}</p>
                </div>
                <button className="logout-button" onClick={logout}>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="header-container">
          <h2>Quy định 2</h2>
          <Link to="/feature6" className="back-button">
            <img src="/icons/Navigate.png" alt="Back" />
          </Link>
        </div>

        <div className="regulation-container">
          <div className="regulation-section">
            <div className="max-customer-header">
              <h4>Số lượng khách tối đa/phòng:</h4>
              {!maxEditMode ? (
                <>
                  <span>{maxCustomersValue}</span>
                  <button
                    className="edit-button-small"
                    onClick={() => setMaxEditMode(true)}
                  >
                    Chỉnh sửa
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={maxCustomersValue}
                    onChange={handleMaxCustomersChange}
                  />
                  <button className="confirm-button" onClick={saveMaxCustomers}>
                    Lưu
                  </button>
                  <button
                    className="cancel-button"
                    onClick={() => {
                      setMaxCustomersValue(initialMaxCapacity);
                      setMaxEditMode(false);
                    }}
                  >
                    Hủy
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="regulation-section">
            <h4>Danh sách loại khách</h4>
            <div className="room-types-table">
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>STT</th>
                    <th>Loại khách</th>
                    <th>Hệ số</th>
                  </tr>
                </thead>
                <tbody>
                  {editingCustomerTypes.map((type, index) => (
                    <tr key={type.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedCustomerTypes.includes(type.id)}
                          onChange={() => handleRowSelection(type.id)}
                        />
                      </td>
                      <td>{index + 1}</td>
                      <td>{type.type}</td>
                      <td>{type.coefficient}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="button-container">
              <button
                className="action-button add clickable"
                onClick={openAddModal}
              >
                Thêm
              </button>
              <button
                className={`action-button edit ${
                  selectedCustomerTypes.length === 1 ? "clickable" : "disabled"
                }`}
                onClick={openEditModal}
                disabled={selectedCustomerTypes.length !== 1}
              >
                Sửa
              </button>
              <button
                className={`action-button delete ${
                  selectedCustomerTypes.length > 0 ? "clickable" : "disabled"
                }`}
                onClick={handleDelete}
                disabled={selectedCustomerTypes.length === 0}
              >
                Xoá
              </button>
            </div>
          </div>
        </div>

        {modalVisible && (
          <div className="modal">
            <div className="modal-content">
              <h3>{isEditing ? "Sửa loại khách" : "Thêm loại khách"}</h3>
              <form onSubmit={handleModalSubmit}>
                <div className="form-group">
                  <label>Loại khách:</label>
                  <input
                    type="text"
                    value={editForm.type}
                    onChange={(e) =>
                      setEditForm({ ...editForm, type: e.target.value })
                    }
                    required
                    disabled={isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>Hệ số:</label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={editForm.coefficient}
                    onChange={(e) =>
                      setEditForm({ ...editForm, coefficient: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setModalVisible(false)}
                  >
                    Hủy
                  </button>
                  <button type="submit" className="confirm-button">
                    Cập nhật
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Regulation2;
