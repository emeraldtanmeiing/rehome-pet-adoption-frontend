import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/authContext";

import { Form, Button, Input, message } from "antd";

import "./homepage.scss";
import { DribbbleCircleFilled } from "@ant-design/icons";

// loading={loadings[0]}
const Homepage = () => {
  const Auth = useContext(AuthContext);

  const accountType = Auth.auth?.type;
  const accountID = Auth.auth?.accountID;

  const navigate = useNavigate();
  const onClickAdopt = () => {
    navigate("/adopt");
  };
  const onClickUploadPets = () => {
    message.info("Sign up as a rescuer to upload pets.");
    navigate("/rescuer/signup");
  };
  const onClickEvents = () => {
    navigate("/event");
  };

  return (
    <div className="homepage">
      <div className="homepage-form-wrapper">
        Homepage
        <div className="button">
          <Button type="primary" onClick={onClickAdopt}>
            Browse to-be-adopted pets
          </Button>
        </div>
        <div className="button">
          <Button type="primary" onClick={onClickUploadPets}>
            Upload a pet
          </Button>
        </div>
        <div className="button">
          <Button type="primary" onClick={onClickEvents}>
            Browse pet adoption fair
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
