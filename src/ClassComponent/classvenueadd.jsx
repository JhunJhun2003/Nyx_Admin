import CloseIcon from "@mui/icons-material/Close";
import UploadIcon from "@mui/icons-material/FileUploadOutlined";
import "./classvenueadd.css";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
function ClassVenueAdd({ data }) {
  const [file, setfile] = useState(null);
  const [filepath, setfilepath] = useState(null);
  const [allow, setallow] = useState(true);

  const fileref = useRef();
  const nameref = useRef();
  const priceref = useRef();
  const checkboxref = useRef();

  const {
    info,
    setinfo,
    setshow,
    openloading,
    openerror,
    opensuccess,
    GetVenue,
    openconfirm,
  } = data;

  const close = () => {
    setinfo(null);
    setshow(false);
  };

  function showimg(e) {
    let img = e.target.files[0];
    setfile(img);
    if (img) {
      let url = URL.createObjectURL(img);
      setfilepath(url);
    }
  }

  // delete function
  async function delete_venue() {
    let id = info.id;
    if (!id) return;
    let confirm = await openconfirm(
      "Delete Venue",
      "Are you sure to delete this venue",
    );
    if (!confirm) return;
    try {
      openloading();
      let response = await fetch(
        `${import.meta.env.VITE_CLASS_DELETE_VENUE}/${id}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        opensuccess(
          "New Venue Added",
          "This venue is permantly remove from list",
        );
        await GetVenue();
        setshow(false);
      } else {
        openerror("something went wrong");
      }
    } catch (err) {
      console.log(err);
      openerror("Cannot connect with sever");
    }
  }

  //add_venue
  async function add_venue(e) {
    e.preventDefault();
    let formData = new FormData();
    formData.append("venue_image", fileref.current.files[0]);
    formData.append("name", nameref.current.value);
    formData.append("price", priceref.current.value);
    formData.append("available", checkboxref.current.checked);

    openloading();
    try {
      let response = await fetch(import.meta.env.VITE_CLASS_ADD_VENUE, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        opensuccess(
          "Venue Added Successfully",
          "Your new venue is now available",
        );
        setfile(null);
        setfilepath(null);
        nameref.current.value = "";
        priceref.current.value = "";
        setshow(false);
        await GetVenue();
      } else {
        openerror("Something went wrong");
      }
    } catch (err) {
      console.log(err);
      openerror("Cannot connect with sever");
    }
  }

  //update venue
  async function update_venue(e) {
    let id = info?.id;
    if (!id) return;

    e.preventDefault();
    let formData = new FormData();
    if (fileref.current.files[0]) {
      formData.append("venue_image", fileref.current.files[0]);
    }
    formData.append("venue_name", nameref.current.value);
    formData.append("price", priceref.current.value);
    formData.append("available", checkboxref.current.checked);

    openloading();
    try {
      let response = await fetch(
        `${import.meta.env.VITE_CLASS_UPDATE_VENUE}/${id}`,
        {
          method: "PUT",
          body: formData,
        },
      );
      if (response.ok) {
        await GetVenue();
        setshow(false);
        opensuccess("Action Successful", "Venue Update Successfully");
      } else {
        openerror("Something went wrong");
      }
    } catch (err) {
      console.log(err);
      openerror("Cannot connect with sever");
    }
  }

  return createPortal(
    <div className="cvawarper">
      <form className="cvamain" onSubmit={info ? update_venue : add_venue}>
        <div className="cvabody1">
          <h3>{info ? "Venue Details" : "New Details"}</h3>
          <button type="button" onClick={close}>
            <CloseIcon />
          </button>
        </div>
        <div className="cvabody2">
          <p>Venue Name</p>
          <input
            type="text"
            defaultValue={info ? info.venue_name : ""}
            readOnly={allow && info}
            required
            ref={nameref}
          />
        </div>
        <div className="cvabody2">
          <p>Price</p>
          <input
            type="number"
            defaultValue={info ? info.price : ""}
            readOnly={allow && info}
            required
            ref={priceref}
          />
        </div>
        <div className="cvabody3">
          <p>Venue Photo</p>
          <div className="cvabody31" onClick={() => fileref.current.click()}>
            <input
              type="file"
              className="venuehidden"
              ref={fileref}
              onChange={showimg}
              required={!info}
              disabled={allow && info}
            />

            {file ? (
              <img src={filepath} alt="venue image" className="venueimgurl" />
            ) : info ? (
              <img src={info.venue_image_url} className="venueimgurl" />
            ) : (
              <>
                <UploadIcon />
                <p>Upload</p>
              </>
            )}
          </div>
        </div>
        <label htmlFor="input" className="cvabody4">
          <input
            type="checkbox"
            ref={checkboxref}
            defaultChecked={info ? info.available : false}
            disabled={allow && info}
          />{" "}
          Available
        </label>
        {info ? (
          <div className="cvabody5">
            <button type="button" onClick={delete_venue}>
              Delete
            </button>
            <button
              type="button"
              onClick={() => {
                setallow(!allow);
              }}
            >
              Edit
            </button>
            <button disabled={info && allow}>Update</button>
          </div>
        ) : (
          <div className="cvabody6">
            <button type="button" onClick={close}>
              cancel
            </button>
            <button>create</button>
          </div>
        )}
      </form>
    </div>,
    document.body,
  );
}
export default ClassVenueAdd;
