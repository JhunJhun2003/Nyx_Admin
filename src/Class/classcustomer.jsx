import PeopleIcon from "@mui/icons-material/PeopleAltSharp";
import SearchIcon from "@mui/icons-material/SearchSharp";
import "../classCss/classcustomer.css";
import { useGetClassCustomer } from "../ClassApi";
import { useEffect, useState } from "react";
import { useNoti } from "../Hooks/alert";
import { useTableFooter } from "../Hooks/tablefooter";
import Swal from "sweetalert2";

function ClassCustomer() {
  const [Index, setIndex] = useState(0);
  const [filtered, setfiletered] = useState(null);
  const [text, settext] = useState(null);
  const [warningLoading, setWarningLoading] = useState({});
  const [deleteLoading, setDeleteLoading] = useState({});

  const { GetClassCustomers, ClassCustomers } = useGetClassCustomer();
  const { Loading, opensuccess, openconfirm, openerror, openloading } =
    useNoti();
  const { TableFooterJsx, startnumber, endnumber } = useTableFooter();

  useEffect(() => {
    GetClassCustomers();
  }, []);

  const textchange = (event) => {
    settext(event.target.value);
    console.log(text);
  };

  useEffect(() => {
    let result = ClassCustomers.data?.[Index]?.customers;
    if (Array.isArray(ClassCustomers.data?.[Index]?.customers)) {
      if (text) {
        result = result.filter((item) => {
          return (
            item?.name?.toLowerCase().includes(text.toLowerCase()) ||
            item?.court_name?.toLowerCase().includes(text.toLowerCase()) ||
            item?.phone?.toString().includes(text.toString())
          );
        });
      }
    }
    setfiletered(result);
  }, [text, ClassCustomers.data?.[Index], Index]);

  // Delete customer
  async function delete_customer(id) {
    if (!id) return;

    let isConfirm = await openconfirm(
      "Deleting Customer?",
      "Are you sure to delete this customer?",
    );
    if (!isConfirm) return;

    setDeleteLoading((prev) => ({ ...prev, [id]: true }));
    openloading();

    try {
      let response = await fetch(
        `${import.meta.env.VITE_CLASS_DELETE_MOBILE_BOOKING}/${id}`,
        { method: "DELETE" },
      );
      if (response.ok) {
        await GetClassCustomers();
        opensuccess(
          "Action Successful",
          "Customer deleted successfully from list",
        );
      } else {
        openerror("Something went wrong");
      }
    } catch (err) {
      console.log(err);
      openerror("Cannot connect with server");
    } finally {
      setDeleteLoading((prev) => ({ ...prev, [id]: false }));
    }
  }

  // Add warning to customer
  async function addWarning(id) {
    if (!id) return;

    const result = await Swal.fire({
      title: "Add Warning?",
      text: "Are you sure you want to add a warning to this customer?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f59e0b",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    setWarningLoading((prev) => ({ ...prev, [id]: true }));
    openloading();

    try {
      const response = await fetch(
        `http://
130.94.99.9:5000/api/customer/updatecustomer/${id}/true`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        },
      );

      const data = await response.json();

      if (response.ok && data.status === "success") {
        await GetClassCustomers();
        opensuccess(
          "Action Successful",
          "Warning added to customer successfully!",
        );
      } else {
        openerror(data.message || "Failed to add warning");
      }
    } catch (err) {
      console.error("Add warning error:", err);
      openerror("Cannot connect with server");
    } finally {
      setWarningLoading((prev) => ({ ...prev, [id]: false }));
    }
  }

  // Remove warning from customer
  async function removeWarning(id) {
    if (!id) return;

    const result = await Swal.fire({
      title: "Remove Warning?",
      text: "Are you sure you want to remove warning from this customer?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    setWarningLoading((prev) => ({ ...prev, [id]: true }));
    openloading();

    try {
      const response = await fetch(
        `http://
130.94.99.9:5000/api/customer/updatecustomer/${id}/false`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        },
      );

      const data = await response.json();

      if (response.ok && data.status === "success") {
        await GetClassCustomers();
        opensuccess(
          "Action Successful",
          "Warning removed from customer successfully!",
        );
      } else {
        openerror(data.message || "Failed to remove warning");
      }
    } catch (err) {
      console.error("Remove warning error:", err);
      openerror("Cannot connect with server");
    } finally {
      setWarningLoading((prev) => ({ ...prev, [id]: false }));
    }
  }

  return (
    <div className="classcustomermain">
      <header className="ccheader">
        {Loading}
        <PeopleIcon sx={{ fontSize: "30px" }} />
        <h2>Customers</h2>
      </header>
      <div className="ccbody">
        <div className="ccnav">
          <div className="ccnav1">
            {Array.isArray(ClassCustomers.data) ? (
              ClassCustomers.data.length > 0 ? (
                ClassCustomers.data.map((item, index) => (
                  <h3
                    key={index}
                    style={{
                      background: Index == index ? "#F0F0F0" : "initial",
                      color: Index == index ? "#0D1B2A" : "#ffffff",
                    }}
                    onClick={() => setIndex(index)}
                  >
                    {item.venue_name}
                  </h3>
                ))
              ) : (
                <h3 style={{ color: "white" }}>No venue</h3>
              )
            ) : (
              <h3 style={{ color: "white" }}>Loading...</h3>
            )}
          </div>
          <div className="ccnav2">
            <input
              type="search"
              placeholder="Search..."
              onChange={textchange}
            />
            <SearchIcon sx={{ color: "white" }} />
          </div>
        </div>
        <div className="towarpthetable">
          <div className="cctablewarper">
            <table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Phone No</th>
                  <th>Court Name</th>
                  <th>Date</th>
                  <th>Time Slot</th>
                  <th>Remarks</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(filtered) ? (
                  filtered.length > 0 ? (
                    filtered
                      .slice(startnumber, endnumber)
                      .map((item, index) => {

                        return (
                          <tr key={index}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.phone}</td>
                            <td>{item.court_name}</td>
                            <td>{item.date}</td>
                            <td>
                              {Array.isArray(item.time_slots) &&
                              item.time_slots.length > 0
                                ? `${item.time_slots[0].start_time.slice(0, 5)} - ${item.time_slots[0].end_time.slice(0, 5)}`
                                : "null"}
                            </td>
                            <td>{item.remarks || "-"}</td>
                            <td>
                              <div className="classactiondiv">
                                <button
                                  onClick={() => addWarning(item.id)}
                                  disabled={warningLoading[item.id]}
                                  style={{
                                    backgroundColor: "#f59e0b",
                                    color: "white",
                                    border: "none",
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                    cursor: warningLoading[item.id]
                                      ? "not-allowed"
                                      : "pointer",
                                    opacity: warningLoading[item.id] ? 0.7 : 1,
                                    fontSize: "12px",
                                    marginRight: "5px",
                                  }}
                                >
                                  {warningLoading[item.id]
                                    ? "Processing..."
                                    : "Add Warning"}
                                </button>
                                <button
                                  onClick={() => removeWarning(item.id)}
                                  disabled={warningLoading[item.id]}
                                  style={{
                                    backgroundColor: "#4adc26",
                                    color: "white",
                                    border: "none",
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                    cursor: warningLoading[item.id]
                                      ? "not-allowed"
                                      : "pointer",
                                    opacity: warningLoading[item.id] ? 0.7 : 1,
                                    fontSize: "12px",
                                    marginRight: "5px",
                                  }}
                                >
                                  {warningLoading[item.id]
                                    ? "Processing..."
                                    : "Remove Warning"}
                                </button>
                                <button
                                  onClick={() => delete_customer(item.id)}
                                  disabled={deleteLoading[item.id]}
                                  style={{
                                    backgroundColor: "#dc2626",
                                    color: "white",
                                    border: "none",
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                    cursor: deleteLoading[item.id]
                                      ? "not-allowed"
                                      : "pointer",
                                    opacity: deleteLoading[item.id] ? 0.7 : 1,
                                    fontSize: "12px",
                                  }}
                                >
                                  {deleteLoading[item.id]
                                    ? "Deleting..."
                                    : "Delete"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        No results found
                      </td>
                    </tr>
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      Loading...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {TableFooterJsx}
        </div>
      </div>
    </div>
  );
}
export default ClassCustomer;
