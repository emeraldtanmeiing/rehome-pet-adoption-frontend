import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { filter } from "lodash";
import { getAccount, updateAccount } from "../../services/auth.services";

import { Col, Avatar, Grid, Spin, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import "./adopterForm.less";
import EditableForm from "../editableForm/editableForm";

const AdopterForm = ({ accountID = null, editable = true }) => {
  const [account, setAccount] = useState({
    status: "idle",
    data: null,
  });

  const [accountFields, setAccountFields] = useState({
    status: "idle",
    data: null,
  });

  const isLoading =
    account.status !== "success" || accountFields.status !== "success";

  useEffect(() => {
    fetchAccount();
  }, []);

  const fetchAccount = async () => {
    setAccount({ ...account, status: "loading" });
    setAccountFields({ ...accountFields, status: "loading" });

    if (!accountID) {
      accountID = Cookies.get("accountID");
    }
    const res = await getAccount({ accountID });
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
      setAccountFields({ ...accountFields, status: "success", data: fields });

      setAccount({
        ...account,
        status: "success",
        data: res.account,
      });
    }
  };

  const handleUpdateAccount = async ({
    name,
    phone,
    address,
    stateOrProvince,
    city,
    postcode,
    image,
  }) => {
    const res = await updateAccount({
      account: {
        ...account.data,
        name,
        phone,
        address,
        stateOrProvince,
        city,
        postcode,
        image,
      },
    });

    if (res?.error) {
      message.error(res.error.description);
      return false;
    } else {
      message.success("Updated account successfully!.");
      return res;
    }
  };

  const breakpoint = Grid.useBreakpoint();

  return (
    <div className="adopter-form">
      {isLoading && (
        <>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </>
      )}
      {!isLoading &&
        (editable ? (
          <>
            <EditableForm
              fields={accountFields.data}
              api={handleUpdateAccount}
              editable={true}
            />
          </>
        ) : (
          <>
            <Col span={24} className="editable-form-item">
              <div
                className="image"
                onClick={() => window.open(account.data.image)}
              >
                <Avatar
                  size={breakpoint.sm ? 128 : 76}
                  src={account.data.image}
                  className="image"
                />
              </div>
            </Col>

            <EditableForm
              fields={filter(accountFields.data, (v) => {
                return v.name != "image" && v.value != null && v.value != "";
              })}
              api={handleUpdateAccount}
              editable={false}
            />
          </>
        ))}
    </div>
  );
};

export default AdopterForm;
