import React from "react";
import { useNavigate } from "react-router-dom";

import { Card, Col } from "antd";

const { Meta } = Card;

const PetCard = ({ pet }) => {

  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate(`/rescuer/pet?petID=${pet._id}`)
  }

  return (
    <>
      <Col xxl={6} xl={6} lg={6} md={8} sm={12} xs={12}>
        <Card
          key={pet._id}
          hoverable
          onClick={handleOnClick}
          cover={
            //TODO: Replace with main pet image later
            <img
              alt="pet image"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />
          }
        >
          <Meta
            //TODO: Replace with profile pic of rescuer
            // avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
            title={pet.name}
          />

          <div className="pet-card-details">
            <p className="type">{pet.type}</p>
            <p className="age">{pet.age}</p>
          </div>
        </Card>
      </Col>
    </>
  );
};

export default PetCard;
