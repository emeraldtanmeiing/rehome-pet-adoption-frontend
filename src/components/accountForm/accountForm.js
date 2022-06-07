import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getAccount, updateAccount } from "../../services/auth.services";

import {
  Row,
  Col,
  Table,
  Input,
  Button,
  Popconfirm,
  Form,
  message,
} from "antd";

import "./accountForm.less";
import EditableForm from "../editableForm/editableForm";

const AccountForm = ({}) => {
  const [account, setAccount] = useState({
    status: "idle",
    data: null,
  });

  const [accountFields, setAccountFields] = useState({
    status: "idle",
    data: null,
  });

  const isLoading = account.status !== "success" || accountFields.status !== "success";

  useEffect(()=>{
    fetchAccount()
  }, [])

  const fetchAccount = async () => {
    setAccount({ ...account, status: "loading" });
    setAccountFields({...accountFields, status: "loading"})
    
    const accountID = Cookies.get("accountID");
    const res = await getAccount({ accountID });
    if (res?.error) {
      message.error(res.error.description);
    } else {
      let fields = [];
      let a = res.account;
      fields.push({name: "name", label: "Name", value: a.name, editable: true})
      fields.push({name: "email", label: "Email", value: a.email, editable: false})
      fields.push({name: "phone", label: "Phone", value: a.phone, editable: true})
      fields.push({name: "address", label: "Address", value: a.address, editable: true})
      fields.push({name: "stateOrProvince", label: "State / Province", value: a.stateOrProvince, editable: true})
      fields.push({name: "city", label: "City", value: a.city, editable: true})
      fields.push({name: "postcode", label: "Postcode", value: a.postcode, editable: true})
      fields.push({name: "country", label: "Country", value: a.country, editable: false})
      fields.push({name: "image", label: "Image", value: a.image, editable: true, type: "image"})
      setAccountFields({...accountFields, status: "success", data: fields});

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
        image
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

  return (
    <div className="account-form">
      {!isLoading && 
        <>
        <EditableForm fields={accountFields.data} api={handleUpdateAccount} />
        </>
      }
    </div>
  );
};

export default AccountForm;
