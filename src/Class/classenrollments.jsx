import React, { useState, useMemo, useContext } from "react";
import { useOutletContext } from "react-router-dom";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { Context } from "../Hooks/context"; // Context Path အမှန် စစ်ပေးပါ
import "../classCss/classenrollments.css";

// 🎯 KBZ Pay Proof Image Preview ပါဝင်သော Mock Data
const INITIAL_DATA = [
  {
    id: "#1",
    player: "Aung Aung",
    contact: "+959 1234 56789",
    venue: "Badminton / Court A",
    tournament: "Smash Summer Open 2026",
    appDate: "Oct 12, 2026",
    appTime: "09:00 AM",
    subDate: "Aug 29, 2026",
    proof:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop",
    status: "Pending",
  },
  {
    id: "#2",
    player: "Kyaw Kyaw",
    contact: "+959 9876 54321",
    venue: "Badminton / Court B",
    tournament: "Weekend Shuttle Masters",
    appDate: "Oct 13, 2026",
    appTime: "02:00 PM",
    subDate: "Aug 29, 2026",
    proof:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop",
    status: "Pending",
  },
  {
    id: "#3",
    player: "Min Min",
    contact: "+959 4567 89123",
    venue: "Badminton / Court A",
    tournament: "Smash Summer Open 2026",
    appDate: "Oct 14, 2026",
    appTime: "10:30 AM",
    subDate: "Aug 28, 2026",
    proof:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop",
    status: "Pending",
  },
  {
    id: "#4",
    player: "Su Su",
    contact: "+959 1111 22222",
    venue: "Badminton / Court C",
    tournament: "National Badminton Championship",
    appDate: "Jan 10, 2026",
    appTime: "11:00 AM",
    subDate: "Jan 05, 2026",
    proof:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop",
    status: "Approved",
  },
  {
    id: "#5",
    player: "Zaw Zaw",
    contact: "+959 3333 44444",
    venue: "Badminton / Court B",
    tournament: "Weekend Shuttle Masters",
    appDate: "Oct 15, 2026",
    appTime: "04:15 PM",
    subDate: "Aug 30, 2026",
    proof:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop",
    status: "Rejected",
  },
];

function ClassEnrollments() {
  // 🌙 Dark Mode Detection
  const contextData = useContext(Context);
  const outletContext = useOutletContext() || {};
  const { isDark: parentIsDark } = outletContext;

  const isDark =
    parentIsDark ?? contextData?.classBackColor?.toLowerCase() === "#1a1c1e";

  // State Management
  const [activeTab, setActiveTab] = useState("Pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [enrollments, setEnrollments] = useState(INITIAL_DATA);
  const [selectedProof, setSelectedProof] = useState(null); // Proof Modal State

  const ITEMS_PER_PAGE = 5;

  // Approve / Reject Handler
  const handleStatusChange = (id, newStatus) => {
    setEnrollments((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item,
      ),
    );
  };

  // Filtered Data
  const filteredData = useMemo(() => {
    return enrollments.filter((item) => {
      const matchesTab = item.status === activeTab;
      const matchesSearch =
        item.player.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tournament.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.contact.includes(searchTerm);
      return matchesTab && matchesSearch;
    });
  }, [enrollments, activeTab, searchTerm]);

  // Pagination Logic
  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / ITEMS_PER_PAGE) || 1;

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const emptyRowsCount = Math.max(0, ITEMS_PER_PAGE - paginatedData.length);

  // CSV Export
  const handleExport = () => {
    if (filteredData.length === 0) return alert("No data to export!");

    const headers = [
      "ID,PLAYER NAME,CONTACT NUMBER,VENUE / COURT,TOURNAMENT NAME,APPLICATION DATE,SUBMISSION DATE,STATUS\n",
    ];
    const rows = filteredData.map(
      (d) =>
        `"${d.id}","${d.player}","${d.contact}","${d.venue}","${d.tournament}","${d.appDate} ${d.appTime}","${d.subDate}","${d.status}"`,
    );

    const blob = new Blob([headers + rows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTab}_Player_Enrollments.csv`;
    a.click();
  };

  return (
    <div className={`pe-container ${isDark ? "dark-mode" : ""}`}>
      {/* HEADER SECTION */}
      <div className="pe-header">
        <div className="pe-icon-box">
          <DescriptionOutlinedIcon
            sx={{
              fontSize: "2.7rem",
              color: isDark ? "#ffffff" : "#0d1b2a",
            }}
          />
        </div>
        <div>
          <h2 className="pe-title">Player Enrollments</h2>
          <p className="pe-subtitle">
            Manage and approve incoming tournament registrations.
          </p>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="pe-card">
        {/* CONTROLS */}
        <div className="pe-controls">
          <div className="pe-tabs">
            {["Pending", "Approved", "Rejected"].map((tab) => {
              const count = enrollments.filter((e) => e.status === tab).length;
              return (
                <button
                  key={tab}
                  className={`pe-tab-btn ${activeTab === tab ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                  }}
                >
                  {tab}
                  {tab === "Pending" && (
                    <span className="pe-badge">{count}</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pe-actions-right">
            <div className="pe-search-box">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon className="pe-search-icon" />
            </div>

            <button className="pe-export-btn" onClick={handleExport}>
              <FileDownloadOutlinedIcon style={{ fontSize: "18px" }} />
              Export
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="pe-table-wrapper">
          <table className="pe-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>PLAYER NAME</th>
                <th>CONTACT NUMBER</th>
                <th>VENUE / COURT</th>
                <th>TOURNAMENT NAME</th>
                <th>APPLICATION DATE</th>
                <th>SUBMISSION DATE</th>
                <th>PAYMENT PROOF</th>
                <th style={{ textAlign: "center" }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row) => (
                <tr key={row.id}>
                  <td className="pe-id-cell">{row.id}</td>
                  <td className="pe-name-cell">{row.player}</td>
                  <td className="pe-sub-text">{row.contact}</td>
                  <td className="pe-sub-text">{row.venue}</td>
                  <td className="pe-tournament-cell">{row.tournament}</td>
                  <td>
                    <span className="pe-date">{row.appDate}</span>
                    <span className="pe-time">{row.appTime}</span>
                  </td>
                  <td className="pe-sub-text">{row.subDate}</td>
                  <td>
                    {/* 🖼️ Image Click Handler for Modal */}
                    <img
                      src={row.proof}
                      alt="proof"
                      className="pe-proof-img"
                      onClick={() => setSelectedProof(row)}
                    />
                  </td>
                  <td>
                    <div className="pe-action-btns">
                      {row.status === "Pending" ? (
                        <>
                          <button
                            className="pe-btn-approve"
                            onClick={() =>
                              handleStatusChange(row.id, "Approved")
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="pe-btn-reject"
                            onClick={() =>
                              handleStatusChange(row.id, "Rejected")
                            }
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span
                          className={`pe-status-pill ${row.status.toLowerCase()}`}
                        >
                          {row.status}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {/* EMPTY ROWS */}
              {Array.from({ length: emptyRowsCount }).map((_, idx) => (
                <tr key={`empty-${idx}`} className="pe-empty-row">
                  <td colSpan={9}>&nbsp;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="pe-footer">
          <span className="pe-entries-info">
            Showing{" "}
            {totalEntries === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}-
            {Math.min(currentPage * ITEMS_PER_PAGE, totalEntries)} of{" "}
            {totalEntries} entries
          </span>

          <div className="pe-pagination">
            <button
              className="pe-page-nav"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              &lt; Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pe-page-num ${currentPage === page ? "active" : ""}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="pe-page-nav"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next &gt;
            </button>
          </div>
        </div>
      </div>

      {/* 💳 PAYMENT PROOF MODAL CARD */}
      {selectedProof && (
        <div
          className="pe-modal-overlay"
          onClick={() => setSelectedProof(null)}
        >
          <div className="pe-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="pe-modal-header">
              <h3>Payment Proof</h3>
              <button
                className="pe-modal-close"
                onClick={() => setSelectedProof(null)}
              >
                <CloseIcon style={{ fontSize: "20px" }} />
              </button>
            </div>
            <div className="pe-modal-body">
              <img
                src={selectedProof.proof}
                alt="Payment Receipt"
                className="pe-modal-img"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClassEnrollments;
