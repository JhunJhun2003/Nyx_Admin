import { useCallback, useState } from "react";

export const useGetProducts = () => {
  const [Products, setProducts] = useState([]);

  const GetProducts = useCallback(async () => {
    try {
      let reponse = await fetch(import.meta.env.VITE_GET_PRODUCTS, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (reponse.ok) {
        let data = await reponse.json();
        setProducts(data);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);
  return {
    Products,
    GetProducts,
  };
};
