import "../classCss/classmenu.css";
import MenuIcon from "@mui/icons-material/Inventory2Outlined";
import { orderheadingdata } from "../DataExport";
import { useEffect, useState } from "react";
import { useGetClassMenu } from "../ClassApi";
import FoodIcon from "@mui/icons-material/Flatware";
import DotIcon from "@mui/icons-material/FiberManualRecord";
import AddMenuPopUp from "../ClassComponent/AddMenupopup";
import { useNoti } from "../Hooks/alert";

function ClassMenu() {
  const [show, setshow] = useState(false);
  const [info, setinfo] = useState(null);

  const [category, setcategory] = useState("All");
  const [purfiedData, setpurfiedData] = useState(null);

  const { ClassMenu, GetClassmenu } = useGetClassMenu();
  const { Loading, openloading, opensuccess, openerror, openconfirm } =
    useNoti();

  useEffect(() => {
    GetClassmenu();
  }, []);

  useEffect(() => {
    if (Array.isArray(ClassMenu.data)) {
      setpurfiedData(ClassMenu.data);

      if (ClassMenu.data.length > 0) {
        if (category != "All") {
          let filtered = ClassMenu.data.filter((item) => {
            return category.toLowerCase() == item.category_name.toLowerCase();
          });
          setpurfiedData(filtered);
        }
      }
    }
  }, [category, ClassMenu.data]);

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

  //category change
  function categorychange(item) {
    setcategory(item);
  }

  return (
    <div className="classmenumain">
      {Loading}
      {show && (
        <AddMenuPopUp
          data={{
            setshow: setshow,
            info: info,
            setinfo: setinfo,
            updateFun: GetClassmenu,
            openloading: openloading,
            opensuccess: opensuccess,
            openerror: openerror,
            openconfirm: openconfirm,
          }}
        />
      )}
      <h2 className="classmenuheader">
        <MenuIcon />
        Menus
      </h2>
      <div className="classmenuheading">
        {orderheadingdata.map((item, index) => {
          return (
            <div className="classmenuheadchild" key={index}>
              <p>{item.title}</p>
              <span>
                {
                  <item.icon
                    className={`classmenuheadchildicon classmenuheadchild${index}`}
                  />
                }
                <h3>{item.amount}</h3>
              </span>
            </div>
          );
        })}
      </div>
      <div className="classmenubody">
        <div className="classmenubody1">
          {classcategory.map((item, index) => {
            return (
              <p
                key={index}
                onClick={() => categorychange(item.category)}
                className={category == item.category ? "menu_active" : ""}
              >
                {item.category}
              </p>
            );
          })}
        </div>
        <button className="addmenubtn" onClick={() => setshow(true)}>
          + Add Menu
        </button>
      </div>
      <div className="classmenufooter">
        {Array.isArray(purfiedData) ? (
          purfiedData.length > 0 ? (
            purfiedData.map((item, index) => {
              return (
                <div
                  className="singlemenuproduct"
                  key={index}
                  onClick={() => {
                    setshow(true);
                    setinfo(item);
                  }}
                >
                  <div className="menuimg">
                    <img src={item.image_url} />
                  </div>
                  <div className="singlemenutext">
                    <span className="singlemenutext1">
                      <p style={{ color: "#0d1b2ab4", fontWeight: "bold" }}>
                        {item.name}
                      </p>
                      <h3>{item.price} ks</h3>
                    </span>
                    <span className="singlemenutext2">
                      <div className="singlemenutext21">
                        <FoodIcon
                          sx={{
                            color: "#0d1b2ace",
                            fontSize: "25px",
                            borderRadius: "50%",
                          }}
                        />
                        <p style={{ color: "#0d1b2ac2" }}>
                          {item.category_name}
                        </p>
                      </div>
                      <div className="singlemenutext22">
                        <DotIcon
                          sx={{
                            color: item.available == "true" ? "green" : "red",
                            fontSize: "5px",
                            padding: "0px",
                          }}
                        />
                        <p
                          style={{
                            color: item.available == "true" ? "green" : "red",
                          }}
                        >
                          {item.available == "true"
                            ? "Availiable"
                            : "out of stock"}
                        </p>
                      </div>
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <p>no product</p>
          )
        ) : (
          <p>Loaing...</p>
        )}
      </div>
    </div>
  );
}
export default ClassMenu;
