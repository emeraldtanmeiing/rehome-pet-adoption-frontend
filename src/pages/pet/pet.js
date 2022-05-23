import React, { useEffect, useState } from "react";
import { omitBy, isNil, map, sortBy } from "lodash";
import useQuery from "../../hooks/useQuery";
import useAuthContext from "../../hooks/useAuthContext";
import { monthDifference, formatDate } from "../../helpers/date";
import { getPets } from "../../services/pet.services";

import {
  Row,
  Col,
  Spin,
  Button,
  Tooltip,
  Divider,
  Avatar,
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
} from "@ant-design/icons";
import { HiLocationMarker } from "react-icons/hi";
import LoginModal from "../../components/login-modal/login-modal";

import "./pet.scss";
import { getAccount } from "../../services/auth.services";
import { useNavigate } from "react-router-dom";
import getColorCodes from "../../helpers/color";

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

    const params = omitBy({ petID }, isNil);

    const res = await getPets(params);

    if (res?.error) {
      message.error(res.error.description);
    } else {
      const pet = res.petsList[0];
      const colorCodes = getColorCodes(pet.color);

      const diffInMonths = monthDifference(
        new Date(pet.createdAt),
        new Date(Date.now())
      );
      const ageInMonths = parseInt(pet.ageInMonths) + diffInMonths;

      const data = { ...pet, colorCodes: colorCodes, ageInMonths: ageInMonths };

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
    if (!res.account.infoID) {
      navigate("/info");
    } else {
      navigate("application/new");
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

  const leftColProps = { xxl: 16, xl: 16, lg: 16, md: 16, sm: 24, xs: 24 }
  const rightColProps = { xxl: 8, xl: 8, lg: 8, md: 8, sm: 24, xs: 24 }
  const detailsProps = { xxl: 6, xl: 6, lg: 6, md: 6, sm: 6, xs: 6 }

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
                              onClick={() => window.open(image.href)}
                            />
                          );
                        }
                      )}
                    </div>
                  </Col>
                  <Col
                    className="brief outline"
                    align="left"
                    {...rightColProps}
                  >
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

                <Row gutter={[32, 16]}>
                  <Col align="left" {...leftColProps}>
                    <Row gutter={[32, 16]}>
                      <Col span={24} align="left">
                        <h5>Posted on {formatDate(petState.data.createdAt)}</h5>
                      </Col>
                      <Col className="description" span={24}>
                        {petState.data.description}
                      </Col>

                      <Divider />
                      
                      <Col align="left" span={24}>
                        <h2>More details</h2>
                      </Col>
                      <Col
                        className="details outline"
                        {...detailsProps}
                      >
                        <h3>Breed</h3>
                        <div>{petState.data.breed}</div>
                      </Col>
                      <Col
                        className="details outline"
                        {...detailsProps}
                      >
                        <h3>Color</h3>
                        {petState.data.colorCodes.map((c) => (
                          <span
                            class="dot outline"
                            style={{ "background-color": c }}
                          ></span>
                        ))}
                      </Col>
                      <Col
                        className="details outline"
                        {...detailsProps}
                      >
                        <h3>Gender</h3>
                        <div>{petState.data.gender}</div>
                      </Col>
                      <Col
                        className="details outline"
                        {...detailsProps}
                      >
                        <h3>Age</h3>
                        <div>{petState.data.ageInMonths} month(s)</div>
                      </Col>
                      <Col
                        className="details outline"
                        {...detailsProps}
                      >
                        <h3>Food</h3>
                        <div>Approximate 10kgs per month, around RM300</div>
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
                    <h3>
                      {petState.data.fee === 0
                        ? "FREE"
                        : `RM${petState.data.fee}`}
                    </h3>
                    <Button type="primary" onClick={onClickAdopt}>
                      Apply for adoption
                    </Button>
                  </Col>
                </Row>

                <Divider />

                <Row className="rescuer" gutter={[32, 16]}>
                  <Col align="left" span={24}>
                    <h2>Rescuer Info </h2>
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
                          <HiLocationMarker style={{ color: "grey" }} />
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
                    <Button
                      icon={<FacebookFilled style={{ color: "grey" }} />}
                      href={rescuerState.data.facebookLink}
                    />
                    <Button
                      icon={<InstagramFilled style={{ color: "grey" }} />}
                      href={rescuerState.data.instagramLink}
                    />
                    <Button
                      icon={<GlobalOutlined style={{ color: "grey" }} />}
                      href={rescuerState.data.organizationWebsiteLink}
                    />
                    {/* TODO: navigate to rescuer page */}
                    <Button disabled href={"/rescuer"}>
                      More pets from this org
                    </Button>
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

      <LoginModal visible={visible} onCancel={onCancel} />
    </div>
  );
}

export default Pet;
