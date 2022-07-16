import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getPets } from "../../services/pet.services";
import { calculateAge } from "../../helpers/date";
import { getEvents } from "../../services/event.services";
import copy from "copy-to-clipboard";

import { Row, Col, Grid, Button, Statistic, message, Divider } from "antd";
import {
  ArrowRightOutlined,
  MailFilled,
  PhoneFilled,
  LinkedinFilled,
  GithubFilled,
  FileTextFilled,
} from "@ant-design/icons";
import PetCard from "../../components/petCard/petCard";
import EventCard from "../../components/eventCard/eventCard";
import CardSkeleton from "../../components/card-skeleton/card-skeleton";
import logoSmall from "../../images/logo_small.png";

import "./homepage.less";
import { getPublicReport } from "../../services/report.services";

const Homepage = () => {
  const [pet, setPet] = useState({ status: "idle", data: null });
  const [event, setEvent] = useState({ status: "idle", data: null });
  const [statistics, setStatistics] = useState({ status: "idle", data: null });
  const isLoading =
    pet.status !== "success" ||
    event.status !== "success" ||
    statistics.status !== "success";

  useEffect(() => {
    fetchPet();
    fetchEvent();
    fetchStatistics();
  }, []);

  const fetchPet = async () => {
    setPet({ ...pet, status: "loading" });

    const res = await getPets({
      resultsPerPage: 4,
      adopted: false,
      active: true,
      sortBy: "createdAt",
      sortMode: "desc",
    });

    if (res?.error) {
      message.error(res.error.description);
    } else {
      let data = res.petsList;

      data = data.filter((d) => {
        return d.rescuerID.verified === true;
      });

      data = data.map((pet) => {
        const age = calculateAge(pet.birthDate);
        return { ...pet, age: age };
      });

      setPet({
        ...pet,
        status: "success",
        data: {
          petsList: data,
          totalResultsFound: data.length,
          page: res.page,
          resultsPerPage: res.resultsPerPage,
        },
      });
    }
  };

  const fetchEvent = async () => {
    setEvent({ ...event, status: "loading" });

    const res = await getEvents({
      resultsPerPage: 4,
      active: true,
      sortBy: "createdAt",
      sortMode: "desc",
    });

    if (res?.error) {
      message.error(res.error.description);
    } else {
      setEvent({
        ...event,
        status: "success",
        data: res,
      });
    }
  };

  const fetchStatistics = async () => {
    setStatistics({ ...statistics, status: "loading" });

    const res = await getPublicReport({});

    if (res?.error) {
      message.error(res.error.description);
    } else {
      setStatistics({
        ...statistics,
        status: "success",
        data: res,
      });
    }
  };

  const copyToClipboard = (text) => {
    copy(text);
    message.success(`Copied: ${text}`);
  };

  const navigate = useNavigate();
  const onClickAdopt = () => {
    navigate("/pets");
  };
  const onClickUploadPets = () => {
    message.info("Sign up as a rescuer to upload pets.");
    navigate("/rescuer/signup");
  };
  const onClickEvents = () => {
    navigate("/events");
  };

  const breakpoint = Grid.useBreakpoint();
  return (
    <div className="homepage">
      <div className="homepage-form-wrapper">
        <Row className="intro" align="bottom">
          <Col span={breakpoint.lg ? 16 : 24} align="left">
            <div className="title">
              <span className="rehome">All Pets in One.</span>
            </div>
            <div className="desc">
              <h2>
                ReHome gathers to-be-adopted pets from verified welfare
                organizations, NGOs, pet shelters so that you don't have to
                search it one by one.
              </h2>
            </div>
          </Col>
          <Col span={8} align="left" className="logo">
            <img src={logoSmall} alt="logo" />
          </Col>
        </Row>

        <Row className="pet section">
          <Col
            span={breakpoint.lg ? 8 : 24}
            className="heading-card"
            align="left"
          >
            <div className="heading-card-title">Meet the cuties.</div>
            {!isLoading && (
              <h3 className="available-statistics-1">
                {statistics.data.totalWaitingForAdoptionPet} pets available
              </h3>
            )}
            <Button type="primary" size="large" onClick={onClickAdopt}>
              Browse more pets <ArrowRightOutlined />
            </Button>

            <h3 style={{margin: "20px 0 0 0", }}>Want to post pets for adoption?</h3>
            {/* <div>Sign up and get verified now!</div> */}
            <Button
              // type="primary"
              size="default"
              onClick={onClickUploadPets}
              id="upload-button"
            >
              Sign up & get verified to post pets now!
            </Button>
          </Col>

          <Col span={breakpoint.lg ? 15 : 24}>
            <Row gutter={breakpoint.lg ? [30, 30] : [10, 10]}>
              {isLoading
                ? [...Array(2).keys()].map((index) => (
                    <CardSkeleton index={index} key={index} colBig={12} />
                  ))
                : pet.data.petsList.map((p, index) => {
                    if (breakpoint.lg && index === 3) return null;
                    return <PetCard pet={p} colBig={8} colSmall={12} />;
                  })}
            </Row>
          </Col>
        </Row>

        <Row className="statistics section">
          {isLoading ? (
            <Col span={24}>
              <Row gutter={breakpoint.lg ? [30, 30] : [10, 10]}>
                {[...Array(4).keys()].map((index) => (
                  <CardSkeleton index={index} key={index} colBig={6} />
                ))}
              </Row>
            </Col>
          ) : (
            <>
              <Col span={breakpoint.lg ? 6 : 12}>
                <Statistic
                  title="Rehomed pets"
                  value={statistics.data.totalAdoptedPet}
                />
              </Col>
              <Col span={breakpoint.lg ? 6 : 12}>
                <Statistic
                  title="Available pets"
                  value={statistics.data.totalWaitingForAdoptionPet}
                />
              </Col>
              <Col span={breakpoint.lg ? 6 : 12}>
                <Statistic
                  title="Completed applications"
                  value={statistics.data.totalCompletedApplication}
                />
              </Col>
              <Col span={breakpoint.lg ? 6 : 12}>
                <Statistic
                  title="Adoption/Voluntary Events"
                  value={statistics.data.totalEvent}
                />
              </Col>
            </>
          )}
        </Row>

        <Row className="event section">
          <Col
            span={breakpoint.lg ? 8 : 24}
            className="heading-card"
            align="left"
          >
            <div className="heading-card-title">Adoption/Voluntary events.</div>
            {!isLoading && (
              <h3 className="available-statistics">{statistics.data.totalEvent} events available</h3>
            )}
            <Button type="primary" size="large" onClick={onClickEvents}>
              Browse more events <ArrowRightOutlined />
            </Button>
          </Col>
          <Col span={breakpoint.lg ? 15 : 24}>
            <Row gutter={breakpoint.lg ? [30, 30] : [10, 10]}>
              {isLoading
                ? [...Array(2).keys()].map((index) => (
                    <CardSkeleton index={index} key={index} colBig={12} />
                  ))
                : event.data.eventsList.map((p, index) => {
                    if (breakpoint.lg && index === 3) return null;
                    return <EventCard event={p} colBig={8} colSmall={12} />;
                  })}
            </Row>
          </Col>
        </Row>

        <Divider />

        <Row className="about section">
          <Col
            span={breakpoint.lg ? 18 : 24}
            className="heading-card"
            align="left"
          >
            <div className="heading-card-title">Know more about us</div>
            ReHome is a pet adoption network based in Malaysia, aiming to provide a platform for pets to get adopted, as well as 
            streamline the adoption process to increase the adoption rate. Do
            notice that this is a proof of concept website, so <b>do not key in any
            real data</b>, especially sensitive data like phone or address.
            <br />
            <br />
            Developed by Emerald Tan, a final year student at
            <Button
              type="text"
              onClick={() => window.open("https://www.apu.edu.my/")}
              style={{ color: "darkorange" }}
            >
              APU
            </Button>
            .<br />
            This is her final year project in 2022.
          </Col>

          <Col span={24} className="contact-button" align="left">
              <Button
                icon={<LinkedinFilled style={{ color: "grey" }} />}
                onClick={() => {
                  window.open("https://www.linkedin.com/in/emerald-tan");
                }}
              >
                Emerald Tan
              </Button>

              <Button
                icon={<GithubFilled style={{ color: "grey" }} />}
                onClick={() => {
                  window.open("https://github.com/emeraldtanmeiing");
                }}
              >
                emeraldtanmeiing
              </Button>
              <Button
                icon={<PhoneFilled style={{ color: "grey" }} />}
                onClick={() => copyToClipboard("60 18 366 1012")}
              >
                +60 18 366 1012
              </Button>

              <Button
                icon={<MailFilled style={{ color: "grey" }} />}
                onClick={() => copyToClipboard("emeraldtanmeiing@gmail.com")}
              >
                emeraldtanmeiing@gmail.com
              </Button>

              <Button
                icon={<FileTextFilled style={{ color: "grey" }} />}
                onClick={() => window.open(process.env.REACT_APP_RESUME_LINK)}
              >
              Resume
              </Button>
            </Col>
        </Row>
      </div>
    </div>
  );
};

export default Homepage;
