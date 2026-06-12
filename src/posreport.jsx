import "./cssFolder/posreport.css";
import ReportIcon from "@mui/icons-material/AssessmentOutlined";
import DollarIcon from "@mui/icons-material/Paid";
import ProductIcon from "@mui/icons-material/Widgets";
import CustomerIcon from "@mui/icons-material/Groups";
import SearchIcon from "@mui/icons-material/SearchSharp";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import TriangleIcon from "@mui/icons-material/EjectSharp";
import { useContext, useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Context } from "./Hooks/context";
import { useGetOrder } from "./Api_Call";
import CustomerLoading from "./Components/loadingcustomer";
import Swal from "sweetalert2";

function PosReport() {
  const [filteredData, setfilteredData] = useState(null);
  const [text, settext] = useState("");

  const chartsref = useRef(null);
  const tableref = useRef(null);

  const { backcolor } = useContext(Context);
  const { MOrders, GetMobileOrders } = useGetOrder();

  useEffect(() => {
    GetMobileOrders();
  }, []);

  useEffect(() => {
    if (text == "") {
      setfilteredData(MOrders.data);
    } else {
      let fdata = MOrders.data.filter((item) => {
        return item.order_id.toString().includes(text);
      });
      setfilteredData(fdata);
    }
  }, [text, MOrders.data]);

  const textchange = (event) => {
    settext(event.target.value);
  };

  const Font_color = Boolean(backcolor == "#1A1C1E");
  const FontStyle = {
    color: Font_color ? "#E1E1E1" : "#0D1B2A",
  };
  const InputStyle = {
    backgroundColor: Font_color ? "#E1E1E1" : "#0D1B2A",
  };

  let data = [
    { name: "Jan", sales: 3000 },
    { name: "Feb", sales: 4000 },
    { name: "Mar", sales: 5000 },
    { name: "Apr", sales: 6000 },
    { name: "May", sales: 7000 },
    { name: "Jun", sales: 8000 },
  ];

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

  async function handleExport() {
    let formattedData = data.map((item) => ({
      Month: item.name,
      Sales: item.sales,
    }));
    const Worksheet = XLSX.utils.json_to_sheet(formattedData);
    const Workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(Workbook, Worksheet, "Sales Trends");
    XLSX.writeFile(Workbook, "sales-trends.xlsx");
  }

  async function ExportTable() {
    if (!filteredData.length > 0) return;
    let formattedData = filteredData.map((item) => ({
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
    <>
      <div className="posreportcontainer">
        <h1 className="reporttitle" style={FontStyle}>
          <ReportIcon className="titleicon" /> Report
        </h1>
        <div className="tilteline"></div>

        <div className="posreportbody">
          <div className="posreporttitle">
            <p>
              Total Revenue <DollarIcon />
            </p>
            <h3>60000ks</h3>
            <h5>
              {" "}
              <TriangleIcon style={{ color: "green", fontSize: "30px" }} />
              <span>11%</span>
            </h5>
          </div>

          <div className="posreporttitle">
            <p>
              Order Received <ProductIcon />
            </p>
            <h3>1200</h3>
            <h5>
              <TriangleIcon
                style={{
                  color: "red",
                  fontSize: "30px",
                  transform: "rotate(180deg)",
                }}
              />
              <span>-3%</span>
            </h5>
          </div>

          <div className="posreporttitle">
            <p>
              Total Product <ProductIcon />
            </p>
            <h3>55</h3>
            <h5>
              <TriangleIcon style={{ color: "green", fontSize: "30px" }} />
              <span>+5%</span>
            </h5>
          </div>

          <div className="posreporttitle">
            <p>
              Total Customers
              <CustomerIcon />
            </p>
            <h3>245</h3>
            <h5>
              <TriangleIcon style={{ color: "green", fontSize: "30px" }} />
              <span>+12</span>
            </h5>
          </div>
        </div>

        <div className="posreportbody2">
          <div className="posreportbody2header">
            <h2>Sale Trends</h2>
            <div>
              <input type="search" placeholder="Search..." />
              <SearchIcon
                style={{
                  color: "white",
                  paddingRight: "5px",
                  fontSize: "30px",
                }}
              />
            </div>
            <button onClick={handleExport}>
              <SaveAltIcon /> Export
            </button>
          </div>

          <div className="posreportbody2secheader">
            <input type="date" />
            <input type="date" />
          </div>

          <div
            style={{
              width: "100%",
              height: "230px",
              paddingRight: "10px",
              marginTop: "10px",
              paddingTop: "20px",
              paddingBottom: "20px",
            }}
            ref={chartsref}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid
                  strokeDasharray="0"
                  vertical={false}
                  stroke="#ccc"
                />
                <XAxis datakey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="red" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="posreportbody2 posreporttalbecontainer">
          <div className="posreportbody2header">
            <h2>Orders history</h2>
            <div>
              <input
                type="search"
                placeholder="Search..."
                onChange={textchange}
              />
              <SearchIcon
                style={{
                  color: "white",
                  paddingRight: "5px",
                  fontSize: "30px",
                }}
              />
            </div>
            <button onClick={ExportTable}>
              <SaveAltIcon /> Export
            </button>
          </div>

          <div className="posreportbody2secheader">
            <input type="date" />
            <input type="date" />
          </div>
          <div className="posreporttablecontainer" ref={tableref}>
            <table className="posreporttable">
              <thead>
                <tr>
                  <th>Order Id</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Payment</th>
                  <th>Payment Proof</th>
                  <th>Order Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(filteredData) ? (
                  filteredData.length > 0 ? (
                    filteredData.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{item.order_id}</td>
                          <td>{item.customer_name}</td>
                          <td>{item.Total}</td>
                          <td>{item.Date}</td>
                          <td>{item.Time}</td>
                          <td>{item.payment_method}</td>
                          <td className="reportimg">
                            <div>
                              <img
                                src={item.payment_proof}
                                onClick={() =>
                                  showImagePreview(item.payment_proof)
                                }
                              />
                            </div>
                          </td>
                          <td>
                            <span
                              className={`posreporttable${item.order_status.toLowerCase()}`}
                            >
                              {item.order_status}
                            </span>
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
                  [...Array(8)].map((_, index) => {
                    return <CustomerLoading times={8} key={index} />;
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
export default PosReport;

// Tommorrow's task: 1.function change handleExportTabel to export excel file instead of image. 2. Add pagination to the table. 3. Add filter by order status and payment method. 4. Add sorting by date and amount.
