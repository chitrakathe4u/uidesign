import Logo from "../assets/images/logo.jpeg";
import { NavLink, useLocation } from "react-router-dom";
import { API_CATEGORIES_URL } from "../constants";
import axios from "axios";
import { useEffect, useState } from "react";
import { Category } from "./Interfaces";
import Spinner from "./Spinner";
import DropdownUser from "./DropdownUser";
import { analyzeQuery, buildSearchQuery } from "../common/Loader/functions";

const ProductHeader = (props: {
  isLoggedIn: string | boolean | undefined;
  profile: any;
  cartLength: number;
}) => {
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>();
  const [isMenDropdownOpen, setIsMenDropdownOpen] = useState(false);
  const [isWomenDropdownOpen, setIsWomenDropdownOpen] = useState(false);
  const { pathname } = location;
  const path = "/p/search/";
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API_CATEGORIES_URL);
        if (response.status === 200) {
          setCategories(response.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (!categories) {
      getCategories();
    }
  }, [categories]);

  if (!categories) {
    return <Spinner />;
  }

  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 relative">
          <NavLink
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img src={Logo} className="h-8" alt="Logo" />
          </NavLink>
          <form
            className="flex items-center sm:text-xs"
            onSubmit={(e) => {
              e.preventDefault();
              if (searchKeyword)
                window.location.href =
                  path + buildSearchQuery(analyzeQuery(searchKeyword));
            }}
          >
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
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-32 lg:w-full md:w-full ps-10 p-2.5 placeholder-gray-800"
                placeholder="Search products, brands etc..."
                required
              />
            </div>
          </form>
          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            {/* Dropdown menu */}
            <DropdownUser profile={props.profile} />
            <button
              data-collapse-toggle="navbar-user"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-user"
              aria-expanded="false"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          <div
            className={`items-center ${
              !isMenuOpen ? "hidden" : ""
            }  justify-between w-full md:flex md:w-auto md:order-1`}
            id="navbar-user"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <NavLink
                  to="/"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  aria-current="page"
                >
                  home
                </NavLink>
              </li>

              <li
                onMouseEnter={() => setIsMenDropdownOpen(true)}
                onMouseLeave={() => setIsMenDropdownOpen(false)}
                onClick={() => setIsMenDropdownOpen(!isMenDropdownOpen)}
                className=""
              >
                <button
                  className={`${
                    pathname.includes("category/men") ? "text-blue-500" : ""
                  } flex items-center text-gray-900  justify-between w-full hover:text-blue-700 py-2 px-3 lg:py-0 md:px-0 md:py-0 lg:px-0 xl:py-0 xl:px-0 `}
                >
                  men
                  <svg
                    className="w-2.5 h-2.5 ms-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </button>
                <div
                  className={`absolute ${
                    !isMenDropdownOpen ? "hidden" : ""
                  } z-10   font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600`}
                >
                  <ul className=" py-2 text-sm text-gray-700 dark:text-gray-200">
                    {loading ? (
                      <Spinner />
                    ) : (
                      categories.map(
                        (category, index) =>
                          (category.gender === "Male" ||
                            category.gender === "Disabled") && (
                            <li key={index}>
                              <NavLink
                                to={""}
                                onClick={() =>
                                  (window.location.href = `/p/category/men/${category.name.toLowerCase()}`)
                                }
                                className={`block px-4 py-2 hover:bg-gray-100  
                                        ${
                                          pathname.includes(
                                            category.name.toLowerCase()
                                          ) && pathname.includes("category/men")
                                            ? "text-blue-500"
                                            : ""
                                        }`}
                              >
                                {category.name.toLowerCase()}
                              </NavLink>
                            </li>
                          )
                      )
                    )}
                  </ul>
                </div>
              </li>
              <li
                onMouseEnter={() => setIsWomenDropdownOpen(true)}
                onMouseLeave={() => setIsWomenDropdownOpen(false)}
                onClick={() => setIsWomenDropdownOpen(!isWomenDropdownOpen)}
                className="relative "
              >
                <button
                  className={`${
                    pathname.includes("category/women") ? "text-blue-500" : ""
                  } flex items-center text-gray-900  justify-between w-full hover:text-blue-700 py-2 px-3 lg:py-0 md:px-0 md:py-0 lg:px-0 xl:py-0 xl:px-0 `}
                >
                  women
                  <svg
                    className="w-2.5 h-2.5 ms-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </button>
                <div
                  className={`absolute ${
                    !isWomenDropdownOpen ? "hidden" : ""
                  } z-10   font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600`}
                >
                  <ul className=" py-2 text-sm text-gray-700 dark:text-gray-200">
                    {loading ? (
                      <Spinner />
                    ) : (
                      categories.map(
                        (category, index) =>
                          (category.gender === "Female" ||
                            category.gender === "Disabled") && (
                            <li key={index}>
                              <NavLink
                                to={""}
                                onClick={() =>
                                  (window.location.href = `/p/category/women/${category.name.toLowerCase()}`)
                                }
                                className={`block px-4 py-2 hover:bg-gray-100  
                                        ${
                                          pathname.includes(
                                            category.name.toLowerCase()
                                          ) && pathname.includes("women")
                                            ? "text-blue-500"
                                            : ""
                                        }`}
                              >
                                {category.name.toLowerCase()}
                              </NavLink>
                            </li>
                          )
                      )
                    )}
                  </ul>
                </div>
              </li>
              <li>
                <NavLink
                  to="/"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Services
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Pricing
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default ProductHeader;
