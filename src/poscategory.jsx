import "./cssFolder/poscategory.css";
import CategoryIcon from "@mui/icons-material/CategoryOutlined";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import TagIcon from "@mui/icons-material/Inventory2Outlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import { useContext, useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import { Context } from "./Hooks/context";
import Loading from "./Components/Loading";
import LoaingTag from "./Components/loadingTag";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import BrandPopUp from "./Components/brandaddpopup";
import UploadIcon from "@mui/icons-material/UploadFile";
import { useGetCategory } from "./Api_Call";
import { useNoti } from "./Hooks/alert";

function PosCategory() {
  const [show, setshow] = useState(false);
  const [show1, setshow1] = useState(false);
  const [show2, setshow2] = useState(false);
  const [alert1, setalert1] = useState(false);
  const [selecttoDel, setselecttoDel] = useState(null); //for category update
  const [allow, setallow] = useState(selecttoDel ? true : false); //for category update
  const [editdata, seteditdata] = useState(null); //for tagsupdate
  const [isallow, setisallow] = useState(editdata ? true : false); //for tagsupdate
  const [file, setfile] = useState(null);
  const [filepath, setfilepath] = useState(null);

  let Categoryname = useRef();
  let CategoryImage = useRef();
  let Tagsref = useRef();

  const { Categories, GetCategories, Tags, GetTags } = useGetCategory();
  const { backcolor, Token } = useContext(Context);
  const {
    Loading: categoryloading,
    openconfirm,
    openerror,
    openloading,
    opensuccess,
    close,
  } = useNoti();

  const Font_color = Boolean(backcolor == "#1A1C1E");
  const FontStyle = {
    color: Font_color ? "#E1E1E1" : "#0D1B2A",
  };

  useEffect(() => {
    (GetCategories(), GetTags());
  }, []);

  async function addCategory(e) {
    e.preventDefault();
    let formdata = new FormData();
    formdata.append("image", CategoryImage.current.files[0]);
    formdata.append("name", Categoryname.current.value);
    openloading();
    try {
      let reponse = await fetch(import.meta.env.VITE_ADD_CATEGORY, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Token}`,
        },
        body: formdata,
      });
      if (reponse.ok) {
        setTimeout(async () => {
          await GetCategories();
        }, 500);
        setshow(false);
        opensuccess("Action Successful", "New Category added successfully");
      } else {
        openerror("Something went worng");
        setshow(false);
      }
    } catch (err) {
      console.log(err);
      openerror("Cannot connect with sever");
    }
  }
  async function AddTags(e) {
    e.preventDefault();
    let data = { name: Tagsref.current.value };
    openloading();
    try {
      let reponse = await fetch(import.meta.env.VITE_ADD_TAGS, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (reponse.ok) {
        GetTags();
        opensuccess("Action Successful", "New Tag added successfully");
        setshow1(false);
      } else {
        openerror("Something went wrong");
        setshow1(false);
      }
    } catch (err) {
      console.log(err);
      openerror("Cannot connect with sever");
    }
  }

  function handleEdit(item) {
    setshow1(true);
    seteditdata(item);
    setisallow(true);
  }

  function editCategory(item) {
    setshow(true);
    setselecttoDel(item);
  }

  async function handleUpdateCategory(e) {
    e.preventDefault();
    let formdata = new FormData();
    formdata.append("id", selecttoDel.id);
    if (Categoryname.current.value != selecttoDel.name) {
      formdata.append("name", Categoryname.current.value);
    }

    if (CategoryImage.current.files[0]) {
      formdata.append("image", CategoryImage.current.files[0]);
    }

    if (
      Categoryname.current.value == selecttoDel.name &&
      !CategoryImage.current.files[0]
    ) {
      setshow(false);
      setallow(false);
      setselecttoDel(null);
      return;
    }
    openloading();
    try {
      let reponse = await fetch(import.meta.env.VITE_UPDATE_CATEGORY, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${Token}`,
        },
        body: formdata,
      });

      if (reponse.ok) {
        GetCategories();
        opensuccess("Action Successful", "Category updated successfully");
        setselecttoDel(null);
        setallow(false);
        setshow(false);
      } else {
        openerror("Something went wrong");
        setselecttoDel(null);
        setshow(false);
        setallow(false);
      }
    } catch (err) {
      console.log(err);
      openerror("Cannot connect with sever");
      setselecttoDel(null);
      setallow(false);
      setshow(false);
    }
  }

  async function handleUpdateTags(e) {
    e.preventDefault();
    let name = Tagsref.current.value;
    let id = editdata.id;

    if (name == editdata.name) {
      setshow1(false);
      seteditdata(null);
      setisallow(false);
      return;
    }
    openloading();
    try {
      let response = await fetch(import.meta.env.VITE_UPDATE_TAGS, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${Token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, name }),
      });
      if (response.ok) {
        GetTags();
        setshow1(false);
        seteditdata(null);
        setisallow(false);
        setfile(null);
        opensuccess("Action Successful", "Tags updated successfully");
      } else {
        setshow1(false);
        seteditdata(null);
        setisallow(false);
        toast.error("Failed to update Tags");
        setfile(null);
        openerror("Something went wrong");
      }
    } catch (err) {
      console.log(err);
      openerror("Cannot connect with sever");
    }
  }

  async function handleDeleteTags() {
    let tagsName = editdata.name;

    let isconfirm = await openconfirm();

    if (!isconfirm) return;

    const tagdelete = toast.loading("Deleting Tags...");
    try {
      let reponse = await fetch(
        `${import.meta.env.VITE_DELETE_TAGS}${tagsName}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        },
      );
      if (reponse.ok) {
        opensuccess("Action Successful", "Tags deleted successfully");
        GetTags();
        setshow1(false);
        seteditdata(null);
        setisallow(false);
        setfile(null);
      } else {
        setshow1(false);
        seteditdata(null);
        setisallow(false);
        openerror("Something went wrong");
        setfile(null);
      }
    } catch (err) {
      console.log(err);
      setshow1(false);
      seteditdata(null);
      setisallow(false);
      openerror("Cannot connect with sever");
    }
  }

  async function handleDeleteCategory() {
    let data = selecttoDel.name;
    let isconfirm = await openconfirm();

    if (!isconfirm) return;
    openloading();

    try {
      let reponse = await fetch(
        `${import.meta.env.VITE_DELETE_CATEGORY}${data}`,
        {
          method: "DELETE",
        },
      );
      if (reponse.ok) {
        await GetCategories();
        setshow(false);
        setselecttoDel(null);
        opensuccess("Action Successful", "Category deleted successfully");
        setfile(null);
      } else {
        setshow(false);
        setselecttoDel(null);
        openerror("Something went wrong");
        setfile(null);
      }
    } catch (err) {
      console.log(err);
      setshow(false);
      setselecttoDel(null);
      openerror("Cannot connect with sever");
    }
  }

  //function to show imgpreview
  const imgpreview = (event) => {
    let name = event.target.files[0];
    setfile(name);

    if (name) {
      let url = URL.createObjectURL(name);
      setfilepath(url);
    }
  };

  return (
    <>
      {categoryloading}
      <div className="poscategorymain">
        <div className="Poscategoryheader">
          <h1 style={FontStyle}>
            <CategoryIcon />
            Category
          </h1>
          <button
            onClick={() => {
              setshow(true);
              setselecttoDel(null);
              setallow(false);
            }}
          >
            <AddIcon />
            Add Category
          </button>
        </div>

        <div className="poscategorybody">
          {Array.isArray(Categories.data) ? (
            Categories.data.length > 0 ? (
              Categories.data.map((item, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => editCategory(item)}
                    className="singlecategory"
                  >
                    <img src={item.image_url} alt="image" />
                    <p>{item.name}</p>
                  </div>
                );
              })
            ) : (
              <div className="singlecategory" onClick={() => setshow(true)}>
                <p>No Category Yet</p>
              </div>
            )
          ) : (
            [...Array(7)].map((_, index) => <Loading key={index} />)
          )}
        </div>

        <hr
          style={{
            margin: "1em ",
            height: "5px",
            background: "black",
            width: "100%",
          }}
        />

        <div className="poscategorybody2">
          <h1 style={FontStyle}>
            <TagIcon style={{ fontSize: "35px" }} />
            Tags
          </h1>
          <button
            onClick={() => {
              seteditdata(null);
              setshow(false);
              setshow1(true);
              setisallow(false);
            }}
          >
            <AddIcon />
            Add Tags
          </button>
        </div>
        <div className="poscategoryfooter">
          {Array.isArray(Tags.data) ? (
            Tags.data.length > 0 ? (
              Tags.data.map((item, index) => {
                return (
                  <h3 key={index} onClick={() => handleEdit(item)}>
                    {item.name}
                  </h3>
                );
              })
            ) : (
              <h3 style={{ color: "red" }} onClick={() => setshow1(true)}>
                There is no tags
              </h3>
            )
          ) : (
            [...Array(4)].map((_, index) => <LoaingTag key={index} />)
          )}
        </div>
        {/* _______________________________________________________________________________________________________________________________________________*/}
        {/*for Pop up box*/}
        {show && (
          <div className="showwarper">
            <form
              className="categorypopup"
              onSubmit={selecttoDel ? handleUpdateCategory : addCategory}
            >
              <h1 className="categorypopupheader">
                {selecttoDel ? "Category Details" : "New Category"}
              </h1>

              <button
                className="categorycloseIcon"
                onClick={() => {
                  setshow(false);
                  setallow(false);
                  setselecttoDel(null);
                  setfile(null);
                  setfilepath(null);
                }}
              >
                <CloseIcon />
              </button>

              <p>Category Name</p>

              <input
                type="text"
                className="category"
                defaultValue={selecttoDel ? selecttoDel.name : ""}
                readOnly={selecttoDel && !allow}
                required={!selecttoDel}
                ref={Categoryname}
                key={selecttoDel ? 2 : ""}
              />

              <div
                className="categoryimgwarper"
                onClick={() => CategoryImage.current.click()}
              >
                <input
                  type="file"
                  className="categoryimgupload"
                  ref={CategoryImage}
                  disabled={selecttoDel && !allow}
                  required={!selecttoDel}
                  onChange={imgpreview}
                />
                {file ? (
                  <img src={filepath} />
                ) : selecttoDel ? (
                  <img src={selecttoDel.image_url} />
                ) : (
                  <>
                    <UploadIcon />
                    <p>Photo</p>
                  </>
                )}
              </div>
              {selecttoDel ? (
                <div className="categoryupdate">
                  <button onClick={handleDeleteCategory} type="button">
                    Delete
                  </button>

                  <div>
                    <button
                      onClick={() => {
                        setallow(true);
                        Categoryname.current.focus();
                      }}
                      type="button"
                    >
                      Edit
                    </button>
                    <button disabled={selecttoDel && !allow}>Update</button>
                  </div>
                </div>
              ) : (
                <div className="categorycreatebtn">
                  <button style={{ background: "#0D1B2A", color: "white" }}>
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setshow(false);
                      setfile(null);
                      setfilepath(null);
                    }}
                    type="button"
                  >
                    cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/*for Tag box*/}
        {show1 && (
          <div className="show1warper">
            <div className="tagpopup">
              <div className="tagheader">
                <h2>{editdata ? "Update Tags" : "New Tags"}</h2>
                <button
                  className="tagcloseIcon"
                  onClick={() => {
                    setshow1(false);
                    setisallow(true);
                  }}
                >
                  <CloseIcon />
                </button>
              </div>
              <p>Tag name</p>
              <form onSubmit={editdata ? handleUpdateTags : AddTags}>
                <input
                  type="text"
                  className="taginput"
                  ref={Tagsref}
                  required
                  defaultValue={editdata ? editdata.name : ""}
                  key={editdata ? 3 : ""}
                  readOnly={isallow}
                />

                {editdata ? (
                  <div className="tagupdatebtn">
                    <button onClick={handleDeleteTags} type="button">
                      Delete
                    </button>
                    <div>
                      <button
                        onClick={() => {
                          setisallow(false);
                          Tagsref.current.focus();
                        }}
                        type="button"
                      >
                        Edit
                      </button>
                      <button disabled={isallow}>Update</button>
                    </div>
                  </div>
                ) : (
                  <div className="tagbutton">
                    <button type="submit">
                      {editdata ? "Delete" : "Create"}
                    </button>
                    <button type="button" onClick={() => setshow1(false)}>
                      cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
        {/*for brand input box*/}
        {show2 && <BrandPopUp data={{ setshow2: setshow2 }} />}
      </div>
    </>
  );
}
export default PosCategory;
