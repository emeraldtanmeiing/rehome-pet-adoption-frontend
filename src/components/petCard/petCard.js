import React from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../helpers/date";

import { Card, Row, Col } from "antd";
import { ClockCircleFilled, EnvironmentFilled } from "@ant-design/icons";

import "./petCard.scss";

const { Meta } = Card;

const PetCard = ({ pet, accountType }) => {
  const navigate = useNavigate();

  const handleOnClick = () => {
    if (accountType === "rescuer") {
      navigate(`/rescuer/pet?petID=${pet._id}`);
    } else {
      navigate(`/pet?petID=${pet._id}`);
    }
  };

  return (
    <>
      <Col xxl={6} xl={6} lg={6} md={8} sm={12} xs={12} className="pet-card">
        <Card
          className="pet-card-wrapper"
          key={pet._id}
          hoverable
          size="small"
          onClick={handleOnClick}
          cover={
            <div
              style={{
                overflow: "hidden",
                height: "180px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                alt="pet image"
                className="pet-image"
                style={{ width: "100%" }}
                src={pet.mainImage}
              />
            </div>
          }
        >
          <div className={pet.adopted || !pet.active ? "not-available" : ""}>
            <div className="pet-card-details">
              {accountType === "rescuer" ? (
                <Row>
                  <Col className="petName" span={24}>
                    {pet.name.toUpperCase()}
                  </Col>

                  <Col span={24}>
                    {pet.type} &#8226; {pet.age}
                  </Col>

                  <Row className="more-details">
                    <Col className="active-adopted" span={24}>
                      {pet.active ? "Active" : "Inactive"} &#8226;{" "}
                      {pet.adopted ? "Adopted" : "Available"}
                    </Col>
                    <Col className="createdAt" span={24}>
                      <ClockCircleFilled style={{ color: "#abaaaa" }} />{" "}
                      {formatDate(pet.createdAt)}
                    </Col>
                    <Col className="location" span={24}>
                      <EnvironmentFilled style={{ color: "#abaaaa" }} />{" "}
                      {pet.city}, {pet.stateOrProvince}
                    </Col>
                  </Row>
                </Row>
              ) : (
                <Row>
                  <Col className="petName" span={24}>
                    {pet.name.toUpperCase()}
                  </Col>
                  <Col span={24}>
                    {pet.active ? "" : <>Inactive &#8226; </>}
                    {pet.adopted ? <>Adopted &#8226; </> : ""}
                    {pet.type} &#8226; {pet.age}
                  </Col>

                  <Col className="location" span={24}>
                    <EnvironmentFilled style={{ color: "#abaaaa" }} />{" "}
                    {pet.city}, {pet.stateOrProvince}
                  </Col>
                </Row>
              )}
            </div>
          </div>
        </Card>
      </Col>
    </>
  );
};

export default PetCard;
