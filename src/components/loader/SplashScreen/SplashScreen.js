import React, { useEffect } from "react";
import loaderIcon from "../../../assets/images/splashicon.png";
import Footer from "../../common/Footer/Footer";
import Header from "../../common/Header/Header";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthProvider";

const SplashScreen = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  // useEffect(() => {
  //   if (localStorage.getItem("_displayed") === "true") {
  //     navigate(-1);
  //   }
  // }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/dashboard"); // Replace "/next-page" with your desired route
    }, 6500); // 5000ms = 5 seconds

    // Cleanup the timeout on component unmount
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <>
      <div className="splashBody">
        <div className="splashScreen">
          <div className="loadingContainer">
            <div className="loadingBox">
              <img src={loaderIcon} className="splashLogo" alt="" />
              <div className="loadingBarContainer">
                <div className="loadingbar"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="splashBehind">
          <Header />
          <div className="splashBehindMain">
            <h1 className="fade-in-text">WELCOME</h1>
            <h1 className="fade-in-text1 upperCase">{auth.user.name}</h1>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};
export default SplashScreen;
