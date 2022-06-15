import { omitBy, isNil } from "lodash";
import { updateApplications } from "../../services/application.services";
import { calculateAge } from "../../helpers/date";

import {
  Button,
  Avatar,
  Grid,
  Row,
  Col,
  Collapse,
  Modal,
  Tooltip,
  message,
} from "antd";
import React from "react";
import { ExclamationCircleFilled } from '@ant-design/icons';
import RescuerForm from "../rescuerForm/rescuerForm";
import AdopterForm from "../adopterForm/adopterForm";
import PetForm from "../petForm/petForm";
import ApplicationSteps from "../application-steps/application-steps";
import ApplicationStatusDesc from "../application-status-desc/application-status-desc";
import ApplicationStatus from "../application-status/application-status";

import "./application.scss";

const { Panel } = Collapse;
const { confirm } = Modal;

const Application = ({
  data,
  showAdopter = false,
  showRescuer = false,
  showSteps = false,
}) => {
  const breakpoint = Grid.useBreakpoint();

  const showDeleteConfirm = () => {
    confirm({
      title: 'Are you sure to reject this application?',
      icon: <ExclamationCircleFilled style={{color: "red"}}/>,
      content: "You can't unreject this application once you reject. You can still edit the details, but the status will remain as 'Rejected'. You can only ask the applicant to apply again if this was a mistake.",
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleRejectApplication();
      },
    });
  };

  const handleRejectApplication = async () => {
    const res = await updateApplications({
      adoptionApplication: omitBy(
        {
          ...data,
          adopterID: data.adopterID._id,
          petID: data.petID._id,
          rescuerID: data.rescuerID._id,
          paymentID: data.paymentID?._id ? data.paymentID._id : null,

          status: "Rejected",
        },
        (v) => isNil(v) || v.toString().trim() === ""
      ),
    });
    if (res?.error) {
      message.error(res.error.description);
      return false;
    } else {
      message.success("Updated adoption application successfully!");
      return res;
    }
  };

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
          <Row align="bottom" gutter={[12, 12]}>
            <Col>
              <h2>Adoption application</h2>
            </Col>
            <Col>
              <ApplicationStatus tag={data.status} />
            </Col>
          </Row>
        </Col>

        <Col span={breakpoint.md ? 12 : 24} align="end">
        <Tooltip placement="top" title="You can't unreject this application once you reject. You can still edit the details, but the status will remain as 'Rejected'. You can only ask the applicant to apply again if this was a mistake.">
          <Button danger onClick={showDeleteConfirm}>
            Reject application
          </Button>
          </Tooltip>
        </Col>

        {showSteps && (
          <Col span={24} className="steps">
            <ApplicationSteps
              adopterID={data.adopterID._id}
              application={data}
            />
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Application;
