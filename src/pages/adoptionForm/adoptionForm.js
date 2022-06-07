import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { omitBy, isNil, unset, trim, isEmpty } from "lodash";
import useAuthContext from "../../hooks/useAuthContext.js";
import { getAccount } from "../../services/auth.services.js";
import { createAdoptionForm } from "../../services/adopt.services.js";

import {
  Row,
  Col,
  Form,
  Button,
  Input,
  Select,
  InputNumber,
  Checkbox,
  message,
  Divider,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import "./adoptionForm.less";

const { Option } = Select;

function AdoptionForm() {
  const [isLoading, setIsLoading] = useState(false);

  const formItemLayout = {
    labelCol: {
      span: 24,
    },
    wrapperCol: {
      span: 24,
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

  const { accountType, accountID } = useAuthContext();
  useEffect(() => {
    checkAdoptionForm();
  }, []);

  const checkAdoptionForm = async () => {
      const res = await getAccount({ accountID });
      if (res.account?.adoptionFormID) {
        message.info(
          "You have filled in adoption form before. You can modify it here!"
        );
        navigate(`/adoptionForm/edit`);
      }
  };

  const navigate = useNavigate();
  const onFinish = async (values) => {
    setIsLoading(true);
    const adoptionForm = omitBy(values, v => isNil(v) || v.toString().trim() === '');

    const res = await createAdoptionForm({ adoptionForm });

    if (res?.error) {
      message.error(res.error.description);
      setIsLoading(false);
    } else {
      message.success("Thank you for filling in the form!");
      navigate("/adopt/application/new");
    }
  };

  const gridProps = { xxl: 18, xl: 18, lg: 18, md: 18, sm: 24, xs: 24 };

  return (
    <div className="adoptionForm">
      <div className="adoptionForm-wrapper fade-in">
        <Row align="center">
          <Col span={24} className="adoptionForm-description-title">
            <h1>Let us know more about you.</h1>
          </Col>
          <Col span={20} align="center" className="adoptionForm-description">
            <div>
              The following questions will be referred by the rescuers so that
              they understand your situation and see how to help you when you're
              having a new pet. The questions will be related to pet ownership,
              housing situation etc.{" "}
            </div>
            <br />
            <div>You only need to fill out this form once. </div>
            <br />
            <div>
              There's no right or wrong about these questions. Honest responses
              can give them more ideas about how to create a plan that's
              suitable for you when adopting a pet. You can always choose to
              leave blank if you feel uncomfortable with any of the questions.
            </div>
          </Col>

          <Divider />

          <Col {...gridProps} align="center">
            <div className="adoptionForm-form">
              <Form
                name="adoptionForm"
                onFinish={onFinish}
                initialValues={{
                  numberOfHousemate: 1,
                  currentNumberOfPets: 0,
                  pastNumberOfPets: 0,

                  //TODO: IMPORTANT: uncomment later
                  caregiver: "Yes.",
                  preparation: "I have prepare this.",
                  typicalDay: "My dog will wake up at around 7am.",
                  livingSituation: "Landed property.",
                  petLivingSituation: "Indoor",
                  housemateAcknowledgement: "everyoneExcited",
                  reasonOfAdoption: "I have financial ability now.",
                  remark: "Could I adopt...",
                  interestedPetTypes: [ 'Cat' ],
                  currentPetTypes: [ 'Bird', 'Hamster' ],
                  pastPetTypes: [ 'Bird', 'Cat' ],
                }}
                scrollToFirstError
                {...formItemLayout}
              >
                <Form.Item
                  name="interestedPetTypes"
                  label="You're interested in adopting..."
                >
                  <Checkbox.Group>
                    <Row type="flex" style={{ alignItems: "center" }}>
                      <Col align="left">
                        <Checkbox
                          value="Dog"
                          style={{
                            lineHeight: "32px",
                          }}
                        >
                          Dog(s)
                        </Checkbox>
                      </Col>
                      <Col align="left">
                        <Checkbox
                          value="Cat"
                          style={{
                            lineHeight: "32px",
                          }}
                        >
                          Cat(s)
                        </Checkbox>
                      </Col>
                    </Row>
                  </Checkbox.Group>
                </Form.Item>

                <Form.Item
                  name="caregiver"
                  label="Will you be the primary caregiver for the pet?"
                  extra="We recommend the primary caregiver to apply for adoption."
                >
                  <Input.TextArea
                    rows={1}
                    maxLength={5000}
                    placeholder="eg. No. Will be my sister."
                  />
                </Form.Item>

                <Form.Item
                  name="currentNumberOfPets"
                  label="Do you have any pets now? (Specify 0 if there's none)"
                  extra="Pet care taker can help you about how to do when a new pet join your pet family."
                >
                  <InputNumber min={0} max={500} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                  name="currentPetTypes"
                  label="Specify which kinds of pet do you *currently* have. (Ignore if you have no pet)"
                >
                  <Checkbox.Group>
                    <Row type="flex" style={{ alignItems: "center" }}>
                      <Col align="left">
                        <Checkbox
                          value="Dog"
                          style={{
                            lineHeight: "32px",
                          }}
                        >
                          Dog(s)
                        </Checkbox>
                      </Col>
                      <Col align="left">
                        <Checkbox
                          value="Cat"
                          style={{
                            lineHeight: "32px",
                          }}
                        >
                          Cat(s)
                        </Checkbox>
                      </Col>
                      <Col align="left">
                        <Checkbox
                          value="Fish"
                          style={{
                            lineHeight: "32px",
                          }}
                        >
                          Fish(s)
                        </Checkbox>
                      </Col>
                      <Col align="left">
                        <Checkbox
                          value="Bird"
                          style={{
                            lineHeight: "32px",
                          }}
                        >
                          Bird(s)
                        </Checkbox>
                      </Col>
                      <Col align="left">
                        <Checkbox
                          value="Hamster"
                          style={{
                            lineHeight: "32px",
                          }}
                        >
                          Hamster(s)
                        </Checkbox>
                      </Col>
                      <Col align="left">
                        <Checkbox
                          value="Rabbit"
                          style={{
                            lineHeight: "32px",
                          }}
                        >
                          Rabbit(s)
                        </Checkbox>
                      </Col>
                      <Col align="left">
                        <Checkbox
                          value="Other"
                          style={{
                            lineHeight: "32px",
                          }}
                        >
                          Others
                        </Checkbox>
                      </Col>
                    </Row>
                  </Checkbox.Group>
                </Form.Item>

                <Form.Item
                  name="pastNumberOfPets"
                  label="Have you had pets in the past? (Specify 0 if there's none)"
                  extra="This question aims to understand your pet ownership history."
                >
                  <InputNumber min={0} max={500} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                  name="pastPetTypes"
                  label="Specify which kinds of pet do you have *in the past*. (Ignore if you have no pet)"
                >
                  <Checkbox.Group>
                    <Row type="flex" style={{ alignItems: "center" }}>
                      <Col align="left">
                        <Checkbox
                          value="Dog"
                          style={{
                            lineHeight: "32px",
                          }}
                        >
                          Dog(s)
                        </Checkbox>
                      </Col>
                      <Col align="left">
                        <Checkbox
                          value="Cat"
                          style={{
                            lineHeight: "32px",
                          }}
                        >
                          Cat(s)
                        </Checkbox>
                      </Col>
                      <Col align="left">
                        <Checkbox
                          value="Fish"
                          style={{
                            lineHeight: "32px",
                          }}
                        >
                          Fish(s)
                        </Checkbox>
                      </Col>
                      <Col align="left">
                        <Checkbox
                          value="Bird"
                          style={{
                            lineHeight: "32px",
                          }}
                        >
                          Bird(s)
                        </Checkbox>
                      </Col>
                      <Col align="left">
                        <Checkbox
                          value="Hamster"
                          style={{
                            lineHeight: "32px",
                          }}
                        >
                          Hamster(s)
                        </Checkbox>
                      </Col>
                      <Col align="left">
                        <Checkbox
                          value="Rabbit"
                          style={{
                            lineHeight: "32px",
                          }}
                        >
                          Rabbit(s)
                        </Checkbox>
                      </Col>
                      <Col align="left">
                        <Checkbox
                          value="Other"
                          style={{
                            lineHeight: "32px",
                          }}
                        >
                          Others
                        </Checkbox>
                      </Col>
                    </Row>
                  </Checkbox.Group>
                </Form.Item>

                <Form.Item
                  name="preparation"
                  label="Could you describe what you have prepared / will prepare for your upcoming pet?"
                >
                  <Input.TextArea
                    rows={3}
                    maxLength={5000}
                    placeholder="eg. I bought a carriage, some food etc. I have a plan to buy some toys..."
                  />
                </Form.Item>

                <Form.Item
                  name="typicalDay"
                  label="Please describe/imagine what a typical day will be like for the pets in your home."
                >
                  <Input.TextArea
                    rows={6}
                    maxLength={5000}
                    placeholder="eg. My dog will wake up at early morning and ask me to take him for a walk. Then he will have breakfast. He always play with my cat while waiting for me to come home... "
                  />
                </Form.Item>

                <Form.Item
                  name="livingSituation"
                  label="Describe your living situation."
                >
                  <Input.TextArea
                    rows={1}
                    maxLength={5000}
                    placeholder="eg. Landed property / I rent apartment and I have permission to bring home a pet..."
                  />
                </Form.Item>

                <Form.Item name="petLivingSituation" label="The pet will be?">
                  <Select placeholder="Select your pet living situation">
                    <Option value="Indoor">Indoor</Option>
                    <Option value="Outdoor">Outdoor</Option>
                    <Option value="IndoorAndOutdoor">
                      Indoor And Outdoor (Free Choice)
                    </Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="numberOfHousemate"
                  label="How many family members / housemates you have? (include yourself)"
                  extra="Some pets are shy or timid and take a longer time to adapt to a family with more people."
                >
                  <InputNumber min={1} max={500} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                  name="housemateAcknowledgement"
                  label="If you live with others, do they acknowledge about adopting a pet? (Ignore if you're living alone)"
                  extra="According to research, cohabitants are one of the major reasons of pet abandonment."
                >
                  <Select placeholder="Select your situation">
                    <Option value="everyoneExcited">
                      Everyone in the household is excited about adopting
                    </Option>
                    <Option value="someoneNotSure">
                      Someone in the household isn't sure about adopting
                    </Option>
                    <Option value="someoneDontKnow">
                      Not everyone in the household knows I am applying to adopt
                    </Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="reasonOfAdoption"
                  label="How long have you been considering adoption, and why is now the right time?"
                >
                  <Input.TextArea
                    rows={2}
                    maxLength={5000}
                    placeholder="eg. 3 months. I have been browsing instagram to check for pet open for adoption..."
                  />
                </Form.Item>

                <Form.Item
                  name="remark"
                  label="Write here if you have any questions or remark so that the rescuer can answer you in the interview later."
                >
                  <Input.TextArea
                    rows={2}
                    maxLength={5000}
                    placeholder="eg. Is it suitable for me to adopt a cat when I already have a dog? / I always want a dog and I think I already have the financial ability to have it..."
                  />
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                  <Button
                    // disabled
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                    style={{ width: "100%" }}
                  >
                    Continue
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

export default AdoptionForm;
