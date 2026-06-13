import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import "./cssFolder/PosCustomer.css";
import { useContext, useEffect, useState } from "react";
import { Context } from "./Hooks/context";
import CustomerLoading from "./Components/loadingcustomer";
import { useGetCustomer } from "./Api_Call";

function PosCustomer() {
  const [text, settext] = useState("");
  const [filteredData, setfilteredData] = useState([]);
  const [warnedCustomers, setWarnedCustomers] = useState([]);

  // 📄 Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const { backcolor, Token } = useContext(Context);
  const { GetCustomer, Customers } = useGetCustomer();

  const textchange = (event) => {
    settext(event.target.value);
    setCurrentPage(1); // Search လုပ်ရင် page 1 ပြန်သွားမယ်
  };

  const toggleWarning = (id) => {
    if (warnedCustomers.includes(id)) {
      setWarnedCustomers(
        warnedCustomers.filter((customerId) => customerId !== id),
      );
    } else {
      setWarnedCustomers([...warnedCustomers, id]);
    }
  };

  useEffect(() => {
    if (Array.isArray(Customers.showCustomerData)) {
      let data = Customers.showCustomerData;
      if (text.trim() !== "") {
        data = data.filter(
          (item) =>
            item.name
              .toLocaleLowerCase()
              .includes(text.toLocaleLowerCase().trim()) ||
            item.address
              ?.toLocaleLowerCase()
              .includes(text.toLocaleLowerCase().trim()),
        );
      }
      setfilteredData(data);
    }
  }, [text, Customers.showCustomerData]);

  useEffect(() => {
    GetCustomer();
  }, []);

  async function delete_customer(id) {
    try {
      let response = await fetch(
        `${import.meta.env.VITE_DELETE_CUSTOMER}/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
        },
      );
      if (response.ok) {
        await GetCustomer();
      }
    } catch (err) {
      console.log(err);
    }
  }

  // 🌓 Dark Mode / Light Mode စစ်ဆေးခြင်း
  const isDarkMode = Boolean(backcolor === "#1A1C1E");

  // 🧮 Pagination Calculation
  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  // Data မပြည့်ရင် Row ၁၀ ခု ကွက်တိဖြစ်အောင် Empty Rows ထည့်ပေးခြင်း
  const emptyRowsCount = rowsPerPage - currentRows.length;

  return (
    <div
      className={`Poscustomermain ${isDarkMode ? "dark-theme" : "light-theme"}`}
    >
      {/* Header Block */}
      <div className="Poscustomerheader">
        <h1>
          <PersonIcon style={{ fontSize: "26px", color: "#4F46E5" }} />
          Customers List
        </h1>
        <div className="search-box-wrapper">
          <input
            type="search"
            onChange={textchange}
            placeholder="Search customers..."
          />
          <SearchIcon className="search-icon-inside" />
        </div>
      </div>

      {/* Modern Table Container */}
      <div className="customertableContainer">
        <table className="customertable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Remark</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(Customers.showCustomerData) ? (
              <>
                {/* 1. လက်ရှိ Page အတွက် ရှိတဲ့ Data ဆွဲပြမယ် */}
                {currentRows.map((item, index) => {
                  const isWarned = warnedCustomers.includes(item.id);
                  return (
                    <tr
                      key={index}
                      className={isWarned ? "row-warned" : "row-normal"}
                    >
                      <td className="id-cell">#{item.id}</td>
                      <td className="customer-name-cell">{item.name}</td>
                      <td>{item.address || "-"}</td>
                      <td>{item.phone || "-"}</td>
                      <td>{item.email || "-"}</td>
                      <td>
                        <span className="remark-badge">....</span>
                      </td>
                      <td className="customerbuttoncontainer">
                        <button
                          type="button"
                          className={`editbutton ${isWarned ? "active-warned" : ""}`}
                          onClick={() => toggleWarning(item.id)}
                        >
                          {isWarned ? "Unwarn" : "Warning"}
                        </button>
                        <button
                          type="button"
                          className="deletebutton"
                          onClick={() => delete_customer(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {/* 2. Row ၁၀ ခု ပြည့်အောင် ကွက်လပ်တွေ ဖြည့်ထားမယ် */}
                {emptyRowsCount > 0 &&
                  Array.from({ length: emptyRowsCount }).map((_, index) => (
                    <tr key={`empty-${index}`} className="row-empty">
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                    </tr>
                  ))}
              </>
            ) : (
              [...Array(10)].map((_, index) => (
                <CustomerLoading key={index} times={7} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🏁 Pagination UI Controls */}
      <div className="pos-pagination-footer">
        <span className="pagination-info">
          Showing {filteredData.length > 0 ? indexOfFirstRow + 1 : 0} to{" "}
          {Math.min(indexOfLastRow, filteredData.length)} of{" "}
          {filteredData.length} entries
        </span>
        <div className="pagination-btn-group">
          <button
            type="button"
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            <NavigateBeforeIcon style={{ fontSize: "20px" }} />
          </button>

          <span className="page-number-display">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            <NavigateNextIcon style={{ fontSize: "20px" }} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PosCustomer;
