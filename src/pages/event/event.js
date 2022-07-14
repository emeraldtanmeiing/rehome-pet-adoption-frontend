import React, { useEffect, useState, useId } from "react";
import { omitBy, isNil, map } from "lodash";
import { useNavigate } from "react-router-dom";
import useQuery from "../../hooks/useQuery";
import useAuthContext from "../../hooks/useAuthContext";
import { formatDate, calculateAge } from "../../helpers/date";
import { getEvents } from "../../services/event.services";
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
  Modal,
  message,
} from "antd";
import {
  LoadingOutlined,
  MailFilled,
  PhoneFilled,
  FacebookFilled,
  InstagramFilled,
  GlobalOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  EnvironmentFilled,
  CalendarFilled,
  ClockCircleFilled,
} from "@ant-design/icons";
import LoginModal from "../../components/login-modal/login-modal";

import "./event.less";
import {
  recoverLineBreak,
  stringToHTML,
  stringToHTML2,
} from "../../helpers/text";

const Event = () => {
  const [event, setEvent] = useState({ status: "idle", data: null });
  const isLoading = event.status !== "success";
  const descID = useId();

  useEffect(() => {
    fetchEvents();
  }, []);

  const query = useQuery();
  const eventID = query.get("eventID");

  const fetchEvents = async () => {
    setEvent({ ...event, status: "loading" });

    const params = omitBy(
      { eventID },
      (v) => isNil(v) || v.toString().trim() === ""
    );

    const res = await getEvents(params);

    if (res?.error) {
      message.error(res.error.description);
    } else {
      const event = res.eventsList[0];
      setEvent({ ...event, status: "success", data: event });
    }
  };

  const navigate = useNavigate();

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const handleCancel = () => setPreviewVisible(false);
  const handlePreview = async (image) => {
    setPreviewImage(image);
    setPreviewVisible(true);
  };

  useEffect(() => {
    if (event?.data?.description) {
      document.getElementById(descID).innerHTML = recoverLineBreak(
        event.data.description
      );
    }
  }, [event.data]);

  const leftColProps = { xxl: 15, xl: 15, lg: 15, md: 15, sm: 24, xs: 24 };
  const rightColProps = { xxl: 9, xl: 9, lg: 9, md: 9, sm: 24, xs: 24 };

  return (
    <div className="event">
      <div className="event-container">
        <div className="event-info">
          {isLoading && (
            <>
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
              />
            </>
          )}

          {!isLoading && (
            <>
              <Row>

                <Col span={24}>
                  <div className="image-wrapper">
                    <img className="image" src={event.data.image} />
                  </div>
                </Col>

                <Col
                  span={24}
                  align="left"
                  className="brief-wrapper brief-small outline"
                >
                  <h2>{event.data.name.toUpperCase()}</h2>
                  <div className="details">
                    <CalendarFilled style={{ color: "#abaaaa" }} />
                    {"   "}
                    {event.data.date}
                    <br />
                    <ClockCircleFilled style={{ color: "#abaaaa" }} />
                    {"   "}
                    {event.data.time}
                    <br />
                    <EnvironmentFilled style={{ color: "#abaaaa" }} />
                    {"   "}
                    {event.data.address}
                  </div>
                </Col>

                <Col {...leftColProps} align="left">
                  <div id={descID} className="description">
                    Description
                  </div>
                </Col>

                <Col
                  {...rightColProps}
                  align="left"
                  className="brief-wrapper brief-big outline"
                >
                  <h2>{event.data.name.toUpperCase()}</h2>
                  <div className="details">
                    <CalendarFilled style={{ color: "#abaaaa" }} />
                    {"   "}
                    {event.data.date}
                    <br />
                    <ClockCircleFilled style={{ color: "#abaaaa" }} />
                    {"   "}
                    {event.data.time}
                    <br />
                    <EnvironmentFilled style={{ color: "#abaaaa" }} />
                    {"   "}
                    {event.data.address}
                  </div>
                </Col>
              </Row>

              <Divider />

              <Row className="rescuer" gutter={[32, 16]}>
                <Col align="left" span={24}>
                  <h2>Contact Person / Organizer</h2>
                </Col>
                <Col
                  align="left"
                  span={{ xxl: 10, xl: 10, lg: 10, md: 10, sm: 24, xs: 24 }}
                >
                  <Row gutter={[16, 16]}>
                    <Col>
                      <Avatar
                        onClick={() => {
                          window.open(
                            `/rescuer?rescuerID=${event.data.rescuerID._id}`
                          );
                        }}
                        style={{ cursor: "pointer" }}
                        size={64}
                        src={event.data.rescuerID.image}
                      />
                    </Col>
                    <Col>
                      <h3
                        onClick={() => {
                          window.open(
                            `/rescuer?rescuerID=${event.data.rescuerID._id}`
                          );
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {event.data.rescuerID.name}
                      </h3>
                      <div style={{ wordWrap: "break-word", width: "400px" }}>
                        <EnvironmentFilled style={{ color: "#abaaaa" }} />{" "}
                        {event.data.rescuerID.address}
                        {", "}
                        {event.data.rescuerID.city}
                        {", "} {event.data.rescuerID.stateOrProvince},
                        {event.data.rescuerID.country}
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
                      {event.data.rescuerID.email}
                    </Button>
                  </div>
                  <div>
                    <Button
                      type="text"
                      icon={<PhoneFilled style={{ color: "grey" }} />}
                    >
                      {event.data.rescuerID.phone}
                    </Button>
                  </div>
                </Col>
                <Col
                  className="links"
                  align="left"
                  span={{ xxl: 10, xl: 10, lg: 10, md: 10, sm: 24, xs: 24 }}
                >
                  {event.data.rescuerID.facebookLink && (
                    <Button
                      style={{ marginRight: "20px" }}
                      icon={<FacebookFilled style={{ color: "grey" }} />}
                      onClick={() => {
                        window.open(event.data.rescuerID.facebookLink);
                      }}
                    />
                  )}

                  {event.data.rescuerID.instagramLink && (
                    <Button
                      style={{ marginRight: "20px" }}
                      icon={<InstagramFilled style={{ color: "grey" }} />}
                      onClick={() => {
                        window.open(event.data.rescuerID.instagramLink);
                      }}
                    />
                  )}

                  {event.data.rescuerID.organizationWebsiteLink && (
                    <Button
                      style={{ marginRight: "20px" }}
                      icon={<GlobalOutlined style={{ color: "grey" }} />}
                      onClick={() => {
                        window.open(
                          event.data.rescuerID.organizationWebsiteLink
                        );
                      }}
                    />
                  )}

                  <Button
                    href={`/rescuer?rescuerID=${event.data.rescuerID._id}`}
                  >
                    More events from {event.data.rescuerID.name}
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </div>
      </div>

      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
        <img style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default Event;
