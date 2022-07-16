import { Row, Col, Skeleton, Card, Button, Input, message, Grid } from "antd";

const CardSkeleton = ({index, colBig=null}) => {
  return (
    <>
      <Col xxl={colBig || 6} xl={colBig || 6} lg={colBig || 6} md={8} sm={12} xs={12}>
        <Card key={index}>
          <Skeleton avatar active />
        </Card>
      </Col>
    </>
  );
};

export default CardSkeleton;
