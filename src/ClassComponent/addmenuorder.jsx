import CloseIcon from "@mui/icons-material/CloseOutlined";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import { useEffect, useState } from "react";
import { useGetClassMenu } from "../ClassApi";
import "./addmenuorder.css";
import FoodIcon from "@mui/icons-material/Flatware";

function AddOrderMenu({ data }) {
  const [state, setstate] = useState({});
  const [category, setcategory] = useState("All");
  const [purfiedData, setpurfiedData] = useState(null);

  const { ClassMenu, GetClassmenu } = useGetClassMenu();
  const { fun1, fun2, amount } = data;

  const classcategory = [
    {
      category: "All",
    },
    {
      category: "Snack",
    },
    {
      category: "Meal",
    },
    {
      category: "Drink",
    },
  ];

  useEffect(() => {
    GetClassmenu();
  }, []);

  useEffect(() => {
    if (Array.isArray(ClassMenu.data)) {
      let result = ClassMenu.data.filter((item) => item.available !== "false");

      if (category !== "All" && result.length > 0) {
        result = result.filter((item) => {
          return category.toLowerCase() === item.category_name.toLowerCase();
        });
      }

      setpurfiedData(result);
    }
  }, [category, ClassMenu.data]);

  // add order to the table
  function add_order(item) {
    fun1((prev) => [...prev, item]);
  }
  //function to clickable once
  function click_once(id) {
    setstate((prev) => {
      return { ...prev, [id]: true };
    });
  }

  function categorychange(item) {
    setcategory(item);
  }

  return (
    <div className="addordermenumain">
      <div className="addordermenuheader">
        <h3>Select Menu Item</h3>
        <button onClick={() => fun2(false)}>
          <CloseIcon />
        </button>
      </div>
      <div className="addordermenucategory">
        {classcategory.map((item, index) => {
          return (
            <p
              key={index}
              onClick={() => categorychange(item.category)}
              className={category === item.category ? "active" : ""}
            >
              {item.category}
            </p>
          );
        })}
      </div>
      <div className="addordermenuproduct">
        {Array.isArray(purfiedData) ? (
          purfiedData.length > 0 ? (
            purfiedData.map((item, index) => {
              return (
                <div className="AODsinglemenu" key={index}>
                  <div className="AODimg">
                    <img src={item.image_url} alt={item.name} />
                  </div>
                  <span className="AODtext1">
                    <p>{item.name}</p>
                    <h3>{item.price} ks</h3>
                  </span>
                  <span className="AODtext2">
                    <div>
                      <FoodIcon sx={{ color: "#0d1b2acb" }} />
                      <p>{item.category_name}</p>
                    </div>
                    <button
                      disabled={state[item.id]}
                      onClick={() => {
                        add_order(item);
                        click_once(item.id);
                      }}
                    >
                      + Add Order
                    </button>
                  </span>
                </div>
              );
            })
          ) : (
            <p>No items found</p>
          )
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
      <div className="addordermenufooter">
        <span>
          <h5>Total Amount</h5>
          <h3>{amount}-ks</h3>
        </span>
        <button onClick={() => fun2(false)}>Confirm Order</button>
      </div>
    </div>
  );
}
export default AddOrderMenu;
