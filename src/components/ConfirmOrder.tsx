// Cart.tsx
import { useEffect, useState } from "react";
import SuccessPNG from "../assets/images/success.png";
import authenticatedAxios from "../auth/axiosInterceptors";
import {
  API_ADD_CART_URL,
  API_BASE_URL,
  API_CONFIRM_ORDER_URL,
  API_PAYMENT_URL,
  API_USER_ADDRESS_URL,
  API_VIEW_CART_URL,
} from "../constants";
import { CartItem } from "./Interfaces";
import DotLoader from "./DotLoader";
import { Link, NavLink } from "react-router-dom";
import Spinner from "./Spinner";
import { States } from "../constants/Data";
import { Address } from "./Interfaces";
import SimpleAlert from "./SimpleAlert";

function ConfirmOrder() {
  const [loading, setLoading] = useState<boolean>(true);
  const [changeAddress, setChangeAddress] = useState<boolean>(false);
  const [checkOut, setCheckOut] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>();
  const [address, setAddress] = useState<Address>();
  const [msg, setMsg] = useState<string>();
  const [price, setPrice] = useState({
    total: "",
    discount: "",
    savingPrice: "",
  });
  const [updatedAddress, setupdatedAddress] = useState<any>();

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setupdatedAddress({ ...updatedAddress, [name]: value });
  };
  const [selectedOption, setSelectedOption] = useState<any>();

  // Define data for each payment option
  const paymentOptionsData: any = {
    UPI: { isAvialable: true },
    Card: { isAvialable: true },
    netBanking: {
      isAvialable: true,
    },
    cashOnDelivery: {
      isAvialable: true,
    },
  };

  const handleOptionChange = (option: any) => {
    setSelectedOption(option);
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const response = await authenticatedAxios.get(API_VIEW_CART_URL);
        if (response.status === 200) {
          setCartItems(response.data.cart_items);
          console.log(response);
          setPrice({
            total: response.data.total_price,
            discount: response.data.total_discounted_price,
            savingPrice: response.data.saving_price,
          });
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
  }, [cartItems]);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        setLoading(true);
        const addressResponse = await authenticatedAxios.get(
          API_USER_ADDRESS_URL
        );
        if (addressResponse.status === 200) {
          setAddress(addressResponse.data[0]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (!address) {
      fetchAddress();
    }
  }, [address]);

  const handleRemoveItem = async (cartId: number) => {
    setLoading(true);
    try {
      const response = await authenticatedAxios.delete(
        `${API_ADD_CART_URL}${cartId}`
      );
      if (response.status === 204) {
        const cartResponse = await authenticatedAxios.get(API_VIEW_CART_URL);
        if (cartResponse.status === 200) {
          setCartItems(cartResponse.data.cart_items);
          setPrice({
            total: cartResponse.data.total_price,
            discount: cartResponse.data.total_discounted_price,
            savingPrice: cartResponse.data.saving_price,
          });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (method: string, amount: Number) => {
    setLoading(true);
    try {
      const response = await authenticatedAxios.post(`${API_PAYMENT_URL}`, {
        payment_method: method,
        amount: amount,
      });
      console.log(method, amount);
      if (response.status === 200) {
        const orderResponse = await authenticatedAxios.post(
          API_CONFIRM_ORDER_URL,
          {
            payment: response.data.id,
          }
        );
        if (orderResponse.status === 200) {
          console.log(orderResponse.data);
          setMsg("Order created successfully");
        }
      }
    } catch (error) {
      console.log(error);
      setMsg("something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const handleChangeAdress = async (addressId: Number) => {
    setLoading(true);
    try {
      const response = await authenticatedAxios.patch(
        `${API_USER_ADDRESS_URL}${addressId}/`,
        {
          ...updatedAddress,
        }
      );
      if (response.status === 200) {
        setChangeAddress(false);
        const changeResponse = await authenticatedAxios.get(
          API_USER_ADDRESS_URL
        );
        if (changeResponse.status === 200) {
          setAddress(changeResponse.data[0]);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (
    productId: number,
    action: string,
    cartId: number
  ) => {
    setLoading(true);
    try {
      const response = await authenticatedAxios.patch(
        `${API_ADD_CART_URL}${cartId}/`,
        {
          product_id: productId,
          action: action,
        }
      );
      if (response.status === 200) {
        const cartResponse = await authenticatedAxios.get(API_VIEW_CART_URL);
        if (cartResponse.status === 200) {
          setCartItems(cartResponse.data.cart_items);
          setPrice({
            total: cartResponse.data.total_price,
            discount: cartResponse.data.total_discounted_price,
            savingPrice: cartResponse.data.saving_price,
          });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems) {
    return <DotLoader />;
  }
  if (!address) {
    return <DotLoader />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
      {loading ? (
        <Spinner />
      ) : (
        !confirm && (
          <>
            {msg && <SimpleAlert msg={msg} />}
            {changeAddress && (
              <div className="relative bg-white rounded-lg shadow-lg">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                  <h3 className="text-lg font-semibold text-gray-black">
                    Change Address
                  </h3>
                  <button
                    onClick={() => {
                      setChangeAddress(false);
                    }}
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-toggle="crud-modal"
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                <div className="p-4 md:p-5">
                  <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2">
                      <label className="block mb-2 text-sm font-medium text-gray-900 ">
                        Apartment / building
                      </label>
                      <input
                        type="text"
                        name="apartment_number"
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary placeholder-gray-600 focus:border-primary block w-full p-2.5"
                        placeholder="Apartment / building "
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block mb-2 text-sm font-medium text-gray-900 ">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="street_address"
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-600"
                        placeholder="street address"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block mb-2 text-sm font-medium text-gray-900 ">
                        Land mark
                      </label>
                      <input
                        type="text"
                        name="landmark"
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-600"
                        placeholder="landmark"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        State
                      </label>
                      <select
                        onChange={handleInputChange}
                        name="state"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 placeholder-gray-600"
                      >
                        <option value={""} disabled>
                          Select State
                        </option>
                        {States.map((state, index) => (
                          <option key={index} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        City
                      </label>
                      <input
                        name="city"
                        onChange={handleInputChange}
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-600"
                        placeholder="city / town"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Pincode
                      </label>
                      <input
                        name="pin_code"
                        onChange={handleInputChange}
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-600"
                        placeholder="pincode e.g 562102"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row space-x-6">
                    <button
                      onClick={() => {
                        handleChangeAdress(address.id);
                      }}
                      type="submit"
                      className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center placeholder-gray-600"
                    >
                      <svg
                        className="me-1 -ms-1 w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setChangeAddress(false);
                      }}
                      className="text-white inline-flex items-center bg-neutral-600 hover:bg-neutral-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center placeholder-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="w-full mb-4 sm:m-4 ">
              <div className="flex flex-row bg-blue-500 mt-0 mx-4">
                <h2 className="md:text-xl lg:text-xl xl:text-xl font-semibold text-gray-200 p-4 flex items-center">
                  DELIVERY ADDRESS
                  {address && (
                    <svg
                      className="ml-2 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </h2>
              </div>
              <div className="p-4 mt-0 mx-4 border border-gray">
                {address && (
                  <div className="flex flex-col sm:flex-row  justify-between">
                    <p className="text-black">
                      {address.apartment_number} {address.street_address}{" "}
                      {address.landmark} {address.city} {address.state}{" "}
                      <strong>{address.pin_code}</strong>
                    </p>

                    <div className="mt-4 sm:mt-0">
                      <button
                        onClick={() => {
                          setChangeAddress(true);
                        }}
                        className="px-6 py-2 font-bold rounded-sm shadow-sm border text-blue-500 border-gray-500"
                      >
                        CHANGE
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full mb-4 sm:m-4">
              <div className="flex flex-row bg-blue-500 mt-0 mx-4">
                <h2 className="md:text-xl lg:text-xl xl:text-xl font-semibold text-gray-200 p-4 flex items-center">
                  ORDER SUMMARY
                  {cartItems.length > 0 && (
                    <svg
                      className="ml-2 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </h2>
              </div>
              {cartItems.length > 0 ? (
                <>
                  <div className="p-1 mt-0 mx-4 border border-gray">
                    <div className="sm:m-4 grid grid-cols-1 md:grid-cols-1 gap-8">
                      <section>
                        <ul className="divide-y divide-gray-200">
                          {!checkOut ? (
                            <>
                              {cartItems.map((product) => (
                                <li
                                  key={product.product.id}
                                  className="flex flex-col sm:flex-row"
                                >
                                  <div className="pl-4 flex-shrink-0">
                                    <Link
                                      to={
                                        "/product/" +
                                        product.product.product_token
                                      }
                                      className="font-semibold text-black"
                                    >
                                      <img
                                        src={
                                          API_BASE_URL + product.product.image
                                        }
                                        alt={product.product.product.name}
                                        className="sm:h-50 sm:w-50 h-40 w-40 rounded-md object-contain object-center"
                                      />
                                    </Link>
                                  </div>
                                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                      <div>
                                        <div className="flex justify-between">
                                          <h3 className="text-sm">
                                            {product.product.product.name}
                                          </h3>
                                        </div>
                                        <div className="mt-1 flex text-sm">
                                          <p className="text-sm text-gray-700">
                                            Color: {product.product.color}
                                          </p>
                                          {product.product.size ? (
                                            <p className="ml-4 border-l border-gray-200 pl-4 text-sm text-gray-700">
                                              Size: {product.product.size.name}
                                            </p>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                        <div className="mt-1 flex items-end">
                                          <p className="text-xs font-medium text-gray-700 line-through">
                                            {new Intl.NumberFormat("en-US", {
                                              style: "currency",
                                              currency: "INR",
                                            }).format(
                                              Number(
                                                product.product.selling_price
                                              ) * Number(product.quantity)
                                            )}
                                          </p>
                                          &nbsp;&nbsp;
                                          <p className="text-sm font-medium text-green-500">
                                            {new Intl.NumberFormat("en-US", {
                                              style: "currency",
                                              currency: "INR",
                                            }).format(
                                              Number(
                                                product.product.discounted_price
                                              ) * Number(product.quantity)
                                            )}
                                          </p>
                                        </div>

                                        <div className="mt-1 flex flex-row">
                                          <button
                                            disabled={product.quantity <= 1}
                                            className="mt-4 ml-1 border border-gray-700 text-indigo-500 w-8 h-8 rounded-full"
                                            onClick={() =>
                                              handleUpdate(
                                                product.product.id,
                                                "sub",
                                                product.id
                                              )
                                            }
                                          >
                                            -
                                          </button>
                                          <input
                                            className="mt-4 ml-1 font-medium text-xs text-center text-black w-8 h-8  border border-gray-700 rounded-lg "
                                            value={product.quantity}
                                            disabled
                                          />
                                          <button
                                            className="mt-4 ml-1  border border-gray-700 text-indigo-500 w-8 h-8 rounded-full"
                                            onClick={() =>
                                              handleUpdate(
                                                product.product.id,
                                                "add",
                                                product.id
                                              )
                                            }
                                          >
                                            +
                                          </button>
                                        </div>
                                        <button
                                          className="m-4  text-red-500 text-center hover:bg-red-500 hover:text-white rounded p-2 "
                                          onClick={() =>
                                            handleRemoveItem(product.id)
                                          }
                                        >
                                          remove
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                              <div className="m-4 w-full  bg-white p-4">
                                <button
                                  className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-800"
                                  onClick={() => {
                                    setCheckOut(true);
                                  }}
                                >
                                  Continue
                                </button>
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col sm:flex-row  justify-between">
                              <p className="text-black font-bold">
                                {" "}
                                {cartItems.length} item
                              </p>

                              <div className="mt-4 sm:mt-0">
                                <button
                                  onClick={() => {
                                    setCheckOut(false);
                                  }}
                                  className="px-6 py-2 font-bold rounded-sm shadow-sm border text-blue-500 border-gray-500"
                                >
                                  CHANGE
                                </button>
                              </div>
                            </div>
                          )}
                        </ul>
                      </section>
                    </div>
                  </div>
                  <div className="w-full mb-4 sm:m-4">
                    <div className="flex flex-row bg-blue-500 m-4">
                      <h2 className="md:text-xl lg:text-xl xl:text-xl font-semibold text-gray-200 p-4 flex items-center">
                        PAYMENT DETAILS
                        {address && (
                          <svg
                            className="ml-2 h-5 w-5 text-green-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </h2>
                    </div>

                    <div className="p-4 mt-0 mx-4 border border-gray">
                      {checkOut && (
                        <>
                          <>
                            <ul className="w-full mb-4 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                              {Object.keys(paymentOptionsData).map((option) => (
                                <li
                                  key={option}
                                  className={`w-full border-b border-gray-200 ${
                                    selectedOption === option
                                      ? "rounded-t-lg"
                                      : ""
                                  } dark:border-gray-600`}
                                >
                                  <div className="flex items-center ps-3">
                                    <input
                                      type="radio"
                                      disabled={
                                        paymentOptionsData[option].isAvialable
                                      }
                                      value={option}
                                      name="paymentOption"
                                      checked={selectedOption === option}
                                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                    />
                                    <label
                                      className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer"
                                      onClick={() => handleOptionChange(option)}
                                    >
                                      {option === "netBanking"
                                        ? "Net Banking"
                                        : option}
                                    </label>
                                  </div>
                                </li>
                              ))}
                            </ul>

                            {/* Display corresponding data based on the selected option */}
                            <div className="mt-4">
                              {selectedOption === "UPI" ? (
                                <>
                                  <div className="bg-gray-100 p-4 rounded-lg">
                                    {paymentOptionsData[selectedOption]
                                      .isAvialable
                                      ? "true"
                                      : "false"}
                                  </div>
                                  <button
                                    onClick={() =>
                                      createOrder("UPI", Number(price.total))
                                    }
                                    style={{ marginTop: "100px" }}
                                    className="bg-blue-500 m-4 text-white py-2 px-4 rounded-full hover:bg-blue-800"
                                  >
                                    Confirm
                                  </button>
                                </>
                              ) : selectedOption === "cashOnDelivery" ? (
                                <>
                                  <div className="bg-gray-100 p-4 rounded-lg">
                                    {paymentOptionsData[selectedOption]
                                      .isAvialable ? (
                                      <>
                                        <p>
                                          Total Amount{" "}
                                          <strong>
                                            {new Intl.NumberFormat("en-US", {
                                              style: "currency",
                                              currency: "INR",
                                            }).format(Number(price.discount))}
                                          </strong>
                                        </p>
                                      </>
                                    ) : (
                                      "false"
                                    )}
                                  </div>
                                  <button
                                    onClick={() => {
                                      // Assuming 'price.discount' is a number
                                      const formattedDiscount = Number(
                                        Number(price.discount).toFixed(2)
                                      );

                                      createOrder(
                                        "Cash On Delivery",
                                        formattedDiscount
                                      );
                                      setConfirm(true);
                                    }}
                                    style={{ marginTop: "100px" }}
                                    className="bg-blue-500 m-4 text-white py-2 px-4 rounded-full hover:bg-blue-800"
                                  >
                                    Confirm
                                  </button>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          </>
                        </>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col items-center m-4 p-2 bg-white border border-gray-400">
                    <p className="text-center m-4">No more items in cart</p>
                    <NavLink
                      className="bg-blue-500 m-4 w-30 text-center text-white py-2 px-4 rounded-lg hover:bg-blue-800"
                      to="/"
                    >
                      Shop now
                    </NavLink>
                  </div>
                </>
              )}
            </div>
          </>
        )
      )}
      {confirm && (
        <div className="flex flex-col items-center bg-gray-200 rounded-b-lg py-12 px-4 lg:px-24 shadow-md hover:shadow-lg">
          <h1 className="text-center text-2xl sm:text-3xl text-success font-400">
            <b>Order Placed Successfully</b>
          </h1>
          <div className="center">
            <img
              style={{ width: "100px", marginTop: "6%" }}
              src={SuccessPNG}
              alt=""
            />
          </div>
          <h2 className="text-center text-xl text-black font-light">
            <b>Thank you for chosing ManmaLethers</b>
          </h2>
          <button
            type="button"
            className="mt-5 p-3 text-white bg-blue-500 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            <Link to="/p/orders">Go to My orders</Link>
          </button>
        </div>
      )}
    </div>
  );
}

export default ConfirmOrder;
