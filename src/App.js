import React, { useState, useEffect, Fragment } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "./assets/css/newstyle.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./Context/AuthProvider";
import PrivateRoute from "./Routes/PrivateRoute";
import OpenRoutes from "./Routes/OpenRoutes";
import SidebarLayout from "./components/common/Sidebar/SidebarLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import {
  protectedRoutesWithSidebarLayout,
  protectedRoutesWithoutSidebarLayout,
  publicRoutes,
} from "./Routes/Route";
import NotFound from "./pages/404/NotFound";
import { SetupInterceptor } from "./Utils/apiServices";



function App() {


  // Interceptors On 

  useEffect(() => {
    SetupInterceptor();
  }, []);



  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer />
        {/* =========================================Open Routes================================================ */}

        <Routes>
          {publicRoutes.map((val, index) => {
            return (
              <Route
                path={val.path}
                key={index}
                element={
                  <OpenRoutes>
                    <div>
                      {val.header}
                      {val.component}
                      {val.footer}
                    </div>
                  </OpenRoutes>
                }
              />
            );
          })}

          {/* =========================================Private Routes================================================ */}

          {protectedRoutesWithoutSidebarLayout.map((val, index) => {
            return (
              <Route
                key={index}
                path={val.path}
                element={<PrivateRoute>{val.component}</PrivateRoute>}
              />
            );
          })}

          <Route element={<SidebarLayout />}>
            {protectedRoutesWithSidebarLayout.map((val, index) => (
              <Fragment key={index}>
                <Route
                  path={val.path}
                  element={
                    <PrivateRoute>
                      <div>
                        <div uk-grid="" className="uk-grid">
                          <div className="uk-width-auto"></div>
                          <div
                            className={
                              val.padding === true
                                ? `uk-width-expand padding60`
                                : `uk-width-expand`
                            }
                          >
                            {val.header}
                            {val.component}
                          </div>
                        </div>
                        {val.footer}
                      </div>
                    </PrivateRoute>
                  }
                />
              </Fragment>
            ))}
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
