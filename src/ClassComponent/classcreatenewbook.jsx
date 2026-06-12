import CustomerLoading from "../Components/loadingcustomer";
import BackIcon from "@mui/icons-material/ArrowCircleLeftRounded";
import FoodIcon from "@mui/icons-material/LocalDiningRounded";
import "./classcreatenewbooking.css";
import { useContext, useEffect, useRef, useState } from "react";
import AddorderProduct from "../Components/addorderproudct";
import PaymentIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import RentalIcon from "@mui/icons-material/Inventory2Outlined";
import RemoveIcon from "@mui/icons-material/RemoveShoppingCartRounded";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import toast, { Toaster } from "react-hot-toast";
import { createPortal } from "react-dom";
import { Context } from "../Hooks/context";
import { useNavigate } from "react-router-dom";
import { useGetOrder, useGetPayment } from "../Api_Call";
import StadiumIcon from "@mui/icons-material/StadiumOutlined";
import { useGetClassVenue } from "../ClassApi";
import { useNoti } from "../Hooks/alert";
import ClassEquipmentOrder from "./classequipmentorder";
import { useClassReceipt } from "./ClassReceipt";

function ClassCreateBooking({ data }) {
  const [reciept, setreciept] = useState();
  const [amount, setamount] = useState(0);
  const [total, settotal] = useState(0);
  const [cart, setCart] = useState({});

  const [show, setshow] = useState(false);
  const [childdata, setchilddata] = useState([]);
  const [file, setfile] = useState(null);
  const [filetosend, setfiletosend] = useState(null);
  const [allow, setallow] = useState(true);

  const [payment, setpayment] = useState("Cash");
  const [name, setname] = useState("-------");
  const [number, setnumber] = useState("-------");

  //for select box
  const [index, setindex] = useState(0);

  const imgref = useRef();
  const paymentref = useRef();
  const { Token } = useContext(Context);
  const { Payment, Products, GetPayment, Tax, GetTax } = useGetPayment();
  const { GetVenue, Venue, GetCourts } = useGetClassVenue();
  const { Loading, openerror, openloading, opensuccess, close } = useNoti();
  const { GetLocalOrders } = useGetOrder();
  const { open, ClassReceipetJsx } = useClassReceipt();
  const navigate = useNavigate();

  const {
    venue_name,
    info,
    date,
    remainbooking,
    targettime,
    settargettime,
    Courts,
    venue_id,
    targettimeid,
    settargettimeid,
    setshowCreate,
    GetRemainBooking,
  } = data;

  useEffect(() => {
    GetVenue();
    GetPayment();
    GetTax();
  }, []);

  useEffect(() => {
    let totalamout = Number(amount) + Number(info?.hourly_price);
    settotal(totalamout);
  }, [amount, info]);

  useEffect(() => {
    if (childdata.length > 0 && filetosend) {
      setallow(false);
    } else {
      setallow(true);
    }
  }, [childdata, filetosend]);

  // function to get radom recepit number
  function randomNum() {
    let random = Date.now();
    setreciept(random);
  }
  useEffect(() => {
    randomNum();
  }, [childdata]);

  useEffect(() => {
    if (childdata.length > 0) {
      let totalprice = childdata.reduce((total, item) => {
        let qty = cart[item.id] !== undefined ? cart[item.id] : 1;
        return total + item.rental_price * qty;
      }, 0);
      setamount(totalprice);
    } else setamount(0);
  }, [childdata, cart]);

  useEffect(() => {
    if (Array.isArray(Payment.result) && Payment.result.length > 0) {
      let result = Payment.result.find((a) => a.payment_method == payment);
      if (result) {
        setname(result.payment_name || "-----");
        setnumber(result.payment_number || "------");
      }
    }
  }, [Payment.result, payment]);

  function updateQty(id, amount) {
    setCart((prev) => {
      let curqty = prev[id] || 1;
      let newqty = curqty + amount;

      if (newqty <= 0) {
        let newqty = { ...prev };
        delete newqty[id];
        return newqty;
      }
      return { ...prev, [id]: newqty };
    });
  }

  //function to show receipet
  function show_receipet() {
    let TAX = Tax.result[0].tax || 1;
    let curtax = (amount / 100) * Number(TAX);
    let newchildData = childdata.map((item) => {
      let qty = cart[item.id] !== undefined ? cart[item.id] : 1;
      return {
        ...item,
        quantity: qty,
      };
    });

    open({
      order_no: reciept,
      payment: paymentref.current.value,
      Date: new Date().toLocaleDateString(),
      Time: new Date().toLocaleTimeString(),
      court_fee: info?.hourly_price,
      rental_fee: amount,
      total_amount: total,
    });
  }

  function remove_item(id) {
    let result = childdata.filter((item) => {
      return item.id != id;
    });
    setchilddata(result);
  }

  const handleFileChange = (event) => {
    const selected_file = event.target.files[0];
    setfiletosend(selected_file);
    if (selected_file) {
      const url = URL.createObjectURL(selected_file);
      setfile(url);
    }
  };

  //function to add order
  async function add_order() {
    let delta = childdata.map((item) => {
      let qty = cart[item.id] !== undefined ? cart[item.id] : 1;
      return { equipment_id: item.id, quantity: qty };
    });

    let formData = new FormData();

    if (filetosend) {
      formData.append("payment_image", filetosend);
    }
    if (payment != "Cash") {
      formData.append("payment_method", payment);
    }
    formData.append("venue_id", venue_id);
    formData.append("court_id", info?.id);

    formData.append("date", date);
    formData.append("court_time_slot_ids", JSON.stringify([targettimeid]));
    formData.append("reciept_no", reciept);
    formData.append("department", "equipment");
    if (childdata.length > 0) {
      formData.append("items", JSON.stringify(delta));
    }
    console.log(Object.fromEntries(formData));
    try {
      openloading();
      let response = await fetch(import.meta.env.VITE_CLASS_ADD_LOCAL_BOOKING, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        await GetLocalOrders();
        opensuccess("Action Successful", "Booking added successfully");
        GetRemainBooking(info?.id, date);
        settargettime(null);
        show_receipet();
        setchilddata([]);
        setfiletosend(null);
        setfile(null);
        setCart({});
      } else {
        openerror("Something went wrong");
      }
    } catch (err) {
      openerror("Cannot connect with sever");
      console.log(err);
    }
  }

  //payment change
  function paymentchange(event) {
    setpayment(event.target.value);
  }

  //index change
  function timeslotchange(event) {
    setindex(event.target.value);
  }

  //court change
  async function courtchange(event) {
    openloading();
    try {
      await GetCourts(event.target.value);
      close();
    } catch (err) {
      close();
      console.log(err);
    }
  }
  return createPortal(
    <div className="createordermain">
      {Loading}
      {ClassReceipetJsx}
      <div className="createordernav">
        <button
          style={{ border: "none", outline: "none", background: "initial" }}
          onClick={() => setshowCreate(false)}
        >
          <BackIcon
            sx={{ color: "white", margin: "7px", marginLeft: "15px" }}
          />
        </button>
      </div>
      <h3 className="createordertitle">Create New Booking</h3>

      <div className="addclassorderbody">
        <div className="addclassorderbody1">
          <div className="createorderreciept">
            <p>Receipt No</p>
            <span>{reciept}</span>
          </div>
          <div className="createorderselect">
            <h3 className="aos1">
              {" "}
              <StadiumIcon sx={{ fontSize: "20px" }} />
              Select Venue/Court
            </h3>

            <div className="aos2">
              <span>
                <h5>SPORT TYPE</h5>
                <p className="ccnb">{venue_name}</p>
              </span>
              <span>
                <h5>COURT NAME</h5>
                <p className="ccnb">{info?.court_name}</p>
              </span>
              <span>
                <h5>DATE</h5>
                <p className="ccnb">{date}</p>
              </span>
            </div>
            <h5 className="timeslottitle">TIME SLOT</h5>
            <div className="aos3">
              {Array.isArray(remainbooking.data) ? (
                remainbooking.data.length > 0 ? (
                  remainbooking.data.map((item, index) => {
                    return (
                      <p
                        key={index}
                        style={{
                          background:
                            targettime ==
                            `${item.start_time.slice(0, 5)}-${item.end_time.slice(0, 5)}`
                              ? "#1B263B"
                              : " initial",
                          color:
                            targettime ==
                            `${item.start_time.slice(0, 5)}-${item.end_time.slice(0, 5)}`
                              ? "white"
                              : "initial",
                        }}
                        onClick={() => {
                          settargettimeid(item.id);
                          settargettime(
                            `${item.start_time.slice(0, 5)}-${item.end_time.slice(0, 5)}`,
                          );
                        }}
                      >
                        {item.start_time.slice(0, 5)} -{" "}
                        {item.end_time.slice(0, 5)}
                      </p>
                    );
                  })
                ) : (
                  <p disabled>no data</p>
                )
              ) : (
                <p disabled>Loading...</p>
              )}
            </div>
          </div>
          <div className="addclassorderchoice">
            <span className="createorderchoiceheader">
              <p className="createorderchoiceheader1">
                <RentalIcon sx={{ strokeWidth: 1, fontSize: "20px" }} />
                Rental Items
              </p>
              <button
                className="createorderchoiceheader2"
                onClick={() => setshow(true)}
              >
                + select items form Equipment
              </button>
            </span>

            <div className="toorder">
              <div className="toorderheader">
                <p>Item Details</p>
                <p>Qty</p>
                <p>Price</p>
              </div>
              {childdata?.length > 0 ? (
                childdata.map((item, index) => {
                  return (
                    <div className="toorderbody" key={index}>
                      <span className="toorderchild">
                        <p>{item.product_name}</p>
                      </span>
                      <span className="toorderchild1">
                        <button onClick={() => updateQty(item.id, -1)}>
                          -
                        </button>
                        <p>{cart[item.id] || 1}</p>
                        <button onClick={() => updateQty(item.id, 1)}>+</button>
                      </span>
                      <p className="toorderchild2">
                        {item.rental_price} Ks
                        <button onClick={() => remove_item(item.id)}>
                          <RemoveIcon sx={{ fontSize: "20px" }} />
                        </button>
                      </p>
                    </div>
                  );
                })
              ) : (
                <p
                  style={{ width: "100%", textAlign: "center", padding: "1em" }}
                >
                  No Product Choose Yet...
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="addclassorderbody2">
          <div className="orderamount">
            <h3>TOTAL AMOUNT</h3>
            <span>
              <p>Court Fee(1 hour)</p>
              <p>{info?.hourly_price}-KS</p>
            </span>
            <span>
              <p>Rental Fees</p>
              <p>{amount}-KS</p>
            </span>
            <h2>{total}-KS</h2>
          </div>
          <div className="orderprint">
            <div className="orderprint1">
              <p className="orderprintheader">
                <PaymentIcon sx={{ color: "red" }} />
                Payment Details
              </p>
              <div className="ssx">
                <label htmlFor="input">Payment Method</label>
                <select ref={paymentref} onChange={paymentchange}>
                  <option value="Cash">Cash</option>
                  {Array.isArray(Payment.result) &&
                  Payment.result.length > 0 ? (
                    Payment.result.map((item, index) => {
                      return (
                        <option key={index} value={item.payment_method}>
                          {item.payment_method}
                        </option>
                      );
                    })
                  ) : (
                    <option value="no data" disabled>
                      No Data....
                    </option>
                  )}
                </select>
              </div>
              <span className="paymentmain">
                <label style={{ padding: "5px" }}>Payment Details</label>
                <div className="paymentwarper">
                  <span>
                    <p>{payment == "Cash" ? "--------" : `${payment} name`}</p>
                    <p>{payment == "Cash" ? "----------" : name}</p>
                  </span>
                  <span>
                    <p>
                      {payment == "Cash" ? "---------" : `${payment} number`}
                    </p>
                    <p>{payment == "Cash" ? "----------" : number}</p>
                  </span>
                </div>
              </span>
              <div
                className="createorderreceipet"
                onClick={() => imgref.current.click()}
              >
                {file ? (
                  <img src={file} alt="paymentrecepit" className="receipet" />
                ) : (
                  <>
                    <UploadFileIcon />
                    <p>
                      Click to Upload <br />
                      receipet
                    </p>
                  </>
                )}
                <input
                  type="file"
                  style={{ display: "none" }}
                  ref={imgref}
                  onChange={handleFileChange}
                  disabled={payment == "Cash"}
                />
              </div>
            </div>
            <span className="createorderbtn">
              <button onClick={() => setshowCreate(false)}>cancel</button>
              <button
                style={{ background: "#0D1B2A", color: "white" }}
                onClick={add_order}
                disabled={targettime == null}
              >
                Create
              </button>
            </span>
          </div>
        </div>
      </div>
      {show && (
        <ClassEquipmentOrder
          data={{
            fun1: setchilddata,
            fun2: setshow,
            amount: amount,
            equipment: Courts.data?.[0]?.equipment,
          }}
        />
      )}
    </div>,
    document.body,
  );
}
export default ClassCreateBooking;
