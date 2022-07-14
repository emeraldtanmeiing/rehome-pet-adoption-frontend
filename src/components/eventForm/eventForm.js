import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { filter, omit } from "lodash";
import { getEvents, updateEvent } from "../../services/event.services";

import { Col, Avatar, Grid, Spin, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import "./eventForm.less";
import EditableForm from "../editableForm/editableForm";

const EventForm = ({ eventID = null, editable = true, size = "default" }) => {
  const [event, setEvent] = useState({
    status: "idle",
    data: null,
  });

  const [eventFields, setEventFields] = useState({
    status: "idle",
    data: null,
  });

  const isLoading =
    event.status !== "success" || eventFields.status !== "success";

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    setEvent({ ...event, status: "loading" });
    setEventFields({ ...eventFields, status: "loading" });

    const res = await getEvents({ eventID });
    if (res?.error) {
      message.error(res.error.description);
    } else {
      let fields = [];
      let a = res.eventsList[0];

      fields.push({
        name: "image",
        label: "Image",
        value: a.image,
        editable: true,
        required: true,
        type: "image",
      });
      fields.push({
        name: "name",
        label: "Name",
        value: a.name,
        editable: true,
        required: true,
      });
      fields.push({
        name: "date",
        label: "Date",
        value: a.date,
        editable: true,
        required: true,
        type: "date",
      });
      fields.push({
        name: "time",
        label: "Time",
        value: a.time,
        editable: true,
        required: true,
        type: "time",
      });
      fields.push({
        name: "address",
        label: "Address",
        value: a.address,
        editable: true,
        required: true,
        type: "textArea-small",
      });
      fields.push({
        name: "description",
        label: "Description",
        value: a.description,
        editable: true,
        required: true,
        type: "textArea",
      });

      setEventFields({ ...eventFields, status: "success", data: fields });

      setEvent({
        ...event,
        status: "success",
        data: a,
      });
    }
  };

  const handleUpdateEvent = async ({
    name,
    date,
    time,
    address,
    description,
    image,
  }) => {
    const res = await updateEvent({
      event: omit(
        {
          ...event.data,
          name,
          date,
          time,
          address,
          description,
          rescuerID: event.data.rescuerID._id
        },
        ["image"]
      ),
      image: image
    });

    if (res?.error) {
      message.error(res.error.description);
      return false;
    } else {
      message.success("Updated event successfully!");
      return res;
    }
  };

  const breakpoint = Grid.useBreakpoint();

  return (
    <div className="event-form">
      {isLoading && (
        <>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </>
      )}
      {!isLoading &&
        (editable ? (
          <>
            <EditableForm
              fields={eventFields.data}
              api={handleUpdateEvent}
              editable={true}
              size={size}
            />
          </>
        ) : (
          <>
            <EditableForm
              fields={filter(eventFields.data, (v) => {
                return v.value != null && v.value != "";
              })}
              api={handleUpdateEvent}
              editable={false}
              size={size}
            />
          </>
        ))}
    </div>
  );
};

export default EventForm;
