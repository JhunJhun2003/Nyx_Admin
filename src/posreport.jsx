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
  const [overviewData, setOverviewData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const chartsref = useRef(null);
  const tableref = useRef(null);

  const { backcolor } = useContext(Context);
  const { MOrders, GetMobileOrders } = useGetOrder();

  // All months template
  const allMonths = [
    { name: "Jan", month_num: 1, sales: 0, year: new Date().getFullYear() },
    { name: "Feb", month_num: 2, sales: 0, year: new Date().getFullYear() },
    { name: "Mar", month_num: 3, sales: 0, year: new Date().getFullYear() },
    { name: "Apr", month_num: 4, sales: 0, year: new Date().getFullYear() },
    { name: "May", month_num: 5, sales: 0, year: new Date().getFullYear() },
    { name: "Jun", month_num: 6, sales: 0, year: new Date().getFullYear() },
    { name: "Jul", month_num: 7, sales: 0, year: new Date().getFullYear() },
    { name: "Aug", month_num: 8, sales: 0, year: new Date().getFullYear() },
    { name: "Sep", month_num: 9, sales: 0, year: new Date().getFullYear() },
    { name: "Oct", month_num: 10, sales: 0, year: new Date().getFullYear() },
    { name: "Nov", month_num: 11, sales: 0, year: new Date().getFullYear() },
    { name: "Dec", month_num: 12, sales: 0, year: new Date().getFullYear() },
  ];

  // Fetch POS Overview Data
  const fetchPosOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        "http://38.60.216.25:5000/api/posoverview/showposoverview"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch POS overview data");
      }
      const jsonResult = await response.json();
      
      if (jsonResult) {
        setOverviewData(jsonResult);
        
        // Create a map of month_num to sale data
        const salesMap = new Map();
        jsonResult.saleTrend.forEach((item) => {
          salesMap.set(item.month_num, {
            name: item.month_name,
            sales: parseInt(item.total_amount),
            month_num: item.month_num,
            year: item.year
          });
        });
        
        // Merge API data with all months template
        const completeData = allMonths.map(month => {
          const apiData = salesMap.get(month.month_num);
          if (apiData) {
            return {
              name: month.name,
              month_num: month.month_num,
              sales: apiData.sales,
              year: apiData.year
            };
          }
          return month;
        });
        
        setChartData(completeData);
      } else {
        throw new Error("No data found");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching POS overview:", err);
      setChartData(allMonths);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetMobileOrders();
    fetchPosOverview();
  }, []);

  useEffect(() => {
    if (text == "") {
      setfilteredData(MOrders.data);
    } else {
      let fdata = MOrders.data?.filter((item) => {
        return item.order_id?.toString().includes(text);
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

  // Filter chart data based on date range
  const getFilteredChartData = () => {
    if (!startDate && !endDate) return chartData;
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const startMonth = start.getMonth() + 1;
      const endMonth = end.getMonth() + 1;
      
      return chartData.filter(
        (item) => item.month_num >= startMonth && item.month_num <= endMonth
      );
    }
    
    return chartData;
  };

  const filteredChartData = getFilteredChartData();
  
  // Find max sales for Y-axis domain
  const maxSales = Math.max(...filteredChartData.map(d => d.sales), 0);
  const yAxisDomain = [0, Math.ceil(maxSales * 1.1)];

  async function handleExport() {
    let formattedData = filteredChartData.map((item) => ({
      Month: item.name,
      Sales: item.sales.toLocaleString(),
    }));
    const Worksheet = XLSX.utils.json_to_sheet(formattedData);
    const Workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(Workbook, Worksheet, "Sales Trends");
    XLSX.writeFile(Workbook, "sales-trends.xlsx");
  }

  async function ExportTable() {
    if (!filteredData?.length > 0) return;
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

  // Header data from API
  const headerData = overviewData ? [
    {
      title: "Total Revenue",
      amount: `${overviewData.total_revenue?.toLocaleString() || 0} ks`,
      change: "+11%",
      changeType: "up",
      icon: <DollarIcon />
    },
    {
      title: "Order Received",
      amount: overviewData.total_order?.toString() || "0",
      change: "-3%",
      changeType: "down",
      icon: <ProductIcon />
    },
    {
      title: "Total Product",
      amount: overviewData.total_products?.toString() || "0",
      change: "+5%",
      changeType: "up",
      icon: <ProductIcon />
    },
    {
      title: "Total Customers",
      amount: overviewData.total_customer?.toString() || "0",
      change: "+12",
      changeType: "up",
      icon: <CustomerIcon />
    },
  ] : [];

  if (loading) {
    return (
      <div className="posreportcontainer">
        <h1 className="reporttitle" style={FontStyle}>
          <ReportIcon className="titleicon" /> Report
        </h1>
        <div className="tilteline"></div>
        <div style={{ textAlign: "center", padding: "50px" }}>
          <div className="spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="posreportcontainer">
        <h1 className="reporttitle" style={FontStyle}>
          <ReportIcon className="titleicon" /> Report
        </h1>
        <div className="tilteline"></div>
        <div style={{ textAlign: "center", padding: "50px", color: "#ef4444" }}>
          <p>Error: {error}</p>
          <button 
            onClick={fetchPosOverview}
            style={{
              marginTop: "16px",
              padding: "8px 16px",
              background: "#1e293b",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="posreportcontainer">
        <h1 className="reporttitle" style={FontStyle}>
          <ReportIcon className="titleicon" /> Report
        </h1>
        <div className="tilteline"></div>

        <div className="posreportbody">
          {headerData.map((item, index) => (
            <div className="posreporttitle" key={index}>
              <p>
                {item.title} {item.icon}
              </p>
              <h3>{item.amount}</h3>
              <h5>
                <TriangleIcon 
                  style={{ 
                    color: item.changeType === "up" ? "green" : "red", 
                    fontSize: "30px",
                    transform: item.changeType === "down" ? "rotate(180deg)" : "none"
                  }} 
                />
                <span>{item.change}</span>
              </h5>
            </div>
          ))}
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
            <input 
              type="month" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Month"
            />
            <input 
              type="month" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Month"
            />
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
              <LineChart data={filteredChartData}>
                <CartesianGrid
                  strokeDasharray="0"
                  vertical={false}
                  stroke="#ccc"
                />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  interval={0}
                />
                <YAxis 
                  tickFormatter={(value) => value.toLocaleString()}
                  domain={yAxisDomain}
                />
                <Tooltip 
                  formatter={(value) => [`${value.toLocaleString()} ks`, "Sales"]}
                  labelFormatter={(label) => `${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#3b82f6" }}
                  activeDot={{ r: 6 }}
                />
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
                                alt="Payment Proof"
                              />
                            </div>
                           </td>
                          <td>
                            <span
                              className={`posreporttable${item.order_status?.toLowerCase()}`}
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
                        colSpan="8"
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