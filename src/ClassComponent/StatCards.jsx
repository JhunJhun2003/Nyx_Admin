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
      {change.includes("vs") ? `↗ ${change}` : change}
    </div>
  </div>
);

export default function StatCards() {
  const statsData = [
    {
      title: "TOTAL STUDENTS",
      value: "120 students",
      change: "+5%",
      icon: <GroupsIcon sx={{ fontSize: "24px" }} />,
      iconColor: "#3b82f6",
    },
    {
      title: "ACTIVE TRAINING",
      value: "8 active classes",
      change: "Active Status",
      icon: <SchoolIcon sx={{ fontSize: "24px" }} />,
      iconColor: "#6366f1",
      isCurrent: true,
    },
    {
      title: "MONTHLY REVENUE",
      value: "1,500,000 Ks",
      change: "+10%",
      icon: <PaidIcon sx={{ fontSize: "24px" }} />,
      iconColor: "#10b981",
    },
    {
      title: "NEW ENROLLMENT",
      value: "15 students",
      change: "This week",
      icon: <PersonAddIcon sx={{ fontSize: "24px" }} />,
      iconColor: "#ec4899",
    },
  ];

  return (
    <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
      {statsData.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}