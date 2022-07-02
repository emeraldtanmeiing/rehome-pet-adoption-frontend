import { useEffect, useState } from "react";
import { isEmpty } from "lodash";

import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload, Form, message } from "antd";

import "./editableForm.less";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
  });

const ImageForm = ({ name, label, image, setImage, required }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState(
    [
      {
        url: image,
      },
    ] || []
  );

  const normFile = (uploadEvent) => {
    if (Array.isArray(uploadEvent)) {
      return uploadEvent;
    }
    return uploadEvent && uploadEvent.fileList;
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

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  const handleChange = ({ fileList: newFileList }) => {

    setFileList(newFileList);
    if (!isEmpty(newFileList)) {
      setImage(newFileList[0].originFileObj);
    } else {
      setImage(null);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 5,
        }}
      >
        Upload image only (Max: 1)
      </div>
    </div>
  );

  return (
    <div className="images-form">
      <Form.Item
        name={name}
        label={label}
        valuePropName={name}
        getValueFromEvent={normFile}
        rules={[
          {
            required: required,
            message: "${label} is required.",
          },
        ]}
      >
        <Upload
          listType="picture-card"
          fileList={fileList}
          beforeUpload={validateFile}
          customRequest={dummyRequest}
          onPreview={handlePreview}
          onChange={handleChange}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
      </Form.Item>
      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
        <img
          alt="image"
          style={{
            width: "100%",
          }}
          src={previewImage}
        />
      </Modal>
    </div>
  );
};

export default ImageForm;
