import React, { useContext, useState, useEffect, useRef } from "react";
import { map } from "lodash";

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
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import "./editableForm.less";

const { Option } = Select;
const EditableContext = React.createContext();

const EditableFormItem = ({
  key,
  name,
  label,
  value,
  extra,
  type,
  editable = false,
  required,
  editing,
  setImage,
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

  let formItem;
  if (!editing || !editable) {
    if (type == "image") {
      formItem = (
        <Col span={24} className="editable-form-item">
          <Form.Item name={name} label={label} extra={extra} key={key}>
            <div className="image">
              <img alt="image" src={value} onClick={() => window.open(value)} />
            </div>
          </Form.Item>
        </Col>
      );
    } else if (type == "textArea") {
      formItem = (
        <Col span={24} className="editable-form-item">
          <Form.Item name={name} label={label} extra={extra} key={key}>
            <Input.TextArea rows={20} disabled />
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
    //TODO: add boolean, integer, healthCondition, images, color
    if (type == "image") {
      formItem = (
        <Form.Item
          name={name}
          label={label}
          valuePropName={name}
          getValueFromEvent={normFile}
          className="left"
          required={required}
        >
          <Upload
            name={name}
            listType="picture"
            maxCount={1}
            beforeUpload={validateFile}
            onChange={onImageChange}
            customRequest={dummyRequest}
            rules={[{ required: true }]}
            accept="image/png, image/jpeg, image/svg+xml"
          >
            <Button icon={<UploadOutlined />}>
              Upload image if you wish to change {name} (Max: 1)
            </Button>
          </Upload>
        </Form.Item>
      );
    } else if (type == "textArea") {
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
    } else if (type == "stateOrProvince") {
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
    } else if (type == "postcode") {
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
            <Input />
          </Form.Item>
        </Col>
      );
    } else if (type == "phone") {
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

const EditableForm = ({ fields, api, editable = true }) => {
  let formattedFields = fields.map((item) => ({ [item.name]: item.value }));
  formattedFields = Object.assign({}, ...formattedFields);

  const [editing, setEditing] = useState(false);
  const [data, setData] = useState(formattedFields);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    form.setFieldsValue(data);
  }, []);

  const toggleEdit = () => {
    setEditing(!editing);
  };

  const validate = () => {
    return new Promise((res, rej) => {
      form
        .validateFields()
        .then((values) => {
          res(values);
        })
        .catch((err) => {
          res(err);
        });
    });
  };

  useEffect(() => {
    form.setFieldsValue(data);
  }, [data]);

  const handleSave = async (e) => {
    setIsLoading(true);

    const validationResult = await validate();
    if (validationResult.errorFields) {
      setIsLoading(false);
      return;
    }

    const res = await api({
      ...data,
      ...validationResult,
      ...(image && { image }),
    });
    if(!res){
      form.setFieldsValue(data);
    }
    if (res) {
      setData({
        ...data,
        ...validationResult,
        ...(image && { image: res.image }),
      });
    }

    setIsLoading(false);
    toggleEdit();

    if (image && res?.image) {
      window.location.href = window.location.href; //force refresh page to update image
    }
  };

  const handleCancel = () => {
    form.setFieldsValue(data);
    toggleEdit();
  };

  const [form] = Form.useForm();

  const breakpoint = Grid.useBreakpoint();

  return (
    <div className="editable-form">
      <Row>
        <Col align="right" span={24}>
          {editing ? (
            <>
              <Button
                onClick={handleSave}
                type="primary"
                style={{ marginBottom: 16 }}
                loading={isLoading}
              >
                Save
              </Button>
              <Button
                onClick={handleCancel}
                style={{ marginBottom: 16 }}
                disabled={isLoading}
                className="cancel-btn"
              >
                Cancel
              </Button>
            </>
          ) : editable ? (
            <>
              <Col>
                <Button
                  onClick={toggleEdit}
                  type="primary"
                  style={{ marginBottom: 16 }}
                >
                  Edit
                </Button>
              </Col>
            </>
          ) : (
            <></>
          )}
        </Col>

        <Col span={24}>
          <Form form={form}>
            <Row gutter={12}>
              <EditableContext.Provider value={form}>
                {map(fields, (field, index) => {
                  return (
                    <Col
                      span={
                        field.type == "textArea" || !breakpoint.md ? 24 : 12
                      }
                    >
                      <EditableFormItem
                        key={index}
                        name={field.name}
                        label={field.label}
                        value={field.value}
                        extra={field.extra}
                        editable={field.editable}
                        type={field.type}
                        required={field.required || false}
                        editing={editing}
                        setImage={setImage}
                      />
                    </Col>
                  );
                })}
              </EditableContext.Provider>
            </Row>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default EditableForm;
