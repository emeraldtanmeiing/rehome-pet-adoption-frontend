import apiURL from "../helpers/url";
import axios from "axios";
import errorHandler from "../helpers/errorHandler";
import Cookies from "js-cookie";


export const getReport = async () => {
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
    const callback = async () => await getReport();
    const error = await errorHandler({
      error: errorFromApi,
      callback: callback,
      redirect: null,
    });
    return { error };
  }
};