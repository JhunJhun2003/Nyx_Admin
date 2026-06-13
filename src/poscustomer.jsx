import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import "./cssFolder/PosCustomer.css";
import { useContext, useEffect, useState } from "react";
import { Context } from "./Hooks/context";
import CustomerLoading from "./Components/loadingcustomer";
import { useGetCustomer } from "./Api_Call";
import Swal from "sweetalert2";

function PosCustomer() {
  const [text, settext] = useState("");
  const [filteredData, setfilteredData] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { backcolor, Token } = useContext(Context);
  const { GetCustomer, Customers } = useGetCustomer();
  const Font_color = Boolean(backcolor == "#1A1C1E");
  const FontStyle = {
    color: Font_color ? "#E1E1E1" : "#0D1B2A",
  };
  const InputStyle = {
    backgroundColor: Font_color ? "#E1E1E1" : "#0D1B2A",
  };

  const textchange = (event) => {
    settext(event.target.value);
  };

  useEffect(() => {
    if (
      Array.isArray(Customers.showCustomerData) &&
      Customers.showCustomerData.length > 0
    ) {
      setfilteredData(Customers.showCustomerData);
      if (!(text == "")) {
        let purifieddata = Customers.showCustomerData.filter((item) => {
          return (
            item.name
              .toLocaleLowerCase()
              .includes(text.toLocaleLowerCase().trim()) ||
            item.address?.toLocaleLowerCase().includes(text.toLocaleLowerCase())
          );
        });
        setfilteredData(purifieddata);
      } else return;
    }
  }, [text, Customers.showCustomerData]);

  useEffect(() => {
    GetCustomer();
  }, []);

  async function delete_customer(id) {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        setDeletingId(id);
        
        const response = await fetch(
          `http://38.60.216.25:5000/api/customer/user/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Token}`,
            },
          },
        );
        
        const data = await response.json();
        console.log("Delete response:", data);
        
        if (response.ok && data.status === "success") {
          await GetCustomer();
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: data.message || 'Customer has been deleted successfully.',
            confirmButtonColor: '#3085d6',
            timer: 2000
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: data.message || 'Failed to delete customer.',
            confirmButtonColor: '#3085d6'
          });
        }
      }
    } catch (err) {
      console.error("Delete error:", err);
      Swal.fire({
        icon: 'error',
        title: 'Network Error!',
        text: 'Unable to connect to the server. Please check your connection.',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setDeletingId(null);
    }
  }

  // Helper function to get warning status display
  const getWarningStatusDisplay = (warningStatus) => {
    const hasWarning = warningStatus === "true" || warningStatus === "1" || warningStatus === true;
    return {
      text: hasWarning ? "Warning Active" : "No Warning",
      style: {
        display: "inline-block",
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
        backgroundColor: hasWarning ? "#fee2e2" : "#dcfce7",
        color: hasWarning ? "#ef4444" : "#16a34a",
      }
    };
  };

  return (
    <>
      <div className="Poscustomermain">
        <div className="Poscustomerheader">
          <h1 style={FontStyle}>
            <PersonIcon style={{ fontSize: "28px" }} />
            Customers
          </h1>
          <div style={InputStyle}>
            <input
              type="search"
              onChange={textchange}
              placeholder="Search..."
              style={{ color: !Font_color ? "white" : "#0D1B2A" }}
            />
            <SearchIcon />
          </div>
        </div>
        <div className="customertableContainer">
          <table className="customertable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Warning Status</th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredData) ? (
                filteredData.length > 0 ? (
                  filteredData.map((item, index) => {
                    // Get warning status from the API response
                    const warningStatus = item.warning || "false";
                    const statusDisplay = getWarningStatusDisplay(warningStatus);
                    
                    return (
                      <tr key={index}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.address || "-"}</td>
                        <td>{item.phone || "-"}</td>
                        <td>{item.email || "-"}</td>
                        <td>
                          <span style={statusDisplay.style}>
                            {statusDisplay.text}
                          </span>
                        </td>
                        <td className="customerbuttoncontainer">
                          <button
                            className="deletebutton"
                            onClick={() => delete_customer(item.id)}
                            disabled={deletingId === item.id}
                            style={{
                              backgroundColor: "#dc2626",
                              color: "white",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              cursor: deletingId === item.id ? "not-allowed" : "pointer",
                              opacity: deletingId === item.id ? 0.7 : 1,
                            }}
                          >
                            {deletingId === item.id ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      No data
                    </td>
                  </tr>
                )
              ) : (
                [...Array(10)].map((_, index) => (
                  <CustomerLoading key={index} times={7} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default PosCustomer;