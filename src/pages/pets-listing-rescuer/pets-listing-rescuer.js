import React, { useEffect, useState } from "react";
import { omitBy, isNil, sortBy, trim } from "lodash";
import useQuery from "../../hooks/useQuery";
import { getPets } from "../../services/pet.services";
import useAuthContext from "../../hooks/useAuthContext";
import { calculateAge } from "../../helpers/date";

import { Row, Col, Skeleton, Card, Button, message } from "antd";
import PetCard from "../../components/petCard/petCard";

import "./pets-listing-rescuer.scss";

function PetsListingSpecificRescuer() {
  const [petState, setPetState] = useState({ status: "idle", data: null });

  useEffect(() => {
    fetchPets();
  }, []);

  const query = useQuery();
  const petID = query.get("petID");
  const type = query.get("type");
  const name = query.get("name");
  // const ageInMonths = query.get("ageInMonths");
  const rescuerID = query.get("rescuerID");
  const resultsPerPage = query.get("resultsPerPage");
  const page = query.get("page");

  const fetchPets = async () => {
    setPetState({ ...petState, status: "loading" });

    const params = omitBy(
      { petID, type, name, rescuerID, resultsPerPage, page },
      v => isNil(v) || v.toString().trim() === ''
    );

    const res = await getPets(params);

    if (res?.error) {
      message.error(res.error.description);
    } else {
      res.petsList.map((pet) => {
        const age = calculateAge(pet.birthDate)
        pet.age = age;
      });
      const data = {
        ...res,
        petsList: sortBy(res.petsList, "createdAt").reverse(),
      };
      setPetState({ ...petState, status: "success", data: data });
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

  const { accountType } = useAuthContext();

  return (
    <div className="pets-listing-rescuer">
      <div className="pets-listing-rescuer-wrapper">
        <div className="cards">
          {petState.status === "loading" && (
            <>
              <Row gutter={[30, 30]} className="loading">
                {[...Array(12).keys()].map((index) => (
                  <CardSkeleton index={index} />
                ))}
              </Row>
            </>
          )}

          {petState.status === "success" && (
            <>
              <Row>
                <Col className="title" align="left">
                  <div>
                    <h1>My Pets</h1>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col span={24} align="left">
                  <h2>Recently added</h2>
                </Col>
              </Row>

              <Row gutter={[30, 30]}>
                {petState.data.petsList.slice(0,4).map((p) => (
                  <PetCard pet={p} accountType={accountType} />
                ))}
              </Row>

              <Row>
                <Col span={24} align="left">
                  <h2>All pets</h2>
                </Col>
              </Row>

              <Row>
              <Col className="filter-bar" align="left">
                  <h4>{petState.data.totalResultsFound} pets found</h4>
                  {/* <div>
                    <Button href={`/adopt`}>All</Button>
                  </div>
                  <div>
                    <Button href={`/adopt?type=cat`}>Cats</Button>
                  </div>
                  <div>
                    <Button href={`/adopt?type=dog`}>Dogs</Button>
                  </div> */}
                </Col>
              </Row>

              <Row gutter={[30, 30]}>
                {petState.data.petsList.map((p) => (
                  <PetCard pet={p} accountType={accountType} />
                ))}
              </Row>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PetsListingSpecificRescuer;
