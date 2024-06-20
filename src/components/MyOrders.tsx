import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import authenticatedAxios from "../auth/axiosInterceptors";
import { API_CONFIRM_ORDER_URL } from "../constants";
import { OrderItems } from "./Interfaces";
import Loader from "../common/Loader";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [orderItems, setorderItems] = useState<OrderItems[]>();

  useEffect(() => {
    const fetchorderItems = async () => {
      try {
        setLoading(true);
        const response = await authenticatedAxios.get(API_CONFIRM_ORDER_URL);
        console.log("respones", response);
        if (response.status === 200) {
          setorderItems(response.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (!orderItems) {
      fetchorderItems();
    }
  }, [orderItems]);

  if (!orderItems) {
    return <Loader />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8 bg-gray-100 mt-6">
      <h1 className="text-3xl font-bold tracking-tight text-indigo-800 mb-8">
        My Orders
      </h1>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 lg:gap-8">
            {orderItems &&
              orderItems.map((order) =>
                order.ordered_items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg bg-white text-gray-800 p-4 mb-4 sm:mb-8 md:mb-6 lg:mb-4 shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row items-center justify-between">
                      <div className="w-32 h-32">
                        <Link to="/">
                          <img
                            className="w-full h-full object-cover rounded"
                            src={item.image}
                            alt=""
                          />
                        </Link>
                      </div>
                      <div className="flex flex-col sm:flex-row w-full sm:w-2/3">
                        <p className="mb-2 sm:mb-0 text-lg font-semibold">
                          {`${item.product.name.slice(
                            0,
                            25
                          )}... ${item.description.slice(0, 25)}...`}
                        </p>
                        <div className="ml-auto text-right">
                          <p className="text-green-600">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "INR",
                            }).format(Number(item.discounted_price))}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {order.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
          </div>
        </>
      )}
    </div>
  );
};

export default MyOrders;
