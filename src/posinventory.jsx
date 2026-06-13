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
  const [inventoryStats, setInventoryStats] = useState({
    totalInventory: "0",
    outOfStock: "0",
    lowStock: "0",
    topCategory: "N/A"
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const { Categories, GetCategories } = useGetCategory();
  const { Inventory, GetInventory } = useGetInventroy();
  const { backcolor } = useContext(Context);

  const Font_color = Boolean(backcolor == "#1A1C1E");
  const FontStyle = {
    color: Font_color ? "#E1E1E1" : "#0D1B2A",
  };
  const InputStyle = {
    backgroundColor: Font_color ? "#E1E1E1" : "#0D1B2A",
  };

  // Fetch inventory statistics from API
  const fetchInventoryStats = async () => {
    try {
      const response = await fetch(
        "http://38.60.216.25:5000/api/inventory/totalinventory"
      );
      const data = await response.json();
      console.log("Inventory Stats:", data);
      
      if (data && data["total inventory"]) {
        setInventoryStats({
          totalInventory: data["total inventory"].total_inventory || "0",
          outOfStock: data["total inventory"].out_of_stock || "0",
          lowStock: data["total inventory"].low_stock || "0",
          topCategory: data["top category"] || "N/A"
        });
      }
    } catch (error) {
      console.error("Error fetching inventory stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    GetInventory();
    GetCategories();
    fetchInventoryStats();
  }, []);

  // Condition data from API
  const Condition = [
    { title: "Total Inventory", data: inventoryStats.totalInventory },
    { title: "Out of Stocks", data: inventoryStats.outOfStock },
    { title: "Low Stocks", data: inventoryStats.lowStock },
    { title: "Top Categories", data: inventoryStats.topCategory },
  ];

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
        return item.category?.toLowerCase().includes(value.toLowerCase());
      });
    }
    if (text.trim() !== "") {
      result = result.filter((item) => {
        return (
          item.productName?.toLowerCase().includes(text.trim().toLowerCase()) ||
          item.tags?.toLowerCase().includes(text.trim().toLowerCase())
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
                <h4>
                  {statsLoading ? (
                    <span className="loading-text">...</span>
                  ) : (
                    item.data
                  )}
                </h4>
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
                            fontWeight: item.current_stock === 0 ? "bold" : "normal"
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