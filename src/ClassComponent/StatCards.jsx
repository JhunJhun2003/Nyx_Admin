import { useState, useEffect } from "react";
import GroupsIcon from "@mui/icons-material/Groups3Sharp";
import SchoolIcon from "@mui/icons-material/SchoolSharp";
import PaidIcon from "@mui/icons-material/PaidSharp";
import PersonAddIcon from "@mui/icons-material/PersonAddSharp";

// Clean Modern StatCard Component
const StatCard = ({ title, value, change, icon, iconColor, isCurrent }) => (
  <div
    style={{
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "20px 24px",
      flex: 1,
      minWidth: 0,
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "8px",
      }}
    >
      <span style={{ fontSize: "13px", color: "#6b7280", fontWeight: 500 }}>
        {title}
      </span>
      {isCurrent ? (
        <span
          style={{
            fontSize: "12px",
            color: "#6b7280",
            background: "#f3f4f6",
            padding: "2px 8px",
            borderRadius: "4px",
          }}
        >
          Current
        </span>
      ) : (
        <span style={{ fontSize: "20px", color: iconColor || "#3b82f6" }}>
          {icon}
        </span>
      )}
    </div>
    <div
      style={{
        fontSize: "22px",
        fontWeight: 700,
        color: "#111827",
        marginBottom: "6px",
      }}
    >
      {value}
    </div>
    <div
      style={{
        fontSize: "12px",
        color: change.includes("-") ? "#ef4444" : "#16a34a",
        fontWeight: 500,
      }}
    >
      {change}
    </div>
  </div>
);

export default function StatCards() {
  const [statsData, setStatsData] = useState([
    {
      title: "TOTAL STUDENTS",
      value: "0 students",
      change: "+0%",
      icon: <GroupsIcon sx={{ fontSize: "24px" }} />,
      iconColor: "#3b82f6",
    },
    {
      title: "ACTIVE TRAINING",
      value: "0 active classes",
      change: "Active Status",
      icon: <SchoolIcon sx={{ fontSize: "24px" }} />,
      iconColor: "#6366f1",
      isCurrent: true,
    },
    {
      title: "MONTHLY REVENUE",
      value: "0 Ks",
      change: "+0%",
      icon: <PaidIcon sx={{ fontSize: "24px" }} />,
      iconColor: "#10b981",
    },
    {
      title: "NEW ENROLLMENT",
      value: "0 students",
      change: "This week",
      icon: <PersonAddIcon sx={{ fontSize: "24px" }} />,
      iconColor: "#ec4899",
    },
  ]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrainingOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        "http://38.60.216.25:5000/api/trainingoverview/showtrainingoverview"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch training overview data");
      }
      const jsonResult = await response.json();
      
      if (jsonResult.success && jsonResult.data) {
        const data = jsonResult.data;
        
        // Format monthly revenue with commas
        const formattedRevenue = data.Monthly_revenue 
          ? `${data.Monthly_revenue.toLocaleString()} Ks` 
          : "0 Ks";
        
        // Calculate percentage change (you can adjust this logic based on your needs)
        const studentChange = data.Total_students > 0 ? "+5%" : "0%";
        const revenueChange = data.Monthly_revenue > 0 ? "+10%" : "0%";
        
        setStatsData([
          {
            title: "TOTAL STUDENTS",
            value: `${data.Total_students || 0} students`,
            change: studentChange,
            icon: <GroupsIcon sx={{ fontSize: "24px" }} />,
            iconColor: "#3b82f6",
          },
          {
            title: "ACTIVE TRAINING",
            value: `${data.Total_class || 0} active classes`,
            change: "Active Status",
            icon: <SchoolIcon sx={{ fontSize: "24px" }} />,
            iconColor: "#6366f1",
            isCurrent: true,
          },
          {
            title: "MONTHLY REVENUE",
            value: formattedRevenue,
            change: revenueChange,
            icon: <PaidIcon sx={{ fontSize: "24px" }} />,
            iconColor: "#10b981",
          },
          {
            title: "NEW ENROLLMENT",
            value: `${data.New_enrollment || 0} students`,
            change: "This week",
            icon: <PersonAddIcon sx={{ fontSize: "24px" }} />,
            iconColor: "#ec4899",
          },
        ]);
      } else {
        throw new Error("No data found");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching training overview:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainingOverview();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "20px 24px",
              flex: 1,
              minWidth: 0,
            }}
          >
            <div
              style={{
                height: "60px",
                background: "#f3f4f6",
                borderRadius: "4px",
              }}
            ></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "24px",
          padding: "20px",
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          textAlign: "center",
        }}
      >
        <p style={{ color: "#ef4444", flex: 1 }}>Error: {error}</p>
        <button
          onClick={fetchTrainingOverview}
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
    );
  }

  return (
    <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
      {statsData.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}