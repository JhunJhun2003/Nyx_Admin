import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import "./cssFolder/PosCustomer.css";
import { useContext, useEffect, useState } from "react";
import { Context } from "./Hooks/context";
import CustomerLoading from "./Components/loadingcustomer";
import { useGetCustomer } from "./Api_Call";
function PosCustomer() {
  const [text, settext] = useState("");
  const [filteredData, setfilteredData] = useState(null);

  const { backcolor, Token } = useContext(Context);
  const { GetCustomer, Customers } = useGetCustomer();
  const Font_color = Boolean(backcolor == "#1A1C1E");
  const FontStyle = {
    color: Font_color ? "#E1E1E1" : "#0D1B2A",
  };
  const InputStyle = {
    backgroundColor: Font_color ? "#E1E1E1" : "#0D1B2A",
  };

  const textchange = (event) => {
    settext(event.target.value);
  };

  useEffect(() => {
    if (
      Array.isArray(Customers.showCustomerData) &&
      Customers.showCustomerData.length > 0
    ) {
      setfilteredData(Customers.showCustomerData);
      if (!(text == "")) {
        let purifieddata = Customers.showCustomerData.filter((item) => {
          return (
            item.name
              .toLocaleLowerCase()
              .includes(text.toLocaleLowerCase().trim()) ||
            item.address?.toLocaleLowerCase().includes(text.toLocaleLowerCase())
          );
        });
        setfilteredData(purifieddata);
      } else return;
    }
  }, [text, Customers.showCustomerData]);

  useEffect(() => {
    GetCustomer();
  }, []);

  async function delete_customer(id) {
    try {
      let response = await fetch(
        `${import.meta.env.VITE_DELETE_CUSTOMER}/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
        },
      );
      if (response.ok) {
        await GetCustomer();
      } else {
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div className="Poscustomermain">
        <div className="Poscustomerheader">
          <h1 style={FontStyle}>
            <PersonIcon style={{ fontSize: "28px" }} />
            Customers
          </h1>
          <div style={InputStyle}>
            <input
              type="search"
              onChange={textchange}
              placeholder="Search..."
              style={{ color: !Font_color ? "white" : "#0D1B2A" }}
            />
            <SearchIcon />
          </div>
        </div>
        <div className="customertableContainer">
          <table className="customertable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Remark</th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredData) ? (
                filteredData.length > 0 ? (
                  filteredData.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.address}</td>
                        <td>{item.phone}</td>
                        <td>{item.email}</td>
                        <td>....</td>
                        <td className="customerbuttoncontainer">
                          <button className="editbutton">warning</button>
                          <button
                            className="deletebutton"
                            onClick={() => delete_customer(item.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      No data
                    </td>
                  </tr>
                )
              ) : (
                [...Array(10)].map((_, index) => (
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
export default PosCustomer;
