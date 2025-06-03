import React, { createContext, useContext, useState } from "react";
import { getRevenueReports, getOccupancyReports } from "../../services/reports";

const ReportContext = createContext();

export function ReportProvider({ children }) {
  const [revenueReport, setRevenueReport] = useState(null);
  const [occupancyReport, setOccupancyReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lấy báo cáo doanh thu theo năm và tháng
  const fetchRevenueReport = async (year, month) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getRevenueReports(year, month);
      console.log("Response data:", response);
      if (response.success) {
        setRevenueReport(response.data);
        return response.data;
      } else {
        setError(response.message || "Không thể lấy báo cáo doanh thu");
        return null;
      }
    } catch (error) {
      setError(error.message || "Lỗi khi lấy báo cáo doanh thu");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Lấy báo cáo mật độ sử dụng theo năm và tháng
  const fetchOccupancyReport = async (year, month) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getOccupancyReports(year, month);
      console.log("Response data:", response);
      if (response.success) {
        setOccupancyReport(response.data);
        return response.data;
      } else {
        setError(response.message || "Không thể lấy báo cáo mật độ sử dụng");
        return null;
      }
    } catch (error) {
      setError(error.message || "Lỗi khi lấy báo cáo mật độ sử dụng");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReportContext.Provider
      value={{
        revenueReport,
        occupancyReport,
        loading,
        error,
        fetchRevenueReport,
        fetchOccupancyReport,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
}

export function useReports() {
  return useContext(ReportContext);
}
