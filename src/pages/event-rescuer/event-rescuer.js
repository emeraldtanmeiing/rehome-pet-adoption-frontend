import React from "react";
import { Row, Col, Button, Grid } from "antd";
import EventForm from "../../components/eventForm/eventForm";
import useQuery from "../../hooks/useQuery";

const EventRescuer = () => {
  const query = useQuery();
  const eventID = query.get("eventID");
  const breakpoint = Grid.useBreakpoint();

  return (
    <div className="event-form">
      <Row align="center" style={{paddingBottom: "10px"}}>
        <Col span={breakpoint.md ? 18 : 24} align="end">
          <Button onClick={() => window.open(`/event?eventID=${eventID}`)}>View as Public</Button>
        </Col>
      </Row>
      <EventForm editable={true} size="small" eventID={eventID}/>
    </div>
  );
};

export default EventRescuer;
