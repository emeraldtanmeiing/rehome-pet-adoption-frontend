import React from "react";
import { Form, Button, Input, Select } from "antd";
import { omitBy, isNil, unset } from "lodash";
import { registerAdopter } from "../../services/auth.services.js";
import { useNavigate } from "react-router-dom";
import toaster from "../../components/toaster/toaster.js";
import "./signup-adopter.scss";

const { Option } = Select;

function SignupAdopter() {
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 3 },
    },
    wrapperCol: {
      xs: { span: 20 },
      sm: { span: 21 },
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
    const account = omitBy(values, (v) => isNil(v) || v.trim() === "");
    unset(account, "confirm_password");

    const res = await registerAdopter(account);
    if (res?.error) {
      toaster("error", res.error.description);
    } else {
      navigate("/login");
    }
  };

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

export default SignupAdopter;

// type: "adopter",
// name: "adopter1",
// email: "adopter4@gmail.com",
// phone: "0123334444",
// password: passwordHash,
// active: true,
// address: "address for rescuer, taman for rescuer",
// country: "Malaysia",
