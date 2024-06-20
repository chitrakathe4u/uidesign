import { useEffect, useState } from "react";
import { Brand } from "../components/Interfaces";
import authenticatedAxios from "../auth/axiosInterceptors";
import { API_BRAND_URL, API_SEARCH_BRAND_URL } from "../constants";
import SimpleAlert from "../components/SimpleAlert";
import Loader from "../common/Loader";

const Brands = () => {
  const [brands, setBrands] = useState<Brand[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [newBrand, setNewBrand] = useState<string>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editableBrand, setEditableBrand] = useState<{
    id: number;
    name: string;
  } | null>(null);
  useEffect(() => {
    const fetchedBrands = async () => {
      setLoading(true);
      try {
        const response = await authenticatedAxios.get(API_BRAND_URL);
        if (response.status === 200) {
          setBrands(response.data);
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

    fetchedBrands(); // Don't forget to call the function to trigger the useEffect
  }, []); // Add an empty dependency array to run the effect only once on mount

  const handleEditClick = (brand: Brand) => {
    setEditableBrand({ id: brand.id, name: brand.name });
  };

  const handleSaveClick = async () => {
    if (editableBrand) {
      try {
        setLoading(true);
        // Make a request to update the brand name
        await authenticatedAxios.put(`${API_BRAND_URL}${editableBrand.id}/`, {
          name: editableBrand.name,
        });
        // Update the brands state after successful update
        setBrands(
          (prevBrands) =>
            prevBrands &&
            prevBrands.map((brand) =>
              brand.id === editableBrand.id
                ? { ...brand, name: editableBrand.name }
                : brand
            )
        );

        setEditableBrand(null); // Disable editing mode
      } catch (error) {
        // handle error
      } finally {
        setLoading(false);
      }
    }
  };
  const addNewBrand = async () => {
    if (newBrand) {
      try {
        setLoading(true);
        // Make a request to update the brand name
        const response = await authenticatedAxios.post(`${API_BRAND_URL}`, {
          name: newBrand,
        });

        // Update the brands state after successful update
        setBrands((prevBrands) => [response.data, ...(prevBrands || [])]);

        // Reset the newBrand state
        setNewBrand("");

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
    setEditableBrand(null); // Cancel editing
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editableBrand) {
      setEditableBrand((prevEditableBrand) => ({
        ...prevEditableBrand!,
        name: event.target.value,
      }));
    }
  };

  const handleSearch = async (searchKeyword: string) => {
    try {
      setLoading(true);
      // Make a request to update the brand name
      const response = await authenticatedAxios.get(
        `${API_SEARCH_BRAND_URL}?search=${searchKeyword}`
      );

      // Update the brands state after successful update
      setBrands(response.data);

      // Reset the newBrand state
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
              + Add Brand
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
                  <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
                    Add a new brand
                  </h3>

                  <input
                    type="text"
                    onChange={(e) => setNewBrand(e.target.value)}
                    placeholder="Enter new brand"
                    className="m-4 font-medium border text-black rounded p-1 placeholder-text-gray-600"
                  />

                  {/* <!-- Modal footer --> */}
                  <div className="flex items-center mt-6 space-x-2 rtl:space-x-reverse">
                    <button
                      onClick={addNewBrand}
                      type="button"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      save
                    </button>
                    <button
                      onClick={() => setOpenModal(false)}
                      type="button"
                      className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
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
                  Brand
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {brands &&
                brands.map((brand: Brand) => (
                  <tr key={brand.id}>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      {editableBrand && editableBrand.id === brand.id ? (
                        <input
                          type="text"
                          value={editableBrand.name}
                          onChange={handleNameChange}
                          className="font-medium text-black rounded p-1"
                        />
                      ) : (
                        <h5 className="font-medium text-black dark:text-white">
                          {brand.name}
                        </h5>
                      )}
                    </td>

                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {editableBrand && editableBrand.id === brand.id ? (
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
                            onClick={() => handleEditClick(brand)}
                          >
                            edit
                          </button>
                          <button
                            className="bg-red-00 px-2 text-white rounded-full"
                            onClick={() => handleEditClick(brand)}
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

export default Brands;
