import SearchIcon from "@mui/icons-material/SearchOutlined";
import CustomerLoading from "../Components/loadingcustomer";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import useReceipt from "../Components/Receipt";
import { useGetOrder } from "../Api_Call";
import * as XLSX from "xlsx";
import { useTableFooter } from "../Hooks/tablefooter";

function MobileOrder() {
  const [text, settext] = useState("");
  const [filterdata, setfilterdata] = useState(null);

  const { open, ReceipetJsx } = useReceipt();
  const { MOrders, GetMobileOrders } = useGetOrder();
  const { TableFooterJsx, startnumber, endnumber } = useTableFooter(filterdata);

  useEffect(() => {
    if (!MOrders.data) return;
    if (text === "") {
      setfilterdata(MOrders.data);
    } else {
      let filtered = MOrders.data.filter((item) => {
        return item.customer_name.toLowerCase().includes(text.toLowerCase());
      });
      setfilterdata(filtered);
    }
  }, [text, MOrders.data]);

  useEffect(() => {
    GetMobileOrders();
  }, []);

  //for searchevent.target.value;
  const changetext = (event) => {
    settext(event.target.value);
  };

  //for img preview
  const showImagePreview = (imageUrl) => {
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

  async function UpdateOrder(item, event) {
    let status = event.target.value;
    let id = item.order_id;
    try {
      let reponse = await fetch(`${import.meta.env.VITE_UPDATE_ORDER}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: status }),
      });
      if (reponse.ok) {
        await GetMobileOrders();
      }
    } catch (error) {
      console.log(error);
    }
  }

  //function to show order
  function show_order(info) {
    if (!info) return null;
    let formatData = {
      order_no: info.order_id,
      payment: info.payment_method,
      Date: info.Date,
      Time: info.Time,
      items: info.items.map((item) => ({
        ...item,
        productName: item.product_name,
      })),
      item_Qty: info.items.length,
      item_amount: info.Sub_total,
      tax: info.tax,
      dfee: info.develivery_fee || 0,
      total_amount: info.Total,
    };

    open(formatData);
  }

  async function ExportTable() {
    if (!filterdata) return;
    let formattedData = filterdata.map((item) => ({
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

  return (
    <div style={{ padding: "10px", paddingTop: "0" }}>
      {ReceipetJsx}
      <div className="ordertableheader">
        <h2>Top Order</h2>
        <div className="ordersearch">
          <input
            type="search"
            placeholder="Search..."
            name="ordersearch"
            onChange={changetext}
          />
          <SearchIcon />
        </div>
        <button className="orderexportbtn" onClick={ExportTable}>
          <SaveAltIcon />
          Export
        </button>
      </div>
      <div className="towarpthetableorder">
        <div className="posordertablewarper">
          <table className="posordertable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Time</th>
                <th>Payment</th>
                <th>Proof</th>
                <th>Order Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filterdata) ? (
                filterdata.length > 0 ? (
                  filterdata
                    .slice(startnumber, endnumber)
                    .map((item, index) => {
                      return (
                        <tr key={index} className="ordertablerow">
                          <td>{item.order_id}</td>
                          <td>{item.customer_name}</td>
                          <td>{item.Total}</td>
                          <td>{item.Date}</td>
                          <td>{item.Time}</td>
                          <td>{item.payment_method}</td>
                          <td className="imgcontainer">
                            <img
                              src={item.payment_proof}
                              className="posorderimg"
                              onClick={() =>
                                showImagePreview(item.payment_proof)
                              }
                            />
                          </td>
                          <td
                            className={`${item.order_status.toLowerCase()}action`}
                            id="vss"
                          >
                            <select
                              onChange={(event) => UpdateOrder(item, event)}
                              aria-readonly
                              value={item.order_status}
                            >
                              <option value="pending">Pending</option>
                              <option value="completed">Completed</option>
                              <option value="cancel">Cancel</option>
                            </select>
                          </td>
                          <td className="actioncolumn">
                            <p onClick={() => show_order(item)}>View</p>
                          </td>
                        </tr>
                      );
                    })
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      No data
                    </td>
                  </tr>
                )
              ) : (
                [...Array(12)].map((_, index) => (
                  <CustomerLoading key={index} times={9} />
                ))
              )}
            </tbody>
          </table>
        </div>
        {TableFooterJsx}
      </div>
    </div>
  );
}
export default MobileOrder;
