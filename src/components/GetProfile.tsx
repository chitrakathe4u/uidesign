import { useEffect, useState } from "react";
import { API_REGISTER_USER_URL } from "../constants";
import authenticatedAxios from "../auth/axiosInterceptors";

const GetProfile = () => {
  const [profile, setProfile] = useState<any>();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await authenticatedAxios.get(`${API_REGISTER_USER_URL}`);
      setProfile(response.data);
    };
    // Check if profile data is already available
    if (!profile) {
      fetchUsers();
    }
  }, [profile]); // Add profile as a dependency if you want to fetch only when it's missing

  return profile;
};

export default GetProfile;
