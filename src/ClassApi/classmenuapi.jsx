import { useCallback, useState } from "react";

export const useGetClassMenu = () => {
  const [ClassMenu, setClassMenu] = useState([]);

  const GetClassmenu = useCallback(async () => {
    try {
      let response = await fetch(import.meta.env.VITE_CLASS_GET_MENU, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        let data = await response.json();
        setClassMenu(data);
        console.log(data);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  return {
    GetClassmenu,
    ClassMenu,
  };
};
