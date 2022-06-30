import React, { useEffect, useState } from "react";
import moment from "moment";
import { filter, isEmpty, omitBy, isNil } from "lodash";
import { useNavigate } from "react-router-dom";
import { updateApplications } from "../../services/application.services";

import { Grid, Spin, Modal, message } from "antd";
import { LoadingOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import EditableForm from "../editableForm/editableForm";

import "./applicationForm.scss";

const { confirm } = Modal;

const ApplicationFormPickUp = ({
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
      name: "pickupDate",
      label: "Pick Up Date",
      value: a?.pickupDate ? moment(a.pickupDate).format("DD MMMM YYYY") : null,
      editable: true,
      required: false,
      type: "date",
    });
    fields.push({
      name: "pickupTime",
      label: "Pick Up Time",
      value: a?.pickupTime ? a.pickupTime : null,
      editable: true,
      required: false,
      type: "time",
    });
    fields.push({
      name: "pickedup",
      label: "Picked up",
      value: a.pickedup,
      editable: true,
      type: "boolean",
      checkedDesc: "Picked up",
      uncheckedDesc: "Waiting for pick up",
    });

    setApplicationFields({
      ...applicationFields,
      status: "success",
      data: fields,
    });
  };

  const handleUpdateApplication = async ({
    pickupDate,
    pickupTime,
    pickedup,
  }) => {
    const res = await updateApplications({
      adoptionApplication: omitBy(
        {
          ...application,
          pickupDate,
          pickupTime,
          pickedup,

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
                return v.name !== "image" && v.value !== null && v.value !== "";
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

export default ApplicationFormPickUp;
