import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
// import Newsletter from "./components/Newsletter";
import DialogBar from "./components/Dialog";
import MobileCart from "./components/MobileCart";
import MobileShopFilter from "./components/Dialog copy";
import { AppProvider } from "./context/AppContext";
import { DashboardAppProvider } from "./context/DashboardContext";
import DashboardHeader from "./components/DashboardHeader";
import VendorDialog from "./components/VendorDialog";
import { ToastContainer } from "react-toastify";
import { AdminDashboard } from "./layouts";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { MainAppContext } from "./context/MainContext";
import { userRoutes, vendorRoutes } from "./routes/Route";
import Smv from "./pages/Spin";
import Orders from "./pages/dashboard/Orders";
import Vendors from "./pages/dashboard/Vendors";
import "@google/model-viewer/dist/model-viewer.min.js";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  const { userData } = useState({});
  axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
  const { isDarkMode } = useContext(MainAppContext);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return (
    <>
      {loading ? (
        <div className=" w-full h-screen flex items-center justify-center py-3">
          <img
            src="/Images/loader.svg"
            alt="loading..."
            className=" object-contain w-[60px] h-[60px]"
          />
        </div>
      ) : (
        <div
          className={`${isDarkMode ? "dark" : ""
            }  off-white dark:text-gray-400 dark:bg-black`}
        >
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition:Bounce
          />

          <Routes>
            {userRoutes.map((item, index) => {
              return (
                <Route
                  key={index}
                  path={item.path}
                  element={
                    <>
                      <AppProvider>
                        <ScrollToTop/>
                        <Header />
                        {item.component}
                        {/* <Newsletter /> */}
                        <DialogBar />
                        <MobileCart userData={userData} />
                        <MobileShopFilter />

                        <Footer />
                      </AppProvider>
                    </>
                  }
                />
              );
            })}
            {vendorRoutes.map((item, index) => {
              return (
                <Route
                  key={index}
                  path={item.path}
                  element={
                    <>
                      <DashboardAppProvider>
                        <DashboardHeader />
                        {item.component}
                        <VendorDialog />
                      </DashboardAppProvider>
                    </>
                  }
                />
              );
            })}

            <Route path="/spin" element={<Smv />} />
            <Route path="/admindashboard/*" element={<AdminDashboard />} />
          </Routes>
        </div>
      )}
    </>
  );
};

export default App;
