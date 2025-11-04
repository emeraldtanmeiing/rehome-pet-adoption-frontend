import apiURL from "../helpers/url";
import axios from "axios";
import errorHandler from "../helpers/errorHandler";
import Cookies from "js-cookie";

const mockPublicReport = {
  totalAdoptedPet: 100,
  totalWaitingForAdoptionPet: 100,
  totalCompletedApplication: 100,
  totalEvent: 100,
};

export const getAdminReport = async () => {
  const url = apiURL(`/report/admin`);

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
    const callback = async () => await getAdminReport();
    const error = await errorHandler({
      error: errorFromApi,
      callback: callback,
      redirect: null,
    });
    return { error };
  }
};

export const getPublicReport = async () => {
  return mockPublicReport;

  const url = apiURL(`/report`);

  try {
    const res = await axios({
      method: "GET",
      url: url,
    });

    if (res?.data?.data) {
      return res.data.data;
    }
  } catch (err) {
    const errorFromApi = err.response?.data;
    const callback = async () => await getPublicReport();
    const error = await errorHandler({
      error: errorFromApi,
      callback: callback,
      redirect: null,
    });
    return { error };
  }
};
