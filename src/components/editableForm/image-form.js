import React, { useState } from "react";
import { isEmpty } from "lodash";
import {
  getBase64,
  dummyRequest,
  validateFile,
  normFile,
} from "../../helpers/image";

import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload, Form } from "antd";

import "./editableForm.less";

const ImageForm = ({ name, label, image, setImage, rules }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState(
    [
      {
        uid: 1,
        status: "done",
        url: image,
      },
    ] || []
  );

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
        rules={rules}
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
