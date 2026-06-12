import { useCallback, useState } from "react";

export const useGetClassCustomer = () => {
  const [ClassCustomers, setClassCustomer] = useState([]);

  const GetClassCustomers = useCallback(async () => {
    try {
      let response = await fetch(import.meta.env.VITE_CLASS_GET_CUSTOMER, {
        method: "GET",
      });
      if (response.ok) {
        let data = await response.json();
        setClassCustomer(data);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  return {
    GetClassCustomers,
    ClassCustomers,
  };
};
