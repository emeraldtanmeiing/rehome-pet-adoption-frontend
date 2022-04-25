import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

import AuthContext from "./context/authContext";

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

const AllRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route exact path="/" element={<PetsListing />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/signup" element={<SignupAdopter />} />
      <Route exact path="/rescuer/signup" element={<SignupRescuer />} />
      <Route exact path="/pets/:id" element={<Pet />} />

      {/* Only open to login user */}
      <Route exact path="/" element={<ProtectedRouteRequireLogin />}>
        <Route exact path="/unauthorized" element={<Unauthorized />} />
      </Route>

      {/* Only open to adopter */}

      {/* Only open to rescuer */}
      <Route exact path="/" element={<ProtectedRouteRequireType allowedTypes={["rescuer"]} />}>
        <Route exact path="/rescuer/pets/upload" element={<AddPet />} />
      </Route>
    </Routes>
  );
};

const ProtectedRouteRequireLogin = () => {
  const Auth = useContext(AuthContext);
  const location = useLocation();

  return Auth.auth.accessToken ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

const ProtectedRouteRequireType = ({allowedTypes}) => {
  const Auth = useContext(AuthContext);
  const location = useLocation();

  const accountType = Auth.auth?.type;
  const accessToken = Auth.auth?.accessToken;

  return allowedTypes?.includes(accountType) ? (
    <Outlet />
  ) : accessToken ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default App;
