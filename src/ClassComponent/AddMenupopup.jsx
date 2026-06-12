import "./addmenupopup.css";
import { createPortal } from "react-dom";
import CloseIcon from "@mui/icons-material/Close";
import UploadIcon from "@mui/icons-material/UploadFile";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

function AddMenuPopUp({ data }) {
  const [file, setfile] = useState(null);
  const [filepath, setfilepath] = useState(null);
  const [allow, setallow] = useState(true);
  const [check, setcheck] = useState(false);

  const imgref = useRef();
  const nameref = useRef();
  const priceref = useRef();
  const categoryref = useRef();

  const {
    setshow,
    info,
    setinfo,
    updateFun,
    openloading,
    opensuccess,
    openerror,
    openconfirm,
  } = data;

  //function to addmenu
  async function add_menu(e) {
    e.preventDefault();
    let formData = new FormData();
    if (file) {
      formData.append("image", file);
    } else return;
    formData.append("price", priceref.current.value);
    formData.append("name", nameref.current.value);
    formData.append("available", check);
    formData.append("category_name", categoryref.current.value);
    openloading();
    try {
      let response = await fetch(import.meta.env.VITE_CLASS_ADD_MENU, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        await updateFun();
        opensuccess(
          "Menu Added to List",
          "Your menu is now avaliable for ordering",
        );
        close();
      } else {
        openerror("Error Occur While Adding New Menu");
      }
    } catch (err) {
      console.log(err);
    }
  }

  const imgpreview = (event) => {
    let name = event.target.files[0];
    setfile(name);

    if (name) {
      let url = URL.createObjectURL(name);
      setfilepath(url);
    }
  };

  //function to update Menu
  async function update_menu(e) {
    let id = info.id;
    e.preventDefault();
    let formData = new FormData();
    if (file) {
      formData.append("image", file);
    }
    formData.append("price", priceref.current.value);
    formData.append("name", nameref.current.value);
    formData.append("available", check);
    formData.append("category_name", categoryref.current.value);

    openloading();
    try {
      let response = await fetch(
        `${import.meta.env.VITE_CLASS_UPDATE_MENU}/${id}`,
        {
          method: "PUT",
          body: formData,
        },
      );
      if (response.ok) {
        await updateFun();
        opensuccess(
          "Menu Updated to List",
          "Your menu is now avaliable for ordering",
        );
        close();
      } else {
        openerror("Error Occurs while Updating");
      }
    } catch (err) {
      console.log(err);
    }
  }

  //function to delete menu
  async function delete_menu() {
    let id = info.id;
    console.log(id);
    if (!id) return;
    let isconfirm = await openconfirm();

    if (isconfirm) {
      openloading();
      try {
        let response = await fetch(
          `${import.meta.env.VITE_CLASS_DELETE_MENU}/${id}`,
          {
            method: "DELETE",
          },
        );
        if (response.ok) {
          await updateFun();
          close();
          opensuccess(
            "Successfully Deleted",
            "Successfully remove the menu from list",
          );
        } else {
          openerror("Error Occur While deleting");
        }
      } catch (err) {
        console.log(err);
        openerror("Check your internet connection and try again");
      }
    }
  }

  //close function
  function close() {
    setshow(false);
    setinfo(null);
    setallow(false);
  }

  //for  checkbox
  const change = (event) => {
    setcheck(event.target.checked);
  };

  return createPortal(
    <div className="addmenupopupwarper">
      <form className="addmenumain" onSubmit={info ? update_menu : add_menu}>
        <button className="addmenuclose" type="button" onClick={close}>
          <CloseIcon />
        </button>
        <h2 className="addmenuheader">{info ? "Menu Deatils" : "New Menu"}</h2>
        <div className="addmenubody">
          <span>
            <p>Menu Name</p>
            <input
              type="text"
              required
              defaultValue={info ? info.name : ""}
              readOnly={info && allow}
              ref={nameref}
            />
          </span>
          <span>
            <p>Category</p>
            <select
              defaultValue={info && "snack"}
              disabled={info && allow}
              ref={categoryref}
            >
              <option value="meal">Meal</option>
              <option value="snack">Snack</option>
              <option value="drink">Drink</option>
            </select>
          </span>
        </div>
        <div className="addmenubody1">
          <span className="addmenubody11">
            <p>Price</p>
            <input
              type="text"
              required
              defaultValue={info ? info.price : ""}
              readOnly={info && allow}
              ref={priceref}
            />
            <span className="addmenucheckbox">
              <input
                type="checkbox"
                defaultChecked={
                  info ? (info.available == "true" ? true : false) : false
                }
                disabled={info && allow}
                onChange={change}
              />
              <p
                style={{
                  fontFamily: "Inter",
                  fontWeight: "300",
                  padding: "3px 1px",
                  fontSize: "small",
                }}
              >
                Avaliable
              </p>
            </span>
          </span>
          <div className="addmenubody12">
            <p>Product Image</p>
            <div
              className="addmenupreimg"
              onClick={() => imgref.current.click()}
            >
              <input
                type="file"
                ref={imgref}
                className="addmenuhidden"
                onChange={imgpreview}
                required={!info}
                disabled={info && allow}
              />
              {file ? (
                <img src={filepath} />
              ) : info ? (
                <img src={info.image_url} />
              ) : (
                <>
                  <UploadIcon />
                  <p>Photo</p>
                </>
              )}
            </div>
          </div>
        </div>
        {info ? (
          <div className="addmenuupdate">
            <button
              type="button"
              style={{
                background: "#D12C2C",
                color: "white",
                marginRight: "auto",
              }}
              onClick={delete_menu}
            >
              Delete
            </button>
            <button
              type="button"
              style={{ background: "#16f90e52" }}
              onClick={() => setallow(!allow)}
            >
              Edit
            </button>
            <button
              style={{ background: "#1B263B", color: "white" }}
              disabled={info && allow}
            >
              Update
            </button>
          </div>
        ) : (
          <div className="addmenuadd">
            <button
              type="button"
              onClick={close}
              style={{ border: "1px solid #1b263b" }}
            >
              cancel
            </button>
            <button style={{ background: "#1B263B", color: "white" }}>
              Create
            </button>
          </div>
        )}
      </form>
    </div>,
    document.body,
  );
}
export default AddMenuPopUp;
