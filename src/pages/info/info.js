import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { omitBy, isNil, unset } from "lodash";
import { registerRescuer } from "../../services/auth.services.js";

import {
  Row,
  Col,
  Form,
  Button,
  Input,
  Select,
  AutoComplete,
  Upload,
  Tooltip,
  message,
  Divider,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import "./info.less";

const { Option } = Select;

function Info() {
  const [isLoading, setIsLoading] = useState(false);

  const validateMessages = {
    required: "${label} is required.",
    types: {
      email: "${label} is not a valid email.",
    },
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
      md: { span: 6 },
      lg: { span: 6 },
      xl: { span: 6 },
      xxl: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
      md: { span: 20 },
      lg: { span: 20 },
      xl: { span: 20 },
      xxl: { span: 20 },
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

  const navigate = useNavigate();

  const onFinish = async (values) => {
    setIsLoading(true);
    // const account = omitBy(values, isNil);

    // const res = await registerRescuer({ account, image });

    // if (res?.error) {
    //   message.error(res.error.description);
    //   setIsLoading(false);
    // } else {
    //   message.success("info successful! Please login.");
    //   navigate("/login");
    // }
  };

  const gridProps = { xxl: 24, xl: 24, lg: 24, md: 24, sm: 24, xs: 24 };

  return (
    <div className="info">
      <div className="info-form-wrapper">
        <Row align="center">
          <Col span={24}>
            <h1>Info</h1>
          </Col>
          <Col {...gridProps}>
            <Row className="info-criteria" gutter={[18, 18]}>
              <Col span={24}>
                <div>Info page is still in progress.</div>
                <div>This section is to collect information about adopter, such as pet ownership, housing situation etc.</div>
              </Col>
            </Row>

            <div className="info-form">
              <Form
                name="info"
                onFinish={onFinish}
                validateMessages={validateMessages}
                // initialValues={{
                //   prefix: "60",
                //   country: "Malaysia",
                //   stateOrProvince: "Selangor",
                // }}
                scrollToFirstError
                {...formItemLayout}
              >
                <Form.Item
                  name="family"
                  label="Housing situation"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                    },
                  ]}
                >
                  <Input placeholder="How many family members / housemates you have?" />
                </Form.Item>

                <Form.Item
                  name="time"
                  label="Do you have any pets now?"
                  rules={[{ required: true }]}
                  className="left"
                >
                  <Select placeholder="">
                    <Option value="Yes">Yes</Option>
                    <Option value="No">No</Option>
                  </Select>
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                  <Button
                    disabled
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                    style={{ width: "100%" }}
                  >
                    Continue
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Info;
