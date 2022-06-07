import React, { useContext, useState, useEffect, useRef } from "react";
import { map } from "lodash";

import { Row, Col, Input, Button, Form, Upload, Avatar, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import "./editableForm.less";

const EditableContext = React.createContext();

const EditableFormItem = ({
  key,
  name,
  label,
  value,
  extra,
  type,
  editable = false,
  editing,
  setImage,
  ...restProps
}) => {
  const inputRef = useRef(value);
  // const [image, setImage] = useState(null);

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
            <Avatar size={96} src={value} id="image-id" />
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
    if (type == "image") {
      formItem = (
        <Form.Item
          name={name}
          label={label}
          valuePropName={name}
          getValueFromEvent={normFile}
          className="left"
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
    } else {
      formItem = (
        <Col>
          <Form.Item
            name={name}
            label={label}
            extra={extra}
            rules={[
              {
                required: true,
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

const EditableForm = ({ fields, api }) => {
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
          ) : (
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
          )}
        </Col>

        <Col span={24}>
          <Form form={form}>
            <Row gutter={48}>
              <EditableContext.Provider value={form}>
                {map(fields, (field, index) => {
                  return (
                    <EditableFormItem
                      key={index}
                      name={field.name}
                      label={field.label}
                      value={field.value}
                      extra={field.extra}
                      editable={field.editable}
                      type={field.type}
                      editing={editing}
                      setImage={setImage}
                    />
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
