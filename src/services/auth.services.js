import apiURL from "../helpers/url";
import { hash } from "../helpers/crypto";
import { unset } from "lodash";
import axios from "axios";
import errorHandler from "../helpers/errorHandler";
import Cookies from "js-cookie";
import { message } from "antd";

export const registerRescuer = async ({ account, image }) => {
  const url = apiURL("/auth");

  account.type = "rescuer";
  account.verified = false;
  account.email = account.email.toLowerCase();
  account.password = hash(account.password);
  account.phone = `${account.prefix}${account.phone}`;
  unset(account, "prefix");
  unset(account, "confirm_password");

  const data = new FormData();
  data.append("image", image);
  for (const i in account) {
    data.append(i, account[i]);
  }

  // print values in form data
  // for (var pair of data.entries()) {
  //   console.log(pair[0] + ", " + pair[1]);
  // }

  try {
    const res = await axios({
      method: "POST",
      url: url,
      data: data,
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res?.data?.data?.account) {
      return res.data.data.account;
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

export const registerAdopter = async ({ account, image }) => {
  const url = apiURL("/auth");

  account.type = "adopter";
  account.email = account.email.toLowerCase();
  account.password = hash(account.password);
  account.phone = `${account.prefix}${account.phone}`;
  unset(account, "prefix");
  unset(account, "confirm_password");

  const data = new FormData();
  data.append("image", image);
  for (const i in account) {
    data.append(i, account[i]);
  }

  // print values in form data
  // for (var pair of data.entries()) {
  //   console.log(pair[0] + ", " + pair[1]);
  // }

  try {
    const res = await axios({
      method: "POST",
      url: url,
      data: data,
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res?.data?.data?.account) {
      return res.data.data.account;
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

export const login = async ({ email, password }) => {
  const url = apiURL("/auth/login");
  const emailInLowerCase = email.toLowerCase();
  const passwordHash = hash(password);
  const payload = { email: emailInLowerCase, password: passwordHash };

  try {
    const res = await axios({
      method: "POST",
      url: url,
      data: payload,
    });

    if (res?.data?.data?.accessToken) {
      const accountData = res.data.data;
      logout();

      Cookies.set("accessToken", accountData.accessToken);
      Cookies.set("refreshToken", accountData.refreshToken);
      Cookies.set("type", accountData.type);
      Cookies.set("accountID", accountData.accountID);

      return accountData;
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

export const logout = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
  Cookies.remove("type");
  Cookies.remove("accountID");
};

export const refreshAccess = async () => {
  const url = apiURL("/auth/refresh");
  const refreshToken = Cookies.get("refreshToken");
  if (!refreshToken) {
    return { description: "Session Expired. Please login again." };
  }
  const payload = { refreshToken };

  try {
    const res = await axios({
      method: "POST",
      url: url,
      data: payload,
    });

    if (res?.data?.data?.accessToken && res?.data?.data?.refreshToken) {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      Cookies.set("accessToken", res?.data?.data?.accessToken);
      Cookies.set("refreshToken", res?.data?.data?.refreshToken);

      window.location.href = window.location.href; //force refresh page to update AuthContext

      return true;
    }
  } catch (err) {
    const errorFromApi = err.response?.data;
    if (errorFromApi.errorCode === 1009) {
      message.error("Session expired. Please login again.");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      Cookies.remove("type");
      Cookies.remove("accountID");
      window.location.href = window.location.href; //force refresh page to update AuthContext
    }
    console.error(errorFromApi);
    return false;
  }
};

export const getAccount = async (params) => {
  const queryString = new URLSearchParams(params).toString();
  const url = apiURL(`/auth?${queryString}`);

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
    const callback = async () => await getAccount(params);
    const error = await errorHandler({
      error: errorFromApi,
      callback: callback,
      redirect: null,
    });
    return { error };
  }
};
