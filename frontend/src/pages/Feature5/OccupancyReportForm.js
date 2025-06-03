import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Feature5.css";
import { useReports } from "./ReportContext";

function OccupancyReportForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addOccupancyReport, editOccupancyReport } = useReports();
  const isEditing = location.pathname.includes("edit");
  const editData = location.state;

  const [formData, setFormData] = useState({
    month: "",
    roomType: "",
    roomCount: "",
    occupiedDays: "",
    totalAvailableDays: "",
    occupancyRate: "",
  });

  const [errors, setErrors] = useState({
    month: "",
    roomType: "",
    roomCount: "",
    occupiedDays: "",
    totalAvailableDays: "",
    occupancyRate: "",
  });

  useEffect(() => {
    if (isEditing && editData) {
      setFormData({
        month: editData.month,
        roomType: editData.roomType,
        roomCount: editData.roomCount,
        occupiedDays: editData.occupiedDays,
        totalAvailableDays: editData.totalAvailableDays,
        occupancyRate: editData.occupancyRate,
      });
    }
  }, [isEditing, editData]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const validateField = (name, value) => {
    switch (name) {
      case "month":
        const monthRegex = /^(0?[1-9]|1[0-2])\/20\d{2}$/;
        return monthRegex.test(value)
          ? ""
          : "Tháng không hợp lệ. Định dạng phải là MM/YYYY";
      case "roomType":
        const roomTypeRegex = /^[A-Z]$/;
        return roomTypeRegex.test(value)
          ? ""
          : "Loại phòng không hợp lệ. Chỉ chấp nhận một ký tự từ A-Z";
      case "roomCount":
      case "occupiedDays":
      case "totalAvailableDays":
        return /^\d+$/.test(value) && parseInt(value) >= 0
          ? ""
          : "Phải là số nguyên không âm";
      case "occupancyRate":
        const rate = parseFloat(value);
        return !isNaN(rate) && rate >= 0 && rate <= 100
          ? ""
          : "Mật độ sử dụng phải từ 0 đến 100";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {
      month: validateField("month", formData.month),
      roomType: validateField("roomType", formData.roomType),
      roomCount: validateField("roomCount", formData.roomCount),
      occupiedDays: validateField("occupiedDays", formData.occupiedDays),
      totalAvailableDays: validateField(
        "totalAvailableDays",
        formData.totalAvailableDays
      ),
      occupancyRate: validateField("occupancyRate", formData.occupancyRate),
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    try {
      if (isEditing) {
        await editOccupancyReport(editData.month, editData.id, formData);
      } else {
        await addOccupancyReport(formData);
      }
      navigate("/feature5/occupancy");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <Link to="/HomePage">
            <h1>HotelManager</h1>
          </Link>
        </div>

        <nav className="header-right">
          <Link to="/about">Về chúng tôi</Link>
          <img
            src="/icons/VietnamFlag.png"
            alt="Vietnam Flag"
            className="flag"
          />
          <Link to="/register">
            <button className="button-reg">Đăng ký</button>
          </Link>
          <Link to="/login">
            <button className="button-log">Đăng nhập</button>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="header-container">
          <h2>
            {isEditing ? "Cập nhật báo cáo mật độ" : "Tạo báo cáo mật độ"}
          </h2>
          <button onClick={handleGoBack} className="back-button">
            <img src="/icons/Navigate.png" alt="Back" />
          </button>
        </div>

        <div className="report-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tháng</label>
              <input
                type="text"
                name="month"
                value={formData.month}
                onChange={handleChange}
                placeholder="VD: 1/2025"
                disabled={isEditing}
              />
              {errors.month && (
                <span className="error-message">{errors.month}</span>
              )}
            </div>

            <div className="form-group">
              <label>Loại phòng</label>
              <input
                type="text"
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                placeholder="VD: A"
                disabled={isEditing}
              />
              {errors.roomType && (
                <span className="error-message">{errors.roomType}</span>
              )}
            </div>

            <div className="form-group">
              <label>Số phòng</label>
              <input
                type="text"
                name="roomCount"
                value={formData.roomCount}
                onChange={handleChange}
                placeholder="VD: 10"
              />
              {errors.roomCount && (
                <span className="error-message">{errors.roomCount}</span>
              )}
            </div>

            <div className="form-group">
              <label>Ngày sử dụng</label>
              <input
                type="text"
                name="occupiedDays"
                value={formData.occupiedDays}
                onChange={handleChange}
                placeholder="VD: 120"
              />
              {errors.occupiedDays && (
                <span className="error-message">{errors.occupiedDays}</span>
              )}
            </div>

            <div className="form-group">
              <label>Tổng ngày có thể sử dụng</label>
              <input
                type="text"
                name="totalAvailableDays"
                value={formData.totalAvailableDays}
                onChange={handleChange}
                placeholder="VD: 150"
              />
              {errors.totalAvailableDays && (
                <span className="error-message">
                  {errors.totalAvailableDays}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>Mật độ sử dụng (%)</label>
              <input
                type="text"
                name="occupancyRate"
                value={formData.occupancyRate}
                onChange={handleChange}
                placeholder="VD: 80"
              />
              {errors.occupancyRate && (
                <span className="error-message">{errors.occupancyRate}</span>
              )}
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="action-button cancel-button"
                onClick={handleGoBack}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="action-button confirm-button"
                disabled={Object.values(errors).some((error) => error !== "")}
              >
                {isEditing ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default OccupancyReportForm;
