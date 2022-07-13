import React, { useState, useEffect } from "react";
import { map } from "lodash";
import { getReport } from "../../services/report.services.js";

import { Row, Col, Spin, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import DonutChart from "../../components/chart/donutChart.js";
import LineChart from "../../components/chart/lineChart.js";

import "./dashboard.less";

const Dashboard = () => {
  const [statistics, setStatistics] = useState({ status: "idle", data: null });

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setStatistics({ ...statistics, status: "loading" });

    const res = await getReport();

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

  const textStatistics = ({ title, description, value }) => {
    return (
      <>
        <Col align="left" className="text-statistics">
          <h3 className="title">{title}</h3>
          <h5 className="desc">{description}</h5>
          <h1 className="value">{value}</h1>
        </Col>
      </>
    );
  };

  const leftColProps = { xxl: 16, xl: 16, lg: 16, md: 16, sm: 24, xs: 24 };
  const rightColProps = { xxl: 8, xl: 8, lg: 8, md: 8, sm: 24, xs: 24 };
 
  return (
    <div className="dashboard">
      {statistics.status !== "success" ? (
        <>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </>
      ) : (
        <div className="dashboard-wrapper">
          <div className="pet background">
            <h1 className="heading">Pet</h1>

            <Row className="text-statistics-group section">
              {textStatistics({
                title: "Total",
                description: "All pets",
                value: statistics.data?.totalPet,
              })}
              {textStatistics({
                title: "Active",
                description: "Active pets",
                value: statistics.data?.totalActivePet,
              })}
              {textStatistics({
                title: "Adopted",
                description: "Adopted pets",
                value: statistics.data?.totalAdoptedPet,
              })}
              {textStatistics({
                title: "Available",
                description: "Pets waiting for adoption",
                value: statistics.data?.totalWaitingForAdoptionPet,
              })}
              {textStatistics({
                title: "Adoption Fee",
                description: "Average adoption fee",
                value: `RM ${statistics.data?.averagePetFee}`,
              })}
            </Row>

            <Row className="charts">
              <Col {...leftColProps} className="section">
                <LineChart
                  title={`${"New Pet Each Month"}`}
                  data={map(statistics.data?.newPetsPerMonth, (a, index) => {
                    return {
                      month: a._id,
                      value: a.count,
                    };
                  })}
                />
              </Col>
              <Col {...rightColProps} className="section">
                <DonutChart
                  title="Pet Gender"
                  data={[
                    { type: "Male", value: statistics.data?.petGenderMale },
                    { type: "Female", value: statistics.data?.petGenderFemale },
                  ]}
                />
              </Col>
            </Row>
          </div>

          <div className="application background">
            <h1 className="heading">Adoption Applications</h1>

            <Row className="text-statistics-group section">
              {textStatistics({
                title: "Total",
                description: "All applications",
                value: statistics.data?.totalApplication,
              })}
              {textStatistics({
                title: "In Progress",
                description: "In Progress applications",
                value: statistics.data?.totalInProgressApplication,
              })}
              {textStatistics({
                title: "Completed",
                description: "Completed applications",
                value: statistics.data?.totalCompletedApplication,
              })}
              {textStatistics({
                title: "Rejected/Cancelled",
                description: "Rejected/Cancelled applications",
                value: statistics.data?.totalRejectedOrCancelledApplication,
              })}
            </Row>

            <Row className="charts">
              <Col {...leftColProps} className="section">
                <LineChart
                  title="New Applications Each Month"
                  data={map(
                    statistics.data?.newApplicationPerMonth,
                    (a, index) => {
                      return {
                        month: a._id,
                        value: a.count,
                      };
                    }
                  )}
                />
              </Col>
              <Col {...rightColProps} className="section">
                <DonutChart
                  title="Application Status"
                  data={map(
                    statistics.data?.applicationByStatus,
                    (a, index) => {
                      return {
                        type: a._id,
                        value: a.count,
                      };
                    }
                  )}
                />
              </Col>
            </Row>
          </div>

          <div className="user background">
            <h1 className="heading">Users</h1>

            <Row className="text-statistics-group section">
              {textStatistics({
                title: "Total",
                description: "All users",
                value: statistics.data?.totalUser,
              })}
              {textStatistics({
                title: "Active",
                description: "All active users",
                value: statistics.data?.totalActiveUser,
              })}
              {textStatistics({
                title: "Rescuers",
                description: "Active rescuers",
                value: statistics.data?.totalActiveRescuer,
              })}
              {textStatistics({
                title: "Adopters",
                description: "Active adopters",
                value: statistics.data?.totalActiveAdopter,
              })}
              {textStatistics({
                title: "Admin",
                description: "Admin",
                value: statistics.data?.totalAdmin,
              })}
            </Row>

            <Row className="charts">
              <Col {...leftColProps} className="section">
                <LineChart
                  title={`${"New Users Each Month"}`}
                  data={map(statistics.data?.newUsersPerMonth, (a, index) => {
                    return {
                      month: a._id,
                      value: a.count,
                    };
                  })}
                />
              </Col>
              <Col {...rightColProps} className="section">
                <DonutChart
                  title={`${"User By States/Province"}`}
                  data={map(statistics.data?.userByState, (a, index) => {
                    return {
                      type: a._id,
                      value: a.count,
                    };
                  })}
                />
              </Col>
            </Row>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
