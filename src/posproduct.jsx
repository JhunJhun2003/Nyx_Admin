import "./cssFolder/posproduct.css";
import ProductIcon from "@mui/icons-material/Inventory2Outlined";
import SearchIcon from "@mui/icons-material/SearchSharp";
import AddIcon from "@mui/icons-material/AddCircleOutlineSharp";
import { useContext, useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useFetcher, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Context } from "./Hooks/context";
import LoadingProduct from "./Components/loadingproduct";
import { useGetCategory, useGetProducts } from "./Api_Call";

function PosProduct() {
  const [fliterdata, setfliterdata] = useState();
  const [text, settext] = useState();
  const [info, setinfo] = useState(null);

  const nagivate = useNavigate();
  const { backcolor } = useContext(Context);

  const Font_color = Boolean(backcolor == "#1A1C1E");
  const FontStyle = {
    color: Font_color ? "#E1E1E1" : "#0D1B2A",
  };
  const InputStyle = {
    backgroundColor: Font_color ? "#E1E1E1" : "#0D1B2A",
  };

  const { Products, GetProducts } = useGetProducts();

  useEffect(() => {
    GetProducts();
  }, []);

  useEffect(() => {
    setfliterdata(Products.data);
  }, [Products.data]);

  function searchHandler(e) {
    let textvalue = e.target.value;
    settext(textvalue);
    if (textvalue === "") {
      setfliterdata(Products.data);
    } else {
      if (Array.isArray(Products.data) && Products.data.length > 0) {
        let result = Products.data.filter((item) => {
          return item.productName
            .toLowerCase()
            .trim()
            .includes(textvalue.toLowerCase());
        });
        setfliterdata(result);
      }
    }
  }
  function handleupdate(data) {
    setinfo(data);
    nagivate("posaddproduct");
  }

  return (
    <>
      <div className="posproductmain">
        <div className="productheader">
          <h1 style={FontStyle}>
            <ProductIcon />
            Products
          </h1>
          <div className="productsearch" style={InputStyle}>
            <input
              type="search"
              placeholder="Search..."
              value={text}
              onChange={searchHandler}
              style={{ color: Font_color ? "#0D1B2A" : "#E1E1E1" }}
            />
            <SearchIcon />
          </div>
          <button onClick={() => nagivate("posaddproduct")}>
            <AddIcon /> Add Product
          </button>
        </div>

        {/*for Add Product*/}

        <div className="productbody">
          {Array.isArray(fliterdata) ? (
            fliterdata.length > 0 ? (
              fliterdata.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="singleproduct"
                    onClick={() => {
                      handleupdate(item);
                    }}
                  >
                    <div className="productimgcontainer">
                      <img src={item.images} alt={item.name} />
                    </div>
                    <div className="producttext">
                      <h3>{item.productName}</h3>
                      <h4
                        style={{
                          fontFamily: "Inter",
                          fontWeight: 300,
                        }}
                      >
                        {item.price} MMK
                      </h4>
                      {item.status == "isAvailable" ? (
                        <p style={{ backgroundColor: "#16F90E" }}>Avaliable</p>
                      ) : (
                        <p
                          style={{ backgroundColor: "#FF0302", width: "100px" }}
                        >
                          Out of Stocks
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  border: "1px solid black",
                  borderRadius: "5px",
                  padding: "10px",
                }}
              >
                <p>No Product.....</p>
              </div>
            )
          ) : (
            [...Array(15)].map((_, index) => <LoadingProduct key={index} />)
          )}
        </div>
        <Outlet context={{ info, setinfo, GetProducts }} />
      </div>
    </>
  );
}
export default PosProduct;
