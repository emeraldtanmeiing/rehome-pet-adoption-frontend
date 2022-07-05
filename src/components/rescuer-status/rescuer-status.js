import React from "react";

import { Tag } from "antd";

import "./rescuer-status.scss";

const RescuerStatus = ({ verified }) => {
  
  let verifyTag;
  if (verified) {
    verifyTag = (
      <Tag color="green" key="1">
        Verified
      </Tag>
    );
  }else{
    verifyTag = (
      <Tag color="red" key="1">
        Not verified
      </Tag>
    );
  }

  return <div className="rescuer-status">
    {verifyTag}
  </div>
};

export default RescuerStatus;
