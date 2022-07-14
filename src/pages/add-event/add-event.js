import React, { useEffect, useState } from "react";
import { omitBy, isNil } from "lodash";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../services/event.services.js";
import { dummyRequest, validateFile, normFile } from "../../helpers/image";
import moment from "moment";

import {
  Row,
  Col,
  Form,
  Button,
  Input,
  Upload,
  message,
  DatePicker,
  TimePicker,
  Divider,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import "./add-event.scss";
import useAuthContext from "../../hooks/useAuthContext.js";

const AddEvent = () => {
  const [image, setImage] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onImageChange = (value) => {
    setImage(value.fileList[0]?.originFileObj);
  };

  const onDateChange = (date, dateString) => {
    setDate(dateString);
  };

  const onTimeSelect = (time) => {
    form.setFieldsValue({
      time: time,
    });
    setTime(time.format("h:mm a"));
  };

  const validateMessages = {
    required: "${label} is required.",
  };

  const navigate = useNavigate();
  const { accountID } = useAuthContext();
  const onFinish = async (values) => {
    setIsLoading(true);
    const event = omitBy(values, (v) => isNil(v) || v.toString().trim() === "");

    const res = await createEvent({
      event: { ...event, date: date, time: time },
      image,
      rescuerID: accountID,
    });

    if (res?.error) {
      message.error(res.error.description);
      setIsLoading(false);
    } else {
      message.success("Successfully published a new event!");
      navigate("/rescuer/events");
    }
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 20 },
      sm: { span: 20 },
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

  const gridProps = { xxl: 14, xl: 14, lg: 14, md: 24, sm: 24, xs: 24 };
  const [form] = Form.useForm();

  return (
    <div className="add-event">
      <div className="add-event-form-wrapper">
        <Row align="center">
          <Col {...gridProps} align="left">
            <h1 className="title">Publish New Event</h1>
            <Divider />
          </Col>
          <Col {...gridProps}>
            <div className="add-event-form">
              <Form
                form={form}
                name="add-event"
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
                  name="name"
                  label="Name"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                    },
                  ]}
                >
                  <Input placeholder="Event name" />
                </Form.Item>

                <Form.Item
                  name="date"
                  label="Date"
                  rules={[{ required: true }]}
                >
                  <DatePicker onChange={onDateChange} format="DD MMMM YYYY" />
                </Form.Item>

                <Form.Item
                  name="time"
                  label="Time"
                  rules={[{ required: true }]}
                >
                  <TimePicker
                    use12Hours
                    format="h:mm a"
                    onSelect={onTimeSelect}
                    defaultOpenValue={moment("00.00", "h:mm a")}
                  />
                </Form.Item>

                <Form.Item
                  name="address"
                  label="Address"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Event address" />
                </Form.Item>

                <Form.Item
                  name="description"
                  label="Description"
                  rules={[{ required: true }]}
                >
                  <Input.TextArea
                    showCount
                    rows={6}
                    maxLength={5000}
                    placeholder="Event details (eg. purpose of event, available activities"
                  />
                </Form.Item>

                <Form.Item
                  name="image"
                  label="Event Poster"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  className="left"
                  rules={[{ required: true }]}
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
                    Publish Event
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AddEvent;
