// // CartContext.tsx
// import { createContext, useState } from "react";
// import Product from "./Interfaces";

// interface ICartItemsContext {
//   cartItems: CartProduct[];
//   setCartItems: (cartItems: CartProduct[]) => void;
// }

// export const CartItemsContext = createContext<ICartItemsContext>({
//   cartItems: [],
//   setCartItems: () => {},
// });

// export const CartItemsProvider = ({ children }: any) => {
//   const [cartItems, setCartItems] = useState<CartProduct[]>([]);
//   return (
//     <CartItemsContext.Provider value={{ cartItems, setCartItems }}>
//       {children}
//     </CartItemsContext.Provider>
//   );
// };
