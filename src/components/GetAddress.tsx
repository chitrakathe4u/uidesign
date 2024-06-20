import { useEffect, useState } from "react";
import authenticatedAxios from "../auth/axiosInterceptors";
import { API_USER_ADDRESS_URL } from "../constants";
import { Address } from "./Interfaces";

const GetAddress = () => {
  const [address, setAddress] = useState<Address>();
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const addressResponse = await authenticatedAxios.get(
          API_USER_ADDRESS_URL
        );
        if (addressResponse.status === 200) {
          setAddress(addressResponse.data[0]);
        }
      } catch (error) {
        console.log(error);
      } finally {
      }
    };
    if (!address) {
      fetchAddress();
    }
  }, [address]);

  return address;
};

export default GetAddress;
