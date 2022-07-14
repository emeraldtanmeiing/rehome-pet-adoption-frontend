import apiURL from "../helpers/url";
import axios from "axios";
import errorHandler from "../helpers/errorHandler";
import Cookies from "js-cookie";
import lodash from "lodash";
const { isEmpty } = lodash;

export const createEvent = async ({ event, image, rescuerID }) => {
  const url = apiURL("/event");

  event.active = true;
  event.rescuerID = rescuerID;

  const data = new FormData();

  data.append("image", image);

  for (const i in event) {
    data.append(i, event[i]);
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

    if (res?.data?.data?.event) {
      return res.data.data.event;
    }
  } catch (err) {
    const errorFromApi = err.response?.data;
    const callback = async () => await createEvent({ event, image, rescuerID });
    const error = await errorHandler({
      error: errorFromApi,
      callback: callback,
      redirect: null,
    });
    return { error };
  }
};

export const getEvents = async (params) => {
  const queryString = new URLSearchParams(params).toString();
  const url = apiURL(`/event?${queryString}`);

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
    const callback = async () => await getEvents(params);
    const error = await errorHandler({
      error: errorFromApi,
      callback: callback,
      redirect: null,
    });
    return { error };
  }
};

export const updateEvent = async ({ event, image }) => {
  const url = apiURL("/event");

  const data = new FormData();
  if (image) {
    data.append("image", image);
  }
  for (const i in event) {
    data.append(i, event[i]);
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

    if (res?.data?.data?.updatedEvent) {
      return res.data.data.updatedEvent;
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

