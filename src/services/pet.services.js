import { apiURL } from "../helpers/url";
import { hash } from "../helpers/crypto";
import { unset } from "lodash";
import axios from "axios";
import errorHandler from "../helpers/errorHandler";
import AuthContext from "../context/authContext";
import Cookies from "js-cookie";

export const createPet = async (pet) => {
  const url = apiURL("/pet");

  const payload = {
    pet: { ...pet, adopted: false, active: true },
  };

  const accessToken = Cookies.get("accessToken");
  try {
    const res = await axios({
      method: "POST",
      url: url,
      data: payload,
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (res?.data?.pet) {
      return true;
    }
  } catch (err) {
    const errorFromApi = err.response?.data;
    const callback = async () => await createPet(pet);
    const error = await errorHandler({
      error: errorFromApi,
      callback: callback,
      redirect: null,
    });
    return { error };
  }
};
