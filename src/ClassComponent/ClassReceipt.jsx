import { useRef, useState } from "react";
import "./classreceipt.css";
import { createPortal } from "react-dom";
import CheckIcon from "@mui/icons-material/CheckBox";
import SaveIcon from "@mui/icons-material/SaveAlt";
import html2canvas from "html2canvas";
import { useReactToPrint } from "react-to-print";

export const useClassReceipt = () => {
  const [show, setshow] = useState(false);
  const [info, setinfo] = useState(null);

  const imgref = useRef();

  const open = (receiptinfo) => {
    setinfo(receiptinfo);
    setshow(true);
  };
  const close = () => {
    setshow(false);
    setinfo(null);
  };

  const print = useReactToPrint({
    contentRef: imgref,
    documentTitle: `Receipt_${info?.order_no}` || `reciept${Date.now()}`,
  });

  const download = async () => {
    if (imgref.current) {
      const canvas = await html2canvas(imgref.current, {
        backgroundColor: "#1a222c",
        scale: 2,
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `receipet${Date.now()}.png`;
      link.click();
    }
  };
  const ClassReceipetJsx = show
    ? createPortal(
        <div className="receipetwarper">
          <div className="rccmain">
            <div className="rcbody" ref={imgref}>
              <div className="rc1">
                <h3>
                  <CheckIcon />
                  Order Placed Successfully
                </h3>
                <p>Thank you for shopping with us</p>
              </div>
              <div className="rc2">
                <div className="rc21" style={{ width: "50%" }}>
                  <span>
                    <h3>Registration id:</h3>
                    <p>#{info?.order_no || "00000"}</p>
                  </span>
                  <span>
                    <h3>Payment:</h3>
                    <p>{info?.payment || "Cash"}</p>
                  </span>
                </div>
                <div className="rc21">
                  <span>
                    <h3>Date:</h3>
                    <p>{info?.Date || new Date().toLocaleDateString()}</p>
                  </span>
                  <span>
                    <h3>Time:</h3>
                    <p>{info?.Time || new Date().toLocaleTimeString()}</p>
                  </span>
                </div>
              </div>
              <hr />
              <div className="rcc3">
                <span className="rcc31">
                  <h3>Court Fee</h3>
                  <h3>Rental Fee</h3>
                </span>
                <span className="rcc31">
                  <h3>{info ? info.court_fee : "---------"} ks</h3>
                  <h3>{info ? info.rental_fee : "---------"} ks</h3>
                </span>
              </div>
              <hr />
              <div className="rc4">
                <span className="rc41">
                  <h3>Total Amount:</h3>
                  <h3>Discount(%):</h3>
                </span>
                <span className="rc42">
                  <h3>{info ? info.total_amount : "---------"} KS</h3>
                  <h3>{info?.discount || 0} ks</h3>
                </span>
              </div>
              <hr />
              <div className="rc5">
                <h3>Total</h3>
                <h3>{info ? info.total_amount : "--------"} ks</h3>
              </div>
            </div>
            <div className="rc6">
              <button onClick={() => download()} className="downloadbtn">
                <SaveIcon />
              </button>
              <button onClick={() => print()}>Print</button>
              <button onClick={() => close()}>Cancel</button>
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;
  return { open, ClassReceipetJsx };
};
