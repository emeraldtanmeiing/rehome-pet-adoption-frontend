import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { filter } from "lodash";
import { useNavigate } from "react-router-dom";
import {
  getAdoptionForm,
  updateAdoptionForm,
} from "../../services/form.services";
import { getAccount } from "../../services/auth.services";

import { Row, Col, Grid, Spin, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import EditableForm from "../editableForm/editableForm";

import "./adoptionForm.less";

const AdoptionForm = ({
  adopterID = null,
  editable = true,
  showDescription = false,
  size = "default",
}) => {
  const navigate = useNavigate();
  const [adoptionForm, setAdoptionForm] = useState({
    status: "idle",
    data: null,
  });

  const [adoptionFormFields, setAdoptionFormFields] = useState({
    status: "idle",
    data: null,
  });

  const isLoading =
    adoptionForm.status !== "success" ||
    adoptionFormFields.status !== "success";

  useEffect(() => {
    checkAdoptionForm();
  }, []);

  const accountID = Cookies.get("accountID");
  const checkAdoptionForm = async () => {
    if (!adopterID) {
      adopterID = accountID;
    }

    const res = await getAccount({ accountID: adopterID });
    
    if (res?.error) {
      message.error(res.error.description);
      return;
    }

    if (!res.account?.adoptionFormID) {
      navigate(`/adopt/form/new`);
    } else {
      await fetchAdoptionForm(res.account?.adoptionFormID);
    }
  };

  const fetchAdoptionForm = async (adoptionFormID) => {
    setAdoptionForm({ ...adoptionForm, status: "loading" });
    setAdoptionFormFields({ ...adoptionFormFields, status: "loading" });

    const res = await getAdoptionForm({ adoptionFormID });

    if (res?.error) {
      message.error(res.error.description);
    } else {
      let fields = [];
      let a = res.adoptionForm;

      fields.push({
        name: "interestedPetTypes",
        label: "You're interested in adopting...",
        value: a.interestedPetTypes,
        editable: true,
        required: false,
        type: "interestedPetTypes",
      });
      fields.push({
        name: "caregiver",
        label: "Will you be the primary caregiver for the pet?",
        value: a.caregiver,
        editable: true,
        required: false,
        type: "textArea-small",
      });
      fields.push({
        name: "currentNumberOfPets",
        label: "Do you have any pets now? (Specify 0 if there's none)",
        value: a.currentNumberOfPets,
        editable: true,
        required: false,
        type: "integer-full",
      });
      fields.push({
        name: "currentPetTypes",
        label:
          "Specify which kinds of pet do you *currently* have. (Ignore if you have no pet)",
        value: a.currentPetTypes,
        editable: true,
        required: false,
        type: "petTypes",
      });
      fields.push({
        name: "pastNumberOfPets",
        label: "Have you had pets in the past? (Specify 0 if there's none)",
        value: a.pastNumberOfPets,
        editable: true,
        required: false,
        type: "integer-full",
      });
      fields.push({
        name: "pastPetTypes",
        label:
          "Specify which kinds of pet do you have *in the past*. (Ignore if you have no pet)",
        value: a.pastPetTypes,
        editable: true,
        required: false,
        type: "petTypes",
      });
      fields.push({
        name: "preparation",
        label:
          "Could you describe what you have prepared / will prepare for your upcoming pet?",
        value: a.preparation,
        editable: true,
        required: false,
        type: "textArea-small",
      });
      fields.push({
        name: "typicalDay",
        label:
          "Please describe/imagine what a typical day will be like for the pets in your home.",
        value: a.typicalDay,
        editable: true,
        required: false,
        type: "textArea-small",
      });
      fields.push({
        name: "livingSituation",
        label: "Describe your living situation.",
        value: a.livingSituation,
        editable: true,
        required: false,
        type: "textArea-small",
      });
      fields.push({
        name: "petLivingSituation",
        label: "The pet will be living?",
        value: a.petLivingSituation,
        editable: true,
        required: false,
        type: "petLivingSituation",
      });
      fields.push({
        name: "numberOfHousemate",
        label:
          "How many family members / housemates you have? (include yourself)",
        value: a.numberOfHousemate,
        editable: true,
        required: false,
        type: "integer-full",
      });
      fields.push({
        name: "housemateAcknowledgement",
        label:
          "If you live with others, do they acknowledge about adopting a pet? (Ignore if you're living alone)",
        value: a.housemateAcknowledgement,
        editable: true,
        required: false,
        type: "housemateAcknowledgement",
      });
      fields.push({
        name: "reasonOfAdoption",
        label:
          "How long have you been considering adoption, and why is now the right time?",
        value: a.reasonOfAdoption,
        editable: true,
        required: false,
        type: "textArea-small",
      });
      fields.push({
        name: "remark",
        label:
          "Write here if you have any questions or remark so that the pet's contact person/rescuer/organization can answer you in the interview later.",
        value: a.remark,
        editable: true,
        required: false,
        type: "textArea-small",
      });

      setAdoptionFormFields({
        ...adoptionFormFields,
        status: "success",
        data: fields,
      });

      setAdoptionForm({
        ...adoptionForm,
        status: "success",
        data: res.adoptionForm,
      });
    }
  };

  const handleUpdateAdoptionForm = async ({
    caregiver,
    currentNumberOfPets,
    currentPetTypes,
    pastNumberOfPets,
    pastPetTypes,
    preparation,
    typicalDay,
    livingSituation,
    petLivingSituation,
    numberOfHousemate,
    housemateAcknowledgement,
    reasonOfAdoption,
    remark,
  }) => {
    const res = await updateAdoptionForm({
      adoptionForm: {
        ...adoptionForm.data,
        caregiver,
        currentNumberOfPets,
        currentPetTypes,
        pastNumberOfPets,
        pastPetTypes,
        preparation,
        typicalDay,
        livingSituation,
        petLivingSituation,
        numberOfHousemate,
        housemateAcknowledgement,
        reasonOfAdoption,
        remark,
      },
    });
    if (res?.error) {
      message.error(res.error.description);
      return false;
    } else {
      message.success("Updated condition successfully!");
      return res;
    }
  };

  const breakpoint = Grid.useBreakpoint();

  return (
    <div className="adoption-form">
      {isLoading && (
        <>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </>
      )}

      {!isLoading &&
        (showDescription ? (
          <Row align="center">
            <Col span={18} className="description">
              <div>
                There's no right or wrong about these questions. Honest
                responses can give the contact person/rescuer/organization more ideas about how to create a plan
                that's suitable for you when adopting a pet. <br /> <br /> You can always
                choose to leave blank if you feel uncomfortable with any of the
                questions.
              </div>
            </Col>
          </Row>
        ) : null)}

      {!isLoading &&
        (editable ? (
          <>
            <EditableForm
              fields={adoptionFormFields.data}
              api={handleUpdateAdoptionForm}
              editable={true}
              size={size}
            />
          </>
        ) : (
          <>
            <EditableForm
              fields={filter(adoptionFormFields.data, (v) => {
                return v.name != "image" && v.value != null && v.value != "";
              })}
              api={handleUpdateAdoptionForm}
              editable={false}
              size={size}
            />
          </>
        ))}
    </div>
  );
};

export default AdoptionForm;
