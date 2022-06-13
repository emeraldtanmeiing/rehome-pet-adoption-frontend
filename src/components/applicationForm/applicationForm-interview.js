import React, { useEffect, useState } from "react";
import moment from "moment";
import Cookies from "js-cookie";
import { filter, isEmpty, omitBy, isNil } from "lodash";
import { useNavigate } from "react-router-dom";
import {
  getApplications,
  updateApplications,
} from "../../services/application.services";
import { getAccount } from "../../services/auth.services";
import { formatDate } from "../../helpers/date";

import { Row, Col, Grid, Spin, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import EditableForm from "../editableForm/editableForm";

import "./applicationForm.scss";

const ApplicationFormInterview = ({
  application = {},
  editable = true,
  size = "default",
}) => {
  const navigate = useNavigate();

  const [applicationFields, setApplicationFields] = useState({
    status: "idle",
    data: null,
  });

  const isLoading = applicationFields.status !== "success";

  useEffect(() => {
    loadApplicationFields();
  }, []);

  const loadApplicationFields = async () => {
    setApplicationFields({ ...applicationFields, status: "loading" });

    let a;
    if (!isEmpty(application)) {
      a = application;
    }

    let fields = [];

    fields.push({
      name: "interviewDate",
      label: "Interview Date",
      value: a?.interviewDate
        ? moment(a.interviewDate).format("DD MMMM YYYY")
        : null,
      editable: true,
      required: false,
      type: "date",
    });
    fields.push({
      name: "interviewTime",
      label: "Interview Time",
      value: a?.interviewTime ? a.interviewTime : null,
      editable: true,
      required: false,
      type: "time",
    });

    setApplicationFields({
      ...applicationFields,
      status: "success",
      data: fields,
    });
  };

  const handleUpdateApplication = async ({
    status,
    interviewDate,
    interviewTime,
    pickupDate,
    pickupTime,
    rejectReason,
    note,
    documents,
    // paymentID,
  }) => {
    const res = await updateApplications({
      adoptionApplication: omitBy(
        {
          ...application,
          status,
          interviewDate,
          interviewTime,
          pickupDate,
          pickupTime,
          rejectReason,
          note,
          documents,

          adopterID: application.adopterID._id,
          petID: application.petID._id,
          rescuerID: application.rescuerID._id,
          paymentID: application.paymentID?._id
            ? application.paymentID._id
            : null,
        },
        (v) => isNil(v) || v.toString().trim() === ""
      ),
    });
    if (res?.error) {
      message.error(res.error.description);
      return false;
    } else {
      message.success("Updated adoption application successfully!");
      return res;
    }
  };

  const breakpoint = Grid.useBreakpoint();

  return (
    <div className="application">
      {isLoading && (
        <>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </>
      )}

      {!isLoading &&
        (editable ? (
          <>
            <EditableForm
              fields={applicationFields.data}
              api={handleUpdateApplication}
              editable={true}
              size={size}
            />
          </>
        ) : (
          <>
            <EditableForm
              fields={filter(applicationFields.data, (v) => {
                return v.name != "image" && v.value != null && v.value != "";
              })}
              api={handleUpdateApplication}
              editable={false}
              size={size}
            />
          </>
        ))}
    </div>
  );
};

export default ApplicationFormInterview;
