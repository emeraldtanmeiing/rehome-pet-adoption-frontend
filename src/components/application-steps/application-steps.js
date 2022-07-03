import React, { useEffect, useState } from "react";

import { Row, Col, Steps } from "antd";
import AdoptionForm from "../adoptionForm/adoptionForm.js";
import ApplicationFormInterview from "../applicationForm/applicationForm-interview.js";
import ApplicationFormApproval from "../applicationForm/applicationForm-approval.js";
import ApplicationFormPickUp from "../applicationForm/applicationForm-pickup.js";
import ApplicationFormNoteAndDocs from "../applicationForm/applicationForm-note-docs.js";

import "./application-steps.scss";

function ApplicationSteps({
  adopterID,
  application,
  isAdopter = false,
  isRescuer = false,
  isAdmin = false,
}) {
  const { Step } = Steps;
  const [current, setCurrent] = useState(0);
  const onChange = (value) => {
    setCurrent(value);
  };

  useEffect(() => {
    if (application?.status === "To Review") {
      setCurrent(0);
    } else if (application?.status === "To Interview") {
      setCurrent(1);
    } else if (application?.status === "To Approve") {
      setCurrent(2);
    } else if (application?.status === "To Pay") {
      setCurrent(3);
    } else if (application?.status === "To Pick up") {
      setCurrent(4);
    } else if (application?.status === "Completed") {
      setCurrent(4);
    }
  }, []);

  const applicantConditionInfo = (
    <>
      {isAdopter && (
        <>
          <div>
            The pet's rescuer/contact person/organization will take a look on
            your condition to see how to help you during adoption.
            <br />
            <br />
            <br />
          </div>
          <AdoptionForm
            adopterID={adopterID}
            editable={true}
            showDescription={false}
          />
        </>
      )}
      {(isRescuer || isAdmin) && (
        <>
          <AdoptionForm
            adopterID={adopterID}
            editable={false}
            showDescription={false}
          />
        </>
      )}
    </>
  );

  const interviewInfo = (
    <>
      {(isAdopter) && (
        <>
          <div>
            An offline or online interview with you will be arranged by the
            pet's rescuer/contact person/organization. If it's an online
            interview (via Zoom, Google Meet etc), you will be able to get the
            link here.
            <br />
            <br />
            <br />
          </div>
          <ApplicationFormInterview
            application={application}
            editable={false}
          />
        </>
      )}
      {(isRescuer || isAdmin) && (
        <>
          <ApplicationFormInterview application={application} editable={application.petID.active && !application.petID.adopted}/>
        </>
      )}
    </>
  );

  const approvalInfo = (
    <>
      {(isAdopter) && (
        <>
          <div>
            After review and interview, the pet's rescuer/contact
            person/organization will approve the application by setting the
            'Approval' to 'true' if you're the suitable applicant!
            <br />
            <br />
            <br />
          </div>
          <ApplicationFormApproval application={application} editable={false} />
        </>
      )}
      {(isRescuer || isAdmin) && (
        <>
          {application.status === "To Review" ||
          application.status === "To Interview" ? (
            <>
              Please review applicant's condition and/or arrange interview
              before approve the application.
            </>
          ) : (
            <>
              <Row align="center">
                <Col span={20}>
                  Approve the application means you allowed the applicant to pay
                  and arrange for picking up.
                  <br />
                  <br />
                  After approval, ReHome will allow the applicant to pay the
                  adoption fee. Hence, please make sure you only approve one
                  applicant per pet at the same time to prevent duplication of
                  payments for the same pet from different applicants. <br />
                  <br />
                  If you think that the applicant is not suitable to adopt the
                  pet, please use the 'Reject application' button above to
                  reject the application.
                </Col>
              </Row>
              <ApplicationFormApproval application={application} editable={application.petID.active && !application.petID.adopted}/>
            </>
          )}
        </>
      )}
    </>
  );

  const paymentInfo = (
    //TODO: dun allow adopter to pay if the pet is adopted / not active
    <>
      {isAdopter && (
        <>
          <div>
            Adoption fee:{" "}
            {application.petID.fee === 0
              ? "FREE"
              : `RM ${application.petID.fee}`}
            <br />
            <br />
            After approval, you will be able to make a payment of adoption fee
            via ReHome if it's needed.
            <br />
            <br />
            <br />
          </div>
        </>
      )}
      {(isRescuer || isAdmin) && (
        <>
          {application.status === "To Review" ||
          application.status === "To Interview" ||
          application.status === "To Approve" ? (
            <>
              Please approve the application before the applicant is able to pay
              the adoption fee.
            </>
          ) : (
            <>Notified the applicant about payment / FREE</>
          )}
        </>
      )}
    </>
  );

  const pickupInfo = (
    <>
      {isAdopter && (
        <>
          <div>
            A pick up date and time will be scheduled after payment (if the
            adoption fee is not free).
            <br />
            <br />
            <br />
          </div>
          <ApplicationFormPickUp application={application} editable={false} />
        </>
      )}
      {(isRescuer || isAdmin) && (
        <>
          <>
            {application.status === "To Review" ||
            application.status === "To Interview" ||
            application.status === "To Approve" ||
            application.status === "To Pay" ? (
              <>
                The applicant haven't do payment. Pick up can be scheduled after
                the payment is done.
              </>
            ) : (
              <>
                After you mark the pet as picked up, ReHome will consider this
                pet as <b>adopted</b>. <br /><br />
                You will no longer able to edit the application except the{" "}
                <b>Notes & Documents</b> fields.
                <br />
                Other adoption applications for this pet will be stated as{" "}
                <b>Not Available</b>.
                <br />
                The pet will no longer show on listing for <b>PUBLIC</b> for
                adoption.
                <br />
                Hence, only mark the pet as <b>"Picked up"</b> after the pet is
                picked up and make sure the adoption is fully completed.
                <br /><br /><br />
               
                <ApplicationFormPickUp application={application} editable={application.petID.active && !application.petID.adopted}/>
              </>
            )}
          </>
        </>
      )}
    </>
  );

  const steps = [
    {
      title: "Applicant's Condition",
      description: "",
      content: applicantConditionInfo,
    },
    {
      title: "Interview",
      description: "",
      content: interviewInfo,
    },
    {
      title: "Approval",
      description: "",
      content: approvalInfo,
    },
    {
      title: "Payment",
      description: "",
      content: paymentInfo,
    },
    {
      title: "Pick up",
      description: "",
      content: pickupInfo,
    },
  ];

  return (
    <div className="applicationStep">
      <div className="applicationStep-wrapper">
        <ApplicationFormNoteAndDocs
          application={application}
          showNoteForStaff={isRescuer || isAdmin}
          editable={isRescuer}
        />

        <Row align="center">
          <Col span={24}>
            <Steps
              current={current}
              type="navigation"
              size="small"
              onChange={onChange}
            >
              {steps.map((item) => (
                <Step
                  key={item.title}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </Steps>
            <div className="steps-content">{steps[current].content}</div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default ApplicationSteps;
