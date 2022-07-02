import React, { useEffect, useState } from "react";
import { filter, map, omit } from "lodash";
import useQuery from "../../hooks/useQuery";
import { getPets, updatePet } from "../../services/pet.services.js";

import { Spin, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import EditableForm from "../editableForm/editableForm";

import "./petForm.less";

const PetForm = ({ petID = null, editable = true, size = "default" }) => {
  const [pet, setPet] = useState({
    status: "idle",
    data: null,
  });

  const [petFields, setPetFields] = useState({
    status: "idle",
    data: null,
  });

  const isLoading = pet.status !== "success" || petFields.status !== "success";

  const query = useQuery();
  useEffect(() => {
    if (!petID) {
      petID = query.get("petID");
    }
    fetchPet();
  }, []);

  const fetchPet = async () => {
    setPet({ ...pet, status: "loading" });
    setPetFields({ ...petFields, status: "loading" });

    const res = await getPets({ petID });
    if (res?.error) {
      message.error(res.error.description);
    } else {
      let fields = [];
      let pet = res.petsList[0];

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
        type: "images",
        maxNumberOfImages: 10,
      });
      fields.push({
        name: "type",
        label: "Type",
        value: pet.type,
        editable: true,
        required: true,
        type: "petType",
      });
      fields.push({
        name: "name",
        label: "Name",
        value: pet.name,
        editable: true,
        required: true,
      });
      fields.push({
        name: "gender",
        label: "Gender",
        value: pet.gender,
        editable: true,
        required: true,
        type: "petGender",
      });
      fields.push({
        name: "petSize",
        label: "Pet Size",
        value: pet.petSize,
        editable: true,
        required: true,
        type: "petSize",
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
        name: "birthDate",
        label: "Birth Date",
        value: pet.birthDate,
        editable: true,
        required: true,
        type: "date-month",
      });

      fields.push({
        name: "breed",
        label: "Breed",
        value: pet.breed,
        editable: true,
        required: true,
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
        name: "vaccinated",
        label: "Vaccination",
        value: pet.vaccinated,
        checkedDesc: "Vaccinated",
        uncheckedDesc: "Not Vaccinated",
        editable: true,
        required: true,
        type: "boolean",
      });
      fields.push({
        name: "spayedOrNeutered",
        label: "Spayed / Neutered",
        value: pet.spayedOrNeutered,
        checkedDesc: "Spayed / Neutered",
        uncheckedDesc: "Not Spayed / Neutered",
        editable: true,
        required: true,
        type: "boolean",
      });
      fields.push({
        name: "dewormed",
        label: "Deworming",
        value: pet.dewormed,
        checkedDesc: "Dewormed",
        uncheckedDesc: "Not Dewormed",
        editable: true,
        required: true,
        type: "boolean",
      });
      fields.push({
        name: "foodSize",
        label: "Food Size (per day)",
        value: pet.foodSize,
        editable: true,
        required: true,
        type: "foodSize",
      });
      fields.push({
        name: "foodFee",
        label: "Food Fee (per month)",
        value: pet.foodFee,
        editable: true,
        required: true,
        type: "foodFee",
      });
      fields.push({
        name: "fee",
        label: "Adoption Fee (in Ringgit Malaysia)",
        value: pet.fee,
        editable: true,
        required: true,
        type: "integer",
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
        name: "country",
        label: "Country",
        value: pet.country,
        editable: false,
        required: true,
        type: "country",
      });
      fields.push({
        name: "adopted",
        label: "Adopted",
        value: pet.adopted,
        editable: false,
        required: true,
        type: "boolean",
      });
      fields.push({
        name: "active",
        label: "Active",
        value: pet.active,
        checkedDesc: "Active",
        uncheckedDesc: "Inactive",
        editable: true,
        required: true,
        type: "boolean",
        extra: "If pet is inactivated, it's not available for adoption."
      });
      fields.push({
        name: "description",
        label: "Description",
        value: pet.description,
        editable: true,
        required: true,
        type: "textArea",
      });

      setPetFields({ ...petFields, status: "success", data: fields });
      setPet({
        ...pet,
        status: "success",
        data: pet,
      });
    }
  };

  const handleUpdatePet = async ({
    mainImage,
    images,
    existingImages,
    name,
    fee,
    type,
    gender,
    breed,
    color,
    vaccinated,
    spayedOrNeutered,
    dewormed,
    healthCondition,
    stateOrProvince,
    city,
    postcode,
    // adopted,
    active,
    description,
    birthDate,
    petSize,
    foodSize,
    foodFee,
  }) => {
    const res = await updatePet({
      pet: omit(
        {
          ...pet.data,
          name,
          fee,
          type,
          gender,
          breed,
          color,
          vaccinated,
          spayedOrNeutered,
          dewormed,
          healthCondition,
          stateOrProvince,
          city,
          postcode,
          // adopted,
          active,
          description,
          birthDate,
          petSize,
          foodSize,
          foodFee,
        },
        ["age", "mainImage", "images", "existingImages"]
      ),
      mainImage,
      images,
      existingImages,
    });
    if (res?.error) {
      message.error(res.error.description);
      return false;
    } else {
      message.success("Updated pet successfully!");
      return res;
    }
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
              size={size}
            />
          </>
        ) : (
          <>
            <div className="sliders">
              {map([pet.data.mainImage, ...pet.data.images], (image, index) => {
                return (
                  <img
                    alt="pet"
                    src={image}
                    key={index}
                    onClick={() => window.open(image)}
                  />
                );
              })}
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
              size={size}
            />
          </>
        ))}
    </div>
  );
};

export default PetForm;
