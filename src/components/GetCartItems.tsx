import { useEffect, useState } from "react";
import { CartItem } from "./Interfaces";
import authenticatedAxios from "../auth/axiosInterceptors";
import { API_VIEW_CART_URL } from "../constants";

const GetCartItems = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await authenticatedAxios.get(API_VIEW_CART_URL);
        if (response.status === 200) {
          setCartItems(response.data.cart_items);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (!cartItems) {
      fetchCartItems();
    }
  }, [cartItems]);

  return cartItems;
};

export default GetCartItems;
