import React from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

import Homepage from "./pages/homepage/homepage";
import Unauthorized from "./pages/unauthorized/unauthorized";
import SignupRescuer from "./pages/signup-rescuer/signup-rescuer";
import SignupAdopter from "./pages/signup-adopter/signup-adopter";
import Login from "./pages/login/login";
import AdopterForm from "./components/adopterForm/adopterForm";
import RescuerForm from "./components/rescuerForm/rescuerForm";
import RescuersListing from "./pages/rescuers-listing/rescuers-listing";
import RescuerForAdmin from "./pages/rescuer-for-admin/rescuer-for-admin";
import Rescuer from "./pages/rescuer/rescuer";

import Pet from "./pages/pet/pet";
import PetRescuer from "./pages/pet-rescuer/pet-rescuer";
import AddPet from "./pages/add-pet/add-pet";
import PetsListing from "./pages/pets-listing/pets-listing";
import PetsListingSpecificRescuer from "./pages/pets-listing-rescuer/pets-listing-rescuer";

//form
import AdoptionFormNew from "./pages/adoption-form-new/adoption-form-new";
import AdoptionForm from "./components/adoptionForm/adoptionForm";

//application
import AdoptionApplicationNew from "./pages/adoption-application-new/adoption-application-new";
import ApplicationsListingRescuer from "./pages/applications-listing-rescuer/applications-listing-rescuer";
import ApplicationsListingAdopter from "./pages/applications-listing-adopter/applications-listing-adopter";
import ApplicationRescuer from "./pages/application-rescuer/application-rescuer";
import ApplicationAdopter from "./pages/application-adopter/application-adopter";

//event
import Event from "./pages/event/event";
import AddEvent from "./pages/add-event/add-event";
import EventsListing from "./pages/events-listing/events-listing";
import EventsListingRescuer from "./pages/events-listing-rescuer/events-listing-rescuer";
import EventRescuer from "./pages/event-rescuer/event-rescuer";

import Dashboard from "./pages/dashboard/dashboard";

export const AllRoutes = () => {
  const accessToken = Cookies.get("accessToken");
  const accountType = Cookies.get("type");

  return (
    <Routes>
      {/* Public Routes */}
      <Route exact path="/" element={<Homepage />}/>
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/signup" element={<SignupAdopter />} />
      <Route exact path="/rescuer/signup" element={<SignupRescuer />} />
      <Route exact path="/pet" element={<Pet />} />
      <Route exact path="/pets" element={<PetsListing />} />
      <Route exact path="/events" element={<EventsListing />} />
      <Route exact path="/event" element={<Event />} />
      <Route exact path="/rescuer" element={<Rescuer />} />

      {/* Only open to login user */}
      <Route exact path="/" element={<ProtectedRouteRequireLogin />}>
        <Route exact path="/unauthorized" element={<Unauthorized />} />
        <Route exact path="/profile" element={accountType === "adopter" ? <AdopterForm size="small" /> : <RescuerForm size="small"/>} />
      </Route>

      {/* Only open to adopter */}
      <Route
        exact
        path="/"
        element={<ProtectedRouteRequireType allowedTypes={["adopter"]} />}
      >
        <Route exact path="/adopt/form/new" element={<AdoptionFormNew />} />
        <Route exact path="/adopt/form" element={<AdoptionForm showDescription={true} size="small" />} />
        <Route exact path="/adopt/applications" element={<ApplicationsListingAdopter />} />
        <Route exact path="/adopt/application/new" element={<AdoptionApplicationNew />} />
        <Route exact path="/adopt/application" element={<ApplicationAdopter />} />
      </Route>

      {/* Only open to rescuer */}
      <Route
        exact
        path="/"
        element={<ProtectedRouteRequireType allowedTypes={["rescuer"]} />}
      >
        <Route exact path="/rescuer/pets" element={<PetsListingSpecificRescuer />} />
        <Route exact path="/rescuer/pet/new" element={<AddPet />} />
        <Route exact path="/rescuer/pet" element={<PetRescuer />} />
        <Route exact path="/rescuer/applications" element={<ApplicationsListingRescuer />} />
        <Route exact path="/rescuer/application" element={<ApplicationRescuer />} />
        <Route exact path="/rescuer/events" element={<EventsListingRescuer />} />
        <Route exact path="/rescuer/event" element={<EventRescuer />} />
        <Route exact path="/rescuer/event/new" element={<AddEvent />} />
      </Route>

      {/* Only open to admin */}
      <Route
        exact
        path="/"
        element={<ProtectedRouteRequireType allowedTypes={["admin"]} />}
      >
        <Route exact path="/admin/rescuers-listing" element={<RescuersListing />} />
        <Route exact path="/admin/rescuer" element={<RescuerForAdmin />} />
        <Route exact path="/admin/dashboard" element={<Dashboard />} />
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
