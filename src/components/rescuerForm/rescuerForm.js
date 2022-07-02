import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { filter } from "lodash";
import { getAccount, updateAccount } from "../../services/auth.services";

import { Col, Avatar, Grid, Spin, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import "./rescuerForm.less";
import EditableForm from "../editableForm/editableForm";

const RescuerForm = ({ accountID = null, editable = true, size = "default" }) => {
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
      fields.push({
        name: "verified",
        label: "Verified",
        value: a.verified,
        editable: false,
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
        extra:"Please provide complete link (eg. https://www.rehomepet.me)"
      });
      fields.push({
        name: "instagramLink",
        label: "Instagram Link",
        value: a.instagramLink,
        editable: true,
        type: "website",
        extra:"Please provide complete link (eg. https://www.rehomepet.me)"
      });
      fields.push({
        name: "organizationWebsiteLink",
        label: "Website Link",
        value: a.organizationWebsiteLink,
        editable: true,
        type: "website",
        extra:"Please provide complete link (eg. https://www.rehomepet.me)"
      });
      fields.push({
        name: "description",
        label: "Description",
        value: a.description,
        editable: true,
        type: "textArea"
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
    description,
    verified,
    facebookLink,
    instagramLink,
    organizationWebsiteLink,
    licenseNo,
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
        description,
        verified,
        facebookLink,
        instagramLink,
        organizationWebsiteLink,
        licenseNo,
      },
    });

    if (res?.error) {
      message.error(res.error.description);
      return false;
    } else {
      message.success("Updated account successfully!");
      return res;
    }
  };

  const breakpoint = Grid.useBreakpoint();

  return (
    <div className="rescuer-form">
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
              size={size}
            />
          </>
        ) : (
          <>

            <EditableForm
              fields={filter(accountFields.data, (v) => {
                return (
                  v.name != "description" &&
                  v.name != "licenseNo" &&
                  v.name != "verified" &&
                  v.name != "active" &&
                  v.value != null &&
                  v.value != ""
                );
              })}
              api={handleUpdateAccount}
              editable={false}
              size={size}
            />
          </>
        ))}
    </div>
  );
};

export default RescuerForm;
