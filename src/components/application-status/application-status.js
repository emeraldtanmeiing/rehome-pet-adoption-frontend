import React from "react";

import { Tag, Col, Grid, Row, Collapse } from "antd";

import "./application-status.less";

const { Panel } = Collapse;

const ApplicationStatus = () => {
  const breakpoint = Grid.useBreakpoint();

  return (
    <div className="application-status">
    <Collapse ghost>
      <Panel header="Status Description" key="1">
      <div className="status">
        <Row align="left" gutter={[12, 24]}>
          <Col span={breakpoint.md ? 4 : 12}>
            <Row align="center">
              <Tag color={"orange"}>To Review</Tag>
            </Row>
            <Row align="center" className="status-description">
              Waiting for review and arrange interview time
            </Row>
          </Col>
          <Col span={breakpoint.md ? 4 : 12}>
            <Row align="center">
              <Tag color={"geekblue"}>To Interview</Tag>
            </Row>
            <Row align="center" className="status-description">
              Waiting for interview
            </Row>
          </Col>
          <Col span={breakpoint.md ? 4 : 12}>
            <Row align="center">
              <Tag color={"magenta"}>To Approve</Tag>
            </Row>
            <Row align="center" className="status-description">
              Waiting for approval on adoption
            </Row>
          </Col>
          <Col span={breakpoint.md ? 4 : 12}>
            <Row align="center">
              <Tag color={"cyan"}>To Pay</Tag>
            </Row>
            <Row align="center" className="status-description">
              Waiting for adoption fee payment
            </Row>
          </Col>
          <Col span={breakpoint.md ? 4 : 12}>
            <Row align="center">
              <Tag color={"purple"}>To Pick up</Tag>
            </Row>
            <Row align="center" className="status-description">
              Waiting for pick up
            </Row>
          </Col>
          <Col span={breakpoint.md ? 4 : 12}>
            <Row align="center">
              <Tag color={"green"}>Completed</Tag>
            </Row>
            <Row align="center" className="status-description">
              Completed
            </Row>
          </Col>
          <Col span={breakpoint.md ? 4 : 12}>
            <Row align="center">
              <Tag color={"red"}>Rejected</Tag>
            </Row>
            <Row align="center" className="status-description">
              Rejected by pet's rescuer/contact person/organization
            </Row>
          </Col>
          <Col span={breakpoint.md ? 4 : 12}>
            <Row align="center">
              <Tag color={"red"}>Cancelled</Tag>
            </Row>
            <Row align="center" className="status-description">
              Cancelled by applicant
            </Row>
          </Col>
          <Col span={breakpoint.md ? 4 : 12}>
            <Row align="center">
              <Tag>Deactivated</Tag>
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

    // <div className="application-status">
    //   <div className="tags">
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

export default ApplicationStatus;
