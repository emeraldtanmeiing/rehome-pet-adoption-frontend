import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import useAuthContext from "../../hooks/useAuthContext";
import { getApplications } from "../../services/application.services";

import { Col, Avatar, Grid, Spin, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import ApplicationsListing from "../../components/applications-listing/applications-listing";

import "./applications-listing-rescuer.scss";
import ApplicationStatusDesc from "../../components/application-status-desc/application-status-desc";

function ApplicationsListingRescuer() {
  const [applicationState, setApplicationState] = useState({
    status: "idle",
    data: null,
  });
  const isLoading = applicationState.status !== "success";

  useEffect(()=>{
    fetchApplications()
  }, [])

  const accountID = Cookies.get("accountID");
  const fetchApplications = async () => {
    setApplicationState({ ...applicationState, status: "loading" });

    const params = { rescuerID: accountID }

    const res = await getApplications({ rescuerID: accountID });

    if (res?.error) {
      message.error(res.error.description);
    } else {
      setApplicationState({
        ...applicationState,
        status: "success",
        data: res,
      });
    }
  };

  return (
    <div className="applications-listing-rescuer">
      {isLoading && (
        <>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </>
      )}
      {!isLoading && (
        <>
          <div className="applications-listing-rescuer-wrapper">
            <ApplicationStatusDesc />
            <ApplicationsListing applicationsList={applicationState.data.applicationsList} showRescuer={false}/>
          </div>
        </>
      )}
    </div>
  );
}

export default ApplicationsListingRescuer;
