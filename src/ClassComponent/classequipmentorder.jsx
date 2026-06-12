import "./classequipmentorder.css";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import { useEffect, useState } from "react";
import PLO from "../Components/PLO.jsx";
import { useGetCategory, useGetProducts } from "../Api_Call";

function ClassEquipmentOrder({ data }) {
  const [fliterdata, setfliterdata] = useState();
  const [text, settext] = useState();
  const [category, setcategory] = useState("All");
  const [state, setstate] = useState({});

  const { fun1, fun2, amount, equipment } = data;

  useEffect(() => {
    if (Array.isArray(equipment)) {
      let purifiedData = equipment.filter((item) => {
        return item.qty_total > 0;
      });
      let result = purifiedData;
      if (text && text != undefined) {
        result = purifiedData.filter((item) => {
          return item.product_name.toLowerCase().includes(text.toLowerCase());
        });
      }
      setfliterdata(result);
    }
  }, [text, equipment]);

  function searchHandler(e) {
    let textvalue = e.target.value;
    settext(textvalue);
  }

  // add order to the table
  function add_order(item) {
    fun1((prev) => [...prev, item]);
  }

  //function to clickable once
  function click_once(id) {
    setstate((prev) => ({ ...prev, [id]: true }));
  }

  return (
    <div className="addorderproductmain">
      <button className="Aptcloseicon" onClick={() => fun2(false)}>
        <CloseIcon />
      </button>
      <div className="Adpheader">
        <h2>Select Product Items</h2>
        <span>
          <input
            type="search"
            placeholder="Search..."
            onChange={searchHandler}
          />
          <SearchIcon sx={{ color: "white" }} />
        </span>
      </div>

      <div className="Adpproduct">
        {Array.isArray(fliterdata) && fliterdata.length > 0 ? (
          fliterdata.map((item, index) => {
            return (
              <div className="addequipment" key={index}>
                <p>Available</p>
                <h3>{item.product_name}</h3>
                <span>
                  <h4>{item.rental_price} Ks/hr</h4>
                  <button
                    disabled={state[item.id]}
                    onClick={() => {
                      add_order(item);
                      click_once(item.id);
                    }}
                  >
                    + Add
                  </button>
                </span>
              </div>
            );
          })
        ) : (
          <h1>No Product</h1>
        )}
      </div>
      <div className="Adpfooter">
        <span style={{ borderRight: "1px solid gray", padding: "2px 2em" }}>
          <h5>Total Amount</h5>
          <h3>{amount}-ks</h3>
        </span>
        <button onClick={() => fun2(false)}>Confirm Order</button>
      </div>
    </div>
  );
}
export default ClassEquipmentOrder;
