import React, { useState } from "react";
import { omitBy, isNil, unset } from "lodash";
import { useNavigate } from "react-router-dom";
import { registerAdopter } from "../../services/auth.services.js";

import { Form, Button, Input, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import "./signup-adopter.scss";

const { Option } = Select;

function SignupAdopter() {

  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const normFile = (uploadEvent) => {
    if (Array.isArray(uploadEvent)) {
      return uploadEvent;
    }
  };

  const validateFile = (value) => {
    const file = value;

    const fileTypes = ["image/png", "image/jpg", "image/jpeg", "image/svg+xml"];

    if (!fileTypes.includes(file.type)) {
      message.error(`${file.name} format is not accepted.`);
      return Upload.LIST_IGNORE;
    }

    const isLt1M = file.size / 1024 / 1024 <= 1;
    if (!isLt1M) {
      message.error(`Image size should be smaller than 1MB.`);
      return Upload.LIST_IGNORE;
    }
  };

  const onImageChange = (value) => {
    setImage(value.fileList[0]?.originFileObj)
  }

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const handleSignUpAsRescuer = () => {
    navigate("/rescuer/signup");
  };

  const validateMessages = {
    required: "${label} is required.",
    types: {
      email: "${label} is not a valid email.",
    },
  };

  const navigate = useNavigate();
  const onFinish = async (values) => {
    setIsLoading(true);
    const account = omitBy(values, isNil);

    const res = await registerAdopter({ account, image });
    
    if (res?.error) {
      message.error(res.error.description);
      setIsLoading(false);
    } else {
      message.success("Signup successful! Please login.")
      navigate("/login");
    }
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
      md: { span: 5 },
      lg: { span: 3 },
      xl: { span: 3 },
      xxl: { span: 3 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
      md: { span: 19 },
      lg: { span: 21 },
      xl: { span: 21 },
      xxl: { span: 21 }
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

  return (
    <div className="signup-adopter">
      <div className="signup-form-wrapper">
        Sign up Adopter
        <Button
          type="link"
          style={{ width: "100%" }}
          onClick={handleSignUpAsRescuer}
        >
          If you're a rescuer, sign up as rescuer here.
        </Button>
        <div className="signup-form">
          <Form
            name="signup-adopter"
            onFinish={onFinish}
            validateMessages={validateMessages}
            initialValues={{
              prefix: "60",
              country: "Malaysia",
              stateOrProvince: "Selangor"
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
              name="stateOrProvince"
              label="State/Province"
              rules={[{ required: true }]}
              className="left"
            >
              <Select placeholder="Select your state or province">
                <Option value="Selangor">Selangor</Option>
                <Option value="Kuala Lumpur">Kuala Lumpur</Option>
                <Option value="Putrajaya">Putrajaya</Option>
                <Option value="Negeri Sembilan">Negeri Sembilan</Option>
                <Option value="Johor">Johor</Option>
                <Option value="Melaka">Melaka</Option>
                <Option value="Kedah">Kedah</Option>
                <Option value="Kelantan">Kelantan</Option>
                <Option value="Pahang">Pahang</Option>
                <Option value="Perak">Perak</Option>
                <Option value="Perlis">Perlis</Option>
                <Option value="Pulau Pinang">Pulau Pinang</Option>
                <Option value="Terengganu">Terengganu</Option>
                <Option value="Sabah">Sabah</Option>
                <Option value="Sarawak">Sarawak</Option>
                <Option value="Labuan">Labuan</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="city"
              label="City"
              rules={[
                {
                  required: true,
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="Type your city" />
            </Form.Item>

            <Form.Item
              name="postcode"
              label="Postcode"
              rules={[
                {
                  required: true,
                  whitespace: true,
                },
                () => ({
                  validator(_, value) {
                    if (
                      !value ||
                      (value.length == 5 && value.match(/^[0-9]+$/) != null)
                    ) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      new Error("Postcode should be five digit numeric.")
                    );
                  },
                }),
              ]}
            >
              <Input placeholder="Type your postcode" />
            </Form.Item>

            <Form.Item
              name="country"
              label="Country"
              rules={[{ required: true }]}
              className="left"
            >
              <Select placeholder="select your country" disabled>
                <Option value="Malaysia">Malaysia</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="image"
              label="Profile Picture"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              className="left"
            >
              <Upload
                name="logo"
                listType="picture"
                maxCount={1}
                beforeUpload={validateFile}
                onChange={onImageChange}
                customRequest={dummyRequest}
                accept="image/png, image/jpeg, image/svg+xml"
              >
                <Button icon={<UploadOutlined />}>
                  Upload image only (Max: 1)
                </Button>
              </Upload>
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
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

export default SignupAdopter;