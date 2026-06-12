import AssignmentIcon from "@mui/icons-material/AssignmentOutlined";
import DeleteIcon from "@mui/icons-material/DeleteForeverOutlined";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import { useContext, useRef, useState, useEffect } from "react";
import "./cssFolder/posorder.css";
import CloseIcon from "@mui/icons-material/Close";
import { Context } from "./Hooks/context";
import Swal from "sweetalert2";
import TableLoading from "./Components/tableloading";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import toast, { Toaster } from "react-hot-toast";
import CustomerLoading from "./Components/loadingcustomer";
import MobileOrder from "./Routes/mobileorder";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useGetOrder } from "./Api_Call";

function PosOrder() {
  const [show, setshow] = useState(false);
  const [img, setimg] = useState(null);
  const [orderStats, setOrderStats] = useState([
    { title: "Total Order", amount: "0", lastorder: "0" },
    { title: "Total Revenue", amount: "0", lastorder: "0" },
    { title: "Total Product", amount: "0", lastorder: "0" },
    { title: "Total Customer", amount: "0", lastorder: "0" },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const recepitimg = useRef();
  const nameref = useRef();
  const amountref = useRef();
  const paymentref = useRef();

  const navigate = useNavigate();

  const { OrderHeader, GetOrderHeader } = useGetOrder();
  const { backcolor, Token } = useContext(Context);

  const Font_color = Boolean(backcolor == "#1A1C1E");
  const FontStyle = {
    color: Font_color ? "#e1e1e1" : "#0D1B2A",
  };
  const ButtonStyle = {
    color: Font_color ? "#0d1b2a" : "white",
    backgroundColor: Font_color ? "#e1e1e1" : "#0D1B2A",
  };

  // Fetch order statistics from API
  const fetchOrderStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        "http://38.60.216.25:5000/api/order/totalResult"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch order statistics");
      }
      const jsonResult = await response.json();
      
      if (jsonResult.status === "success" && jsonResult.totalResult) {
        const { total_order, total_revenue, total_product, total_customer } = jsonResult.totalResult;
        
        setOrderStats([
          { 
            title: "Total Order", 
            amount: total_order?.toString() || "0", 
            lastorder: "0" 
          },
          { 
            title: "Total Revenue", 
            amount: `${total_revenue?.toLocaleString() || 0} ks`, 
            lastorder: "0" 
          },
          { 
            title: "Total Product", 
            amount: total_product?.toString() || "0", 
            lastorder: "0" 
          },
          { 
            title: "Total Customer", 
            amount: total_customer?.toString() || "0", 
            lastorder: "0" 
          },
        ]);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching order statistics:", err);
      toast.error("Failed to load order statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderStatistics();
  }, []);

  //for img preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setimg(imageUrl);
    }
  };

  //for add order

  if (loading) {
    return (
      <div className="ordermain">
        <Toaster />
        <div className="orderheader" style={FontStyle}>
          <h2>
            <AssignmentIcon />
            Orders
          </h2>
          <button
            className="addorderbutton"
            onClick={() => navigate("posaddorder")}
            style={ButtonStyle}
          >
            <NavLink
              to="posaddorder"
              style={{ color: Font_color ? "#0d1b2a" : "white" }}
            >
              + Add Order
            </NavLink>
          </button>
        </div>
        <div className="orderbody">
          {[1, 2, 3, 4].map((_, index) => (
            <div key={index} className="orderitem" style={{ textAlign: "center" }}>
              <div className="loading-skeleton" style={{ height: "60px", background: "#f3f4f6", borderRadius: "8px" }}></div>
            </div>
          ))}
        </div>
        <div className={Font_color ? "OrderswitchD" : "Orderswitch"}>
          <NavLink to="mobileorder">Mobile Order</NavLink>
          <NavLink to="localorder">Local Order</NavLink>
        </div>
        <div className="posfooter">
          <Outlet />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ordermain">
        <Toaster />
        <div className="orderheader" style={FontStyle}>
          <h2>
            <AssignmentIcon />
            Orders
          </h2>
          <button
            className="addorderbutton"
            onClick={() => navigate("posaddorder")}
            style={ButtonStyle}
          >
            <NavLink
              to="posaddorder"
              style={{ color: Font_color ? "#0d1b2a" : "white" }}
            >
              + Add Order
            </NavLink>
          </button>
        </div>
        <div className="orderbody">
          <div className="orderitem" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px" }}>
            <p style={{ color: "#ef4444" }}>Error: {error}</p>
            <button 
              onClick={fetchOrderStatistics}
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
        <div className={Font_color ? "OrderswitchD" : "Orderswitch"}>
          <NavLink to="mobileorder">Mobile Order</NavLink>
          <NavLink to="localorder">Local Order</NavLink>
        </div>
        <div className="posfooter">
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="ordermain">
        <Toaster />
        <div className="orderheader" style={FontStyle}>
          <h2>
            <AssignmentIcon />
            Orders
          </h2>
          <button
            className="addorderbutton"
            onClick={() => navigate("posaddorder")}
            style={ButtonStyle}
          >
            <NavLink
              to="posaddorder"
              style={{ color: Font_color ? "#0d1b2a" : "white" }}
            >
              + Add Order
            </NavLink>
          </button>
        </div>
        <div className="orderbody">
          {orderStats.map((item, index) => {
            return (
              <div key={index} className="orderitem">
                <p>{item.title}</p>
                <h4>{item.amount}</h4>
              </div>
            );
          })}
        </div>
        <div className={Font_color ? "OrderswitchD" : "Orderswitch"}>
          <NavLink to="mobileorder">Mobile Order</NavLink>
          <NavLink to="localorder">Local Order</NavLink>
        </div>

        <div className="posfooter">
          <Outlet />
        </div>
      </div>
    </>
  );
}
export default PosOrder;