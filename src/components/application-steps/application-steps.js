import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext.js";

import { Row, Col, Spin, Button, Grid, message, Steps } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import AdoptionForm from "../adoptionForm/adoptionForm.js";
import ApplicationFormInterview from "../applicationForm/applicationForm-interview.js";
import ApplicationFormNoteAndDocs from "../applicationForm/applicationForm-note-docs.js";

import "./application-steps.scss";

function ApplicationSteps({ adopterID, application }) {
  const { Step } = Steps;
  const breakpoint = Grid.useBreakpoint();

  const [isLoading, setIsLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const onChange = (value) => {
    setCurrent(value);
  };

  useEffect(() => {
    if (application?.status == "To Review") {
      setCurrent(0);
    } else if (application?.status == "To Interview") {
      setCurrent(1);
    } else if (application?.status == "To Approve") {
      setCurrent(2);
    } else if (application?.status == "To Pay") {
      setCurrent(3);
    } else if (application?.status == "To Pick up") {
      setCurrent(4);
    } else if (application?.status == "Completed") {
      setCurrent(5);
    }
  }, []);

  const navigate = useNavigate();
  const onFinish = async () => {
    // setIsLoading(true);
    // const applicationStep = {
    //   adopterID: accountID,
    //   petID: getToBeAppliedPetID(),
    // };
    // const res = await createApplication({ applicationStep });
    // if (res?.error) {
    //   message.error(res.error.description);
    //   setIsLoading(false);
    // } else {
    //   message.success("Apply successfull!");
    //   navigate("/adopt/applications");
    // }
  };

  const applicantConditionInfo = (
    <>
      <AdoptionForm
        adopterID={adopterID}
        editable={false}
        showDescription={false}
      />
    </>
  );

  const interviewInfo = (<>
    <ApplicationFormInterview application={application}/>
  </>);
  const approvalInfo = (<>
    {application.status == "To Review" || application.status == "To Interview" ? (
      <>Please review applicant's condition and/or arrange interview before approve the application.</>
    ):(<>Approve button. Please make sure you only approve one applicant per pet at the same time to prevent duplication of payments for the same pet from different applicant.</>
    )}
  </>);
  const paymentInfo = (<>
    {application.status == "To Review" || application.status == "To Interview" || application.status == "To Approve"? (
      <>Please approve the application before ReHome notify the applicant about the adoption fee payment.</>
    ):(<>Notified the applicant about payment / FREE</>
    )}
  </>);
  const pickupInfo = (<>
     {application.status == "To Review" || application.status == "To Interview" || application.status == "To Approve" || application.status == "To Pay"? (
      <>The applicant haven't do payment. Pick up can be scheduled after the payment is done.</>
    ):(<>Pick up date and time</>
    )}
  </>);
  const completedInfo = (<>
    {application.status == "To Review" || application.status == "To Interview" || application.status == "To Approve" || application.status == "To Pay" || application.status == "To Pick up"? (
     <>The adopter haven't pick up the pet. Please notify the applicant to pick up the pet.</>
   ):(<>Confirm complete button. After you click this button, other adoption applicants will be rejected and their applications will be stated as 'Rejected'. Hence, only click this button after the pet is picked up and make sure the adoption is fully completed. Reminder: upload documents or write in note. </>
   )}
 </>);

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
    {
      title: "Completed",
      description: "",
      content: completedInfo,
    },
  ];

  return (
    <div className="applicationStep">
      <div className="applicationStep-wrapper">
        <Row align="left">
          <Col span={24}>
          <ApplicationFormNoteAndDocs application={application}/>
          </Col>
        </Row>

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
