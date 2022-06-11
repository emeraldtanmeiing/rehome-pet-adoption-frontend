import React, { useState } from "react";
import { omitBy, isNil, isEmpty, trim } from "lodash";
import { createPet } from "../../services/pet.services.js";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext.js";

import {
  Form,
  Button,
  Input,
  Select,
  Radio,
  InputNumber,
  Switch,
  Checkbox,
  Row,
  Col,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import "./add-pet.scss";

const { Option } = Select;

function AddPet() {
  const [images, setImages] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onImageChange = (value) => {
    let fetchImages = [];
    value.fileList.forEach((v, index) => {
      fetchImages[index] = v.originFileObj;
    });
    setImages(fetchImages);
  };

  const onMainImageChange = (value) => {
    setMainImage(value.fileList[0]?.originFileObj);
  };

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

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 20 },
      sm: { span: 14 },
    },
  };

  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 18,
        offset: 2,
      },
    },
  };

  const validateMessages = {
    required: "${label} is required.",
    types: {
      email: "${label} is not a valid email.",
    },
  };

  const { accountID } = useAuthContext();
  const rescuerID = accountID;
  const navigate = useNavigate();
  const onFinish = async (values) => {
    if (isEmpty(mainImage)) {
      message.error("Please upload Main image.");
      return;
    }

    setIsLoading(true);
    const pet = omitBy(values, v => isNil(v) || v.toString().trim() === '');
    const res = await createPet({ pet, mainImage, images, rescuerID });

    if (res?.error) {
      message.error(res.error.description);
      setIsLoading(false);
    } else {
      message.success("Create pet successful!");
      navigate(`/rescuer/pets-listing?rescuerID=${rescuerID}`);
    }
  };

  const descForType = "More pet types will be added in the future.";
  const descForFee =
    "Type RM0 if the adoption fee is free. It's okay to charge a fee to cover operating expenses, pet care, medical bills, and so forth.";
  const descForVaccinated =
    "Vaccinations help prevent the pet from catching and spreading some serious infectious diseases, many of which can be fatal.";
  const descForSpayedOrNeutered =
    "Spay or neuter the pet can help to manage the population of strays, as well as improve its health.";
  const descForDewormed = "Deworming the pet contributes to its health.";
  const descForDescription =
    "Introduce the pet to get a higher chance of adoption. i.e. how it was rescued, how is its typical day, what is its favourite food and other relevant details. ";
  const descForStateOrProvince = "ReHome is currently serving in Malaysia.";

  return (
    <div className="add-pet">
      <div className="add-pet-form-wrapper">
        <Row align="center">
          <Col span={24}>
            <h1>Publish New Pet</h1>
          </Col>
          <Col span={20} offset={2}>
            <div className="add-pet-form">
              <Form
                name="add-pet"
                onFinish={onFinish}
                validateMessages={validateMessages}
                initialValues={{
                  type: "Dog",
                  gender: "Male",
                  healthCondition: "Healthy",
                  stateOrProvince: "Selangor",
                  fee: 0,
                  vaccinated: false,
                  spayedOrNeutered: false,
                  dewormed: false,
                }}
                scrollToFirstError
                {...formItemLayout}
              >
                <Form.Item
                  name="type"
                  label="Type"
                  tooltip={descForType}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  className="left"
                >
                  <Radio.Group style={{ width: "100%" }} buttonStyle="solid">
                    <Radio.Button value="Dog">Dog</Radio.Button>
                    <Radio.Button value="Cat">Cat</Radio.Button>
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  name="name"
                  label="Name"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                    },
                  ]}
                >
                  <Input placeholder="Type pet's name" />
                </Form.Item>

                <Form.Item
                  name="ageInMonths"
                  label="Age"
                  rules={[{ required: true }]}
                  extra="Age will be automatically incremented over time."
                  className="left"
                >
                  <InputNumber
                    min={1}
                    max={500}
                    addonAfter="months"
                    style={{ width: "100%" }}
                  />
                </Form.Item>

                <Form.Item
                  name="gender"
                  label="Gender"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  className="left"
                >
                  <Radio.Group style={{ width: "100%" }} buttonStyle="solid">
                    <Radio.Button value="Male">Male</Radio.Button>
                    <Radio.Button value="Female">Female</Radio.Button>
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  name="breed"
                  label="Breed"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                    },
                  ]}
                >
                  <Input placeholder="Pet's breed (use ',' to separate the breed if it's more than one.)" />
                </Form.Item>

                <Form.Item
                  name="color"
                  label="Color"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  className="left"
                >
                  <Checkbox.Group>
                    <Row type="flex" style={{ alignItems: "center" }}>
                      <Col span={4}>
                        <Checkbox
                          value="White"
                          style={{
                            lineHeight: "32px",
                          }}
                        >
                          White
                        </Checkbox>
                      </Col>
                      <Col span={4}>
                        <Checkbox
                          value="Brown"
                          style={{
                            lineHeight: "32px",
                          }}
                        >
                          Brown
                        </Checkbox>
                      </Col>
                      <Col span={4}>
                        <Checkbox
                          value="Black"
                          style={{
                            lineHeight: "32px",
                          }}
                        >
                          Black
                        </Checkbox>
                      </Col>
                      <Col span={4}>
                        <Checkbox
                          value="Grey"
                          style={{
                            lineHeight: "32px",
                          }}
                        >
                          Grey
                        </Checkbox>
                      </Col>
                      <Col span={4}>
                        <Checkbox
                          value="Golden"
                          style={{
                            lineHeight: "32px",
                          }}
                        >
                          Golden
                        </Checkbox>
                      </Col>
                      <Col span={4}>
                        <Checkbox
                          value="Cream"
                          style={{
                            lineHeight: "32px",
                          }}
                        >
                          Cream
                        </Checkbox>
                      </Col>
                    </Row>
                  </Checkbox.Group>
                </Form.Item>

                <Form.Item
                  label="Health Condition"
                  name="healthCondition"
                  rules={[{ required: true }]}
                  className="left"
                >
                  <Radio.Group style={{ width: "100%" }} buttonStyle="solid">
                    <Radio.Button value="Healthy">Healthy</Radio.Button>
                    <Radio.Button value="Minor injury">
                      Minor injury
                    </Radio.Button>
                    <Radio.Button value="Serious injury">
                      Serious injury
                    </Radio.Button>
                    <Radio.Button value="Chronic disease">
                      Chronic disease
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  name="vaccinated"
                  label="Vaccinated?"
                  valuePropName="checked"
                  tooltip={descForVaccinated}
                  className="left"
                >
                  <Switch
                    checkedChildren="Vaccinated"
                    unCheckedChildren="Not Vaccinated"
                  />
                </Form.Item>

                <Form.Item
                  name="spayedOrNeutered"
                  label="Spayed/Neutered?"
                  valuePropName="checked"
                  tooltip={descForSpayedOrNeutered}
                  className="left"
                >
                  <Switch
                    checkedChildren="Spayed/Neutered"
                    unCheckedChildren="Not Spayed/Neutered"
                  />
                </Form.Item>

                <Form.Item
                  name="dewormed"
                  label="Dewormed?"
                  valuePropName="checked"
                  tooltip={descForDewormed}
                  className="left"
                >
                  <Switch
                    checkedChildren="dewormed"
                    unCheckedChildren="Not dewormed"
                  />
                </Form.Item>

                <Form.Item
                  name="fee"
                  label="Adoption Fee"
                  tooltip={descForFee}
                  rules={[{ required: true }]}
                >
                  <InputNumber addonBefore="RM" style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                  name="stateOrProvince"
                  label="State/Province"
                  rules={[{ required: true }]}
                  tooltip={descForStateOrProvince}
                  className="left"
                >
                  <Select placeholder="Select pet's state or province">
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

                <Form.Item
                  name="city"
                  label="City"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                    },
                  ]}
                >
                  <Input placeholder="City of the pet's location" />
                </Form.Item>

                <Form.Item
                  name="postcode"
                  label="Postcode"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                    },
                    () => ({
                      validator(_, value) {
                        if (
                          !value ||
                          (value.length === 5 &&
                            value.match(/^[0-9]+$/) != null)
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
                  <Input placeholder="Postcode of the pet's location" />
                </Form.Item>

                <Form.Item
                  name="description"
                  label="Description"
                  rules={[{ required: true }]}
                  tooltip={descForDescription}
                >
                  <Input.TextArea
                    showCount
                    rows={6}
                    maxLength={5000}
                    placeholder="Describe the pet"
                  />
                </Form.Item>

                <Form.Item
                  name="mainImage"
                  label="Main image"
                  valuePropName="mainImage"
                  getValueFromEvent={normFile}
                  className="left"
                >
                  <Upload
                    name="mainImage"
                    listType="picture"
                    maxCount={1}
                    beforeUpload={validateFile}
                    onChange={onMainImageChange}
                    customRequest={dummyRequest}
                    rules={[{ required: true }]}
                    accept="image/png, image/jpeg, image/svg+xml"
                  >
                    <Button icon={<UploadOutlined />}>
                      Upload image only (Max: 1)
                    </Button>
                  </Upload>
                </Form.Item>

                <Form.Item
                  name="images"
                  label="More images"
                  valuePropName="images"
                  getValueFromEvent={normFile}
                  className="left"
                >
                  <Upload
                    name="images"
                    listType="picture"
                    maxCount={10}
                    beforeUpload={validateFile}
                    onChange={onImageChange}
                    customRequest={dummyRequest}
                    accept="image/png, image/jpeg, image/svg+xml"
                  >
                    <Button icon={<UploadOutlined />}>
                      Upload images only (Max: 10)
                    </Button>
                  </Upload>
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                    style={{ width: "100%" }}
                  >
                    Create pet
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default AddPet;
