import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import SaveAltIcon from "@mui/icons-material/SaveAlt";

export default function ChartSection({ onExport }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // All months template
  const allMonths = [
    { month: "Jan", month_num: 1, enrollment: 0 },
    { month: "Feb", month_num: 2, enrollment: 0 },
    { month: "Mar", month_num: 3, enrollment: 0 },
    { month: "Apr", month_num: 4, enrollment: 0 },
    { month: "May", month_num: 5, enrollment: 0 },
    { month: "Jun", month_num: 6, enrollment: 0 },
    { month: "Jul", month_num: 7, enrollment: 0 },
    { month: "Aug", month_num: 8, enrollment: 0 },
    { month: "Sep", month_num: 9, enrollment: 0 },
    { month: "Oct", month_num: 10, enrollment: 0 },
    { month: "Nov", month_num: 11, enrollment: 0 },
    { month: "Dec", month_num: 12, enrollment: 0 },
  ];

  const fetchEnrollmentData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        "http://38.60.216.25:5000/api/trainingoverview/showtrainingoverview"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch enrollment data");
      }
      const jsonResult = await response.json();
      
      if (jsonResult.success && jsonResult.data) {
        const enrollmentData = jsonResult.data.Enrollment || [];
        
        // Create a map of month_num to enrollment data
        const enrollmentMap = new Map();
        enrollmentData.forEach((item) => {
          enrollmentMap.set(item.month_num, {
            month: item.month_name,
            enrollment: item.total_students,
            month_num: item.month_num
          });
        });
        
        // Merge API data with all months template
        const completeData = allMonths.map(month => {
          const apiData = enrollmentMap.get(month.month_num);
          if (apiData) {
            return {
              month: month.month,
              month_num: month.month_num,
              enrollment: apiData.enrollment
            };
          }
          return month;
        });
        
        setChartData(completeData);
      } else {
        throw new Error("No enrollment data found");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching enrollment data:", err);
      // Set all months with zero values as fallback
      setChartData(allMonths);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollmentData();
  }, []);

  // Filter chart data based on date range if needed
  const getFilteredChartData = () => {
    if (!startDate && !endDate) return chartData;
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const startMonth = start.getMonth() + 1;
      const endMonth = end.getMonth() + 1;
      
      return chartData.filter(
        (item) => item.month_num >= startMonth && item.month_num <= endMonth
      );
    }
    
    return chartData;
  };

  const filteredData = getFilteredChartData();

  // Find max enrollment for Y-axis domain
  const maxEnrollment = Math.max(...filteredData.map(d => d.enrollment), 0);
  const yAxisDomain = [0, Math.ceil(maxEnrollment * 1.1)]; // Add 10% padding

  if (loading) {
    return (
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>
            Enrollment Trends
          </h2>
        </div>
        <div
          style={{
            height: "260px",
            background: "#f3f4f6",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p style={{ color: "#6b7280" }}>Loading chart data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>
            Enrollment Trends
          </h2>
        </div>
        <div
          style={{
            height: "260px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          <p style={{ color: "#ef4444" }}>Error: {error}</p>
          <button
            onClick={fetchEnrollmentData}
            style={{
              padding: "8px 16px",
              background: "#1e293b",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>
          Enrollment Trends
        </h2>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="month"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{
              padding: "6px 12px",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              fontSize: "14px",
            }}
            placeholder="Start Month"
          />
          <input
            type="month"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{
              padding: "6px 12px",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              fontSize: "14px",
            }}
            placeholder="End Month"
          />
          <button
            onClick={onExport}
            style={{
              background: "#1e293b",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "8px 18px",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <SaveAltIcon sx={{ fontSize: "20px" }} />
            Export
          </button>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div
          style={{
            height: "260px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p style={{ color: "#9ca3af" }}>No enrollment data available</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart
            data={filteredData}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="0"
              vertical={false}
              stroke="#e5e7eb"
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <YAxis
              domain={yAxisDomain}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              tickFormatter={(value) => Math.floor(value).toString()}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "13px",
              }}
              formatter={(value) => [`${value} students`, "Enrollment"]}
              labelFormatter={(label) => `${label}`}
            />
            <Line
              type="monotone"
              dataKey="enrollment"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4, fill: "#3b82f6" }}
              activeDot={{ r: 6 }}
              connectNulls={true}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}