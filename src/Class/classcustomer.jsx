import PeopleIcon from "@mui/icons-material/PeopleAltSharp";
import SearchIcon from "@mui/icons-material/SearchSharp";
import "../classCss/classcustomer.css";
import { useGetClassCustomer } from "../ClassApi";
import { useEffect, useState } from "react";
import { useNoti } from "../Hooks/alert";
import { useTableFooter } from "../Hooks/tablefooter";
function ClassCustomer() {
  const [Index, setIndex] = useState(0);
  const [filtered, setfiletered] = useState(null);
  const [text, settext] = useState(null);

  const { GetClassCustomers, ClassCustomers } = useGetClassCustomer();
  const { Loading, opensuccess, openconfirm, openerror, openloading } =
    useNoti();
  const { TableFooterJsx, startnumber, endnumber } = useTableFooter();

  useEffect(() => {
    GetClassCustomers();
  }, []);

  const textchange = (event) => {
    settext(event.target.value);
    console.log(text);
  };

  useEffect(() => {
    let result = ClassCustomers.data?.[Index]?.customers;
    if (Array.isArray(ClassCustomers.data?.[Index]?.customers)) {
      if (text) {
        result = result.filter((item) => {
          return (
            item?.name?.toLowerCase().includes(text.toLowerCase()) ||
            item?.court_name?.toLowerCase().includes(text.toLowerCase()) ||
            item?.phone?.toString().includes(text.toString())
          );
        });
      }
    }
    setfiletered(result);
  }, [text, ClassCustomers.data?.[Index], Index]);

  //delete customer
  async function delete_customer(id) {
    if (!id) return;
    let isConfimr = await openconfirm(
      "Deleting Customer?",
      "Are you sure to delete this customer",
    );
    if (!isConfimr) return;
    openloading();
    try {
      let response = await fetch(
        `${import.meta.env.VITE_CLASS_DELETE_MOBILE_BOOKING}/${id}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        {
          await GetClassCustomers();
          opensuccess(
            "Action Successful",
            "Customer deleted successfullly from list",
          );
        }
      } else {
        openerror("Something went wrong");
      }
    } catch (err) {
      console.log(err);
      openerror("Cannot connect with sever");
    }
  }

  // cc stand for class customer
  return (
    <div className="classcustomermain">
      <header className="ccheader">
        {Loading}
        <PeopleIcon sx={{ fontSize: "30px" }} />
        <h2>Customers</h2>
      </header>
      <div className="ccbody">
        <div className="ccnav">
          <div className="ccnav1">
            {Array.isArray(ClassCustomers.data) ? (
              ClassCustomers.data.length > 0 ? (
                ClassCustomers.data.map((item, index) => {
                  return (
                    <h3
                      key={index}
                      style={{
                        background: Index == index ? "#F0F0F0" : "initial",
                        color: Index == index ? "#0D1B2A" : "#ffffff",
                      }}
                      onClick={() => {
                        setIndex(index);
                      }}
                    >
                      {item.venue_name}
                    </h3>
                  );
                })
              ) : (
                <h3 style={{ color: "white" }}>No venue</h3>
              )
            ) : (
              <h3 style={{ color: "white" }}>Loading...</h3>
            )}
          </div>
          <div className="ccnav2">
            <input
              type="serach"
              placeholder="Search..."
              onChange={textchange}
            />
            <SearchIcon sx={{ color: "white" }} />
          </div>
        </div>
        <div className="towarpthetable">
          <div className="cctablewarper">
            <table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Phone No</th>
                  <th>Court Name</th>
                  <th>Date</th>
                  <th>Time Slot</th>
                  <th>Remarks</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(filtered) ? (
                  filtered.length > 0 ? (
                    filtered
                      .slice(startnumber, endnumber)
                      .map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.phone}</td>
                            <td>{item.court_name}</td>
                            <td>{item.date}</td>
                            <td>
                              {Array.isArray(item.time_slots) &&
                              item.time_slots.length > 0
                                ? `${item.time_slots[0].start_time.slice(0, 5)} - ${item.time_slots[0].end_time.slice(0, 5)}`
                                : "null"}
                            </td>
                            <td>{item.remarks}</td>
                            <td>
                              <div className="classactiondiv">
                                <button>{"[warning]"}</button>
                                <button
                                  onClick={() => delete_customer(item.id)}
                                >
                                  {"[Delete]"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                  ) : (
                    <tr>
                      <td colSpan={8} style={{ textAlign: "center" }}>
                        no result found
                      </td>
                    </tr>
                  )
                ) : (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center" }}>
                      Loading...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {TableFooterJsx}
        </div>
      </div>
    </div>
  );
}
export default ClassCustomer;
