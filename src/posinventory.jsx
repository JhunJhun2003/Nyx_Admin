import InventoryIcon from "@mui/icons-material/DensityMediumOutlined";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import "./cssFolder/posinventory.css";
import { useContext, useEffect, useState } from "react";
import { Context } from "./Hooks/context";
import TableLoading from "./Components/tableloading";
import CustomerLoading from "./Components/loadingcustomer";
import { useGetCategory, useGetInventroy } from "./Api_Call";

function PosInventory() {
  const [text, settext] = useState("");
  const [value, setvalue] = useState("All");
  const [filteredData, setfiltered] = useState(null);

  const { Categories, GetCategories } = useGetCategory();
  const { Inventory, GetInventory } = useGetInventroy();
  const { backcolor } = useContext(Context);

  let Condition = [
    { title: "Total Inventory", data: "1200" },
    { title: "Out of Stocks", data: "98" },
    { title: "Out of Stocks", data: "98" },
    { title: "Top Categories", data: "Badminton" },
  ];

  const Font_color = Boolean(backcolor == "#1A1C1E");
  const FontStyle = {
    color: Font_color ? "#E1E1E1" : "#0D1B2A",
  };
  const InputStyle = {
    backgroundColor: Font_color ? "#E1E1E1" : "#0D1B2A",
  };

  useEffect(() => {
    (GetInventory(), GetCategories());
  }, []);

  //for option
  function changevalue(event) {
    setvalue(event.target.value);
  }

  // for search box
  function changetext(event) {
    settext(event.target.value);
  }

  useEffect(() => {
    if (!Array.isArray(Inventory.data)) return;
    setfiltered(Inventory.data);
    if (!Inventory.data.length > 0) return;
    let result = Inventory.data;
    if (value != "All") {
      result = result.filter((item) => {
        return item.category.toLowerCase().includes(value.toLowerCase());
      });
    }
    if (text.trim() !== "") {
      result = result.filter((item) => {
        return (
          item.productName.toLowerCase().includes(text.trim().toLowerCase()) ||
          item.tags.toLowerCase().includes(text.trim().toLowerCase())
        );
      });
    }
    setfiltered(result);
  }, [text, value, Inventory.data]);

  async function DeleteInventoryData(item) {
    try {
      let reponse = await fetch(
        `${import.meta.env.VITE_DELETE_INVENTORY}/${item}`,
        {
          method: "DELETE",
        },
      );
      if (reponse.ok) {
        await GetInventory();
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <div className="posinventorymain">
        <h1 className="Inventorytitle" style={FontStyle}>
          <InventoryIcon
            className="inventoryIcon"
            sx={{ border: !Font_color ? "1px solid white" : "1px solid black" }}
          />
          Inventory
        </h1>
        <div className="inventoryCondition">
          {Condition.map((item, index) => {
            return (
              <div
                key={index}
                className={`condition${index}`}
                style={{ border: "1px solid #0d1b2a3a" }}
              >
                <p>{item.title}</p>
                <h4>{item.data}</h4>
              </div>
            );
          })}
        </div>
        <div className="inventoryheader">
          <h2 style={FontStyle}>Product Stocks Overview</h2>
          <select onChange={changevalue}>
            <option value="All">All</option>
            {Array.isArray(Categories.data) && Categories.data.length > 0 ? (
              Categories.data.map((item, index) => {
                return (
                  <option key={index} value={item.name}>
                    {item.name}
                  </option>
                );
              })
            ) : (
              <option>Loading...</option>
            )}
          </select>
          <div style={InputStyle}>
            <input
              type="search"
              placeholder="Search.."
              style={{ color: !Font_color ? "white" : "#0D1B2A" }}
              onChange={changetext}
            />
            <SearchIcon style={{ color: !backcolor ? "white" : "#0D1B2A" }} />
          </div>
        </div>
        <div className="inventorytablecontainer">
          <table className="inventorytable" id="inventorytable">
            <thead>
              <tr>
                <th>Product Id</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Tags</th>
                <th>Date</th>
                <th>Stocks</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredData) ? (
                filteredData.length > 0 ? (
                  filteredData.map((item, index) => {
                    return (
                      <tr key={index} className="test">
                        <td
                          style={{
                            borderLeft: "1px solid #dee2e6",
                            width: "90px",
                          }}
                        >
                          {item.ProductID}
                        </td>
                        <td className="productname">{item.productName}</td>
                        <td>{item.category}</td>
                        <td>{item.tags}</td>
                        <td>{item.Date}</td>
                        <td>{item.current_stock}</td>
                        <td
                          style={{
                            color: item.current_stock > 0 ? "#0f0e0e" : "red",
                          }}
                        >
                          {item.status}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        borderTop: "1px solid #0f0e0e4f",
                        borderBottom: "1px solid #0f0e0e4f",
                        margin: 0,
                      }}
                    >
                      No data
                    </td>
                  </tr>
                )
              ) : (
                [...Array(8)].map((_, index) => (
                  <CustomerLoading key={index} times={7} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
export default PosInventory;
