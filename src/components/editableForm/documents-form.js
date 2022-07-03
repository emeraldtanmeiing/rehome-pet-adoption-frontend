import { useEffect, useState } from "react";
import { isEmpty, last } from "lodash";
import {
  getBase64,
  dummyRequest,
  validateFile,
  normFile,
} from "../../helpers/image";

import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload, Form, Button } from "antd";

import "./editableForm.less";

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
      const filename = last(doc.split("/"));
      const filenameCodeLength = last(filename.split("_")).length + 1;
      const originalFilename = filename.slice(0, -filenameCodeLength);
      const fileExtension = last(filename.split("."));
      return {
        uid: index,
        status: "done",
        url: doc,
        name: `${originalFilename}.${fileExtension}`,
      };
    }) || []
  );

  const validateFileTypes = (value) => {
    return validateFile(value, "documents");
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
    <Button icon={<PlusOutlined />}>
      Upload pdf only (Max: {maxNumberOfImages})
    </Button>
  );

  return (
    <div className="documents-form">
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
          beforeUpload={validateFileTypes}
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
    </div>
  );
};

export default DocumentsForm;
