import React from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

import Login from "./pages/login/login";
import Pet from "./pages/pet";
import PetsListing from "./pages/pets-listing";
import AddPet from "./pages/add-pet";

import SignupRescuer from "./pages/signup-rescuer/signup-rescuer";
import SignupAdopter from "./pages/signup-adopter/signup-adopter";
import Unauthorized from "./pages/unauthorized/unauthorized";

export const AllRoutes = () => {
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
      <Route
        exact
        path="/"
        element={<ProtectedRouteRequireType allowedTypes={["adopter"]} />}
      >
        <Route exact path="/adopt" element={<PetsListing />} />
      </Route>

      {/* Only open to rescuer */}
      <Route
        exact
        path="/"
        element={<ProtectedRouteRequireType allowedTypes={["rescuer"]} />}
      >
        <Route exact path="/rescuer/pets/upload" element={<AddPet />} />
      </Route>
    </Routes>
  );
};

export const ProtectedRouteRequireLogin = () => {
  const location = useLocation();

  const accessToken = Cookies.get("accessToken");

  return accessToken ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export const ProtectedRouteRequireType = ({ allowedTypes }) => {
  const location = useLocation();

  const accessToken = Cookies.get("accessToken");
  const accountType = Cookies.get("type");

  return allowedTypes?.includes(accountType) ? (
    <Outlet />
  ) : accessToken ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};
