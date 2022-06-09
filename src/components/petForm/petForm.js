import React, { useEffect, useState } from "react";
import { filter, map } from "lodash";
import { monthDifference } from "../../helpers/date";
import { getPets } from "../../services/pet.services.js";

import { Spin, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import EditableForm from "../editableForm/editableForm";

import "./petForm.less";

const PetForm = ({ petID, editable = true }) => {
  const [petState, setPetState] = useState({
    status: "idle",
    data: null,
  });

  const [petFields, setPetFields] = useState({
    status: "idle",
    data: null,
  });

  const isLoading =
    petState.status !== "success" || petFields.status !== "success";

  useEffect(() => {
    fetchPet();
  }, []);

  const fetchPet = async () => {
    setPetState({ ...petState, status: "loading" });
    setPetFields({ ...petFields, status: "loading" });

    const res = await getPets({ petID });
    if (res?.error) {
      message.error(res.error.description);
    } else {
      let fields = [];
      let pet = res.petsList[0];

      const diffInMonths = monthDifference(
        new Date(pet.createdAt),
        new Date(Date.now())
      );
      const ageInMonths = parseInt(pet.ageInMonths) + diffInMonths;
      pet = { ...pet, ageInMonths: ageInMonths };

      fields.push({
        name: "name",
        label: "Name",
        value: pet.name,
        editable: true,
        required: true,
      });
      fields.push({
        name: "fee",
        label: "Adoption Fee",
        value: pet.fee == 0 ? `Free` : `RM ${pet.fee}`,
        editable: true,
        required: true,
      });
      fields.push({
        name: "type",
        label: "Type",
        value: pet.type,
        editable: true,
        required: true,
      });
      fields.push({
        name: "ageInMonths",
        label: "Age",
        value:
          pet.ageInMonths > 1
            ? `${pet.ageInMonths} months`
            : `${pet.ageInMonths} month`,
        editable: true,
        required: true,
        type: "integer",
      });
      fields.push({
        name: "gender",
        label: "Gender",
        value: pet.gender,
        editable: true,
        required: true,
      });
      fields.push({
        name: "breed",
        label: "Breed",
        value: pet.breed,
        editable: true,
        required: true,
      });
      fields.push({
        name: "color",
        label: "Color",
        value: pet.color,
        editable: true,
        required: true,
        type: "color",
      });
      fields.push({
        name: "vaccinated",
        label: "Vaccination",
        value: pet.vaccinated ? "Vaccinated" : "Not Vaccinated",
        editable: true,
        required: true,
        type: "boolean",
      });
      fields.push({
        name: "spayedOrNeutered",
        label: "Spayed / Neutered",
        value: pet.spayedOrNeutered
          ? "Spayed / Neutered"
          : "Not Spayed / Neutered",
        editable: true,
        required: true,
        type: "boolean",
      });
      fields.push({
        name: "dewormed",
        label: "Deworming",
        value: pet.dewormed ? "Dewormed" : "Not Dewormed",
        editable: true,
        required: true,
        type: "boolean",
      });
      fields.push({
        name: "healthCondition",
        label: "Health Condition",
        value: pet.healthCondition,
        editable: true,
        required: true,
        type: "healthCondition",
      });
      fields.push({
        name: "stateOrProvince",
        label: "State / Province",
        value: pet.stateOrProvince,
        editable: true,
        required: true,
        type: "stateOrProvince",
      });
      fields.push({
        name: "city",
        label: "City",
        value: pet.city,
        editable: true,
        required: true,
      });
      fields.push({
        name: "postcode",
        label: "Postcode",
        value: pet.postcode,
        editable: true,
        required: true,
        type: "postcode",
      });
      fields.push({
        name: "adopted",
        label: "Adopted",
        value: pet.adopted ? "Adopted" : "Not adopted",
        editable: true,
        required: true,
        type: "boolean",
      });
      fields.push({
        name: "active",
        label: "Active",
        value: pet.active ? "Active" : "Deactivated",
        editable: true,
        required: true,
        type: "boolean",
      });
      fields.push({
        name: "description",
        label: "Description",
        value: pet.description,
        editable: true,
        required: true,
        type: "textArea",
      });
      fields.push({
        name: "mainImage",
        label: "Main Image",
        value: pet.mainImage,
        editable: true,
        required: true,
        type: "image",
      });
      fields.push({
        name: "images",
        label: "More images",
        value: pet.images,
        editable: true,
        required: true,
        type: "images",
      });

      setPetFields({ ...petFields, status: "success", data: fields });
      setPetState({
        ...petState,
        status: "success",
        data: pet,
      });
    }
  };

  const handleUpdatePet = async ({
    name,
    phone,
    address,
    stateOrProvince,
    city,
    postcode,
    image,
  }) => {
    // const res = await updatePet({
    //   pet: {
    //     ...pet.data,
    //     name,
    //     phone,
    //     address,
    //     stateOrProvince,
    //     city,
    //     postcode,
    //     image,
    //   },
    // });
    // if (res?.error) {
    //   message.error(res.error.description);
    //   return false;
    // } else {
    //   message.success("Updated pet successfully!");
    //   return res;
    // }
  };

  return (
    <div className="pet-form">
      {isLoading && (
        <>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </>
      )}
      {!isLoading &&
        (editable ? (
          <>
            <EditableForm
              fields={petFields.data}
              api={handleUpdatePet}
              editable={true}
            />
          </>
        ) : (
          <>
            <div className="sliders">
              {map(
                [petState.data.mainImage, ...petState.data.images],
                (image, index) => {
                  return (
                    <img
                      alt="pet"
                      src={image}
                      key={index}
                      onClick={() => window.open(image)}
                    />
                  );
                }
              )}
            </div>
            <EditableForm
              fields={filter(petFields.data, (v) => {
                return (
                  v.name != "adopted" &&
                  v.name != "active" &&
                  v.name != "description" &&
                  v.name != "mainImage" &&
                  v.name != "images" &&
                  v.value != null &&
                  v.value != ""
                );
              })}
              api={handleUpdatePet}
              editable={false}
            />
          </>
        ))}
    </div>
  );
};

export default PetForm;
