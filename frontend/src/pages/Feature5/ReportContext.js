import { createContext, useState, useContext } from 'react';

const ReportContext = createContext();

export function ReportProvider({ children }) {
    const [revenueReports, setRevenueReports] = useState([
        {
            month: '1/2025',
            items: [
                { id: 1, roomType: 'A', revenue: '1,500,000', percentage: '30.6', rentDays: '15' },
                { id: 2, roomType: 'B', revenue: '3,400,000', percentage: '69.4', rentDays: '20' },
            ]
        },
        {
            month: '2/2025',
            items: [
                { id: 1, roomType: 'C', revenue: '4,000,000', percentage: '100', rentDays: '25' },
            ]
        }
    ]);

    const [occupancyReports, setOccupancyReports] = useState([
        {
            month: '1/2025',
            items: [
                { id: 1, roomType: 'A', occupancy: '54.5', rentDays: '24' },
                { id: 2, roomType: 'B', occupancy: '45.5', rentDays: '20' },
            ]
        },
        {
            month: '2/2025',
            items: [
                { id: 1, roomType: 'C', occupancy: '100', rentDays: '27' },
            ]
        }
    ]);

    const calculatePercentages = (items) => {
        const totalRevenue = items.reduce((sum, item) =>
            sum + parseInt(item.revenue.replace(/,/g, '')), 0);

        return items.map(item => ({
            ...item,
            percentage: ((parseInt(item.revenue.replace(/,/g, '')) / totalRevenue) * 100).toFixed(1)
        }));
    };

    const validateReport = (report, isOccupancy = false) => {
        // Validate month format (MM/YYYY)
        const monthRegex = /^(0?[1-9]|1[0-2])\/20\d{2}$/;
        if (!monthRegex.test(report.month)) {
            throw new Error('Tháng không hợp lệ. Định dạng phải là MM/YYYY');
        }

        // Validate room type (A-Z)
        const roomTypeRegex = /^[A-Z]$/;
        if (!roomTypeRegex.test(report.roomType)) {
            throw new Error('Loại phòng không hợp lệ. Chỉ chấp nhận một ký tự từ A-Z');
        }

        // Validate rentDays (1-31)
        const rentDays = parseInt(report.rentDays);
        if (isNaN(rentDays) || rentDays < 1 || rentDays > 31) {
            throw new Error('Số ngày thuê không hợp lệ. Phải là số từ 1-31');
        }

        if (!isOccupancy) {
            // Validate revenue (numbers only, can include commas)
            const revenueRegex = /^[0-9,]+$/;
            if (!revenueRegex.test(report.revenue)) {
                throw new Error('Doanh thu không hợp lệ. Chỉ chấp nhận số và dấu phẩy');
            }
        }
    };

    const calculateOccupancy = (rentDays, monthStr, allRentDays) => {
        const totalRentDays = allRentDays.reduce((sum, days) => sum + parseInt(days), 0);
        if (totalRentDays === 0) return '100.0';
        const occupancyRate = (parseInt(rentDays) / totalRentDays) * 100;
        return occupancyRate.toFixed(1);
    };

    const addReport = (newReport) => {
        try {
            validateReport(newReport);

            const monthReport = revenueReports.find(r => r.month === newReport.month);

            if (monthReport) {
                // Check if room type already exists in this month
                if (monthReport.items.some(item => item.roomType === newReport.roomType)) {
                    throw new Error('Loại phòng này đã tồn tại trong tháng báo cáo');
                }

                const updatedReports = revenueReports.map(report => {
                    if (report.month === newReport.month) {
                        const newId = Math.max(...report.items.map(item => item.id)) + 1;
                        const updatedItems = calculatePercentages([
                            ...report.items,
                            { id: newId, ...newReport }
                        ]);

                        return {
                            ...report,
                            items: updatedItems
                        };
                    }
                    return report;
                });
                setRevenueReports(updatedReports);
            } else {
                setRevenueReports([...revenueReports, {
                    month: newReport.month,
                    items: [{ id: 1, ...newReport, percentage: '100' }]
                }]);
            }
        } catch (error) {
            throw error;
        }
    };

    const addOccupancyReport = (newReport) => {
        try {
            validateReport(newReport, true);

            const monthReport = occupancyReports.find(r => r.month === newReport.month);

            if (monthReport) {
                // Check if room type already exists in this month
                if (monthReport.items.some(item => item.roomType === newReport.roomType)) {
                    throw new Error('Loại phòng này đã tồn tại trong tháng báo cáo');
                }

                const updatedReports = occupancyReports.map(report => {
                    if (report.month === newReport.month) {
                        const newId = Math.max(...report.items.map(item => item.id)) + 1;
                        const allRentDays = [...report.items.map(item => item.rentDays), newReport.rentDays];

                        // Recalculate occupancy for all items in this month
                        const updatedItems = [...report.items, { id: newId, ...newReport }].map(item => ({
                            ...item,
                            occupancy: calculateOccupancy(item.rentDays, newReport.month, allRentDays)
                        }));

                        return {
                            ...report,
                            items: updatedItems
                        };
                    }
                    return report;
                });
                setOccupancyReports(updatedReports);
            } else {
                setOccupancyReports([...occupancyReports, {
                    month: newReport.month,
                    items: [{ id: 1, ...newReport, occupancy: '100.0' }]
                }]);
            }
        } catch (error) {
            throw error;
        }
    };

    const editReport = (month, id, updatedData) => {
        try {
            validateReport(updatedData);

            const updatedReports = revenueReports.map(monthReport => {
                if (monthReport.month === month) {
                    // Check if room type already exists in other items
                    const hasConflict = monthReport.items.some(item =>
                        item.id !== id && item.roomType === updatedData.roomType
                    );
                    if (hasConflict) {
                        throw new Error('Loại phòng này đã tồn tại trong tháng báo cáo');
                    }

                    const updatedItems = monthReport.items.map(item =>
                        item.id === id ? { ...item, ...updatedData } : item
                    );

                    return {
                        ...monthReport,
                        items: calculatePercentages(updatedItems)
                    };
                }
                return monthReport;
            });

            setRevenueReports(updatedReports);
        } catch (error) {
            throw error;
        }
    };

    const editOccupancyReport = (month, id, updatedData) => {
        try {
            validateReport(updatedData, true);

            const updatedReports = occupancyReports.map(monthReport => {
                if (monthReport.month === month) {
                    // Check if room type already exists in other items
                    const hasConflict = monthReport.items.some(item =>
                        item.id !== id && item.roomType === updatedData.roomType
                    );
                    if (hasConflict) {
                        throw new Error('Loại phòng này đã tồn tại trong tháng báo cáo');
                    }

                    // Get all rent days for this month
                    const allRentDays = monthReport.items.map(item =>
                        item.id === id ? updatedData.rentDays : item.rentDays
                    );

                    // Recalculate occupancy for all items
                    const updatedItems = monthReport.items.map(item => {
                        const newItem = item.id === id ? { ...item, ...updatedData } : item;
                        return {
                            ...newItem,
                            occupancy: calculateOccupancy(newItem.rentDays, month, allRentDays)
                        };
                    });

                    return {
                        ...monthReport,
                        items: updatedItems
                    };
                }
                return monthReport;
            });

            setOccupancyReports(updatedReports);
        } catch (error) {
            throw error;
        }
    };

    const deleteReports = (selectedReports) => {
        try {
            const updatedReports = revenueReports.map(monthReport => {
                const updatedItems = monthReport.items.filter(item =>
                    !selectedReports.includes(`${monthReport.month}-${item.id}`)
                );

                if (updatedItems.length > 0) {
                    return {
                        ...monthReport,
                        items: calculatePercentages(updatedItems)
                    };
                }
                return null;
            }).filter(Boolean);

            setRevenueReports(updatedReports);
        } catch (error) {
            throw error;
        }
    };

    const deleteOccupancyReports = (selectedReports) => {
        try {
            const updatedReports = occupancyReports.map(monthReport => {
                const updatedItems = monthReport.items.filter(item =>
                    !selectedReports.includes(`${monthReport.month}-${item.id}`)
                );

                if (updatedItems.length > 0) {
                    // Recalculate occupancy for remaining items
                    const allRentDays = updatedItems.map(item => item.rentDays);
                    const recalculatedItems = updatedItems.map(item => ({
                        ...item,
                        occupancy: calculateOccupancy(item.rentDays, monthReport.month, allRentDays)
                    }));

                    return {
                        ...monthReport,
                        items: recalculatedItems
                    };
                }
                return null;
            }).filter(Boolean);

            setOccupancyReports(updatedReports);
        } catch (error) {
            throw error;
        }
    };

    return (
        <ReportContext.Provider value={{
            reports: revenueReports,
            occupancyReports,
            addReport,
            addOccupancyReport,
            editReport,
            editOccupancyReport,
            deleteReports,
            deleteOccupancyReports
        }}>
            {children}
        </ReportContext.Provider>
    );
}

export function useReports() {
    return useContext(ReportContext);
} 