import "./cssFolder/productadd.css";
import "./cssFolder/posproduct.css";
import ProductIcon from "@mui/icons-material/Inventory2Outlined";
import SearchIcon from "@mui/icons-material/SearchSharp";
import AddIcon from "@mui/icons-material/AddCircleOutlineSharp";
import { useContext, useEffect, useRef, useState } from "react";
import {
  NavLink,
  Outlet,
  useFetcher,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import uploader from "@zwehtetpaing55/uploader";
import { Context } from "./Hooks/context";
import UploadIcon from "@mui/icons-material/UploadFile";
import { useGetCategory, useGetProducts } from "./Api_Call";
import { useNoti } from "./Hooks/alert";

function AddProduct() {
  const { info, setinfo, GetProducts } = useOutletContext();
  const [allowupdate, setallowupdate] = useState(info ? true : false);
  const [file, setfile] = useState(null);
  const [filepath, setfilepath] = useState(null);

  const navigate = useNavigate();

  const { Categories, GetCategories, Tags, GetTags } = useGetCategory();
  const { Products } = useGetProducts();
  const { Loading, openconfirm, openerror, openloading, opensuccess, close } =
    useNoti();

  useEffect(() => {
    GetCategories();
    GetTags();
  }, []);

  const nameref = useRef();
  const brandref = useRef();
  const maderef = useRef();
  const typeref = useRef();
  const stockref = useRef();
  const descriptionref = useRef();
  const categoryref = useRef();
  const costref = useRef();
  const colorref = useRef();
  const weightref = useRef();
  const ratingref = useRef();
  const imageref = useRef();
  const tagref = useRef();
  const priceref = useRef();
  const sizeref = useRef();
  const wranartref = useRef();
  const dateref = useRef();
  const checkref = useRef();

  async function AddProduct(e) {
    e.preventDefault();
    openloading();
    try {
      console.log(ratingref.current.value);
      console.log("item Uploaded");
      let formdata = new FormData();
      formdata.append("productName", nameref.current.value);
      formdata.append("brand", brandref.current.value);
      formdata.append("made", maderef.current.value);
      formdata.append("type", typeref.current.value);
      formdata.append("stock", stockref.current.value);
      formdata.append("description", descriptionref.current.value);
      formdata.append("category", categoryref.current.value);
      formdata.append("cost", costref.current.value);
      formdata.append("tags", tagref.current.value);
      formdata.append("color", colorref.current.value);
      formdata.append("weight", weightref.current.value);
      formdata.append("rating", ratingref.current.value);
      formdata.append("price", priceref.current.value);
      formdata.append("size", sizeref.current.value);
      formdata.append("warranty", wranartref.current.value);
      formdata.append("date", dateref.current.value);
      formdata.append("image", imageref.current.files[0]);

      let reponse = await fetch(import.meta.env.VITE_ADD_PRODUCT, {
        method: "POST",
        body: formdata,
      });

      if (reponse.ok) {
        opensuccess("Action Successfully", "New Product Added Successfully");
        GetProducts();
        nameref.current.value = "";
        brandref.current.value = "";
        maderef.current.value = "";
        typeref.current.value = "";
        stockref.current.value = "";
        descriptionref.current.value = "";
        categoryref.current.value = "";
        costref.current.value = "";
        colorref.current.value = "";
        weightref.current.value = "";
        ratingref.current.value = "";
        priceref.current.value = "";
        sizeref.current.value = "";
        wranartref.current.value = "";
        dateref.current.value = "";
        imageref.current.value = "";
        setfile(null);
        setfilepath(null);
      } else {
        openerror("Something went Wrong");
        setfile(null);
        setfilepath(null);
      }
    } catch (err) {
      console.log(err);
      openerror("Cannot connect with sever");
    }
  }

  async function deleteProduct(id) {
    let isconfirm = await openconfirm();
    if (!isconfirm) return;

    openloading();
    try {
      let reponse = await fetch(
        `${import.meta.env.VITE_DELETE_PRODUCT}/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (reponse.ok) {
        await GetProducts();
        close();
        navigate(-1);
      } else {
        openerror("Something went worng");
      }
    } catch (err) {
      console.log(err);
      openerror("Cannot connect with sever");
    }
  }

  async function updateProduct(e) {
    try {
      e.preventDefault();
      let formdata = new FormData();
      formdata.append("id", info.id);
      formdata.append("productName", nameref.current.value);
      formdata.append("brand", brandref.current.value);
      formdata.append("made", maderef.current.value);
      formdata.append("type", typeref.current.value);
      formdata.append("stock", stockref.current.value);
      formdata.append("description", descriptionref.current.value);
      formdata.append("category", categoryref.current.value);
      formdata.append("cost", costref.current.value);
      formdata.append("tags", tagref.current.value);
      formdata.append("color", colorref.current.value);
      formdata.append("weight", weightref.current.value);
      formdata.append("rating", ratingref.current.value);
      formdata.append("price", priceref.current.value);
      formdata.append("size", sizeref.current.value);
      formdata.append("warranty", wranartref.current.value);
      formdata.append("date", dateref.current.value);

      if (imageref.current.files[0]) {
        formdata.append("image", imageref.current.files[0]);
      }
      openloading();
      let reponse = await fetch(import.meta.env.VITE_UPDATE_PRODUCT, {
        method: "PUT",
        body: formdata,
      });
      if (reponse.ok) {
        await GetProducts();
        close();
        setallowupdate(true);
        setinfo(null);
        navigate(-1);
        setfile(null);
        setfilepath(null);
      } else {
        GetProducts();
        setallowupdate(true);
        setinfo(null);

        setfile(null);
        setfilepath(null);
        openerror("Something went worng");
      }
    } catch (err) {
      console.log(err);
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
      <form
        onSubmit={info ? updateProduct : AddProduct}
        className="addproductform"
      >
        {Loading}
        <div className="posadditemcontainer">
          <div className="additemheader">
            <button
              onClick={() => {
                navigate(-1);
                setallowupdate(false);
                setinfo(null);
              }}
              type="button"
            >
              <CloseIcon />
            </button>
            <h2 className="categoryupload3 ">
              {info ? "Product Details" : "New Product"}
            </h2>
          </div>
          <div className="container">
            <div className="categoryupload5 ">
              <label>Product Name</label>
              <input
                type="text"
                placeholder=""
                ref={nameref}
                required
                defaultValue={info ? info.productName : ""}
                readOnly={allowupdate}
              />

              <label>Brand</label>
              <input
                type="text"
                placeholder=""
                ref={brandref}
                required
                defaultValue={info ? info.brand : ""}
                readOnly={allowupdate}
              />

              <label>Made</label>
              <input
                type="text"
                placeholder=""
                ref={maderef}
                required
                defaultValue={info ? info.made : ""}
                readOnly={allowupdate}
              />

              <label>Type</label>
              <input
                type="text"
                placeholder=""
                ref={typeref}
                required
                readOnly={allowupdate}
                defaultValue={info ? info.types : ""}
              />

              <label>Stock</label>
              <input
                type="number"
                placeholder=""
                ref={stockref}
                required
                readOnly={allowupdate}
                defaultValue={info ? info.total_stock : ""}
              />

              <label>Description</label>
              <textarea
                className="textarea"
                rows="2"
                cols="30"
                placeholder=""
                ref={descriptionref}
                required
                readOnly={allowupdate}
                defaultValue={info ? info.description : ""}
              />
            </div>

            <div className="categoryupload7">
              <label>Category</label>
              <select
                className="categoryupload8"
                ref={categoryref}
                required
                defaultValue={info ? info.category : ""}
                disabled={allowupdate}
              >
                {Array.isArray(Categories.data) &&
                Categories.data.length > 0 ? (
                  Categories.data.map((item, index) => {
                    return (
                      <option key={index} value={item.name}>
                        {item.name}
                      </option>
                    );
                  })
                ) : (
                  <option disabled>Loading...</option>
                )}
              </select>

              <label>Cost</label>
              <input
                type="number"
                placeholder=""
                ref={costref}
                required
                readOnly={allowupdate}
                defaultValue={info ? info.cost : ""}
              />

              <label>Color</label>
              <input
                type="text"
                placeholder=""
                ref={colorref}
                required
                readOnly={allowupdate}
                defaultValue={info ? info.colors : ""}
              />

              <label>Weight</label>
              <input
                type="text"
                placeholder=""
                ref={weightref}
                required
                readOnly={allowupdate}
                defaultValue={info ? info.weights : ""}
              />

              <label>Rating</label>
              <input
                type="text"
                placeholder=""
                ref={ratingref}
                required
                readOnly={allowupdate}
                defaultValue={info ? info.rating : ""}
              />
              <label style={{ padding: "3px" }}>Upload Image</label>
              <div
                className="categoryupload9"
                onClick={() => imageref.current.click()}
              >
                <input
                  type="file"
                  placeholder=""
                  ref={imageref}
                  required={!info}
                  onChange={imgpreview}
                  disabled={allowupdate}
                />
                {file ? (
                  <img src={filepath} />
                ) : info ? (
                  <img src={info.images} />
                ) : (
                  <div className="upload91">
                    <span>
                      <UploadIcon />
                      <p>Upload</p>
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="categoryupload11">
              <label>Tags</label>

              <select
                className="categoryupload12"
                ref={tagref}
                required
                defaultValue={info ? info.tag : ""}
                disabled={allowupdate}
              >
                {Array.isArray(Tags.data) && Tags.data.length > 0 ? (
                  Tags.data.map((item, index) => {
                    return (
                      <option key={index} value={item.name}>
                        {item.name}
                      </option>
                    );
                  })
                ) : (
                  <option disabled>Loading...</option>
                )}
              </select>

              <label>Price</label>
              <input
                type="number"
                placeholder=""
                ref={priceref}
                required
                readOnly={allowupdate}
                defaultValue={info ? info.price : ""}
              />

              <label>size</label>
              <input
                type="number"
                placeholder=""
                ref={sizeref}
                required
                readOnly={allowupdate}
                defaultValue={info ? info.sizes : ""}
              />

              <label>Warranty</label>
              <input
                type="text"
                placeholder=""
                ref={wranartref}
                required
                readOnly={allowupdate}
                defaultValue={info ? info.warranty : ""}
              />

              <label>Date</label>
              <input
                type="date"
                placeholder=""
                ref={dateref}
                required
                readOnly={allowupdate}
                defaultValue={info ? info.date : ""}
              />
            </div>
          </div>

          {info ? (
            <div className=" categoryupload132">
              <button
                type="button"
                className="up132btn1"
                onClick={() => deleteProduct(info.id)}
              >
                Delete
              </button>
              <div>
                <button
                  type="button"
                  className="up132btn2"
                  onClick={() => {
                    setallowupdate(false);
                  }}
                >
                  Edit
                </button>
                <button disabled={allowupdate} className="up132btn3">
                  Update
                </button>
              </div>
            </div>
          ) : (
            <div className=" categoryupload13">
              <button className="categoryupload14">Create</button>
              <button
                type="button"
                className="categoryupload15"
                onClick={() => {
                  navigate(-1);
                  setinfo(null);
                }}
              >
                cancel
              </button>
            </div>
          )}
        </div>
      </form>
    </>
  );
}

export default AddProduct;
