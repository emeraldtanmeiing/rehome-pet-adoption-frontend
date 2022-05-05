import React, { useState } from "react";
import { Form, Button, Input, Selector, Select, AutoComplete } from "antd";
import { omitBy, isNil, unset } from "lodash";
import { registerRescuer } from "../../services/auth.services.js";
import { useNavigate } from "react-router-dom";
import "./signup-rescuer.scss";
import toaster from "../../components/toaster/toaster.js";

const { Option } = Select;

function SignupRescuer() {
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 10 },
    },
    wrapperCol: {
      xs: { span: 20 },
      sm: { span: 14 },
    },
  };

  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 24,
        offset: 0,
      },
    },
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="60">+60</Option>
      </Select>
    </Form.Item>
  );

  const [autoCompleteResult, setAutoCompleteResult] = useState([]);

  const onWebsiteChange = (value) => {
    if (!value) {
      setAutoCompleteResult([]);
    } else {
      setAutoCompleteResult(
        [".com", ".my", ".org"].map((domain) => `${value}${domain}`)
      );
    }
  };

  const websiteOptions = autoCompleteResult.map((website) => ({
    label: website,
    value: website,
  }));

  const validateMessages = {
    required: "${label} is required.",
    types: {
      email: "${label} is not a valid email.",
    },
  };

  const navigate = useNavigate();

  const onFinish = async (values) => {
    const account = omitBy(values, (v) => isNil(v) || v.trim() === "");
    unset(account, "confirm_password");

    const res = await registerRescuer(account);
    if (res?.error) {
      toaster("error", res.error.description);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="signup-rescuer">
      <div className="signup-form-wrapper">
        Sign up Rescuer
        <div className="signup-criteria">
          Rescuer will need to be verified by ReHome's admin before posting any
          pet for adoption. Hence, please provide social media page link or
          license number for verification purpose.
        </div>
        <div className="signup-form">
          <Form
            name="signup-rescuer"
            onFinish={onFinish}
            validateMessages={validateMessages}
            initialValues={{
              prefix: "60",
              country: "Malaysia",
            }}
            scrollToFirstError
            {...formItemLayout}
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="Type your name" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input placeholder="Type your email" />
            </Form.Item>

            <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
              <Input
                addonBefore={prefixSelector}
                placeholder="Type your phone"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true }]}
            >
              <Input.Password placeholder="Type your password" />
            </Form.Item>

            <Form.Item
              name="confirm_password"
              label="Confirm Password"
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm your password" />
            </Form.Item>

            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true }]}
            >
              <Input placeholder="Type your address" />
            </Form.Item>

            <Form.Item
              name="country"
              label="Country"
              rules={[{ required: true }]}
            >
              <Select placeholder="select your country">
                <Option value="Malaysia">Malaysia</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true }]}
              tooltip="Make people know about your organization. (eg. What your organization do? Where is your organization?) "
            >
              <Input.TextArea showCount maxLength={1000} />
            </Form.Item>

            <Form.Item
              name="licenseNo"
              label="License Number"
              tooltip="NGO License Number, Vet License or any license for verification purpose"
            >
              <Input placeholder="Add your License Number" />
            </Form.Item>

            <Form.Item
              name="facebookLink"
              label="Facebook Link"
              tooltip="Your organization's Facebook Page for verification and publicity purpose"
            >
              <Input placeholder="Add your Facebook Page Link" />
            </Form.Item>

            <Form.Item
              name="instagramLink"
              label="Instagram Link"
              tooltip="Your organization's Instagram Page for verification and publicity purpose"
            >
              <Input placeholder="Add your Instagram Page Link" />
            </Form.Item>

            <Form.Item
              name="organizationWebsiteLink"
              label="Organization Website Link"
              tooltip="Your organization's Website for verification and publicity purpose"
            >
              <AutoComplete options={websiteOptions} onChange={onWebsiteChange}>
                <Input placeholder="Add your Website Link" />
              </AutoComplete>
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                Register
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default SignupRescuer;

// type: "rescuer",
// name: "rescuer1",
// email: "rescuer15@gmail.com",
// phone: "0123334444",
// password: passwordHash,
// active: true,

// //rescuer
// verified: false,
// address: "address1",
// description: "description1",
// facebookLink: "facebookLink1",
// instagramLink: "instagramLink1",
// organizationWebsiteLink: "organizationWebsiteLink1",
