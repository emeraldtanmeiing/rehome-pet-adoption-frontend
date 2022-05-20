import React, { useEffect, useState, useContext } from "react";
import { omitBy, isNil, map } from "lodash";
import useQuery from "../../hooks/useQuery";
import AuthContext from "../../context/authContext";
import { getPets } from "../../services/pet.services";

import { Row, Col, Spin, Carousel, Button, Tooltip, Divider, message } from "antd";
import {
  LoadingOutlined,
  LeftOutlined,
  RightOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { HiLocationMarker } from "react-icons/hi";
import { FaHeartbeat } from "react-icons/fa";

import "./pet.scss";
import { getAccount } from "../../services/auth.services";

function Pet() {
  const [petState, setPetState] = useState({ status: "idle", data: null });
  const [rescuerState, setRescuerState] = useState({ status: "idle", data: null });
  const isLoading = petState.status !== "success" || rescuerState.status !== "success";

  useEffect(() => {
    fetchPets();
  }, []);

  const query = useQuery();
  const petID = query.get("petID");

  const Auth = useContext(AuthContext);
  const accountType = Auth.auth?.type;

  const fetchPets = async () => {
    setPetState({ ...petState, status: "loading" });

    const params = omitBy({ petID }, isNil);

    const res = await getPets(params);

    if (res?.error) {
      message.error(res.error.description);
    } else {
      setPetState({ ...petState, status: "success", data: res.petsList[0] });
      await fetchRescuer(res.petsList[0].rescuerID);
    }
  };

  const fetchRescuer = async (accountID) => {
    setRescuerState({ ...rescuerState, status: "loading" });

    const res = await getAccount({ accountID });
    console.log({res})

    if (res?.error) {
      message.error(res.error.description);
    } else {
      setRescuerState({ ...rescuerState, status: "success", data: res.account });
    }
  };

  const onClickAdopt = () => {
    console.log("clicked adopt");
    // check login?
    // if no, navigate to login

    // get account
    // check infoID
    // if no, navigate to create new info

    // navigate to create new application

  };

  const contentStyle = {
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };

  const descForVaccinated =
    "Vaccinations help prevent the pet from catching and spreading some serious infectious diseases, many of which can be fatal. We highly recommend pet owners to discuss with vet a vaccination plan that's right for the pet.";
  const descForSpayedOrNeutered =
    "Spay or neuter the pet can help to manage the population of strays, as well as improve its health. The safest age to spay a cat is between 2 - 5 months old, dogs usually get spayed or neutered before puberty, between 6 - 9 months. We highly recommend pet owners to consult their vets about the plan.";
  const descForDewormed =
    "Deworming the pet contributes to its health. We recommend pet owner to discuss with vet for a deworming plan.";

  const leftColProps = { xxl: 16, xl: 16, lg: 16, md: 16, sm: 24, xs: 24 };
  const rightColProps = { xxl: 8, xl: 8, lg: 8, md: 8, sm: 24, xs: 24 };
  const fullColProps = { xxl: 24, xl: 24, lg: 24, md: 24, sm: 24, xs: 24 };

  return (
    <div className="pet">
      <div className="pet-container">
        <div className="pet-info">
          {isLoading && (
            <>
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
              />
            </>
          )}

          {!isLoading && (
            <>
              <Row gutter={[16, 16]}>
                <Row gutter={[32, 64]}>
                  <Col {...leftColProps}>
                    <div className="sliders">
                      {map(
                        [petState.data.mainImage, ...petState.data.images],
                        (image, index) => {
                          return (
                            <img
                              src={image}
                              key={index}
                              onClick={() => window.open(image.href)}
                            />
                          );
                        }
                      )}
                    </div>
                  </Col>
                  <Col className="brief" {...rightColProps}>
                    <Row>
                      <Col span={24}>
                        <h2>
                          <strong>{petState.data.name.toUpperCase()}</strong>
                        </h2>
                      </Col>
                      <Col span={24} align="left">
                        <ul>
                          <li>{petState.data.healthCondition}</li>
                          <li>
                            Vaccinated
                            <Tooltip placement="top" title={descForVaccinated}>
                              <QuestionCircleOutlined />
                            </Tooltip>
                            : {petState.data.vaccinated ? "Yes" : "No"}
                          </li>
                          <li>
                            Dewormed
                            <Tooltip placement="top" title={descForDewormed}>
                              <QuestionCircleOutlined />
                            </Tooltip>
                            : {petState.data.dewormed ? "Yes" : "No"}
                          </li>
                          <li>
                            Spayed/Neutered
                            <Tooltip
                              placement="top"
                              title={descForSpayedOrNeutered}
                            >
                              <QuestionCircleOutlined />
                            </Tooltip>
                            : {petState.data.spayedOrNeutered ? "Yes" : "No"}
                          </li>
                        </ul>
                      </Col>
                      <Col span={24} align="left">
                        <HiLocationMarker style={{ color: "grey" }} />{" "}
                        {petState.data.city}, {petState.data.stateOrProvince}
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <Row gutter={[32, 64]}>
                  <Col align="left" {...leftColProps}>
                    <Row gutter={[32, 32]}>
                      <Col className="description" span={24}>{petState.data.description}</Col>
                      <Divider />
                      <Col className="details" span={{ xxl: 6, xl: 6, lg: 6, md: 6, sm: 12, xs: 12 }}>
                        <h3>Breed</h3>
                        <div>{petState.data.breed}</div>
                      </Col>
                      <Col className="details" span={{ xxl: 6, xl: 6, lg: 6, md: 6, sm: 12, xs: 12 }}>
                        <h3>Color</h3>
                        <div>{petState.data.color}</div>
                      </Col>
                      <Col className="details" span={{ xxl: 6, xl: 6, lg: 6, md: 6, sm: 12, xs: 12 }}>
                        <h3>Gender</h3>
                        <div>{petState.data.gender}</div>
                      </Col>
                      <Col className="details" span={{ xxl: 6, xl: 6, lg: 6, md: 6, sm: 12, xs: 12 }}>
                        <h3>Age</h3>
                        <div>{petState.data.ageInMonths} month(s)</div>
                      </Col>
                    </Row>
                  </Col>
                  <Col {...rightColProps}>
                    <h3>Adoption fee</h3>
                    <div>{petState.data.fee == 0? "FREE" : petState.data.fee}</div>
                    <Button type="primary" onClick={onClickAdopt}>
                      Apply for adoption
                    </Button>
                  </Col>
                </Row>

                <Divider />

                <Row gutter={[10, 20]}>
                  <Col {...fullColProps}>
                    <h2>Rescuer Info</h2>
                    <div>{rescuerState.data.name}</div>
                    <div>{rescuerState.data.email}</div>
                    <div>{rescuerState.data.phone}</div>
                    <div>{rescuerState.data.facebookLink}</div>
                    <div>{rescuerState.data.instagramLink}</div>
                    <div>{rescuerState.data.organizationWebsiteLink}</div>
                    <div><HiLocationMarker style={{ color: "grey" }} />{" "}{rescuerState.data.city}, {rescuerState.data.country}</div>
                  </Col>
                </Row>
              </Row>
              {/* <div>name: {petState.data.name}</div> ---
            <div>active: true</div>
            <div>adopted: false</div>
            <div>ageInMonths: 1</div>
            <div>breed: "mix breed"</div>
            <div>city: "Ulu Tiram"</div> ---
            <div>color: ["White,Brown"]</div>
            <div>country: "Malaysia"</div>
            <div>createdAt: "2022-05-12T15:54:11.140Z"</div>
            <div>description: "Introduce the pet to get a higher chance of adoption. i.e. how it was rescued, how is its typical day, what </div>is its favourite food and other relevant details. " ---
            <div>dewormed: false</div> ---
            <div>fee: 0</div>
            <div>gender: "male"</div>
            <div>healthCondition: "healthy"</div> ---
            <div>images: [,…]</div>
            <div>0: "https://res.cloudinary.com/emeraldtanmeiing/image/upload/v1652370849/rehome_pet_adoption/vpsu2mzpqdlur6g3wduf.jpg"</div>
            <div>1: "https://res.cloudinary.com/emeraldtanmeiing/image/upload/v1652370849/rehome_pet_adoption/ywqffm8ezzxkfy2q4vs9.jpg"</div>
            <div>2: "https://res.cloudinary.com/emeraldtanmeiing/image/upload/v1652370849/rehome_pet_adoption/h6qfctgwbkrjssie4unp.jpg"</div>
            <div>3: "https://res.cloudinary.com/emeraldtanmeiing/image/upload/v1652370849/rehome_pet_adoption/z57elnxxebtjunezbeiv.jpg"</div>
            <div>4: "https://res.cloudinary.com/emeraldtanmeiing/image/upload/v1652370850/rehome_pet_adoption/rdxxhblzsuwjmdj71vqs.jpg"</div>
            <div>mainImage: "https://res.cloudinary.com/emeraldtanmeiing/image/upload/v1652370847/rehome_pet_adoption/xz7r3qvfsdpqgchoxzzg.</div>jpg"
            <div>name: "lucky"</div> ---
            <div>postcode: "11111"</div>
            <div>rescuerID: "627be23dd12a118257594746"</div>
            <div>spayedOrNeutered: false</div> ---
            <div>stateOrProvince: "Selangor"</div> ---
            <div>type: "dog"</div>
            <div>vaccinated: false</div> ---*/}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Pet;
