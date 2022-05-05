import { apiURL } from "../helpers/url";
import { hash } from "../helpers/crypto";
import { unset } from "lodash";
import axios from "axios";
import errorHandler from "../helpers/errorHandler";
import Cookies from "js-cookie";
import toaster from "../components/toaster/toaster";

export const registerRescuer = async (account) => {
  const url = apiURL("/auth");
  account.email = account.email.toLowerCase();
  account.password = hash(account.password);
  account.phone = `${account.prefix}${account.phone}`;
  unset(account, "prefix");
  account.type = "rescuer";
  account.verified = false; //TODO: change this to false
  const payload = { account: account };

  try {
    const res = await axios({
      method: "POST",
      url: url,
      data: payload,
    });

    if (res?.data?.account) {
      return true;
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

export const registerAdopter = async (account) => {
  const url = apiURL("/auth");
  account.email = account.email.toLowerCase();
  account.password = hash(account.password);
  account.phone = `${account.prefix}${account.phone}`;
  unset(account, "prefix");
  account.type = "adopter";
  const payload = { account: account };

  try {
    const res = await axios({
      method: "POST",
      url: url,
      data: payload,
    });

    if (res?.data?.account) {
      return true;
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
      return res.data.data;
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
      //TODO: update AuthContext
      return true;
    }
  } catch (err) {
    const errorFromApi = err.response?.data;
    if (errorFromApi.errorCode === 1009) {
      toaster("error", "Session expired. Please login again.");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      Cookies.remove("type");
      Cookies.remove("accountID");
    }
    console.error(errorFromApi);
    return false;
  }
};
