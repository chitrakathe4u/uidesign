import { useEffect, useRef, useState } from "react";
import { API_SEARCH_URL } from "../constants";
import Product, { SearchResultProps } from "./Interfaces";
import Loader from "../common/Loader";
import ErrorAlert from "./ErrorAlert";
import Spinner from "./Spinner";
import { NavLink } from "react-router-dom";
import axios from "axios";
import Products from "./Products";

function SearchResults({ query }: SearchResultProps) {
  const isMounted = useRef(true); // useRef to track component mount status
  const [results, setResults] = useState<Product[]>();
  const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState<string>();
  const page = `${API_SEARCH_URL}?${query}&page=1`;
  const [nextPage, setNextPage] = useState<string | null>(null);

  const fetchData = async (url: string | null) => {
    try {
      setLoading(true);
      const response = await axios.get(url!);
      const newProducts = response.data.results || [];

      if (newProducts.length !== 0) {
        setResults((prevProducts) =>
          prevProducts ? [...prevProducts, ...newProducts] : newProducts
        );
        setNextPage(response.data.next);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch data if the component is mounted
    if (isMounted.current) {
      fetchData(page);
    }

    // Set isMounted to false when the component is unmounted
    return () => {
      isMounted.current = false;
    };
  }, [page]);

  const handleNextClick = async () => {
    if (nextPage) {
      try {
        setLoading(true);
        const response = await axios.get(nextPage);
        const newProducts = response.data.results || [];

        if (newProducts.length !== 0) {
          setResults((prevProducts) =>
            prevProducts ? [...prevProducts, ...newProducts] : newProducts
          );
          setNextPage(response.data.next);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    }
  };

  if (!results || results.length <= 0) {
    return <Products />;
  }
  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="bg-white py-8">
          <ErrorAlert error={error} />
        </div>
      ) : (
        <section className="bg-white py-8">
          <div className="container mx-auto flex  items-stretch  flex-wrap pt-4 pb-12">
            {results.map((product: Product, index) => (
              <div
                key={index}
                className="w-full md:w-1/3 xl:w-1/4 p-6 flex flex-col shadow-md rounded-lg px-10 py-10 card-container relative overflow-hidden"
              >
                <NavLink
                  to={``}
                  onClick={() =>
                    (window.location.href = `/p/product/${product.product_token}`)
                  }
                  className="group relative overflow-hidden flex-1"
                >
                  <div className="aspect-w-1 aspect-h-1">
                    <img
                      className="object-cover object-center w-full h-full hover:grow transform hover:shadow-lg transition-transform duration-300 group-hover:scale-110"
                      src={product.image}
                      alt="Product Image"
                    />
                  </div>
                  <div className="pt-3 flex items-center justify-between">
                    <p className="opacity-50 overflow-hidden whitespace-nowrap overflow-ellipsis">
                      {product.product.brand.name}
                    </p>
                  </div>
                  <div className="pt-3 flex items-center justify-between">
                    <p className="font-bold text-lg overflow-hidden whitespace-nowrap overflow-ellipsis">
                      {product.product.name}
                    </p>
                  </div>
                  <p className="pt-1 text-gray-700">
                    <strong className="font-bold">
                      &#x20B9;{product.discounted_price}{" "}
                    </strong>
                    <span className="text-sm">
                      <del> &#x20B9;{product.selling_price}</del>
                    </span>
                  </p>
                  <p className="pt-1 text-green-500 font-semibold">
                    {product.discount_percentage}% off
                  </p>
                </NavLink>

                <div className="absolute inset-x-0 bottom-0 bg-white p-4 rounded-md shadow-md  opacity-0  hover:opacity-100 transition-opacity">
                  <p className="font-light text-lg">
                    {product.description.length > 40
                      ? `${product.description.slice(0, 40)}...`
                      : product.description}
                  </p>
                  <p className="pt-1 text-gray-700">
                    <strong className="font-bold">
                      &#x20B9;{product.discounted_price}{" "}
                    </strong>
                    <span className="text-sm">
                      <del> &#x20B9;{product.selling_price}</del>
                    </span>
                  </p>
                  <p className="pt-1 text-green-500 font-semibold">
                    {product.discount_percentage}% off
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      {!loading && !nextPage && (
        <p className="text-center text-gray-500 m-4">
          No more related items to load.
        </p>
      )}
      {loading && <Spinner />}
      <div className="flex flex-col items-center">
        <button
          onClick={handleNextClick}
          disabled={!nextPage}
          className="flex items-center  justify-center px-4 h-10 text-base font-medium text-white bg-blue-800 rounded-s hover:bg-blue-900"
        >
          Load More related products
        </button>
      </div>
    </div>
  );
}

export default SearchResults;
