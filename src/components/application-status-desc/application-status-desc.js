import React from "react";

import { Col, Grid, Row, Collapse } from "antd";
import ApplicationStatus from "../application-status/application-status";

import "./application-status-desc.less";

const { Panel } = Collapse;

const ApplicationStatusDesc = ({ ghost = true }) => {
  const breakpoint = Grid.useBreakpoint();
  return (
    <div className="application-status-desc">
      <Collapse ghost={ghost}>
        <Panel header="Status description" key="1">
          <div className="status">
            <Row align="left" gutter={[12, 24]}>
              <Col span={breakpoint.md ? 4 : 12}>
                <Row align="center">
                  <ApplicationStatus status="To Review" />
                </Row>
                <Row align="center" className="status-description">
                  Waiting for review and arrange interview time
                </Row>
              </Col>
              <Col span={breakpoint.md ? 4 : 12}>
                <Row align="center">
                  <ApplicationStatus status="To Interview" />
                </Row>
                <Row align="center" className="status-description">
                  Waiting for interview
                </Row>
              </Col>
              <Col span={breakpoint.md ? 4 : 12}>
                <Row align="center">
                  <ApplicationStatus status="To Approve" />
                </Row>
                <Row align="center" className="status-description">
                  Waiting for approval on adoption
                </Row>
              </Col>
              <Col span={breakpoint.md ? 4 : 12}>
                <Row align="center">
                  <ApplicationStatus status="To Pay" />
                </Row>
                <Row align="center" className="status-description">
                  Waiting for adoption fee payment
                </Row>
              </Col>
              <Col span={breakpoint.md ? 4 : 12}>
                <Row align="center">
                  <ApplicationStatus status="To Pick up" />
                </Row>
                <Row align="center" className="status-description">
                  Waiting for pick up
                </Row>
              </Col>
              <Col span={breakpoint.md ? 4 : 12}>
                <Row align="center">
                  <ApplicationStatus status="Completed" />
                </Row>
                <Row align="center" className="status-description">
                  Completed
                </Row>
              </Col>
              <Col span={breakpoint.md ? 4 : 12}>
                <Row align="center">
                  <ApplicationStatus status="Rejected" />
                </Row>
                <Row align="center" className="status-description">
                  Rejected by pet's rescuer/contact person/organization
                </Row>
              </Col>
              <Col span={breakpoint.md ? 4 : 12}>
                <Row align="center">
                  <ApplicationStatus status="Cancelled" />
                </Row>
                <Row align="center" className="status-description">
                  Cancelled by applicant
                </Row>
              </Col>
              <Col span={breakpoint.md ? 4 : 12}>
                <Row align="center">
                  <ApplicationStatus status="Not Available" />
                </Row>
                <Row align="center" className="status-description">
                  Pet is no longer available for adoption
                </Row>
              </Col>
            </Row>
          </div>
        </Panel>
      </Collapse>
    </div>

    // <div className="application-status-desc">
    //   <div className="statuss">
    //     <Row>
    //       <Col className="sucess-flow steps">
    //         <Steps size="small" current={0}>
    //           <Step
    //             icon={

    //               </>
    //             }
    //           />
    //           <Step
    //             icon={

    //               </>
    //             }
    //           />
    //           <Step
    //             icon={

    //               </>
    //             }
    //           />
    //           <Step
    //             icon={

    //               </>
    //             }
    //           />
    //           <Step
    //             icon={

    //               </>
    //             }
    //           />
    //           <Step
    //             icon={

    //               </>
    //             }
    //           />
    //         </Steps>
    //       </Col>

    //       <Col className="fail-flow steps" span={breakpoint.md ? 12 : 24}>
    //         <Steps size="small" current={0}>
    //           <Step
    //             icon={

    //               </>
    //             }
    //           />
    //           <Step
    //             icon={

    //               </>
    //             }
    //           />
    //           <Step
    //             icon={

    //               </>
    //             }
    //           />
    //         </Steps>
    //       </Col>
    //     </Row>
    //   </div>
    // </div>
  );
};

export default ApplicationStatusDesc;
