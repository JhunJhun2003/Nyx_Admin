import SearchIcon from "@mui/icons-material/SearchSharp";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import "../classCss/classbookinglist.css";
import { useGetClassBooking } from "../ClassApi";
import { useEffect, useState } from "react";
import { useClassReceipt } from "./ClassReceipt";
import { useNoti } from "../Hooks/alert";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { useTableFooter } from "../Hooks/tablefooter";

function ClassLoaclBooking() {
  const [text, settext] = useState("");
  const [filtered, setfiltered] = useState(null);

  const { GetLocalBooking, ClassLocalBookings } = useGetClassBooking();
  const { open, ClassReceipetJsx } = useClassReceipt();
  const { Loading, openconfirm, openerror, openloading, opensuccess, close } =
    useNoti();
  const { TableFooterJsx, startnumber, endnumber } = useTableFooter(filtered);

  useEffect(() => {
    GetLocalBooking();
  }, []);
  console.log(ClassLocalBookings);

  useEffect(() => {
    let result = ClassLocalBookings?.data;
    if (Array.isArray(result) && result.length > 0) {
      if (text.trim() != "") {
        result = result.filter((item) => {
          return (
            item.venue_name.toLowerCase().includes(text.toLowerCase()) ||
            item.court_name.toLowerCase().includes(text.toLowerCase()) ||
            item.payment_method.toLowerCase().includes(text.toLowerCase())
          );
        });
      }
    }
    setfiltered(result);
  }, [text, ClassLocalBookings?.data]);

  //for img preview
  const showImagePreview = (imageUrl) => {
    if (!imageUrl) return;
    Swal.fire({
      imageUrl: imageUrl,
      imageAlt: "Payment Proof",
      showConfirmButton: false,
      showCloseButton: false,
      background: "transparent",
      customClass: {
        image: "preview-image-style",
      },
    });
  };

  function show_reciept(item) {
    console.log(item);
    let rental_fee = 0;
    if (Array.isArray(item.items) && item.items.length > 0) {
      rental_fee = item.items.reduce((total, current) => {
        return total + Number(current.price) * Number(current.quantity);
      }, 0);
    }
    open({
      order_no: item.id.toString().padStart(4, "0"),
      payment: item?.payment_method || "Cash",
      Date: item?.date,
      Time: new Date(item.create_at).toLocaleTimeString(),
      court_fee: item?.Court_Fee || 0,
      rental_fee: rental_fee,
      total_amount: item?.Total || 0,
    });
  }

  async function ExportTable() {
    alert("Please Read the documentation(document.txt) or comment");
    if (!filtered) return;
    return; // here,the row and cell are different according to customer wish.,so , ask him first and modify here;
    let formattedData = filtered.map((item) => ({
      "Order Id": item.order_id,
      Customer: item.customer_name,
      Amount: item.Total,
      Date: item.Date,
      Time: item.Time,
      Payment: item.payment_method,
      "Order Status": item.order_status,
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");
    XLSX.writeFile(workbook, "sales-report.xlsx");
  }

  const changetext = (e) => {
    settext(e.target.value);
  };

  //delete booking function
  async function delete_booking(id) {
    let isconfirm = await openconfirm();
    if (!isconfirm) return;
    openloading();
    try {
      let response = await fetch(
        `${import.meta.env.VITE_CLASS_DELETE_LOCAL_BOOKING}/${id}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        await GetLocalBooking();
        opensuccess("Action Successful", "Booking deleted successfully");
      } else {
        openerror("Something went wrong");
      }
    } catch (err) {
      openerror("Cannot connect with sever");
    }
  }

  return (
    <div className="mbmain">
      {ClassReceipetJsx}
      {Loading}
      <div className="mb1">
        <h2>Top Booking</h2>
        <div className="mb2">
          <input type="search" placeholder="Search..." onChange={changetext} />
          <SearchIcon sx={{ color: "white" }} />
        </div>
        <button onClick={ExportTable}>
          <SaveAltIcon sx={{ fontSize: "20px" }} />
          Export
        </button>
      </div>
      <div className="mobilebookingtablewaper ">
        <div className="mb3">
          <table className="mb4">
            <thead>
              <tr>
                <th>
                  Booking <br />
                  No
                </th>
                <th>Reciept</th>
                <th>
                  Venue /<br /> Court
                </th>

                <th>Equipment</th>
                <th>Date</th>
                <th>Time</th>
                <th>
                  Total <br /> amount
                </th>
                <th>Payment</th>
                <th>
                  Payment <br /> Proof
                </th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filtered) ? (
                filtered.length > 0 ? (
                  filtered.slice(startnumber, endnumber).map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>#{item.id.toString().padStart(4, "0")}</td>
                        <td>{item.reciept_no}</td>
                        <td>
                          {item.venue_name}/ <br />
                          {item.court_name}
                        </td>
                        <td className="specialrow">
                          {Array.isArray(item.items) && item.items.length > 0
                            ? item.items
                                .map((childitem, index) => {
                                  return childitem.equipment
                                    ? childitem.equipment || "--------------"
                                    : "-----------------";
                                })
                                .join(", ")
                            : "--------------"}
                        </td>
                        <td>{item.date}</td>
                        <td>{new Date(item.create_at).toLocaleTimeString()}</td>
                        <td>{item.Total || "00000"} ks</td>
                        <td>{item.payment_method}</td>
                        <td>
                          <div className="specialdiv">
                            <img
                              src={item.payment_image_url || Default}
                              onClick={() =>
                                showImagePreview(item.payment_image_url)
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div className="specialdiv1">
                            <button onClick={() => show_reciept(item)}>
                              view
                            </button>
                            <button onClick={() => delete_booking(item.id)}>
                              cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={10} style={{ textAlign: "center" }}>
                      no result found..
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan={10} style={{ textAlign: "center" }}>
                    Loading...
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan={10}></td>
              </tr>
            </tbody>
          </table>
        </div>
        {TableFooterJsx}
      </div>
    </div>
  );
}
export default ClassLoaclBooking;
