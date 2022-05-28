import apiURL from "../helpers/url";
import axios from "axios";
import errorHandler from "../helpers/errorHandler";
import Cookies from "js-cookie";
import lodash from "lodash";
const { isEmpty } = lodash;

export const createAdoptionForm = async ({ adoptionForm }) => {
  const url = apiURL("/adopt/adoptionForm");
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


    console.log({res})
    // if (res?.data?.data?.pet) {
    //   return res.data.data.pet;
    // }
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