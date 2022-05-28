import { useNavigate } from "react-router-dom";

import { Button, message } from "antd";

import "./homepage.scss";

const Homepage = () => {

  const navigate = useNavigate();
  const onClickAdopt = () => {
    navigate("/pets-listing");
  };
  const onClickUploadPets = () => {
    message.info("Sign up as a rescuer to upload pets.");
    navigate("/rescuer/signup");
  };
  const onClickevents = () => {
    navigate("/events");
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
          <Button disabled type="primary" onClick={onClickevents}>
            Browse pet adoption event
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
