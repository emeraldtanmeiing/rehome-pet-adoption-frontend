import React from "react";
// import {fetchPets} from "../services/pet.service";

function PetsListing() {
  const pets = fetchPets();
  return (
    <div className="App">
      pet listing
    </div>
  );
}

export default PetsListing;
