import apiURL from "../helpers/url";
import axios from "axios";
import errorHandler from "../helpers/errorHandler";
import Cookies from "js-cookie";
import lodash from "lodash";
const { isEmpty } = lodash;

export const createApplication = async ({ adoptionApplication }) => {
  const url = apiURL("/adopt/application");
  const data = {adoptionApplication, sortMode: "desc"};

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

    if (res?.data?.data?.adoptionApplication) {
      return res?.data?.data?.adoptionApplication;
    }
  } catch (err) {
    const errorFromApi = err.response?.data;
    const callback = async () => await createApplication({ adoptionApplication });
    const error = await errorHandler({
      error: errorFromApi,
      callback: callback,
      redirect: null,
    });
    return { error };
  }
};

export const getApplications = async (params) => {
  const queryString = new URLSearchParams(params).toString();
  const url = apiURL(`/adopt/application?${queryString}&resultsPerPage=10000`);

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
    const callback = async () => await getApplications(params);
    const error = await errorHandler({
      error: errorFromApi,
      callback: callback,
      redirect: null,
    });
    return { error };
  }
}