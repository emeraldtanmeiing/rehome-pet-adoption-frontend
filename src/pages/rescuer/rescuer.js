import React, { useEffect, useState } from "react";
import { omitBy, isNil, map } from "lodash";
import { useNavigate } from "react-router-dom";
import useQuery from "../../hooks/useQuery";
import useAuthContext from "../../hooks/useAuthContext";
import { formatDate, calculateAge } from "../../helpers/date";
import { getPets } from "../../services/pet.services";
import { getAccount } from "../../services/auth.services";

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
  Grid,
} from "antd";
import {
  LoadingOutlined,
  MailFilled,
  PhoneFilled,
  EnvironmentFilled,
  FacebookFilled,
  InstagramFilled,
  ClockCircleFilled,
  GlobalOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import "./rescuer.less";
import RescuerStatus from "../../components/rescuer-status/rescuer-status";
import PetCard from "../../components/petCard/petCard";

const Rescuer = () => {
  const [rescuer, setRescuer] = useState({ status: "idle", data: null });
  const [pet, setPet] = useState({ status: "idle", data: null });
  const [showMore, setShowMore] = useState(false);
  const isLoading = rescuer.status !== "success" || pet.status !== "success";

  useEffect(() => {
    fetchRescuer();
    fetchPets();
  }, []);

  const query = useQuery();
  const rescuerID = query.get("rescuerID");

  const fetchRescuer = async () => {
    setRescuer({ ...rescuer, status: "loading" });

    if (rescuerID) {
      const res = await getAccount({ accountID: rescuerID });

      if (res?.error) {
        message.error(res.error.description);
      } else {
        setRescuer({ ...rescuer, status: "success", data: res.account });
      }
    }
  };

  const fetchPets = async () => {
    setPet({ ...pet, status: "loading" });

    if (rescuerID) {
      const res = await getPets({ rescuerID: rescuerID, active: true, sortBy: "adopted", sortMode: "asc" });

      if (res?.error) {
        message.error(res.error.description);
      } else {
        setPet({ ...pet, status: "success", data: res });
      }
    }
  };

  const breakpoint = Grid.useBreakpoint();

  return (
    <div className="rescuer">
      {isLoading && (
        <>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </>
      )}

      {!isLoading && (
        <>
          <Row className="rescuer-wrapper" align="center">
            <Col className="background"></Col>

            <Col className="rescuer-info" align="center">
              <Avatar
                className="profile-pic"
                size={80}
                src={rescuer.data.image}
              />

              <div className="name">
                <h1>{rescuer.data.name}</h1>
                <RescuerStatus verified={rescuer.data.verified} />
              </div>

              <div className="contact">
                <div className="joined">
                  <Button
                    type="text"
                    icon={<ClockCircleFilled style={{ color: "#abaaaa" }} />}
                  >
                    Joined {calculateAge(rescuer.data.createdAt)} ago
                  </Button>
                </div>

                <div>
                  <Button
                    type="text"
                    icon={<MailFilled style={{ color: "#abaaaa" }} />}
                  >
                    {rescuer.data.email}
                  </Button>
                </div>

                <div>
                  <Button
                    type="text"
                    icon={<PhoneFilled style={{ color: "#abaaaa" }} />}
                  >
                    {rescuer.data.phone}
                  </Button>
                </div>

                <div className="social-media">
                  {rescuer.data.facebookLink && (
                    <Button
                      icon={<FacebookFilled style={{ color: "grey" }} />}
                      onClick={() => {
                        window.open(rescuer.data.facebookLink);
                      }}
                    />
                  )}

                  {rescuer.data.instagramLink && (
                    <Button
                      icon={<InstagramFilled style={{ color: "grey" }} />}
                      onClick={() => {
                        window.open(rescuer.data.instagramLink);
                      }}
                    />
                  )}

                  {rescuer.data.organizationWebsiteLink && (
                    <Button
                      icon={<GlobalOutlined style={{ color: "grey" }} />}
                      onClick={() => {
                        window.open(rescuer.data.organizationWebsiteLink);
                      }}
                    />
                  )}
                </div>
              </div>

              <div
                className={breakpoint.md ? "address address-large" : "address"}
              >
                <EnvironmentFilled style={{ color: "#abaaaa" }} />{" "}
                {rescuer.data.address}
                {", "}
                {rescuer.data.city}
                {", "} {rescuer.data.stateOrProvince},{rescuer.data.country}
              </div>

              <div className="desc">
                {showMore
                  ? rescuer.data.description
                  : `${rescuer.data.description.substring(0, 100)}`}
                {rescuer.data.description.length > 100 && (
                  <Button type="text" onClick={() => setShowMore(!showMore)}>
                    {showMore ? "Show less" : "Show more"}
                  </Button>
                )}
              </div>
            </Col>
          </Row>

          <Row className="pets" gutter={[30, 30]}>
            <Col span={24} align="left">
              <h2>{pet.data.totalResultsFound} pets found</h2>
            </Col>

            {pet.data.petsList.map((p) => {
              const age = calculateAge(p.birthDate);
              p.age = age;
              return <PetCard pet={p} accountType="adopter" />;
            })}
          </Row>
        </>
      )}
    </div>
  );
};

export default Rescuer;
