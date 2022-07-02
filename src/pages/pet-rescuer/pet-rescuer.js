import React from "react";
import { Row, Col, Button, Grid } from "antd";
import PetForm from "../../components/petForm/petForm";
import useQuery from "../../hooks/useQuery";

const PetRescuer = () => {
  const query = useQuery();
  const petID = query.get("petID");
  const breakpoint = Grid.useBreakpoint();

  return (
    <div className="pet-form">
      <Row align="center" style={{paddingBottom: "10px"}}>
        <Col span={breakpoint.md ? 18 : 24} align="end">
          <Button onClick={() => window.open(`/pet?petID=${petID}`)}>View as Adopter</Button>
        </Col>
      </Row>
      <PetForm editable={true} size="small" />
    </div>
  );
};

export default PetRescuer;
