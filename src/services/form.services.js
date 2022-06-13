import apiURL from "../helpers/url";
import axios from "axios";
import errorHandler from "../helpers/errorHandler";
import Cookies from "js-cookie";
import lodash from "lodash";
const { isEmpty } = lodash;

export const createAdoptionForm = async ({ adoptionForm }) => {
  const url = apiURL("/adopt/form");
  const data = {adoptionForm};

  const accessToken = Cookies.get("accessToken");
  try {
    const res = await axios({
      method: "POST",
      url: url,
      data: data,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (res?.data?.data?.newAdoptionForm || res?.data?.data?.updatedAdoptionForm) {
      return res?.data?.data?.newAdoptionForm || res?.data?.data?.updatedAdoptionForm;
    }
  } catch (err) {
    const errorFromApi = err.response?.data;
    const callback = async () => await createAdoptionForm({ adoptionForm });
    const error = await errorHandler({
      error: errorFromApi,
      callback: callback,
      redirect: null,
    });
    return { error };
  }
};

export const getAdoptionForm = async (params) => {
  const queryString = new URLSearchParams(params).toString();
  const url = apiURL(`/adopt/form?${queryString}`);

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
    const callback = async () => await getAdoptionForm(params);
    const error = await errorHandler({
      error: errorFromApi,
      callback: callback,
      redirect: null,
    });
    return { error };
  }
};

export const updateAdoptionForm = async ({ adoptionForm }) => {
  const url = apiURL("/adopt/form");
  const data = { adoptionForm }

  const accessToken = Cookies.get("accessToken");

  try {
    const res = await axios({
      method: "PUT",
      url: url,
      data: data,
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (res?.data?.data?.updatedAdoptionForm) {
      return res.data.data.updatedAdoptionForm;
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