import React, { useRef } from "react";
import moment from "moment";

import {
  Row,
  Col,
  Input,
  Button,
  Form,
  Upload,
  Avatar,
  Select,
  Grid,
  InputNumber,
  Checkbox,
  DatePicker,
  TimePicker,
  Switch,
  Radio,
  message,
} from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import ImageForm from "./image-form";
import ImagesForm from "./images-form";

import "./editableForm.less";

const { Option } = Select;

const EditableFormItem = ({
  key,
  name,
  label,
  value,
  extra,
  type,
  checkedDesc,
  uncheckedDesc,
  maxNumberOfImages,
  editable = false,
  required,
  editing,
  addonAfter,
  setImage,
  setImages,
  setExistingImages,
  setDate,
  setDateMonth,
  setTime,
  ...restProps
}) => {
  const inputRef = useRef(value);

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

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const onImageChange = (value) => {
    setImage(value.fileList[0]?.originFileObj);
  };

  function onDateChange(date, dateString) {
    setDate(dateString);
  }

  function onDateMonthChange(date, dateString) {
    setDateMonth(dateString);
  }

  function onTimeChange(time, timeString) {
    setTime(timeString);
  }

  const breakpoint = Grid.useBreakpoint();
  let formItem;
  if (!editing || !editable) {
    if (type === "image") {
      formItem = (
        <Col span={24} className="editable-form-item">
          <Form.Item name={name} label={label} valuePropName={name} key={key}>
            <Upload
              listType="picture-card"
              fileList={[
                {
                  url: value,
                },
              ] || []}
            />
          </Form.Item>
        </Col>
      );
    } else if (type === "images") {
      formItem = (
        <Col span={24} className="editable-form-item">
          <Form.Item name={name} label={label} valuePropName={name} key={key}>
            <Upload
              listType="picture-card"
              fileList={
                value?.map((image, index) => {
                  return {
                    uid: index,
                    status: "done",
                    url: image,
                  };
                }) || []
              }
            />
          </Form.Item>
        </Col>
      );
    } else if (type === "textArea") {
      formItem = (
        <Col span={24} className="editable-form-item">
          <Form.Item name={name} label={label} extra={extra} key={key}>
            <Input.TextArea rows={20} disabled />
          </Form.Item>
        </Col>
      );
    } else if (type === "textArea-small") {
      formItem = (
        <Col span={24} className="editable-form-item">
          <Form.Item name={name} label={label} extra={extra} key={key}>
            <Input.TextArea rows={3} disabled />
          </Form.Item>
        </Col>
      );
    } else {
      formItem = (
        <Col span={24} className="editable-form-item">
          <Form.Item name={name} label={label} extra={extra} key={key}>
            <Input disabled />
          </Form.Item>
        </Col>
      );
    }
  } else {
    if (type === "image") {
      formItem = (
        <ImageForm
          key={key}
          name={name}
          label={label}
          image={value}
          required={required}
          setImage={setImage}
        />
      );
    } else if (type === "images") {
      formItem = (
        <ImagesForm
          key={key}
          name={name}
          label={label}
          maxNumberOfImages={maxNumberOfImages}
          existingImages={value}
          required={required}
          setImages={setImages}
          setExistingImages={setExistingImages}
        />
      );
    } else if (type === "textArea") {
      formItem = (
        <Col span={24} className="editable-form-item">
          <Form.Item
            name={name}
            label={label}
            extra={extra}
            key={key}
            required={required}
          >
            <Input.TextArea rows={20} ref={inputRef} />
          </Form.Item>
        </Col>
      );
    } else if (type === "textArea-small") {
      formItem = (
        <Col span={24} className="editable-form-item">
          <Form.Item
            name={name}
            label={label}
            extra={extra}
            key={key}
            required={required}
          >
            <Input.TextArea rows={3} ref={inputRef} />
          </Form.Item>
        </Col>
      );
    } else if (type === "integer" || type === "integer-full") {
      formItem = (
        <Col span={24} className="editable-form-item">
          <Form.Item
            name={name}
            label={label}
            extra={extra}
            key={key}
            required={required}
          >
            <InputNumber
              min={0}
              max={500}
              addonAfter={addonAfter || ""}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
      );
    } else if (type === "boolean") {
      formItem = (
        <Col span={24} className="editable-form-item">
          <Form.Item
            name={name}
            label={label}
            extra={extra}
            key={key}
            required={required}
            valuePropName="checked"
          >
            <Switch
              checkedChildren={checkedDesc}
              unCheckedChildren={uncheckedDesc}
            />
          </Form.Item>
        </Col>
      );
    } else if (type === "interestedPetTypes") {
      formItem = (
        <Col span={24} className="editable-form-item">
          <Form.Item
            name={name}
            label={label}
            extra={extra}
            key={key}
            required={required}
          >
            <Checkbox.Group>
              <Row type="flex" style={{ alignItems: "center" }}>
                <Col align="left">
                  <Checkbox
                    value="Dog"
                    style={{
                      lineHeight: "32px",
                    }}
                  >
                    Dog(s)
                  </Checkbox>
                </Col>
                <Col align="left">
                  <Checkbox
                    value="Cat"
                    style={{
                      lineHeight: "32px",
                    }}
                  >
                    Cat(s)
                  </Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </Col>
      );
    } else if (type === "petTypes") {
      formItem = (
        <Col span={24} className="editable-form-item">
          <Form.Item
            name={name}
            label={label}
            extra={extra}
            key={key}
            required={required}
          >
            <Checkbox.Group>
              <Row type="flex" style={{ alignItems: "center" }}>
                <Col align="left">
                  <Checkbox
                    value="Dog"
                    style={{
                      lineHeight: "32px",
                    }}
                  >
                    Dog(s)
                  </Checkbox>
                </Col>
                <Col align="left">
                  <Checkbox
                    value="Cat"
                    style={{
                      lineHeight: "32px",
                    }}
                  >
                    Cat(s)
                  </Checkbox>
                </Col>
                <Col align="left">
                  <Checkbox
                    value="Fish"
                    style={{
                      lineHeight: "32px",
                    }}
                  >
                    Fish(s)
                  </Checkbox>
                </Col>
                <Col align="left">
                  <Checkbox
                    value="Bird"
                    style={{
                      lineHeight: "32px",
                    }}
                  >
                    Bird(s)
                  </Checkbox>
                </Col>
                <Col align="left">
                  <Checkbox
                    value="Hamster"
                    style={{
                      lineHeight: "32px",
                    }}
                  >
                    Hamster(s)
                  </Checkbox>
                </Col>
                <Col align="left">
                  <Checkbox
                    value="Rabbit"
                    style={{
                      lineHeight: "32px",
                    }}
                  >
                    Rabbit(s)
                  </Checkbox>
                </Col>
                <Col align="left">
                  <Checkbox
                    value="Other"
                    style={{
                      lineHeight: "32px",
                    }}
                  >
                    Others
                  </Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </Col>
      );
    } else if (type === "petLivingSituation") {
      formItem = (
        <Col span={24} className="editable-form-item">
          <Form.Item
            name={name}
            label={label}
            extra={extra}
            key={key}
            required={required}
          >
            <Select placeholder="Select your pet living situation">
              <Option value="Indoor">Indoor</Option>
              <Option value="Outdoor">Outdoor</Option>
              <Option value="Indoor And Outdoor (Free Choice)">
                Indoor And Outdoor (Free Choice)
              </Option>
            </Select>
          </Form.Item>
        </Col>
      );
    } else if (type === "housemateAcknowledgement") {
      formItem = (
        <Col span={24} className="editable-form-item">
          <Form.Item
            name={name}
            label={label}
            extra={extra}
            key={key}
            required={required}
          >
            <Select placeholder="Select your situation">
              <Option value="Everyone in the household is excited about adopting">
                Everyone in the household is excited about adopting
              </Option>
              <Option value="Someone in the household isn't sure about adopting">
                Someone in the household isn't sure about adopting
              </Option>
              <Option value="Not everyone in the household knows I am applying to adopt">
                Not everyone in the household knows I am applying to adopt
              </Option>
            </Select>
          </Form.Item>
        </Col>
      );
    } else if (type === "healthCondition") {
      formItem = (
        <Col span={24} className="editable-form-item">
          <Form.Item
            name={name}
            label={label}
            extra={extra}
            key={key}
            required={required}
          >
            <Select placeholder="Select your situation">
              <Option value="Healthy">Healthy</Option>
              <Option value="Minor injury">Minor injury</Option>
              <Option value="Serious injury">Serious injury</Option>
              <Option value="Chronic disease">Chronic disease</Option>
            </Select>
          </Form.Item>
        </Col>
      );
    } else if (type === "petType") {
      formItem = (
        <Col span={24} className="editable-form-item">
          <Form.Item
            name={name}
            label={label}
            extra={extra}
            key={key}
            required={required}
          >
            <Select placeholder="Select your situation">
              <Option value="Dog">Dog</Option>
              <Option value="Cat">Cat</Option>
            </Select>
          </Form.Item>
        </Col>
      );
    } else if (type === "petGender") {
      formItem = (
        <Col span={24} className="editable-form-item">
          <Form.Item
            name={name}
            label={label}
            extra={extra}
            key={key}
            required={required}
          >
            <Select placeholder="Select pet's gender">
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
          </Form.Item>
        </Col>
      );
    } else if (type === "petSize") {
      formItem = (
        <Col span={24} className="editable-form-item">
          <Form.Item
            name={name}
            label={label}
            extra={extra}
            key={key}
            required={required}
          >
            <Select>
              <Option value="Small">Small</Option>
              <Option value="Medium">Medium</Option>
              <Option value="Large">Large</Option>
              <Option value="Giant">Giant</Option>
            </Select>
          </Form.Item>
        </Col>
      );
    } else if (type === "foodSize") {
      formItem = (
        <Col span={24} className="editable-form-item">
          <Form.Item
            name={name}
            label={label}
            extra={extra}
            key={key}
            required={required}
          >
            <Select>
              <Option value="<= 0.5 cups">{`<= 0.5 cups`}</Option>
              <Option value="0.5 - 1 cups">0.5 - 1 cups</Option>
              <Option value="1 - 2 cups">1 - 2 cups</Option>
              <Option value="2 - 3 cups">2 - 3 cups</Option>
              <Option value="3 - 5 cups">3 - 5 cups</Option>
              <Option value=">= 5 cups">{`>= 5 cups`}</Option>
            </Select>
          </Form.Item>
        </Col>
      );
    } else if (type === "foodFee") {
      formItem = (
        <Col span={24} className="editable-form-item">
          <Form.Item
            name={name}
            label={label}
            extra={extra}
            key={key}
            required={required}
          >
            <Select>
              <Option value="<= RM100">{`<= RM100`}</Option>
              <Option value="RM100 - RM300">RM100 - RM300</Option>
              <Option value="RM300 - RM500">RM300 - RM500</Option>
              <Option value="RM500 - RM700">RM500 - RM700</Option>
              <Option value=">= RM700">{`>= RM700`}</Option>
            </Select>
          </Form.Item>
        </Col>
      );
    } else if (type === "color") {
      formItem = (
        <Col span={24} className="editable-form-item">
          <Form.Item
            name={name}
            label={label}
            extra={extra}
            key={key}
            required={required}
          >
            <Checkbox.Group>
              <Row type="flex" style={{ alignItems: "center" }}>
                <Col span={4}>
                  <Checkbox
                    value="White"
                    style={{
                      lineHeight: "32px",
                    }}
                  >
                    White
                  </Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox
                    value="Brown"
                    style={{
                      lineHeight: "32px",
                    }}
                  >
                    Brown
                  </Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox
                    value="Black"
                    style={{
                      lineHeight: "32px",
                    }}
                  >
                    Black
                  </Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox
                    value="Grey"
                    style={{
                      lineHeight: "32px",
                    }}
                  >
                    Grey
                  </Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox
                    value="Golden"
                    style={{
                      lineHeight: "32px",
                    }}
                  >
                    Golden
                  </Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox
                    value="Cream"
                    style={{
                      lineHeight: "32px",
                    }}
                  >
                    Cream
                  </Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </Col>
      );
    } else if (type === "stateOrProvince") {
      formItem = (
        <Col span={24} className="editable-form-item">
          <Form.Item
            name={name}
            label={label}
            extra={extra}
            key={key}
            required={required}
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
        </Col>
      );
    } else if (type === "postcode") {
      formItem = (
        <Col span={24} className="editable-form-item">
          <Form.Item
            name={name}
            label={label}
            extra={extra}
            key={key}
            rules={[
              {
                required: required,
              },
              () => ({
                validator(_, value) {
                  if (
                    !value ||
                    (value.length === 5 && value.match(/^[0-9]+$/) != null)
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
            <Input />
          </Form.Item>
        </Col>
      );
    } else if (type === "website") {
      formItem = (
        <Col span={24} className="editable-form-item">
          <Form.Item
            name={name}
            label={label}
            extra={extra}
            key={key}
            rules={[
              {
                required: required,
              },
              () => ({
                validator(_, value) {
                  if (
                    !value ||
                    value.match(
                      /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/
                    ) != null
                  ) {
                    return Promise.resolve();
                  }

                  return Promise.reject(new Error("Invalid website."));
                },
              }),
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      );
    } else if (type === "phone") {
      formItem = (
        <Col span={24} className="editable-form-item">
          <Form.Item
            name={name}
            label={label}
            extra={extra}
            key={key}
            rules={[
              { required: required },
              () => ({
                validator(_, value) {
                  if (!value || value.match(/^[0-9]+$/) != null) {
                    return Promise.resolve();
                  }

                  return Promise.reject(new Error("Phone should be numeric."));
                },
              }),
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      );
    } else if (type === "date") {
      formItem = (
        <Col span={24} className="editable-form-item">
          <Form.Item name={name} label={label} extra={extra} key={key}>
            <DatePicker onChange={onDateChange} format="DD MMMM YYYY" />
          </Form.Item>
        </Col>
      );
    } else if (type === "date-month") {
      formItem = (
        <Col span={24} className="editable-form-item">
          <Form.Item name={name} label={label} extra={extra} key={key}>
            <DatePicker
              onChange={onDateMonthChange}
              picker="month"
              format="MMMM YYYY"
            />
          </Form.Item>
        </Col>
      );
    } else if (type === "time") {
      formItem = (
        <Col span={24} className="editable-form-item">
          <Form.Item name={name} label={label} extra={extra} key={key}>
            {/* <TimePicker defaultOpenValue={moment('13:00 ', 'HH:mm')} onChange={onTimeChange} /> */}

            <TimePicker
              use12Hours
              format="h:mm a"
              onChange={onTimeChange}
              defaultOpenValue={moment("00.00", "h:mm a")}
            />
          </Form.Item>
        </Col>
      );
    } else {
      formItem = (
        <Col>
          <Form.Item
            name={name}
            label={label}
            extra={extra}
            rules={[
              {
                required: required,
                message: `${label} is required.`,
              },
            ]}
          >
            <Input ref={inputRef} />
          </Form.Item>
        </Col>
      );
    }
  }

  return <div {...restProps}>{formItem}</div>;
};

export default EditableFormItem;
