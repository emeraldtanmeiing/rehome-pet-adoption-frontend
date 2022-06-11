import { map } from "lodash";
import { formatDate } from "../../helpers/date";

import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Avatar, Tag, Grid, Row } from "antd";
import React, { useRef, useState } from "react";
import Highlighter from "react-highlight-words";

import "./application.scss";

const Application = ({ data }) => {

  const breakpoint = Grid.useBreakpoint();
 
  return (
    <div className="application">
      <Row className="buttons"></Row>
      <Row className="pet-info"></Row>
      <Row className="applicant-info"></Row>
      <Row className="rescuer-info"></Row>
      <Row className="application-details"></Row>
    </div>
  );
};

export default Application;
