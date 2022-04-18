import React from "react";
import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";

import Login from "./pages/login";
import Signup from "./pages/signup";
import Pet from "./pages/pet";
import PetsListing from "./pages/pets-listing";
import AddPet from "./pages/add-pet";

import Navbar from "./components/navbar";

import "./App.scss";

function App() {
  return (
    <div className="App">
      <Navbar />

      <div>
        <Routes>
          <Route exact path="/" element={<PetsListing />} />
          <Route exact path="/pets/upload" element={<AddPet />} />
          <Route exact path="/pets/:id" element={<Pet />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
