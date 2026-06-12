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
import DollarIcon from "@mui/icons-material/Paid";
import ProductIcon from "@mui/icons-material/Widgets";
import CustomerIcon from "@mui/icons-material/Groups";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import Shoe from "./images/shoe.png";
import { useContext, useEffect, useState } from "react";
import { Context } from "./Hooks/context";
import CustomerLoading from "./Components/loadingcustomer";
import Swal from "sweetalert2";
import { useGetOrder } from "./Api_Call";
import { useTableFooter } from "./Hooks/tablefooter";

function PosOverview() {
  const { backcolor } = useContext(Context);
  const { MOrders, GetMobileOrders } = useGetOrder();
  const [overviewData, setOverviewData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [popularProduct, setPopularProduct] = useState(null);
  const [topCustomer, setTopCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const Font_color = Boolean(backcolor == "#1A1C1E");
  const FontStyle = {
    color: Font_color ? "#E1E1E1" : "#0D1B2A",
  };

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
        
        // Set popular product data
        if (jsonResult.popular_product_data) {
          setPopularProduct(jsonResult.popular_product_data);
        }
        
        // Set top customer data
        if (jsonResult.top_customer_data) {
          setTopCustomer(jsonResult.top_customer_data);
        }
      } else {
        throw new Error("No data found");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching POS overview:", err);
      // Set all months with zero values as fallback
      setChartData(allMonths);
    } finally {
      setLoading(false);
    }
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

  useEffect(() => {
    GetMobileOrders();
    fetchPosOverview();
  }, []);

  const { TableFooterJsx, startnumber, endnumber } = useTableFooter(
    MOrders?.data,
  );

  // Header data from API
  const headerdata = overviewData ? [
    {
      title: "Total Revenue",
      amount: `${overviewData.total_revenue?.toLocaleString() || 0} ks`,
      icon: <DollarIcon style={{ fontSize: "24px", color: "#10b981" }} />
    },
    {
      title: "Total Order",
      amount: overviewData.total_order?.toString() || "0",
      icon: <ShoppingBagIcon style={{ fontSize: "24px", color: "#3b82f6" }} />
    },
    {
      title: "Total Product",
      amount: overviewData.total_products?.toString() || "0",
      icon: <ProductIcon style={{ fontSize: "24px", color: "#ec4899" }} />
    },
    {
      title: "Total Customers",
      amount: overviewData.total_customer?.toString() || "0",
      icon: <CustomerIcon style={{ fontSize: "24px", color: "#8b5cf6" }} />
    },
  ] : [];

  // Find max sales for Y-axis domain
  const maxSales = Math.max(...chartData.map(d => d.sales), 0);
  const yAxisDomain = [0, Math.ceil(maxSales * 1.1)]; // Add 10% padding

  if (loading) {
    return (
      <div className="posoverviewmain">
        <div className="posheader">
          <h1 style={FontStyle}>Point of Sale Overview Dashboard</h1>
          <p style={FontStyle}>Welcome back. Here's today's shop overview</p>
        </div>
        <div style={{ textAlign: "center", padding: "50px" }}>
          <div className="spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="posoverviewmain">
        <div className="posheader">
          <h1 style={FontStyle}>Point of Sale Overview Dashboard</h1>
          <p style={FontStyle}>Welcome back. Here's today's shop overview</p>
        </div>
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
      <div className="posoverviewmain">
        <div className="posheader">
          <h1 style={FontStyle}>Point of Sale Overview Dashboard</h1>
          <p style={FontStyle}>Welcome back. Here's today's shop overview</p>
        </div>
        
        <div className="posbody">
          {headerdata.map((item, index) => {
            return (
              <div className="posbodyheader" key={index}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                  <p>{item.title}</p>
                  {item.icon}
                </div>
                <h3>{item.amount}</h3>
                <h5>
                  <span></span>
                </h5>
              </div>
            );
          })}
        </div>
        
        <div className="posbody2">
          <div className="poschart">
            <h2>Sale Statistics</h2>
            <div style={{ width: "100%", height: "270px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
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
                    connectNulls={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="top">
            {/* Popular Product Section */}
            <div
              className="topProduct"
              style={{ background: Font_color && "#E1E1E1" }}
            >
              <h2>Popular Product</h2>
              {popularProduct ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginLeft: "1em",
                  }}
                >
                  <img 
                    src={popularProduct.popular_product_image || Shoe} 
                    alt="Popular Product" 
                    style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }}
                    onError={(e) => {
                      e.target.src = Shoe;
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <p style={{ fontWeight: 600, margin: 0 }}>
                      {popularProduct.popular_product_name || "No product"}
                    </p>
                    <p style={{ color: "#10b981", fontWeight: 600, margin: 0 }}>
                      {popularProduct.popular_product_price?.toLocaleString() || "0"} ks
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "20px", color: "#9ca3af" }}>
                  No popular product data
                </div>
              )}
            </div>

            {/* Top Customer Section */}
            <div
              className="topProduct"
              style={{ background: Font_color && "#E1E1E1" }}
            >
              <h2>Top Customer</h2>
              {topCustomer ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginLeft: "1em",
                  }}
                >
                  <img 
                    src={topCustomer.top_customer_image || "https://via.placeholder.com/60"} 
                    alt="Top Customer" 
                    style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "50%" }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/60";
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <p style={{ fontWeight: 600, margin: 0 }}>
                      {topCustomer.top_customer_name || "No customer"}
                    </p>
                    {topCustomer.top_customer_address && (
                      <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
                        {topCustomer.top_customer_address}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "20px", color: "#9ca3af" }}>
                  No top customer data
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="posfooter1">
          <h2>Recent Order</h2>
          <div className="towarpthetable">
            <div className="postablewarper">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
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
                  {Array.isArray(MOrders.data) ? (
                    MOrders.data.length > 0 ? (
                      MOrders.data
                        ?.slice(startnumber, endnumber)
                        .map((item, index) => {
                          return (
                            <tr key={index} className="posoverviewtr">
                              <td>{item.order_id}</td>
                              <td className="customername">
                                {item.customer_name}
                              </td>
                              <td>{item.Total}</td>
                              <td style={{ color: "#6a7d95" }}>{item.Date}</td>
                              <td>{item.Time}</td>
                              <td>{item.payment_method}</td>
                              <td className="imgcontainer">
                                <img
                                  src={item.payment_proof}
                                  className="posorderimg"
                                  onClick={() =>
                                    showImagePreview(item.payment_proof)
                                  }
                                  alt="Payment Proof"
                                />
                              </td>
                              <td>
                                <span
                                  className={`status-badge ${item.order_status.toLowerCase()}`}
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
                          style={{
                            textAlign: "center",
                            padding: "20px",
                            borderTop: "1px solid #0f0e0e4f",
                            borderBottom: "1px solid #0f0e0e4f",
                            marginTop: "3px",
                          }}
                        >
                          No data
                        </td>
                      </tr>
                    )
                  ) : (
                    [...Array(10)].map((_, index) => {
                      return <CustomerLoading times={8} key={index} />;
                    })
                  )}
                  <tr>
                    <td colSpan={8}></td>
                  </tr>
                </tbody>
              </table>
            </div>
            {TableFooterJsx}
          </div>
        </div>
      </div>
    </>
  );
}

export default PosOverview;