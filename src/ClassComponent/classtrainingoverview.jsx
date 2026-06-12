import { useState, useEffect } from "react";
import { useGetClassOverview } from "../ClassApi";
import StatCards from "./StatCards";
import ChartSection from "./ChartSection";
import RecentPaymentsTable from "./RecentPaymentsTable";

export default function ClassTrainingOverview() {
  const { training, GetTrainingOverview } = useGetClassOverview();
  const [paymentMode, setPaymentMode] = useState("mobile");

  useEffect(() => {
    GetTrainingOverview();
  }, []);

  const handleExportToExcel = () => {
    // Export functionality can be implemented here if needed
    // This is called from ChartSection export button
    alert("Export functionality can be added here");
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', sans-serif",
        background: "#f3f4f6",
        minHeight: "100vh",
        padding: "24px",
        color: "#111827",
      }}
    >
      <StatCards />
      <ChartSection onExport={handleExportToExcel} />
      <RecentPaymentsTable
        paymentMode={paymentMode}
        onPaymentModeChange={setPaymentMode}
      />
    </div>
  );
}