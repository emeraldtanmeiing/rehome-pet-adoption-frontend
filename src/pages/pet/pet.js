import React, { useEffect, useState } from "react";
import { omitBy, isNil, map, sortBy, trim } from "lodash";
import { useNavigate } from "react-router-dom";
import useQuery from "../../hooks/useQuery";
import useAuthContext from "../../hooks/useAuthContext";
import { monthDifference, formatDate, calculateAge } from "../../helpers/date";
import { getPets } from "../../services/pet.services";
import { getAccount } from "../../services/auth.services";
import getColorCodes from "../../helpers/color";

import {
  Row,
  Col,
  Spin,
  Button,
  Tooltip,
  Divider,
  Avatar,
  Tag,
  message,
} from "antd";
import {
  LoadingOutlined,
  QuestionCircleOutlined,
  MailFilled,
  PhoneFilled,
  FacebookFilled,
  InstagramFilled,
  GlobalOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { EnvironmentFilled } from "@ant-design/icons";
import LoginModal from "../../components/login-modal/login-modal";

import "./pet.less";

function Pet() {
  const [petState, setPetState] = useState({ status: "idle", data: null });
  const [rescuerState, setRescuerState] = useState({
    status: "idle",
    data: null,
  });
  const [visible, setVisible] = useState(false);
  const isLoading =
    petState.status !== "success" || rescuerState.status !== "success";

  useEffect(() => {
    fetchPets();
  }, []);

  const query = useQuery();
  const petID = query.get("petID");

  const fetchPets = async () => {
    setPetState({ ...petState, status: "loading" });

    const params = omitBy(
      { petID },
      (v) => isNil(v) || v.toString().trim() === ""
    );

    const res = await getPets(params);

    if (res?.error) {
      message.error(res.error.description);
    } else {
      const pet = res.petsList[0];
      const colorCodes = getColorCodes(pet.color);
      const age = calculateAge(pet.birthDate);
      const data = { ...pet, colorCodes: colorCodes, age: age };

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

  const { accountID, accountType } = useAuthContext();
  const navigate = useNavigate();
  const onClickAdopt = async () => {
    if (!accountID) {
      setVisible(true);
      return;
    }

    if (accountType !== "adopter") {
      message.warning(
        `You are signed in as ${accountType}. Please register/login as an adopter to apply for adoption.`
      );
      return;
    }

    const res = await getAccount({ accountID });
    if (res?.error) {
      message.error(res.error.description);
      return;
    }
    localStorage.setItem("toBeAppliedPet", JSON.stringify(petState.data._id));
    if (!res.account.adoptionFormID) {
      navigate("/adopt/form/new");
    } else {
      navigate("/adopt/application/new");
    }
  };

  const onCancel = () => {
    setVisible(false);
  };

  const descForVaccinated =
    "Vaccinations help prevent the pet from catching and spreading some serious infectious diseases, many of which can be fatal. We highly recommend pet owners to discuss with vet a vaccination plan that's right for the pet.";
  const descForSpayedOrNeutered =
    "Spay or neuter the pet can help to manage the population of strays, as well as improve its health. The safest age to spay a cat is between 2 - 5 months old, dogs usually get spayed or neutered before puberty, between 6 - 9 months. We highly recommend pet owners to consult their vets about the plan.";
  const descForDewormed =
    "Deworming the pet contributes to its health. We recommend pet owner to discuss with vet for a deworming plan.";

  const leftColProps = { xxl: 16, xl: 16, lg: 16, md: 16, sm: 24, xs: 24 };
  const rightColProps = { xxl: 8, xl: 8, lg: 8, md: 8, sm: 24, xs: 24 };
  const detailsProps = { xxl: 8, xl: 8, lg: 8, md: 12, sm: 12, xs: 12 };

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
                <Row gutter={[32, 16]}>
                  <Col {...leftColProps}>
                    <div className="sliders">
                      {map(
                        [petState.data.mainImage, ...petState.data.images],
                        (image, index) => {
                          return (
                            <img
                              alt="pet"
                              src={image}
                              key={index}
                              onClick={() => window.open(image)}
                            />
                          );
                        }
                      )}
                    </div>
                  </Col>
                  <Col
                    className="brief-wrapper outline"
                    align="left"
                    {...rightColProps}
                  >
                    <Row>
                      <Col span={24}>
                        <h2>{petState.data.name.toUpperCase()}</h2>
                      </Col>

                      <Col span={24} align="left" className="brief">
                        {petState.data.healthCondition == "Healthy" ? (
                          <Tooltip placement="top" title={descForVaccinated}>
                            <Tag icon={<CheckCircleOutlined />} color="green">
                              {petState.data.healthCondition}
                            </Tag>
                          </Tooltip>
                        ) : (
                          <Tooltip placement="top" title={descForVaccinated}>
                            <Tag
                              icon={<ExclamationCircleOutlined />}
                              color="red"
                            >
                              {petState.data.healthCondition}
                            </Tag>
                          </Tooltip>
                        )}

                        <Tooltip placement="top" title={descForVaccinated}>
                          {petState.data.vaccinated ? (
                            <Tag icon={<CheckCircleOutlined />} color="green">
                              Vaccinated
                            </Tag>
                          ) : (
                            <Tag
                              icon={<ExclamationCircleOutlined />}
                              color="red"
                            >
                              Not Vaccinated
                            </Tag>
                          )}
                        </Tooltip>

                        <Tooltip
                          placement="top"
                          title={descForSpayedOrNeutered}
                        >
                          {petState.data.spayedOrNeutered ? (
                            <Tag icon={<CheckCircleOutlined />} color="green">
                              Spayed/Neutered
                            </Tag>
                          ) : (
                            <Tag
                              icon={<ExclamationCircleOutlined />}
                              color="red"
                            >
                              Not Spayed/Neutered
                            </Tag>
                          )}
                        </Tooltip>

                        <Tooltip placement="top" title={descForDewormed}>
                          {petState.data.dewormed ? (
                            <Tag icon={<CheckCircleOutlined />} color="green">
                              Dewormed
                            </Tag>
                          ) : (
                            <Tag
                              icon={<ExclamationCircleOutlined />}
                              color="red"
                            >
                              Not Dewormed
                            </Tag>
                          )}
                        </Tooltip>
                      </Col>

                      <Col span={24} align="left" className="location">
                        <EnvironmentFilled style={{ color: "#abaaaa" }} />{" "}
                        {petState.data.city}, {petState.data.stateOrProvince}
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <Row gutter={[32, 16]}>
                  <Col align="left" {...leftColProps}>
                    <Row gutter={[32, 16]}>
                      <Col span={24} align="left">
                        <h5>Posted on {formatDate(petState.data.createdAt)}</h5>
                      </Col>

                      <Col className="description" span={24}>
                        {petState.data.description}
                      </Col>

                      <Col className="fee-explanation" span={24}>
                        <h4 className="star">*</h4>
                        <h4>
                          All rescuers in ReHome have been verified, indicating
                          that they are likely to be licenced non-governmental
                          organisations (NGOs) or long-term pet rescue
                          organisations. The adoption fee can assist the
                          rescuers in covering operating costs, pet care,
                          medical bills, and other expenses so that they can
                          continue to save lives and help more animals in need.
                          As a result, ReHome advises rescuers to charge a small
                          fee.
                        </h4>
                      </Col>

                      <Divider />

                      <Col align="left" span={24}>
                        <Row>
                          <h2>More details</h2>
                        </Row>
                        <Row gutter={[16, 16]}>
                        <Col {...detailsProps}>
                            <div className="details outline">
                              <h3>Gender</h3>
                              <div>{petState.data.gender}</div>
                            </div>
                          </Col>
                          <Col {...detailsProps}>
                            <div className="details outline">
                              <h3>Age</h3>
                              <div>{petState.data.age}</div>
                            </div>
                          </Col>
                          <Col {...detailsProps}>
                            <div className="details outline">
                              <h3>Pet Size</h3>
                              <div>{petState.data.petSize}</div>
                            </div>
                          </Col>
                          <Col {...detailsProps}>
                            <div className="details outline">
                              <h3>Breed</h3>
                              <div>{petState.data.breed}</div>
                            </div>
                          </Col>
                          <Col {...detailsProps}>
                            <div className="details outline">
                              <h3>Color</h3>
                              {petState.data.colorCodes.map((c) => (
                                <span
                                  class="dot outline"
                                  style={{ backgroundColor: c }}
                                ></span>
                              ))}
                            </div>
                          </Col>
                          <Col {...detailsProps}>
                            <div className="details outline">
                              <h3>Food Size</h3>
                              <div>{petState.data.foodSize} per day</div>
                            </div>
                          </Col>
                          <Col {...detailsProps}>
                            <div className="details outline">
                              <h3>Food Fee</h3>
                              <div>{petState.data.foodFee} per month</div>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row gutter={[22, 22]} className="tips">
                      <Button
                        disabled
                        onClick={() => navigate("/blog/caretips-dog")}
                      >
                        Get more tips about how to take care of{" "}
                        {petState.data.type}
                      </Button>
                    </Row>
                  </Col>
                  <Col className="adoption outline" {...rightColProps}>
                    <h4>Adoption fee</h4>
                    <h2>
                      {petState.data.fee === 0
                        ? "FREE"
                        : `RM${petState.data.fee}`}
                    </h2>
                    <Button
                      type="primary"
                      size="large"
                      style={{ width: "100%" }}
                      onClick={onClickAdopt}
                    >
                      Adopt
                    </Button>
                  </Col>
                </Row>

                <Divider />

                <Row className="rescuer" gutter={[32, 16]}>
                  <Col align="left" span={24}>
                    <h2>Contact person </h2>
                  </Col>
                  <Col
                    align="left"
                    span={{ xxl: 10, xl: 10, lg: 10, md: 10, sm: 24, xs: 24 }}
                  >
                    <Row gutter={[16, 16]}>
                      <Col>
                        <Avatar size={64} src={rescuerState.data.image} />
                      </Col>
                      <Col>
                        <h3>{rescuerState.data.name}</h3>
                        <div>
                          <EnvironmentFilled style={{ color: "#abaaaa" }} />{" "}
                          {rescuerState.data.address}
                          {", "}
                          {rescuerState.data.city}, {rescuerState.data.country}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col
                    align="left"
                    className="links"
                    span={{ xxl: 10, xl: 10, lg: 10, md: 10, sm: 24, xs: 24 }}
                  >
                    <div>
                      <Button
                        type="text"
                        icon={<MailFilled style={{ color: "grey" }} />}
                      >
                        {rescuerState.data.email}
                      </Button>
                    </div>
                    <div>
                      <Button
                        type="text"
                        icon={<PhoneFilled style={{ color: "grey" }} />}
                      >
                        {rescuerState.data.phone}
                      </Button>
                    </div>
                  </Col>
                  <Col
                    className="links"
                    align="left"
                    span={{ xxl: 10, xl: 10, lg: 10, md: 10, sm: 24, xs: 24 }}
                  >
                    {rescuerState.data.facebookLink && (
                      <Button
                        style={{ marginRight: "20px" }}
                        icon={<FacebookFilled style={{ color: "grey" }} />}
                        onClick={() => {
                          window.open(rescuerState.data.facebookLink);
                        }}
                      />
                    )}

                    {rescuerState.data.instagramLink && (
                      <Button
                        style={{ marginRight: "20px" }}
                        icon={<InstagramFilled style={{ color: "grey" }} />}
                        onClick={() => {
                          window.open(rescuerState.data.instagramLink);
                        }}
                      />
                    )}

                    {rescuerState.data.organizationWebsiteLink && (
                      <Button
                        style={{ marginRight: "20px" }}
                        icon={<GlobalOutlined style={{ color: "grey" }} />}
                        onClick={() => {
                          window.open(
                            rescuerState.data.organizationWebsiteLink
                          );
                        }}
                      />
                    )}

                    {/* TODO: navigate to rescuer page */}
                    <Button disabled href={"/rescuer"}>
                      More pets from this org
                    </Button>
                  </Col>
                </Row>
              </Row>
            </>
          )}
        </div>
      </div>

      <LoginModal visible={visible} onCancel={onCancel} />
    </div>
  );
}

export default Pet;
