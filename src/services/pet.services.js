import apiURL from "../helpers/url";
import axios from "axios";
import errorHandler from "../helpers/errorHandler";
import Cookies from "js-cookie";
import lodash from "lodash";
const { isEmpty } = lodash;

export const createPet = async ({ pet, mainImage, images, rescuerID }) => {
  const url = apiURL("/pet");

  pet.active = true;
  pet.rescuerID = rescuerID;

  const data = new FormData();

  data.append("mainImage", mainImage);

  if(!isEmpty(images)){
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
    const callback = async () => await createPet({ pet, mainImage, images, rescuerID });
    const error = await errorHandler({
      error: errorFromApi,
      callback: callback,
      redirect: null,
    });
    return { error };
  }
};

export const getPets = async (params) => {
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
  if(!isEmpty(images)){
    const lengthOfimages = images.length;
    for (let i = 0; i < lengthOfimages; i++) {
      data.append("images", images[i]);
    }
  }
 
  if(!isEmpty(existingImages)){
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
        "Authorization": `Bearer ${accessToken}`,
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

