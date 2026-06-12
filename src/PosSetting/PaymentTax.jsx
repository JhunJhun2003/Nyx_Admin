import "../PosSettingCss/paymenttax.css";
import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../Hooks/context";
import AddCircle from "@mui/icons-material/AddCircleOutlineTwoTone";
import { useSecurityCheck } from "../Hooks/SecurityCheck";
import AddPaymentPopUp from "../Components/addpaymentpopup";
import toast, { Toaster } from "react-hot-toast";
import { useGetPayment } from "../Api_Call";

function PosPaymentTax() {
  const [show, setshow] = useState(false);
  const [items, setitems] = useState(null);

  const taxref = useRef();

  const { Payment, GetPayment, Tax, GetTax } = useGetPayment();
  const { ReturnJsx, openbox } = useSecurityCheck();
  const { backcolor, Token } = useContext(Context);
  const Font_Color = Boolean(backcolor == "#1A1C1E");
  const FontStyle = {
    color: Font_Color ? "white" : "#0D1B2A",
  };
  const InputStyle = {
    backgroundColor: backcolor ? "#FFFFFF" : "#0d1b2a21",
    color: backcolor ? "black" : "white",
  };

  useEffect(() => {
    GetPayment();
    GetTax();
  }, []);

  // tax update authorization
  function update_confirm_tax(id) {
    if (taxref.current.value == Tax.result[0].id)
      return console.log("function return p");
    openbox(() => update_tax(id));
  }

  async function update_tax(id) {
    if (taxref.current.value == Tax.result[0].id)
      return console.log("function return p");
    const updating = toast.loading("Please wait...");
    if (taxref.current.value == "") return console.log("data ma par par");
    try {
      let response = await fetch(`${import.meta.env.VITE_UPDATE_TAX}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
        body: JSON.stringify({ tax: taxref.current.value }),
      });
      if (response.ok) {
        await GetTax();
        toast.success("successfully updated", { id: updating });
      } else {
        toast.error("update failed", { id: updating });
      }
    } catch (err) {
      console.log(err);
      toast.error("Cannot connect with sever", { id: updating });
    }
  }

  return (
    <div
      className="pospaymentwarper"
      style={{ border: Font_Color && "1px solid white" }}
    >
      <Toaster />
      {ReturnJsx}
      <div className="pospaymentchild2">
        <div>
          <p style={FontStyle}>Tax Percentage( % )</p>
          {Array.isArray(Tax.result) && Tax.result.length > 0 ? (
            Tax.result.map((item, index) => {
              return (
                <input
                  ref={taxref}
                  type="number"
                  key={index}
                  defaultValue={item.tax}
                  style={InputStyle}
                />
              );
            })
          ) : (
            <input type="text" value="loading.." readOnly style={InputStyle} />
          )}
        </div>
        <div>
          <p style={FontStyle}>Currency</p>
          <input type="text" value="MMK" readOnly style={InputStyle} />
        </div>
      </div>
      <h3 className="pospaymentmethod" style={FontStyle}>
        Payment Method
      </h3>
      <div className="pospaymentbody">
        {Array.isArray(Payment.result) && Payment.result.length > 0 ? (
          Payment.result.map((item, index) => {
            return (
              <div
                className="poscurrency"
                key={index}
                onClick={() => {
                  setitems(item);
                  setshow(true);
                }}
              >
                <span className="poscurrecytext">
                  <p>{item.payment_method}</p>
                  <p>{item.payment_name}</p>
                  <p>{item.payment_number}</p>
                </span>
                <img src={item.payment_image_url} alt="paymentlogo" />
              </div>
            );
          })
        ) : (
          <div className="poscurrency">loading....</div>
        )}

        <div className="paymentaddbtn" onClick={() => setshow(true)}>
          <AddCircle style={{ width: "50px", height: "50px" }} />
          <p>Add Payment Method</p>
        </div>
      </div>
      <div className="pospaymentbutton">
        <button>cancel</button>
        <button
          style={{ background: "#0D1B2A", color: "white" }}
          onClick={() => {
            update_confirm_tax(Tax.result[0].id || 1);
          }}
        >
          Save Changes
        </button>
      </div>
      {show && (
        <AddPaymentPopUp
          data={setshow}
          updfun={GetPayment}
          FTS={openbox}
          items={items}
          setitems={setitems}
        /> /*FTS stand for function to open Security check*/
      )}
    </div>
  );
}
export default PosPaymentTax;
