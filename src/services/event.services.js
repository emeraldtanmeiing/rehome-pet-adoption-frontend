import apiURL from "../helpers/url";
import axios from "axios";
import errorHandler from "../helpers/errorHandler";
import Cookies from "js-cookie";
import lodash from "lodash";
const { isEmpty } = lodash;

const mockEvents = {
  eventsList: [
    {
      createdAt: new Date(),
      name: "Adopt-A-Palooza 2025",
      date: "2025-12-10",
      time: "10:00 AM - 4:00 PM",
      address: "Central Park, 72nd St & 5th Ave, New York, NY 10021, USA",
      description:
        "Join us for our annual pet adoption festival featuring over 50 rescue organizations. Meet your new best friend, enjoy food trucks, and take part in fun family activities.",
      active: true,
      rescuerID: "64b8a4de5f2b19a2a3c85f90",
      image:
        "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    },
    {
      createdAt: new Date(),
      name: "Paws & Relax: Pet Wellness Fair",
      date: "2026-01-20",
      time: "9:00 AM - 3:00 PM",
      address: "Harbour Green Park, Vancouver, BC, Canada",
      description:
        "A community wellness event offering free pet checkups, vaccination advice, and workshops on pet care. Local vets and groomers will be present.",
      active: true,
      rescuerID: "64b8a4de5f2b19a2a3c85f91",
      image:
        "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    },
    {
      createdAt: new Date(),
      name: "FurEver Home Charity Gala",
      date: "2026-03-05",
      time: "7:00 PM - 11:00 PM",
      address: "The Ritz-Carlton Ballroom, Sydney, NSW, Australia",
      description:
        "An elegant fundraising gala dinner supporting animal rescue initiatives. Enjoy live music, auctions, and guest speakers from animal welfare organizations.",
      active: true,
      rescuerID: "64b8a4de5f2b19a2a3c85f92",
      image:
        "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    },
  ],
};

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
  return mockEvents;
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
        Authorization: `Bearer ${accessToken}`,
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
