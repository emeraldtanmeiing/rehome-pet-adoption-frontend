import { Upload, message } from "antd";

export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

export const validateFile = (value, type = "image") => {
  const file = value;

  let fileTypes;
  if (type === "image") {
    fileTypes = ["image/png", "image/jpg", "image/jpeg", "image/svg+xml"];
  } else {
    fileTypes = ["application/pdf"];
  }

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

export const normFile = (uploadEvent) => {
  if (Array.isArray(uploadEvent)) {
    return uploadEvent;
  }
  return uploadEvent && uploadEvent.fileList;
};
