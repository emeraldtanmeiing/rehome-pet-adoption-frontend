import { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import {
  getBase64,
  dummyRequest,
  validateFile,
  normFile,
} from "../../helpers/image";

import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload, Form, message } from "antd";

import "./editableForm.less";

const ImagesForm = ({
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
    existingImages?.map((image, index) => {
      return {
        uid: index,
        status: "done",
        url: image,
      };
    }) || []
  );

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
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 5,
        }}
      >
        Upload image only (Max: {maxNumberOfImages})
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

export default ImagesForm;
