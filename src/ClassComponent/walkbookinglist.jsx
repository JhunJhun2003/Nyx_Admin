import React, { useState, useContext } from "react";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Context } from "../Hooks/context"; // Context လမ်းကြောင်း မှန်မမှန် စစ်ပေးပါ
import "./walkbookinglist.css";

// Sample Initial Data
const initialBookings = [
  {
    id: "#1101",
    name: "Mg Mg",
    phone: "09123456789",
    venue: "Badminton Court 1",
    date: "01/06/26",
    amount: "10,000 Ks",
    proof: "receipt1.jpg",
    type: "local",
  },
  {
    id: "#1102",
    name: "Aung Aung",
    phone: "09123456789",
    venue: "Badminton Court 2",
    date: "01/06/26",
    amount: "15,000 Ks",
    proof: "receipt2.jpg",
    type: "local",
  },
  {
    id: "#1103",
    name: "Aung Kyaw",
    phone: "09123456789",
    venue: "Badminton Court 3",
    date: "01/06/26",
    amount: "20,000 Ks",
    proof: "receipt3.jpg",
    type: "mobile",
  },
];

function WalkBookingList() {
  const { classBackColor } = useContext(Context);
  const isDark = classBackColor === "#1A1C1E";

  const [orderType, setOrderType] = useState("local"); // 'mobile' or 'local'
  const [searchTerm, setSearchTerm] = useState("");

  // Filter list based on orderType & search query
  const filteredBookings = initialBookings.filter((item) => {
    const matchesType = item.type === orderType;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm);
    return matchesType && matchesSearch;
  });

  return (
    <div
      className={`booking-list-page ${isDark ? "dark-mode" : ""}`}
      style={{
        backgroundColor: classBackColor || (isDark ? "#121212" : "#f4f5f7"),
      }}
    >
      {/* Top Header Section */}
      <header className="list-page-header">
        <div className="title-container">
          <ReceiptLongIcon className="title-icon" />
          <h1>Booking List</h1>
        </div>

        <div className="order-switch-container">
          <button
            type="button"
            className={`switch-btn ${orderType === "mobile" ? "active" : ""}`}
            onClick={() => setOrderType("mobile")}
          >
            Mobile Order
          </button>
          <button
            type="button"
            className={`switch-btn ${orderType === "local" ? "active" : ""}`}
            onClick={() => setOrderType("local")}
          >
            Local Order
          </button>
        </div>
      </header>

      {/* Main Table Card Section */}
      <main className="table-card">
        <div className="table-card-header">
          <h2 className="card-title">All Bookings</h2>

          <div className="controls-right">
            <div className="search-box">
              <SearchIcon className="search-icon" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button type="button" className="filter-btn">
              <FilterListIcon fontSize="small" /> Filter
            </button>
          </div>
        </div>

        {/* Table Structure */}
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>BOOKING ID</th>
                <th>NAME</th>
                <th>PHONE NUMBER</th>
                <th>VENUE/COURT</th>
                <th>DATE</th>
                <th>TOTAL AMOUNT</th>
                <th>PAYMENT PROOF</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((row, index) => (
                  <tr key={index}>
                    <td className="font-bold">{row.id}</td>
                    <td>{row.name}</td>
                    <td>{row.phone}</td>
                    <td>{row.venue}</td>
                    <td>{row.date}</td>
                    <td className="font-medium">{row.amount}</td>
                    <td>
                      <div className="proof-thumbnail">
                        <div className="thumbnail-placeholder"></div>
                      </div>
                    </td>
                    <td>
                      <button type="button" className="btn-view">
                        <VisibilityIcon style={{ fontSize: 16 }} /> View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-data">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="pagination-footer">
          <span className="pagination-info">
            Showing 1 to {filteredBookings.length} of {filteredBookings.length}{" "}
            bookings
          </span>
          <div className="pagination-controls">
            <button type="button" disabled className="page-btn">
              &lt;
            </button>
            <button type="button" className="page-btn active">
              1
            </button>
            <button type="button" disabled className="page-btn">
              &gt;
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default WalkBookingList;
