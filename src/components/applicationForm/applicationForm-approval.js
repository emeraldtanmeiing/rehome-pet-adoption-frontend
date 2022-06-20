import React, { useEffect, useState } from "react";
import { filter, isEmpty, omitBy, isNil } from "lodash";
import { useNavigate } from "react-router-dom";
import {
  updateApplications
} from "../../services/application.services";

import { Grid, Spin, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import EditableForm from "../editableForm/editableForm";

import "./applicationForm.scss";

const ApplicationFormApproval = ({
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
      name: "approved",
      label: "Approval",
      value: a.approved,
      editable: true,
      type: "boolean",
      checkedDesc: "Approved",
      uncheckedDesc: "Not approved",
    });

    setApplicationFields({
      ...applicationFields,
      status: "success",
      data: fields,
    });
  };

  const handleUpdateApplication = async ({
    approved,
  }) => {
    const res = await updateApplications({
      adoptionApplication: omitBy(
        {
          ...application,
          approved,

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
      if(res.error.errorCode === 4106){
        const approvedApplicant = res.error.errorObject.map(a => a.adopterID.name)
        message.error(`Approved applicant: ${approvedApplicant}`, 8)
      }
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
                return v.name !== "image" ;
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

export default ApplicationFormApproval;
