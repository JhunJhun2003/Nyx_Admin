import { useCallback, useState } from "react";

export const useGetClassOrder = () => {
  const [ClassOrders, setClassOrders] = useState([]);

  const GetOrder = useCallback(async () => {
    try {
      let response = await fetch(import.meta.env.VITE_CLASS_GET_CANTEEM_ORDER, {
        method: "GET",
      });
      if (response.ok) {
        let data = await response.json();
        setClassOrders(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  return {
    GetOrder,
    ClassOrders,
  };
};
