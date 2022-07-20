import React, { useRef } from "react";
import { isEmpty, last } from "lodash";
import moment from "moment";

import {
  Row,
  Col,
  Input,
  Form,
  Upload,
  Select,
  Grid,
  InputNumber,
  Checkbox,
  DatePicker,
  TimePicker,
  Switch,
} from "antd";
import ImageForm from "./image-form";
import ImagesForm from "./images-form";
import DocumentsForm from "./documents-form";

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

  const onDateChange = (date, dateString) => {
    setDate(dateString);
  };

  const onDateMonthChange = (date, dateString) => {
    setDateMonth(dateString);
  };

  const onTimeChange = (time, timeString) => {
    setTime(timeString);
  };

  const props = {
    name: name,
    label: label,
    extra: extra,
    key: key,
    rules: [
      {
        required: required,
        message: `${label} is required.`,
      },
    ],
  };

  const checkBox = (value) => {
    return (
      <Col align="left">
        <Checkbox value={value} style={{ lineHeight: "32px" }}>
          {value}
        </Checkbox>
      </Col>
    );
  };

  const option = (value) => {
    return <Option value={value}>{value}</Option>;
  };

  const breakpoint = Grid.useBreakpoint();
  let formItem;

  if (!editing || !editable) {
    switch (type) {
      case "image":
        formItem = (
          <div className="editable-form-item display-mode">
            <Form.Item {...props}>
              {isEmpty(value) ? "No image" : (
                <Upload
                  listType="picture-card"
                  fileList={
                    [
                      {
                        url: value,
                      },
                    ] || null
                  }
                />
              )}
            </Form.Item>
          </div>
        );
        break;

      case "images":
        formItem = (
          <div className="editable-form-item display-mode">
            <Form.Item {...props}>
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
          </div>
        );
        break;

      case "documents":
        formItem = (
          <div className="editable-form-item display-mode">
            <Form.Item {...props}>
              <Upload
                className="upload-list-inline"
                listType="picture"
                fileList={
                  value?.map((doc, index) => {
                    const filename = last(doc.split("/"));
                    const filenameCodeLength =
                      last(filename.split("_")).length + 1;
                    const originalFilename = filename.slice(
                      0,
                      -filenameCodeLength
                    );
                    const fileExtension = last(filename.split("."));
                    return {
                      uid: index,
                      status: "done",
                      url: doc,
                      name: `${originalFilename}.${fileExtension}`,
                    };
                  }) || []
                }
              >
                {isEmpty(value) && <>No document.</>}
              </Upload>
            </Form.Item>
          </div>
        );
        break;

      case "textArea":
        formItem = (
          <div className="editable-form-item">
            <Form.Item {...props}>
              <Input.TextArea rows={20} disabled />
            </Form.Item>
          </div>
        );
        break;

      case "textArea-small":
        formItem = (
          <div className="editable-form-item">
            <Form.Item {...props}>
              <Input.TextArea rows={3} disabled />
            </Form.Item>
          </div>
        );
        break;
      default:
        formItem = (
          <div className="editable-form-item">
            <Form.Item {...props}>
              <Input disabled />
            </Form.Item>
          </div>
        );
    }
  } else {
    switch (type) {
      case "image":
        formItem = <ImageForm {...props} image={value} setImage={setImage} />;
        break;

      case "images":
        formItem = (
          <ImagesForm
            {...props}
            images
            maxNumberOfImages={maxNumberOfImages}
            existingImages={value}
            setImages={setImages}
            setExistingImages={setExistingImages}
          />
        );
        break;

      case "documents":
        formItem = (
          <DocumentsForm
            {...props}
            maxNumberOfImages={maxNumberOfImages}
            existingImages={value}
            setImages={setImages}
            setExistingImages={setExistingImages}
          />
        );
        break;

      case "textArea":
        formItem = (
          <div className="editable-form-item">
            <Form.Item {...props}>
              <Input.TextArea rows={20} ref={inputRef} />
            </Form.Item>
          </div>
        );
        break;

      case "textArea-small":
        formItem = (
          <div className="editable-form-item">
            <Form.Item {...props}>
              <Input.TextArea rows={3} ref={inputRef} />
            </Form.Item>
          </div>
        );
        break;

      case "integer":
      case "integer-full":
        formItem = (
          <div className="editable-form-item">
            <Form.Item {...props}>
              <InputNumber
                min={0}
                max={500}
                addonAfter={addonAfter || ""}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </div>
        );
        break;

      case "boolean":
        formItem = (
          <div className="editable-form-item">
            <Form.Item {...props} valuePropName="checked">
              <Switch
                checkedChildren={checkedDesc}
                unCheckedChildren={uncheckedDesc}
              />
            </Form.Item>
          </div>
        );
        break;

      case "interestedPetTypes":
        formItem = (
          <div className="editable-form-item">
            <Form.Item {...props}>
              <Checkbox.Group>
                <Row type="flex" style={{ alignItems: "center" }}>
                  {checkBox("Dog")}
                  {checkBox("Cat")}
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </div>
        );
        break;

      case "petTypes":
        formItem = (
          <div className="editable-form-item">
            <Form.Item {...props}>
              <Checkbox.Group>
                <Row type="flex" style={{ alignItems: "center" }}>
                  {checkBox("Dog")}
                  {checkBox("Cat")}
                  {checkBox("Fish")}
                  {checkBox("Bird")}
                  {checkBox("Hamster")}
                  {checkBox("Rabbit")}
                  {checkBox("Other")}
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </div>
        );
        break;

      case "petLivingSituation":
        formItem = (
          <div className="editable-form-item">
            <Form.Item {...props}>
              <Select placeholder="Select your pet living situation">
                {option("Indoor")}
                {option("Outdoor")}
                {option("Indoor And Outdoor (Free Choice)")}
              </Select>
            </Form.Item>
          </div>
        );
        break;

      case "housemateAcknowledgement":
        formItem = (
          <div className="editable-form-item">
            <Form.Item {...props}>
              <Select placeholder="Select your situation">
                {option(
                  "  Everyone in the household is excited about adopting"
                )}
                {option("  Someone in the household isn't sure about adopting")}
                {option(
                  "  Not everyone in the household knows I am applying to adopt"
                )}
              </Select>
            </Form.Item>
          </div>
        );
        break;

      case "healthCondition":
        formItem = (
          <div className="editable-form-item">
            <Form.Item {...props}>
              <Select placeholder="Select your situation">
                {option("Healthy")}
                {option("Minor injury")}
                {option("Serious injury")}
                {option("Chronic disease")}
              </Select>
            </Form.Item>
          </div>
        );
        break;

      case "petType":
        formItem = (
          <div className="editable-form-item">
            <Form.Item {...props}>
              <Select placeholder="Select your situation">
                {option("Dog")}
                {option("Cat")}
              </Select>
            </Form.Item>
          </div>
        );
        break;

      case "petGender":
        formItem = (
          <div className="editable-form-item">
            <Form.Item {...props}>
              <Select placeholder="Select pet's gender">
                {option("Male")}
                {option("Female")}
              </Select>
            </Form.Item>
          </div>
        );
        break;

      case "petSize":
        formItem = (
          <div className="editable-form-item">
            <Form.Item {...props}>
              <Select>
                {option("Small")}
                {option("Medium")}
                {option("Large")}
                {option("Giant")}
              </Select>
            </Form.Item>
          </div>
        );
        break;

      case "foodSize":
        formItem = (
          <div className="editable-form-item">
            <Form.Item {...props}>
              <Select>
                {option("<= 0.5 cups")}
                {option("0.5 - 1 cups")}
                {option("1 - 2 cups")}
                {option("2 - 3 cups")}
                {option("3 - 5 cups")}
                {option("{`>= 5 cups`}")}
              </Select>
            </Form.Item>
          </div>
        );
        break;

      case "foodFee":
        formItem = (
          <div className="editable-form-item">
            <Form.Item {...props}>
              <Select>
                {option("<= RM100")}
                {option("RM100 - RM300")}
                {option("RM300 - RM500")}
                {option("RM500 - RM700")}
                {option(">= RM700")}
              </Select>
            </Form.Item>
          </div>
        );
        break;

      case "color":
        formItem = (
          <div className="editable-form-item">
            <Form.Item {...props}>
              <Checkbox.Group>
                <Row type="flex" style={{ alignItems: "center" }}>
                  {checkBox("White")}
                  {checkBox("Brown")}
                  {checkBox("Black")}
                  {checkBox("Grey")}
                  {checkBox("Golden")}
                  {checkBox("Cream")}
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </div>
        );
        break;

      case "stateOrProvince":
        formItem = (
          <div className="editable-form-item">
            <Form.Item {...props}>
              <Select placeholder="Select your state or province">
                {option("Selangor")}
                {option("Kuala Lumpur")}
                {option("Putrajaya")}
                {option("Negeri Sembilan")}
                {option("Johor")}
                {option("Melaka")}
                {option("Kedah")}
                {option("Kelantan")}
                {option("Pahang")}
                {option("Perak")}
                {option("Perlis")}
                {option("Pulau Pinang")}
                {option("Terengganu")}
                {option("Sabah")}
                {option("Sarawak")}
                {option("Labuan")}
              </Select>
            </Form.Item>
          </div>
        );
        break;

      case "postcode":
        formItem = (
          <div className="editable-form-item">
            <Form.Item
              name={name}
              label={label}
              extra={extra}
              key={key}
              rules={[
                {
                  required: required,
                  message: `${label} is required.`,
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
          </div>
        );
        break;

      case "website":
        formItem = (
          <div className="editable-form-item">
            <Form.Item
              name={name}
              label={label}
              extra={extra}
              key={key}
              rules={[
                {
                  required: required,
                  message: `${label} is required.`,
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
          </div>
        );
        break;

      case "phone":
        formItem = (
          <div className="editable-form-item">
            <Form.Item
              name={name}
              label={label}
              extra={extra}
              key={key}
              rules={[
                { required: required, message: `${label} is required.` },
                () => ({
                  validator(_, value) {
                    if (!value || value.match(/^[0-9]+$/) != null) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      new Error("Phone should be numeric.")
                    );
                  },
                }),
              ]}
            >
              <Input />
            </Form.Item>
          </div>
        );
        break;

      case "date":
        formItem = (
          <div className="editable-form-item">
            <Form.Item {...props}>
              <DatePicker onChange={onDateChange} format="DD MMMM YYYY" />
            </Form.Item>
          </div>
        );
        break;

      case "date-month":
        formItem = (
          <div className="editable-form-item">
            <Form.Item {...props}>
              <DatePicker
                onChange={onDateMonthChange}
                picker="month"
                format="MMMM YYYY"
              />
            </Form.Item>
          </div>
        );
        break;

      case "time":
        formItem = (
          <div className="editable-form-item">
            <Form.Item {...props}>
              <TimePicker
                use12Hours
                format="h:mm a"
                onChange={onTimeChange}
                defaultOpenValue={moment("00.00", "h:mm a")}
              />
            </Form.Item>
          </div>
        );
        break;

      default:
        formItem = (
          <div className="editable-form-item">
            <Form.Item {...props}>
              <Input ref={inputRef} />
            </Form.Item>
          </div>
        );
    }
  }

  return <div {...restProps}>{formItem}</div>;
};

export default EditableFormItem;
