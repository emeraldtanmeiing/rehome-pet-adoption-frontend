import { map } from "lodash";
import { calculateAge, formatDate } from "../../helpers/date";

import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  Space,
  Table,
  Avatar,
  Tag,
  Grid,
  Row,
  Col,
  Divider,
  Collapse,
} from "antd";
import React, { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import RescuerForm from "../rescuerForm/rescuerForm";
import AdopterForm from "../adopterForm/adopterForm";
import PetForm from "../petForm/petForm";
import ApplicationSteps from "../application-steps/application-steps";

import "./application.scss";
import ApplicationStatusDesc from "../application-status-desc/application-status-desc";
import ApplicationStatus from "../application-status/application-status";

const { Panel } = Collapse;

const Application = ({ data, showAdopter = false, showRescuer = false, showSteps = false }) => {
  const breakpoint = Grid.useBreakpoint();

  return (
    <div className="application">
      <Row align="center" className="brief-info">
        <Col span={breakpoint.md ? 7 : 24} className="detail outline">
          <Row align="middle">
            <Col span={6}>
              <Avatar src={data.petID.mainImage} size="large" />
            </Col>
            <Col span={17} align="left">
              <strong>Pet</strong>
              <br />
              {data.petID.name},{" "}
              {calculateAge(data.petID.ageInMonths, data.petID.createdAt)}
            </Col>
          </Row>
        </Col>

        {showAdopter && (
          <Col span={breakpoint.md ? 7 : 24} className="detail outline">
            <Row align="middle">
              <Col span={6}>
                <Avatar src={data.adopterID.image} size="large" />
              </Col>
              <Col span={18} align="left">
                <strong>Applicant</strong>
                <br />
                {data.adopterID.name}
              </Col>
            </Row>
          </Col>
        )}

        {showRescuer && (
          <Col span={breakpoint.md ? 8 : 24} className="detail outline">
            <Row align="middle">
              <Col span={6}>
                <Avatar src={data.rescuerID.image} size="large" />
              </Col>
              <Col span={18} align="left">
                <strong>Contact person</strong>
                <br />
                {data.rescuerID.name}
              </Col>
            </Row>
          </Col>
        )}
      </Row>

      <Row className="pet-adopter-rescuer-details">
        <h2>Details</h2>
        <Col span={24}>
          <Collapse>
            <Panel header="Pet details" key="1" className="pet-info">
              <PetForm petID={data.petID._id} editable={false} />
            </Panel>
            <Panel header="Applicant details" key="2" className="adopter-info">
              <AdopterForm accountID={data.adopterID._id} editable={false} />
            </Panel>
            {showRescuer && (
              <Panel
                header="Contact person details"
                key="3"
                className="rescuer-info"
              >
                <RescuerForm accountID={data.rescuerID._id} editable={false} />
              </Panel>
            )}
          </Collapse>
          <div className="status-description">
          <ApplicationStatusDesc ghost={false} />
          </div>
        </Col>
      </Row>

      <Row className="application-details">
        <Col span={breakpoint.md ? 12 : 24} align="left" className="title">
          <Row align="bottom" gutter={[12,12]}>
            <Col>
              <h2>Adoption application</h2>
            </Col>
            <Col>
              <ApplicationStatus tag={data.status} />
            </Col>
          </Row>
        </Col>

        <Col span={breakpoint.md ? 12 : 24} align="end">
          <Button danger>
            Reject application
          </Button>
        </Col>

        {showSteps && (
          <Col span={24} className="steps">
          <ApplicationSteps adopterID={data.adopterID._id} application={data}/>
        </Col>
        )}
      </Row>
    </div>
  );
};

export default Application;
