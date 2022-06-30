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
  DatePicker,
  Divider,
  Collapse,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import "./add-pet.scss";

const { Option } = Select;
const { Panel } = Collapse;

function AddPet() {
  const [date, setDate] = useState(null);
  const [images, setImages] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function onDateChange(date, dateString) {
    setDate(dateString);
  }

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
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 20 },
      sm: { span: 18 },
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
    const pet = omitBy(
      { ...values, birthDate: date },
      (v) => isNil(v) || v.toString().trim() === ""
    );
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
    "It's okay to charge a fee to cover operating expenses, pet care, medical bills, and so forth.";
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
          <Col span={18} offset={2}>
            <div className="add-pet-form">
              <Form
                name="add-pet"
                onFinish={onFinish}
                validateMessages={validateMessages}
                initialValues={{
                  type: "Dog",
                  gender: "Male",
                  petSize: "Small",
                  foodSize: "<= 0.5 cups",
                  foodFee: "<= RM100",
                  healthCondition: "Healthy",
                  stateOrProvince: "Selangor",
                  country: "Malaysia",
                  fee: 0,
                  vaccinated: false,
                  spayedOrNeutered: false,
                  dewormed: false,
                }}
                scrollToFirstError
                {...formItemLayout}
              >
                <Collapse defaultActiveKey={["1", "2", "3", "4", "5"]}>
                  <Panel header="Basic information" key="1">
                    <Form.Item
                      name="type"
                      label="Type"
                      tooltip={descForType}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Radio.Group
                        style={{ width: "100%" }}
                        buttonStyle="solid"
                      >
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
                      name="gender"
                      label="Gender"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Radio.Group
                        style={{ width: "100%" }}
                        buttonStyle="solid"
                      >
                        <Radio.Button value="Male">Male</Radio.Button>
                        <Radio.Button value="Female">Female</Radio.Button>
                      </Radio.Group>
                    </Form.Item>

                    <Form.Item
                      name="petSize"
                      label="Pet Size"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Radio.Group
                        style={{ width: "100%" }}
                        buttonStyle="solid"
                      >
                        <Radio.Button value="Small">Small</Radio.Button>
                        <Radio.Button value="Medium">Medium</Radio.Button>
                        <Radio.Button value="Large">Large</Radio.Button>
                        <Radio.Button value="Giant">Giant</Radio.Button>
                      </Radio.Group>
                    </Form.Item>

                    <Form.Item
                      name="color"
                      label="Color"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
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
                      name="birthDate"
                      label="Birth Date"
                      rules={[{ required: true }]}
                    >
                      <DatePicker
                        onChange={onDateChange}
                        picker="month"
                        format="MMMM YYYY"
                      />
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
                  </Panel>
                  <Panel header="Health Condition" key="2">
                    <Form.Item
                      label="Health Condition"
                      name="healthCondition"
                      rules={[{ required: true }]}
                    >
                      <Radio.Group
                        style={{ width: "100%" }}
                        buttonStyle="solid"
                      >
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
                      label="Vaccinated"
                      valuePropName="checked"
                      tooltip={descForVaccinated}
                    >
                      <Switch
                        checkedChildren="Vaccinated"
                        unCheckedChildren="Not Vaccinated"
                      />
                    </Form.Item>

                    <Form.Item
                      name="spayedOrNeutered"
                      label="Spayed/Neutered"
                      valuePropName="checked"
                      tooltip={descForSpayedOrNeutered}
                    >
                      <Switch
                        checkedChildren="Spayed/Neutered"
                        unCheckedChildren="Not Spayed/Neutered"
                      />
                    </Form.Item>

                    <Form.Item
                      name="dewormed"
                      label="Dewormed"
                      valuePropName="checked"
                      tooltip={descForDewormed}
                    >
                      <Switch
                        checkedChildren="Dewormed"
                        unCheckedChildren="Not dewormed"
                      />
                    </Form.Item>
                  </Panel>
                  <Panel header="Fee" key="3">
                    <Form.Item
                      name="foodSize"
                      label="Food Size (per day)"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                      extra="1 cup = 224 grams"
                    >
                      <Select>
                        <Option value="<= 0.5 cups">{`<= 0.5 cups`}</Option>
                        <Option value="0.5 - 1 cups">0.5 - 1 cups</Option>
                        <Option value="1 - 2 cups">1 - 2 cups</Option>
                        <Option value="2 - 3 cups">2 - 3 cups</Option>
                        <Option value="3 - 5 cups">3 - 5 cups</Option>
                        <Option value=">= 5 cups">{`>= 5 cups`}</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="foodFee"
                      label="Food Fee (per month)"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Select>
                        <Option value="<= RM100">{`<= RM100`}</Option>
                        <Option value="RM100 - RM300">RM100 - RM300</Option>
                        <Option value="RM300 - RM500">RM300 - RM500</Option>
                        <Option value="RM500 - RM700">RM500 - RM700</Option>
                        <Option value=">= RM700">{`>= RM700`}</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="fee"
                      label="Adoption Fee"
                      tooltip={descForFee}
                      rules={[{ required: true }]}
                      extra="Enter 0 if the adoption fee is free. "
                    >
                      <InputNumber addonBefore="RM" style={{ width: "100%" }} />
                    </Form.Item>
                  </Panel>
                  <Panel header="Location" key="4">
                    <Form.Item
                      name="stateOrProvince"
                      label="State/Province"
                      rules={[{ required: true }]}
                      tooltip={descForStateOrProvince}
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
                              new Error(
                                "Postcode should be five digit numeric."
                              )
                            );
                          },
                        }),
                      ]}
                    >
                      <Input placeholder="Postcode of the pet's location" />
                    </Form.Item>

                    <Form.Item
                      name="country"
                      label="Country"
                      rules={[{ required: true }]}
                      tooltip="ReHome is currently serving in Malaysia only."
                      className="left"
                    >
                      <Select placeholder="select your country" disabled>
                        <Option value="Malaysia">Malaysia</Option>
                      </Select>
                    </Form.Item>
                  </Panel>
                  <Panel header="Description & Images" key="5">
                    <Form.Item
                      name="description"
                      label="Description"
                      rules={[{ required: true }]}
                    >
                      <Input.TextArea
                        showCount
                        rows={6}
                        maxLength={5000}
                        placeholder={descForDescription}
                      />
                    </Form.Item>

                    <Form.Item
                      name="mainImage"
                      label="Main image"
                      valuePropName="mainImage"
                      getValueFromEvent={normFile}
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
                  </Panel>
                </Collapse>

                <Form.Item 
                wrapperCol={{span: 24}}
                className="submit-btn"
                >
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
