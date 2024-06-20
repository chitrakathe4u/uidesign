import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../common/Loader";
import ErrorAlert from "./ErrorAlert";
import {
  API_ADD_CART_URL,
  API_PRODUCT_DETAIL_URL,
  API_VIEW_CART_URL,
} from "../constants";
import Product, { CartItem } from "./Interfaces";
import authenticatedAxios from "../auth/axiosInterceptors";
import SimpleAlert from "./SimpleAlert";
import SearchResults from "./SearchResults";

function ProductDetails() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const { id } = useParams();
  const [product, setProduct] = useState<Product>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>();
  const [cartItems, setCartItems] = useState<CartItem[]>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_PRODUCT_DETAIL_URL}${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError("Error occurred while fetching product details");
      } finally {
        setLoading(false);
      }
    };

    if (!product) {
      fetchData();
    }
  }, [id, product]);

  useEffect(() => {
    // Clear success and error messages after 4 seconds
    const timeout = setTimeout(() => {
      setMsg(undefined);
    }, 4000);

    // Cleanup the timeout to avoid memory leaks
    return () => clearTimeout(timeout);
  }, [msg]);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchCartItems = async () => {
        try {
          setLoading(true);
          const response = await authenticatedAxios.get(API_VIEW_CART_URL);
          if (response.status === 200) {
            setCartItems(response.data.cart_items);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

      if (!cartItems) {
        fetchCartItems();
      }
    }
  }, [cartItems]);

  const addCart = async () => {
    if (isLoggedIn) {
      try {
        setLoading(true);
        const response = await authenticatedAxios.post(API_ADD_CART_URL, {
          product: product?.id,
          quantity: 1,
        });
        if (response.status === 201) {
          setMsg("Product added to cart");
          const response = await authenticatedAxios.get(API_VIEW_CART_URL);
          if (response.status === 200) {
            setCartItems(response.data.cart_items);
          }
        } else {
          setMsg("Something went wrong");
        }
      } catch (error) {
        console.error("Error adding product to cart");
        setMsg("Something went wrong");
      } finally {
        setLoading(false);
      }
    } else {
      window.location.href = "/login";
    }
  };

  const handleBuyNow = (product_token: string) => {
    window.location.href = `/p/cart/${product_token}`;
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      {msg && <SimpleAlert msg={msg} />}
      {loading || !product ? (
        <Loader />
      ) : error ? (
        <ErrorAlert error={error} />
      ) : (
        <>
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <img
                src={product?.image}
                alt={product?.product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-semibold text-gray-800">
                  {product?.product.name}
                </h2>
                <p className="text-gray-600 mb-2">
                  Brand: {product?.product.brand.name}
                </p>
                <p className="text-gray-600 mb-2">Color: {product?.color}</p>
                <p className="text-gray-800 mb-4">{product?.description}</p>
                <div className="flex items-center mb-4">
                  <p className="text-2xl font-bold text-green-600">
                    &#x20B9;{product?.discounted_price}
                  </p>
                  <p className="text-sm line-through text-gray-500 ml-2">
                    &#x20B9;{product?.selling_price}
                  </p>
                  <p className="text-sm text-red-500 ml-2">
                    {product?.discount_percentage}% off
                  </p>
                </div>
              </div>
              <div className="flex space-x-4">
                {cartItems &&
                cartItems.some((item) => item.product.id === product?.id) ? (
                  <Link
                    to="/p/cart"
                    className="flex-1 px-4 py-2 border text-center border-blue-500 text-white rounded-md bg-blue-500 hover:bg-blue-700"
                  >
                    View Cart
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      if (isLoggedIn) {
                        addCart();
                      } else {
                        window.location.href = "/login";
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-blue-500 text-white rounded-md bg-blue-500 hover:bg-blue-700"
                  >
                    Add to Cart
                  </button>
                )}
                <button
                  onClick={() => handleBuyNow(product.product_token)}
                  className="flex-1 px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:text-white hover:bg-blue-500"
                >
                  Buy now
                </button>
              </div>
            </div>
          </section>
          {<SearchResults query={product.product.category.name} />}
        </>
      )}
    </div>
  );
}

export default ProductDetails;
