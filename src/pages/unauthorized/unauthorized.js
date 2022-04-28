import React, { useContext } from "react";
import { Result, Button } from "antd";
import AuthContext from "../../context/authContext";
import { useNavigate } from "react-router-dom";

function Unauthorized() {
  const Auth = useContext(AuthContext);
  const accountType = Auth.auth?.type;
  const accessToken = Auth.auth?.accessToken;

  const navigate = useNavigate();

  const handleOnClick = () => {
    !accessToken
      ? navigate("/")
      : accountType == "adopter"
      ? navigate("/")
      : accountType == "rescuer"
      ? navigate("/rescuer/pets")
      : accountType == "rescuer"
      ? navigate("/admin/dashboard")
      : navigate(-1);
  };

  return (
    <Result
      status="403"
      title="403"
      subTitle="UNAUTHORIZED: Sorry, your account does not have access to this page."
      extra={
        <Button type="primary" onClick={handleOnClick}>
          Back Home
        </Button>
      }
    />
  );
}

export default Unauthorized;
