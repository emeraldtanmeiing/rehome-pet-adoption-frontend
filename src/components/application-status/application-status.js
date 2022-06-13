import React from "react";

import { Tag } from "antd";

import "./application-status.less";

const ApplicationStatus = ({ tag }) => {
  let color;
  switch (tag) {
    case "To Review":
      color = "orange";
      break;
    case "To Interview":
      color = "geekblue";
      break;
    case "To Approve":
      color = "magenta";
      break;
    case "To Pay":
      color = "cyan";
      break;
    case "To Pick up":
      color = "purple";
      break;
    case "Completed":
      color = "green";
      break;
    case "Rejected":
      color = "red";
      break;
    case "Cancelled":
      color = "red";
      break;
    case "Deactivated":
      color = null;
      break;
    default:
      color = null;
  }
  return (
    <Tag color={color} key={tag}>
      {tag}
    </Tag>
  );
};

export default ApplicationStatus;
