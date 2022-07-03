import React, { useState, useEffect } from "react";
import { map, isEqual, isEmpty, find } from "lodash";
import moment from "moment";

import { Row, Col, Button, Form, Grid, message } from "antd";
import EditableFormItem from "./editableFormItem";

import "./editableForm.less";

const EditableContext = React.createContext();

const EditableForm = ({ fields, api, editable = true, size = "default" }) => {
  let formattedFields = fields.map((item) => ({ [item.name]: item.value }));
  formattedFields = Object.assign({}, ...formattedFields);

  const [editing, setEditing] = useState(false);
  const [data, setData] = useState(formattedFields);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [date, setDate] = useState(null);
  const [dateMonth, setDateMonth] = useState(null);
  const [time, setTime] = useState(null);

  useEffect(() => {
    form.setFieldsValue(data);
  }, []);

  const toggleEdit = () => {
    if (!editing) {
      form.setFieldsValue({
        ...data,
        ...(data.interviewDate && {
          interviewDate: moment(data.interviewDate),
        }),
        ...(data.interviewTime && {
          interviewTime: moment("00:00", "HH:mm"),
        }),
        ...(data.pickupDate && {
          pickupDate: moment(data.pickupDate),
        }),
        ...(data.pickupTime && {
          pickupTime: moment("00:00", "HH:mm"),
        }),
        ...(data.birthDate && {
          birthDate: moment(data.birthDate),
        }),
      });
    }
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
      ...(image && { image, mainImage: image }),
      ...(images && { images, documents: images }),
      ...(existingImages && { existingImages: existingImages, existingDocuments: existingImages }),

      ...(data.interviewDate && { interviewDate: data.interviewDate }),
      ...(data.pickupDate && { pickupDate: data.pickupDate }),
      ...(date && { interviewDate: date, pickupDate: date }),

      ...(data.interviewTime && { interviewTime: data.interviewTime }),
      ...(data.pickupTime && { pickupTime: data.pickupTime }),
      ...(time && { interviewTime: time, pickupTime: time }),

      ...(data.birthDate && { birthDate: data.birthDate }),
      ...(dateMonth && { birthDate: dateMonth }),
    });
    if (!res) {
      form.setFieldsValue(data);
    }
    if (res) {
      setData({
        ...data,
        ...validationResult,
        ...(image && { image: res.image, mainImage: res?.mainImage }),
        ...(images && { images: res.images, documents: res.documents }),
        ...(res.interviewDate && { interviewDate: res.interviewDate }),
        ...(res.interviewTime && { interviewTime: res.interviewTime }),
        ...(res.pickupDate && { pickupDate: res.pickupDate }),
        ...(res.pickupTime && { pickupTime: res.pickupTime }),
        ...(res.birthDate && { birthDate: res.birthDate }),
      });
    }

    setIsLoading(false);
    toggleEdit();

    if ((image || !isEmpty(images)) && (res?.image || res?.mainImage || res?.images)) {
      window.location.href = window.location.href; //force refresh page to update image
    }
    
    if(!isEqual(find(fields, f => f.type=="images").value, existingImages)){
      window.location.href = window.location.href; //force refresh page to update image
    }
    
    if(!isEqual(find(fields, f => f.type=="documents").value, existingImages)){
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
      <Row align="center">
        <Col align="right" span={size === "small" && breakpoint.md ? 18 : 24}>
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

        <Col span={size === "small" && breakpoint.md ? 18 : 24}>
          <Form form={form} labelCol={{ span: 24 }}>
            <Row gutter={24}>
              <EditableContext.Provider value={form}>
                {map(fields, (field, index) => {
                  return (
                    <Col
                      span={
                        field.type === "textArea" ||
                        field.type === "textArea-small" ||
                        field.type === "image" ||
                        field.type === "images" ||
                        field.type === "integer-full" ||
                        field.type === "interestedPetTypes" ||
                        field.type === "petTypes" ||
                        field.type === "petLivingSituation" ||
                        field.type === "petTypes" ||
                        field.type === "housemateAcknowledgement" ||
                        field.type === "documents" ||
                        !breakpoint.md
                          ? 24
                          : 12
                      }
                    >
                      <EditableFormItem
                        key={index}
                        name={field.name}
                        label={field.label}
                        value={field.value}
                        extra={field.extra}
                        checkedDesc={field.checkedDesc}
                        uncheckedDesc={field.uncheckedDesc}
                        maxNumberOfImages={field.maxNumberOfImages}
                        editable={field.editable}
                        type={field.type}
                        required={field.required || false}
                        editing={editing}
                        setImage={setImage}
                        setImages={setImages}
                        setExistingImages={setExistingImages}
                        setDate={setDate}
                        setDateMonth={setDateMonth}
                        setTime={setTime}
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
