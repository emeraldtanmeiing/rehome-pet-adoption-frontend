import React, { useEffect, useState } from "react";
import { omit } from "lodash";
import useQuery from "../../hooks/useQuery";
import { getAccount, updateAccount } from "../../services/auth.services";

import { Row, Col, Spin, Modal, Grid, Tooltip, Button, message } from "antd";
import { LoadingOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import EditableForm from "../../components/editableForm/editableForm";
import RescuerStatus from "../../components/rescuer-status/rescuer-status";

import "./rescuer-for-admin.scss";

const { confirm } = Modal;

const RescuerForAdmin = () => {
  const [rescuer, setRescuer] = useState({
    status: "idle",
    data: null,
  });

  const [rescuerFields, setRescuerFields] = useState({
    status: "idle",
    data: null,
  });

  const isLoading =
    rescuer.status !== "success" || rescuerFields.status !== "success";

  useEffect(() => {
    fetchRescuer();
  }, []);

  const query = useQuery();
  const fetchRescuer = async () => {
    setRescuer({ ...rescuer, status: "loading" });
    setRescuerFields({ ...rescuerFields, status: "loading" });

    const rescuerID = query.get("rescuerID");
    const res = await getAccount({ accountID: rescuerID });
    if (res?.error) {
      message.error(res.error.description);
    } else {
      let fields = [];
      let a = res.account;

      fields.push({
        name: "image",
        label: "Image",
        value: a.image,
        editable: true,
        type: "image",
      });
      fields.push({
        name: "name",
        label: "Name",
        value: a.name,
        editable: true,
        required: true,
      });
      fields.push({
        name: "email",
        label: "Email",
        value: a.email,
        editable: false,
        required: true,
      });
      fields.push({
        name: "active",
        label: "Active",
        value: a.active,
        editable: true,
      });
      fields.push({
        name: "verified",
        label: "Verified",
        value: a.verified,
        editable: false,
      });
      fields.push({
        name: "phone",
        label: "Phone",
        value: a.phone,
        editable: true,
        type: "phone",
        required: true,
      });
      fields.push({
        name: "address",
        label: "Address",
        value: a.address,
        editable: true,
        required: true,
      });
      fields.push({
        name: "stateOrProvince",
        label: "State / Province",
        value: a.stateOrProvince,
        editable: true,
        type: "stateOrProvince",
        required: true,
      });
      fields.push({
        name: "city",
        label: "City",
        value: a.city,
        editable: true,
        required: true,
      });
      fields.push({
        name: "postcode",
        label: "Postcode",
        value: a.postcode,
        editable: true,
        type: "postcode",
        required: true,
      });
      fields.push({
        name: "country",
        label: "Country",
        value: a.country,
        editable: false,
        required: true,
      });
      fields.push({
        name: "licenseNo",
        label: "License No",
        value: a.licenseNo,
        editable: true,
      });
      fields.push({
        name: "facebookLink",
        label: "Facebook Link",
        value: a.facebookLink,
        editable: true,
        type: "website",
      });
      fields.push({
        name: "instagramLink",
        label: "Instagram Link",
        value: a.instagramLink,
        editable: true,
        type: "website",
      });
      fields.push({
        name: "organizationWebsiteLink",
        label: "Website Link",
        value: a.organizationWebsiteLink,
        editable: true,
        type: "website",
      });
      fields.push({
        name: "description",
        label: "Description",
        value: a.description,
        editable: true,
        type: "textArea",
      });

      setRescuerFields({ ...rescuerFields, status: "success", data: fields });
      setRescuer({
        ...rescuer,
        status: "success",
        data: a,
      });
    }
  };

  const handleUpdateRescuer = async (verified) => {
    setRescuer({ ...rescuer, status: "loading" });
    setRescuerFields({ ...rescuerFields, status: "loading" });

    const res = await updateAccount({
      account: omit({
        ...rescuer.data,
        verified: verified,
      }),
    });

    if (res?.error) {
      message.error(res.error.description);
      return false;
    } else {
      message.success("Updated rescuer successfully!");

      const data = rescuerFields.data;
      const verifiedIndex = data.findIndex((d) => d.name === "verified");
      data[verifiedIndex].value = res.verified;
     
      setRescuerFields({
        ...rescuerFields,
        status: "success",
        data: data
      });
      setRescuer({
        ...rescuer,
        status: "success",
        data: res,
      });
      return res;
    }
  };

  const showVerifyConfirm = () => {
    confirm({
      title: "Are you sure to verify this rescuer?",
      icon: <ExclamationCircleFilled style={{ color: "red" }} />,
      content:
        "The rescuer can only start to post pets for adoption after verification. You CAN UNDO this by unverifying (block) the rescuer.",
      okText: "Verify",
      cancelText: "Cancel",
      onOk() {
        handleUpdateRescuer(true);
      },
    });
  };

  const showBlockConfirm = () => {
    confirm({
      title: "Are you sure to unverify/block this rescuer?",
      icon: <ExclamationCircleFilled style={{ color: "red" }} />,
      content:
        "The rescuer will not be able to post pets for adoption after clicking this button. The posted pet will also be blocked and can't be adopted. You CAN UNDO this action by verifying the rescuer later.",
      okText: "Unverify/Block",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        handleUpdateRescuer(false);
      },
    });
  };

  const breakpoint = Grid.useBreakpoint();

  return (
    <div className="rescuer-for-admin">
      {isLoading && (
        <>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </>
      )}
      {!isLoading && (
        <>
          <Row className="header" align="middle">
            <Col span={12} align="left" className="title">
              <Row align="middle" gutter={[12, 12]}>
                <Col>
                  <h1 className="title">Rescuer Info</h1>
                </Col>
                <Col>
                  <RescuerStatus
                    active={rescuer.data.active}
                    verified={rescuer.data.verified}
                  />
                </Col>
              </Row>
            </Col>

            <Col
              className="buttons"
              span={12}
              align="end"
            >
              {rescuer.data.verified && (
                <Tooltip
                  placement="top"
                  title="The rescuer will not be able to post pets for adoption after clicking this button. The posted pet will also be blocked and can't be adopted. You CAN UNDO this action by verifying the rescuer later."
                >
                  <Button type="primary" onClick={showBlockConfirm}>
                    Unverify / Block
                  </Button>
                </Tooltip>
              )}

              {!rescuer.data.verified && (
                <Tooltip
                  placement="top"
                  title="The rescuer can only start to post pets for adoption after verification. You CAN UNDO this by unverifying (block) the rescuer."
                >
                  <Button type="primary" onClick={showVerifyConfirm}>
                    Verify
                  </Button>
                </Tooltip>
              )}
            </Col>
          </Row>
          <EditableForm fields={rescuerFields.data} editable={false} />
        </>
      )}
    </div>
  );
};

export default RescuerForAdmin;
