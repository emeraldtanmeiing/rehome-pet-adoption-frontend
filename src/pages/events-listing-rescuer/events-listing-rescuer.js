import React, { useEffect, useState } from "react";
import { omitBy, isNil } from "lodash";
import { getEvents } from "../../services/event.services";
import Cookies from "js-cookie";

import { Row, Col, Skeleton, Card, Button, Grid, Input, Divider, message } from "antd";
import EventCard from "../../components/eventCard/eventCard";

import "./events-listing-rescuer.scss";

const { Search } = Input;

function EventsListingRescuer() {
  const [event, setEvent] = useState({ status: "idle", data: null });
  const [recentEvents, setRecentEvents] = useState({ status: "idle", data: null });
  const isLoading = event.status !== "success" || recentEvents.status !== "success";

  useEffect(() => {
    fetchEvents();
    fetchRecentEvents();
  }, []);

  const accountID = Cookies.get("accountID");
  const accountType = Cookies.get("type");
  
  const fetchEvents = async ({searchText}) => {
    setEvent({ ...event, status: "loading" });

    const params = omitBy(
      {
        ...(searchText && {searchText}),
        rescuerID: accountID,
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

  const fetchRecentEvents = async () => {
    setRecentEvents({ ...recentEvents, status: "loading" });

    const params = omitBy(
      {
        rescuerID: accountID,
        resultsPerPage: 4,
        sortBy: "createdAt",
        sortMode: "desc",
      },
      (v) => isNil(v) || v.toString().trim() === ""
    );

    const res = await getEvents(params);

    if (res?.error) {
      message.error(res.error.description);
    } else {
      setRecentEvents({
        ...recentEvents,
        status: "success",
        data: res.eventsList,
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

  const [searchText, setSearchText] = useState("");
  const onSearch = (value) => setSearchText(value.toLowerCase());
  useEffect(() => {
    if (searchText.length === 0 || searchText.length > 1)
    fetchEvents({ searchText });
  }, [searchText]);

  const breakpoint = Grid.useBreakpoint();
  return (
    <div className="events-listing-rescuer">
      <div className="events-listing-rescuer-wrapper">
        <div className="cards">
          {isLoading && (
            <>
              <Row gutter={[30, 30]} className="loading">
                {[...Array(12).keys()].map((index) => (
                  <CardSkeleton index={index} key={index} />
                ))}
              </Row>
            </>
          )}

          {!isLoading && (
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
                  <h2>Recent added</h2>
                </Col>
                <Col span={24} align="left">
                  <Row gutter={[30, 30]}>
                    {recentEvents.data.map((p) => (
                      <EventCard event={p} accountType={accountType} />
                    ))}
                  </Row>
                </Col>
              </Row>

              <Divider />

              <Row >
              <Col span={24} align="left" className="filter-bar">
                  <h2 className="all-events">All events</h2>
                  <div>
                    <Button
                      onClick={() => {
                        fetchEvents({});
                      }}
                      className="all-button"
                    >
                      All
                    </Button>
                  </div>
                  <div className="searchbar">
                    <Search
                      placeholder="Search event by name, date, time, location..."
                      onSearch={onSearch}
                      enterButton
                      // size="large"
                    />
                  </div>
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
