import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import AuthContext from "./context/authContext";
import { AllRoutes } from "./Routes";

import Navbar from "./components/navbar";
import Login from "./pages/login/login";
import Pet from "./pages/pet";
import PetsListing from "./pages/pets-listing";
import AddPet from "./pages/add-pet";
import SignupRescuer from "./pages/signup-rescuer/signup-rescuer";
import SignupAdopter from "./pages/signup-adopter/signup-adopter";
import Unauthorized from "./pages/unauthorized/unauthorized";

import "./App.scss";

function App() {
  const [auth, setAuth] = useState(false);

  const readCookie = () => {
    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");
    const type = Cookies.get("type");

    if (accessToken && refreshToken && type) {
      setAuth({ accessToken, refreshToken, type });
    }
  };

  useEffect(() => {
    readCookie();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <div className="app">
        <Navbar />
        <div className="stack-screen">
          <AllRoutes />
        </div>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
