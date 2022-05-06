import React, { useState, useContext } from "react";
import {
  Form,
  Button,
  Input,
  Selector,
  Select,
  AutoComplete,
  Radio,
  InputNumber,
  Switch,
  Checkbox,
  Row,
  Col,
} from "antd";
import { omitBy, isNil, unset } from "lodash";
import { createPet } from "../../services/pet.services.js";
import { useNavigate } from "react-router-dom";
import "./add-pet.scss";
import toaster from "../../components/toaster/toaster.js";
import AuthContext from "../../context/authContext";

const { Option } = Select;

function AddPet() {
  const [isLoading, setIsLoading] = useState(false);

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
        span: 24,
        offset: 0,
      },
    },
  };

  const validateMessages = {
    required: "${label} is required.",
    types: {
      email: "${label} is not a valid email.",
    },
  };

  const Auth = useContext(AuthContext);
  const navigate = useNavigate();
  const onFinish = async (values) => {
    setIsLoading(true);
    const pet = omitBy(values, (v) => isNil(v));
    pet.rescuerID = Auth.auth?.accountID;

    const res = await createPet(pet);
    if (res?.error) {
      toaster("error", res.error.description);
      setIsLoading(false);
    } else {
      navigate("/rescuer/pets");
    }
  };

  const descForType = "More pet types will be added later.";
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
        Upload a new pet
        <div className="add-pet-criteria">add pet criteria</div>
        <div className="add-pet-form">
          <Form
            name="add-pet"
            onFinish={onFinish}
            validateMessages={validateMessages}
            initialValues={{
              type: "dog",
              gender: "male",
              healthCondition: "healthy",
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
                <Radio.Button value="dog">Dog</Radio.Button>
                <Radio.Button value="cat">Cat</Radio.Button>
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
                <Radio.Button value="male">Male</Radio.Button>
                <Radio.Button value="female">Female</Radio.Button>
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
              <Input placeholder="Pet's breed (use ',' to separate the breed if it's more than one." />
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
                <Radio.Button value="healthy">healthy</Radio.Button>
                <Radio.Button value="minor injury">minor injury</Radio.Button>
                <Radio.Button value="serious injury">
                  serious injury
                </Radio.Button>
                <Radio.Button value="chronic disease">
                  chronic disease
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
                      (value.length == 5 && value.match(/^[0-9]+$/) != null)
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
                maxLength={5000}
                placeholder="Describe the pet"
              />
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
      </div>
    </div>
  );
}

export default AddPet;

// type: "dog",
// name: "Lucky boi 2",
// age: 3,
// gender: "Male",
// breed: "mix breed",
// color: "black, white",
// vaccinated: true,
// spayedOrNeutered: false,
// dewormed: true,
// healthCondition: "healthy",
// desc: "im a lucky boi",
// fee: 0,
// stateOrProvince: "Johor",
// city: "Ulu Tiram",
// postcode: "81800",
// fileIDs: ["id1", "id2"],
