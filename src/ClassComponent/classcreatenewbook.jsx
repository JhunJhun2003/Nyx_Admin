import BackIcon from "@mui/icons-material/ArrowCircleLeftRounded";
import PaymentIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import RemoveIcon from "@mui/icons-material/RemoveShoppingCartRounded";
import RentalIcon from "@mui/icons-material/Inventory2Outlined";
import StadiumIcon from "@mui/icons-material/StadiumOutlined";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useGetOrder, useGetPayment } from "../Api_Call";
import { useGetClassVenue } from "../ClassApi";
import { useNoti } from "../Hooks/alert";
import { Context } from "../Hooks/context";
import ClassEquipmentOrder from "./classequipmentorder";
import { useClassReceipt } from "./ClassReceipt";
import "./classcreatenewbooking.css";

function ClassCreateBooking({ data }) {
  const { classBackColor } = useContext(Context);
  const isDark = classBackColor?.toLowerCase() === "#1a1c1e";

  const [reciept, setreciept] = useState();
  const [amount, setamount] = useState(0);
  const [total, settotal] = useState(0);
  const [cart, setCart] = useState({});

  const [show, setshow] = useState(false);
  const [childdata, setchilddata] = useState([]);
  const [file, setfile] = useState(null);
  const [filetosend, setfiletosend] = useState(null);

  const [payment, setpayment] = useState("Cash");
  const [name, setname] = useState("-------");
  const [number, setnumber] = useState("-------");

  const imgref = useRef();
  const paymentref = useRef();
  const { Payment, GetPayment, Tax, GetTax } = useGetPayment();
  const { GetVenue, Courts } = useGetClassVenue();
  const { Loading, openerror, openloading, opensuccess, close } = useNoti();
  const { GetLocalOrders } = useGetOrder();
  const { open, ClassReceipetJsx } = useClassReceipt();

  const {
    venue_name,
    info,
    date,
    remainbooking,
    targettime,
    settargettime,
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
    let totalamout = Number(amount) + Number(info?.hourly_price || 0);
    settotal(totalamout);
  }, [amount, info]);

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
      let result = Payment.result.find((a) => a.payment_method === payment);
      if (result) {
        setname(result.payment_name || "-----");
        setnumber(result.payment_number || "------");
      }
    }
  }, [Payment.result, payment]);

  function updateQty(id, amt) {
    setCart((prev) => {
      let curqty = prev[id] || 1;
      let newqty = curqty + amt;

      if (newqty <= 0) {
        let updated = { ...prev };
        delete updated[id];
        return updated;
      }
      return { ...prev, [id]: newqty };
    });
  }

  function show_receipet() {
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
    let result = childdata.filter((item) => item.id !== id);
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

  async function add_order() {
    let delta = childdata.map((item) => {
      let qty = cart[item.id] !== undefined ? cart[item.id] : 1;
      return { equipment_id: item.id, quantity: qty };
    });

    let formData = new FormData();

    if (filetosend) {
      formData.append("payment_image", filetosend);
    }
    if (payment !== "Cash") {
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
      openerror("Cannot connect with server");
      console.log(err);
    }
  }

  function paymentchange(event) {
    setpayment(event.target.value);
  }

  return createPortal(
    <div className={`createordermain ${isDark ? "dark-mode" : ""}`}>
      {Loading}
      {ClassReceipetJsx}

      {/* Top Navbar Header */}
      <div className="createordernav">
        <button className="back-nav-btn" onClick={() => setshowCreate(false)}>
          <BackIcon className="back-icon" />
        </button>
        <h3 className="createordertitle">Create New Booking</h3>
      </div>

      <div className="addclassorderbody">
        {/* Left Column (Details, Time Slots, Rental Table) */}
        <div className="addclassorderbody1">
          {/* Receipt Info Box */}
          <div className="createorderreciept">
            <p className="reciept-label">Receipt Number</p>
            <span className="reciept-value">{reciept}</span>
          </div>

          {/* Court & Time Slot Selection */}
          <div className="createorderselect">
            <h3 className="aos1">
              <StadiumIcon className="section-icon" />
              Venue & Court Details
            </h3>

            <div className="aos2">
              <span>
                <h5>SPORT TYPE</h5>
                <p className="ccnb">{venue_name || "---"}</p>
              </span>
              <span>
                <h5>COURT NAME</h5>
                <p className="ccnb">{info?.court_name || "---"}</p>
              </span>
              <span>
                <h5>DATE</h5>
                <p className="ccnb">{date || "---"}</p>
              </span>
            </div>

            <h5 className="timeslottitle">AVAILABLE TIME SLOTS</h5>
            <div className="aos3">
              {Array.isArray(remainbooking.data) ? (
                remainbooking.data.length > 0 ? (
                  remainbooking.data.map((item, idx) => {
                    const slotText = `${item.start_time.slice(0, 5)} - ${item.end_time.slice(0, 5)}`;
                    const isSelected = targettime === slotText;
                    return (
                      <p
                        key={idx}
                        className={`timeslot-badge ${isSelected ? "selected" : ""}`}
                        onClick={() => {
                          settargettimeid(item.id);
                          settargettime(slotText);
                        }}
                      >
                        {slotText}
                      </p>
                    );
                  })
                ) : (
                  <p className="no-slot">No available slots</p>
                )
              ) : (
                <p className="no-slot">Loading slots...</p>
              )}
            </div>
          </div>

          {/* Rental Equipment Section */}
          <div className="addclassorderchoice">
            <div className="createorderchoiceheader">
              <p className="createorderchoiceheader1">
                <RentalIcon className="section-icon" />
                Rental Items
              </p>
              <button
                className="createorderchoiceheader2"
                onClick={() => setshow(true)}
              >
                + Select Equipment
              </button>
            </div>

            <div className="toorder">
              <div className="toorderheader">
                <p>Item Details</p>
                <p>Qty</p>
                <p>Price</p>
              </div>
              <div className="toorderlist">
                {childdata?.length > 0 ? (
                  childdata.map((item, index) => {
                    return (
                      <div className="toorderbody" key={index}>
                        <div className="toorderchild">
                          <p>{item.product_name}</p>
                        </div>
                        <div className="toorderchild1">
                          <button onClick={() => updateQty(item.id, -1)}>
                            -
                          </button>
                          <span>{cart[item.id] || 1}</span>
                          <button onClick={() => updateQty(item.id, 1)}>
                            +
                          </button>
                        </div>
                        <div className="toorderchild2">
                          <p>{item.rental_price * (cart[item.id] || 1)} Ks</p>
                          <button onClick={() => remove_item(item.id)}>
                            <RemoveIcon className="remove-icon" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="empty-cart-text">No Equipment Selected Yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Total & Payment Details) */}
        <div className="addclassorderbody2">
          {/* Total Breakdown */}
          <div className="orderamount">
            <h3>PAYMENT SUMMARY</h3>
            <span>
              <p>Court Fee (1 hour)</p>
              <p>{info?.hourly_price || 0} Ks</p>
            </span>
            <span>
              <p>Rental Items Fee</p>
              <p>{amount} Ks</p>
            </span>
            <div className="total-divider"></div>
            <h2>Total: {total} Ks</h2>
          </div>

          {/* Payment Method & Receipt Upload */}
          <div className="orderprint">
            <div className="orderprint1">
              <p className="orderprintheader">
                <PaymentIcon className="payment-icon" />
                Payment Options
              </p>

              <div className="ssx">
                <label>Payment Method</label>
                <select
                  ref={paymentref}
                  value={payment}
                  onChange={paymentchange}
                >
                  <option value="Cash">Cash</option>
                  {Array.isArray(Payment.result) &&
                    Payment.result.map((item, index) => (
                      <option key={index} value={item.payment_method}>
                        {item.payment_method}
                      </option>
                    ))}
                </select>
              </div>

              {payment !== "Cash" && (
                <div className="paymentmain">
                  <label>Account Details</label>
                  <div className="paymentwarper">
                    <span>
                      <p>{payment} Name</p>
                      <p>{name}</p>
                    </span>
                    <span>
                      <p>{payment} Number</p>
                      <p>{number}</p>
                    </span>
                  </div>
                </div>
              )}

              <div
                className={`createorderreceipet ${payment === "Cash" ? "disabled" : ""}`}
                onClick={() => payment !== "Cash" && imgref.current.click()}
              >
                {file ? (
                  <img src={file} alt="payment receipt" className="receipet" />
                ) : (
                  <>
                    <UploadFileIcon className="upload-icon" />
                    <p>
                      Click to Upload <br /> Receipt Image
                    </p>
                  </>
                )}
                <input
                  type="file"
                  style={{ display: "none" }}
                  ref={imgref}
                  onChange={handleFileChange}
                  disabled={payment === "Cash"}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="createorderbtn">
              <button
                className="cancel-btn"
                onClick={() => setshowCreate(false)}
              >
                Cancel
              </button>
              <button
                className="confirm-btn"
                onClick={add_order}
                disabled={targettime == null}
                style={{ padding: "12px 60px" }}
              >
                Create Booking
              </button>
            </div>
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
