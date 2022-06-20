import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import useAuthContext from "../../hooks/useAuthContext";
import useQuery from "../../hooks/useQuery.js";
import { getApplications } from "../../services/application.services";

import { Col, Avatar, Grid, Spin, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import ApplicationsListing from "../../components/application/application";

import "./application-adopter.scss";
import ApplicationStatusDesc from "../../components/application-status-desc/application-status-desc";
import Application from "../../components/application/application";

function ApplicationAdopter() {
  const [applicationState, setApplicationState] = useState({
    status: "idle",
    data: null,
  });
  const isLoading = applicationState.status !== "success";

  useEffect(()=>{
    fetchApplications()
  }, [])

  const query = useQuery();
  const applicationID = query.get("applicationID");

  const fetchApplications = async () => {

    if(!applicationID){
      message.error("Invalid URL. No applicationID provided.")
    }
    setApplicationState({ ...applicationState, status: "loading" });

    const params = { applicationID }

    const res = await getApplications(params);
   
    if (res?.error) {
      message.error(res.error.description);
    } else {
      setApplicationState({
        ...applicationState,
        status: "success",
        data: res.applicationsList[0],
      });
    }
  };

  return (
    <div className="application-adopter">
      {isLoading && (
        <>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </>
      )}
      {!isLoading && (
        <>
          <div className="application-adopter-wrapper">
            {/* <ApplicationStatusDesc /> */}
            <Application data={applicationState.data} isAdopter={true}/>
          </div>
        </>
      )}
    </div>
  );
}

export default ApplicationAdopter;
