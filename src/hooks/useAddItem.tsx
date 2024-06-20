// import useCart from "./useCart";
// import Product from "../components/Interfaces";

// const useAddItem = () => {
//   const { cartItems, setCartItems } = useCart();

//   const addItem = (product: Product) => {
//     // Copy the current cart items
//     const currentCartItems = [...cartItems];

//     // Find the index of the product in the cart
//     const existingCartItem = currentCartItems.find(
//       (item) => item.product.id === product.id
//     );

//     // If the product is already in the cart, update the quantity
//     if (existingCartItem) {
//       existingCartItem.quantity += 1;
//     } else {
//       // If the product is not in the cart, add it
//       currentCartItems.push({
//         product,
//         quantity: 1,
//       });
//     }

//     // Update the cart items
//     setCartItems(currentCartItems);
//   };
//   console.log(cartItems);
//   return { addItem };
// };

// export default useAddItem;
