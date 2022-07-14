import React, { useEffect, useState } from "react";
import { omitBy, isNil } from "lodash";
import useQuery from "../../hooks/useQuery";
import useAuthContext from "../../hooks/useAuthContext";
import { getEvents } from "../../services/event.services";

import { Row, Col, Skeleton, Card, Input, Grid, Button, message } from "antd";
import EventCard from "../../components/eventCard/eventCard";

import "./events-listing.scss";

const { Search } = Input;

function EventsListing() {
  const [event, setEvent] = useState({ status: "idle", data: null });

  const { accountType } = useAuthContext();

  const fetchEvents = async ({searchText}) => {
    setEvent({ ...event, status: "loading" });

    const params = omitBy(
      {
        ...(searchText && {searchText: searchText}),
        active: true,
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

  const [searchText, setSearchText] = useState("");
  const onSearch = (value) => setSearchText(value.toLowerCase());
  useEffect(() => {
    if (searchText.length === 0 || searchText.length > 1)
    fetchEvents({ searchText });
  }, [searchText]);

  return (
    <div className="events-listing">
      <div className="events-listing-wrapper">
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
                <Col className="filter-bar" align="left" span={24}>
                  <div>
                    <h1>
                      {event.data.totalResultsFound} Events found
                    </h1>
                  </div>
                  <div>
                    <Button
                      onClick={() => {
                        fetchEvents({});
                      }}
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

export default EventsListing;
