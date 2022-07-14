import React, { useEffect, useState } from "react";
import { omitBy, isNil } from "lodash";
import useQuery from "../../hooks/useQuery";
import useAuthContext from "../../hooks/useAuthContext";
import { getEvents } from "../../services/event.services";
import { calculateAge } from "../../helpers/date";
import Cookies from "js-cookie";

import { Row, Col, Skeleton, Card, Button, Grid, message } from "antd";
import EventCard from "../../components/eventCard/eventCard";

import "./events-listing-rescuer.scss";

function EventsListingRescuer() {
  const [event, setEvent] = useState({ status: "idle", data: null });

  const query = useQuery();
  const resultsPerPage = query.get("resultsPerPage");
  const page = query.get("page");

  const accountID = Cookies.get("accountID");
  const accountType = Cookies.get("type");

  const fetchEvents = async () => {
    setEvent({ ...event, status: "loading" });

    const params = omitBy(
      {
        rescuerID: accountID,
        resultsPerPage,
        page,
        sortBy: "date",
        sortMode: "desc",
      },
      (v) => isNil(v) || v.toString().trim() === ""
    );

    const res = await getEvents(params);

    if (res?.error) {
      message.error(res.error.description);
    } else {
      setEvent({
        ...event,
        status: "success",
        data: res,
      });
    }
  };

  const CardSkeleton = (index) => {
    return (
      <>
        <Col xxl={6} xl={6} lg={6} md={8} sm={12} xs={12}>
          <Card key={index}>
            <Skeleton avatar active />
          </Card>
        </Col>
      </>
    );
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const breakpoint = Grid.useBreakpoint();
  return (
    <div className="events-listing-rescuer">
      <div className="events-listing-rescuer-wrapper">
        <div className="cards">
          {event.status === "loading" && (
            <>
              <Row gutter={[30, 30]} className="loading">
                {[...Array(12).keys()].map((index) => (
                  <CardSkeleton index={index} key={index} />
                ))}
              </Row>
            </>
          )}

          {event.status === "success" && (
            <>
              <Row>
                <Col
                  className="title"
                  align="left"
                  span={breakpoint.md ? 12 : 24}
                >
                  <h1>My Events</h1>
                </Col>
                <Col
                  className="create-event"
                  align={breakpoint.md ? "right" : "left"}
                  span={breakpoint.md ? 12 : 24}
                >
                  <Button type="primary" href="/rescuer/event/new">
                    Publish a new event
                  </Button>
                </Col>
              </Row>

              <Row className="section">
                <Col span={24} align="left">
                  <h2>Recent events</h2>
                </Col>
                <Col span={24} align="left">
                  <Row gutter={[30, 30]}>
                    {event.data.eventsList.slice(0, 4).map((p) => (
                      <EventCard event={p} accountType={accountType} />
                    ))}
                  </Row>
                </Col>
              </Row>

              <Row className="section">
                <Col span={24} align="left">
                  <h2>All events</h2>
                </Col>
                <Col span={24} align="left">
                  <h4>{event.data.totalResultsFound} events found</h4>
                </Col>
                <Col span={24} align="left">
                  <Row gutter={[30, 30]}>
                    {event.data.eventsList?.map((p) => {
                      return <EventCard event={p} accountType={accountType} />;
                    })}
                  </Row>
                </Col>
              </Row>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventsListingRescuer;
