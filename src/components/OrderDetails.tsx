import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { Address } from "./Interfaces";
import authenticatedAxios from "../auth/axiosInterceptors";
import { API_USER_ADDRESS_URL } from "../constants";

function OrderDetails() {
  const [loading, setLoading] = useState<boolean>(false);
  const [address, setAddress] = useState<Address>();
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
  if (!address) {
    return <Spinner />;
  }
  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:gap-8 m-16 bg-gray-100">
        <div className="rounded-lg bg-white text-gray-800 p-4 mb-4 sm:mb-8 md:mb-6 lg:mb-4 shadow-md">
          <h2 className="text-xl font-semibold mb-4 leadi tracki">
            Delivery Adress
          </h2>

          {address && (
            <p className="text-black">
              {address.apartment_number}, {address.street_address} ,
              {address.landmark}, {address.city}-
              <strong>{address.pin_code}</strong> {address.state}
            </p>
          )}
        </div>
        <div className="rounded-lg bg-white text-gray-800 p-4 mb-4 sm:mb-8 md:mb-6 lg:mb-4 shadow-md"></div>
      </div>
      {/* <div className="grid grid-cols-1 gap-4 lg:gap-8 m-8">
          <div className="rounded-lg bg-white text-gray-800 p-4 mb-4 sm:mb-8 md:mb-6 lg:mb-4 shadow-md"></div>
        </div> */}
    </>
  );
}

export default OrderDetails;
