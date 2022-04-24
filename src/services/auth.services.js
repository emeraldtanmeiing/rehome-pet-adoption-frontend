import { apiURL } from "../helpers/url";
import { hash } from "../helpers/crypto";
import { unset } from "lodash";
import axios from "axios";
import errorHandler from "../helpers/errorHandler";

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
