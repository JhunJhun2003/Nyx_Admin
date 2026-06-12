import AssignmentIcon from "@mui/icons-material/AssignmentOutlined";
import DeleteIcon from "@mui/icons-material/DeleteForeverOutlined";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import { useContext, useRef, useState } from "react";
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

  let data = [
    { title: "Total Order", amount: "1200", lastorder: "1133" },
    { title: "Total Pending", amount: "95", lastorder: "83" },
    { title: "Total Completed", amount: "1200", lastorder: "1133" },
    { title: "Total Cancel", amount: "120", lastorder: "111" },
  ];

  //for img preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setimg(imageUrl);
    }
  };

  //for add order

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
          {data.map((item, index) => {
            return (
              <div key={index} className="orderitem">
                <p>{item.title}</p>
                <h4>{item.amount}</h4>
                <p>Yesterday {item.lastorder}</p>
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
