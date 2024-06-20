import { useEffect, useState } from "react";
import Product, { BaseProduct, Size } from "../components/Interfaces";
import authenticatedAxios from "../auth/axiosInterceptors";
import {
  API_PRODUCT_LIST_URL,
  API_PRODUCT_URL,
  API_PRODUCT_VARIANT_URL,
  API_SEARCH_PRODUCT_URL,
  API_SIZE_URL,
} from "../constants";
import SimpleAlert from "../components/SimpleAlert";
import Loader from "../common/Loader";

const ProductVariant = () => {
  const [Products, setProducts] = useState<BaseProduct[]>();
  const [productVariant, setProductVariant] = useState<Product[]>();
  const [size, setSize] = useState<Size[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [newProductVariant, setNewProductVariant] = useState<{
    id: number;
    color: string;
    image: string;
    description: string;
    actual_price: string;
    selling_price: string;
    discounted_price: string;
    discount_percentage: string;
    gender: string;
    product: string;
    size: string;
  }>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editableProduct, setEditableProduct] = useState<{
    id: number;
    color: string;
    image: string;
    description: string;
    actual_price: string;
    selling_price: string;
    discounted_price: string;
    discount_percentage: string;
    gender: string;
    product: number;
    size: number;
  }>();
  useEffect(() => {
    const fetchedProducts = async () => {
      setLoading(true);
      try {
        const response = await authenticatedAxios.get(API_PRODUCT_VARIANT_URL);
        const productResponse = await authenticatedAxios.get(
          API_PRODUCT_LIST_URL
        );
        const sizeResponse = await authenticatedAxios.get(API_SIZE_URL);
        if (response.status === 200) {
          setProductVariant(response.data);
        }
        if (productResponse.status === 200) {
          setProducts(productResponse.data);
        }
        if (sizeResponse.status === 200) {
          setSize(sizeResponse.data);
        }
      } catch (err: any) {
        if (err.response) {
          if (err.response.status === 400) {
            setError("Bad request. Please check your input.");
          } else if (err.response.status === 500) {
            setError("Internal server error. Please try again later.");
          } else {
            setError("An error occurred. Please try again.");
          }
        } else if (err.request) {
          // The request was made but no response was received
          setError("No response from the server. Please try again.");
        } else {
          // Something happened in setting up the request that triggered an Error
          setError("An error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchedProducts(); // Don't forget to call the function to trigger the useEffect
  }, []); // Add an empty dependency array to run the effect only once on mount

  const handleEditClick = (Product: Product) => {
    setEditableProduct({
      id: Product.id,
      color: Product.color,
      image: Product.image,
      description: Product.description,
      actual_price: Product.actual_price,
      selling_price: Product.selling_price,
      discounted_price: Product.discounted_price,
      discount_percentage: Product.discounted_price,
      gender: Product.gender,
      product: Product.product.id,
      size: Product.size.id,
    });
  };

  const handleSaveClick = async () => {
    if (editableProduct) {
      try {
        setLoading(true);
        // Make a request to update the Product name
        const response = await authenticatedAxios.put(
          `${API_PRODUCT_URL}${editableProduct.id}/`,
          {
            color: editableProduct.color,
            image: editableProduct.image,
            description: editableProduct.description,
            actual_price: editableProduct.actual_price,
            selling_price: editableProduct.selling_price,
            discounted_price: editableProduct.discounted_price,
            discount_percentage: editableProduct.discounted_price,
            gender: editableProduct.gender,
            product: editableProduct.product,
            size: editableProduct.size,
          }
        );
        if (response.status === 200) {
          const response = await authenticatedAxios.get(API_PRODUCT_LIST_URL);
          setProducts(response.data);
        }

        setEditableProduct(undefined); // Disable editing mode
      } catch (error) {
        // handle error
      } finally {
        setLoading(false);
      }
    }
  };
  const addNewProductVariant = async () => {
    if (newProductVariant) {
      try {
        setLoading(true);

        const response = await authenticatedAxios.post(`${API_PRODUCT_URL}`, {
          color: newProductVariant.color,
          image: newProductVariant.image,
          description: newProductVariant.description,
          actual_price: newProductVariant.actual_price,
          selling_price: newProductVariant.selling_price,
          discounted_price: newProductVariant.discounted_price,
          discount_percentage: newProductVariant.discounted_price,
          gender: newProductVariant.gender,
          product: newProductVariant.product,
          size: newProductVariant.size,
        });
        if (response.status === 200) {
          const productResponse = await authenticatedAxios.get(
            API_PRODUCT_LIST_URL
          );

          setProducts(productResponse.data);
        }

        // Reset the newProductVariant state
        setNewProductVariant(undefined);

        setOpenModal(false); // Disable editing mode
      } catch (err: any) {
        if (err.response) {
          if (err.response.status === 400) {
            setError("Bad request. Please check your input.");
          } else if (err.response.status === 500) {
            setError("Internal server error. Please try again later.");
          } else {
            setError("An error occurred. Please try again.");
          }
        } else if (err.request) {
          // The request was made but no response was received
          setError("No response from the server. Please try again.");
        } else {
          // Something happened in setting up the request that triggered an Error
          setError("An error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelClick = () => {
    setEditableProduct(undefined); // Cancel editing
  };

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editableProduct) {
      setEditableProduct((prevEditableProduct) => ({
        ...prevEditableProduct!,
        [event.target.name]: event.target.value,
      }));
    }
  };

  const handleSearch = async (searchKeyword: string) => {
    try {
      setLoading(true);
      // Make a request to update the Product name
      const response = await authenticatedAxios.get(
        `${API_SEARCH_PRODUCT_URL}?search=${searchKeyword}`
      );

      // Update the Products state after successful update
      setProducts(response.data);

      // Reset the newProductVariant state
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 400) {
          setError("Bad request. Please check your input.");
        } else if (err.response.status === 500) {
          setError("Internal server error. Please try again later.");
        } else {
          setError("An error occurred. Please try again.");
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError("No response from the server. Please try again.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      {error && <SimpleAlert msg={error} />}
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <div className=" flex justify-between m-2">
            <form className="flex items-center">
              <label className="sr-only">Search</label>
              <div className="relative w-full">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    width="20"
                    height="20"
                    className="DocSearch-Search-Icon"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
                      stroke="currentColor"
                      fill="none"
                      fillRule="evenodd"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </div>
                <input
                  type="text"
                  id="simple-search"
                  onChange={(e) => handleSearch(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 placeholder-gray-800"
                  placeholder="Search..."
                  required
                />
              </div>
              <button
                type="submit"
                className="hidden xs:inline p-2.5 ms-2 text-sm font-medium text-white bg-blue-500 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 sm:p-2 xs:p-1.5"
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
                <span className="sr-only">Search</span>
              </button>
            </form>
            <button
              className="bg-success  m-1 text-xs  px-2 text-white rounded-full"
              onClick={() => setOpenModal(true)}
            >
              + Add Product
            </button>
            {openModal && (
              <div className="fixed bg-gray-200 z-50 top-30 left-1/2 transform -translate-x-1/2 flex items-between justify-between w-80 px-4 py-2 shadow-lg font-regular">
                <button
                  type="button"
                  className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => setOpenModal(false)}
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
                <div className="p-4 md:p-5">
                  <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                    Add a New Product
                  </h3>

                  <div className="mb-4">
                    <label
                      htmlFor="product"
                      className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                      Product
                    </label>
                    <select
                      name="product"
                      id="product"
                      onChange={(e) =>
                        setNewProductVariant((prevProduct) => ({
                          ...prevProduct!,
                          brand: parseInt(e.target.value, 10), // Convert to number
                        }))
                      }
                      className="w-full p-2 border rounded-md placeholder-text-gray-600"
                    >
                      <option value="" disabled selected>
                        Select Product
                      </option>
                      {Products &&
                        Products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="size"
                      className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                      Size
                    </label>
                    <select
                      name="size"
                      id="size"
                      onChange={(e) =>
                        setNewProductVariant((prevProduct) => ({
                          ...prevProduct!,
                          size: e.target.value, // Convert to number
                        }))
                      }
                      className="w-full p-2 border rounded-md placeholder-text-gray-600"
                    >
                      <option value="" disabled selected>
                        Select Size
                      </option>
                      {size &&
                        size.map((size) => (
                          <option key={size.id} value={size.id}>
                            {size.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="color"
                      className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                      Color
                    </label>
                    <input
                      type="text"
                      id="color"
                      onChange={(e) =>
                        setNewProductVariant((prevProduct) => ({
                          ...prevProduct!,
                          color: e.target.value,
                        }))
                      }
                      placeholder="Enter Color"
                      className="w-full p-2 border rounded-md placeholder-text-gray-600"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                      Description
                    </label>
                    <input
                      type="text"
                      id="description"
                      onChange={(e) =>
                        setNewProductVariant((prevProduct) => ({
                          ...prevProduct!,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Enter description"
                      className="w-full p-2 border rounded-md placeholder-text-gray-600"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="actualPrice"
                      className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                      Actual Price
                    </label>
                    <input
                      type="text"
                      id="actualPrice"
                      onChange={(e) =>
                        setNewProductVariant((prevProduct) => ({
                          ...prevProduct!,
                          actual_price: e.target.value,
                        }))
                      }
                      placeholder="Enter actual price"
                      className="w-full p-2 border rounded-md placeholder-text-gray-600"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="sellingPrice"
                      className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                      Selling Price
                    </label>
                    <input
                      type="text"
                      id="sellingPrice"
                      onChange={(e) =>
                        setNewProductVariant((prevProduct) => ({
                          ...prevProduct!,
                          selling_price: e.target.value,
                        }))
                      }
                      placeholder="Enter selling price"
                      className="w-full p-2 border rounded-md placeholder-text-gray-600"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="discountedPrice"
                      className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                      After discount
                    </label>
                    <input
                      type="text"
                      id="discountedPrice"
                      onChange={(e) =>
                        setNewProductVariant((prevProduct) => ({
                          ...prevProduct!,
                          discounted_price: e.target.value,
                        }))
                      }
                      placeholder="Enter price after discount"
                      className="w-full p-2 border rounded-md placeholder-text-gray-600"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="discountPercentage"
                      className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                      Discount percentage
                    </label>
                    <input
                      type="text"
                      id="discountPercentage"
                      onChange={(e) =>
                        setNewProductVariant((prevProduct) => ({
                          ...prevProduct!,
                          discount_percentage: e.target.value,
                        }))
                      }
                      placeholder="Enter discount percentage"
                      className="w-full p-2 border rounded-md placeholder-text-gray-600"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="gender"
                      className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                      Gender
                    </label>
                    <input
                      type="text"
                      id="gender"
                      onChange={(e) =>
                        setNewProductVariant((prevProduct) => ({
                          ...prevProduct!,
                          gender: e.target.value,
                        }))
                      }
                      placeholder="Enter discount percentage"
                      className="w-full p-2 border rounded-md placeholder-text-gray-600"
                    />
                  </div>

                  {/* Modal footer */}
                  <div className="flex items-center mt-6 space-x-4 rtl:space-x-reverse">
                    <button
                      onClick={addNewProductVariant}
                      type="button"
                      className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setOpenModal(false)}
                      type="button"
                      className="w-full text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-md border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <table className="w-full  max-h-100 overflow-y-auto table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Product
                </th>
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Image
                </th>
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Color
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Size
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Description
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Actual Price
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Selling Price
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Final Price
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Gender
                </th>
              </tr>
            </thead>
            <tbody>
              {productVariant &&
                productVariant.map((variant: Product) => (
                  <tr key={variant.id}>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      {editableProduct && editableProduct.id === variant.id ? (
                        <select
                          key={variant.id}
                          name="product"
                          onChange={(e) =>
                            setEditableProduct((prevProduct) => ({
                              ...prevProduct!,
                              product: parseInt(e.target.value, 10), // Convert to number
                            }))
                          }
                          placeholder="Select Product"
                          className="m-4 font-medium border text-black rounded p-1 placeholder-text-gray-600"
                        >
                          {Products &&
                            Products.map((product) => (
                              <option key={product.id} value={product.id}>
                                {product.name}
                              </option>
                            ))}
                        </select>
                      ) : (
                        <h5 className="font-medium text-black">
                          {String(variant.product)}
                        </h5>
                      )}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      {editableProduct && editableProduct.id === variant.id ? (
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            name="image"
                            className="font-medium text-black rounded p-1"
                          />
                          {editableProduct.image && (
                            <img
                              src={editableProduct.image}
                              alt="Product Image"
                              className="mt-2 max-h-20"
                            />
                          )}
                        </div>
                      ) : (
                        // Display existing image or placeholder
                        <img
                          src={variant.image}
                          alt="Product Image"
                          className="max-h-20"
                        />
                      )}
                    </td>

                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      {editableProduct && editableProduct.id === variant.id ? (
                        <input
                          type="text"
                          value={editableProduct.color}
                          name="color"
                          onChange={handleFieldChange}
                          className="font-medium text-black rounded p-1"
                        />
                      ) : (
                        <h5 className="font-medium text-black dark:text-white">
                          {variant.color}
                        </h5>
                      )}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      {editableProduct && editableProduct.id === variant.id ? (
                        <select
                          name="size"
                          key={variant.id}
                          onChange={(e) =>
                            setEditableProduct((prevProduct) => ({
                              ...prevProduct!,
                              category: parseInt(e.target.value, 10), // Convert to number
                            }))
                          }
                          placeholder="Select Size"
                          className="m-4 font-medium border text-black rounded p-1 placeholder-text-gray-600"
                        >
                          {size &&
                            size.map((size: Size) => (
                              <option key={size.id} value={size.id}>
                                {size.name}
                              </option>
                            ))}
                        </select>
                      ) : (
                        <h5 className="font-medium text-black dark:text-white">
                          {String(variant.size)}
                        </h5>
                      )}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      {editableProduct && editableProduct.id === variant.id ? (
                        <input
                          type="text"
                          name="description"
                          value={editableProduct.description}
                          onChange={handleFieldChange}
                          className="font-medium text-black rounded p-1"
                        />
                      ) : (
                        <h5 className="font-medium text-black dark:text-white">
                          {variant.description}
                        </h5>
                      )}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      {editableProduct && editableProduct.id === variant.id ? (
                        <input
                          type="text"
                          name="actual_price"
                          value={editableProduct.actual_price}
                          onChange={handleFieldChange}
                          className="font-medium text-black rounded p-1"
                        />
                      ) : (
                        <h5 className="font-medium text-black dark:text-white">
                          {variant.actual_price}
                        </h5>
                      )}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      {editableProduct && editableProduct.id === variant.id ? (
                        <input
                          type="text"
                          name="selling_price"
                          value={editableProduct.selling_price}
                          onChange={handleFieldChange}
                          className="font-medium text-black rounded p-1"
                        />
                      ) : (
                        <h5 className="font-medium text-black dark:text-white">
                          {variant.selling_price}
                        </h5>
                      )}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      {editableProduct && editableProduct.id === variant.id ? (
                        <input
                          type="text"
                          name="discounted_price"
                          value={editableProduct.discounted_price}
                          onChange={handleFieldChange}
                          className="font-medium text-black rounded p-1"
                        />
                      ) : (
                        <h5 className="font-medium text-black dark:text-white">
                          {variant.discounted_price}
                        </h5>
                      )}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      {editableProduct && editableProduct.id === variant.id ? (
                        <input
                          type="text"
                          value={editableProduct.discount_percentage}
                          name="discount_percentage"
                          onChange={handleFieldChange}
                          className="font-medium text-black rounded p-1"
                        />
                      ) : (
                        <h5 className="font-medium text-black dark:text-white">
                          {variant.discount_percentage}
                        </h5>
                      )}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      {editableProduct && editableProduct.id === variant.id ? (
                        <input
                          type="text"
                          name="gender"
                          value={editableProduct.gender}
                          onChange={handleFieldChange}
                          className="font-medium text-black rounded p-1"
                        />
                      ) : (
                        <h5 className="font-medium text-black dark:text-white">
                          {variant.gender}
                        </h5>
                      )}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {editableProduct && editableProduct.id === variant.id ? (
                        <div className="flex items-center space-x-3.5">
                          <button
                            className="bg-success px-2 text-white rounded-full"
                            onClick={handleSaveClick}
                          >
                            save
                          </button>
                          <button
                            className="bg-gray-700 px-2 text-white rounded-full"
                            onClick={handleCancelClick}
                          >
                            cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <button
                            className="bg-blue-700 px-2 text-white rounded-full"
                            onClick={() => handleEditClick(variant)}
                          >
                            edit
                          </button>
                          <button
                            className="bg-red-00 px-2 text-white rounded-full"
                            onClick={() => handleEditClick(variant)}
                          >
                            del
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ProductVariant;
