import React from "react";
import { useNavigate } from "react-router-dom";

import { Card, Col } from "antd";

const { Meta } = Card;

const PetCard = ({ pet, accountType }) => {
  const navigate = useNavigate();

  const handleOnClick = () => {
    
    if (accountType === "rescuer") {
      navigate(`/rescuer/pets?petID=${pet._id}`);
    } else {
      navigate(`/pets?petID=${pet._id}`);
    }

  };

  return (
    <>
      <Col xxl={6} xl={6} lg={6} md={8} sm={12} xs={12}>
        <Card
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
          <Meta
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
