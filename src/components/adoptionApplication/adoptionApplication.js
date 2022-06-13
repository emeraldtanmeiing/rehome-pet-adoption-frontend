import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPets } from "../../services/pet.services.js";
import { createApplication } from "../../services/application.services.js";

import { Row, Col, Spin, Button, Grid, message, Steps } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import AdopterForm from "../adopterForm/adopterForm.js";
import RescuerForm from "../rescuerForm/rescuerForm.js";
import PetForm from "../petForm/petForm.js";

import "./adoptionApplication.less";
import useAuthContext from "../../hooks/useAuthContext.js";

function AdoptionApplication() {
  const { Step } = Steps;
  const breakpoint = Grid.useBreakpoint();

  const [isLoading, setIsLoading] = useState(false);
  const [rescuerID, setRescuerID] = useState(false);
  const [current, setCurrent] = useState(0);
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };

  const navigate = useNavigate();
  const getToBeAppliedPetID = () => {
    const petIDInJson = localStorage.getItem("toBeAppliedPet");
    if (petIDInJson == null) {
      return null;
    } else {
      return JSON.parse(petIDInJson);
    }
  };

  useEffect(() => {
    const petID = getToBeAppliedPetID();
    if (petID == null) {
      message.warning(
        "You haven't select the pet you wish to adopt. Please click the 'Adopt' Button on your interested pet before applying an adoption application.",
        10
      );
      navigate("/pets-listing");
    } else {
      fetchRescuerID();
    }
  }, []);

  const fetchRescuerID = async () => {
    const petID = getToBeAppliedPetID();
    const pet = await getPets({ petID });
    setRescuerID(pet.petsList[0].rescuerID);
  };

  const { accountID } = useAuthContext();
  const onFinish = async () => {
    setIsLoading(true);
    const adoptionApplication = {
      adopterID: accountID,
      petID: getToBeAppliedPetID(),
    };
    const res = await createApplication({ adoptionApplication });
    if (res?.error) {
      message.error(res.error.description);
      setIsLoading(false);
    } else {
      message.success("Apply successfull!");
      navigate("/adopt/applications");
    }
  };

  const petInfo = (
    <>
      <Row align="center">
        <Col
          span={!breakpoint.md ? 24 : 20}
          align="center"
          className="adoptionApplication-pet"
        >
          <PetForm petID={getToBeAppliedPetID()} editable={false} />
        </Col>
      </Row>
    </>
  );

  const rescuerInfo = (
    <>
      {rescuerID && (
        <Row align="center">
          <Col
            span={!breakpoint.md ? 24 : 20}
            align="center"
            className="adoptionApplication-rescuer"
          >
            <RescuerForm accountID={rescuerID} editable={false} />
          </Col>
        </Row>
      )}
    </>
  );

  const profileInfo = (
    <>
      <Row align="center">
        <Col
          span={!breakpoint.md ? 24 : 20}
          align="center"
          className="adoptionApplication-account"
        >
          <AdopterForm />
        </Col>
      </Row>
    </>
  );

  const briefInfo = (
    <>
      <Row align="center">
        <Col span={!breakpoint.md ? 24 : 20} className="brief-info">
          By clicking the "Apply" button below, you will complete the adoption
          application.
          <br />
          <br />
          Following the organization's review of your application, you may be
          required to participate in a short online or offline interview as well
          as filling the official adoption form provided by the organization.
          After confirming the adoption, you will need to make payment in our
          website (if there is an adoption fee) and schedule the pick-up time
          after they confirm the adoption.
          <br />
          <br />
          You can go to{" "}
          <Button style={{ padding: 0 }} type="link" href="/adopt/applications">
            {" "}
            My applications{" "}
          </Button>{" "}
          to check your application status or get the organization's contact
          information.
        </Col>
      </Row>
    </>
  );

  const steps = [
    {
      title: "Pet",
      description: "Confirm the pet you wish to adopt",
      content: petInfo,
    },
    {
      title: "Pet's Contact",
      description: "Get the info of pet's contact person",
      content: rescuerInfo,
    },
    {
      title: "Your Profile",
      description: "Confirm your contact information",
      content: profileInfo,
    },
    {
      title: "Complete",
      description: "Complete application for adoption",
      content: briefInfo,
    },
  ];

  return (
    <div className="adoptionApplication">
      {!rescuerID && (
        <>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </>
      )}
      {rescuerID && (
        <div className="adoptionApplication-wrapper">
          <Row align="center">
            <Col span={24} className="adoptionApplication-description-title">
              <h1>Apply For Adoption</h1>
            </Col>

            <Col span={!breakpoint.md ? 24 : 20}>
              <Steps current={current}>
                {steps.map((item) => (
                  <Step
                    key={item.title}
                    title={item.title}
                    description={item.description}
                  />
                ))}
              </Steps>
              <div className="steps-content">{steps[current].content}</div>
              <div className="steps-action">
                {current > 0 && (
                  <div>
                    <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
                      Previous
                    </Button>
                  </div>
                )}
                {current < steps.length - 1 && (
                  <div>
                    <Button type="primary" onClick={() => next()}>
                      Next
                    </Button>
                  </div>
                )}
                {current === steps.length - 1 && (
                  <div>
                    <Button
                      type="primary"
                      loading={isLoading}
                      onClick={() => onFinish()}
                    >
                      Apply
                    </Button>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}

export default AdoptionApplication;
