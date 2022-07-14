import React from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../helpers/date";

import { Card, Row, Col } from "antd";
import { ClockCircleFilled, EnvironmentFilled } from "@ant-design/icons";

import "./eventCard.less";

const { Meta } = Card;

const EventCard = ({ event, accountType }) => {
  const navigate = useNavigate();

  const handleOnClick = () => {
    if (accountType === "rescuer") {
      navigate(`/rescuer/event?eventID=${event._id}`);
    } else {
      navigate(`/event?eventID=${event._id}`);
    }
  };

  return (
    <>
      <Col xxl={6} xl={6} lg={6} md={8} sm={12} xs={12} className="event-card">
        <Card
          className="event-card-wrapper"
          key={event._id}
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
                alt="event image"
                className="event-image"
                style={{ width: "100%" }}
                src={event.image}
              />
            </div>
          }
        >
          <div className={!event.active ? "not-available" : ""}>
            <div className="event-card-details">
              <Row>
                <Col span={8} className="date" align="center">
                  <h1>{formatDate(event.date).split(" ")[0]}</h1>
                  <h3>{formatDate(event.date).split(" ")[1]}</h3>
                  <h3>{formatDate(event.date).split(" ")[2]}</h3>
                </Col>
                <Col span={16} className="name-location">
                  <div className="eventName">{event.name.toUpperCase()}</div>
                  <div className="location">
                    <EnvironmentFilled style={{ color: "#abaaaa" }} />{" "}
                    {event.address}
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Card>
      </Col>
    </>
  );
};

export default EventCard;
