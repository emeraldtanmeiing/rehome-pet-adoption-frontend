import React from "react";

import { Tag } from "antd";

const ApplicationStatus = ({ status, pet = null }) => {
  
  if(pet){
    if(!pet?.active || (status != "Completed" && pet?.adopted)){
      status = "Not Available"
    } 
  }

  let color;
  switch (status) {
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
    case "Not Available":
      color = null;
      break;
    default:
      color = null;
  }
  return (
    <Tag color={color} key={status}>
      {status}
    </Tag>
  );
};

export default ApplicationStatus;
