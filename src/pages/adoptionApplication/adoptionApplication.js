import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { omitBy, isNil } from "lodash";
import { getAccount } from "../../services/auth.services.js";
import { getPets } from "../../services/pet.services.js";
import { monthDifference } from "../../helpers/date.js";

import { Row, Col, Divider, Spin, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import AccountForm from "../../components/accountForm/accountForm.js";

import "./adoptionApplication.less";

function AdoptionApplication() {
  const [buttonIsLoading, setButtonIsLoading] = useState(false);
  const [petState, setPetState] = useState({ status: "success", data: null }); //TODO: IMPORTANT: change to 'idle'
  const [rescuerState, setRescuerState] = useState({
    status: "success", //TODO: IMPORTANT: change to 'idle'
    data: null,
  });

  const isLoading =
    petState.status !== "success" || rescuerState.status !== "success";

  const fetchPets = async () => {
    setPetState({ ...petState, status: "loading" });

    const toBeAppliedPetJson = localStorage.getItem("toBeAppliedPet");
    if (toBeAppliedPetJson == null) {
      message.error(
        "Please click the 'Adopt' Button on your interested pet before applying an adoption application."
      );
      return;
    }
    const toBeAppliedPet = JSON.parse(toBeAppliedPetJson);

    //TODO: add active filter
    const params = omitBy(
      { petID: toBeAppliedPet },
      (v) => isNil(v) || v.toString().trim() === ""
    );

    const res = await getPets(params);

    if (res?.error) {
      message.error(res.error.description);
    } else {
      const pet = res.petsList[0];

      const diffInMonths = monthDifference(
        new Date(pet.createdAt),
        new Date(Date.now())
      );
      const ageInMonths = parseInt(pet.ageInMonths) + diffInMonths;

      const data = { ...pet, ageInMonths: ageInMonths };

      setPetState({ ...petState, status: "success", data: data });
      await fetchRescuer(res.petsList[0].rescuerID);
    }
  };

  const fetchRescuer = async (accountID) => {
    setRescuerState({ ...rescuerState, status: "loading" });

    const res = await getAccount({ accountID });

    if (res?.error) {
      message.error(res.error.description);
    } else {
      setRescuerState({
        ...rescuerState,
        status: "success",
        data: res.account,
      });
    }
  };

  const navigate = useNavigate();
  const onFinish = async (values) => {
    // setButtonIsLoading(true);
    // const AdoptionApplication = omitBy(values, v => isNil(v) || v.toString().trim() === '');
    // const res = await createAdoptionApplication({ AdoptionApplication });
    // if (res?.error) {
    //   message.error(res.error.description);
    //   setButtonIsLoading(false);
    // } else {
    //   message.success("Thank you for filling in the form!");
    //   navigate("/adopt/application/new");
    // }
  };

  return (
    <div className="AdoptionApplication">
      {isLoading && (
        <>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </>
      )}

      {!isLoading && (
        <>
          <div className="AdoptionApplication-wrapper fade-in">
            <Row align="center">
              <Col span={24} className="AdoptionApplication-description-title">
                <h1>Apply For Adoption</h1>
              </Col>
              <Col
                span={20}
                align="center"
                className="AdoptionApplication-description"
              >
                <div>
                  Pet adoption process: Apply for adoption {"->"} Online or
                  offline interview {"->"} Approve {"->"} Payment {"->"}{" "}
                  Schedule pick up {"->"} Completed
                </div>
              </Col>

              <Divider />

              <AccountForm />
            </Row>
          </div>
        </>
      )}
    </div>
  );
}

export default AdoptionApplication;
