import { useState, useEffect } from "react";
import { useGetClassOverview } from "../ClassApi";
import * as XLSX from "xlsx";
import StatCards from "./StatCards";
import ChartSection from "./ChartSection";
import RecentPaymentsTable from "./RecentPaymentsTable";

export default function ClassTrainingOverview() {
  const { training, GetTrainingOverview } = useGetClassOverview();
  const [paymentMode, setPaymentMode] = useState("Local");

  // Fake Mock Data
  const dummyTransactions = [
    {
      id: "#T-1001",
      studentName: "Msh",
      trainingName: "Badminton Pro",
      className: "Beginner Class",
      amount: "50,000Ks",
      courtFee: "50,000 ks",
      rentalFee: "0 ks",
      discount: "0 ks",
      total: "54,000 ks",
      date: "2026-05-12",
      paymentMethod: "KBZ Pay",
      proof: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=150",
      mode: "Local",
    },
    {
      id: "#T-1002",
      studentName: "Thit Sar",
      trainingName: "Futsal Pro",
      className: "Beginner Class",
      amount: "20,000Ks",
      courtFee: "20,000 ks",
      rentalFee: "4,000 ks",
      discount: "0 ks",
      total: "24,000 ks",
      date: "2026-05-12",
      paymentMethod: "KBZ Pay",
      proof: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=150",
      mode: "Local",
    },
    {
      id: "#T-1003",
      studentName: "Hein Min Aung",
      trainingName: "Tennis Pro",
      className: "Beginner Class",
      amount: "70,000Ks",
      courtFee: "70,000 ks",
      rentalFee: "0 ks",
      discount: "0 ks",
      total: "70,000 ks",
      date: "2026-05-12",
      paymentMethod: "KBZ Pay",
      proof: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=150",
      mode: "Mobile",
    },
    {
      id: "#T-1004",
      studentName: "Ma Gyi Nan",
      trainingName: "Futsal Pro",
      className: "Beginner Class",
      amount: "25,000Ks",
      courtFee: "25,000 ks",
      rentalFee: "2,000 ks",
      discount: "0 ks",
      total: "27,000 ks",
      date: "2026-05-13",
      paymentMethod: "WavePay",
      proof: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=150",
      mode: "Mobile",
    },
    {
      id: "#T-1005",
      studentName: "Zwe",
      trainingName: "Badminton Pro",
      className: "Intermediate Class",
      amount: "55,000Ks",
      courtFee: "55,000 ks",
      rentalFee: "0 ks",
      discount: "0 ks",
      total: "55,000 ks",
      date: "2026-06-13",
      paymentMethod: "KBZ Pay",
      proof: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=150",
      mode: "Local",
    },
    {
      id: "#T-1006",
      studentName: "Pwint",
      trainingName: "Tennis Pro",
      className: "Beginner Class",
      amount: "70,000Ks",
      courtFee: "70,000 ks",
      rentalFee: "0 ks",
      discount: "0 ks",
      total: "70,000 ks",
      date: "2026-07-01",
      paymentMethod: "KBZ Pay",
      proof: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=150",
      mode: "Mobile",
    },
    {
      id: "#T-1007",
      studentName: "Kyaw Zayar",
      trainingName: "Futsal Pro",
      className: "Beginner Class",
      amount: "25,000Ks",
      courtFee: "25,000 ks",
      rentalFee: "2,000 ks",
      discount: "0 ks",
      total: "27,000 ks",
      date: "2026-07-23",
      paymentMethod: "WavePay",
      proof: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=150",
      mode: "Local",
    },
    {
      id: "#T-1008",
      studentName: "Kyaw Zin",
      trainingName: "Badminton Pro",
      className: "Intermediate Class",
      amount: "55,000Ks",
      courtFee: "55,000 ks",
      rentalFee: "0 ks",
      discount: "0 ks",
      total: "55,000 ks",
      date: "2026-08-10",
      paymentMethod: "KBZ Pay",
      proof: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=150",
      mode: "Mobile",
    },
  ];

  useEffect(() => {
    GetTrainingOverview();
  }, []);

  const handleExportToExcel = () => {
    const filteredTransactions = dummyTransactions.filter(
      (t) => t.mode === paymentMode
    );
    
    if (filteredTransactions.length === 0) {
      alert("Export ထုတ်ရန် ဒေတာ မရှိသေးပါ!");
      return;
    }

    const excelData = filteredTransactions.map((t) => ({
      "STUDENT ID": t.id,
      "STUDENT NAME": t.studentName,
      "TRAINING NAME": t.trainingName,
      "CLASS NAME": t.className,
      AMOUNT: t.amount,
      DATE: t.date,
      "PAYMENT METHOD": t.paymentMethod,
      "PAYMENT PROOF": t.proof,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
    XLSX.writeFile(workbook, "filtered_training_payments.xlsx");
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
        transactions={dummyTransactions}
        paymentMode={paymentMode}
        onPaymentModeChange={setPaymentMode}
        onExport={handleExportToExcel}
      />
    </div>
  );
}