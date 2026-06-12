import OrderIcon from "@mui/icons-material/DensityMedium";
import "../classCss/classOrder.css";
import { classOrdertable, headerdata } from "../DataExport";
import SearchIcon from "@mui/icons-material/SearchSharp";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { Outlet, useNavigate } from "react-router-dom";
import { useGetClassOrder } from "../ClassApi";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { useReceipt } from "../Components/Receipt";
import Swal from "sweetalert2";
import { useTableFooter } from "../Hooks/tablefooter";

function ClassOrder() {
  const [text, settext] = useState("");
  const [filtered, setfiltered] = useState(null);

  const navigate = useNavigate();

  const { GetOrder, ClassOrders } = useGetClassOrder();
  const { ReceipetJsx, open } = useReceipt();
  const { startnumber, endnumber, TableFooterJsx } = useTableFooter(filtered);

  useEffect(() => {
    GetOrder();
  }, []);

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

  useEffect(() => {
    let result = ClassOrders.data;
    if (Array.isArray(result) && result.length > 0) {
      result = result.filter((item) => {
        return (
          item?.payment_method?.toLowerCase().includes(text.toLowerCase()) ||
          item?.Total?.toString().includes(text.toLowerCase()) ||
          item?.reciept_no
            ?.toString()
            .toLowerCase()
            .includes(text.toLowerCase())
        );
      });
    }
    setfiltered(result);
  }, [text, ClassOrders.data]);

  const textchange = (e) => {
    settext(e.target.value);
  };

  //function to show receipet
  function show_receipet(item) {
    console.log(item);

    let newchildData = item.items?.map((item) => {
      return {
        ...item,
        productName: item.product_name,
        quantity: item.quantity,
      };
    });

    open({
      Date: item.Data,
      Time: item.Time,
      order_no: item.reciept_no,
      payment: item.payment_method,
      items: newchildData,
      item_Qty: item.items?.length,
      item_amount: item.Total,
      tax: 0,
      dfee: 0,
      total_amount: item.Total,
    });
  }

  return (
    <div className="classordermain">
      {ReceipetJsx}
      <div className="classorderbody1">
        <h2 className="classorderheader">
          <OrderIcon />
          Order
        </h2>
        <button onClick={() => navigate("classorderaddmenu")}>
          + Add Order
        </button>
      </div>
      <div className="classorderbody2">
        {headerdata.map((item, index) => {
          return (
            <div className="classorderdata" key={index}>
              <p>{item.header}</p>
              <h3 style={{ fontWeight: "500" }}>{item.body}</h3>
              <p>{item.footer}</p>
            </div>
          );
        })}
      </div>
      <div className="classorderbody3">
        <div className="classorderfooter1">
          <h2>Top Orders</h2>
          <div className="classordersearch">
            <input
              type="search"
              placeholder="Search Order No..."
              onChange={textchange}
            />
            <SearchIcon sx={{ color: "white" }} />
          </div>
          <button onClick={ExportTable}>
            <SaveAltIcon sx={{ color: "white", fontSize: "20px" }} />
            Export
          </button>
        </div>
        <div className="towarpthetable">
          <div className="classorderfooter2">
            <table className="classordertable">
              <thead>
                <tr>
                  <th>Order No</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Payment Proof</th>
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
                            <td>{item.reciept_no}</td>
                            <td>{item.Total} ks</td>
                            <td>{item.payment_method}</td>
                            <td className="imgrowmain">
                              <div className="imgrow">
                                <img
                                  src={item.payment_image}
                                  onClick={() =>
                                    showImagePreview(item.payment_image)
                                  }
                                />
                              </div>
                            </td>
                            <td className="classordertdbtn">
                              <button onClick={() => show_receipet(item)}>
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      })
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center" }}>
                        no result found...
                      </td>
                    </tr>
                  )
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center" }}>
                      Loading...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {TableFooterJsx}
          </div>
        </div>
      </div>
      <Outlet context={{ GetOrder: GetOrder }} />
    </div>
  );
}
export default ClassOrder;
