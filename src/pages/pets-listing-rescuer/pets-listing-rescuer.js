import React, { useContext } from "react";
import { Result, Button } from "antd";
import AuthContext from "../../context/authContext";
import { useNavigate } from "react-router-dom";

import "./pets-listing-rescuer.scss";

function PetsListingSpecificRescuer() {
  const Auth = useContext(AuthContext);
  const accountType = Auth.auth?.type;
  const accountID = Auth.auth?.accountID;

  const navigate = useNavigate();

  const handleOnClick = () => {
    !accountID
      ? navigate("/")
      : accountType === "adopter"
      ? navigate("/")
      : accountType === "rescuer"
      ? navigate("/rescuer/pets")
      : accountType === "rescuer"
      ? navigate("/admin/dashboard")
      : navigate(-1);
  };

  return (
    <div>
      Pet listing for a specific rescuer page
    </div>
  );
}

export default PetsListingSpecificRescuer;
