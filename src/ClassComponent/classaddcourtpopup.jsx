import { useRef } from "react";
import "./classaddcourtpopup.css";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import { useNoti } from "../Hooks/alert";

function ClassCourtPopUp({ data }) {
  const {
    id,
    header,
    heading,
    set_show,
    court_id,
    venue_id,
    openerror,
    openloading,
    opensuccess,
    GetCourts,
  } = data;

  const dataref = useRef();
  const disref = useRef();

  //Don't delete this comments
  // id 1 is to add new Pro
  // id 2 is to add new Con
  // id 3 is to add new Service

  async function class_court_add(e) {
    e.preventDefault();
    const url = {
      1: import.meta.env.VITE_CLASS_ADD_PRO,
      2: import.meta.env.VITE_CLASS_ADD_CON,
      3: import.meta.env.VITE_CLASS_ADD_SERVICE,
      4: import.meta.env.VITE_CLASS_ADD_RULE,
    };

    let text = {};
    if (id == 1) {
      text.header = "New Pro Added to List";
      text.body = "Your new New Pro has been shown";
    } else if (id == 2) {
      text.header = "New Con Added to List";
      text.body = "Your new New Con has been shown";
    } else if (id == 3) {
      text.header = "New Service Added to List";
      text.body = "Your new service has been shown";
    } else if (id == 4) {
      text.header = "New Rule Added to List";
      text.body = "Your new service has been show ";
    }
    if (!url[id]) return;

    const senddata = {
      venue_id: venue_id,
      court_id: court_id,
      name: dataref.current.value,
    };
    if (id == 4) senddata.description = disref.current.value;
    if (id === 1) senddata.detail = "testing";
    openloading();
    try {
      const response = await fetch(url[id], {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(senddata),
      });
      console.log(senddata);
      if (response.ok) {
        console.log(venue_id);
        GetCourts(venue_id);
        opensuccess(text.header, text.body);
        set_show(false);
      } else {
        openerror("something went wrong");
        set_show(false);
      }
    } catch (error) {
      openerror("Cannot Connect with sever");
      console.error(error);
      set_show(false);
    }
  }

  return (
    <div className="cupwarper">
      <form
        className="cupmain"
        onSubmit={class_court_add}
        style={{ height: id == 4 ? "250px" : "200px" }}
      >
        <span className="cupcontent1">
          <h2>{header}</h2>
          <button onClick={() => set_show(false)} type="button">
            <CloseIcon sx={{ fontSize: "20px" }} />
          </button>
        </span>
        <span className="cupcontent2">
          <p>{heading}</p>
          <input type="text" ref={dataref} required />
        </span>
        {id == 4 && (
          <span className="cupcontent4">
            <p>Descripition</p>
            <textarea rows={2} ref={disref} />
          </span>
        )}
        <span className="cupcontent3">
          <button onClick={() => set_show(false)} type="button">
            cancel
          </button>
          <button type="submit">Create</button>
        </span>
      </form>
    </div>
  );
}
export default ClassCourtPopUp;
