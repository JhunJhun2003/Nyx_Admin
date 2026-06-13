import "../classCss/classmenu.css";
import MenuIcon from "@mui/icons-material/Inventory2Outlined";
import { orderheadingdata } from "../DataExport";
import { useEffect, useState } from "react";
import { useGetClassMenu } from "../ClassApi";
import FoodIcon from "@mui/icons-material/Flatware";
import DotIcon from "@mui/icons-material/FiberManualRecord";
import AddMenuPopUp from "../ClassComponent/AddMenupopup";
import { useNoti } from "../Hooks/alert";
import { Restaurant, MonetizationOn, CalendarToday } from "@mui/icons-material";

const StatCard = ({ title, value, change, icon, iconColor, isCurrent }) => (
  <div
    style={{
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "20px 24px",
      flex: 1,
      minWidth: 0,
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "8px",
      }}
    >
      <span style={{ fontSize: "13px", color: "#6b7280", fontWeight: 500 }}>
        {title}
      </span>
      {isCurrent ? (
        <span
          style={{
            fontSize: "12px",
            color: "#6b7280",
            background: "#f3f4f6",
            padding: "2px 8px",
            borderRadius: "4px",
          }}
        >
          Today
        </span>
      ) : (
        <span style={{ fontSize: "20px", color: iconColor || "#3b82f6" }}>
          {icon}
        </span>
      )}
    </div>
    <div
      style={{
        fontSize: "22px",
        fontWeight: 700,
        color: "#111827",
        marginBottom: "6px",
      }}
    >
      {value}
    </div>
    <div
      style={{
        fontSize: "12px",
        color: change.includes("-") ? "#ef4444" : "#16a34a",
        fontWeight: 500,
      }}
    >
      {change.includes("vs") || change.includes("-") || change.includes("+")
        ? `↗ ${change}`
        : change}
    </div>
  </div>
);

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
      {/* Stat Cards Row */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        <StatCard
          title="TODAY ORDERS"
          value="12 orders"
          change="7"
          icon={<CalendarToday sx={{ fontSize: "24px" }} />}
          iconColor="#ef4444"
          isCurrent={true}
        />
        <StatCard
          title="TOTAL ORDERS"
          value="250"
          change="+12"
          icon={<MonetizationOn sx={{ fontSize: "24px" }} />}
          iconColor="#3b82f6"
        />
        <StatCard
          title="TOP SELLING MENU"
          value="Dinnerr"
          change="45"
          icon={<Restaurant sx={{ fontSize: "24px" }} />}
          iconColor="#f59e0b"
        />
        <StatCard
          title="TOTAL REVENUE"
          value="250,000 Ks"
          change="5"
          icon={<MonetizationOn sx={{ fontSize: "24px" }} />}
          iconColor="#10b981"
        />
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
