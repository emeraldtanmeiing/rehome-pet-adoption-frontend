import { useEffect, useState } from "react";
import { isEmpty, last, slice } from "lodash";

import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload, Form, Button, Col, message } from "antd";

import "./editableForm.less";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
  });

const DocumentsForm = ({
  name,
  label,
  maxNumberOfImages,
  rules,
  existingImages = null,
  setImages,
  setExistingImages,
}) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState(
    existingImages?.map((doc, index) => {
      const filename = last(doc.split("/"))
      const filenameCodeLength = last(filename.split("_")).length + 1
      const originalFilename = filename.slice(0, -filenameCodeLength)
      const fileExtension = last(filename.split("."))
      return {
        uid: index,
        status: "done",
        url: doc,
        name: `${originalFilename}.${fileExtension}`
      };
    }) || []
  );

  const normFile = (uploadEvent) => {
    if (Array.isArray(uploadEvent)) {
      return uploadEvent;
    }
  };

  const validateFile = (value) => {
    const file = value;
    
    const fileTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

    if (!fileTypes.includes(file.type)) {
      message.error(`${file.name} format is not accepted.`);
      return Upload.LIST_IGNORE;
    }

    const isLt1M = file.size / 1024 / 1024 <= 1;
    if (!isLt1M) {
      message.error(`Document size should be smaller than 1MB.`);
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

  useEffect(() => {
    if (!isEmpty(fileList)) {
      let existingImages = [];
      let images = [];
      fileList.forEach((file) => {
        if (file.url) {
          existingImages.push(file.url);
        } else {
          images.push(file.originFileObj);
        }
        setExistingImages(existingImages);
        setImages(images);
      });
    } else {
      setExistingImages([]);
      setImages([]);
    }
  }, [fileList]);

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const uploadButton = (
    <Button icon={<PlusOutlined />}>Upload word or pdf only (Max: {maxNumberOfImages})</Button>

  );
  return (
    <div className="documents-form">
    <Col span={24}>

      <Form.Item
        name={name}
        label={label}
        valuePropName={name}
        getValueFromEvent={normFile}
        rules={rules}
      >
        <Upload
          className="upload-list-inline"
          listType="picture"
          fileList={fileList}
          beforeUpload={validateFile}
          customRequest={dummyRequest}
          onPreview={handlePreview}
          onChange={handleChange}
        >
          {fileList.length >= maxNumberOfImages ? null : uploadButton}
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
    </Col>
    </div>
  );
};

export default DocumentsForm;
