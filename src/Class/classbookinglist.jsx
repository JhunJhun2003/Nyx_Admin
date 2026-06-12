import { useEffect } from "react";
import "../classCss/classbookinglist.css";
import ListIcon from "@mui/icons-material/ChecklistRtlSharp";
import { classbookingheading } from "../DataExport";
import { NavLink, Outlet } from "react-router-dom";
import HeaderIcon1 from "@mui/icons-material/MovingSharp";
import HeaderIcon2 from "@mui/icons-material/SecurityUpdateGood";
import HeaderIcon3 from "@mui/icons-material/StorefrontSharp";
import HeaderIcon4 from "@mui/icons-material/ListAltSharp";

function BookingList() {
  return (
    <div className="blmain">
      <h2 className="blheader">
        <ListIcon /> Booking List
      </h2>
      <div className="bltitle">
        {classbookingheading.map((item, index) => {
          return (
            <div key={index}>
              <span>
                <h4>{item.title}</h4>
                {item.icon == 1 && (
                  <HeaderIcon1
                    sx={{
                      fontSize: "20px",
                      background: "#FAFAFA",
                      color: "#18181B",
                    }}
                  />
                )}
                {item.icon == 2 && (
                  <HeaderIcon2
                    sx={{
                      fontSize: "20px",
                      color: "#059669",
                    }}
                  />
                )}
                {item.icon == 3 && (
                  <HeaderIcon3
                    sx={{
                      fontSize: "20px",
                      background: "#FAFAFA",
                      color: "#2563EB",
                    }}
                  />
                )}
                {item.icon == 4 && (
                  <HeaderIcon4
                    sx={{
                      fontSize: "20px",
                      background: "#FAFAFA",
                      color: "#DC2626",
                    }}
                  />
                )}
              </span>
              <h3>{item.info}</h3>
            </div>
          );
        })}
      </div>
      <div className="blswitch">
        <NavLink to="classmobilebooking">Mobile Order</NavLink>
        <NavLink to="classlocalbooking">Loacal Order</NavLink>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
export default BookingList;
