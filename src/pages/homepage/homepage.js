import { useNavigate } from "react-router-dom";

import { Button, message } from "antd";

import "./homepage.scss";

const Homepage = () => {

  const navigate = useNavigate();
  const onClickAdopt = () => {
    navigate("/pets");
  };
  const onClickUploadPets = () => {
    message.info("Sign up as a rescuer to upload pets.");
    navigate("/rescuer/signup");
  };
  const onClickEvents = () => {
    navigate("/events");
  };

  return (
    <div className="homepage">
      <div className="homepage-form-wrapper">
        Homepage
        <div className="button">
          <Button type="primary" onClick={onClickAdopt}>
            Browse available pets
          </Button>
        </div>
        <div className="button">
          <Button type="primary" onClick={onClickUploadPets}>
            Publish a to-be-adopted pet
          </Button>
        </div>
        <div className="button">
          <Button type="primary" onClick={onClickEvents}>
            Browse event
          </Button>
        </div>
        <div className="button">
          <Button disabled type="primary" onClick={onClickEvents}>
            Successful pet adoption story
          </Button>
        </div>
      </div>
    </div>  );
};

export default Homepage;
