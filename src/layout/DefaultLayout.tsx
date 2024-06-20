import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { CartItem, Profile } from "../components/Interfaces";
import authenticatedAxios from "../auth/axiosInterceptors";
import { API_REGISTER_USER_URL, API_VIEW_CART_URL } from "../constants";
import { Footer } from "../components/Footer";

const DefaultLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const [profile, setProfile] = useState<Profile>();
  const [cartItems, setCartItems] = useState<CartItem[]>();
  useEffect(() => {
    if (isLoggedIn) {
      const fetchUsers = async () => {
        const response = await authenticatedAxios.get(
          `${API_REGISTER_USER_URL}`
        );
        setProfile(response.data);
      };
      // Check if profile data is already available
      if (!profile) {
        fetchUsers();
      }
      const fetchCartItems = async () => {
        try {
          const response = await authenticatedAxios.get(API_VIEW_CART_URL);
          if (response.status === 200) {
            setCartItems(response.data.cart_items);
          }
        } catch (error) {
          console.log(error);
        }
      };

      if (!cartItems) {
        fetchCartItems();
      }
    }
  });

  const cartItemsLength = cartItems?.length;
  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Start ===== --> */}
          <Header
            cartLength={cartItemsLength ? cartItemsLength : 0}
            isLoggedIn={isLoggedIn ? isLoggedIn : undefined}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            profile={profile}
          />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <Outlet />
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DefaultLayout;
