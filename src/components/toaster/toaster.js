import React from "react";
import { notification } from "antd";

//type: "sucess", "info", "warning", "error"
const toaster = (type, message) => {
  notification[type]({
    //   message: 'Notification Title',
    description: message,
    duration: 2,
  });
};

export default toaster;
