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
import Shoe from "./images/shoe.png";
import { useContext, useEffect } from "react";
import { Context } from "./Hooks/context";
import CustomerLoading from "./Components/loadingcustomer";
import Swal from "sweetalert2";
import { useGetOrder } from "./Api_Call";
import { useTableFooter } from "./Hooks/tablefooter";

function PosOverview() {
  const { backcolor } = useContext(Context);
  const { MOrders, GetMobileOrders } = useGetOrder();
  const Font_color = Boolean(backcolor == "#1A1C1E");
  const FontStyle = {
    color: Font_color ? "#E1E1E1" : "#0D1B2A",
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
  }, []);

  const { TableFooterJsx, startnumber, endnumber } = useTableFooter(
    MOrders?.data,
  );

  let data = [
    { name: "Jan", sales: 3000 },
    { name: "Feb", sales: 4000 },
    { name: "Mar", sales: 5000 },
    { name: "Apr", sales: 6000 },
    { name: "May", sales: 7000 },
    { name: "Jun", sales: 8000 },
  ];

  let headerdata = [
    {
      title: "Total Revenue",
      amount: "60000ks",
      increasement: "11%",
      compare: "from yesterday",
    },
    {
      title: "Total Order",
      amount: "1200",
      increasement: "-3%",
      compare: "from yesterday",
    },
    {
      title: "Total Product",
      amount: "55",
      increasement: "+5",
      compare: "New Products",
    },
    {
      title: "Total Customers",
      amount: "245",
      increasement: "+12",
      compare: "New Customers",
    },
  ];

  return (
    <>
      <div className="posoverviewmain">
        <div className="posheader">
          <h1 style={FontStyle}>Point of Sale Overview Dashboard</h1>
          <p style={FontStyle}>Welcome back.Here's today's shop overview</p>
        </div>
        <div className="posbody">
          {headerdata.map((item, index) => {
            return (
              <div className="posbodyheader" key={index}>
                <p>{item.title}</p>
                <h3>{item.amount}</h3>
                <h5>
                  <span>{item.increasement}</span>
                  {item.compare}
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
          <div className="top">
            <div
              className="topProduct"
              style={{ background: Font_color && "#E1E1E1" }}
            >
              <h2>Popular Product</h2>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginLeft: "1em",
                }}
              >
                <img src={Shoe} alt="Product" />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <p>Adidas Shoe</p>
                  <p>25000ks</p>
                </div>
              </div>
            </div>
            <div
              className="topProduct"
              style={{ background: Font_color && "#E1E1E1" }}
            >
              <h2>Popular Product</h2>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginLeft: "1em",
                }}
              >
                <img src={Shoe} alt="Product" />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <p>Adidas Shoe</p>
                  <p>25000ks</p>
                </div>
              </div>
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
                          colSpan="7"
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
