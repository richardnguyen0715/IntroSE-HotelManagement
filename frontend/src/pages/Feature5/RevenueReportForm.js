import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Feature5.css";
import { useReports } from "./ReportContext";

function RevenueReportForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addReport, editReport } = useReports();
  const isEditing = location.pathname.includes("edit");
  const editData = location.state;

  const [formData, setFormData] = useState({
    data: "",
    month: "",
    reportCode: "",
    title: "",
    totalRevenue: "",
    year: "",
  });

  const [errors, setErrors] = useState({
    data: "",
    month: "",
    reportCode: "",
    title: "",
    totalRevenue: "",
    year: "",
  });

    useEffect(() => {
        if (isEditing && editData) {
            setFormData({
                month: editData.month,
                roomType: editData.roomType,
                revenue: editData.revenue,
                rentDays: editData.rentDays,
            });
        }
    }, [isEditing, editData]);
  useEffect(() => {
    if (isEditing && editData) {
      setFormData({
        data: editData.data,
        month: editData.month,
        reportCode: editData.reportCode,
        title: editData.title,
        totalRevenue: editData.totalRevenue,
        year: editData.year,
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

      case "revenue":
        const revenueRegex = /^[0-9,]+$/;
        return revenueRegex.test(value)
          ? ""
          : "Doanh thu không hợp lệ. Chỉ chấp nhận số và dấu phẩy";

      case "rentDays":
        const days = parseInt(value);
        if (isNaN(days) || days < 1 || days > 31) {
          return "Số ngày thuê không hợp lệ. Phải là số từ 1-31";
        }
        return "";

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

        setErrors(prev => ({
            ...prev,
            [name]: validateField(name, value)
        }));
    };

    const handleGoBack = () => {
        navigate(-1);
    }
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
      revenue: validateField("revenue", formData.revenue),
      rentDays: validateField("rentDays", formData.rentDays),
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    try {
      if (isEditing) {
        await editReport(editData.month, editData.id, formData);
      } else {
        await addReport(formData);
      }
      navigate("/feature5/revenue");
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
  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <h1>HotelManager</h1>
        </div>

        <nav className="header-right">
          <Link to="/about">Về chúng tôi</Link>
          <img
            src="/icons/VietnamFlag.png"
            alt="Vietnam Flag"
            className="flag"
          />
        </nav>
      </header>

            {/* Main Content */}
            <main className="main-content">
                <div className="header-container">
                    <h2>{isEditing ? 'Cập nhật báo cáo' : 'Tạo báo cáo'}</h2>
                    <Link to="/HomePage" className="back-button">
                        <img src="/icons/Navigate.png" alt="Back" />
                    </Link>
                </div>
      {/* Main Content */}
      <main className="main-content">
        <div className="header-container">
          <h2>{isEditing ? "Cập nhật báo cáo" : "Tạo báo cáo"}</h2>
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
              <label>Doanh thu</label>
              <input
                type="text"
                name="revenue"
                value={formData.revenue}
                onChange={handleChange}
                placeholder="VD: 1,500,000"
              />
              {errors.revenue && (
                <span className="error-message">{errors.revenue}</span>
              )}
            </div>

            <div className="form-group">
              <label>Số ngày thuê</label>
              <input
                type="text"
                name="rentDays"
                value={formData.rentDays}
                onChange={handleChange}
                placeholder="VD: 15"
              />
              {errors.rentDays && (
                <span className="error-message">{errors.rentDays}</span>
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

export default RevenueReportForm;
