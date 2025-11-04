import apiURL from "../helpers/url";
import axios from "axios";
import errorHandler from "../helpers/errorHandler";
import Cookies from "js-cookie";
import lodash from "lodash";
const { isEmpty } = lodash;

const mockPets = {
  page: 1,
  resultsPerPage: 20,
  petsList: [
    {
      createdAt: new Date(),
      type: "Dog",
      name: "Bella",
      birthDate: "2021-03-15",
      gender: "Female",
      breed: "Labrador Retriever",
      color: ["Yellow"],
      vaccinated: true,
      spayedOrNeutered: true,
      dewormed: true,
      healthCondition: "Healthy",
      description:
        "Friendly and energetic Labrador who loves playing fetch and going for long walks. Great with kids.",
      fee: 150,
      petSize: "Large",
      foodSize: "Large",
      foodFee: "High",
      stateOrProvince: "California",
      city: "San Diego",
      postcode: "92101",
      country: "USA",
      adopted: false,
      active: true,
      rescuerID: {
        _id: "64b8a4de5f2b19a2a3c85f7d",
        createdAt: new Date(),
        type: "rescuer",
        name: "Hope Paws Rescue",
        email: "contact@hopepaws.org",
        phone: "+1 (212) 555-9384",
        password:
          "$2a$10$9cK0eYkzvWc5JxZyTRhH3eJ5J5nK7l7Mv3yF8s4S8yD7EoW7xT1Ke", // hashed example
        active: true,
        address: "125 East 13th Street",
        stateOrProvince: "New York",
        city: "New York",
        postcode: "10003",
        country: "USA",
        image: "https://example.com/images/hopepaws-logo.jpg",
        description:
          "A non-profit organization dedicated to rescuing abandoned and mistreated pets in the NYC area. We focus on rehabilitation, medical care, and adoption placement.",
        verified: true,
        facebookLink: "https://facebook.com/hopepawsrescue",
        instagramLink: "https://instagram.com/hopepawsrescue",
        organizationWebsiteLink: "https://hopepaws.org",
        licenseNo: "NY-RESC-23487",
      },
      images: [
        "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
        "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      ],
      mainImage:
        "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    },
    {
      createdAt: new Date(),
      type: "Cat",
      name: "Mochi",
      birthDate: "2022-08-09",
      gender: "Male",
      breed: "British Shorthair",
      color: ["Gray", "White"],
      vaccinated: true,
      spayedOrNeutered: true,
      dewormed: true,
      healthCondition: "Healthy",
      description:
        "Calm and affectionate cat who loves naps and window gazing. Gets along well with other cats.",
      fee: 80,
      petSize: "Medium",
      foodSize: "Medium",
      foodFee: "Moderate",
      stateOrProvince: "Ontario",
      city: "Toronto",
      postcode: "M5H 2N2",
      country: "Canada",
      adopted: false,
      active: true,
      rescuerID: {
        _id: "64b8a4de5f2b19a2a3c85f7e",
        createdAt: new Date(),
        type: "rescuer",
        name: "Hope Paws Rescue",
        email: "contact@hopepaws.org",
        phone: "+1 (212) 555-9384",
        password:
          "$2a$10$9cK0eYkzvWc5JxZyTRhH3eJ5J5nK7l7Mv3yF8s4S8yD7EoW7xT1Ke", // hashed example
        active: true,
        address: "125 East 13th Street",
        stateOrProvince: "New York",
        city: "New York",
        postcode: "10003",
        country: "USA",
        image: "https://example.com/images/hopepaws-logo.jpg",
        description:
          "A non-profit organization dedicated to rescuing abandoned and mistreated pets in the NYC area. We focus on rehabilitation, medical care, and adoption placement.",
        verified: true,
        facebookLink: "https://facebook.com/hopepawsrescue",
        instagramLink: "https://instagram.com/hopepawsrescue",
        organizationWebsiteLink: "https://hopepaws.org",
        licenseNo: "NY-RESC-23487",
      },
      images: [
        "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
        "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      ],
      mainImage:
        "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    },
    {
      createdAt: new Date(),
      type: "Rabbit",
      name: "Clover",
      birthDate: "2023-01-22",
      gender: "Female",
      breed: "Holland Lop",
      color: ["White", "Brown"],
      vaccinated: true,
      spayedOrNeutered: false,
      dewormed: true,
      healthCondition: "Healthy",
      description:
        "Sweet and calm rabbit who enjoys being petted and loves carrots. Perfect companion for gentle families.",
      fee: 50,
      petSize: "Small",
      foodSize: "Small",
      foodFee: "Low",
      stateOrProvince: "New South Wales",
      city: "Sydney",
      postcode: "2000",
      country: "Australia",
      adopted: false,
      active: true,
      rescuerID: {
        _id: "64b8a4de5f2b19a2a3c85f7e",
        createdAt: new Date(),
        type: "rescuer",
        name: "Hope Paws Rescue",
        email: "contact@hopepaws.org",
        phone: "+1 (212) 555-9384",
        password:
          "$2a$10$9cK0eYkzvWc5JxZyTRhH3eJ5J5nK7l7Mv3yF8s4S8yD7EoW7xT1Ke", // hashed example
        active: true,
        address: "125 East 13th Street",
        stateOrProvince: "New York",
        city: "New York",
        postcode: "10003",
        country: "USA",
        image: "https://example.com/images/hopepaws-logo.jpg",
        description:
          "A non-profit organization dedicated to rescuing abandoned and mistreated pets in the NYC area. We focus on rehabilitation, medical care, and adoption placement.",
        verified: true,
        facebookLink: "https://facebook.com/hopepawsrescue",
        instagramLink: "https://instagram.com/hopepawsrescue",
        organizationWebsiteLink: "https://hopepaws.org",
        licenseNo: "NY-RESC-23487",
      },
      images: [
        "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
        "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      ],
      mainImage:
        "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    },
  ],
};

export const createPet = async ({ pet, mainImage, images, rescuerID }) => {
  const url = apiURL("/pet");

  pet.active = true;
  pet.rescuerID = rescuerID;

  const data = new FormData();

  data.append("mainImage", mainImage);

  if (!isEmpty(images)) {
    const lengthOfimages = images.length;
    for (let i = 0; i < lengthOfimages; i++) {
      data.append("images", images[i]);
    }
  }

  for (const i in pet) {
    data.append(i, pet[i]);
  }

  // print values in form data
  // for (var pair of data.entries()) {
  //   console.log(pair[0] + ", " + pair[1]);
  // }

  const accessToken = Cookies.get("accessToken");
  try {
    const res = await axios({
      method: "POST",
      url: url,
      data: data,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (res?.data?.data?.pet) {
      return res.data.data.pet;
    }
  } catch (err) {
    const errorFromApi = err.response?.data;
    const callback = async () =>
      await createPet({ pet, mainImage, images, rescuerID });
    const error = await errorHandler({
      error: errorFromApi,
      callback: callback,
      redirect: null,
    });
    return { error };
  }
};

export const getPets = async (params) => {
  return mockPets;
  const queryString = new URLSearchParams(params).toString();
  const url = apiURL(`/pet?${queryString}`);

  const accessToken = Cookies.get("accessToken");
  try {
    const res = await axios({
      method: "GET",
      url: url,
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (res?.data?.data) {
      return res.data.data;
    }
  } catch (err) {
    const errorFromApi = err.response?.data;
    const callback = async () => await getPets(params);
    const error = await errorHandler({
      error: errorFromApi,
      callback: callback,
      redirect: null,
    });
    return { error };
  }
};

export const updatePet = async ({ pet, mainImage, images, existingImages }) => {
  const url = apiURL("/pet");

  const data = new FormData();
  if (mainImage) {
    data.append("mainImage", mainImage);
  }
  if (!isEmpty(images)) {
    const lengthOfimages = images.length;
    for (let i = 0; i < lengthOfimages; i++) {
      data.append("images", images[i]);
    }
  }

  if (!isEmpty(existingImages)) {
    const lengthOfexistingImages = existingImages.length;
    for (let i = 0; i < lengthOfexistingImages; i++) {
      data.append("existingImages", existingImages[i]);
    }
  }
  for (const i in pet) {
    data.append(i, pet[i]);
  }

  // print values in form data
  // for (var pair of data.entries()) {
  //   console.log(pair[0] + ", " + pair[1]);
  // }

  const accessToken = Cookies.get("accessToken");

  try {
    const res = await axios({
      method: "PUT",
      url: url,
      data: data,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (res?.data?.data?.updatedPet) {
      return res.data.data.updatedPet;
    }
  } catch (err) {
    const errorFromApi = err.response?.data;
    const error = await errorHandler({
      error: errorFromApi,
      callback: null,
      redirect: null,
    });
    return { error };
  }
};
